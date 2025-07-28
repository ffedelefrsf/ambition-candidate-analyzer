import os
from django.http import JsonResponse
from openai import OpenAI
import pdfplumber
from django.conf import settings
from dotenv import load_dotenv
from pydantic import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from open_ai_helper.index import get_user_message, system_message
from open_ai_helper.schema import CandidateEvaluation
from candidates.models import Candidate
from .models import Career
from .serializers import CareerSerializer


# TODO: Add unit tests for these, especially the openai method, mocking that package
class CareerListView(APIView):
    def get(self, request):
        careers = Career.objects.all()
        serializer = CareerSerializer(careers, many=True)
        return Response(serializer.data)


class CareerCreateView(APIView):
    def post(self, request):
        serializer = CareerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CareerReadOrDeleteView(APIView):
    def get(self, request, pk):
        career = get_object_or_404(Career, pk=pk)
        serializer = CareerSerializer(career)
        return Response(serializer.data)

    def delete(self, request, pk):
        career = get_object_or_404(Career, pk=pk)
        career.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# TODO: This probably deserves its own app
class CareerFindCandidate(APIView):
    def get(self, request, pk):
        load_dotenv()
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        career = get_object_or_404(Career, pk=pk)
        candidates = Candidate.objects.all()
        if len(candidates) == 0:
            return JsonResponse({"error": "No candidates"}, status=500)
        candidates_array = []
        for candidate in candidates:
            resume_path = os.path.join(
                settings.MEDIA_ROOT, "resumes", candidate.resume_id
            )
            with pdfplumber.open(resume_path) as pdf:
                resume_text = ""
                for page in pdf.pages:
                    resume_text += page.extract_text() or ""
            candidate_object = {
                "name": candidate.name,
                "expected_salary_per_hour": candidate.expected_salary,
                "resume_text": resume_text,
            }
            candidates_array.append(candidate_object)

        evaluation_input = {
            "career": {
                "position": career.position,
                "description": career.description,
                "requirements": career.requirements,
                "nice_to_have": career.nice_to_have,
                "rate_range": career.rate_range,
            },
            "candidates": candidates_array,
        }
        try:
            user_message = get_user_message(evaluation_input)

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    system_message,
                    user_message,
                ],
                temperature=0.3,
            )
            response_text = response.choices[0].message.content
            try:
                cleaned_json = response_text.strip()
                if cleaned_json.startswith("```json"):
                    cleaned_json = cleaned_json.removeprefix("```json").strip()
                if cleaned_json.endswith("```"):
                    cleaned_json = cleaned_json.removesuffix("```").strip()
                result = CandidateEvaluation.model_validate_json(cleaned_json)
                print(f"Result: {result}")
                return JsonResponse(result.model_dump(), status=200)
            except ValidationError as ve:
                print("Pydantic validation failed:", ve)
                print("Raw response:", response_text)
                return JsonResponse({"error": "Something went wrong"}, status=500)
            except Exception as e:
                print("Unexpected error:", e)
                return JsonResponse({"error": "Something went wrong"}, status=500)
        except Exception as e:
            print(f"Error on model evaluation: {e}")
            return JsonResponse({"error": "Something went wrong"}, status=500)

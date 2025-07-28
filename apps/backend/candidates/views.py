import uuid
import os
from django.http import FileResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .models import Candidate
from .serializers import CandidateSerializer


# TODO: Add unit tests for these
class CandidateListView(APIView):
    def get(self, request):
        candidates = Candidate.objects.all()
        serialized = CandidateSerializer(candidates, many=True)
        data = serialized.data
        for item in data:
            item.pop("resume_id", None)
        return Response(serialized.data)


class CandidateCreateView(APIView):
    def post(self, request):
        file = request.FILES.get("resume")
        if not file:
            return Response({"error": "Resume is required"}, status=400)
        if file.size > 750 * 1024:  # 750 KB in bytes
            return Response(
                {"error": "Resume file is too large (max 750KB)"}, status=400
            )
        if file.content_type != "application/pdf":
            return Response({"error": "Only PDF files are allowed"}, status=400)

        # TODO: Replace this local storage by a Cloud Service like AWS S3, Azure/Firebase Storage
        filename = f"{uuid.uuid4().hex}{os.path.splitext(file.name)[1]}"
        path = os.path.join(settings.MEDIA_ROOT, "resumes", filename)

        candidate = CandidateSerializer(
            data={
                "name": request.data.get("name"),
                "expected_salary": request.data.get("expectedSalary"),
                "resume_id": filename,
            }
        )

        try:
            if candidate.is_valid(raise_exception=True):
                candidate.save()
                # Resume storage
                os.makedirs(os.path.dirname(path), exist_ok=True)

                with open(path, "wb") as dest:
                    for chunk in file.chunks():
                        dest.write(chunk)
                return Response(candidate.data, status=201)
        except Exception as e:
            print(f"Error while creating candidate: { e }")
            if candidate.instance is not None:
                # Ideally here a SQL transaction that won't commit until the pdf file is stored is used instead of saving and deleting from the database
                candidate.instance.delete()
            return JsonResponse({"error": "Something went wrong"}, status=500)


class CandidateDeleteView(APIView):
    def delete(self, request, pk):
        try:
            candidate = Candidate.objects.get(pk=pk)
            if candidate.resume_id:
                resume_path = os.path.join(
                    settings.MEDIA_ROOT, "resumes", candidate.resume_id
                )
                if os.path.exists(resume_path):
                    os.remove(resume_path)
            candidate.delete()
        except Candidate.DoesNotExist:
            print("Candidate does not exist")
        return Response(status=204)


class CandidateDownloadResume(APIView):
    def get(self, request, pk):
        try:
            candidate = Candidate.objects.get(pk=pk)
            if candidate.resume_id:
                resume_path = os.path.join(
                    settings.MEDIA_ROOT, "resumes", candidate.resume_id
                )
                return FileResponse(
                    open(resume_path, "rb"),
                    as_attachment=True,
                    filename=candidate.resume_id,
                )
            raise FileNotFoundError
        except Candidate.DoesNotExist:
            print("Candidate does not exist")
        except FileNotFoundError:
            print("Resume does not exist")
        return JsonResponse({"error": "Something went wrong"}, status=500)

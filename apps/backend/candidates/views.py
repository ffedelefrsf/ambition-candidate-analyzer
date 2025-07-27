from django.http import JsonResponse
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("OPENAI_API_KEY", "fallback-secret-key")


def test_endpoint(request):
    print(f"SECRET_KEY: {SECRET_KEY}")
    print("Received request with origin:", request.headers.get("Origin"))
    return JsonResponse({"message": "Backend is working!"})

from rest_framework import serializers
from .models import Candidate


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ["id", "name", "expected_salary", "resume_id", "created_at"]
        read_only_fields = ["id", "created_at"]

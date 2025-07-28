from rest_framework import serializers
from .models import Candidate


class CandidateSerializer(serializers.ModelSerializer):
    expected_salary = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Candidate
        exclude = ["created_at"]
        read_only_fields = ["id", "created_at"]

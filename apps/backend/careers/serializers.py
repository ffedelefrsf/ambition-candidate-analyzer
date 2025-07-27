from rest_framework import serializers
from .models import Career


class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = "__all__"
        read_only_fields = ["id", "created_at"]

import uuid
from django.db import models


class Career(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    requirements = models.TextField()
    nice_to_have = models.TextField(blank=True)
    rate_range = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.position

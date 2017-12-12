from django.db import models
from django.db.models import Max
from rest_framework.exceptions import ParseError
from django.utils import timezone


class Job(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=256, null=True, blank=True)

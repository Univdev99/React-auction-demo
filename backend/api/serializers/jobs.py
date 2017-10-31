from rest_framework import serializers

from job.models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('pk', 'title', 'description', 'posted_at')

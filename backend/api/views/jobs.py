import random

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from api.serializers.jobs import JobSerializer
from api.paginations import EightPerPagePagination
from job.models import Job


class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    pagination_class = EightPerPagePagination
    queryset = Job.objects.order_by('-posted_at')


class JobDetailView(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    lookup_url_kwarg = 'pk'
    queryset = Job.objects.all()

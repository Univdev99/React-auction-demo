from django.db import transaction

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from api.serializers.admin import DonorSerializer
from api.permissions import IsAdmin
from entity.models import Donor


class DonorListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorSerializer
    queryset = Donor.objects.all()


class DonorDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorSerializer
    lookup_url_kwarg = 'pk'
    queryset = Donor.objects.all()

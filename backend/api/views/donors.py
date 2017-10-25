import random

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from api.serializers.entities import DonorSerializer
from api.serializers.entities import DonorDetailSerializer
from api.paginations import EightPerPagePagination
from api.permissions import IsAdmin
from entity.models import Donor


class DonorFrontListView(generics.ListAPIView):
    serializer_class = DonorSerializer

    def get_queryset(self):
        return Donor.objects.all()[:4]


class DonorListView(generics.ListAPIView):
    serializer_class = DonorSerializer
    pagination_class = EightPerPagePagination
    queryset = Donor.objects.all()


class DonorDetailView(generics.RetrieveAPIView):
    serializer_class = DonorDetailSerializer
    lookup_url_kwarg = 'pk'
    queryset = Donor.objects.all()

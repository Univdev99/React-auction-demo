import random

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from api.filters.q import DonorQueryFilterBackend
from api.serializers.entities import DonorSerializer
from api.serializers.entities import DonorDetailWithSimilarSerializer
from api.paginations import EightPerPagePagination
from api.permissions import IsAdmin
from entity.models import Donor


class DonorFrontListView(generics.ListAPIView):
    serializer_class = DonorSerializer

    def get_queryset(self):
        return Donor.objects.order_by('id').prefetch_related('media')[:4]


class DonorListView(generics.ListAPIView):
    serializer_class = DonorSerializer
    pagination_class = EightPerPagePagination
    filter_backends = (DonorQueryFilterBackend, )
    queryset = Donor.objects.order_by('id').prefetch_related('media')


class DonorDetailView(generics.RetrieveAPIView):
    serializer_class = DonorDetailWithSimilarSerializer
    lookup_url_kwarg = 'pk'
    queryset = Donor.objects.all()

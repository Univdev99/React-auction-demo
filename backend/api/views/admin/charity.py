from django.db import transaction

from rest_framework import generics
from rest_framework import views
from rest_framework.permissions import IsAuthenticated

from api.serializers.admin import CharitySerializer
from api.permissions import IsAdmin
from api.views.admin.media import MediumUploadMixin
from entity.models import Charity


class CharityListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer
    queryset = Charity.objects.all()


class CharityDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer
    lookup_url_kwarg = 'pk'
    queryset = Charity.objects.all()


class CharityLogoUploadView(MediumUploadMixin, views.APIView):
    permission_classes = (IsAuthenticated, IsAdmin,)

    def post(self, *args, **kwargs):
        pass

import random

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.admin import CharitySerializer
from api.serializers.admin import UploadLogoSerializer
from api.permissions import IsAdmin
from entity.models import Charity
from storage.mixins import MediumUploadMixin


class CharityListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer
    queryset = Charity.objects.all()


class CharityDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer
    lookup_url_kwarg = 'pk'
    queryset = Charity.objects.all()


class CharityLogoUploadView(MediumUploadMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer
    lookup_url_kwarg = 'pk'
    tmp_file_prefix = 'charity_logo'

    def get_queryset(self):
        return Charity.objects.all().select_related('logo')

    def put(self, *args, **kwargs):
        charity = self.get_object()

        serializer = UploadLogoSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        logo_medium = self.upload_photo(
            serializer.validated_data['file'],
            'charity/logo',
            '{}_{}'.format(charity.pk, random.randint(10000000, 99999999))
        )

        with transaction.atomic():
            if charity.logo:
                self.delete_medium(charity.logo)
            charity.logo = logo_medium
            charity.save()

        serializer = self.get_serializer()
        return Response(serializer.data)

import random

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.entities import CharitySerializer
from api.serializers.storage import UploadMediumSerializer
from api.permissions import IsAdmin
from entity.models import Charity
from storage.mixins import MediumUploadMixin
from storage.mixins import MediumDeleteMixin


class CharityListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer
    queryset = Charity.objects.all()


class CharityDetailView(MediumDeleteMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer
    lookup_url_kwarg = 'pk'
    queryset = Charity.objects.all()

    @transaction.atomic
    def perform_destroy(self, instance):
        if instance.logo:
            self.delete_medium(instance.logo)
        super(CharityDetailView, self).perform_destroy(instance)


class CharityLogoUploadView(MediumUploadMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer
    lookup_url_kwarg = 'pk'
    tmp_file_prefix = 'charity_logo'

    def get_queryset(self):
        return Charity.objects.all().select_related('logo')

    def put(self, *args, **kwargs):
        charity = self.get_object()

        serializer = UploadMediumSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        self.is_mimetype_image(serializer.validated_data['file'])
        logo_medium = self.upload_medium(
            serializer.validated_data['file'],
            'charity/logo',
            '{}_{}'.format(charity.pk, random.randint(10000000, 99999999)),
            content_object=charity
        )

        try:
            if charity.logo:
                self.delete_medium(charity.logo)
        except:
            pass

        charity.logo = logo_medium
        charity.save()

        serializer = self.get_serializer(charity)
        return Response(serializer.data)

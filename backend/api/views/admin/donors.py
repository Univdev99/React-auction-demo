from abc import ABCMeta, abstractmethod
import random

from django.core.exceptions import ImproperlyConfigured
from django.db import transaction

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.entities import DonorSerializer
from api.serializers.storage import UploadImageSerializer
from api.serializers.storage import UploadVideoSerializer
from api.permissions import IsAdmin
from entity.models import Donor
from storage.mixins import MediumUploadMixin
from storage.mixins import MediumDeleteMixin


class DonorListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorSerializer
    queryset = Donor.objects.all()


class DonorDetailView(MediumDeleteMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorSerializer
    lookup_url_kwarg = 'pk'
    queryset = Donor.objects.all()

    @transaction.atomic
    def perform_destroy(self, instance):
        if instance.logo:
            self.delete_medium(instance.logo)
        if instance.video:
            self.delete_medium(instance.video)
        super(DonorDetailView, self).perform_destroy(instance)


class DonorMediaUploadView(MediumUploadMixin, generics.GenericAPIView):
    __metaclass__ = ABCMeta

    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorSerializer
    lookup_url_kwarg = 'pk'
    tmp_file_prefix = 'donor_media'

    medium_serializer_class = None    # Should be changed to UploadImageSerializer or UploadVideoSerializer
    medium_type = None   # Should be 'logo' or 'video' in derived classes (model field names for that media)

    def get_queryset(self):
        return Donor.objects.all().select_related(self.medium_type)

    def upload(self, file_obj, s3_folder, s3_filename):
        return self.upload_image(file_obj, s3_folder, s3_filename)

    def put(self, *args, **kwargs):
        if not self.medium_type:
            raise ImproperlyConfigured('Must define medium_type')
        if not self.medium_serializer_class:
            raise ImproperlyConfigured('Must define medium_serializer_class')

        donor = self.get_object()

        serializer = self.medium_serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        medium = self.upload(
            serializer.validated_data['file'],
            'donor/{}'.format(self.medium_type),
            '{}_{}'.format(donor.pk, random.randint(10000000, 99999999))
        )

        with transaction.atomic():
            old_medium = getattr(donor, self.medium_type)
            if old_medium:
                self.delete_medium(old_medium)
            setattr(donor, self.medium_type, medium)
            donor.save()

        serializer = self.get_serializer()
        return Response(serializer.data)


class DonorLogoUploadView(DonorMediaUploadView):
    medium_serializer_class = UploadImageSerializer
    medium_type = 'logo'


class DonorVideoUploadView(DonorMediaUploadView):
    medium_serializer_class = UploadVideoSerializer
    medium_type = 'video'

    def upload(self, file_obj, s3_folder, s3_filename):
        return self.upload_video(file_obj, s3_folder, s3_filename)

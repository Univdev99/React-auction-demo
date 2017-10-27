import random

from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.entities import DonorSerializer
from api.serializers.entities import DonorDetailSerializer
from api.serializers.entities import MediaReorderSerializer
from api.serializers.entities import ProductSerializer
from api.serializers.storage import MediumSerializer
from api.serializers.storage import UploadMediumSerializer
from api.permissions import IsAdmin
from entity.models import Donor
from storage.constants import VALID_VIDEO_MIMETYPES
from storage.mixins import MediumUploadMixin
from storage.mixins import MediumDeleteMixin


class DonorListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = Donor.objects.order_by('pk').prefetch_related('media')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DonorSerializer
        else:
            return DonorDetailSerializer


class DonorDetailView(MediumDeleteMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorDetailSerializer
    lookup_url_kwarg = 'pk'
    queryset = Donor.objects.all()

    @transaction.atomic
    def perform_destroy(self, instance):
        for medium in instance.media.all():
            self.delete_medium(medium)
        super(DonorDetailView, self).perform_destroy(instance)


class DonorProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        donor_pk = self.kwargs['pk']
        return get_object_or_404(Donor, pk=donor_pk).product_set \
            .select_related('donor') \
            .prefetch_related('media')


class DonorMediumUploadView(MediumUploadMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorSerializer
    lookup_url_kwarg = 'pk'
    queryset = Donor.objects.all()
    tmp_file_prefix = 'donor_media'

    def get_uploaded_file(self):
        serializer = UploadMediumSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data['file']

    def post(self, *args, **kwargs):
        file = self.get_uploaded_file()
        donor = self.get_object()

        max_record = donor.media.aggregate(Max('order'))
        order = max_record['order__max'] + 1 if max_record['order__max'] else 1

        if file.content_type in VALID_VIDEO_MIMETYPES:
            medium = self.upload_video(
                file,
                'donor/media',
                '{}_{}'.format(donor.pk, random.randint(10000000, 99999999)),
                content_object=donor,
                order=order
            )
        else:
            medium = self.upload_image(
                file,
                'donor/media',
                '{}_{}'.format(donor.pk, random.randint(10000000, 99999999)),
                content_object=donor,
                order=order
            )

        serializer = MediumSerializer(medium)
        return Response(serializer.data)


class DonorMediumDeleteView(MediumDeleteMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorSerializer
    lookup_url_kwarg = 'pk'
    queryset = Donor.objects.all()

    @transaction.atomic
    def delete(self, *args, **kwargs):
        if 'dm_pk' not in self.kwargs:
            raise status.NotFound()

        donor = self.get_object()
        dm_pk = self.kwargs['dm_pk']
        medium = get_object_or_404(donor.media, pk=dm_pk)
        self.delete_medium(medium)
        return Response(status=status.HTTP_204_NO_CONTENT)


class DonorMediaReorderView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = DonorSerializer
    lookup_url_kwarg = 'pk'
    queryset = Donor.objects.all()

    @transaction.atomic
    def post(self, *args, **kwargs):
        serializer = MediaReorderSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        donor = self.get_object()
        medium_ids = serializer.validated_data['media_order']
        order = 1
        for medium_id in medium_ids:
            donor.media.filter(pk=medium_id).update(order=order)
            order += 1

        serializer = MediumSerializer(donor.media.order_by('order'), many=True)
        return Response(serializer.data)

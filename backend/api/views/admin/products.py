import random

from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from tagging.models import Tag

from api.serializers.entities import MediaReorderSerializer
from api.serializers.entities import ProductSerializer
from api.serializers.entities import ProductDetailSerializer
from api.serializers.entities import CharitySerializer
from api.serializers.storage import MediumSerializer
from api.serializers.storage import UploadMediumSerializer
from api.permissions import IsAdmin
from entity.models import Product
from storage.constants import VALID_VIDEO_MIMETYPES
from storage.mixins import MediumUploadMixin
from storage.mixins import MediumDeleteMixin


class ProductListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = Product.objects.order_by('pk')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductSerializer
        else:
            return ProductDetailSerializer


class ProductDetailView(MediumDeleteMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductDetailSerializer
    lookup_url_kwarg = 'pk'
    queryset = Product.objects.select_related('donor')

    @transaction.atomic
    def perform_destroy(self, instance):
        for medium in instance.media.all():
            self.delete_medium(medium)
        super(ProductDetailView, self).perform_destroy(instance)


class ProductMediumUploadView(MediumUploadMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'pk'
    queryset = Product.objects.all()
    tmp_file_prefix = 'product_media'

    def get_uploaded_file(self):
        serializer = UploadMediumSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data['file']

    def post(self, *args, **kwargs):
        file = self.get_uploaded_file()
        product = self.get_object()

        max_record = product.media.aggregate(Max('order'))
        order = max_record['order__max'] + 1 if max_record['order__max'] else 1

        medium = self.upload_medium(
            file,
            'product',
            '{}_{}'.format(product.pk, random.randint(10000000, 99999999)),
            content_object=product,
            order=order
        )

        serializer = MediumSerializer(medium)
        return Response(serializer.data)


class ProductMediumDeleteView(MediumDeleteMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'pk'
    queryset = Product.objects.all()

    @transaction.atomic
    def delete(self, *args, **kwargs):
        if 'pm_pk' not in self.kwargs:
            raise status.NotFound()

        product = self.get_object()
        pm_pk = self.kwargs['pm_pk']
        medium = get_object_or_404(product.media, pk=pm_pk)
        self.delete_medium(medium)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductMediaReorderView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'pk'
    queryset = Product.objects.all()

    @transaction.atomic
    def post(self, *args, **kwargs):
        serializer = MediaReorderSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        product = self.get_object()
        medium_ids = serializer.validated_data['media_order']
        order = 1
        for medium_id in medium_ids:
            product.media.filter(pk=medium_id).update(order=order)
            order += 1

        serializer = MediumSerializer(product.media.order_by('order'), many=True)
        return Response(serializer.data)


class ProductDonorCharityListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = CharitySerializer

    def get_queryset(self):
        return Product.objects.get(pk=self.kwargs.get('pk')).donor.charities

import random

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.entities import ProductSerializer
from api.serializers.storage import UploadImageSerializer
from api.permissions import IsAdmin
from entity.models import Product
from storage.mixins import MediumUploadMixin
from storage.mixins import MediumDeleteMixin


class ProductListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    queryset = Product.objects.all().select_related('donor')


class ProductDetailView(MediumDeleteMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'pk'
    queryset = Product.objects.all()

    @transaction.atomic
    def perform_destroy(self, instance):
        product_media = instance.productmedium_set.select_related('medium')
        for pm in product_media:
            self.delete_medium(pm.medium)
            pm.delete()
        super(ProductDetailView, self).perform_destroy(instance)

from django.db import transaction

from rest_framework import serializers
from tagging.models import Tag

from api.serializers.mixins import TagnamesSerializerMixin
from api.serializers.storage import MediumSerializer
from entity.models import Charity
from entity.models import Donor
from entity.models import DonorMedium
from entity.models import Product
from entity.models import ProductMedium


class CharitySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Charity
        fields = ('pk', 'title', 'description', 'logo')
        read_only_fields = ('pk',)

    def get_logo(self, obj):
        return obj.logo.url if obj.logo else None


class DonorMediumSerializer(serializers.ModelSerializer):
    medium = MediumSerializer()

    class Meta:
        model = DonorMedium
        fields = ('pk', 'medium', 'order')


class DonorSerializer(serializers.ModelSerializer):
    """
    Serializer used in admin api for serializing Donor query set
    """
    media = serializers.SerializerMethodField()

    class Meta:
        model = Donor
        fields = ('pk', 'title', 'description', 'type', 'charity', 'media')
        read_only_fields = ('pk', 'title', 'description', 'type', 'charity', 'media')

    def get_media(self, obj):
        return DonorMediumSerializer(obj.donormedium_set.order_by('order'), many=True).data


class DonorDetailSerializer(TagnamesSerializerMixin, DonorSerializer):
    """
    Serializer used in admin api for serializing and saving Donor model object
    """
    class Meta(DonorSerializer.Meta):
        fields = DonorSerializer.Meta.fields
        read_only_fields = ('pk',)


class DonorDetailWithSimilarSerializer(serializers.ModelSerializer):
    """
    Serializer used in front api for serializing Donor model object, with data on similar donors
    """
    charity = CharitySerializer(read_only=True)
    media = serializers.SerializerMethodField()
    similar_donors = DonorSerializer(many=True, read_only=True)

    class Meta:
        model = Donor
        fields = ('pk', 'title', 'description', 'type', 'charity', 'media', 'similar_donors')
        read_only_fields = ('pk', 'title', 'description', 'type', 'charity', 'media', 'similar_donors')

    def get_media(self, obj):
        return DonorMediumSerializer(obj.donormedium_set.order_by('order'), many=True).data


class MediaReorderSerializer(serializers.Serializer):
    media_order = serializers.ListField(
        child=serializers.IntegerField(min_value=1)
    )


class ProductMediumSerializer(serializers.ModelSerializer):
    medium = MediumSerializer()

    class Meta:
        model = ProductMedium
        fields = ('pk', 'medium')


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer used in admin api for serializing Product query set
    """
    donor_details = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('pk', 'title', 'description', 'donor', 'donor_details', 'media',)
        read_only_fields = ('pk',)

    def get_donor_details(self, obj):
        return DonorSerializer(obj.donor).data

    def get_media(self, obj):
        return ProductMediumSerializer(obj.productmedium_set.all(), many=True).data


class ProductDetailSerializer(TagnamesSerializerMixin, ProductSerializer):
    """
    Serializer used in admin api for serializing and saving Product model object
    """
    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields
        read_only_fields = ('pk',)

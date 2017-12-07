from django.db import transaction

from rest_framework import serializers
from tagging.models import Tag

from api.serializers.mixins import TagnamesSerializerMixin
from api.serializers.storage import MediumSerializer
from entity.models import Charity
from entity.models import Donor
from entity.models import Product


class CharitySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Charity
        fields = ('pk', 'title', 'description', 'logo')
        read_only_fields = ('pk',)

    def get_logo(self, obj):
        return obj.logo.url if obj.logo else None


class DonorSerializer(serializers.ModelSerializer):
    """
    Serializer used in admin api for serializing Donor query set
    """
    media = serializers.SerializerMethodField()

    class Meta:
        model = Donor
        fields = ('pk', 'title', 'description', 'type', 'instagram_handle', 'website', 'charity', 'media')
        read_only_fields = ('pk', 'title', 'description', 'type', 'instagram_handle', 'website', 'charity', 'media')

    def get_media(self, obj):
        return MediumSerializer(obj.media.order_by('order'), many=True).data


class DonorWithoutMediaSerializer(serializers.ModelSerializer):
    """
    Serializer used in AuctionSerializer in nested fashion
    """
    charity = CharitySerializer(read_only=True)

    class Meta:
        model = Donor
        fields = ('pk', 'title', 'description', 'type', 'website', 'charity')
        read_only_fields = ('pk', 'title', 'description', 'type', 'website', 'charity')


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
        fields = ('pk', 'title', 'description', 'type', 'website', 'charity', 'media', 'similar_donors')
        read_only_fields = ('pk', 'title', 'description', 'type', 'website', 'charity', 'media', 'similar_donors')

    def get_media(self, obj):
        return MediumSerializer(obj.media.order_by('order'), many=True).data


class MediaReorderSerializer(serializers.Serializer):
    media_order = serializers.ListField(
        child=serializers.IntegerField(min_value=1)
    )


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer used in admin api for serializing Product query set
    """
    class Meta:
        model = Product
        fields = (
            'pk', 'title', 'description',
            'charge_tax', 'requires_shipping', 'weight_unit', 'weight', 'hs_tariff_code',
            'donor'
        )
        read_only_fields = (
            'pk', 'title', 'description',
            'charge_tax', 'requires_shipping', 'weight_unit', 'weight', 'hs_tariff_code',
            'donor'
        )


class ProductDetailSerializer(TagnamesSerializerMixin, ProductSerializer):
    """
    Serializer used in admin api for serializing and saving Product model object
    """
    donor_details = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ('donor_details', 'media')
        read_only_fields = ('pk',)

    def get_donor_details(self, obj):
        return DonorWithoutMediaSerializer(obj.donor).data

    def get_media(self, obj):
        return MediumSerializer(obj.media.all(), many=True).data

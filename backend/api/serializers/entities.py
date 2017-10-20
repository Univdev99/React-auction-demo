from rest_framework import serializers

from api.serializers.storage import MediumSerializer
from entity.models import Donor
from entity.models import Charity
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
    logo = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()

    class Meta:
        model = Donor
        fields = ('pk', 'title', 'description', 'type', 'logo', 'video', 'charity')
        read_only_fields = ('pk',)

    def get_logo(self, obj):
        return obj.logo.url if obj.logo else None

    def get_video(self, obj):
        return obj.video.url if obj.video else None


class ProductSerializer(serializers.ModelSerializer):
    donor_details = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('pk', 'title', 'description', 'donor', 'donor_details', 'media',)
        read_only_fields = ('pk',)

    def get_donor_details(self, obj):
        return DonorSerializer(obj.donor).data

    def get_media(self, obj):
        return map(
            lambda pm: MediumSerializer(pm.medium).data,
            obj.productmedium_set.select_related('medium').order_by('order')
        )

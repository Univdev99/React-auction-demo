from django.db import transaction

from rest_framework import serializers

from auction.models import Auction
from api.serializers.entities import ProductSerializer
from api.serializers.entities import ProductDetailSerializer
from api.serializers.mixins import TagnamesSerializerMixin


class AuctionSerializer(serializers.ModelSerializer):
    """
    Serializer used for AuctionListView and AuctionDetailView
    """
    product_details = serializers.SerializerMethodField()

    class Meta:
        model = Auction
        fields = (
            'pk',
            'title', 'starting_price', 'product',
            'current_price', 'status', 'started_at', 'ended_at', 'product_details'
        )
        read_only_fields = ('pk', 'current_price', 'status', 'started_at', 'ended_at', 'product_details')

    def get_product_details(self, obj):
        serializer = ProductDetailSerializer(obj.product)
        return serializer.data


class AuctionDetailWithSimilarSerializer(serializers.ModelSerializer):
    """
    Serializer used in front api for serializing Auction model object, with data on similar auctions
    """
    product = ProductSerializer(read_only=True)
    similar_auctions = AuctionSerializer(many=True, read_only=True)

    class Meta:
        model = Auction
        fields = ('pk', 'title', 'description', 'type', 'product', 'similar_auctions')
        read_only_fields = ('pk', 'title', 'description', 'type', 'product', 'similar_auctions')


class StartAuctionSerializer(serializers.Serializer):
    open_until = serializers.DateTimeField(required=False)
    duration_days = serializers.IntegerField(required=False)
    duration_minutes = serializers.IntegerField(required=False)
    duration_seconds = serializers.IntegerField(required=False)

    def validate(self, data):
        data = super(StartAuctionSerializer, self).validate(data)

        if ('open_until' not in data and
                'duration_days' not in data and
                'duration_minutes' not in data and
                'duration_seconds' not in data):
            raise serializers.ValidationError('open_until field or at least one of duration fields should be provided')

        if ('open_until' in data and
                ('duration_days' in data or 'duration_minutes' in data or 'duration_seconds' in data)):
            raise serializers.ValidationError(
                'open_until field and duration fields should not be provided at the same time'
            )

        return data

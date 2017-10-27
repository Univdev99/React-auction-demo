from django.db import transaction

from rest_framework import serializers

from auction.models import Auction
from api.serializers.entities import ProductSerializer
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
        serializer = ProductSerializer(obj.product)
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

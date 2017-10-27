from django.db import transaction

from rest_framework import serializers

from auction.models import Auction
from api.serializers.entities import ProductSerializer
from api.serializers.mixins import TagnamesSerializerMixin


class AuctionSerializer(serializers.ModelSerializer):
    """
    Serializer used for AuctionListView
    """
    product = ProductSerializer()

    class Meta:
        model = Auction
        fields = ('pk', 'title', 'starting_price', 'current_price', 'status', 'started_at', 'ended_at', 'product')
        read_only_fields = (
            'pk', 'title', 'starting_price', 'current_price', 'status', 'started_at', 'ended_at', 'product'
        )


class AuctionDetailSerializer(TagnamesSerializerMixin, serializers.ModelSerializer):
    """
    Serializer used for AuctionDetailView
    """
    class Meta:
        model = Auction
        fields = ('pk', 'title', 'starting_price', 'status', 'started_at', 'ended_at', 'product')
        read_only_fields = ('pk',)


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

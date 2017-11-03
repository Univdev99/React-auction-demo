from django.db import transaction
from django.utils import timezone

from rest_framework import serializers
from rest_framework.exceptions import ParseError

from auction.constants import AUCTION_STATUS_OPEN
from auction.constants import BID_STATUS_ACTIVE
from auction.constants import BID_STATUS_REJECTED
from auction.models import Auction
from auction.models import Bid
from auction.models import Shipment
from api.serializers.auth import UserSerializer
from api.serializers.entities import ProductSerializer
from api.serializers.entities import ProductDetailSerializer
from api.serializers.mixins import TagnamesSerializerMixin
from notification.constants import NOTIFICATION_AUCTION_NEW_BID
from notification.models import Notification


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
            'current_price', 'status', 'started_at', 'open_until', 'ended_at', 'product_details'
        )
        read_only_fields = ('pk', 'current_price', 'status', 'started_at', 'ended_at', 'product_details')

    def get_product_details(self, obj):
        serializer = ProductDetailSerializer(obj.product)
        return serializer.data


class AuctionDetailWithSimilarSerializer(serializers.ModelSerializer):
    """
    Serializer used in front api for serializing Auction model object, with data on similar auctions
    """
    product = ProductDetailSerializer(read_only=True)
    similar_auctions = AuctionSerializer(many=True, read_only=True)

    class Meta:
        model = Auction
        fields = (
            'pk', 'title', 'starting_price', 'current_price', 'status',
            'started_at', 'open_until', 'ended_at',
            'product', 'similar_auctions')
        read_only_fields = (
            'pk', 'title', 'starting_price', 'current_price', 'status',
            'started_at', 'open_until', 'ended_at',
            'product', 'similar_auctions')


class StartAuctionSerializer(serializers.Serializer):
    open_until = serializers.DateTimeField(required=False)
    duration_days = serializers.IntegerField(required=False, min_value=0)
    duration_minutes = serializers.IntegerField(required=False, min_value=0)
    duration_seconds = serializers.IntegerField(required=False, min_value=0)

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

        if 'open_until' in data and data['open_until'] <= timezone.now():
            raise serializers.ValidationError(
                'open_until field cannot be past or present datetime'
            )

        if ('open_until' not in data and
                ('duration_days' not in data or int(data['duration_days']) == 0) and
                ('duration_minutes' not in data or int(data['duration_minutes']) == 0) and
                ('duration_seconds' not in data or int(data['duration_seconds']) == 0)):
            raise serializers.ValidationError(
                'At least of one of duration fields should be larger than zero'
            )

        return data


class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ('price', 'status', 'placed_at', 'closed_at', 'user', 'auction')
        read_only_fields = ('status', 'placed_at', 'closed_at', 'user')

    def validate(self, data):
        data = super(BidSerializer, self).validate(data)
        auction = data['auction']
        price = data['price']

        if auction.status != AUCTION_STATUS_OPEN:
            raise serializers.ValidationError('Bids can be placed to open auctions only')

        if auction.open_until and auction.open_until < timezone.now():
            raise serializers.ValidationError('This auction is now waiting to close')

        if price <= auction.current_price:
            raise serializers.ValidationError('Price should be higher than current price of this auction')

        return data

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')
        auction = validated_data['auction']
        price = validated_data['price']
        placed_at = timezone.now()

        bid = Bid.objects.create(
            price=price,
            placed_at=placed_at,
            user=request.user,
            auction=auction
        )

        Notification.create_notification(
            request.user,
            auction,
            NOTIFICATION_AUCTION_NEW_BID,
            {
                'price': price,
                'placed_at': placed_at,
            }
        )

        return bid


class BidWithUserDetailSerializer(serializers.ModelSerializer):
    user_detail = serializers.SerializerMethodField()

    class Meta:
        model = Bid
        fields = ('pk', 'price', 'status', 'placed_at', 'closed_at', 'user', 'user_detail', 'auction')
        read_only_fields = ('pk', 'price', 'status', 'placed_at', 'closed_at', 'user', 'user_detail', 'auction')

    def get_user_detail(self, obj):
        return UserSerializer(obj.user).data


class BidStatusChangeSerializer(serializers.ModelSerializer):
    active = serializers.BooleanField(write_only=True)
    user_detail = serializers.SerializerMethodField()

    class Meta:
        model = Bid
        fields = ('pk', 'price', 'status', 'placed_at', 'closed_at', 'user', 'user_detail', 'auction', 'active')
        read_only_fields = ('pk', 'price', 'status', 'placed_at', 'closed_at', 'user', 'user_detail', 'auction')

    def get_user_detail(self, obj):
        return UserSerializer(obj.user).data

    def update(self, instance, validated_data):
        target_status = BID_STATUS_ACTIVE if validated_data['active'] else BID_STATUS_REJECTED

        if instance.status != BID_STATUS_ACTIVE and instance.status != BID_STATUS_REJECTED:
            raise ParseError('Invalid current status of this bid')

        if instance.status == target_status:
            raise ParseError('Invalid status change')

        instance.status = target_status
        instance.save()

        return instance


class AuctionShipProductSerializer(serializers.Serializer):
    sent_at = serializers.DateTimeField()
    tracking_number = serializers.CharField()

    @transaction.atomic
    def create(self, validated_data):
        view = self.context.get('view')
        auction = view.get_object()

        shipment = Shipment.objects.create(
            sent_at=validated_data['sent_at'],
            tracking_number=validated_data['tracking_number'],
            auction=auction,
            product=auction.product,
        )

        return shipment

from rest_framework import serializers
from rest_framework.exceptions import ParseError

from api.constants import NOTIFICATION_ENTITY_CONTENT_TYPE_AUCTION
from api.constants import NOTIFICATION_ENTITY_CONTENT_TYPE_USER
from api.serializers.auctions import AuctionSerializer
from api.serializers.auth import UserSerializer
from auction.models import Auction
from account.models import User
from notification.models import Notification
from notification.models import NotificationEntity


class NotificationEntityField(serializers.Field):
    def to_representation(self, obj):
        serializer_class = None
        content_object = obj.content_object
        if isinstance(content_object, Auction):
            serializer_class = AuctionSerializer
            content_type = NOTIFICATION_ENTITY_CONTENT_TYPE_AUCTION
        elif isinstance(content_object, User):
            serializer_class = UserSerializer
            content_type = NOTIFICATION_ENTITY_CONTENT_TYPE_USER
        else:
            raise ParseError('Unsupported model type for NotificationEntity serializer field')

        if serializer_class:
            data = serializer_class(content_object).data
            data['content_type'] = content_type
            return data
        else:
            return None


class NotificationSerializer(serializers.ModelSerializer):
    subject = NotificationEntityField()
    target = NotificationEntityField()

    class Meta:
        model = Notification
        fields = ('pk', 'subject', 'target', 'action', 'action_type', 'extra', 'created_at')
        read_only_fields = ('pk', 'subject', 'target', 'action', 'action_type', 'extra', 'created_at')

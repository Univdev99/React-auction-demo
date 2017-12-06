from rest_framework import serializers
from rest_framework.exceptions import ParseError

from api.constants import CONTENT_TYPE_AUCTION
from api.constants import CONTENT_TYPE_USER
from api.serializers.auctions import AuctionSerializer
from api.serializers.auth import UserSerializer
from auction.models import Auction
from account.models import User
from history.models import HistoryRecord
from history.models import HistoryRecordEntity


class HistoryRecordEntityField(serializers.Field):
    def to_representation(self, obj):
        serializer_class = None
        content_object = obj.content_object
        if isinstance(content_object, Auction):
            serializer_class = AuctionSerializer
            content_type = CONTENT_TYPE_AUCTION
        elif isinstance(content_object, User):
            serializer_class = UserSerializer
            content_type = CONTENT_TYPE_USER
        else:
            raise ParseError('Unsupported model type for HistoryRecordEntityField')

        if serializer_class:
            data = serializer_class(content_object).data
            data['content_type'] = content_type
            return data
        else:
            return None


class HistoryRecordSerializer(serializers.ModelSerializer):
    subject = HistoryRecordEntityField()
    target = HistoryRecordEntityField()

    class Meta:
        model = HistoryRecord
        fields = ('pk', 'subject', 'target', 'action', 'action_type', 'extra', 'created_at')
        read_only_fields = ('pk', 'subject', 'target', 'action', 'action_type', 'extra', 'created_at')

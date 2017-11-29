from django.core.serializers.json import DjangoJSONEncoder

from django.dispatch import receiver
from django.db.models.signals import post_save

from api.serializers.notifications import NotificationSerializer
from notification.channels.auctions import AuctionChannel
from notification.constants import NOTIFICATION_TYPE_AUCTION
from notification.models import Notification


@receiver(post_save, sender=Notification)
def send_notification_by_websocket(sender, instance, created, *args, **kwargs):
    if not created:
        return
    if instance.action_type == NOTIFICATION_TYPE_AUCTION:
        data = NotificationSerializer(instance).data
        encoder = DjangoJSONEncoder()
        AuctionChannel.send(encoder.encode(data))

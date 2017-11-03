from django.core.serializers.json import DjangoJSONEncoder

from django.dispatch import receiver
from django.db.models.signals import post_save

from notification.channels.auctions import AuctionChannel
from notification.constants import NOTIFICATION_TYPE_AUCTION
from notification.models import Notification


@receiver(post_save, sender=Notification)
def send_notification_by_websocket(sender, instance, created, *args, **kwargs):
    if not created:
        return
    if instance.action_type == NOTIFICATION_TYPE_AUCTION:
        data = {
            'action_type': NOTIFICATION_TYPE_AUCTION,
            'action': instance.action,
            'target_type': instance.target.content_type.model,
            'target_id': instance.target.object_id,
        }
        if instance.subject:
            data['subject_type'] = instance.subject.content_type.model
            data['subject_id'] = instance.subject.object_id
        if instance.extra:
            data['extra'] = instance.extra

        encoder = DjangoJSONEncoder()
        AuctionChannel.send(encoder.encode(data))

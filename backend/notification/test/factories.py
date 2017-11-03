import factory

from account.test.factories import UserFactory
from auction.constants import AUCTION_STATUS_PREVIEW
from notification.constants import NOTIFICATION_TYPE_AUCTION
from notification.models import Notification
from notification.models import NotificationEntity


class NotificationEntityFactory(factory.DjangoModelFactory):
    class Meta:
        model = NotificationEntity

    content_object = factory.SubFactory(UserFactory)


class NotificationFactory(factory.DjangoModelFactory):
    class Meta:
        model = Notification

    subject = None
    target = factory.SubFactory(NotificationEntityFactory)
    action = NOTIFICATION_TYPE_AUCTION
    extra = None

from unittest.mock import patch

from common.test import TestCase
from notification.models import Notification
from notification.signals import send_notification_by_websocket
from notification.test.factories import NotificationFactory


class NotificationSignalsTests(TestCase):
    def setUp(self):
        self.notification = NotificationFactory.create()

    @patch('notification.signals.AuctionChannel.send')
    def test_send_notification_by_websocket(self, mock_send):
        send_notification_by_websocket(Notification, self.notification, True)
        self.assertTrue(mock_send.called)

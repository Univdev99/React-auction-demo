from datetime import datetime
from datetime import timedelta
from unittest.mock import patch

from django.utils import timezone

from common.test import APISerializerTestCase
from api.serializers.auctions import StartAuctionSerializer
from api.serializers.auctions import BidSerializer
from account.test.factories import UserFactory
from auction.constants import AUCTION_STATUS_OPEN
from auction.test.factories import AuctionFactory


@patch('django.utils.timezone.now', return_value=timezone.make_aware(datetime(2017, 11, 1)))
class StartAuctionSerializerTests(APISerializerTestCase):
    serializer_class = StartAuctionSerializer

    def test_validation_succeeds_with_open_until(self, mock_now):
        data = {
            'open_until': timezone.now() + timedelta(days=3)
        }
        serializer = self.get_serializer(data=data)
        self.assertValid(serializer)

    def test_validation_succeeds_with_duration(self, mock_now):
        data = {
            'duration_days': 2,
            'duration_minutes': 0,
            'duration_minutes': 0,
        }
        serializer = self.get_serializer(data=data)
        self.assertValid(serializer)

    def test_validation_fails_with_both_fields(self, mock_now):
        data = {
            'open_until': timezone.now() + timedelta(days=3),
            'duration_days': 2,
            'duration_minutes': 0,
            'duration_minutes': 0,
        }
        serializer = self.get_serializer(data=data)
        self.assertInvalid(serializer)

    def test_validation_fails_with_zero_duration(self, mock_now):
        data = {
            'duration_days': 0,
            'duration_minutes': 0,
            'duration_minutes': 0,
        }
        serializer = self.get_serializer(data=data)
        self.assertInvalid(serializer)


@patch('django.utils.timezone.now', return_value=timezone.make_aware(datetime(2017, 11, 1)))
class BidSerializerTests(APISerializerTestCase):
    serializer_class = BidSerializer

    def setUp(self):
        super(BidSerializerTests, self).setUp()
        self.user = UserFactory.create()
        self.auction = AuctionFactory.create(open_until=timezone.now() + timedelta(days=3))
        self.auction.start()

    def get_data(self):
        return {
            'price': self.auction.current_price + 100,
            'auction': self.auction.pk,
        }

    def test_place_bid_successes(self, mock_now):
        serializer = self.get_serializer(data=self.get_data())
        self.assertValid(serializer)

        bid = serializer.create(serializer.validated_data)
        self.assertIsNotNone(bid)

    def test_lower_bid_fails(self, mock_now):
        data = self.get_data()
        data['price'] = self.auction.current_price - 100

        serializer = self.get_serializer(data=data)
        self.assertInvalid(serializer)

    def test_bid_on_cancelled_auction_fails(self, mock_now):
        self.auction.cancel()

        serializer = self.get_serializer(data=self.get_data())
        self.assertInvalid(serializer)

    @patch('auction.models.Auction._do_finishing_process')
    def test_bid_on_finished_auction_fails(self, mock_finish, mock_now):
        self.auction.finish()

        serializer = self.get_serializer(data=self.get_data())
        self.assertInvalid(serializer)

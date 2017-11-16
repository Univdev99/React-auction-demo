from datetime import datetime
from datetime import timedelta
from unittest.mock import patch

from django.utils import timezone

from common.test import SerializerTestCase
from api.serializers.auctions import AuctionAdminSerializer
from api.serializers.auctions import StartAuctionSerializer
from api.serializers.auctions import BidSerializer
from account.test.factories import UserFactory
from auction.constants import AUCTION_STATUS_OPEN
from auction.constants import AUCTION_STATUS_WAITING_FOR_PAYMENT
from auction.constants import AUCTION_STATUS_WAITING_TO_SHIP
from auction.constants import AUCTION_STATUS_FINISHED
from auction.models import Auction
from auction.test.factories import AuctionFactory
from auction.test.factories import BidFactory


class AuctionAdminSerializerTests(SerializerTestCase):
    serializer_class = AuctionAdminSerializer

    def setUp(self):
        super(AuctionAdminSerializerTests, self).setUp()

        self.auction = AuctionFactory.create()
        self.bids = [
            BidFactory.create(auction=self.auction),
            BidFactory.create(auction=self.auction),
        ]
        self.auction2 = AuctionFactory.create()

    def test_get_single(self):
        serializer = self.get_serializer(self.auction)
        self.assertIn('pk', serializer.data)

    def test_get_list(self):
        auction_queryset = Auction.objects.all()
        serializer = self.get_serializer(auction_queryset, many=True)
        self.assertEqual(len(serializer.data), 2)


@patch('django.utils.timezone.now', return_value=timezone.make_aware(datetime(2017, 11, 1)))
class StartAuctionSerializerTests(SerializerTestCase):
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
class BidSerializerTests(SerializerTestCase):
    serializer_class = BidSerializer

    def setUp(self):
        super(BidSerializerTests, self).setUp()
        self.user = UserFactory.create()
        self.auction = AuctionFactory.create()
        open_until = timezone.now() + timedelta(days=3)
        self.auction.start(open_until)

    def get_data(self):
        return {
            'price': self.auction.current_price + 100,
        }

    def get_context(self):
        class MockView():
            def get_object(s):
                return self.auction

        view = MockView()

        return {
            'view': view,
        }

    def test_place_bid_successes(self, mock_now):
        serializer = self.get_serializer(data=self.get_data(), context=self.get_context())
        self.assertValid(serializer)

        bid = serializer.create(serializer.validated_data)
        self.assertIsNotNone(bid)

    def test_lower_bid_fails(self, mock_now):
        data = self.get_data()
        data['price'] = self.auction.current_price - 100

        serializer = self.get_serializer(data=data, context=self.get_context())
        self.assertInvalid(serializer)

    def test_bid_on_cancelled_auction_fails(self, mock_now):
        self.auction.cancel()

        serializer = self.get_serializer(data=self.get_data(), context=self.get_context())
        self.assertInvalid(serializer)

    def test_bid_on_finished_auction_fails(self, mock_now):
        self.auction.status = AUCTION_STATUS_FINISHED
        self.auction.save()

        serializer = self.get_serializer(data=self.get_data(), context=self.get_context())
        self.assertInvalid(serializer)

import json
from unittest.mock import MagicMock, patch
from datetime import timedelta

from django.urls import reverse
from django.utils import timezone

from rest_framework import status

from api.serializers.auctions import AuctionSerializer
from auction.constants import AUCTION_STATUS_PREVIEW
from auction.constants import AUCTION_STATUS_OPEN
from auction.constants import AUCTION_STATUS_WAITING_FOR_PAYMENT
from auction.constants import AUCTION_STATUS_CANCELLED
from auction.constants import BID_STATUS_ACTIVE
from auction.constants import BID_STATUS_REJECTED
from auction.models import Auction
from auction.test.factories import AuctionFactory
from auction.test.factories import BidFactory
from common.test import AdminAPITestCase


class AuctionDetailViewTests(AdminAPITestCase):
    def setUp(self):
        super(AuctionDetailViewTests, self).setUp()
        self.auction = AuctionFactory.create()
        self.product = self.auction.product

    def test_delete_auction(self):
        response = self.client.delete(
            reverse('api:admin:auction-detail', kwargs=dict(pk=self.auction.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.product.refresh_from_db()
        self.assertNotEqual(self.product.pk, None)


class AuctionStatusChangeTestMixin(object):
    def _get_posting_data(self):
        return {}

    def _test_response_data(self, response):
        data = json.loads(response.content)
        self.assertIn('pk', data)
        self.assertEqual(data['pk'], self.auction.pk)
        self.assertEqual(data['status'], self.after_status)

    def _test_should_change_status(self):
        response = self.client.post(
            reverse(self.api_url_name, kwargs=dict(pk=self.auction.pk)),
            self._get_posting_data()
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        self._test_response_data(response)

        self.auction.refresh_from_db()
        self.assertEqual(self.auction.status, self.after_status)

    def _test_should_not_change_from_this_status(self, current_status):
        self.auction.status = current_status
        self.auction.save()

        response = self.client.post(
            reverse(self.api_url_name, kwargs=dict(pk=self.auction.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.auction.refresh_from_db()
        self.assertEqual(self.auction.status, current_status)


class AuctionStartViewTests(AuctionStatusChangeTestMixin, AdminAPITestCase):
    def setUp(self):
        super(AuctionStartViewTests, self).setUp()
        self.auction = AuctionFactory.create()
        self.api_url_name = 'api:admin:auction-start'
        self.after_status = AUCTION_STATUS_OPEN

    def _get_posting_data(self):
        return {
            'open_until': timezone.now() + timedelta(days=3)
        }

    def test_start_auction(self):
        self._test_should_change_status()
        self.assertNotEqual(self.auction.started_at, None)

    def test_should_not_start_from_open_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_OPEN)

    def test_should_not_start_from_finished_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_WAITING_FOR_PAYMENT)

    def test_should_not_start_from_cancelled_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_CANCELLED)


class AuctionFinishViewTests(AuctionStatusChangeTestMixin, AdminAPITestCase):
    def setUp(self):
        super(AuctionFinishViewTests, self).setUp()
        self.auction = AuctionFactory.create(status=AUCTION_STATUS_OPEN)
        self.api_url_name = 'api:admin:auction-finish'
        self.after_status = AUCTION_STATUS_WAITING_FOR_PAYMENT

    def test_should_not_finish_from_preview_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_PREVIEW)

    def test_should_not_finish_from_finished_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_WAITING_FOR_PAYMENT)

    def test_should_not_finish_from_cancelled_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_CANCELLED)


class AuctionCancelViewTests(AuctionStatusChangeTestMixin, AdminAPITestCase):
    def setUp(self):
        super(AuctionCancelViewTests, self).setUp()
        self.auction = AuctionFactory.create(status=AUCTION_STATUS_OPEN)
        self.api_url_name = 'api:admin:auction-cancel'
        self.after_status = AUCTION_STATUS_CANCELLED

    def test_cancel_auction(self):
        self._test_should_change_status()
        self.assertNotEqual(self.auction.ended_at, None)

    def test_should_not_cancel_from_preview_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_PREVIEW)

    def test_should_not_cancel_from_cancelled_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_CANCELLED)


class AuctionBidStatusChangeViewTests(AdminAPITestCase):
    def setUp(self):
        super(AuctionBidStatusChangeViewTests, self).setUp()
        self.bid = BidFactory.create()
        self.auction = self.bid.auction

    def test_reject_bid(self):
        response = self.client.put(
            reverse('api:admin:auction-bid-status-change', kwargs=dict(
                pk=self.auction.pk,
                bid_pk=self.bid.pk,
            )),
            dict(active=False),
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        data = json.loads(response.content)
        self.assertEqual(data['status'], BID_STATUS_REJECTED)

        self.bid.refresh_from_db()
        self.assertEqual(self.bid.status, BID_STATUS_REJECTED)

    def test_activate_bid(self):
        self.bid.status = BID_STATUS_REJECTED
        self.bid.save()

        response = self.client.put(
            reverse('api:admin:auction-bid-status-change', kwargs=dict(
                pk=self.auction.pk,
                bid_pk=self.bid.pk,
            )),
            dict(active=True),
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        data = json.loads(response.content)
        self.assertEqual(data['status'], BID_STATUS_ACTIVE)

        self.bid.refresh_from_db()
        self.assertEqual(self.bid.status, BID_STATUS_ACTIVE)

import json
from unittest.mock import MagicMock, patch

from common.test import AdminAPITestCase
from django.urls import reverse

from rest_framework import status

from api.serializers.auctions import AuctionSerializer
from auction.constants import AUCTION_STATUS_PREVIEW
from auction.constants import AUCTION_STATUS_OPEN
from auction.constants import AUCTION_STATUS_FINISHED
from auction.constants import AUCTION_STATUS_CANCELLED
from auction.models import Auction
from auction.test.factories import ProductFactory
from auction.test.factories import AuctionFactory


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
    def _test_response_data(self, response):
        data = json.loads(response.content)
        self.assertIn('pk', data)
        self.assertEqual(data['pk'], self.auction.pk)
        self.assertEqual(data['status'], self.after_status)

    def _test_should_change_status(self):
        response = self.client.post(
            reverse(self.api_url_name, kwargs=dict(pk=self.auction.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
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

    def test_start_auction(self):
        self._test_should_change_status()
        self.assertNotEqual(self.auction.started_at, None)

    def test_should_not_start_from_open_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_OPEN)

    def test_should_not_start_from_finished_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_FINISHED)

    def test_should_not_start_from_cancelled_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_CANCELLED)


class AuctionFinishViewTests(AuctionStatusChangeTestMixin, AdminAPITestCase):
    def setUp(self):
        super(AuctionFinishViewTests, self).setUp()
        self.auction = AuctionFactory.create(status=AUCTION_STATUS_OPEN)
        self.api_url_name = 'api:admin:auction-finish'
        self.after_status = AUCTION_STATUS_FINISHED

    @patch('auction.models.Auction._do_finishing_process')
    def test_finish_auction(self, mock):
        self._test_should_change_status()
        self.assertNotEqual(self.auction.ended_at, None)

    def test_should_not_start_from_preview_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_PREVIEW)

    def test_should_not_start_from_finished_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_FINISHED)

    def test_should_not_start_from_cancelled_status(self):
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

    def test_should_not_start_from_preview_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_PREVIEW)

    def test_should_not_start_from_finished_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_FINISHED)

    def test_should_not_start_from_cancelled_status(self):
        self._test_should_not_change_from_this_status(AUCTION_STATUS_CANCELLED)

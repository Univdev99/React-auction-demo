from datetime import timedelta
from unittest.mock import patch
from unittest.mock import MagicMock

from django.utils import timezone

from common.test import TestCase
from account.test.factories import UserFactory
from auction.constants import AUCTION_STATUS_OPEN
from auction.constants import AUCTION_STATUS_CANCELLED
from auction.constants import AUCTION_STATUS_CANCELLED_DUE_TO_NO_BIDS
from auction.constants import AUCTION_STATUS_WAITING_FOR_PAYMENT
from auction.constants import AUCTION_STATUS_WAITING_TO_SHIP
from auction.constants import BID_STATUS_WON
from auction.constants import BID_STATUS_LOST
from auction.constants import BID_STATUS_REJECTED
from auction.constants import BID_STATUS_CANCELLED
from auction.constants import SALE_STATUS_WAITING_FOR_PAYMENT
from auction.constants import SALE_STATUS_RECEIVED_PAYMENT
from auction.constants import SALE_STATUS_CANCELLED
from auction.models import Auction
from auction.test.factories import AuctionFactory
from auction.test.factories import BidFactory
from auction.test.factories import CustomerFactory


class MockChargeMixin(object):
    def create_mock_charge(self):
        charge = MagicMock()
        charge.paid = True
        charge.stripe_id = 'ch_0123456789'
        return charge


class StartAuctionTests(TestCase):
    def setUp(self):
        super(StartAuctionTests, self).setUp()

        self.auction = AuctionFactory.create()
        self.user = UserFactory.create()

    def test_start_auction(self):
        open_until = timezone.now() + timedelta(days=3)
        self.auction.start(open_until)
        self.assertEqual(self.auction.status, AUCTION_STATUS_OPEN)
        self.assertEqual(self.auction.open_until, open_until)


class FinishAuctionTests(MockChargeMixin, TestCase):
    def setUp(self):
        super(FinishAuctionTests, self).setUp()

        self.auction = AuctionFactory.create(status=AUCTION_STATUS_OPEN)
        self.user1 = UserFactory.create()
        self.customer1 = CustomerFactory.create(user=self.user1)
        self.user2 = UserFactory.create()
        self.customer2 = CustomerFactory.create(user=self.user2)
        self.bid1 = BidFactory.create(
            auction=self.auction,
            user=self.user1,
            price=12000
        )
        self.bid2 = BidFactory.create(
            auction=self.auction,
            user=self.user2,
            price=13000
        )

    @patch('pinax.stripe.actions.charges.create')
    def test_finish_auction_and_payment_successful(self, mock_charge_create):
        mock_charge_create.return_value = self.create_mock_charge()

        self.auction.finish()

        self.assertEqual(self.auction.status, AUCTION_STATUS_WAITING_TO_SHIP)
        self.assertEqual(self.auction.sale.price, 13000)
        self.assertEqual(self.auction.sale.status, SALE_STATUS_RECEIVED_PAYMENT)
        self.assertIsNot(self.auction.sale.payment_received, None)

        self.bid1.refresh_from_db()
        self.assertEqual(self.bid1.status, BID_STATUS_LOST)
        self.bid2.refresh_from_db()
        self.assertEqual(self.bid2.status, BID_STATUS_WON)

        self.assertTrue(mock_charge_create.called)
        self.assertEqual(mock_charge_create.call_args[1]['amount'], 13000)

    @patch('pinax.stripe.actions.charges.create')
    def test_finish_auction_and_payment_unsuccessful(self, mock_charge_create):
        mock_charge = self.create_mock_charge()
        mock_charge.paid = False
        mock_charge_create.return_value = mock_charge

        self.auction.finish()

        self.assertEqual(self.auction.status, AUCTION_STATUS_WAITING_FOR_PAYMENT)
        self.assertEqual(self.auction.sale.price, 13000)
        self.assertEqual(self.auction.sale.status, SALE_STATUS_WAITING_FOR_PAYMENT)
        self.assertIs(self.auction.sale.payment_received, None)

        self.assertTrue(mock_charge_create.called)
        self.assertEqual(mock_charge_create.call_args[1]['amount'], 13000)

    def test_finish_auction_cancels_due_to_no_bids(self):
        self.bid1.status = BID_STATUS_REJECTED
        self.bid1.save()
        self.bid2.delete()

        self.auction.finish()

        self.assertEqual(self.auction.status, AUCTION_STATUS_CANCELLED_DUE_TO_NO_BIDS)

    @patch('pinax.stripe.managers.ChargeManager.get')
    @patch('pinax.stripe.actions.charges.create')
    @patch('pinax.stripe.actions.refunds.create')
    def test_cancel_and_refund_auction(self, mock_refund_create, mock_charge_create, mock_charge_get):
        mock_charge = self.create_mock_charge()
        mock_charge_create.return_value = mock_charge
        mock_charge_get.return_value = mock_charge

        self.auction.finish()
        self.auction.cancel()

        self.assertEqual(self.auction.status, AUCTION_STATUS_CANCELLED)
        self.assertEqual(self.auction.sale.status, SALE_STATUS_CANCELLED)

        self.bid1.refresh_from_db()
        self.assertEqual(self.bid1.status, BID_STATUS_CANCELLED)
        self.bid2.refresh_from_db()
        self.assertEqual(self.bid2.status, BID_STATUS_CANCELLED)

        self.assertTrue(mock_refund_create.called)
        self.assertEqual(mock_refund_create.call_args[0][0], mock_charge)

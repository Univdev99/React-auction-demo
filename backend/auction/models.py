from decimal import Decimal

from django.conf import settings
from django.db import models
from django.db import transaction
from django.db.models import Max, Min, Q
from django.db.models.functions import Greatest
from django.utils import timezone
from rest_framework.exceptions import ParseError
from pinax.stripe.actions import charges
from pinax.stripe.actions import refunds
from pinax.stripe.models import Charge

from auction.constants import AUCTION_STATUS_CHOICES
from auction.constants import AUCTION_STATUS_PREVIEW
from auction.constants import AUCTION_STATUS_OPEN
from auction.constants import AUCTION_STATUS_WAITING_FOR_PAYMENT
from auction.constants import AUCTION_STATUS_WAITING_TO_SHIP
from auction.constants import AUCTION_STATUS_FINISHED
from auction.constants import AUCTION_STATUS_CANCELLED
from auction.constants import AUCTION_STATUS_CANCELLED_DUE_TO_NO_BIDS
from auction.constants import BID_STATUS_CHOICES
from auction.constants import BID_STATUS_ACTIVE
from auction.constants import BID_STATUS_WON
from auction.constants import BID_STATUS_LOST
from auction.constants import BID_STATUS_REJECTED
from auction.constants import BID_STATUS_CANCELLED
from auction.constants import SALE_STATUS_CHOICES
from auction.constants import SALE_STATUS_WAITING_FOR_PAYMENT
from auction.constants import SALE_STATUS_RECEIVED_PAYMENT
from auction.constants import SALE_STATUS_CANCELLED
from common.exceptions import PaymentRequired
from entity.models import Product
from history.constants import HISTORY_RECORD_AUCTION_START
from history.constants import HISTORY_RECORD_AUCTION_FINISH
from history.constants import HISTORY_RECORD_AUCTION_CANCEL
from history.constants import HISTORY_RECORD_AUCTION_PAYMENT
from history.models import HistoryRecord
from notification.constants import NOTIFICATION_AUCTION_CLOSE
from notification.constants import NOTIFICATION_AUCTION_NEW
from notification.models import Notification


class AuctionQuerySet(models.QuerySet):
    def with_bid_price(self):
        return self.annotate(bid_price=Greatest('starting_price', Max('bid__price')))


class AuctionManager(models.Manager):
    def get_queryset(self):
        return AuctionQuerySet(self.model, using=self._db)


class Auction(models.Model):
    title = models.CharField(max_length=300)
    starting_price = models.FloatField()
    status = models.CharField(
        choices=AUCTION_STATUS_CHOICES,
        default=AUCTION_STATUS_PREVIEW,
        max_length=50,
    )
    started_at = models.DateTimeField(null=True, blank=True, default=None)
    open_until = models.DateTimeField(null=True, blank=True, default=None)
    ended_at = models.DateTimeField(null=True, blank=True, default=None)

    product = models.OneToOneField(Product, on_delete=models.CASCADE)

    objects = AuctionManager() 

    def __str__(self):
        return 'Auction on {}'.format(self.product.title)

    @property
    def current_price(self):
        result = self.get_active_bid_queryset().aggregate(max_price=Max('price'))
        return result['max_price'] if result['max_price'] else self.starting_price

    @property
    def similar_auctions(self):
        return self.get_similar_auctions(4)

    @property
    def tagnames(self):
        return [tag.name for tag in self.tags]

    @property
    def donor_auctions(self):
        return self.get_donor_auctions(4)

    @property
    def max_bid(self):
        return self.current_price

    @property
    def min_bid(self):
        result = self.get_active_bid_queryset().aggregate(min_price=Min('price'))
        return result['min_price'] if result['min_price'] else 0

    @property
    def highest_bid(self):
        return self.get_active_bid_queryset() \
            .filter(price=self.max_bid) \
            .select_related('user') \
            .first()

    @property
    def time_remaining(self):
        if self.status == AUCTION_STATUS_OPEN:
            return (self.open_until - self.started_at).total_seconds()
        else:
            return 0

    @property
    def number_of_bids(self):
        return self.bid_set.count()

    def get_active_bid_queryset(self):
        return self.bid_set.filter(status=BID_STATUS_ACTIVE)

    def get_unrejected_bid_queryset(self):
        return self.bid_set.exclude(status=BID_STATUS_REJECTED)

    def get_similar_auctions(self, count):
        product = self.product
        similar_products = self.product.get_similar_products(count, auction__isnull=False)
        return [product.auction for product in similar_products]

    def get_donor_auctions(self, count):
        return Auction.objects.filter(product__donor=self.product.donor).exclude(pk=self.pk)[:count]

    def _do_finishing_process(self):
        bid_queryset = self.get_active_bid_queryset()
        if bid_queryset.count() == 0:
            self.status = AUCTION_STATUS_CANCELLED_DUE_TO_NO_BIDS
            self.save()
            return

        highest_bid = bid_queryset.get(price=self.current_price)
        highest_bid.status = BID_STATUS_WON
        highest_bid.save()

        bid_queryset.exclude(price=highest_bid.price).update(status=BID_STATUS_LOST)

        try:
            charge = charges.create(
                amount=Decimal(highest_bid.price),
                customer=highest_bid.user.customer.stripe_id,
            )
        except:
            raise PaymentRequired

        if not charge.paid:
            """
            This will make logic below to set status to `waiting for payment` unneeded
            """
            raise PaymentRequired

        sale = Sale(
            price=highest_bid.price,
            status=SALE_STATUS_WAITING_FOR_PAYMENT,
            auction=self,
            product=self.product,
            user=highest_bid.user,
            stripe_charge_id=charge.stripe_id,
        )
        if charge.paid:
            sale.status = SALE_STATUS_RECEIVED_PAYMENT
            sale.payment_received = timezone.now()
        sale.save()

        if charge.paid:
            self.status = AUCTION_STATUS_WAITING_TO_SHIP

            HistoryRecord.objects.create_history_record(self, None, HISTORY_RECORD_AUCTION_PAYMENT, {'amount': highest_bid.price})
        else:
            self.status = AUCTION_STATUS_WAITING_FOR_PAYMENT
        self.ended_at = timezone.now()
        self.save()

        try:
            HistoryRecord.objects.create_history_record(self, None, HISTORY_RECORD_AUCTION_FINISH)

            Notification.objects.create_notification(
                None,
                self,
                NOTIFICATION_AUCTION_CLOSE,
                {
                    'winner_user_id': highest_bid.user.pk,
                }
            )
        except:
            pass

        return charge.paid

    def start(self, open_until):
        if self.status != AUCTION_STATUS_PREVIEW:
            raise ParseError('Only auctions in preview status can be started')

        self.status = AUCTION_STATUS_OPEN
        self.started_at = timezone.now()
        self.open_until = open_until
        self.save()

        HistoryRecord.objects.create_history_record(self, None, HISTORY_RECORD_AUCTION_START)

        Notification.objects.create_notification(
            None,
            self,
            NOTIFICATION_AUCTION_NEW,
        )

    @transaction.atomic
    def finish(self):
        if self.status != AUCTION_STATUS_OPEN:
            raise ParseError('Only open auctions can be finished')

        self._do_finishing_process()

    @transaction.atomic
    def cancel(self):
        if self.status not in (
            AUCTION_STATUS_OPEN,
            AUCTION_STATUS_WAITING_TO_SHIP,
            AUCTION_STATUS_WAITING_FOR_PAYMENT
        ):
            raise ParseError('Only auctions in progress can be cancelled')

        self.status = AUCTION_STATUS_CANCELLED
        self.ended_at = timezone.now()
        self.save()

        self.get_unrejected_bid_queryset().update(status=BID_STATUS_CANCELLED)

        try:
            self.sale.status = SALE_STATUS_CANCELLED
            self.sale.save()
        except:
            pass

        try:
            charge = self.sale.charge
            if charge and charge.paid:
                refunds.create(charge)
        except Sale.DoesNotExist:
            pass

        HistoryRecord.objects.create_history_record(self, None, HISTORY_RECORD_AUCTION_CANCEL)


class Bid(models.Model):
    price = models.FloatField()
    status = models.CharField(
        choices=BID_STATUS_CHOICES,
        default=BID_STATUS_ACTIVE,
        max_length=50,
    )
    placed_at = models.DateTimeField()
    closed_at = models.DateTimeField(null=True, blank=True, default=None)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE)

    def __str__(self):
        return 'Bid by {} on {}'.format(self.user.email, str(self.auction))


class Sale(models.Model):
    payment_received = models.DateTimeField(null=True, blank=True, default=None)
    item_sent = models.DateTimeField(null=True, blank=True, default=None)
    tracking_number = models.CharField(max_length=100, default='')
    status = models.CharField(
        max_length=50,
        choices=SALE_STATUS_CHOICES,
        default=SALE_STATUS_WAITING_FOR_PAYMENT
    )
    cheque_sent_at = models.DateTimeField(null=True, blank=True, default=None)
    receipt_received_at = models.DateTimeField(null=True, blank=True, default=None)
    note = models.TextField(default='')
    price = models.FloatField()
    stripe_charge_id = models.CharField(max_length=100)

    auction = models.OneToOneField(Auction, null=True, blank=True, on_delete=models.SET_NULL)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return 'Sale {}'.format(self.tracking_number)

    @property
    def charge(self):
        try:
            return Charge.objects.get(stripe_id=self.stripe_charge_id)
        except Charge.DoesNotExist:
            return None

    @property
    def charity(self):
        return self.product.donor.charity

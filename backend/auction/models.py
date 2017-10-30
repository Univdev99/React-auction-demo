from django.conf import settings
from django.db import models
from django.db.models import Max
from rest_framework.exceptions import ParseError
from django.utils import timezone

from auction.constants import AUCTION_STATUS_CHOICES
from auction.constants import AUCTION_STATUS_PREVIEW
from auction.constants import AUCTION_STATUS_OPEN
from auction.constants import AUCTION_STATUS_FINISHED
from auction.constants import AUCTION_STATUS_CANCELLED
from auction.constants import BID_STATUS_CHOICES
from auction.constants import BID_STATUS_ACTIVE
from entity.models import Product


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

    def __str__(self):
        return 'Auction on {}'.format(self.product.title)

    @property
    def current_price(self):
        result = Bid.objects.aggregate(max_price=Max('price'))
        return result['max_price'] if result['max_price'] else self.starting_price

    @property
    def similar_auctions(self):
        return self.get_similar_auctions(4)

    @property
    def tagnames(self):
        return [tag.name for tag in self.tags]

    def get_similar_auctions(self, count):
        product = self.product
        similar_products = self.product.get_similar_products(count)
        return [product.auction for product in similar_products]

    def _do_finishing_process(self):
        raise NotImplementedError('Auction finishing process not implemented yet')

    def start(self):
        if self.status != AUCTION_STATUS_PREVIEW:
            raise ParseError('Only auctions in preview status can be started')

        self.status = AUCTION_STATUS_OPEN
        self.started_at = timezone.now()
        self.save()

    def finish(self):
        if self.status != AUCTION_STATUS_OPEN:
            raise ParseError('Only open auctions can be finished')

        self._do_finishing_process()

        self.status = AUCTION_STATUS_FINISHED
        self.ended_at = timezone.now()
        self.save()

    def cancel(self):
        if self.status != AUCTION_STATUS_OPEN:
            raise ParseError('Only open auctions can be cancelled')

        self.status = AUCTION_STATUS_CANCELLED
        self.ended_at = timezone.now()
        self.save()


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
        return 'Bid by {} on {}'.format(self.user.username, str(self.auction))

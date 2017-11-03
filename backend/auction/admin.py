from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe

from auction.models import Auction
from auction.models import Bid


class AuctionAdmin(admin.ModelAdmin):
    model = Auction

    list_display = (
        'title',
        'get_product',
        'status',
        'starting_price',
        'current_price',
        'started_at',
        'ended_at',
    )

    def get_queryset(self, request):
        return super(AuctionAdmin, self).get_queryset(request).select_related(
            'product'
        )

    def get_product(self, obj):
        return mark_safe('<a href="{}">{}</a>'.format(
            reverse('admin:entity_product_change', args=[obj.product.pk]),
            obj.product.title,
        ))
    get_product.short_description = "Product"

admin.site.register(Auction, AuctionAdmin)


class BidAdmin(admin.ModelAdmin):
    model = Bid

    list_display = (
        'get_bid',
        'get_auction',
        'get_product',
        'price',
        'placed_at',
        'closed_at',
        'status',
    )

    def get_queryset(self, request):
        return super(BidAdmin, self).get_queryset(request) \
            .select_related('user') \
            .select_related('auction') \
            .select_related('auction__product')

    def get_bid(self, obj):
        return str(obj)
    get_bid.short_description = "Bid"

    def get_auction(self, obj):
        return mark_safe('<a href="{}">{}</a>'.format(
            reverse('admin:auction_auction_change', args=[obj.auction.pk]),
            obj.auction.title,
        ))
    get_auction.short_description = "Auction"

    def get_product(self, obj):
        return mark_safe('<a href="{}">{}</a>'.format(
            reverse('admin:entity_product_change', args=[obj.auction.product.pk]),
            obj.auction.product.title,
        ))
    get_product.short_description = "Product"

admin.site.register(Bid, BidAdmin)

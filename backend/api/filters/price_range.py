from rest_framework import filters
from django.db.models import Max
from django.db.models import Q
from django.db.models.functions import Greatest


class AuctionPriceRangeFilterBackend(filters.BaseFilterBackend):

    """
    Filters queryset with price_range parameter
    """
    def filter_queryset(self, request, queryset, view):
        price_range = request.query_params.get('price_range', None)
        if price_range is not None:
            price_range = price_range.split(',')
            queryset = queryset.with_bid_price()
            if len(price_range) >= 1:
                queryset = queryset.filter(bid_price__gte=price_range[0])
            if len(price_range) >= 2:
                queryset = queryset.filter(bid_price__lte=price_range[1])

        return queryset

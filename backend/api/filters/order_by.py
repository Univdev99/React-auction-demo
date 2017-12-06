from rest_framework import filters

class AuctionOrderByBackend(filters.BaseFilterBackend):

    order_by_fields = ['title', 'bid_price', 'started_at', 'open_until', ]

    """
    Sorts queryset with order_by & order_dir parameters
    """
    def filter_queryset(self, request, queryset, view):
        order_by = request.query_params.get('order_by', None)
        order_dir = request.query_params.get('order_dir', 'asc')
        if order_by is not None and order_by in self.order_by_fields:
            if order_dir == 'desc':
                order_by = '-' + order_by

            if 'bid_price' in order_by:
                queryset = queryset.with_bid_price().order_by(order_by)
            else:
                queryset = queryset.order_by(order_by)

        return queryset

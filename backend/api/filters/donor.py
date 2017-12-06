from rest_framework import filters


class AuctionDonorFilterBackend(filters.BaseFilterBackend):
    """
    Filters queryset with category parameter applied on tags
    """
    def filter_queryset(self, request, queryset, view):
        donors = request.query_params.get('donor', None)
        if donors is not None:
            donors = donors.split(',')
            return queryset.filter(product__donor__in=donors)
        else:
            return queryset

from rest_framework import filters
from django.db.models import Q


class AuctionQueryFilterBackend(filters.BaseFilterBackend):
    """
    Filters queryset with q parameter applied on auctions
    """
    def filter_queryset(self, request, queryset, view):
        q = request.query_params.get('q', None)
        if q is not None:
            queryset = queryset.filter(
                Q(title__icontains=q) | \
                Q(product__title__icontains=q) | \
                Q(product__description__icontains=q)
            )

        return queryset


class DonorQueryFilterBackend(filters.BaseFilterBackend):

    """
    Filters queryset with q parameter applied on donors
    """
    def filter_queryset(self, request, queryset, view):
        q = request.query_params.get('q', None)
        if q is not None:
            queryset = queryset.filter(title__icontains=q)

        return queryset

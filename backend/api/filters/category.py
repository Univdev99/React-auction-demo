from rest_framework import filters
from tagging.models import Tag
from tagging.models import TaggedItem

from auction.models import Auction
from entity.models import Product


class CategoryFilterBackend(filters.BaseFilterBackend):
    """
    Filters queryset with category parameter applied on tags
    """
    def filter_queryset(self, request, queryset, view):
        category = request.query_params.get('category')

        if category:
            try:
                tag = Tag.objects.get(name=category)
            except Tag.DoesNotExist:
                return queryset.none()
            return TaggedItem.objects.get_by_model(queryset, tag)

        return queryset


class AuctionCategoryFilterBackend(filters.BaseFilterBackend):
    """
    Filters queryset with category parameter applied on tags
    """
    def filter_queryset(self, request, queryset, view):
        category = request.query_params.get('category')

        if category:
            try:
                tag = Tag.objects.get(name=category)
            except Tag.DoesNotExist:
                return queryset.none()
            product_queryset = Product.objects.filter(auction__in=queryset)
            product_queryset = TaggedItem.objects.get_by_model(product_queryset, tag)
            product_ids = list(product_queryset.values_list('pk', flat=True))
            return Auction.objects.filter(product__in=product_ids)

        return queryset

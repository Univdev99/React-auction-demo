from rest_framework import filters

class AuctionDonorFilterBackend(filters.BaseFilterBackend):
    """
    Filters queryset with category parameter applied on tags
    """
    def filter_queryset(self, request, queryset, view):
        donor = request.query_params.get('donor', None)
        if donor is not None:
            return queryset.filter(product__donor=donor)
        else:
            return queryset



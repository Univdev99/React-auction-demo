from rest_framework import filters


class MediumTypeFilterBackend(filters.BaseFilterBackend):
    """
    Filters medium list with type parameter
    """
    def filter_queryset(self, request, queryset, view):
        medium_type = request.query_params.get('type')
        if medium_type:
            queryset = queryset.filter(type=medium_type)
        return queryset

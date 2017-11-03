from rest_framework import filters


class StatusFilterBackend(filters.BaseFilterBackend):
    """
    Filters queryset with status parameter applied on model status field
    """
    def filter_queryset(self, request, queryset, view):
        status = request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

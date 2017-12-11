from rest_framework import filters


class StatusFilterBackend(filters.BaseFilterBackend):
    """
    Filters queryset with status parameter applied on model status field
    """
    def filter_queryset(self, request, queryset, view):
        status_param = request.query_params.get('status')
        if status_param:
            status_list = status_param.split(',')
            status_list = [status.strip() for status in status_list]
            queryset = queryset.filter(status__in=status_list)
        return queryset


class BidStatusFilterBackend(filters.BaseFilterBackend):
    """
    Filters queryset with status parameter applied on its related bid model status field
    """
    def filter_queryset(self, request, queryset, view):
        status_param = request.query_params.get('status')
        if status_param:
            status_list = status_param.split(',')
            status_list = [status.strip() for status in status_list]
            queryset = queryset.filter(status__in=status_list)
        return queryset

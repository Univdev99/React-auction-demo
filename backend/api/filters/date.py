from datetime import datetime
from django.utils import timezone

from rest_framework import filters


class CreatedDateFilterByMonthBackend(filters.BaseFilterBackend):
    """
    Filters medium list with month dates
    """
    def filter_queryset(self, request, queryset, view):
        date = request.query_params.get('date')
        if date:
            year, month = date.split('/')
            start_date = timezone.make_aware(datetime(int(year), int(month), 1))
            month = int(month) + 1
            if month > 12:
                year = int(year) + 1
                month = 1
            end_date = timezone.make_aware(datetime(int(year), int(month), 1))
            queryset = queryset.filter(created_at__gte=start_date).filter(created_at__lt=end_date)

        return queryset

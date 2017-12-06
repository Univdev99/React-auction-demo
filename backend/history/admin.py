from django.contrib import admin

from history.models import HistoryRecord


admin.site.register(HistoryRecord)

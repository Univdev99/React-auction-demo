from django.contrib import admin
from .models import Job

class JobAdmin(admin.ModelAdmin):
    model = Job

    list_display = (
        'title',
        'description',
        'posted_at',
    )

admin.site.register(Job, JobAdmin)

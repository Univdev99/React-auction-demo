from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe

from entity.models import Charity


class CharityAdmin(admin.ModelAdmin):
    model = Charity

    list_display = (
        'title',
        'description',
        'get_logo_obj',
        'get_logo_url',
    )

    readonly_fields = (
        'logo',
    )

    def get_queryset(self, request):
        return super(CharityAdmin, self).get_queryset(request).select_related(
            'logo'
        )

    def get_logo_obj(self, obj):
        if not obj.logo:
            return None
        return mark_safe(u'<a href="{}">{}</a>'.format(
            reverse('admin:storage_medium_change', args=[obj.logo.pk]),
            str(obj.logo)
        ))
    get_logo_obj.short_description = "Logo Object"

    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else None
    get_logo_url.short_description = "Logo URL"

admin.site.register(Charity, CharityAdmin)

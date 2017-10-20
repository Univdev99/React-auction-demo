from django.contrib import admin

from storage.models import Medium


class MediumAdmin(admin.ModelAdmin):
    model = Medium

    list_display = (
        'get_name',
        'type',
        'mimetype',
        'deleted_at',
        'url',
    )

    readonly_fields = (
        'mimetype',
    )

    def get_name(self, obj):
        return 'Medium ID: {}'.format(obj.pk)
    get_name.short_description = 'Medium'

admin.site.register(Medium, MediumAdmin)

from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils import html

from notification.models import Notification


class NotificationAdmin(admin.ModelAdmin):
    model = Notification

    list_display = (
        'get_notification',
        'get_target',
        'get_subject',
        'action',
        'extra',
    )

    def get_queryset(self, request):
        return super(NotificationAdmin, self).get_queryset(request) \
            .select_related('target') \
            .select_related('subject')

    def get_notification_entity_change_link(self, entity):
        return reverse(
            'admin:{}_{}_change'.format(entity.content_type.app_label, entity.content_type.model),
            args=[entity.object_id]
        )

    def get_notification(self, obj):
        return 'Notification ID {}'.format(obj.id)
    get_notification.short_description = "Notification"

    def get_target(self, obj):
        return mark_safe('<a href="{}">{}</a>'.format(
            self.get_notification_entity_change_link(obj.target),
            html.escape(str(obj.target.content_object)),
        ))
    get_target.short_description = "Target"

    def get_subject(self, obj):
        if obj.subject.content_object:
            return mark_safe('<a href="{}">{}</a>'.format(
                self.get_notification_entity_change_link(obj.subject),
                html.escape(str(obj.subject.content_object)),
            ))
        else:
            return 'Site Owner'
    get_subject.short_description = "Subject"

admin.site.register(Notification, NotificationAdmin)

from django.contrib import admin

from account.models import UserVerification


class UserVerificationAdmin(admin.ModelAdmin):
    model = UserVerification

    list_display = (
        'token',
        'is_pending',
        'created_at',
        'get_user_email',
    )

    readonly_fields = (
        'created_at',
    )

    def get_queryset(self, request):
        return super(UserVerificationAdmin, self).get_queryset(request).select_related(
            'user'
        )

    def get_user_email(self, token):
        return token.user.email
    get_user_email.short_description = "User email"

admin.site.register(UserVerification, UserVerificationAdmin)

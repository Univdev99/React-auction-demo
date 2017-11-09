from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django.utils.translation import ugettext_lazy as _

from .models import User
from .models import UserVerification


class UserAdmin(admin.ModelAdmin):
    list_display = (
        'email',
        'first_name',
        'last_name',
        'username',
    )

    def get_form(self, request, obj=None, **kwargs):
        form = super(UserAdmin, self).get_form(request, obj, **kwargs)

        def clean_password(me):
            password = me.cleaned_data['password']

            if me.instance:
                if me.instance.password != password:
                    password = make_password(password)
            else:
                password = make_password(password)

            return password

        form.clean_password = clean_password

        return form

    pass


admin.site.register(User, UserAdmin)


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

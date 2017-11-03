from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

from common.constants import COUNTRY_CHOICES


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    phone_number = PhoneNumberField(max_length=20)

    # Address fields
    address_line = models.CharField(_('Address Line'), max_length=255, blank=True, null=True)

    city = models.CharField(_('City'), max_length=255, blank=True, null=True)

    zipcode = models.CharField(_('Zip Code'), max_length=20, blank=True, null=True)

    country = models.CharField(_('Country'), max_length=2, blank=True, null=True, choices=COUNTRY_CHOICES)


class UserVerification(models.Model):
    token = models.CharField(max_length=32, null=False, blank=False)
    is_pending = models.BooleanField(null=False, default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return 'User Verification for {}'.format(user.email)


@receiver(post_save, sender=get_user_model())
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=get_user_model())
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

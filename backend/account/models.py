from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

from auction.models import Bid
from common.constants import COUNTRY_CHOICES
from storage.models import Medium


class UserManager(BaseUserManager):

    def _create_user(self, email, password,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            is_staff=is_staff,
            is_superuser=is_superuser,
            last_login=now,
            date_joined=now,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email, password, False, False,
                                 **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True,
                                 **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    first_name = models.CharField(_('First Name'), max_length=50)

    last_name = models.CharField(_('Last Name'), max_length=50)

    email = models.EmailField(_('Email Address'), unique=True)

    username = models.CharField(_('Username'), max_length=255, unique=True, blank=True, null=True)

    is_superuser = models.BooleanField(_('Superuser Status'), default=False)

    is_staff = models.BooleanField(_('Staff Status'), default=False)

    is_active = models.BooleanField(_('Active'), default=False)

    date_joined = models.DateTimeField(_('Date Joined'), auto_now_add=True)

    phone_number = PhoneNumberField(max_length=20, blank=True, null=True)

    # Address fields
    address_line = models.CharField(_('Address Line'), max_length=255, blank=True, null=True)

    city = models.CharField(_('City'), max_length=255, blank=True, null=True)

    zipcode = models.CharField(_('Zip Code'), max_length=20, blank=True, null=True)

    country = models.CharField(_('Country'), max_length=2, blank=True, null=True, choices=COUNTRY_CHOICES)

    avatar = models.OneToOneField(Medium, null=True, blank=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def get_short_name(self):
        return self.first_name

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    @property
    def full_name(self):
        return self.get_full_name()

    @property
    def auctions_total(self):
        return Bid.objects.filter(user=self).count()

    def __str__(self):
        return self.email


class UserVerification(models.Model):
    token = models.CharField(max_length=32, null=False, blank=False)
    is_pending = models.BooleanField(null=False, default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return 'User Verification for {}'.format(self.user.email)

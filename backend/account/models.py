from django.conf import settings
from django.db import models


class UserVerification(models.Model):
    token = models.CharField(max_length=32, null=False, blank=False)

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from tagging.models import Tag
from tagging.models import TaggedItem
from tagging.registry import register

from common.mixins import ModelTagnamesMixin
from entity.constants import DONOR_TYPE_CHOICES
from entity.constants import PRODUCT_WEIGHT_UNIT_CHOICES
from entity.constants import PRODUCT_WEIGHT_UNIT_KG
from storage.models import Medium


class Charity(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()

    logo = models.OneToOneField(Medium, null=True)

    class Meta:
        verbose_name_plural = 'Charities'

    def __str__(self):
        return 'Charity <{}>'.format(self.title)


class Donor(ModelTagnamesMixin, models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()
    type = models.CharField(choices=DONOR_TYPE_CHOICES, max_length=50)
    website = models.URLField(max_length=300, null=True, blank=True)
    instagram_handle = models.CharField(max_length=300, null=True, blank=True)

    charity = models.ForeignKey(Charity, null=True, on_delete=models.SET_NULL, related_name='_charity')
    charities = models.ManyToManyField(Charity)
    media = GenericRelation(Medium)

    def __str__(self):
        return '{} <{}>'.format(self.type.title(), self.title)

    @property
    def similar_donors(self):
        return self.get_similar_donors(2)

    def get_similar_donors(self, count):
        return TaggedItem.objects.get_related(self, Donor.objects.prefetch_related('media'), count)

register(Donor)


class Product(ModelTagnamesMixin, models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()
    charge_tax = models.BooleanField(default=False)
    requires_shipping = models.BooleanField(default=False)
    weight_unit = models.CharField(
        max_length=10,
        choices=PRODUCT_WEIGHT_UNIT_CHOICES,
        default=PRODUCT_WEIGHT_UNIT_KG
    )
    weight = models.FloatField(default=0)
    hs_tariff_code = models.CharField(max_length=50, null=True, default=None)

    donor = models.ForeignKey(Donor, null=True, on_delete=models.SET_NULL)
    media = GenericRelation(Medium)

    def __str__(self):
        return 'Product <{}>'.format(self.title)

    def get_similar_products(self, count, **kwargs):
        qs = Product.objects.select_related('auction').prefetch_related('media')
        if bool(kwargs):
            qs = qs.filter(**kwargs)
        return TaggedItem.objects.get_related(self, qs, count)

register(Product)

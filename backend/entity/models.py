from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from tagging.models import Tag
from tagging.models import TaggedItem
from tagging.registry import register

from entity.constants import DONOR_TYPE_CHOICES
from storage.models import Medium


class Charity(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()

    logo = models.OneToOneField(Medium, null=True)

    class Meta:
        verbose_name_plural = 'Charities'

    def __str__(self):
        return 'Charity <{}>'.format(self.title)


class Donor(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()
    type = models.CharField(choices=DONOR_TYPE_CHOICES, max_length=50)

    charity = models.ForeignKey(Charity)

    def __str__(self):
        return '{} <{}>'.format(self.type, self.title)

    @property
    def similar_donors(self):
        return self.get_similar_donors(2)

    @property
    def tagnames(self):
        return [tag.name for tag in self.tags]

    def get_similar_donors(self, count):
        return TaggedItem.objects.get_related(self, Donor.objects.prefetch_related('donormedium_set__medium'), count)

register(Donor)


class DonorMedium(models.Model):
    medium = models.ForeignKey(Medium)
    donor = models.ForeignKey(Donor)
    order = models.PositiveIntegerField()

    class Meta:
        verbose_name_plural = 'Donor Media'

    def __str__(self):
        return 'Donor Medium {}'.format(self.pk)


class Product(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()

    donor = models.ForeignKey(Donor)

    def __str__(self):
        return 'Product <{}>'.format(self.title)

    @property
    def tagnames(self):
        return [tag.name for tag in self.tags]

register(Product)


class ProductMedium(models.Model):
    medium = models.ForeignKey(Medium)
    product = models.ForeignKey(Product)
    order = models.PositiveIntegerField()

    class Meta:
        verbose_name_plural = 'Product Media'

    def __str__(self):
        return 'Product Medium {}'.format(self.pk)

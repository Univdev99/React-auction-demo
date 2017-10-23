from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from entity.constants import DONOR_TYPE_CHOICES
from storage.models import Medium


class Tag(models.Model):
    label = models.CharField(max_length=50)

    def __str__(self):
        return 'Tag <{}>'.format(self.label)


class Tagging(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()


class Charity(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()

    logo = models.OneToOneField(Medium, null=True)
    tags = GenericRelation(Tagging)

    class Meta:
        verbose_name_plural = 'Charities'

    def __str__(self):
        return 'Charity <{}>'.format(self.title)


class Donor(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()
    type = models.CharField(choices=DONOR_TYPE_CHOICES, max_length=50)

    charity = models.ForeignKey(Charity)
    tags = GenericRelation(Tagging)

    def __str__(self):
        return '{} <{}>'.format(self.type, self.title)


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
    tags = GenericRelation(Tagging)

    def __str__(self):
        return 'Product <{}>'.format(self.title)


class ProductMedium(models.Model):
    medium = models.ForeignKey(Medium)
    product = models.ForeignKey(Product)
    order = models.PositiveIntegerField()

    class Meta:
        verbose_name_plural = 'Product Media'

    def __str__(self):
        return 'Product Medium {}'.format(self.pk)

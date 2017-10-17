from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from entity.constants import DONOR_TYPE_CHOICES
from entity.constants import MEDIUM_TYPE_CHOICES


class Tag(models.Model):
    label = models.CharField(max_length=50)

    def __unicode__(self):
        return u'Tag <{}>'.format(self.label)


class Tagging(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()


class Medium(models.Model):
    url = models.URLField(max_length=300)
    type = models.CharField(choices=MEDIUM_TYPE_CHOICES, max_length=50)

    def __unicode__(self):
        return u'Medium {} ({})'.format(self.pk, self.type)


class Charity(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()

    logo = models.OneToOneField(Medium, null=True)
    tags = GenericRelation(Tagging)

    def __str__(self):
        return str(self.__unicode__())

    def __unicode__(self):
        return u'Charity <{}>'.format(self.title)


class Donor(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()
    type = models.CharField(choices=DONOR_TYPE_CHOICES, max_length=50)

    logo = models.OneToOneField(Medium, related_name='donor_having_as_logo', null=True)
    video = models.OneToOneField(Medium, related_name='donor_having_as_video', null=True)
    charity = models.ForeignKey(Charity)
    tags = GenericRelation(Tagging)

    def __unicode__(self):
        return u'{} <{}>'.format(self.type, self.title)


class Product(models.Model):
    title = models.CharField(unique=True, max_length=200)
    description = models.TextField()

    tags = GenericRelation(Tagging)
    media = models.ManyToManyField(Medium)

    def __unicode__(self):
        return u'Product <{}>'.format(self.title)

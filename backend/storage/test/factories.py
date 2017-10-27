import factory

from django.contrib.contenttypes.models import ContentType

from storage.constants import MEDIUM_TYPE_PHOTO
from storage.models import Medium


class MediumFactory(factory.DjangoModelFactory):
    class Meta:
        model = Medium

    url = factory.Sequence(
        lambda n: 'https://test-bucket.s3.amazon.com/test-media/test-{}'.format(n)
    )
    type = MEDIUM_TYPE_PHOTO
    mimetype = 'image/png'

    @classmethod
    def create(cls, instance=None, *args, **kwargs):
        return super(MediumFactory, cls).create(content_object=instance, *args, **kwargs)

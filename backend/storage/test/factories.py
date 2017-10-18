import factory

from storage.constants import MEDIUM_TYPE_PHOTO
from storage.models import Medium


class MediumFactory(factory.DjangoModelFactory):
    class Meta:
        model = Medium

    url = factory.Sequence(
        lambda n: u'https://test-bucket.s3.amazon.com/test-media/test-{}'.format(n)
    )
    type = MEDIUM_TYPE_PHOTO
    mimetype = 'image/png'

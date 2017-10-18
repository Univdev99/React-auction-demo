import factory

from entity.models import Charity
from storage.test.factories import MediumFactory


class CharityFactory(factory.DjangoModelFactory):
    class Meta:
        model = Charity

    title = factory.Sequence(
        lambda n: u'Charity {}'.format(n)
    )
    description = factory.Sequence(
        lambda n: u'Description for charity {}'.format(n)
    )
    logo = factory.SubFactory(MediumFactory)

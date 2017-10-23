import factory

from entity.constants import DONOR_TYPE_COMPANY
from entity.constants import DONOR_TYPE_CELEBRITY
from entity.constants import DONOR_TYPE_OTHER
from entity.models import Charity
from entity.models import Donor
from entity.models import Product
from storage.test.factories import MediumFactory


class CharityFactory(factory.DjangoModelFactory):
    class Meta:
        model = Charity

    title = factory.Sequence(
        lambda n: 'Charity {}'.format(n)
    )
    description = factory.Sequence(
        lambda n: 'Description for charity {}'.format(n)
    )
    logo = factory.SubFactory(MediumFactory)


DONOR_TYPES = (DONOR_TYPE_COMPANY, DONOR_TYPE_CELEBRITY, DONOR_TYPE_OTHER)


class DonorFactory(factory.DjangoModelFactory):
    class Meta:
        model = Donor

    title = factory.Sequence(
        lambda n: 'Donor {}'.format(n)
    )
    description = factory.Sequence(
        lambda n: 'Description for donor {}'.format(n)
    )
    type = factory.Sequence(
        lambda n: DONOR_TYPES[(n + 2) % len(DONOR_TYPES)]
    )

    charity = factory.SubFactory(CharityFactory)


class ProductFactory(factory.DjangoModelFactory):
    class Meta:
        model = Product

    title = factory.Sequence(
        lambda n: 'Product {}'.format(n)
    )
    description = factory.Sequence(
        lambda n: 'Description for donor {}'.format(n)
    )

    donor = factory.SubFactory(DonorFactory)

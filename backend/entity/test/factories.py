import factory

from entity.constants import DONOR_TYPE_COMPANY
from entity.constants import DONOR_TYPE_CELEBRITY
from entity.constants import DONOR_TYPE_OTHER
from entity.models import Charity
from entity.models import Donor
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


DONOR_TYPES = (DONOR_TYPE_COMPANY, DONOR_TYPE_CELEBRITY, DONOR_TYPE_OTHER)


class DonorFactory(factory.DjangoModelFactory):
    class Meta:
        model = Donor

    title = factory.Sequence(
        lambda n: u'Donor {}'.format(n)
    )
    description = factory.Sequence(
        lambda n: u'Description for donor {}'.format(n)
    )
    type = factory.Sequence(
        lambda n: DONOR_TYPES[(n + 2) % len(DONOR_TYPES)]
    )

    logo = factory.SubFactory(MediumFactory)
    video = factory.SubFactory(MediumFactory)
    charity = factory.SubFactory(CharityFactory)

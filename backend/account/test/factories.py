import factory

from django.contrib.auth import get_user_model


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    username = factory.Sequence(
        lambda n: u'test{}'.format(n)
    )
    email = factory.Sequence(
        lambda n: u'test{}@test.com'.format(n)
    )

    @classmethod
    def password(cls):
        return 'abcde123'

    @classmethod
    def _after_postgeneration(cls, obj, create, results=None):
        obj.set_password(cls.password())
        return super(UserFactory, cls)._after_postgeneration(obj, create, results)


class AdminFactory(UserFactory):
    is_staff = True

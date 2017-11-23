from decimal import Decimal

from django.utils import timezone

import factory
from pinax.stripe.models import Customer

from account.test.factories import UserFactory
from blog.constants import POST_VISIBILITY_PUBLIC
from blog.constants import COMMENT_STATUS_PUBLIC
from blog.models import Comment
from blog.models import Post


class PostFactory(factory.DjangoModelFactory):
    class Meta:
        model = Post

    title = factory.Sequence(
        lambda n: 'Post title {}'.format(n)
    )
    content = factory.Sequence(
        lambda n: 'Post content {}'.format(n)
    )
    excerpt = factory.Sequence(
        lambda n: 'Post excerpt {}'.format(n)
    )
    visibility = POST_VISIBILITY_PUBLIC
    author = factory.SubFactory(UserFactory)


class CommentFactory(factory.DjangoModelFactory):
    class Meta:
        model = Comment

    content = factory.Sequence(
        lambda n: 'Comment {}'.format(n)
    )
    status = COMMENT_STATUS_PUBLIC
    post = factory.SubFactory(PostFactory)
    user = factory.SubFactory(UserFactory)

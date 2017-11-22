from django.db import models
from django.conf import settings

from tagging.models import TaggedItem
from tagging.registry import register

from blog.constants import POST_VISIBILITY_CHOICES
from blog.constants import POST_VISIBILITY_PUBLIC
from blog.constants import COMMENT_STATUS_CHOICES
from blog.constants import COMMENT_STATUS_PUBLIC
from common.mixins import ModelTagnamesMixin
from storage.models import Medium


class Post(ModelTagnamesMixin, models.Model):
    title = models.CharField(max_length=300, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    excerpt = models.CharField(max_length=500, null=True, blank=True)
    visibility = models.CharField(
        max_length=10,
        choices=POST_VISIBILITY_CHOICES,
        default=POST_VISIBILITY_PUBLIC,
    )
    password = models.CharField(max_length=128, null=True, blank=True)
    featured_image = models.OneToOneField(Medium, null=True)
    is_draft = models.BooleanField(default=False)
    is_sticky = models.BooleanField(default=False)
    is_in_trash = models.BooleanField(default=False)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True, default=None)

    def get_similar_posts(self, count, **kwargs):
        qs = Post.objects.select_related('featured_image').select_related('author')
        if bool(kwargs):
            qs = qs.filter(**kwargs)
        return TaggedItem.objects.get_related(self, qs, count)

    @property
    def similar_posts(self):
        return self.get_similar_posts(2)

    def __str__(self):
        return 'Post <{}>'.format(self.title)

register(Post)


class Comment(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    status = models.CharField(
        max_length=30,
        choices=COMMENT_STATUS_CHOICES,
        default=COMMENT_STATUS_PUBLIC
    )

    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return 'Comment on Post {} by User {}'.format(self.post_id, self.user_id)

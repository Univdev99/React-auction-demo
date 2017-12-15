import random

from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from api.serializers.mixins import TagnamesSerializerMixin
from blog.constants import POST_VISIBILITY_PUBLIC
from blog.constants import POST_VISIBILITY_PROTECTED
from blog.constants import POST_VISIBILITY_PRIVATE
from blog.models import Post
from blog.models import Comment
from storage.mixins import MediumUploadMixin


class PostSerializer(MediumUploadMixin, TagnamesSerializerMixin, serializers.ModelSerializer):
    featured_image = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False)
    image_file = serializers.FileField(
        max_length=1024 * 1024 * 30,
        write_only=True,
        required=False
    )

    upload_folder = 'blog/post'
    tmp_file_prefix = 'post_featured_image'

    class Meta:
        model = Post
        fields = (
            'pk', 'title', 'content', 'excerpt', 'visibility',
            'password', 'featured_image', 'is_draft', 'is_sticky', 'author', 'author_name',
            'created_at', 'updated_at', 'deleted_at', 'image_file',
        )
        read_only_fields = (
            'pk', 'created_at', 'updated_at', 'deleted_at', 'author_name'
        )

    def get_featured_image(self, obj):
        try:
            return obj.featured_image.url
        except:
            return None

    def get_author_name(self, obj):
        try:
            return obj.author.get_full_name()
        except:
            return None

    def validate(self, data):
        data = super(PostSerializer, self).validate(data)

        if data['visibility'] == POST_VISIBILITY_PROTECTED and \
                ('password' not in data or not data['password']):
            raise serializers.ValidationError('Password should be set for protected posts')

        return data

    def save(self, **kwargs):
        image_file = self.validated_data.pop('image_file', None)
        if image_file:
            self.is_mimetype_image(image_file)

        password = self.validated_data.pop('password', None)

        user = self.context.get('user')
        self.validated_data['author'] = user
        post = super(PostSerializer, self).save(**kwargs)

        if image_file:
            featured_image_medium = self.upload_medium(
                image_file,
                self.upload_folder,
                '{}_{}'.format(post.pk, random.randint(10000000, 99999999)),
                content_object=post
            )

            try:
                if post.featured_image:
                    self.delete_medium(post.featured_image)
            except:
                pass

            post.featured_image = featured_image_medium

        if post.visibility == POST_VISIBILITY_PROTECTED:
            post.password = make_password(password)
        else:
            post.password = None

        post.save()
        return post


class BlogUserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ('pk', 'first_name', 'last_name', 'full_name', 'avatar')
        read_only_fields = ('pk', 'first_name', 'last_name', 'full_name', 'avatar')

    def get_avatar(self, obj):
        return obj.avatar.url if obj.avatar else None


class PostDetailSerializer(serializers.ModelSerializer):
    featured_image = serializers.SerializerMethodField()
    author_detail = BlogUserSerializer(read_only=True)
    similar_posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = (
            'pk', 'title', 'content', 'excerpt', 'visibility',
            'featured_image', 'is_draft', 'is_sticky', 'author', 'author_detail',
            'created_at', 'updated_at', 'deleted_at', 'similar_posts'
        )
        read_only_fields = (
            'pk', 'created_at', 'updated_at', 'deleted_at', 'author_name', 'similar_posts'
        )

    def get_featured_image(self, obj):
        try:
            return obj.featured_image.url
        except:
            return None


class PostCommentSerializer(serializers.ModelSerializer):
    user = BlogUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = (
            'content', 'created_at', 'deleted_at', 'status', 'post', 'user'
        )

        read_only_fields = (
            'pk', 'created_at', 'deleted_at', 'post', 'user', 'status'
        )

    def validate(self, data):
        user = self.context.get('request').user
        data['user'] = user
        post = self.context.get('view').get_object()
        data['post'] = post
        return data

from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe

from entity.models import Charity
from entity.models import Donor
from entity.models import Product


class CharityAdmin(admin.ModelAdmin):
    model = Charity

    list_display = (
        'title',
        'description',
        'get_logo_obj',
        'get_logo_url',
    )

    def get_queryset(self, request):
        return super(CharityAdmin, self).get_queryset(request).select_related(
            'logo'
        )

    def get_logo_obj(self, obj):
        if not obj.logo:
            return None
        return mark_safe('<a href="{}">{}</a>'.format(
            reverse('admin:storage_medium_change', args=[obj.logo.pk]),
            str(obj.logo)
        ))
    get_logo_obj.short_description = "Logo Object"

    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else None
    get_logo_url.short_description = "Logo URL"

admin.site.register(Charity, CharityAdmin)


class DonorAdmin(admin.ModelAdmin):
    model = Donor

    list_display = (
        'title',
        'description',
        'type',
        'get_logo_obj',
        'get_logo_url',
        'get_video_obj',
        'get_video_url',
    )

    def get_queryset(self, request):
        return super(DonorAdmin, self).get_queryset(request).select_related(
            'logo'
        ).select_related(
            'video'
        )

    def get_logo_obj(self, obj):
        if not obj.logo:
            return None
        return mark_safe('<a href="{}">{}</a>'.format(
            reverse('admin:storage_medium_change', args=[obj.logo.pk]),
            str(obj.logo)
        ))
    get_logo_obj.short_description = "Logo Object"

    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else None
    get_logo_url.short_description = "Logo URL"

    def get_video_obj(self, obj):
        if not obj.video:
            return None
        return mark_safe('<a href="{}">{}</a>'.format(
            reverse('admin:storage_medium_change', args=[obj.video.pk]),
            str(obj.video)
        ))
    get_video_obj.short_description = "Video Object"

    def get_video_url(self, obj):
        return obj.video.url if obj.video else None
    get_video_url.short_description = "Video URL"

admin.site.register(Donor, DonorAdmin)


class ProductAdmin(admin.ModelAdmin):
    model = Product

    list_display = (
        'title',
        'description',
        'get_media',
    )

    def get_media(self, obj):
        product_media = obj.productmedium_set.select_related('medium').all()
        links = []
        for product_medium in product_media:
            medium = product_medium.medium
            links.append('<a href="{}">{}</a>'.format(
                reverse('admin:storage_medium_change', args=[medium.pk]),
                str(medium)
            ))
        return mark_safe(', '.join(links))
    get_media.short_description = "Media"

admin.site.register(Product, ProductAdmin)

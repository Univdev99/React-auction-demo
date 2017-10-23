MEDIUM_TYPE_PHOTO = 'photo'
MEDIUM_TYPE_VIDEO = 'video'

MEDIUM_TYPE_CHOICES = (
    (MEDIUM_TYPE_PHOTO, 'Photo'),
    (MEDIUM_TYPE_VIDEO, 'Video'),
)

VALID_IMAGE_MIMETYPES = (
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml',
)

VALID_VIDEO_MIMETYPES = (
    'video/webm',
    'video/ogg',
    'video/mp4',
    'video/mpeg',
)

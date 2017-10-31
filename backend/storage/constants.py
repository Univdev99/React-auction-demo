MEDIUM_TYPE_IMAGE = 'image'
MEDIUM_TYPE_VIDEO = 'video'
MEDIUM_TYPE_AUDIO = 'audio'

MEDIUM_TYPE_CHOICES = (
    (MEDIUM_TYPE_IMAGE, 'Image'),
    (MEDIUM_TYPE_VIDEO, 'Video'),
    (MEDIUM_TYPE_AUDIO, 'Audio'),
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

VALID_AUDIO_MIMETYPES = (
    'audio/mp3',
    'audio/wave',
    'audio/wav',
    'audio/x-wav',
    'audio/x-pn-wav',
    'audio/webm',
    'audio/ogg',
)

DEBUG = False   # Should be False for production server

DATABASES['default'] = {
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': 'postgres',
    'USER': 'postgres',
    'HOST': 'db',
    'PORT': 5432,
}

ALLOWED_HOSTS = ['*']    # Allowed Hosts config on Production server

# Django CORS Headers

CORS_ORIGIN_WHITELIST = (
    'front-end-site-domain.com'
)


# Facebook API Configuration

FACEBOOK_APP_VERSION = '2.10'


# Temporary file storage path

TMP_DIR_PATH = '/tmp/charibin'


# Amazon S3 credentials

AMAZON_S3_REGION = 'us-east-2'
AMAZON_S3_BUCKET = 'bucket-name-here'
AMAZON_S3_ACCESS_KEY_ID = 'SD9A84B3GAOSUG34BT9B'
AMAZON_S3_ACCESS_SECRET = 'Awieu7690guVi67HTvi697vUyf+iugIKv787gHkv'


# Stripe credentials

PINAX_STRIPE_PUBLIC_KEY = ''
PINAX_STRIPE_SECRET_KEY = ''

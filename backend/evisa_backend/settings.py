"""
Django settings pour la plateforme e-Visa Cameroun
"""
import sys
from pathlib import Path
from datetime import timedelta
from decouple import config
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

# ─────────────────────────────────────────
# SÉCURITÉ
# ─────────────────────────────────────────
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1,charles237.pythonanywhere.com').split(',')

# ─────────────────────────────────────────
# APPLICATIONS
# ─────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'grappelli',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
    'anymail',
    # 'sslserver',

    # Applications locales
    'apps.users',
    'apps.visa_applications',
    'apps.payments',
    'apps.biometrics',
    'apps.notifications',
    'apps.audit',
    'apps.evisa',
]

# ─────────────────────────────────────────
# MIDDLEWARE
# ─────────────────────────────────────────
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'apps.audit.middleware.AuditMiddleware',
]

ROOT_URLCONF = 'evisa_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'evisa_backend.wsgi.application'

# ─────────────────────────────────────────
# BASE DE DONNÉES
# ─────────────────────────────────────────
USE_SQLITE = config('USE_SQLITE', default=False, cast=bool)

if 'test' in sys.argv or USE_SQLITE:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='3306'),
            'OPTIONS': {
                'charset': 'utf8mb4',
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }

# ─────────────────────────────────────────
# MODÈLE UTILISATEUR PERSONNALISÉ
# ─────────────────────────────────────────
AUTH_USER_MODEL = 'users.User'

# ─────────────────────────────────────────
# VALIDATION MOT DE PASSE
# ─────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
     'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─────────────────────────────────────────
# INTERNATIONALISATION
# ─────────────────────────────────────────
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Douala'
USE_I18N = True
USE_TZ = True

LANGUAGES = [
    ('fr', 'Français'),
    ('en', 'English'),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

# ─────────────────────────────────────────
# FICHIERS STATIQUES & MÉDIAS
# ─────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Taille max upload : 10 MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─────────────────────────────────────────
# DJANGO REST FRAMEWORK
# ─────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
        'apps.evisa.permissions.MaintenanceModePermission',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'EXCEPTION_HANDLER': 'evisa_backend.utils.custom_exception_handler',
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}

# ─────────────────────────────────────────
# OPENAPI / SWAGGER (INTEROPÉRABILITÉ)
# ─────────────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE': 'E-Visa Cameroun — API Officielle',
    'DESCRIPTION': (
        'Documentation technique de l\'API de la plateforme e-Visa Cameroun. '
        'Cette API permet aux partenaires institutionnels (DGSN, Compagnies Aériennes, MINFI, Interpol) '
        'd\'interroger et d\'interagir avec le système e-Visa de manière sécurisée.'
    ),
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'CONTACT': {'email': 'api@evisa-cameroun.cm'},
    'LICENSE': {'name': 'Propriété de l\'État du Cameroun — Usage Restreint'},
}

# ─────────────────────────────────────────
# JWT
# ─────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(
        minutes=config('JWT_ACCESS_TOKEN_LIFETIME_MINUTES', default=60, cast=int)
    ),
    'REFRESH_TOKEN_LIFETIME': timedelta(
        days=config('JWT_REFRESH_TOKEN_LIFETIME_DAYS', default=7, cast=int)
    ),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# ─────────────────────────────────────────
# CORS
# ─────────────────────────────────────────
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "https://charles237.pythonanywhere.com",
    "https://evisa-cameroun.vercel.app",
]

CORS_ALLOW_ALL_ORIGINS = True  # Temporaire pour débugger le blocage navigateur
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + [
    'x-csrftoken',
]

CSRF_TRUSTED_ORIGINS = [
    "https://evisa-cameroun.vercel.app",
    "https://charles237.pythonanywhere.com",
    config('FRONTEND_URL', default='https://evisa-cameroun.vercel.app'),
]

# ─────────────────────────────────────────
# EMAIL
# ─────────────────────────────────────────
SENDGRID_API_KEY = config('SENDGRID_API_KEY', default='')

if SENDGRID_API_KEY and SENDGRID_API_KEY != 'your_sendgrid_api_key_here':
    ANYMAIL = {
        "SENDGRID_API_KEY": SENDGRID_API_KEY,
    }
    EMAIL_BACKEND = "anymail.backends.sendgrid.EmailBackend"
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
    EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')

DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default=config('EMAIL_HOST_USER', default='no-reply@evisa.cm'))



# ─────────────────────────────────────────
# SMS (Twilio)
# ─────────────────────────────────────────
TWILIO_ACCOUNT_SID = config('TWILIO_ACCOUNT_SID', default='')
TWILIO_AUTH_TOKEN = config('TWILIO_AUTH_TOKEN', default='')
TWILIO_PHONE_NUMBER = config('TWILIO_PHONE_NUMBER', default='')

# ─────────────────────────────────────────
# SÉCURITÉ EN PRODUCTION
# ─────────────────────────────────────────
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

    AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # par défaut
]

BASE_BACKEND_URL = config('BASE_BACKEND_URL')
BASE_FRONTEND_URL = config('BASE_FRONTEND_URL')
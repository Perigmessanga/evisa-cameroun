import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()
from django.conf import settings
print(f"DEBUG: {settings.DEBUG}")
print(f"BASE_FRONTEND_URL: {settings.BASE_FRONTEND_URL}")
print(f"BASE_BACKEND_URL: {settings.BASE_BACKEND_URL}")
print(f"CORS_ALLOWED_ORIGINS: {settings.CORS_ALLOWED_ORIGINS}")

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()
from apps.notifications.models import EmailTemplate
t = EmailTemplate.objects.filter(code='AUTH_WELCOME').first()
if t:
    print(f"TEMPLATE_FOUND: {t.code}")
    print(f"BODY:\n{t.body_text}")
    if "localhost:3000" in t.body_text:
        print("WARNING: Hardcoded localhost found in template!")
else:
    print("NO_TEMPLATE_FOUND")

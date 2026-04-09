
import os
import django
import sys

# Configuration de l'environnement Django
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print(f"{'Email':<40} | {'Verified':<10} | {'Active':<8} | {'Date Created':<20}")
print("-" * 85)
for user in User.objects.all().order_by('-created_at'):
    print(f"{user.email:<40} | {str(user.is_email_verified):<10} | {str(user.is_active):<8} | {user.created_at.strftime('%Y-%m-%d %H:%M')}")

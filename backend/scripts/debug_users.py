import os, sys, django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

print("=== Diagnostic Utilisateurs ===")
users = User.objects.all().order_by('-created_at')[:20]
print(f"{'Email':<30} | {'Role':<10} | {'Vérifié':<8} | {'Date Création':<20} | {'Dernière Connexion'}")
print("-" * 100)
for u in users:
    print(f"{u.email:<30} | {u.role:<10} | {str(u.is_email_verified):<8} | {u.created_at.strftime('%Y-%m-%d %H:%M'):<20} | {u.last_login}")

import os
import sys
import django

# Configuration du chemin d'import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "evisa_backend.settings")
django.setup()

from apps.users.models import User

emails_to_delete = ['messangacharles@icloud.com', 'messangaperig3@gmail.com']

print("--- DEBUT DE LA PURGE DES UTILISATEURS ---")
for email in emails_to_delete:
    # Recherche insensible à la casse
    users = User.objects.filter(email__iexact=email)
    if users.exists():
        for user in users:
            print(f"[-] Suppression de l'utilisateur : {user.email} (Rôle: {user.role}, ID: {user.id})")
            user.delete()
        print(f"[OK] Purge terminée pour l'adresse : {email}\n")
    else:
        print(f"[INFO] L'adresse email '{email}' n'existe pas en base de données.\n")
print("--- FIN DE LA PURGE ---")

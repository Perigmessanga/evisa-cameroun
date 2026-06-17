import os
import sys
import django

# Configuration du chemin d'import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "evisa_backend.settings")
django.setup()

from apps.users.models import User

print("--- LISTE DE TOUS LES UTILISATEURS ACTUELS ---")
all_users = User.objects.all()
for u in all_users:
    print(f"ID: {u.id} | Email: {u.email} | Rôle: {u.role} | Actif: {u.is_active}")
print("----------------------------------------------\n")

print("--- RECHERCHE ET PURGE DYNAMIQUE ---")
# Mots-clés à rechercher dans l'adresse email
keywords = ['messanga', 'charles', 'perig']
found_any = False

for keyword in keywords:
    users = User.objects.filter(email__icontains=keyword)
    if users.exists():
        found_any = True
        for user in users:
            # Ne pas supprimer l'administrateur par défaut s'il s'appelle messanga/charles/perig
            if user.role == 'ADMIN' and user.email == 'admin@test.com':
                print(f"[SKIP] Administrateur principal ignoré : {user.email}")
                continue
            print(f"[-] Suppression de l'utilisateur : {user.email} (Rôle: {user.role}, ID: {user.id})")
            user.delete()
            print(f"[OK] Purge réussie pour {user.email}")

if not found_any:
    print("[INFO] Aucun utilisateur correspondant aux mots-clés n'a été trouvé.")
print("--- FIN DE LA PURGE ---")

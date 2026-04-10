import os
import sys
import django

# Configuration de l'environnement Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from django.conf import settings
from django.db import connections
from django.db.utils import OperationalError
from django.contrib.auth import get_user_model

def check_database():
    print("--- Vérification de la Base de Données ---")
    db_conn = connections['default']
    try:
        db_conn.cursor()
        print("[OK] Connexion à la base de données réussie.")
        print(f"Engine : {settings.DATABASES['default']['ENGINE']}")
        if 'sqlite' in settings.DATABASES['default']['ENGINE']:
            print(f"Fichier : {settings.DATABASES['default']['NAME']}")
        else:
            print(f"Host : {settings.DATABASES['default']['HOST']}")
    except OperationalError as e:
        print(f"[ERREUR] Impossible de se connecter à la base de données : {e}")
        return False
    return True

def check_migrations():
    print("\n--- Vérification des Migrations ---")
    from django.core.management import call_command
    try:
        call_command('showmigrations', format='plan')
        print("[INFO] Liste des migrations affichée ci-dessus.")
    except Exception as e:
        print(f"[ERREUR] Échec lors de la vérification des migrations : {e}")

def check_users():
    print("\n--- Vérification des Utilisateurs ---")
    User = get_user_model()
    count = User.objects.count()
    print(f"Nombre d'utilisateurs en base : {count}")
    if count > 0:
        latest = User.objects.latest('created_at')
        print(f"Dernier utilisateur créé : {latest.email} ({latest.role})")

if __name__ == "__main__":
    print("=== Diagnostic e-Visa Cameroun (PythonAnywhere) ===\n")
    if check_database():
        check_migrations()
        check_users()
    print("\n=== Fin du Diagnostic ===")

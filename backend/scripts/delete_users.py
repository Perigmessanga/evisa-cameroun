import os
import sys
import glob
import re

# Configuration du chemin d'import
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

print("=== DIAGNOSTIC & PURGE DES UTILISATEURS ===")

# Détection de l'environnement PythonAnywhere
wsgi_env_vars = {}
try:
    # PythonAnywhere stocke les fichiers WSGI dans /var/www/
    wsgi_files = glob.glob('/var/www/*_wsgi.py')
    if wsgi_files:
        wsgi_path = wsgi_files[0]
        print(f"[INFO] Fichier WSGI PythonAnywhere détecté : {wsgi_path}")
        
        # Regex pour capturer les os.environ[...] = ...
        pattern_direct = re.compile(r'os\.environ\s*\[\s*[\'"]([A-Z0-9_]+)[\'"]\s*\]\s*=\s*[\'"]([^\'"]+)[\'"]')
        pattern_default = re.compile(r'os\.environ\.setdefault\s*\(\s*[\'"]([A-Z0-9_]+)[\'"]\s*,\s*[\'"]([^\'"]+)[\'"]\s*\)')
        
        with open(wsgi_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Rechercher les variables d'environnement définies directement
            for line in content.splitlines():
                line = line.strip()
                m_dir = pattern_direct.search(line)
                if m_dir:
                    key, val = m_dir.group(1), m_dir.group(2)
                    wsgi_env_vars[key] = val
                else:
                    m_def = pattern_default.search(line)
                    if m_def:
                        key, val = m_def.group(1), m_def.group(2)
                        wsgi_env_vars[key] = val
                        
            # Si le WSGI charge un fichier .env spécifique
            dotenv_matches = re.findall(r'[\'"]([^\'"]*\.env[^\'"]*)[\'"]', content)
            for dotenv_rel_path in dotenv_matches:
                dotenv_abs_path = dotenv_rel_path
                if not os.path.isabs(dotenv_abs_path):
                    user_home = os.path.expanduser('~')
                    possible_paths = [
                        os.path.join(BASE_DIR, dotenv_rel_path),
                        os.path.join(user_home, 'evisa', 'backend', dotenv_rel_path),
                        os.path.join(user_home, 'evisa-cameroun', 'backend', dotenv_rel_path),
                    ]
                    for p in possible_paths:
                        if os.path.exists(p):
                            dotenv_abs_path = p
                            break
                
                if os.path.exists(dotenv_abs_path):
                    print(f"[INFO] Lecture du fichier .env référencé par le WSGI : {dotenv_abs_path}")
                    with open(dotenv_abs_path, 'r', encoding='utf-8') as ef:
                        for eline in ef:
                            eline = eline.strip()
                            if eline and not eline.startswith('#') and '=' in eline:
                                ekey, eval_ = eline.split('=', 1)
                                ekey = ekey.strip()
                                eval_ = eval_.strip().strip('\'"')
                                wsgi_env_vars[ekey] = eval_
except Exception as e:
    print(f"[DEBUG] Erreur lors de la détection WSGI : {e}")

# Application des variables d'environnement WSGI trouvées
if wsgi_env_vars:
    print("[INFO] Application des variables d'environnement trouvées :")
    for k, v in wsgi_env_vars.items():
        display_val = '********' if any(secret in k.lower() for secret in ['password', 'key', 'secret']) else v
        print(f"  - {k} = {display_val}")
        os.environ[k] = v
else:
    print("[INFO] Aucune variable d'environnement WSGI détectée. Utilisation de l'environnement standard/terminal.")

# Initialisation de Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "evisa_backend.settings")
import django
django.setup()

from django.conf import settings
from apps.users.models import User

# Affichage des informations de la base de données configurée
db_config = settings.DATABASES.get('default', {})
db_engine = db_config.get('ENGINE', '')
db_name = db_config.get('NAME', '')
db_host = db_config.get('HOST', 'localhost')
db_user = db_config.get('USER', '')

print("\n--- CONFIGURATION DE LA BASE DE DONNÉES DJANGO ACTIVE ---")
print(f"Moteur (Engine) : {db_engine}")
print(f"Base de données (Name) : {db_name}")
print(f"Hôte (Host)     : {db_host}")
print(f"Utilisateur     : {db_user}")
print("--------------------------------------------------------\n")

print("--- LISTE DE TOUS LES UTILISATEURS ACTUELS ---")
all_users = User.objects.all()
print(f"Nombre total d'utilisateurs : {all_users.count()}")
for u in all_users:
    print(f"ID: {u.id} | Email: {u.email} | Rôle: {u.role} | Actif: {u.is_active}")
print("----------------------------------------------\n")

print("--- RECHERCHE ET PURGE DYNAMIQUE ---")
# Mots-clés à rechercher dans l'adresse email
keywords = ['messangacharles@icloud.com', 'messangaperig3@gmail.com', 'messanga', 'charles', 'perig']
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
            try:
                user.delete()
                print(f"[OK] Purge réussie pour {user.email}")
            except Exception as delete_error:
                print(f"[ERREUR] Échec de suppression de {user.email} : {delete_error}")
                print("[INFO] Tentative de suppression forcée des relations...")
                # Supprimer les demandes de visa liées d'abord
                from apps.visa_applications.models import VisaApplication
                apps = VisaApplication.objects.filter(applicant=user)
                print(f"  -> Suppression de {apps.count()} demandes de visa liées.")
                apps.delete()
                # Réessayer la suppression de l'utilisateur
                try:
                    user.delete()
                    print(f"[OK] Purge réussie pour {user.email} après suppression des relations.")
                except Exception as retry_error:
                    print(f"[ERREUR CRITIQUE] Impossible de supprimer {user.email} même après forçage : {retry_error}")

if not found_any:
    print("[INFO] Aucun utilisateur correspondant aux mots-clés n'a été trouvé.")
print("--- FIN DE LA PURGE ---")

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
            
            # Afficher le contenu du fichier WSGI (en masquant les secrets)
            print("\n--- CONTENU DU FICHIER WSGI (AVEC SECRETS MASQUÉS) ---")
            for line in content.splitlines():
                if any(secret in line.lower() for secret in ['password', 'key', 'secret', 'token']):
                    # Masquer les valeurs secrètes
                    safe_line = re.sub(r'(=|\(|:)\s*[\'"][^\'"]+[\'"]', r'\1 "********"', line)
                    print(safe_line)
                else:
                    print(line)
            print("------------------------------------------------------\n")
            
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

# Diagnostic des fichiers .env locaux
print("\n--- RECHERCHE DE FICHIERS .ENV LOCAUX ---")
local_env_files = glob.glob(os.path.join(BASE_DIR, '.env*'))
if not local_env_files:
    print("[INFO] Aucun fichier .env local trouvé dans le répertoire backend.")
for env_file in local_env_files:
    print(f"[INFO] Fichier .env local trouvé : {env_file}")
    try:
        with open(env_file, 'r', encoding='utf-8') as ef:
            print("--- CONTENU DE CE FICHIER .ENV (MASQUÉ) ---")
            for eline in ef:
                eline = eline.strip()
                if eline and not eline.startswith('#') and '=' in eline:
                    ekey, eval_ = eline.split('=', 1)
                    ekey = ekey.strip()
                    eval_ = eval_.strip().strip('\'"')
                    display_val = '********' if any(secret in ekey.lower() for secret in ['password', 'key', 'secret', 'token']) else eval_
                    print(f"  - {ekey} = {display_val}")
            print("-------------------------------------------")
    except Exception as env_error:
        print(f"[WARNING] Impossible de lire {env_file} : {env_error}")
print("")

# Initialisation de Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "evisa_backend.settings")
import django
django.setup()

from django.conf import settings
from django.db import connections

# Mots-clés à rechercher dans l'adresse email
keywords = ['messangacharles@icloud.com', 'messangaperig3@gmail.com', 'messanga', 'charles', 'perig']

# Liste des bases de données à traiter
db_targets = []

# Vérification du type de base de données
default_db = settings.DATABASES.get('default', {})
if default_db.get('ENGINE') == 'django.db.backends.sqlite3':
    print("\n--- RECHERCHE DYNAMIQUE DE TOUTES LES BASES SQLITE ---")
    user_home = os.path.expanduser('~')
    # Parcourir récursivement pour trouver tous les fichiers db.sqlite3
    for root, dirs, files in os.walk(user_home):
        # Éviter de scanner des dossiers non pertinents pour optimiser la vitesse
        dirs[:] = [d for d in dirs if d not in ['.git', '.venv', 'venv', 'node_modules', '.cache', 'tmp', '__pycache__']]
        for file in files:
            if file == 'db.sqlite3':
                db_targets.append(os.path.join(root, file))
    
    # S'assurer que le db.sqlite3 par défaut de la configuration est bien présent
    default_sqlite_path = str(default_db.get('NAME'))
    if default_sqlite_path not in db_targets:
        db_targets.append(default_sqlite_path)
    
    print(f"[INFO] {len(db_targets)} fichier(s) SQLite identifié(s) : {db_targets}")
else:
    # Si MySQL ou un autre moteur est actif par défaut
    db_targets = [None]
    print("[INFO] Moteur de base de données MySQL ou autre actif par défaut. Traitement unique.")

# Traitement de chaque base de données identifiée
for db_target in db_targets:
    if db_target:
        print(f"\n========================================================")
        print(f"CONNEXION À LA BASE SQLITE : {db_target}")
        print(f"========================================================")
        # Modifier la config Django et forcer la reconnexion
        settings.DATABASES['default']['NAME'] = db_target
        connections.close_all()
        connections['default'].settings_dict['NAME'] = db_target
    else:
        print(f"\n========================================================")
        print(f"CONNEXION À LA BASE ACTIVE PAR DÉFAUT (MySQL/Production)")
        print(f"========================================================")
        
    try:
        from apps.users.models import User
        all_users = User.objects.all()
        print(f"Nombre total d'utilisateurs : {all_users.count()}")
        for u in all_users:
            print(f"ID: {u.id} | Email: {u.email} | Rôle: {u.role} | Actif: {u.is_active}")
        print("----------------------------------------------\n")
        
        print("--- RECHERCHE ET PURGE DYNAMIQUE ---")
        found_any = False
        for keyword in keywords:
            users = User.objects.filter(email__icontains=keyword)
            if users.exists():
                found_any = True
                for user in users:
                    if user.role == 'ADMIN' and user.email == 'admin@test.com':
                        continue
                    print(f"[-] Suppression de l'utilisateur : {user.email} (Rôle: {user.role}, ID: {user.id})")
                    try:
                        user.delete()
                        print(f"[OK] Purge réussie pour {user.email}")
                    except Exception as delete_error:
                        print(f"[ERREUR] Échec de suppression de {user.email} : {delete_error}")
                        print("[INFO] Tentative de suppression forcée des relations...")
                        from apps.visa_applications.models import VisaApplication
                        apps = VisaApplication.objects.filter(applicant=user)
                        print(f"  -> Suppression de {apps.count()} demandes de visa liées.")
                        apps.delete()
                        try:
                            user.delete()
                            print(f"[OK] Purge réussie pour {user.email} après suppression des relations.")
                        except Exception as retry_error:
                            print(f"[ERREUR CRITIQUE] Impossible de supprimer {user.email} même après forçage : {retry_error}")
        if not found_any:
            print("[INFO] Aucun utilisateur correspondant aux mots-clés n'a été trouvé.")
            
    except Exception as db_err:
        print(f"[ERREUR] Échec d'accès ou d'interrogation pour cette base de données : {db_err}")

print("\n=== FIN DE LA PROCÉDURE DE PURGE ===")

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

import sqlite3

# Mots-clés à rechercher dans l'adresse email
keywords = ['messangacharles@icloud.com', 'messangaperig3@gmail.com', 'messanga', 'charles', 'perig']

# 1. Recherche de toutes les bases sqlite3 sur le serveur
db_targets = []
user_home = os.path.expanduser('~')
for root, dirs, files in os.walk(user_home):
    # Éviter de scanner des dossiers non pertinents pour optimiser la vitesse
    dirs[:] = [d for d in dirs if d not in ['.git', '.venv', 'venv', 'node_modules', '.cache', 'tmp', '__pycache__']]
    for file in files:
        if file == 'db.sqlite3':
            db_targets.append(os.path.join(root, file))

# S'assurer que les bases possibles dans BASE_DIR sont aussi présentes
local_db = os.path.join(BASE_DIR, 'db.sqlite3')
if os.path.exists(local_db) and local_db not in db_targets:
    db_targets.append(local_db)

print(f"[INFO] {len(db_targets)} fichier(s) SQLite identifié(s) : {db_targets}")

# 2. Purge directe de chaque base de données SQLite en mode natif (sans Django ORM)
# Cela évite de planter sur les différences de schéma de tables / colonnes.
for db_target in db_targets:
    print(f"\n========================================================")
    print(f"CONNEXION DIRECTE SQLITE À : {db_target}")
    print(f"========================================================")
    
    try:
        conn = sqlite3.connect(db_target)
        cursor = conn.cursor()
        
        # Désactiver temporairement les clés étrangères pour pouvoir nettoyer sans contraintes
        cursor.execute("PRAGMA foreign_keys = OFF;")
        
        # Récupérer la liste des tables présentes dans cette base
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        print(f"[INFO] Tables trouvées en base : {tables}")
        
        if 'evisa_user' not in tables:
            print("[INFO] La table 'evisa_user' n'existe pas dans cette base. Saut de l'étape.")
            conn.close()
            continue
            
        # 1. Lister tous les utilisateurs présents dans cette base
        cursor.execute("SELECT id, email, role, is_active FROM evisa_user;")
        users = cursor.fetchall()
        print(f"--- Liste des utilisateurs ({len(users)} en base) ---")
        for u_id, u_email, u_role, u_active in users:
            print(f"  ID: {u_id} | Email: {u_email} | Rôle: {u_role} | Actif: {u_active}")
        print("---------------------------------------------------\n")
        
        # 2. Chercher les utilisateurs cibles
        matching_user_ids = []
        for keyword in keywords:
            cursor.execute("SELECT id, email FROM evisa_user WHERE email LIKE ?;", (f"%{keyword}%",))
            rows = cursor.fetchall()
            for r_id, r_email in rows:
                if r_email == 'admin@test.com':
                    continue  # ignorer l'admin de test
                if (r_id, r_email) not in matching_user_ids:
                    matching_user_ids.append((r_id, r_email))
        
        if not matching_user_ids:
            print("[INFO] Aucun utilisateur cible trouvé dans cette base.")
        else:
            print("--- PURGE DIRECTE SQL ---")
            for u_id, u_email in matching_user_ids:
                print(f"[-] Purge de l'utilisateur : {u_email} (ID: {u_id})")
                
                # Supprimer des tables de demandes de visa si elles existent
                for app_table in ['evisa_application', 'visa_applications_visaapplication']:
                    if app_table in tables:
                        cursor.execute(f"DELETE FROM {app_table} WHERE applicant_id = ?;", (u_id,))
                        print(f"  -> Supprimé de {app_table} ({cursor.rowcount} lignes)")
                
                # Supprimer les tokens ou sessions de cet utilisateur si des tables existent
                for token_table in ['token_blacklist_outstandingtoken', 'token_blacklist_blacklistedtoken']:
                    if token_table in tables:
                        # Supprimer les blacklisted tokens liés aux outstanding tokens du user
                        if token_table == 'token_blacklist_blacklistedtoken' and 'token_blacklist_outstandingtoken' in tables:
                            cursor.execute("DELETE FROM token_blacklist_blacklistedtoken WHERE token_id IN (SELECT id FROM token_blacklist_outstandingtoken WHERE user_id = ?);", (u_id,))
                            print(f"  -> Supprimé de token_blacklist_blacklistedtoken ({cursor.rowcount} lignes)")
                        elif token_table == 'token_blacklist_outstandingtoken':
                            cursor.execute("DELETE FROM token_blacklist_outstandingtoken WHERE user_id = ?;", (u_id,))
                            print(f"  -> Supprimé de token_blacklist_outstandingtoken ({cursor.rowcount} lignes)")
                
                # Supprimer de la table evisa_user
                cursor.execute("DELETE FROM evisa_user WHERE id = ?;", (u_id,))
                print(f"  -> Supprimé de evisa_user ({cursor.rowcount} lignes)")
                
            conn.commit()
            print("[OK] Purge directe réussie et validée pour cette base.")
            
        conn.close()
    except Exception as e:
        print(f"[ERREUR] Échec de la purge directe sur {db_target} : {e}")

print("\n=== FIN DE LA PROCÉDURE DE PURGE ===")

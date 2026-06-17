import os
import sys
import glob
import re
import time
import sqlite3

# Configuration du chemin d'import
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

print("=== DIAGNOSTIC COMPLET DES BASES DE DONNÉES ET .ENV ===")

user_home = os.path.expanduser('~')

# 1. Rechercher TOUS les fichiers db.sqlite3 (sans aucun filtrage)
print("\n--- RECHERCHE DE TOUS LES FICHIERS db.sqlite3 ---")
all_db_files = []
for root, dirs, files in os.walk(user_home):
    for file in files:
        if file == 'db.sqlite3':
            db_path = os.path.join(root, file)
            all_db_files.append(db_path)
            
for db in all_db_files:
    mtime = os.path.getmtime(db)
    mtime_str = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(mtime))
    size = os.path.getsize(db)
    print(f"\nBase trouvée : {db}")
    print(f"  - Taille : {size} octets")
    print(f"  - Dernière modification : {mtime_str}")
    
    # Inspection du contenu
    try:
        conn = sqlite3.connect(db)
        cursor = conn.cursor()
        
        # Désactiver temporairement les contraintes
        cursor.execute("PRAGMA foreign_keys = OFF;")
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [r[0] for r in cursor.fetchall()]
        print(f"  - Tables ({len(tables)}) : {tables[:15]}...")
        
        if 'evisa_user' in tables:
            cursor.execute("SELECT COUNT(*) FROM evisa_user;")
            cnt = cursor.fetchone()[0]
            print(f"  - Utilisateurs en base : {cnt}")
            
            # Rechercher si messanga / charles existe
            cursor.execute("SELECT id, email, role, is_active FROM evisa_user WHERE email LIKE '%messanga%' OR email LIKE '%charles%';")
            found = cursor.fetchall()
            if found:
                print(f"  - [WARNING] Cibles encore présentes : {[f[1] for f in found]}")
                print("  - Exécution de la purge directe SQL...")
                for u_id, u_email, u_role, u_active in found:
                    if u_email == 'admin@test.com':
                        continue
                    print(f"    -> Suppression de {u_email} (ID: {u_id})")
                    
                    # Supprimer des tables de demandes de visa si elles existent
                    for app_table in ['evisa_application', 'visa_applications_visaapplication']:
                        if app_table in tables:
                            cursor.execute(f"DELETE FROM {app_table} WHERE applicant_id = ?;", (u_id,))
                    
                    # Supprimer les tokens
                    for token_table in ['token_blacklist_outstandingtoken', 'token_blacklist_blacklistedtoken']:
                        if token_table in tables:
                            if token_table == 'token_blacklist_blacklistedtoken' and 'token_blacklist_outstandingtoken' in tables:
                                cursor.execute("DELETE FROM token_blacklist_blacklistedtoken WHERE token_id IN (SELECT id FROM token_blacklist_outstandingtoken WHERE user_id = ?);", (u_id,))
                            elif token_table == 'token_blacklist_outstandingtoken':
                                cursor.execute("DELETE FROM token_blacklist_outstandingtoken WHERE user_id = ?;", (u_id,))
                                
                    cursor.execute("DELETE FROM evisa_user WHERE id = ?;", (u_id,))
                conn.commit()
                print("    [OK] Purge directe effectuée.")
            else:
                print("  - Cibles présentes : AUCUNE")
        else:
            print("  - La table evisa_user n'existe pas dans cette base.")
        conn.close()
    except Exception as db_err:
        print(f"  - [ERREUR] Impossible de lire cette base : {db_err}")

# 2. Rechercher TOUS les fichiers .env (sans aucun filtrage)
print("\n--- RECHERCHE DE TOUS LES FICHIERS .env ---")
all_env_files = []
for root, dirs, files in os.walk(user_home):
    # Éviter de scanner des répertoires trop profonds ou système inutiles pour aller vite
    if any(p in root for p in ['.git', '.venv', 'venv', 'node_modules', '.cache', 'tmp']):
        continue
    for file in files:
        if file.startswith('.env'):
            all_env_files.append(os.path.join(root, file))

for env in all_env_files:
    print(f"\nFichier .env trouvé : {env}")
    try:
        with open(env, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip()
                    display_val = '********' if any(secret in key.lower() for secret in ['password', 'key', 'secret', 'token']) else val.strip().strip('\'"')
                    print(f"  - {key} = {display_val}")
    except Exception as env_err:
        print(f"  - [ERREUR] Impossible de lire : {env_err}")

# 3. Vérification du fichier WSGI actuel
print("\n--- ANALYSE DU FICHIER WSGI ---")
try:
    wsgi_files = glob.glob('/var/www/*_wsgi.py')
    if wsgi_files:
        print(f"WSGI trouvé : {wsgi_files[0]}")
        with open(wsgi_files[0], 'r', encoding='utf-8') as f:
            for line in f:
                print(f"  {line.rstrip()}")
except Exception as wsgi_err:
    print(f"Erreur WSGI : {wsgi_err}")

print("\n=== FIN DU DIAGNOSTIC COMPLET ===")

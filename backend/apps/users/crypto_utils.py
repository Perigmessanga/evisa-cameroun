# pyrefly: ignore [missing-import]
from cryptography.fernet import Fernet
# pyrefly: ignore [missing-import]
from django.conf import settings
import base64
import os

# On utilise la SECRET_KEY de Django pour générer une clé de chiffrement stable
# Fernet nécessite une clé de 32 octets encodée en base64
def get_encryption_key():
    key = settings.SECRET_KEY[:32].encode().ljust(32, b'0')
    return base64.urlsafe_b64encode(key)

def encrypt_data(data):
    if not data:
        return None
    f = Fernet(get_encryption_key())
    return f.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data):
    if not encrypted_data:
        return None
    try:
        f = Fernet(get_encryption_key())
        return f.decrypt(encrypted_data.encode()).decode()
    except Exception:
        # En cas d'erreur (donnée non cryptée par exemple), on retourne la donnée brute
        return encrypted_data

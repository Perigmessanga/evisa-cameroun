"""
Script de génération de certificats SSL auto-signés pour le développement local.
Utilise la bibliothèque `cryptography` déjà installée dans le projet.
"""
import ipaddress
import datetime
import os
from pathlib import Path

from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa

# Dossier de sortie
ssl_dir = Path(__file__).parent / "ssl"
ssl_dir.mkdir(exist_ok=True)

cert_file = ssl_dir / "cert.pem"
key_file  = ssl_dir / "key.pem"

print("[1/2] Generation de la cle privee RSA 2048 bits...")
key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

print("[2/2] Creation du certificat auto-signe...")
subject = issuer = x509.Name([
    x509.NameAttribute(NameOID.COUNTRY_NAME, "CM"),
    x509.NameAttribute(NameOID.ORGANIZATION_NAME, "eVisa Cameroun Dev"),
    x509.NameAttribute(NameOID.COMMON_NAME, "127.0.0.1"),
])

cert = (
    x509.CertificateBuilder()
    .subject_name(subject)
    .issuer_name(issuer)
    .public_key(key.public_key())
    .serial_number(x509.random_serial_number())
    .not_valid_before(datetime.datetime.now(datetime.timezone.utc))
    .not_valid_after(datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=825))
    .add_extension(
        x509.SubjectAlternativeName([
            x509.IPAddress(ipaddress.ip_address("127.0.0.1")),
            x509.DNSName("localhost"),
        ]),
        critical=False,
    )
    .sign(key, hashes.SHA256())
)

# Écriture de la clé privée
with open(key_file, "wb") as f:
    f.write(key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption(),
    ))

# Écriture du certificat
with open(cert_file, "wb") as f:
    f.write(cert.public_bytes(serialization.Encoding.PEM))

print(f"OK  Certificats generes dans : {ssl_dir}")
print(f"    Cle privee : {key_file}")
print(f"    Certificat : {cert_file}")
print()
print("Pour lancer Django en HTTPS :")
print("  venv\\Scripts\\uvicorn evisa_backend.asgi:application --host 127.0.0.1 --port 8000 --ssl-keyfile ssl/key.pem --ssl-certfile ssl/cert.pem --reload")

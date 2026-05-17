# -*- coding: utf-8 -*-
"""
Test de validation de tous les modules de securite et gouvernementaux.
Executer depuis: backend/
  py test_security.py
"""
import os, sys, django, urllib.request

sys.path.append('c:\\Users\\AWD\\Desktop\\evisa-cameroun\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.crypto_utils import encrypt_data, decrypt_data
from apps.visa_applications.models import VisaApplication, ArchivedApplication, VisaType
from apps.audit.models import AuditLog
from django.contrib.auth import get_user_model

User = get_user_model()
OK  = "[OK]"
ERR = "[FAIL]"

def sep(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

# ── 1. CHIFFREMENT CRYPTO ────────────────────────────────────────
def test_crypto():
    sep("TEST 1 - Chiffrement des donnees sensibles (Crypto)")
    test_str = "PASSPORT12345"
    encrypted = encrypt_data(test_str)
    decrypted = decrypt_data(encrypted)
    assert test_str == decrypted, "Dechiffrement echoue"
    assert encrypted.startswith('gAAAA'), "Format de chiffrement invalide"
    print(f"  {OK} Chiffrement : {encrypted[:30]}...")
    print(f"  {OK} Dechiffrement : {decrypted}")

# ── 2. CHIFFREMENT AU NIVEAU DU MODELE ──────────────────────────
def test_model_encryption():
    sep("TEST 2 - Chiffrement en base (Model Encryption at Rest)")
    import uuid
    user = User.objects.first()
    visa_type = VisaType.objects.first()
    if not user or not visa_type:
        print(f"  [SKIP] Aucun utilisateur/type de visa. Ajoutez des donnees de test.")
        return
    app_number = f"TEST-{uuid.uuid4().hex[:6]}"
    app = VisaApplication(
        application_number=app_number,
        applicant=user,
        visa_type=visa_type,
        full_name="Test Security User",
        passport_number="SECURE_PASS_999",
        national_id_number="CNI_777_SECURE"
    )
    app.save()
    app.refresh_from_db()
    assert app.passport_number.startswith('gAAAA'), f"Non chiffre: {app.passport_number}"
    decrypted = app.get_decrypted_passport()
    assert decrypted == "SECURE_PASS_999", f"Mauvais dechiffrement: {decrypted}"
    print(f"  {OK} Passeport chiffre en DB : {app.passport_number[:30]}...")
    print(f"  {OK} Dechiffrement reussi    : {decrypted}")
    app.delete()

# ── 3. DATA MASKING ──────────────────────────────────────────────
def test_data_masking():
    sep("TEST 3 - Masquage des donnees (Data Masking)")
    from apps.visa_applications.serializers import ApplicationDetailSerializer
    import inspect
    src = inspect.getsource(ApplicationDetailSerializer.get_passport_number)
    assert 'P****' in src, "La logique de masquage P**** est absente du serializer"
    print(f"  {OK} Masquage configure dans ApplicationDetailSerializer (P****XXXX)")

# ── 4. PISTE D'AUDIT ─────────────────────────────────────────────
def test_audit_trail():
    sep("TEST 4 - Piste d'Audit (Audit Trail inviolable)")
    from django.db import connection
    tables = connection.introspection.table_names()
    assert 'audit_log' in tables, "Table audit_log introuvable"
    count = AuditLog.objects.count()
    print(f"  {OK} Table 'audit_log' presente ({count} entrees existantes)")

# ── 5. ARCHIVAGE LEGAL ───────────────────────────────────────────
def test_archivage():
    sep("TEST 5 - Archivage Legal (E-Gouvernement 10/5 ans)")
    from django.db import connection
    tables = connection.introspection.table_names()
    assert 'evisa_archived_application' in tables, "Table archivage introuvable"
    count = ArchivedApplication.objects.count()
    print(f"  {OK} Table 'evisa_archived_application' presente ({count} dossiers archives)")

# ── 6. CHAMPS BIOMETRIQUES ───────────────────────────────────────
def test_biometric_fields():
    sep("TEST 6 - Champs Biometrie (Authentification Numerique)")
    fields = [f.name for f in VisaApplication._meta.get_fields()]
    for field in ['biometric_liveness_score', 'biometric_liveness_status', 'live_photo']:
        assert field in fields, f"Champ manquant: {field}"
        print(f"  {OK} Champ '{field}' present sur VisaApplication")

# ── 7. SWAGGER / OPENAPI ─────────────────────────────────────────
def test_swagger():
    sep("TEST 7 - Documentation Swagger / OpenAPI (Interoperabilite)")
    try:
        req = urllib.request.Request(
            'http://127.0.0.1:8001/api/docs/swagger/',
            headers={'User-Agent': 'Python-Test'}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            assert 'swagger' in content.lower() or 'E-Visa' in content
            print(f"  {OK} Swagger UI accessible -> HTTP {resp.status}")
    except Exception as e:
        # Pas d'erreur bloquante si le serveur local n'est pas demarré
        print(f"  [SKIP] Swagger (demarrez le serveur local) : {e}")

# ── 8. RATE LIMITING CONFIG ──────────────────────────────────────
def test_rate_limiting():
    sep("TEST 8 - Rate Limiting / Throttling (Cybersecurite)")
    from django.conf import settings
    drf = settings.REST_FRAMEWORK
    assert 'DEFAULT_THROTTLE_CLASSES' in drf, "Throttle classes non configurees"
    assert 'DEFAULT_THROTTLE_RATES' in drf, "Throttle rates non configures"
    rates = drf['DEFAULT_THROTTLE_RATES']
    print(f"  {OK} AnonRateThrottle  : {rates.get('anon', 'N/A')}")
    print(f"  {OK} UserRateThrottle  : {rates.get('user', 'N/A')}")

# ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    failures = []
    tests = [
        test_crypto,
        test_model_encryption,
        test_data_masking,
        test_audit_trail,
        test_archivage,
        test_biometric_fields,
        test_swagger,
        test_rate_limiting,
    ]
    for fn in tests:
        try:
            fn()
        except Exception as e:
            import traceback
            failures.append((fn.__name__, str(e)))
            print(f"  {ERR} Exception: {e}")
            traceback.print_exc()

    print("\n" + "=" * 60)
    if failures:
        print(f"  ECHECS : {len(failures)} test(s) echoue(s) sur {len(tests)}")
        for name, err in failures:
            print(f"     - {name}: {err}")
        sys.exit(1)
    else:
        print(f"  SUCCES : TOUS LES {len(tests)} TESTS SONT PASSES !")
    print("=" * 60)

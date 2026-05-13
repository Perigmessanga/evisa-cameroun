import os
import django
import sys

# Setup Django environment
sys.path.append('c:\\Users\\AWD\\Desktop\\evisa-cameroun\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'evisa_backend.settings')
django.setup()

from apps.users.crypto_utils import encrypt_data, decrypt_data
from apps.visa_applications.models import VisaApplication, VisaType
from django.contrib.auth import get_user_model

User = get_user_model()

def test_crypto():
    print("--- Testing Crypto Utils ---")
    test_str = "PASSPORT12345"
    encrypted = encrypt_data(test_str)
    print(f"Original: {test_str}")
    print(f"Encrypted: {encrypted}")
    decrypted = decrypt_data(encrypted)
    print(f"Decrypted: {decrypted}")
    assert test_str == decrypted
    print("Crypto Utils Test: SUCCESS")

def test_model_encryption():
    print("\n--- Testing Model Encryption ---")
    # Get a dummy user and visa type
    user = User.objects.first()
    visa_type = VisaType.objects.first()
    
    if not user or not visa_type:
        print("Error: Need at least one user and one visa type in DB to run this test.")
        return

    import uuid
    print(f"VisaApplication module: {VisaApplication.__module__}")
    app_number = f"TEST-ENCRYPT-{uuid.uuid4().hex[:6]}"
    app = VisaApplication(
        application_number=app_number,
        applicant=user,
        visa_type=visa_type,
        full_name="Test Encryption User",
        passport_number="SECURE_PASS_999",
        national_id_number="CNI_777_SECURE"
    )
    # Save will trigger encryption
    app.save()
    
    print(f"Application created: {app.application_number}")
    
    # Reload from DB
    app.refresh_from_db()
    
    print(f"Stored Passport (should be encrypted): {app.passport_number}")
    assert app.passport_number.startswith('gAAAA')
    
    decrypted_pass = app.get_decrypted_passport()
    print(f"Decrypted Passport: {decrypted_pass}")
    assert decrypted_pass == "SECURE_PASS_999"
    
    decrypted_id = app.get_decrypted_national_id()
    print(f"Decrypted National ID: {decrypted_id}")
    assert decrypted_id == "CNI_777_SECURE"
    
    # Cleanup
    app.delete()
    print("Model Encryption Test: SUCCESS")

if __name__ == "__main__":
    try:
        test_crypto()
        test_model_encryption()
    except Exception as e:
        print(f"TEST FAILED: {e}")
        import traceback
        traceback.print_exc()

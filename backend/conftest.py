import pytest
from django.contrib.auth import get_user_model
from apps.visa_applications.models import VisaType, VisaApplication, ProcessingType

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="test@example.com",
        password="password123",
        first_name="Test",
        last_name="User"
    )

@pytest.fixture
def visa_type(db):
    return VisaType.objects.create(
        name="Tourisme",
        code="TOUR",
        fee=50000.00,
        validity_days=90,
        max_stay_days=30
    )

@pytest.fixture
def visa_application(db, user, visa_type):
    return VisaApplication.objects.create(
        applicant=user,
        visa_type=visa_type,
        full_name="Jean Dupont",
        nationality="Française",
        passport_number="AB123456",
        processing_type=ProcessingType.STANDARD
    )

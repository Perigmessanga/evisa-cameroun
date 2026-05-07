import pytest
from apps.visa_applications.models import VisaApplication, ProcessingType

@pytest.mark.django_db
def test_visa_application_creation(visa_application):
    """Vérifie qu'une demande est créée avec le bon type par défaut"""
    assert visa_application.processing_type == ProcessingType.STANDARD
    assert "Jean Dupont" in str(visa_application)

@pytest.mark.django_db
def test_visa_application_express_switch(visa_application):
    """Vérifie qu'on peut passer une demande en Express"""
    visa_application.processing_type = ProcessingType.EXPRESS
    visa_application.save()
    
    updated_app = VisaApplication.objects.get(id=visa_application.id)
    assert updated_app.processing_type == ProcessingType.EXPRESS

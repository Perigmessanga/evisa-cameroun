import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.visa_applications.models import ProcessingType

@pytest.mark.django_db
def test_initiate_payment_standard_price(user, visa_application, visa_type):
    """Vérifie que le prix est le prix de base pour un traitement Standard"""
    client = APIClient()
    client.force_authenticate(user=user)
    
    url = reverse('payment-initiate')
    data = {
        "application_id": str(visa_application.id),
        "payment_method": "CARD"
    }
    
    response = client.post(url, data, format='json')
    
    assert response.status_code == 201
    assert float(response.data['payment']['amount']) == float(visa_type.fee)

@pytest.mark.django_db
def test_initiate_payment_express_price(user, visa_application, visa_type):
    """Vérifie que le supplément de 25 000 est ajouté pour un traitement Express"""
    # Passer en express
    visa_application.processing_type = ProcessingType.EXPRESS
    visa_application.save()
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    url = reverse('payment-initiate')
    data = {
        "application_id": str(visa_application.id),
        "payment_method": "CARD"
    }
    
    response = client.post(url, data, format='json')
    
    assert response.status_code == 201
    expected_amount = float(visa_type.fee) + 25000
    assert float(response.data['payment']['amount']) == expected_amount

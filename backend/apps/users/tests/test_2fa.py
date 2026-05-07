import pytest
import pyotp
from django.urls import reverse
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_2fa_setup_flow(user):
    """Vérifie la génération du secret TOTP"""
    client = APIClient()
    client.force_authenticate(user=user)
    
    url = reverse('2fa-setup')
    response = client.get(url)
    
    assert response.status_code == 200
    assert 'secret' in response.data
    assert 'qr_code' in response.data
    
    user.refresh_from_db()
    assert user.two_factor_secret is not None

@pytest.mark.django_db
def test_2fa_verify_success(user):
    """Vérifie l'activation avec un code valide"""
    # Pré-configurer le secret
    user.two_factor_secret = pyotp.random_base32()
    user.save()
    
    # Générer un code valide
    totp = pyotp.TOTP(user.two_factor_secret)
    valid_code = totp.now()
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    url = reverse('2fa-verify')
    response = client.post(url, {'code': valid_code}, format='json')
    
    assert response.status_code == 200
    user.refresh_from_db()
    assert user.two_factor_enabled is True

@pytest.mark.django_db
def test_2fa_verify_failure(user):
    """Vérifie le rejet d'un code invalide"""
    user.two_factor_secret = pyotp.random_base32()
    user.save()
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    url = reverse('2fa-verify')
    response = client.post(url, {'code': '000000'}, format='json')
    
    assert response.status_code == 400
    user.refresh_from_db()
    assert user.two_factor_enabled is False

"""
Utilitaires globaux — Plateforme e-Visa Cameroun
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Gestionnaire d'exceptions personnalisé.
    Retourne toujours une réponse JSON uniforme.
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            'success': False,
            'message': 'Une erreur est survenue.',
            'errors': response.data,
            'status_code': response.status_code,
        }
        # Message lisible selon le code HTTP
        messages = {
            400: 'Données invalides.',
            401: 'Authentification requise.',
            403: 'Accès refusé.',
            404: 'Ressource introuvable.',
            405: 'Méthode non autorisée.',
            429: 'Trop de requêtes. Veuillez patienter.',
            500: 'Erreur interne du serveur.',
        }
        error_data['message'] = messages.get(response.status_code, error_data['message'])
        response.data = error_data

    return response


def api_response(data=None, message='Succès', status_code=status.HTTP_200_OK, errors=None):
    """
    Réponse API unifiée.
    Usage : return api_response(data=serializer.data, message='Créé avec succès', status_code=201)
    """
    response_data = {
        'success': errors is None,
        'message': message,
    }
    if data is not None:
        response_data['data'] = data
    if errors is not None:
        response_data['errors'] = errors

    return Response(response_data, status=status_code)
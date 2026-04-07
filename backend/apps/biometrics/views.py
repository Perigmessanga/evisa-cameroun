from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from apps.biometrics.models import BiometricData
from apps.biometrics.serializers import (
    BiometricDataSerializer,
    BiometricDataCreateSerializer,
    BiometricVerificationSerializer
)


class BiometricDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les données biométriques.
    """
    serializer_class = BiometricDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Les demandeurs voient leurs données
        if user.is_applicant:
            return BiometricData.objects.filter(application__applicant=user)
        
        # Les agents et admins voient tout
        elif user.is_agent or user.is_admin:
            return BiometricData.objects.all()
        
        return BiometricData.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return BiometricDataCreateSerializer
        return BiometricDataSerializer

    def create(self, request, *args, **kwargs):
        """
        Uploader une photo faciale pour la biométrie.
        POST /api/biometrics/
        Form-data: {
            "application": "uuid",
            "face_image": file
        }
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Vérifier que l'application appartient au demandeur
        application = serializer.validated_data['application']
        if application.applicant != request.user:
            return Response({
                'error': 'Vous ne pouvez pas ajouter des données biométriques pour cette demande.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # TODO: Traiter l'image avec face-api.js ou TensorFlow
        # - Détecter le visage
        # - Vérifier la vivacité (liveness detection)
        # - Extraire l'encodage facial
        # - Calculer le score de qualité
        
        # Pour l'édition de brouillon, si la biométrie existe déjà, on la supprime pour la remplacer
        if hasattr(application, 'biometric_data'):
            application.biometric_data.delete()

        # Enregistrer les nouvelles données
        biometric_data = serializer.save()
        
        # Simuler un score de qualité
        biometric_data.quality_score = 0.85
        biometric_data.liveness_verified = True
        biometric_data.save()
        
        return Response(
            BiometricDataSerializer(biometric_data).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """
        Vérifier/valider les données biométriques (agents uniquement).
        POST /api/biometrics/{id}/verify/
        Body: { "is_verified": true }
        """
        user = request.user
        
        if not (user.is_agent or user.is_admin):
            return Response({
                'error': 'Vous n\'avez pas la permission de vérifier les données biométriques.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        biometric_data = self.get_object()
        
        serializer = BiometricVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        biometric_data.is_verified = serializer.validated_data['is_verified']
        biometric_data.verified_at = timezone.now()
        biometric_data.verified_by = user
        biometric_data.save()
        
        return Response({
            'message': 'Données biométriques vérifiées.',
            'biometric_data': BiometricDataSerializer(biometric_data).data
        })

    @action(detail=True, methods=['post'])
    def compare(self, request, pk=None):
        """
        Comparer avec une autre photo (ex: photo du passeport).
        POST /api/biometrics/{id}/compare/
        Form-data: { "comparison_image": file }
        """
        user = request.user
        
        if not (user.is_agent or user.is_admin):
            return Response({
                'error': 'Permission refusée.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        biometric_data = self.get_object()
        comparison_image = request.FILES.get('comparison_image')
        
        if not comparison_image:
            return Response({
                'error': 'Image de comparaison requise.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # TODO: Implémenter la comparaison faciale
        # - Extraire l'encodage de l'image de comparaison
        # - Calculer la distance avec l'encodage stocké
        # - Retourner un score de similarité
        
        # Simulation
        similarity_score = 0.92  # Score entre 0 et 1
        is_match = similarity_score > 0.85
        
        return Response({
            'similarity_score': similarity_score,
            'is_match': is_match,
            'threshold': 0.85,
            'message': 'Match trouvé' if is_match else 'Pas de correspondance'
        })
# Create your views here.

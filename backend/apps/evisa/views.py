from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from datetime import timedelta
import qrcode
import io
import base64

from apps.evisa.models import EVisa, BorderCrossing
from apps.evisa.serializers import (
    EVisaSerializer,
    EVisaRevokeSerializer,
    BorderCrossingSerializer,
    BorderCrossingCreateSerializer,
    EVisaVerifySerializer
)


class EVisaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour consulter les e-visas.
    GET /api/evisas/           - Liste mes e-visas
    GET /api/evisas/{id}/      - Détails d'un e-visa
    """
    serializer_class = EVisaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Les demandeurs voient leurs e-visas
        if user.is_applicant:
            return EVisa.objects.filter(application__applicant=user)
        
        # Les agents frontaliers voient tous les e-visas valides
        elif user.is_border_agent:
            return EVisa.objects.filter(is_revoked=False)
        
        # Les admins voient tout
        elif user.is_admin:
            return EVisa.objects.all()
        
        return EVisa.objects.none()

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Télécharger le PDF de l'e-visa.
        GET /api/evisas/{id}/download/
        """
        evisa = self.get_object()
        
        # Vérifier les permissions
        if request.user.is_applicant and evisa.application.applicant != request.user:
            return Response({
                'error': 'Vous ne pouvez pas télécharger cet e-visa.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # TODO: Retourner le fichier PDF
        # Pour l'instant, on retourne juste le chemin
        return Response({
            'pdf_url': f"/media/{evisa.pdf_file_path}",
            'visa_number': evisa.visa_number
        })

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """
        Révoquer un e-visa (admin uniquement).
        POST /api/evisas/{id}/revoke/
        Body: { "revocation_reason": "..." }
        """
        if not request.user.is_admin:
            return Response({
                'error': 'Seuls les administrateurs peuvent révoquer un e-visa.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        evisa = self.get_object()
        
        if evisa.is_revoked:
            return Response({
                'error': 'Cet e-visa est déjà révoqué.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = EVisaRevokeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        evisa.is_revoked = True
        evisa.revocation_date = timezone.now()
        evisa.revocation_reason = serializer.validated_data['revocation_reason']
        evisa.save()
        
        # TODO: Envoyer notification
        
        return Response({
            'message': 'e-Visa révoqué.',
            'evisa': EVisaSerializer(evisa).data
        })


class VerifyEVisaView(generics.GenericAPIView):
    """
    Vérifier la validité d'un e-visa (agents frontières).
    POST /api/evisas/verify/
    Body: {
        "visa_number": "CM-VISA-2026-000001"
        OU
        "qr_code_data": "..."
    }
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EVisaVerifySerializer

    def post(self, request):
        user = request.user
        
        if not user.is_border_agent:
            return Response({
                'error': 'Seuls les agents frontières peuvent vérifier les e-visas.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        visa_number = serializer.validated_data.get('visa_number')
        qr_code_data = serializer.validated_data.get('qr_code_data')
        
        # Rechercher l'e-visa
        evisa = None
        if visa_number:
            try:
                evisa = EVisa.objects.get(visa_number=visa_number)
            except EVisa.DoesNotExist:
                pass
        elif qr_code_data:
            # Le QR code contient le visa_number
            try:
                evisa = EVisa.objects.get(visa_number=qr_code_data)
            except EVisa.DoesNotExist:
                pass
        
        if not evisa:
            return Response({
                'valid': False,
                'message': 'e-Visa introuvable.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Vérifier la validité
        is_valid = evisa.is_valid
        
        return Response({
            'valid': is_valid,
            'evisa': EVisaSerializer(evisa).data if is_valid else None,
            'message': self._get_validation_message(evisa)
        })
    
    def _get_validation_message(self, evisa):
        if evisa.is_revoked:
            return 'e-Visa révoqué.'
        elif evisa.expiry_date < timezone.now().date():
            return 'e-Visa expiré.'
        else:
            return 'e-Visa valide.'


class BorderCrossingViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour enregistrer les passages frontières.
    """
    serializer_class = BorderCrossingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Les agents frontières voient leurs enregistrements
        if user.is_border_agent:
            return BorderCrossing.objects.filter(border_agent=user)
        
        # Les admins voient tout
        elif user.is_admin:
            return BorderCrossing.objects.all()
        
        return BorderCrossing.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return BorderCrossingCreateSerializer
        return BorderCrossingSerializer

    def create(self, request, *args, **kwargs):
        """
        Enregistrer un passage (entrée/sortie).
        POST /api/border-crossings/
        """
        if not request.user.is_border_agent:
            return Response({
                'error': 'Seuls les agents frontières peuvent enregistrer des passages.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        crossing = serializer.save(border_agent=request.user)
        
        return Response(
            BorderCrossingSerializer(crossing).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Statistiques des passages frontières.
        GET /api/border-crossings/stats/
        """
        if not (request.user.is_border_agent or request.user.is_admin):
            return Response({
                'error': 'Permission refusée.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        from django.db.models import Count
        
        today = timezone.now().date()
        
        stats = {
            'today': {
                'entries': BorderCrossing.objects.filter(
                    crossing_type='ENTRY',
                    crossing_date__date=today
                ).count(),
                'exits': BorderCrossing.objects.filter(
                    crossing_type='EXIT',
                    crossing_date__date=today
                ).count(),
            },
            'total': BorderCrossing.objects.count(),
        }
        
        return Response(stats)


def generate_qr_code(visa_number):
    """Fonction utilitaire pour générer un QR code."""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(visa_number)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return img_base64
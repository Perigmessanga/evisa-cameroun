from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.http import FileResponse
from datetime import timedelta
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import qrcode
import io
import base64
import tempfile

from apps.evisa.models import EVisa, BorderCrossing, SystemSetting, ContactMessage
from apps.evisa.serializers import (
    EVisaSerializer,
    EVisaRevokeSerializer,
    BorderCrossingSerializer,
    BorderCrossingCreateSerializer,
    EVisaVerifySerializer,
    SystemSettingSerializer,
    ContactMessageSerializer
)
from django.core.mail import send_mail


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des messages de contact.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def check_permissions(self, request):
        super().check_permissions(request)
        if self.action != 'create' and not getattr(request.user, 'is_admin', False):
            self.permission_denied(
                request,
                message="Seuls les administrateurs peuvent accéder aux messages."
            )

    def perform_create(self, serializer):
        # Sauvegarder le message de contact
        message = serializer.save()
        
        # Envoyer un email de notification à l'admin
        # messangaperig3@gmail.com
        send_mail(
            subject=f"Nouveau Message e-Visa: {message.subject}",
            message=f"De: {message.first_name} {message.last_name} ({message.email})\n\n{message.message}",
            from_email='no-reply@evisa.cm',
            recipient_list=['messangaperig3@gmail.com'],
            fail_silently=True,
        )

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """
        Répondre à un message de contact.
        Body: { "reply_message": "..." }
        """
        message = self.get_object()
        reply_text = request.data.get('reply_message')
        
        if not reply_text:
            return Response({'error': 'Message de réponse requis.'}, status=status.HTTP_400_BAD_REQUEST)
        
        message.reply_message = reply_text
        message.status = 'REPLIED'
        message.replied_by = request.user
        message.replied_at = timezone.now()
        message.save()
        
        # Envoi de l'email à l'utilisateur
        send_mail(
            subject=f"Réponse: {message.subject}",
            message=f"Bonjour {message.first_name},\n\nSuite à votre message :\n\"{message.message}\"\n\nVoici notre réponse :\n{reply_text}\n\nCordialement,\nSupport e-Visa Cameroun",
            from_email='no-reply@evisa.cm',
            recipient_list=[message.email],
            fail_silently=True,
        )
        
        return Response({'status': 'Message répondu avec succès.'})


class SystemSettingViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des paramètres système par les administrateurs.
    """
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    # Seuls les admins peuvent modifier les configurations système
    # (Ou on peut faire un permission personnalisée, ici on check le rôle de l'utilisateur)
    permission_classes = [IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not getattr(request.user, 'is_admin', False):
            self.permission_denied(
                request,
                message="Seuls les administrateurs peuvent modifier les paramètres."
            )

    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """
        Mettre à jour plusieurs paramètres en une seule requête.
        Body: { "smtpHost": "...", "maintenanceMode": "1" }
        """
        data = request.data
        updates = []
        for key, value in data.items():
            setting, created = SystemSetting.objects.get_or_create(key=key)
            setting.value = str(value)
            setting.save()
            updates.append(setting)
        
        return Response({'status': 'success', 'updated': len(updates)})


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
        
        # Générer PDF
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # En-tête
        p.setFont("Helvetica-Bold", 24)
        p.drawString(100, height - 100, "RÉPUBLIQUE DU CAMEROUN")
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, height - 130, "VISA ÉLECTRONIQUE (e-Visa)")
        
        # Informations
        p.setFont("Helvetica", 14)
        y_pos = height - 180
        p.drawString(100, y_pos, f"Numéro de Visa : {evisa.visa_number}")
        p.drawString(100, y_pos - 25, f"Nom complet : {evisa.application.full_name}")
        p.drawString(100, y_pos - 50, f"Numéro de passeport : {evisa.application.passport_number}")
        p.drawString(100, y_pos - 75, f"Date d'émission : {evisa.issue_date.strftime('%Y-%m-%d')}")
        p.drawString(100, y_pos - 100, f"Date d'expiration : {evisa.expiry_date.strftime('%Y-%m-%d')}")
        p.drawString(100, y_pos - 125, f"Type de Visa : {evisa.application.visa_type.name}")
        
        # QR Code
        qr_img = qrcode.make(evisa.visa_number)
        with tempfile.NamedTemporaryFile(delete=True, suffix=".png") as tmp:
            qr_img.save(tmp.name)
            p.drawImage(tmp.name, 100, y_pos - 300, width=150, height=150)
            
        # Mention de validité
        p.setFont("Helvetica-Oblique", 10)
        p.drawString(100, 50, "Ceci est un document électronique officiel. Scannez le QR code pour vérification.")
        
        p.showPage()
        p.save()
        buffer.seek(0)
        
        response = FileResponse(buffer, as_attachment=True, filename=f"evisa_{evisa.visa_number}.pdf")
        response['Content-Type'] = 'application/pdf'
        return response

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

    @action(detail=True, methods=['post'])
    def flag_fraud(self, request, pk=None):
        """
        Signaler une anomalie ou fraude sur un e-visa (agents frontières).
        POST /api/evisas/{id}/flag_fraud/
        Body: { "notes": "Le passeport semble falsifié..." }
        """
        if not request.user.is_border_agent:
            return Response({
                'error': 'Seuls les agents frontières peuvent signaler une fraude.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        evisa = self.get_object()
        notes = request.data.get('notes', 'Aucun détail fourni.')
        
        # Enregistrer une alerte/révoquer temporairement
        evisa.is_revoked = True
        evisa.revocation_date = timezone.now()
        evisa.revocation_reason = f"ALERTE FRAUDE (Signalé par {request.user.get_full_name()}) : {notes}"
        evisa.save()
        
        # TODO: Alerter administrateurs / Immigration par email ou notification
        
        return Response({
            'message': 'Fraude signalée avec succès. L\'e-Visa a été révoqué par sécurité.',
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

    @action(detail=False, methods=['get'])
    def history(self, request):
        """
        Historique des passages pour un visa donné.
        GET /api/border-crossings/history/?visa_number=...
        """
        if not (request.user.is_border_agent or request.user.is_admin):
            return Response({
                'error': 'Permission refusée.'
            }, status=status.HTTP_403_FORBIDDEN)
            
        visa_number = request.query_params.get('visa_number')
        if not visa_number:
            return Response({
                'error': 'Le paramètre visa_number est requis.'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        crossings = BorderCrossing.objects.filter(
            evisa__visa_number=visa_number
        ).select_related('evisa', 'border_agent').order_by('-crossing_date')
        
        # Ajouter le support de l'auteur
        serializer = self.get_serializer(crossings, many=True)
        return Response(serializer.data)


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
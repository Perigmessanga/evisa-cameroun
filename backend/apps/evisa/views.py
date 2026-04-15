from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, renderer_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.http import FileResponse
from datetime import timedelta
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
import qrcode
import io
import base64
import tempfile
import os

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
from django.conf import settings


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des messages de contact.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    pagination_class = None

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
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[message.email],
            fail_silently=False,
        )
        
        return Response({'status': 'Message répondu avec succès.'})


class SystemSettingViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des paramètres système par les administrateurs.
    """
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    pagination_class = None
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
    pagination_class = None

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

    @renderer_classes([])
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
        
        # ── COULEURS ──
        from reportlab.lib.colors import HexColor
        CM_GREEN = HexColor("#007A5E")
        CM_RED   = HexColor("#CE1126")
        CM_GOLD  = HexColor("#FCD116")
        TEXT_DARK = HexColor("#1A1F16")
        TEXT_MUTED = HexColor("#64748B")
        
        # ── BARRE DE COULEUR TOP (Gradiant simulation) ──
        p.setLineWidth(0)
        p.setFillColor(HexColor("#DCFCE7")) # Green Pale
        p.rect(0, height - 12, width/3, 12, fill=1)
        p.setFillColor(CM_GREEN)
        p.rect(width/3, height - 12, width/3, 12, fill=1)
        p.setFillColor(CM_GOLD)
        p.rect(2*width/3, height - 12, width/3, 12, fill=1)
        
        # ── DRAPEAU DU CAMEROUN (Petit Format) ──
        flag_x, flag_y = 50, height - 85
        flag_w, flag_h = 45, 30
        p.setFillColor(CM_GREEN)
        p.rect(flag_x, flag_y, flag_w/3, flag_h, fill=1)
        p.setFillColor(CM_RED)
        p.rect(flag_x + flag_w/3, flag_y, flag_w/3, flag_h, fill=1)
        p.setFillColor(CM_GOLD)
        p.rect(flag_x + 2*flag_w/3, flag_y, flag_w/3, flag_h, fill=1)
        # Étoile
        p.setFillColor(CM_GOLD)
        p.setFont("Helvetica-Bold", 8)
        p.drawCentredString(flag_x + flag_w/2, flag_y + flag_h/2 - 2, "★")

        # ── EN-TÊTE ──
        p.setFillColor(TEXT_DARK)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(110, height - 65, "RÉPUBLIQUE DU CAMEROUN")
        p.setFont("Helvetica-Bold", 10)
        p.setFillColor(CM_GOLD)
        p.drawString(110, height - 78, "REPUBLIC OF CAMEROON")
        p.setFont("Helvetica", 8)
        p.setFillColor(TEXT_MUTED)
        p.drawString(110, height - 92, "Délégation Générale à la Sûreté Nationale")
        
        # E-VISA LABEL (Right)
        p.setFillColor(HexColor("#F1F5F9"))
        p.setFont("Helvetica-Bold", 24)
        p.drawRightString(width - 50, height - 75, "E-VISA")
        p.setFont("Helvetica-Bold", 8)
        p.setFillColor(TEXT_MUTED)
        p.drawRightString(width - 50, height - 88, f"No: {evisa.visa_number}")

        p.setStrokeColor(HexColor("#E2E8F0"))
        p.line(50, height - 110, width - 50, height - 110)

        # ── VISA TITLE ──
        p.setFillColor(TEXT_DARK)
        p.setFont("Helvetica-Bold", 14)
        p.drawCentredString(width/2, height - 140, "VISA ÉLECTRONIQUE / ELECTRONIC VISA")

        y_pos = height - 180
        
        # ── PHOTO & QR COLUMN (RIGHT) ──
        # Photo box
        photo_rect = (width - 160, y_pos - 130, 110, 140)
        
        # Label "PHOTO" (comme demandé "Profile")
        p.setFont("Helvetica-Bold", 8)
        p.setFillColor(TEXT_MUTED)
        p.drawString(photo_rect[0], photo_rect[1] + photo_rect[3] + 5, "PHOTO / PROFILE")
        
        p.setStrokeColor(HexColor("#CBD5E1"))
        p.setLineWidth(1)
        p.rect(*photo_rect)
        
        photo_file = None
        # Priorité : Documents uploadés (PHOTO, puis PASSPORT) > passport_photo (biométrique) > face_image (webcam)
        photo_doc = evisa.application.documents.filter(document_type__in=['PHOTO', 'PASSPORT']).first()
        if photo_doc and photo_doc.file:
            photo_file = photo_doc.file
        
        if not photo_file and hasattr(evisa.application, 'biometric_data'):
            bio = evisa.application.biometric_data
            if bio.passport_photo: photo_file = bio.passport_photo
            elif bio.face_image: photo_file = bio.face_image

        if photo_file:
            try:
                # On ouvre le fichier en mode binaire pour reportlab
                img_data = io.BytesIO(photo_file.read())
                p.drawImage(ImageReader(img_data), photo_rect[0]+2, photo_rect[1]+2, width=photo_rect[2]-4, height=photo_rect[3]-4, preserveAspectRatio=True)
            except Exception as e:
                p.drawCentredString(photo_rect[0]+55, photo_rect[1]+60, "PHOTO")
                print(f"Error drawing photo: {e}")
        else:
            p.setFont("Helvetica", 8)
            p.drawCentredString(photo_rect[0]+55, photo_rect[1]+60, "PHOTO")

        # QR Code
        try:
            qr_data = f"evisa://{evisa.visa_number}"
            qr = qrcode.QRCode(version=1, border=1)
            qr.add_data(qr_data)
            qr.make(fit=True)
            qr_img = qr.make_image(fill_color="black", back_color="white")
            qr_buffer = io.BytesIO()
            qr_img.save(qr_buffer, format="PNG")
            qr_buffer.seek(0)
            p.drawImage(ImageReader(qr_buffer), width - 150, y_pos - 260, width=90, height=90)
        except Exception as e:
            p.setFont("Helvetica", 6)
            p.drawCentredString(width - 105, y_pos - 210, "[QR Error]")
            print(f"QR Error: {e}")
        p.setFont("Helvetica-Bold", 7)
        p.drawCentredString(width - 105, y_pos - 275, f"{evisa.visa_number.split('-')[-1]}")

        # ── INFORMATION FIELDS (LEFT) ──
        def draw_field(title, value, x, y):
            p.setFont("Helvetica-Bold", 8)
            p.setFillColor(TEXT_MUTED)
            p.drawString(x, y, title.upper())
            p.setFont("Helvetica-Bold", 11)
            p.setFillColor(TEXT_DARK)
            p.drawString(x, y - 14, str(value).upper())
            return 35

        curr_y = y_pos
        curr_y -= draw_field("Nom / Surname", evisa.application.full_name.split()[-1] if evisa.application.full_name else "---", 60, curr_y)
        curr_y -= draw_field("Prénoms / Given Names", " ".join(evisa.application.full_name.split()[:-1]) if evisa.application.full_name else "---", 60, curr_y)
        curr_y -= draw_field("Passeport / Passport N°", evisa.application.passport_number, 60, curr_y)
        curr_y -= draw_field("Nationalité / Nationality", evisa.application.nationality, 60, curr_y)
        
        p.line(60, curr_y + 10, width/2 + 50, curr_y + 10)
        curr_y -= 10
        
        curr_y -= draw_field("Type de Visa / Visa Type", evisa.application.visa_type.name, 60, curr_y)
        curr_y -= draw_field("Entrées / Entries", "MULTIPLE", 60, curr_y)
        
        # Dates side by side
        p.setFont("Helvetica-Bold", 8)
        p.setFillColor(TEXT_MUTED)
        p.drawString(60, curr_y, "DÉLIVRÉ LE / ISSUED ON")
        p.drawString(width/2 - 40, curr_y, "VALABLE JUSQU'AU / VALID UNTIL")
        p.setFont("Helvetica-Bold", 11)
        p.setFillColor(TEXT_DARK)
        p.drawString(60, curr_y - 14, evisa.issue_date.strftime('%d %b %Y'))
        p.drawString(width/2 - 40, curr_y - 14, evisa.expiry_date.strftime('%d %b %Y'))

        # ── FOOTER NOTICE ──
        p.setFillColor(HexColor("#F8FAFC"))
        p.rect(50, 60, width - 100, 100, fill=1, stroke=0)
        p.setFillColor(TEXT_MUTED)
        p.setFont("Helvetica-Bold", 9)
        p.drawString(65, 140, "Avis Important :")
        
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.platypus import Paragraph
        styles = getSampleStyleSheet()
        style = styles["Normal"]
        style.fontSize = 8
        style.leading = 10
        style.alignment = 4 # Justify
        style.textColor = TEXT_MUTED
        
        notice_text = "Ce document est un laissez-passer électronique généré par le système d'Information de la DGSN du Cameroun. Vous devez l'imprimer et le présenter accompagné du passeport physique enregistré lors de votre contrôle aux frontières. Toute tentative de falsification entraînera des poursuites selon les lois en vigueur. <i>This document is a computer-generated electronic pass by the DGSN Information System of Cameroon. You must print it and present it along with the physical passport registered during your border control. Any attempt to forge this document will result in prosecution under applicable laws.</i>"
        
        p_notice = Paragraph(notice_text, style)
        p_notice.wrapOn(p, width - 130, 80)
        p_notice.drawOn(p, 65, 75)

        # ── WATERMARK ──
        p.saveState()
        p.translate(width/2, height/2)
        p.rotate(45)
        p.setFont("Helvetica-Bold", 80)
        p.setFillColor(CM_GREEN, alpha=0.03)
        p.drawCentredString(0, 0, "EMBASSY OF CAMEROON")
        p.restoreState()

        p.showPage()
        p.save()
        buffer.seek(0)
        
        from django.http import HttpResponse
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="evisa_{evisa.visa_number}.pdf"'
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
    pagination_class = None

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
        if not (request.user.role == 'BORDER' or request.user.role == 'ADMIN'):
            return Response({
                'error': 'Permissions insuffisantes pour enregistrer des passages.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        evisa = serializer.validated_data['evisa']
        crossing_type = serializer.validated_data['crossing_type']
        
        # Enregistrer le passage
        crossing = serializer.save(border_agent=request.user)
        
        # Logique spécifique entrée/sortie
        applicant_email = evisa.application.applicant.email
        applicant_name = evisa.application.full_name
        
        if crossing_type == 'ENTRY':
            # Calcul de la date de sortie prévue basée sur le type de visa
            max_stay = evisa.application.visa_type.max_stay_days
            expected_exit = crossing.crossing_date.date() + timedelta(days=max_stay)
            crossing.expected_exit_date = expected_exit
            crossing.save(update_fields=['expected_exit_date'])
            
            # Notification E-mail au demandeur
            subject = "Bienvenue au Cameroun - Informations sur votre séjour"
            message = (
                f"Bonjour {applicant_name},\n\n"
                f"Votre entrée sur le territoire camerounais a été enregistrée le {crossing.crossing_date.strftime('%d/%m/%Y')}.\n"
                f"Selon votre type de visa ({evisa.application.visa_type.name}), vous êtes autorisé à séjourner pendant {max_stay} jours.\n"
                f"Votre date limite de sortie est fixée au : {expected_exit.strftime('%d/%m/%Y')}.\n\n"
                f"Nous vous souhaitons un excellent séjour.\n"
                f"Services de l'Immigration, République du Cameroun"
            )
            try:
                send_mail(
                    subject, message, settings.DEFAULT_FROM_EMAIL, [applicant_email],
                    fail_silently=False
                )
            except Exception as e:
                print(f"CRITICAL ERROR: Failed to send welcome email to {applicant_email}: {e}")
            
        elif crossing_type == 'EXIT':
            # Lier à la dernière entrée non clôturée
            last_entry = BorderCrossing.objects.filter(
                evisa=evisa, crossing_type='ENTRY', linked_exit__isnull=True
            ).order_by('-crossing_date').first()
            
            if last_entry:
                last_entry.linked_exit = crossing
                last_entry.save(update_fields=['linked_exit'])
                
                # Vérification du dépassement de séjour
                if crossing.crossing_date.date() > last_entry.expected_exit_date:
                    # Alerte Admin par mail
                    admin_subject = f"ALERTE : Dépassement de séjour - {applicant_name}"
                    admin_message = (
                        f"Le demandeur {applicant_name} ({evisa.visa_number}) a quitté le territoire avec un dépassement de séjour.\n\n"
                        f"Date d'entrée : {last_entry.crossing_date.strftime('%d/%m/%Y')}\n"
                        f"Date de sortie prévue : {last_entry.expected_exit_date.strftime('%d/%m/%Y')}\n"
                        f"Date de sortie réelle : {crossing.crossing_date.strftime('%d/%m/%Y')}\n"
                        f"Dépassement : {(crossing.crossing_date.date() - last_entry.expected_exit_date).days} jours."
                    )
                    # Envoyer aux administrateurs (on simule ici l'envoi à une adresse générique ou aux admins actifs)
                    # Pour l'instant on utilise DEFAULT_FROM_EMAIL comme "to" pour test console
                    send_mail(
                        admin_subject, admin_message, settings.DEFAULT_FROM_EMAIL, 
                        [settings.DEFAULT_FROM_EMAIL], fail_silently=True
                    )
        
        return Response(
            BorderCrossingSerializer(crossing).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'])
    def tracking(self, request):
        """
        Liste des séjours pour le tableau de bord Administrateur.
        GET /api/border-crossings/tracking/
        """
        if not request.user.is_admin:
            return Response({'error': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)
            
        # On récupère toutes les ENTRÉES
        entries = BorderCrossing.objects.filter(
            crossing_type='ENTRY'
        ).select_related('evisa', 'evisa__application', 'linked_exit').order_by('-crossing_date')
        
        data = []
        now = timezone.now().date()
        
        for entry in entries:
            # Calcul du statut
            if entry.linked_exit:
                status_label = 'SORTI'
                # On peut raffiner si c'était en dépassement
                if entry.linked_exit.crossing_date.date() > entry.expected_exit_date:
                    status_label = 'SORTI_DEPASSE'
            elif now > entry.expected_exit_date:
                status_label = 'DEPASSE'
            else:
                status_label = 'EN_COURS'
                
            data.append({
                'id': entry.id,
                'full_name': entry.evisa.application.full_name,
                'visa_type': entry.evisa.application.visa_type.name,
                'visa_number': entry.evisa.visa_number,
                'entry_date': entry.crossing_date,
                'expected_exit_date': entry.expected_exit_date,
                'actual_exit_date': entry.linked_exit.crossing_date if entry.linked_exit else None,
                'status': status_label
            })
            
        return Response(data)

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
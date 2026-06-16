from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, renderer_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Q, Count, Sum
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
import hashlib
from django.conf import settings

from apps.evisa.models import EVisa, BorderCrossing, SystemSetting, ContactMessage, Watchlist
from apps.evisa.serializers import (
    EVisaSerializer,
    EVisaRevokeSerializer,
    BorderCrossingSerializer,
    BorderCrossingCreateSerializer,
    EVisaVerifySerializer,
    SystemSettingSerializer,
    ContactMessageSerializer,
    WatchlistSerializer
)

class WatchlistViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion de la Watchlist nationale par les administrateurs de sécurité.
    """
    queryset = Watchlist.objects.all().order_by('-created_at')
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        # Seuls les admins ou des rôles sécurité spécifiques peuvent voir la watchlist
        if request.user.role not in ['ADMIN', 'BORDER']:
             self.permission_denied(request, message="Accès réservé aux autorités de sécurité.")
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
            message=f"Bonjour {message.first_name},\n\nSuite à votre message :\n\"{message.message}\"\n\nVoici notre réponse :\n{reply_text}\n\nCordialement,\n© 2026 Ing.concept MESSANGA Charles Perig",
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
        # L'action 'status' est publique (AllowAny), on ne vérifie pas le rôle admin
        if self.action == 'status':
            return
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
            # Normaliser les booléens en 'true'/'false' (minuscule) pour la coherence
            if isinstance(value, bool):
                setting.value = 'true' if value else 'false'
            elif str(value).lower() in ('true', 'false'):
                setting.value = str(value).lower()
            else:
                setting.value = str(value)
            setting.save()
            updates.append(setting)
        
        return Response({'status': 'success', 'updated': len(updates)})

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def status(self, request):
        """
        Vérifier le statut public du système (ex: mode maintenance).
        GET /api/system-settings/status/
        """
        maintenance_mode = False
        setting = SystemSetting.objects.filter(key='maintenanceMode').first()
        if setting and setting.value.lower() == 'true':
            maintenance_mode = True
            
        return Response({
            'maintenanceMode': maintenance_mode
        })


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
        
        # ── BARRE DE COULEUR TOP (Drapeau du Cameroun : Vert, Rouge, Jaune) ──
        p.setLineWidth(0)
        p.setFillColor(CM_GREEN)
        p.rect(0, height - 12, width/3, 12, fill=1)
        p.setFillColor(CM_RED)
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
        # Priorité : ID Photo (document PHOTO) > passport_photo (biométrique) > Photo biométrique (webcam face_image) > live_photo (webcam app) > PASSPORT doc (en dernier recours)
        
        # 1. Document officiel PHOTO
        photo_doc = evisa.application.documents.filter(document_type='PHOTO').first()
        if photo_doc and photo_doc.file:
            photo_file = photo_doc.file
            
        # 2. Photo d'identité de type passeport téléversée à l'étape biométrique
        if not photo_file and hasattr(evisa.application, 'biometric_data') and evisa.application.biometric_data.passport_photo:
            photo_file = evisa.application.biometric_data.passport_photo
            
        # 3. Capture webcam en direct (face_image)
        if not photo_file and hasattr(evisa.application, 'biometric_data') and evisa.application.biometric_data.face_image:
            photo_file = evisa.application.biometric_data.face_image
            
        # 4. Autre photo webcam en direct (live_photo)
        if not photo_file and evisa.application.live_photo:
            photo_file = evisa.application.live_photo
            
        # 5. Scan du passeport (dernier recours)
        if not photo_file:
            passport_doc = evisa.application.documents.filter(document_type='PASSPORT').first()
            if passport_doc and passport_doc.file:
                photo_file = passport_doc.file

        if photo_file:
            try:
                # Forcer la lecture depuis le début du fichier
                photo_file.open('rb')
                img_data = io.BytesIO(photo_file.read())
                photo_file.close()
                p.drawImage(ImageReader(img_data), photo_rect[0]+2, photo_rect[1]+2, width=photo_rect[2]-4, height=photo_rect[3]-4, preserveAspectRatio=True)
            except Exception as e:
                p.drawCentredString(photo_rect[0]+55, photo_rect[1]+60, "PHOTO")
                print(f"Error drawing photo: {e}")
        else:
            p.setFont("Helvetica", 8)
            p.drawCentredString(photo_rect[0]+55, photo_rect[1]+60, "PHOTO")

        # QR Code sécurisé avec URL de vérification signée
        try:
            from django.core.signing import Signer
            signer = Signer()
            # On signe le numéro de visa pour créer un lien infalsifiable
            signed_token = signer.sign(evisa.visa_number)
            frontend_url = getattr(settings, 'BASE_FRONTEND_URL', 'https://evisa-cameroun.vercel.app')
            verify_url = f"{frontend_url}/verify?token={signed_token}"
            
            qr = qrcode.QRCode(version=1, border=1)
            qr.add_data(verify_url)
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
        p.drawCentredString(width - 105, y_pos - 275, f"SECURED-VERIFY")

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
        
        try:
            raw_passport = evisa.application.get_decrypted_passport()
            masked_passport = "P****" + raw_passport[-4:] if (raw_passport and len(raw_passport) > 4) else "P****"
        except Exception:
            masked_passport = "P****"
            
        curr_y -= draw_field("Passeport / Passport N°", masked_passport, 60, curr_y)
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
        p.rect(50, 50, width - 100, 140, fill=1, stroke=0)
        p.setFillColor(TEXT_MUTED)
        p.setFont("Helvetica-Bold", 9)
        p.drawString(65, 175, "Avis Important :")
        
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.platypus import Paragraph
        styles = getSampleStyleSheet()
        style = styles["Normal"]
        style.fontSize = 8
        style.leading = 11
        style.alignment = 4 # Justify
        style.textColor = TEXT_MUTED
        
        notice_text = "Ce document est un laissez-passer électronique généré par le système d'Information de la DGSN du Cameroun. Vous devez l'imprimer et le présenter accompagné du passeport physique enregistré lors de votre contrôle aux frontières. Toute tentative de falsification entraînera des poursuites selon les lois en vigueur. <i>This document is a computer-generated electronic pass by the DGSN Information System of Cameroon. You must print it and present it along with the physical passport registered during your border control. Any attempt to forge this document will result in prosecution under applicable laws.</i>"
        
        p_notice = Paragraph(notice_text, style)
        p_notice.wrapOn(p, width - 130, 90)
        p_notice.drawOn(p, 65, 115)

        # ── SIGNATURE NUMÉRIQUE (Authentification Digitale) ──
        p.setDash(1, 2)
        p.setStrokeColor(TEXT_MUTED)
        p.line(50, 102, width - 50, 102)
        p.setDash([])
        
        p.setFont("Helvetica-Bold", 7)
        p.setFillColor(CM_GREEN)
        p.drawString(65, 90, "SCELLÉ NUMÉRIQUE D'AUTHENTIFICATION — DGSN CAMEROUN")
        
        p.setFont("Courier", 6)
        p.setFillColor(TEXT_MUTED)
        # Génération d'une empreinte unique basée sur les données du visa et la clé secrète du serveur
        sig_data = f"{evisa.visa_number}|{evisa.application.passport_number}|{settings.SECRET_KEY}"
        signature_hash = hashlib.sha256(sig_data.encode()).hexdigest()
        p.drawString(65, 78, f"ID Signature : {signature_hash}")
        p.drawString(65, 68, "Vérification possible sur : https://evisa-cameroun.vercel.app/verify")


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
    Recherche croisée par numéro de visa, numéro de dossier ou passport.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EVisaVerifySerializer

    def post(self, request):
        user = request.user
        
        if not (user.is_border_agent or user.is_admin):
            return Response({
                'error': 'Seuls les agents frontières peuvent vérifier les e-visas.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        query = (serializer.validated_data.get('visa_number') or serializer.validated_data.get('qr_code_data', '')).strip()
        
        if not query:
            return Response({'error': 'Numéro ou QR code requis.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Recherche intelligente (iexact)
        evisa = EVisa.objects.filter(
            Q(visa_number__iexact=query) | 
            Q(application__application_number__iexact=query) |
            Q(application__passport_number__iexact=query)
        ).first()
        
        if not evisa:
            return Response({
                'valid': False,
                'message': 'e-Visa introuvable. Veuillez vérifier le numéro ou le scan.'
            }, status=status.HTTP_404_NOT_FOUND)
            
class PublicVerifyEVisaView(generics.GenericAPIView):
    """
    Vérification publique via QR Token signé (Point 6).
    Accessible sans authentification pour les compagnies aériennes/autorités.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response({'error': 'Token de vérification manquant.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from django.core.signing import Signer, BadSignature
            signer = Signer()
            visa_number = signer.unsign(token)
            
            evisa = EVisa.objects.filter(visa_number=visa_number).first()
            if not evisa:
                return Response({'error': 'Visa introuvable.'}, status=status.HTTP_404_NOT_FOUND)
            
            # Récupérer et masquer le numéro de passeport de façon sécurisée
            raw_passport = evisa.application.get_decrypted_passport()
            masked_passport = raw_passport
            if len(raw_passport) > 4:
                masked_passport = "P****" + raw_passport[-4:]
            elif len(raw_passport) > 0:
                masked_passport = "P****"

            photo_doc = evisa.application.documents.filter(document_type='PHOTO').first()
            passport_photo_url = None
            if photo_doc and photo_doc.file:
                from django.conf import settings
                base_url = getattr(settings, 'BASE_BACKEND_URL', 'https://charles237.pythonanywhere.com')
                passport_photo_url = f"{base_url.rstrip('/')}{photo_doc.file.url}"

            return Response({
                'data': {
                    'applicant_name': evisa.application.full_name,
                    'nationality': evisa.application.nationality or "N/A",
                    'passport_number': masked_passport,
                    'visa_number': evisa.visa_number,
                    'visa_type': evisa.application.visa_type.name,
                    'expiry_date': evisa.expiry_date,
                    'is_valid': evisa.is_valid and not evisa.is_revoked,
                    'passport_photo': passport_photo_url
                }
            })
            
        except BadSignature:
            return Response({
                'error': 'Signature invalide. Ce document a été falsifié.'
            }, status=status.HTTP_403_FORBIDDEN)




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
                f"Nous vous souhaitons un excellent séjour.\n\n"
                f"Cordialement,\n© 2026 Ing.concept MESSANGA Charles Perig"
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
        try:
            if not request.user.is_admin:
                return Response({'error': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)
                
            # On récupère les ENTRÉES et REFUS
            entries = BorderCrossing.objects.exclude(
                crossing_type='EXIT'
            ).select_related('evisa', 'evisa__application', 'application', 'application__visa_type', 'linked_exit').order_by('-crossing_date')
            
            data = []
            now = timezone.now().date()
            
            for entry in entries:
                # Récupérer l'application, qu'elle soit liée via evisa ou via le champ application
                app = entry.application or (entry.evisa.application if entry.evisa else None)
                if not app:
                    continue

                expected = None
                if entry.crossing_type == 'DENIED':
                    status_label = 'REFUSE'
                else:
                    expected = entry.expected_exit_date
                    if not expected:
                        expected = now # Fallback safe
                    
                    # AJOUT : Prise en compte des prorogations approuvées
                    from apps.visa_applications.models import StayExtensionRequest
                    total_extension_days = StayExtensionRequest.objects.filter(
                        visa_application=app,
                        status='APPROVED'
                    ).aggregate(total=Sum('requested_days'))['total'] or 0
                    
                    if total_extension_days > 0:
                        expected += timedelta(days=total_extension_days)
                        
                    if entry.linked_exit:
                        status_label = 'SORTI'
                        if entry.linked_exit.crossing_date.date() > expected:
                            status_label = 'SORTI_DEPASSE'
                    elif now > expected:
                        status_label = 'DEPASSE'
                    else:
                        status_label = 'EN_COURS'
                    
                data.append({
                    'id': entry.id,
                    'full_name': app.full_name,
                    'visa_type': app.visa_type.name if app.visa_type else 'Inconnu',
                    'visa_number': entry.evisa.visa_number if entry.evisa else 'N/A',
                    'entry_date': entry.crossing_date,
                    'expected_exit_date': expected,
                    'actual_exit_date': entry.linked_exit.crossing_date if getattr(entry, 'linked_exit', None) else None,
                    'status': status_label
                })
                
            return Response(data)
        except Exception as e:
            import traceback
            return Response({'error': str(e), 'traceback': traceback.format_exc()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
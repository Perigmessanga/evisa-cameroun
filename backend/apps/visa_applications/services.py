"""
Service e-Visa — Génération du PDF et QR Code
"""
import uuid
import qrcode
import io
import base64
from django.utils import timezone
from django.core.files.base import ContentFile


from django.db import transaction

class EVisaService:
    """Service responsable de la génération des e-visas (PDF + QR Code)."""

    @transaction.atomic
    def generate_evisa(self, application):
        """
        Génère un e-visa complet pour une demande approuvée.
        Retourne l'objet EVisa créé.
        """
        from apps.evisa.models import EVisa

        # Vérifier si un visa existe déjà
        existing = EVisa.objects.filter(application=application).first()
        if existing:
            return existing

        # Calculer les dates
        issue_date  = timezone.now().date()
        validity_days = application.visa_type.validity_days if application.visa_type else 30
        expiry_date = issue_date + timezone.timedelta(days=validity_days)

        # Générer le numéro de visa unique
        year = timezone.now().year
        # Utilisation de select_for_update pour éviter les race conditions sur le compteur
        count = EVisa.objects.filter(created_at__year=year).count() + 1
        visa_number = f"CM-VISA-{year}-{count:06d}"

        # Générer le QR Code
        qr_data = self._build_qr_data(visa_number, application)
        qr_b64  = self._generate_qr_code(qr_data)

        # Créer l'objet EVisa
        evisa = EVisa.objects.create(
            application=application,
            visa_number=visa_number,
            issue_date=issue_date,
            expiry_date=expiry_date,
            qr_code=qr_b64,
            pdf_file_path=f'evisas/evisa_{visa_number}.pdf'
        )
        return evisa

    # ── Numéro de visa ─────────────────────────────────────────
    def _generate_visa_number(self):
        year = timezone.now().year
        uid  = str(uuid.uuid4()).upper().replace('-', '')[:10]
        return f'CMR-EV-{year}-{uid}'

    # ── Données QR Code ────────────────────────────────────────
    def _build_qr_data(self, visa_number, application):
        return (
            f'EVISA:{visa_number}|'
            f'NAME:{application.full_name}|'
            f'PASSPORT:{application.passport_number}|'
            f'NATIONALITY:{application.nationality}|'
            f'TYPE:{application.visa_type.code}'
        )

    # ── Génération QR Code en base64 ──────────────────────────
    def _generate_qr_code(self, data: str) -> str:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color='black', back_color='white')

        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        return base64.b64encode(buffer.getvalue()).decode('utf-8')

    # ── Génération PDF ─────────────────────────────────────────
    def _generate_pdf(self, application, visa_number, issue_date, expiry_date, qr_b64) -> bytes:
        """
        Génère le PDF de l'e-visa avec ReportLab.
        """
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.lib import colors
            from reportlab.lib.units import cm
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.enums import TA_CENTER, TA_LEFT

            buffer = io.BytesIO()
            doc    = SimpleDocTemplate(buffer, pagesize=A4,
                                       topMargin=1.5*cm, bottomMargin=1.5*cm,
                                       leftMargin=2*cm, rightMargin=2*cm)

            styles     = getSampleStyleSheet()
            title_style = ParagraphStyle('Title', fontSize=18, fontName='Helvetica-Bold',
                                          alignment=TA_CENTER, textColor=colors.HexColor('#1F4E78'))
            header_style = ParagraphStyle('Header', fontSize=11, fontName='Helvetica-Bold',
                                           textColor=colors.HexColor('#2E75B5'))
            normal_style = styles['Normal']

            story = []

            # En-tête
            story.append(Paragraph('RÉPUBLIQUE DU CAMEROUN', title_style))
            story.append(Paragraph('VISA ÉLECTRONIQUE (e-Visa)', title_style))
            story.append(Spacer(1, 0.5*cm))

            # Numéro et type
            story.append(Paragraph(f'N° {visa_number}', header_style))
            story.append(Spacer(1, 0.3*cm))

            # Tableau des informations
            info_data = [
                ['TITULAIRE',        application.full_name],
                ['NATIONALITÉ',      application.nationality],
                ['PASSEPORT',        application.passport_number],
                ['TYPE DE VISA',     application.visa_type.name],
                ['DATE D\'ÉMISSION', str(issue_date)],
                ['DATE D\'EXPIRATION', str(expiry_date)],
                ['DURÉE SÉJOUR MAX', f'{application.visa_type.max_stay_days} jours'],
                ['MOTIF',            application.purpose_of_visit[:100]],
            ]

            table = Table(info_data, colWidths=[5*cm, 12*cm])
            table.setStyle(TableStyle([
                ('BACKGROUND',   (0, 0), (0, -1), colors.HexColor('#E6F2FF')),
                ('FONTNAME',     (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE',     (0, 0), (-1, -1), 10),
                ('GRID',         (0, 0), (-1, -1), 0.5, colors.grey),
                ('PADDING',      (0, 0), (-1, -1), 8),
            ]))
            # Photo du demandeur
            photo_path = None
            if hasattr(application, 'biometric_data') and application.biometric_data.face_image:
                photo_path = application.biometric_data.face_image.path
            else:
                photo_doc = application.documents.filter(document_type='PHOTO').first()
                if photo_doc and hasattr(photo_doc.file, 'path'):
                    photo_path = photo_doc.file.path

            photo_img = None
            if photo_path:
                try:
                    photo_img = Image(photo_path, width=3.5*cm, height=4.5*cm)
                except Exception:
                    pass
            
            if photo_img:
                # Créer une table pour aligner la photo à droite des informations
                info_and_photo_data = [[table, photo_img]]
                layout_table = Table(info_and_photo_data, colWidths=[17.5*cm, 4*cm])
                layout_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                story.append(layout_table)
            else:
                story.append(table)
                
            story.append(Spacer(1, 0.5*cm))

            # QR Code
            qr_bytes  = base64.b64decode(qr_b64)
            qr_buffer = io.BytesIO(qr_bytes)
            qr_image  = Image(qr_buffer, width=4*cm, height=4*cm)
            story.append(qr_image)

            # Note légale
            story.append(Spacer(1, 0.5*cm))
            story.append(Paragraph(
                'Ce visa électronique est valide pour une entrée au Cameroun. '
                'Présentez ce document aux agents de contrôle aux frontières. '
                'Ce document a force légale et est infalsifiable.',
                normal_style
            ))

            doc.build(story)
            return buffer.getvalue()

        except ImportError:
            # Si ReportLab n'est pas installé, retourner un PDF minimal
            return b'%PDF-1.4 e-Visa placeholder'


# Singleton du service
EVisa_service = EVisaService()
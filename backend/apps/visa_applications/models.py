"""
Modèles — App visa_applications
"""
import uuid
# pyrefly: ignore [missing-import]
from django.db import models
# pyrefly: ignore [missing-import]
from django.conf import settings
from pathlib import Path
# pyrefly: ignore [missing-import]
from apps.users.utils import get_country_variants

# pyrefly: ignore [missing-import]
from django.utils.translation import gettext_lazy as _


# ─────────────────────────────────────────────────────────────────
# CHOIX (Enums)
# ─────────────────────────────────────────────────────────────────
class ProcessingType(models.TextChoices):
    STANDARD = 'STANDARD', 'Standard (72 heures)'
    EXPRESS  = 'EXPRESS',  'Express (24 heures)'

class ApplicationStatus(models.TextChoices):
    DRAFT           = 'DRAFT',           _('Brouillon')
    SUBMITTED       = 'SUBMITTED',       _('Soumise')
    PROCESSING      = 'PROCESSING',      _('En traitement')
    PENDING_DOCS    = 'PENDING_DOCS',    _('Attente documents')
    DOCS_PROVIDED   = 'DOCS_PROVIDED',   _('Compléments fournis')
    PENDING_REVIEW  = 'PENDING_REVIEW',  _('Attente avis consulaire')
    APPROVED        = 'APPROVED',        _('Approuvée')
    REJECTED        = 'REJECTED',        _('Rejetée')
    CANCELLED       = 'CANCELLED',       _('Annulée')

class EmbassyOpinion(models.TextChoices):
    NONE         = 'NONE',         'Aucun avis'
    FAVORABLE    = 'FAVORABLE',    'Favorable'
    UNFAVORABLE  = 'UNFAVORABLE',  'Défavorable'

class BorderCheckStatus(models.TextChoices):
    NOT_CHECKED = 'NOT_CHECKED', 'Non vérifié'
    ENTERED     = 'ENTERED',     'Entrée enregistrée'
    EXITED      = 'EXITED',      'Sortie enregistrée'
    DENIED      = 'DENIED',      'Entrée refusée'

class DocumentType(models.TextChoices):
    PASSPORT             = 'PASSPORT',             'Passeport'
    PHOTO                = 'PHOTO',                'Photo d\'identité'
    TRAVEL_ITINERARY     = 'TRAVEL_ITINERARY',     'Billet Avion / Titre Transport'
    ACCOMMODATION_PROOF  = 'ACCOMMODATION_PROOF',  'Justificatif d\'hébergement'
    FINANCIAL_PROOF      = 'FINANCIAL_PROOF',      'Justificatif Financier / Subsistance'
    VACCINATION_CERT     = 'VACCINATION_CERT',     'Carnet de vaccination'
    DESTINATION_VISA     = 'DESTINATION_VISA',     'Visa pays destination'
    MISSION_ORDER        = 'MISSION_ORDER',        'Ordre de mission'
    RESIDENCE_CERT       = 'RESIDENCE_CERT',       'Certificat de domicile'
    PROFESSION_PROOF     = 'PROFESSION_PROOF',     'Justificatif de profession'
    REPATRIATION_GUAR    = 'REPATRIATION_GUAR',    'Garantie de rapatriement'
    STUDENT_REG          = 'STUDENT_REG',          'Attestation d\'inscription scolaire'
    INTERNSHIP_ATT       = 'INTERNSHIP_ATT',       'Attestation de mise en stage'
    WORK_CONTRACT        = 'WORK_CONTRACT',        'Contrat de travail'
    PROFESSION_AUTH      = 'PROFESSION_AUTH',      'Autorisation d\'exercer / Promouvoir'
    FAMILY_ACT           = 'FAMILY_ACT',           'Acte de mariage / Parental'
    VERBAL_NOTE          = 'VERBAL_NOTE',          'Note verbale'
    IDENTITY_CARD        = 'IDENTITY_CARD',        'Carte Nationale d\'Identité'
    EXTENSION_PROOF      = 'EXTENSION_PROOF',      'Justificatif de prorogation'
    OTHER                = 'OTHER',                'Autre'

class Gender(models.TextChoices):
# ... (same as before)
    MALE   = 'MALE',   'Masculin'
    FEMALE = 'FEMALE', 'Féminin'
    OTHER  = 'OTHER',  'Autre'


# ─────────────────────────────────────────────────────────────────
# TYPE DE VISA
# ─────────────────────────────────────────────────────────────────
class VisaType(models.Model):
    id                   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name                 = models.CharField(max_length=100, verbose_name='Nom')
    code                 = models.CharField(max_length=20, unique=True, verbose_name='Code')
    description          = models.TextField(blank=True, verbose_name='Description')
    validity_days        = models.PositiveIntegerField(verbose_name='Validité (jours)')
    max_stay_days        = models.PositiveIntegerField(verbose_name='Durée séjour max (jours)')
    fee                  = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Frais (XAF)')
    required_documents   = models.JSONField(default=list, verbose_name='Documents requis')
    processing_time_days = models.PositiveIntegerField(default=7, verbose_name='Délai traitement (jours)')
    is_active            = models.BooleanField(default=True, verbose_name='Actif')
    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = 'evisa_visa_type'
        verbose_name = 'Type de visa'
        verbose_name_plural = 'Types de visa'
        ordering     = ['name']

    def __str__(self):
        return f'{self.name} ({self.code})'


# ─────────────────────────────────────────────────────────────────
# DEMANDE DE VISA
# ─────────────────────────────────────────────────────────────────
class VisaApplication(models.Model):
    id                 = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application_number = models.CharField(max_length=50, unique=True, verbose_name='Numéro de demande')
    applicant          = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='applications', verbose_name='Demandeur'
    )
    visa_type          = models.ForeignKey(
        VisaType, on_delete=models.PROTECT,
        related_name='applications', verbose_name='Type de visa'
    )
    assigned_agent     = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_applications',
        verbose_name='Agent assigné'
    )
    
    # ── Groupes / Familles ───────────────────────────────────────
    group_reference    = models.CharField(max_length=50, blank=True, null=True, verbose_name='Référence de groupe')
    is_group_primary   = models.BooleanField(default=False, verbose_name='Demandeur principal du groupe')
    processed_by       = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='processed_applications',
        verbose_name='Traité par'
    )
    status             = models.CharField(
        max_length=20, choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT, verbose_name='Statut'
    )

    # ── Informations personnelles ──────────────────────────────
    full_name        = models.CharField(max_length=200, blank=True, null=True, verbose_name='Nom complet')
    date_of_birth    = models.DateField(blank=True, null=True, verbose_name='Date de naissance')
    place_of_birth   = models.CharField(max_length=100, blank=True, null=True, verbose_name='Lieu de naissance')
    nationality      = models.CharField(max_length=100, blank=True, null=True, verbose_name='Nationalité')
    residence_country = models.CharField(max_length=100, blank=True, null=True, verbose_name='Pays de résidence', default='Autre')
    gender           = models.CharField(max_length=10, choices=Gender.choices, blank=True, null=True, verbose_name='Genre')
    marital_status   = models.CharField(max_length=50, blank=True, null=True, verbose_name='Situation matrimoniale')
    profession       = models.CharField(max_length=100, blank=True, null=True, verbose_name='Profession')
    birth_country    = models.CharField(max_length=100, blank=True, null=True, verbose_name='Pays de naissance')

    # ── Informations passeport ─────────────────────────────────
    passport_number      = models.CharField(max_length=500, blank=True, null=True, verbose_name='Numéro passeport (Chiffré)')
    passport_issue_date  = models.DateField(blank=True, null=True, verbose_name='Date émission passeport')
    passport_expiry_date = models.DateField(blank=True, null=True, verbose_name='Date expiration passeport')
    passport_country     = models.CharField(max_length=100, blank=True, null=True, verbose_name='Pays émission')

    # ── Informations voyage ────────────────────────────────────
    purpose_of_visit    = models.TextField(blank=True, null=True, verbose_name='Motif de visite')
    arrival_date        = models.DateField(blank=True, null=True, verbose_name='Date d\'arrivée prévue')
    departure_date      = models.DateField(blank=True, null=True, verbose_name='Date de départ prévue')
    address_in_cameroon = models.TextField(blank=True, null=True, verbose_name='Adresse au Cameroun')

    # ── Contact d'urgence ──────────────────────────────────────
    emergency_contact_name  = models.CharField(max_length=200, blank=True, null=True, verbose_name='Contact d\'urgence (Nom)')
    emergency_contact_phone = models.CharField(max_length=50, blank=True, null=True, verbose_name='Contact d\'urgence (Tél)')
    national_id_number      = models.CharField(max_length=500, blank=True, null=True, verbose_name='Numéro CNI / ID National (Chiffré)')

    # ── Avis Ambassade ─────────────────────────────────────────
    embassy_opinion = models.CharField(
        max_length=20, choices=EmbassyOpinion.choices,
        default=EmbassyOpinion.NONE, verbose_name='Avis ambassade'
    )
    embassy_comment = models.TextField(blank=True, verbose_name='Commentaire ambassade')

    # ── Contrôle Frontière ─────────────────────────────────────
    border_check_status = models.CharField(
        max_length=20, choices=BorderCheckStatus.choices,
        default=BorderCheckStatus.NOT_CHECKED, verbose_name='Statut frontière'
    )
    border_agent        = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='border_checks',
        verbose_name='Agent frontière'
    )
    border_checked_at   = models.DateTimeField(null=True, blank=True, verbose_name='Date vérification frontière')
    
    # ── Progress Tracking ──────────────────────────────────────
    last_completed_step = models.PositiveIntegerField(default=0, verbose_name='Dernière étape complétée')

    # ── Traitement ─────────────────────────────────────────────
    processing_type  = models.CharField(
        max_length=20, choices=ProcessingType.choices,
        default=ProcessingType.STANDARD, verbose_name='Type de traitement'
    )
    has_biometrics   = models.BooleanField(default=False, verbose_name='Biométrie vérifiée')
    live_photo       = models.ImageField(upload_to='biometrics/live/', null=True, blank=True, verbose_name='Photo en direct (Liveness)')
    biometric_liveness_score = models.FloatField(null=True, blank=True, verbose_name='Score Liveness (%)')
    biometric_liveness_status = models.CharField(max_length=20, default='PENDING', verbose_name='Statut Biométrie')
    
    submitted_at     = models.DateTimeField(null=True, blank=True, verbose_name='Soumis le')
    processed_at     = models.DateTimeField(null=True, blank=True, verbose_name='Traité le')
    rejection_reason = models.TextField(blank=True, verbose_name='Motif de rejet')
    
    # ── Sécurité & Vigilance ─────────────────────────────────────
    is_flagged       = models.BooleanField(default=False, verbose_name='Signalé (Watchlist)')
    security_notes   = models.TextField(blank=True, verbose_name='Notes de sécurité')
    security_risk    = models.CharField(max_length=20, default='LOW', verbose_name='Niveau de risque')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = 'evisa_application'
        verbose_name = 'Demande de visa'
        verbose_name_plural = 'Demandes de visa'
        ordering     = ['-created_at']
        indexes      = [
            models.Index(fields=['applicant', 'status']),
            models.Index(fields=['application_number']),
            models.Index(fields=['status', 'submitted_at']),
            models.Index(fields=['residence_country']),
        ]

    def __str__(self):
        return f'{self.application_number} — {self.full_name} ({self.status})'

    def get_decrypted_passport(self):
        # pyrefly: ignore [missing-import]
        from apps.users.crypto_utils import decrypt_data
        return decrypt_data(self.passport_number)

    def get_decrypted_national_id(self):
        # pyrefly: ignore [missing-import]
        from apps.users.crypto_utils import decrypt_data
        return decrypt_data(self.national_id_number)

    def save(self, *args, **kwargs):
        if not self.application_number:
            import random
            import string
            # pyrefly: ignore [missing-import]
            from django.utils import timezone
            year    = timezone.now().year
            suffix  = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            self.application_number = f'CMR-{year}-{suffix}'

        # pyrefly: ignore [missing-import]
        from apps.users.crypto_utils import encrypt_data
        # Chiffrement automatique si ce n'est pas déjà fait
        if self.passport_number and not self.passport_number.startswith('gAAAA'):
            self.passport_number = encrypt_data(self.passport_number)
        
        if self.national_id_number and not self.national_id_number.startswith('gAAAA'):
            self.national_id_number = encrypt_data(self.national_id_number)
            
        super().save(*args, **kwargs)

    @property
    def is_editable(self):
        """Une demande est modifiable si elle est en brouillon ou si on a demandé des documents."""
        return self.status in [ApplicationStatus.DRAFT, ApplicationStatus.PENDING_DOCS]

    def assign_best_agent(self):
        """Assigne automatiquement la demande à l'ambassade correspondante ou à l'agent le moins chargé."""
        # pyrefly: ignore [missing-import]
        from apps.users.models import User, UserRole
        # pyrefly: ignore [missing-import]
        from django.db.models import Count, Q
        
        # 1. Préparation de la liste des pays à tester (Nationalité + Résidence)
        countries_to_test = []
        if self.nationality: countries_to_test.append(self.nationality)
        if self.residence_country: countries_to_test.append(self.residence_country)
        
        # Récupérer toutes les variantes linguistiques pour ces pays
        search_names = []
        for c in countries_to_test:
            search_names.extend(get_country_variants(c))
        
        # Nettoyage
        search_names = list(set([n.strip() for n in search_names if n]))

        # Chercher si une ambassade (ou un compte dédié à un pays) existe pour l'un de ces noms
        # On cherche d'abord par le champ embassy_country
        embassy = User.objects.filter(
            Q(role=UserRole.EMBASSY) | Q(embassy_country__isnull=False),
            embassy_country__in=search_names,
            is_active=True
        ).first()
        
        # Match flou (insensible à la casse) si non trouvé
        if not embassy:
            query = Q()
            for name in search_names:
                query |= Q(embassy_country__iexact=name)
            embassy = User.objects.filter((Q(role=UserRole.EMBASSY) | Q(embassy_country__isnull=False)) & query & Q(is_active=True)).first()
        
        if embassy:
            self.assigned_agent = embassy
            self.save(update_fields=['assigned_agent'])
            return True
            
        # 2. Sinon, trouver tous les agents d'immigration actifs et assigner au moins chargé
        agents = User.objects.filter(role=UserRole.AGENT, is_active=True).annotate(
            job_count=Count('assigned_applications', filter=Q(assigned_applications__status__in=['SUBMITTED', 'PROCESSING', 'PENDING_DOCS']))
        ).order_by('job_count')
        
        if agents.exists():
            self.assigned_agent = agents.first()
            self.save(update_fields=['assigned_agent'])
            return True
            
        return False


# ─────────────────────────────────────────────────────────────────
# DOCUMENT
# ─────────────────────────────────────────────────────────────────
def document_upload_path(instance, filename):
    return f'documents/{instance.application.id}/{filename}'

class Document(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application   = models.ForeignKey(
        VisaApplication, on_delete=models.CASCADE,
        related_name='documents', verbose_name='Demande'
    )
    document_type = models.CharField(max_length=30, choices=DocumentType.choices, verbose_name='Type de document')
    file          = models.FileField(upload_to=document_upload_path, verbose_name='Fichier')
    file_name     = models.CharField(max_length=255, verbose_name='Nom du fichier')
    file_size     = models.PositiveIntegerField(verbose_name='Taille (octets)')
    mime_type     = models.CharField(max_length=100, blank=True, verbose_name='Type MIME')
    is_verified   = models.BooleanField(default=False, verbose_name='Vérifié')
    uploaded_at   = models.DateTimeField(auto_now_add=True)
    verified_at   = models.DateTimeField(null=True, blank=True)
    verified_by   = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='verified_documents'
    )

    class Meta:
        db_table     = 'evisa_document'
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'

    def __str__(self):
        return f'{self.document_type} — {self.application.application_number}'





# ─────────────────────────────────────────────────────────────────
# HISTORIQUE DES ACTIONS
# ─────────────────────────────────────────────────────────────────
class VisaHistory(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(VisaApplication, on_delete=models.CASCADE, related_name='history')
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action      = models.CharField(max_length=100)
    details     = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evisa_history'
        verbose_name = 'Historique'
        ordering = ['-created_at']


# ─────────────────────────────────────────────────────────────────
# ALERTE DE SÉCURITÉ
# ─────────────────────────────────────────────────────────────────
class SecurityAlert(models.Model):
    class AlertType(models.TextChoices):
        HIGH   = 'HIGH',   'Haute'
        MEDIUM = 'MEDIUM', 'Moyenne'
        LOW    = 'LOW',    'Basse'

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(VisaApplication, on_delete=models.CASCADE, related_name='security_alerts', null=True, blank=True)
    type        = models.CharField(max_length=20, choices=AlertType.choices, default=AlertType.MEDIUM)
    title       = models.CharField(max_length=200)
    description = models.TextField()
    location    = models.CharField(max_length=200)
    is_resolved = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evisa_security_alert'
        verbose_name = 'Alerte de sécurité'
        verbose_name_plural = 'Alertes de sécurité'
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.type}] {self.title} - {self.location}'


# ─────────────────────────────────────────────────────────────────
# COMMENTAIRE SUR LA DEMANDE
# ─────────────────────────────────────────────────────────────────
class ApplicationComment(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(
        VisaApplication, on_delete=models.CASCADE,
        related_name='comments', verbose_name='Demande'
    )
    author      = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='comments', verbose_name='Auteur'
    )
    content     = models.TextField(verbose_name='Contenu')
    is_internal = models.BooleanField(default=True, verbose_name='Commentaire interne')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = 'evisa_comment'
        verbose_name = 'Commentaire'
        verbose_name_plural = 'Commentaires'
        ordering     = ['created_at']

    def __str__(self):
        return f'Commentaire de {self.author.get_full_name()} sur {self.application.application_number}'


# ─────────────────────────────────────────────────────────────────
# DEMANDE DE PROROGATION DE SÉJOUR
# ─────────────────────────────────────────────────────────────────
class StayExtensionRequest(models.Model):
    class ExtensionStatus(models.TextChoices):
        SUBMITTED       = 'SUBMITTED',       'Soumise'
        PROCESSING      = 'PROCESSING',      'En traitement'
        PENDING_PAYMENT = 'PENDING_PAYMENT', 'En attente de paiement'
        PAID            = 'PAID',            'Payée'
        APPROVED        = 'APPROVED',        'Approuvée'
        REJECTED        = 'REJECTED',        'Rejetée'
        CANCELLED       = 'CANCELLED',       'Annulée'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    visa_application = models.ForeignKey(
        VisaApplication, on_delete=models.CASCADE,
        related_name='extensions', verbose_name='Demande de visa d\'origine'
    )
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='stay_extensions', verbose_name='Demandeur'
    )
    assigned_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_extensions',
        verbose_name='Agent assigné'
    )
    
    current_expiry_date = models.DateField(verbose_name='Date d\'expiration actuelle')
    requested_days      = models.PositiveIntegerField(verbose_name='Nombre de jours demandés')
    new_expiry_date     = models.DateField(verbose_name='Nouvelle date d\'expiration prévue')
    reason              = models.TextField(verbose_name='Motif de la demande')
    
    status = models.CharField(
        max_length=20, choices=ExtensionStatus.choices,
        default=ExtensionStatus.SUBMITTED, verbose_name='Statut'
    )
    
    rejection_reason = models.TextField(blank=True, verbose_name='Motif de rejet')
    
    # Justificatif (Pièce jointe)
    extension_proof = models.FileField(upload_to='extensions/', null=True, blank=True, verbose_name='Justificatif de prorogation')
    
    # Paiement (si applicable)
    fee            = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Frais de prorogation')
    payment_status = models.CharField(max_length=20, default='PENDING', verbose_name='Statut du paiement')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table     = 'evisa_stay_extension'
        verbose_name = 'Demande de prorogation'
        verbose_name_plural = 'Demandes de prorogation'
        ordering     = ['-created_at']

    def __str__(self):
        return f"Prorogation pour {self.visa_application.application_number} (+{self.requested_days} jours)"

# ─────────────────────────────────────────────────────────────────
# ARCHIVAGE LÉGAL (E-GOUVERNEMENT)
# ─────────────────────────────────────────────────────────────────
class ArchivedApplication(models.Model):
    id                 = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application_number = models.CharField(max_length=50, unique=True, verbose_name='Numéro de demande original')
    original_application_id = models.UUIDField(verbose_name='ID Original')
    applicant_email    = models.EmailField(verbose_name='Email demandeur')
    status             = models.CharField(max_length=20, verbose_name='Statut final')
    
    # Données immuables figées
    snapshot_data      = models.JSONField(verbose_name='Données complètes (Immuable)')
    
    archived_at        = models.DateTimeField(auto_now_add=True, verbose_name='Date d\'archivage')
    retention_end_date = models.DateTimeField(verbose_name='Fin de période de rétention légale')

    class Meta:
        db_table = 'evisa_archived_application'
        verbose_name = 'Demande Archivée'
        verbose_name_plural = 'Demandes Archivées'
        ordering = ['-archived_at']

    def __str__(self):
        return f'ARCHIVE: {self.application_number} ({self.status})'
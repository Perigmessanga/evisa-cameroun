import uuid
from django.db import models
from django.utils import timezone


class EVisa(models.Model):
    """
    e-Visa généré après approbation d'une demande.
    Contient le QR code et le fichier PDF téléchargeable.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Un seul e-visa par demande approuvée
    application = models.OneToOneField(
        'visa_applications.VisaApplication',
        on_delete=models.CASCADE,
        related_name='evisa',
        verbose_name="Demande de visa"
    )

    # Numéro unique du visa (ex: CM-VISA-2026-000001)
    visa_number = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Numéro de visa"
    )

    # Dates de validité
    issue_date = models.DateField(
        verbose_name="Date d'émission"
    )
    expiry_date = models.DateField(
        verbose_name="Date d'expiration"
    )

    # QR Code en base64 (pour vérification aux frontières)
    qr_code = models.TextField(
        verbose_name="QR Code"
    )

    # Chemin vers le fichier PDF généré
    pdf_file_path = models.CharField(
        max_length=500,
        verbose_name="Chemin du PDF"
    )

    # Révocation (si le visa doit être annulé après émission)
    is_revoked = models.BooleanField(
        default=False,
        verbose_name="Révoqué"
    )
    revocation_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date de révocation"
    )
    revocation_reason = models.TextField(
        blank=True,
        null=True,
        verbose_name="Motif de révocation"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'e_visa'
        verbose_name = 'e-Visa'
        verbose_name_plural = 'e-Visas'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['visa_number']),
            models.Index(fields=['expiry_date']),
        ]

    def __str__(self):
        return f"e-Visa {self.visa_number} - {self.application.full_name}"

    def save(self, *args, **kwargs):
        """Générer automatiquement le numéro de visa à la création."""
        if not self.visa_number:
            year = timezone.now().year
            count = EVisa.objects.filter(
                created_at__year=year
            ).count() + 1
            self.visa_number = f"CM-VISA-{year}-{count:06d}"
        super().save(*args, **kwargs)

    @property
    def is_valid(self):
        """Vérifier si le visa est encore valide (non expiré et non révoqué)."""
        if self.is_revoked:
            return False
        return self.expiry_date >= timezone.now().date()

    @property
    def days_until_expiry(self):
        """Nombre de jours avant expiration."""
        delta = self.expiry_date - timezone.now().date()
        return delta.days


class BorderCrossing(models.Model):
    """
    Enregistrement des entrées/sorties du territoire
    effectuées par les agents aux frontières.
    """

    CROSSING_TYPE_CHOICES = [
        ('ENTRY', 'Entrée'),
        ('EXIT',  'Sortie'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    evisa = models.ForeignKey(
        EVisa,
        on_delete=models.CASCADE,
        related_name='crossings',
        verbose_name="e-Visa"
    )
    border_agent = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        related_name='border_crossings',
        verbose_name="Agent frontière"
    )

    crossing_type = models.CharField(
        max_length=10,
        choices=CROSSING_TYPE_CHOICES,
        verbose_name="Type (Entrée/Sortie)"
    )
    location = models.CharField(
        max_length=200,
        verbose_name="Point de passage"
    )
    crossing_date = models.DateTimeField(
        default=timezone.now,
        verbose_name="Date et heure"
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Notes"
    )

    class Meta:
        db_table = 'border_crossing'
        verbose_name = 'Passage Frontière'
        verbose_name_plural = 'Passages Frontière'
        ordering = ['-crossing_date']

    def __str__(self):
        return f"{self.crossing_type} - {self.evisa.visa_number} - {self.location}"
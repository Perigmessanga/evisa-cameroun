from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.visa_applications.models import VisaApplication, ArchivedApplication, ApplicationStatus
import json

class Command(BaseCommand):
    help = 'Archive les demandes de visas complétées (approuvées ou refusées) depuis une certaine période.'

    def handle(self, *args, **kwargs):
        # En production réelle, on archive après plusieurs mois/années. 
        # Pour la soutenance, on archive les demandes terminées il y a plus de 30 jours, 
        # ou on peut forcer l'archivage de toutes les demandes terminées pour la démo.
        
        # Pour la démo, on archive toutes les demandes approuvées ou refusées
        applications_to_archive = VisaApplication.objects.filter(
            status__in=[ApplicationStatus.APPROVED, ApplicationStatus.REJECTED]
        )
        
        count = 0
        for app in applications_to_archive:
            # Vérifier si elle n'est pas déjà archivée
            if ArchivedApplication.objects.filter(original_application_id=app.id).exists():
                continue
                
            # Snapshot des données
            snapshot = {
                'application_number': app.application_number,
                'status': app.status,
                'applicant_email': app.applicant.email if app.applicant else 'N/A',
                'full_name': app.full_name,
                'passport_number': app.passport_number,  # Ce champ est déjà chiffré en base
                'visa_type': app.visa_type.name if app.visa_type else 'N/A',
                'created_at': str(app.created_at),
                'processed_at': str(app.processed_at) if app.processed_at else None,
            }
            
            # Période de rétention légale (10 ans pour les refus, 5 ans pour les approbations)
            retention_years = 10 if app.status == ApplicationStatus.REJECTED else 5
            retention_end_date = timezone.now() + timedelta(days=365 * retention_years)
            
            ArchivedApplication.objects.create(
                application_number=app.application_number,
                original_application_id=app.id,
                applicant_email=app.applicant.email if app.applicant else 'N/A',
                status=app.status,
                snapshot_data=snapshot,
                retention_end_date=retention_end_date
            )
            count += 1
            
            # En théorie on pourrait supprimer l'original de la table active (app.delete()),
            # mais pour l'instant on garde une copie ou on pourrait ajouter un booléen `is_archived`.
            
        self.stdout.write(self.style.SUCCESS(f'{count} demandes ont été archivées légalement.'))

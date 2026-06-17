from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Count, Q
from django.utils import timezone
from .models import (
    VisaApplication, ApplicationStatus, VisaHistory, EmbassyOpinion, 
    BorderCheckStatus, SecurityAlert
)
from apps.evisa.models import EVisa, BorderCrossing
from .serializers import VisaApplicationSerializer, SecurityAlertSerializer
from apps.evisa.serializers import EVisaSerializer
from .services import EVisa_service
from apps.notifications.models import NotificationService
from evisa_backend.utils import api_response

class ImmigrationStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not (request.user.role in ['AGENT', 'ADMIN', 'EMBASSY']):
            return api_response(message="Accès refusé", status_code=status.HTTP_403_FORBIDDEN)
        
        queryset = VisaApplication.objects.all()
        if request.user.role == 'EMBASSY':
            queryset = queryset.filter(assigned_agent=request.user)
        elif request.user.role == 'AGENT':
            # Agents see all or their assigned? The user said they only handle dossiers for those with no diplomatic rep.
            # So they should also see what's assigned to them.
            queryset = queryset.filter(assigned_agent=request.user)

        # Base stats for dashboard tiles
        stats = queryset.aggregate(
            pending=Count('id', filter=Q(status=ApplicationStatus.SUBMITTED)),
            processing=Count('id', filter=Q(status=ApplicationStatus.PROCESSING)),
            approved=Count('id', filter=Q(status=ApplicationStatus.APPROVED)),
            rejected=Count('id', filter=Q(status=ApplicationStatus.REJECTED)),
            newComplementsCount=Count('id', filter=Q(status=ApplicationStatus.DOCS_PROVIDED))
        )
        
        # Stats pour le profil (Réelles)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        today = timezone.now().date()
        
        monthly_data = queryset.filter(processed_at__gte=thirty_days_ago).aggregate(
            total=Count('id'),
            approved=Count('id', filter=Q(status=ApplicationStatus.APPROVED))
        )
        
        # Temps moyen de traitement (en jours)
        from django.db.models import Avg, F, ExpressionWrapper, DurationField
        avg_time = queryset.filter(processed_at__isnull=False, submitted_at__isnull=False).annotate(
            duration=ExpressionWrapper(F('processed_at') - F('submitted_at'), output_field=DurationField())
        ).aggregate(avg_duration=Avg('duration'))['avg_duration']
        
        avg_days = avg_time.total_seconds() / 86400 if avg_time else 0
        
        stats['processedToday'] = queryset.filter(processed_at__date=today).count()
        stats['monthlyTotal'] = monthly_data['total']
        stats['compliance'] = round((monthly_data['approved'] / monthly_data['total'] * 100), 1) if monthly_data['total'] > 0 else 100.0
        stats['avgDays'] = round(avg_days, 1)
        
        return api_response(data=stats)

class ImmigrationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not (request.user.role in ['AGENT', 'ADMIN', 'EMBASSY']):
            return api_response(message="Accès refusé", status_code=status.HTTP_403_FORBIDDEN)
        
        queryset = VisaApplication.objects.all()
        if request.user.role in ['EMBASSY', 'AGENT'] and not request.user.is_superuser:
            queryset = queryset.filter(assigned_agent=request.user)
            
        # Filtres
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        nationality = request.query_params.get('nationality')
        if nationality:
            queryset = queryset.filter(nationality__icontains=nationality)
            
        date_from = request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(created_at__date__gte=date_from)
            
        serializer = VisaApplicationSerializer(queryset, many=True)
        return api_response(data=serializer.data)

class ImmigrationDecisionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if not (request.user.role in ['AGENT', 'ADMIN', 'EMBASSY']):
            return api_response(message="Accès refusé", status_code=status.HTTP_403_FORBIDDEN)
            
        try:
            application = VisaApplication.objects.get(pk=pk)
        except VisaApplication.DoesNotExist:
            return api_response(message="Demande introuvable", status_code=status.HTTP_404_NOT_FOUND)
            
        decision = request.data.get('decision') # 'APPROVE' or 'REJECT'
        reason = request.data.get('reason')
        
        if decision == 'APPROVE':
            application.status = ApplicationStatus.APPROVED
            application.processed_by = request.user
            application.processed_at = timezone.now()
            application.save()
            
            # Générer E-Visa
            try:
                evisa = EVisa_service.generate_evisa(application)
                if not evisa:
                    raise Exception("L'objet e-Visa n'a pas pu être créé.")
            except Exception as e:
                # Si la génération échoue, on logue mais l'application reste APPROVED
                # Optionnel: On pourrait revert le status si c'est critique
                print(f"CRITICAL ERROR: Génération e-visa échouée pour {application.application_number}: {e}")
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Erreur génération e-visa: {e}", exc_info=True)
            
            # Notification Email
            NotificationService.send_application_approved(application)

            # Journal d'audit (Sécurité)
            from apps.audit.utils import log_action
            log_action(
                user=request.user,
                application=application,
                action="APPROVE_VISA",
                description=f"Visa approuvé pour {application.full_name}",
                data_after={"status": application.status},
                request=request
            )

            VisaHistory.objects.create(
                application=application,
                user=request.user,
                action="Approbation",
                details="Demande approuvée par l'agent"
            )
            return api_response(message="Demande approuvée avec succès")
            
        elif decision == 'REJECT':
            if not reason:
                return api_response(message="Le motif de rejet est obligatoire", status_code=status.HTTP_400_BAD_REQUEST)
            
            application.status = ApplicationStatus.REJECTED
            application.rejection_reason = reason
            application.processed_by = request.user
            application.processed_at = timezone.now()
            application.save()
            
            # Notification Email
            NotificationService.send_application_rejected(application)

            # Journal d'audit (Sécurité)
            from apps.audit.utils import log_action
            log_action(
                user=request.user,
                application=application,
                action="REJECT_VISA",
                description=f"Visa rejeté pour {application.full_name}. Motif: {reason}",
                data_after={"status": application.status, "reason": reason},
                request=request
            )

            VisaHistory.objects.create(
                application=application,
                user=request.user,
                action="Rejet",
                details=f"Demande rejetée : {reason}"
            )
            return api_response(message="Demande rejetée avec succès")
            
        return api_response(message="Décision invalide", status_code=status.HTTP_400_BAD_REQUEST)

class EmbassyListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'EMBASSY':
            return api_response(message="Accès réservé aux ambassades", status_code=status.HTTP_403_FORBIDDEN)
            
        from apps.users.utils import get_country_variants
        from django.db.models import Q
        
        user = request.user
        query = Q(assigned_agent=user)
        
        # 1. Déterminer le pays de l'ambassade (Priorité au champ dédié, sinon déduction par l'email)
        embassy_country = user.embassy_country
        if not embassy_country and user.email:
            # Fallback : si le champ est vide, on tente de deviner via l'email (ex: ambassade.belgium@...)
            email_part = user.email.split('@')[0].split('.')[-1]
            if email_part:
                embassy_country = email_part.capitalize()

        if embassy_country:
            # On récupère toutes les variantes linguistiques (Fr/En)
            country_variants = get_country_variants(embassy_country)
            
            # Recherche ultra-robuste : on teste chaque variante
            variant_query = Q()
            for variant in country_variants:
                # Match insensible à la casse pour la nationalité OU le pays de résidence
                variant_query |= Q(nationality__icontains=variant)
                variant_query |= Q(residence_country__icontains=variant)
            query |= variant_query
            
        # Filtrer, exclure les brouillons et trier (les plus récents en premier)
        queryset = VisaApplication.objects.filter(query).exclude(status='DRAFT').order_by('-created_at')
        serializer = VisaApplicationSerializer(queryset, many=True)
        return api_response(data=serializer.data)

class EmbassyOpinionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'EMBASSY':
            return api_response(message="Accès réservé aux ambassades", status_code=status.HTTP_403_FORBIDDEN)
            
        try:
            application = VisaApplication.objects.get(pk=pk)
        except VisaApplication.DoesNotExist:
            return api_response(message="Demande introuvable", status_code=status.HTTP_404_NOT_FOUND)
            
        opinion = request.data.get('opinion') # 'FAVORABLE' or 'UNFAVORABLE'
        comment = request.data.get('comment', '')
        
        if opinion not in ['FAVORABLE', 'UNFAVORABLE']:
            return api_response(message="Avis invalide", status_code=status.HTTP_400_BAD_REQUEST)
            
        application.embassy_opinion = opinion
        application.embassy_comment = comment
        # On peut aussi changer le statut pour dire que l'avis a été donné
        if application.status == ApplicationStatus.PENDING_REVIEW:
            application.status = ApplicationStatus.PROCESSING
            
        application.save()
        
        VisaHistory.objects.create(
            application=application,
            user=request.user,
            action="Avis Embassade",
            details=f"Avis: {opinion}. Commentaire: {comment}"
        )
        
        return api_response(message="Avis enregistré avec succès")

class BorderVerificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'BORDER':
            return api_response(message="Accès réservé aux agents frontières", status_code=status.HTTP_403_FORBIDDEN)
            
        query = request.query_params.get('query', '').strip() # Numéro visa, Application ou Passport
        if not query:
            return api_response(message="Veuillez fournir un numéro ou un scan QR", status_code=status.HTTP_400_BAD_REQUEST)
            
        try:
            # Extraction intelligente si c'est une URL de vérification complète
            if query.startswith('http://') or query.startswith('https://'):
                from urllib.parse import urlparse, parse_qs
                try:
                    parsed_url = urlparse(query)
                    params = parse_qs(parsed_url.query)
                    token_val = params.get('token', [None])[0]
                    if token_val:
                        query = token_val.strip()
                except Exception:
                    pass

            # Si c'est un token signé (contenant un deux-points), on extrait la partie gauche (numéro de visa)
            if ':' in query:
                query = query.split(':')[0].strip()

            # Recherche robuste (iexact)
            application = VisaApplication.objects.filter(
                Q(application_number__iexact=query) | 
                Q(evisa__visa_number__iexact=query)
            ).first()
            
            # Si non trouvé, on tente de décrypter en Python pour chercher par passeport physique en clair
            if not application:
                for app in VisaApplication.objects.exclude(passport_number=''):
                    try:
                        decrypted = app.get_decrypted_passport()
                        if decrypted and decrypted.strip().upper() == query.upper():
                            application = app
                            break
                    except Exception:
                        pass

            if not application:
                return api_response(message="Visa ou Demande introuvable", status_code=status.HTTP_404_NOT_FOUND)

            # Auto-healing : si la demande est approuvée mais l'e-visa est manquant, on le génère à la volée
            evisa_obj = getattr(application, 'evisa', None)
            if application.status == 'APPROVED' and not evisa_obj:
                try:
                    from .services import EVisa_service
                    evisa_obj = EVisa_service.generate_evisa(application)
                    application.refresh_from_db()
                except Exception as e:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Auto-generation e-visa failed in border check for {application.application_number}: {e}", exc_info=True)
            
            # Formater la réponse comme attendu par le frontend VerificationVisaPage.tsx
            return Response({
                'valid': evisa_obj.is_valid if evisa_obj else False,
                'message': 'Visa valide' if (evisa_obj and evisa_obj.is_valid) else 'e-Visa introuvable ou expiré',
                'evisa': EVisaSerializer(evisa_obj).data if evisa_obj else None,
                'application': VisaApplicationSerializer(application).data
            })
        except Exception as e:
            return api_response(message=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BorderCheckInView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'BORDER':
            return api_response(message="Accès réservé aux agents frontières", status_code=status.HTTP_403_FORBIDDEN)
            
        try:
            application = VisaApplication.objects.get(pk=pk)
        except VisaApplication.DoesNotExist:
            return api_response(message="Demande introuvable", status_code=status.HTTP_404_NOT_FOUND)
            
        action = request.data.get('action') # 'ENTRY', 'EXIT', or 'DENIED'
        location = request.data.get('location', 'Poste Frontière')
        notes = request.data.get('notes', '')
        
        # 1. Mise à jour du statut simplifié sur la demande
        if action == 'ENTRY':
            application.border_check_status = BorderCheckStatus.ENTERED
            msg = "Entrée enregistrée avec succès"
        elif action == 'EXIT':
            application.border_check_status = BorderCheckStatus.EXITED
            msg = "Sortie enregistrée avec succès"
        elif action == 'DENIED':
            application.border_check_status = BorderCheckStatus.DENIED
            msg = "Refus de l'entrée enregistré avec succès"
        else:
            return api_response(message="Action invalide", status_code=status.HTTP_400_BAD_REQUEST)
            
        application.border_agent = request.user
        application.border_checked_at = timezone.now()
        application.save()

        # 2. Création de l'enregistrement détaillé (Traçabilité BorderCrossing)
        evisa_obj = getattr(application, 'evisa', None)
        crossing = BorderCrossing.objects.create(
            application=application,
            evisa=evisa_obj,
            border_agent=request.user,
            crossing_type=action,
            location=location,
            notes=notes
        )

        # 3. Logique spécifique et Notifications
        if action == 'ENTRY':
            # Calcul de la date de sortie prévisionnelle (base: max_stay_days du type de visa)
            from datetime import timedelta
            max_stay = application.visa_type.max_stay_days if application.visa_type else 30
            crossing.expected_exit_date = crossing.crossing_date.date() + timedelta(days=max_stay)
            crossing.save(update_fields=['expected_exit_date'])
            
            # Notification
            try:
                NotificationService.send_border_entry(application, crossing)
            except Exception as e:
                print(f"Error sending entry notification: {e}")

        elif action == 'EXIT':
            # Tenter de lier à la dernière entrée non clôturée
            last_entry = BorderCrossing.objects.filter(
                application=application, 
                crossing_type='ENTRY', 
                linked_exit__isnull=True
            ).order_by('-crossing_date').first()
            
            if last_entry:
                last_entry.linked_exit = crossing
                last_entry.save(update_fields=['linked_exit'])
                
            # Notification
            try:
                NotificationService.send_border_exit(application, crossing)
            except Exception as e:
                print(f"Error sending exit notification: {e}")

        elif action == 'DENIED':
            # Auto-générer une alerte de sécurité
            SecurityAlert.objects.create(
                application=application,
                type='HIGH',
                title=f"Refus d'entrée : {application.full_name}",
                description=f"L'agent {request.user.get_full_name()} a refusé l'entrée au territoire pour le passeport {application.passport_number}.",
                location=location
            )
            
            # Envoi de l'email au demandeur
            try:
                NotificationService.send_border_denial_email(application, request.user, location)
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Erreur envoi email refus frontière: {e}", exc_info=True)
            
        # 4. Historique
        VisaHistory.objects.create(
            application=application,
            user=request.user,
            action=f"Frontière: {action}",
            details=f"Passage {action} enregistré à {location}."
        )
        
        return api_response(message=msg)

class BorderStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'BORDER':
            return api_response(message="Accès refusé", status_code=status.HTTP_403_FORBIDDEN)
        
        today = timezone.now().date()
        
        stats = {
            'controleToday': VisaApplication.objects.filter(
                border_checked_at__date=today,
                border_agent=request.user
            ).count(),
            'visasInvalides': VisaApplication.objects.filter(
                border_check_status=BorderCheckStatus.DENIED,
                border_checked_at__date=today
            ).count(),
            'alertesDeclenchees': SecurityAlert.objects.filter(
                created_at__date=today
            ).count(),
            'averageScanTime': '12s' # Placeholder
        }
        
        # Recent activity
        recent = VisaApplication.objects.filter(
            border_checked_at__isnull=False
        ).order_by('-border_checked_at')[:5]
        
        recent_data = VisaApplicationSerializer(recent, many=True).data
        
        return api_response(data={
            'stats': stats,
            'recent_controls': recent_data
        })

class BorderHistoryListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'BORDER':
            return api_response(message="Accès refusé", status_code=status.HTTP_403_FORBIDDEN)
        
        queryset = VisaApplication.objects.filter(
            border_checked_at__isnull=False
        ).order_by('-border_checked_at')
        
        serializer = VisaApplicationSerializer(queryset, many=True)
        return api_response(data=serializer.data)

class SecurityAlertListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'BORDER':
            return api_response(message="Accès refusé", status_code=status.HTTP_403_FORBIDDEN)
            
        alerts = SecurityAlert.objects.all().order_by('-created_at')
        serializer = SecurityAlertSerializer(alerts, many=True)
        return api_response(data=serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Count, Q
from django.utils import timezone
from .models import (
    VisaApplication, ApplicationStatus, VisaHistory, EmbassyOpinion, 
    BorderCheckStatus, SecurityAlert
)
from apps.evisa.models import EVisa
from .serializers import VisaApplicationSerializer, SecurityAlertSerializer
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
                EVisa_service.generate_evisa(application)
            except Exception as e:
                print(f"Erreur génération e-visa: {e}")
            
            # Notification Email
            NotificationService.send_application_approved(application)

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

            VisaHistory.objects.create(
                application=application,
                user=request.user,
                action="Rejet",
                details=f"Motif: {reason}"
            )
            return api_response(message="Demande rejetée avec succès")
            
        return api_response(message="Décision invalide", status_code=status.HTTP_400_BAD_REQUEST)

class EmbassyListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'EMBASSY':
            return api_response(message="Accès réservé aux ambassades", status_code=status.HTTP_403_FORBIDDEN)
            
        country = request.user.embassy_country
        if not country:
            return api_response(message="Configuration ambassade manquante pour l'utilisateur", status_code=status.HTTP_400_BAD_REQUEST)
            
        # Filtrer par pays de résidence (comme demandé)
        queryset = VisaApplication.objects.filter(residence_country=country)
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
            
        query = request.query_params.get('query') # Numéro visa ou QR code data
        if not query:
            return api_response(message="Veuillez fournir un numéro ou un scan QR", status_code=status.HTTP_400_BAD_REQUEST)
            
        try:
            # Recherche par numéro d'application, numéro de visa, ou numéro de passeport
            application = VisaApplication.objects.filter(
                Q(application_number=query) | 
                Q(evisa__visa_number=query) |
                Q(passport_number=query)
            ).first()
            
            if not application:
                return api_response(message="E-Visa introuvable", status_code=status.HTTP_404_NOT_FOUND)
                
            serializer = VisaApplicationSerializer(application)
            return api_response(data=serializer.data)
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
        
        if action == 'ENTRY':
            application.border_check_status = BorderCheckStatus.ENTERED
            msg = "Entrée enregistrée avec succès"
        elif action == 'EXIT':
            application.border_check_status = BorderCheckStatus.EXITED
            msg = "Sortie enregistrée avec succès"
        elif action == 'DENIED':
            application.border_check_status = BorderCheckStatus.DENIED
            msg = "Refus de l'entrée enregistré avec succès"
            # Auto-générer une alerte de sécurité
            SecurityAlert.objects.create(
                application=application,
                type='HIGH',
                title=f"Refus d'entrée : {application.full_name}",
                description=f"L'agent {request.user.get_full_name()} a refusé l'entrée au territoire pour le passeport {application.passport_number}.",
                location="Poste Frontière (Localisation Agent)"
            )
        else:
            return api_response(message="Action invalide", status_code=status.HTTP_400_BAD_REQUEST)
            
        application.border_agent = request.user
        application.border_checked_at = timezone.now()
        application.save()
        
        VisaHistory.objects.create(
            application=application,
            user=request.user,
            action=f"Frontière: {action}",
            details=f"Action: {action}. Statut mis à jour."
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

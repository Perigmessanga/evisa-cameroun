from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Count, Q
from django.utils import timezone
from .models import VisaApplication, ApplicationStatus, VisaHistory, EmbassyOpinion, BorderCheckStatus, EVisa
from .serializers import VisaApplicationSerializer
from .services import EVisa_service
from evisa_backend.utils import api_response

class ImmigrationStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not (request.user.role == 'AGENT' or request.user.role == 'ADMIN'):
            return api_response(message="Accès refusé", status_code=status.HTTP_403_FORBIDDEN)
        
        stats = VisaApplication.objects.aggregate(
            pending=Count('id', filter=Q(status=ApplicationStatus.SUBMITTED)),
            processing=Count('id', filter=Q(status=ApplicationStatus.PROCESSING)),
            approved=Count('id', filter=Q(status=ApplicationStatus.APPROVED)),
            rejected=Count('id', filter=Q(status=ApplicationStatus.REJECTED))
        )
        return api_response(data=stats)

class ImmigrationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not (request.user.role == 'AGENT' or request.user.role == 'ADMIN'):
            return api_response(message="Accès refusé", status_code=status.HTTP_403_FORBIDDEN)
        
        queryset = VisaApplication.objects.all()
        
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
        if not (request.user.role == 'AGENT' or request.user.role == 'ADMIN'):
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
                # On continue quand même ? Ou on lève une erreur ?
                # Pour l'instant on continue mais on logue
            
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
                Q(e_visa__visa_number=query) |
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
            
        action = request.data.get('action') # 'ENTRY' or 'EXIT'
        
        if action == 'ENTRY':
            application.border_check_status = BorderCheckStatus.ENTERED
        elif action == 'EXIT':
            application.border_check_status = BorderCheckStatus.EXITED
        else:
            return api_response(message="Action invalide", status_code=status.HTTP_400_BAD_REQUEST)
            
        application.border_agent = request.user
        application.border_checked_at = timezone.now()
        application.save()
        
        VisaHistory.objects.create(
            application=application,
            user=request.user,
            action=f"Frontière: {action}",
            details="Passage enregistré"
        )
        
        return api_response(message=f"{action} enregistrée avec succès")

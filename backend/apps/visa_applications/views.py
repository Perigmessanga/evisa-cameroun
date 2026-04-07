from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q, Count
from django.utils import timezone
import qrcode
from apps.visa_applications.serializers import DocumentSerializer

from apps.visa_applications.models import VisaType, VisaApplication, ApplicationComment
from apps.visa_applications.serializers import (
    VisaTypeSerializer,
    ApplicationDetailSerializer,
    CreateApplicationSerializer,
    ApplicationListSerializer,
    CommentSerializer,
    ApproveApplicationSerializer,
    RejectApplicationSerializer,
    RequestDocumentsSerializer,
    VisaApplicationUpdateSerializer,
    VisaApplicationSerializer,
    ApplicationCommentCreateSerializer,
    CommentSerializer as ApplicationCommentSerializer,
    
    
)


class VisaTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des types de visa.
    GET /api/visa-types/           - Liste tous les types
    GET /api/visa-types/{id}/      - Détails d'un type
    POST/PUT/DELETE                - Réservé aux administrateurs
    """
    queryset = VisaType.objects.all()
    serializer_class = VisaTypeSerializer
    
    def get_permissions(self):
        from rest_framework.permissions import IsAdminUser, AllowAny
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or getattr(user, 'is_applicant', True):
            return VisaType.objects.filter(is_active=True)
        return VisaType.objects.all()



class VisaApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des demandes de visa.
    """
    queryset = VisaApplication.objects.all()
    serializer_class = CreateApplicationSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        user = self.request.user
        
        # Les demandeurs voient seulement leurs demandes
        if user.is_applicant:
            return VisaApplication.objects.filter(applicant=user)
        
        # Les agents voient les demandes qui leur sont assignées (load balanced)
        elif user.is_agent:
            return VisaApplication.objects.filter(assigned_agent=user).exclude(status='DRAFT')
        
        # Les admins voient tout
        elif user.is_admin:
            return VisaApplication.objects.all()
        
        # Les ambassades voient les demandes de leur pays de résidence (zone géographique) OR si assigné directement
        elif user.is_embassy:
            query = Q(assigned_agent=user)
            if user.embassy_country:
                query |= Q(residence_country=user.embassy_country)
            return VisaApplication.objects.filter(query).exclude(status='DRAFT')
        
        return VisaApplication.objects.none()

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Retourne les statistiques réelles pour le dashboard Admin/Superviseur.
        """
        from apps.payments.models import Payment, PaymentStatus
        from django.contrib.auth import get_user_model
        if not getattr(request.user, 'is_admin', False) and not getattr(request.user, 'is_agent', False):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Vous n'avez pas accès aux statistiques.")
        
        from django.db.models import Sum, Count
        User = get_user_model()
        
        total = VisaApplication.objects.count()
        approved = VisaApplication.objects.filter(status='APPROVED').count()
        rejected = VisaApplication.objects.filter(status='REJECTED').count()
        pending = VisaApplication.objects.filter(status__in=['SUBMITTED', 'UNDER_REVIEW']).count()
        
        revenue_aggr = Payment.objects.filter(status=PaymentStatus.COMPLETED).aggregate(total_revenue=Sum('amount'))
        revenue = revenue_aggr['total_revenue'] or 0
        
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()

        # Stats by visa type
        distribution = VisaApplication.objects.values('visa_type__name').annotate(count=Count('id'))
        # Origins (using nationality)
        origins = VisaApplication.objects.values('nationality').annotate(count=Count('id')).order_by('-count')[:3]
        
        return Response({
            'total': total,
            'approved': approved,
            'rejected': rejected,
            'pending': pending,
            'revenue': revenue,
            'total_users': total_users,
            'active_users': active_users,
            'distribution': list(distribution),
            'origins': list(origins)
        })

    @action(detail=False, methods=['get'])
    def export_pdf_report(self, request):
        """
        Génère un rapport PDF des statistiques.
        """
        if not getattr(request.user, 'is_admin', False) and not getattr(request.user, 'is_agent', False):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Vous n'avez pas accès aux rapports.")

        import io
        from django.http import HttpResponse
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
        from django.utils.timezone import now
        from apps.payments.models import Payment, PaymentStatus
        from django.db.models import Sum, Count

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        
        width, height = A4
        margin = 50

        p.setFont("Helvetica-Bold", 16)
        p.drawString(margin, height - 50, "Rapport des Statistiques de e-Visa Cameroun")
        p.setFont("Helvetica", 10)
        p.drawString(margin, height - 70, f"Généré le {now().strftime('%d/%m/%Y %H:%M')}")
        p.line(margin, height - 80, width - margin, height - 80)

        total = VisaApplication.objects.count()
        approved = VisaApplication.objects.filter(status='APPROVED').count()
        rejected = VisaApplication.objects.filter(status='REJECTED').count()
        pending = VisaApplication.objects.filter(status__in=['SUBMITTED', 'UNDER_REVIEW']).count()
        revenue_aggr = Payment.objects.filter(status=PaymentStatus.COMPLETED).aggregate(total_revenue=Sum('amount'))
        revenue = revenue_aggr['total_revenue'] or 0

        y = height - 120
        p.setFont("Helvetica-Bold", 12)
        p.drawString(margin, y, "Indicateurs Clés")
        y -= 20
        p.setFont("Helvetica", 11)
        p.drawString(margin + 20, y, f"Total des demandes : {total}")
        y -= 15
        p.drawString(margin + 20, y, f"Demandes approuvées : {approved}")
        y -= 15
        p.drawString(margin + 20, y, f"Demandes rejetées : {rejected}")
        y -= 15
        p.drawString(margin + 20, y, f"Demandes en cours : {pending}")
        y -= 15
        p.drawString(margin + 20, y, f"Recettes totales (FCFA) : {revenue}")
        y -= 30

        p.setFont("Helvetica-Bold", 12)
        p.drawString(margin, y, "Répartition par Type de Visa")
        y -= 20
        p.setFont("Helvetica", 11)
        distribution = VisaApplication.objects.values('visa_type__name').annotate(count=Count('id'))
        for item in distribution:
            p.drawString(margin + 20, y, f"{item['visa_type__name']} : {item['count']}")
            y -= 15

        p.showPage()
        p.save()
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="rapport_evisa.pdf"'
        return response

    def get_serializer_class(self):
        if self.action == 'list':
            return ApplicationListSerializer
        elif self.action == 'retrieve':
            return ApplicationDetailSerializer
        elif self.action == 'create':
            return CreateApplicationSerializer
        elif self.action in ['update', 'partial_update']:
            return VisaApplicationUpdateSerializer
        return VisaApplicationSerializer

    def perform_create(self, serializer):
        """Créer une demande (brouillon) pour l'utilisateur connecté."""
        serializer.save(applicant=self.request.user)

    def update(self, request, *args, **kwargs):
        """Modifier une demande (seulement si status = DRAFT)."""
        instance = self.get_object()
        
        # Seul le demandeur peut modifier sa propre demande
        if instance.applicant != request.user:
            return Response({
                'error': 'Vous ne pouvez pas modifier cette demande.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Vérifier que la demande est encore modifiable
        if not instance.is_editable:
            return Response({
                'error': 'Cette demande ne peut plus être modifiée.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'], parser_classes=[parsers.MultiPartParser, parsers.FormParser])
    def upload_document(self, request, pk=None):
        """
        Upload un document pour la demande actuelle.
        POST /api/visa-applications/{id}/upload_document/
        """
        application = self.get_object()
        
        if getattr(application, 'applicant', None) != request.user:
            return Response({'error': 'Vous ne pouvez pas modifier cette demande.'}, status=status.HTTP_403_FORBIDDEN)
            
        if not getattr(application, 'is_editable', True) and application.status != 'DRAFT':
            return Response({'error': 'Cette demande ne peut plus être modifiée.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DocumentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(application=application)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path=r'delete_document/(?P<doc_id>[^/.]+)')
    def delete_document(self, request, pk=None, doc_id=None):
        """
        Supprime un document d'une demande.
        DELETE /api/visa-applications/{id}/delete_document/{doc_id}/
        """
        application = self.get_object()
        
        if getattr(application, 'applicant', None) != request.user:
            return Response({'error': 'Vous ne pouvez pas modifier cette demande.'}, status=status.HTTP_403_FORBIDDEN)
            
        if not getattr(application, 'is_editable', True) and application.status != 'DRAFT':
            return Response({'error': 'Cette demande ne peut plus être modifiée.'}, status=status.HTTP_400_BAD_REQUEST)

        doc = application.documents.filter(id=doc_id).first()
        if not doc:
            return Response({'error': 'Document introuvable.'}, status=status.HTTP_404_NOT_FOUND)
            
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """
        Soumettre une demande (après paiement).
        POST /api/visa-applications/{id}/submit/
        """
        application = self.get_object()
        
        # Vérifier que c'est bien le demandeur
        if application.applicant != request.user:
            return Response({
                'error': 'Vous ne pouvez pas soumettre cette demande.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Vérifier le statut
        if application.status != 'DRAFT':
            return Response({
                'error': 'Cette demande a déjà été soumise.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier que le paiement est complété
        if not hasattr(application, 'payment') or not application.payment.is_completed:
            return Response({
                'error': 'Le paiement doit être complété avant de soumettre.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Soumettre la demande
        application.status = 'SUBMITTED'
        application.submitted_at = timezone.now()
        application.save()
        
        # Assignation automatique d'un agent
        application.assign_best_agent()
        
        # Envoi d'email
        from apps.notifications.models import NotificationService
        NotificationService.send_application_submitted(application)
        
        return Response({
            'message': 'Demande soumise avec succès.',
            'application': VisaApplicationSerializer(application).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        """
        Changer le statut d'une demande (agents/admin uniquement).
        POST /api/visa-applications/{id}/update-status/
        Body: { "status": "APPROVED", "rejection_reason": "..." }
        """
        application = self.get_object()
        user = request.user
        
        # Vérifier les permissions
        if not (user.is_agent or user.is_admin):
            return Response({
                'error': 'Vous n\'avez pas la permission de modifier le statut.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = VisaApplicationStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        new_status = serializer.validated_data['status']
        rejection_reason = serializer.validated_data.get('rejection_reason')
        
        # Assigner l'agent si pas déjà assigné
        if not application.assigned_agent and user.is_agent:
            application.assigned_agent = user
        
        # Mettre à jour le statut
        application.status = new_status
        
        if new_status == 'REJECTED':
            application.rejection_reason = rejection_reason
        
        if new_status in ['APPROVED', 'REJECTED']:
            application.processed_at = timezone.now()
        
        application.save()
        
        # Si APPROVED, générer l'e-visa via le service dédié
        if new_status == 'APPROVED':
            from .services import EVisa_service
            EVisa_service.generate_evisa(application)
            
        # Envoi de la notification selons le nouveau statut
        from apps.notifications.models import NotificationService
        if new_status == 'APPROVED':
            NotificationService.send_application_approved(application)
        elif new_status == 'REJECTED':
            NotificationService.send_application_rejected(application)
        elif new_status == 'PENDING_DOCS':
            agent_msg = rejection_reason if rejection_reason else "Veuillez fournir les documents manquants."
            NotificationService.send_documents_requested(application, agent_msg)
        
        return Response({
            'message': f'Statut mis à jour : {new_status}',
            'application': VisaApplicationSerializer(application).data
        })

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """
        Voir les commentaires d'une demande.
        GET /api/visa-applications/{id}/comments/
        """
        application = self.get_object()
        comments = application.comments.all()
        
        # Les demandeurs ne voient pas les commentaires internes
        if request.user.is_applicant:
            comments = comments.filter(is_internal=False)
        
        serializer = ApplicationCommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """
        Ajouter un commentaire sur une demande.
        POST /api/visa-applications/{id}/add-comment/
        Body: { "content": "...", "is_internal": true }
        """
        application = self.get_object()
        
        serializer = ApplicationCommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        comment = serializer.save(
            application=application,
            author=request.user
        )
        
        return Response(
            ApplicationCommentSerializer(comment).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def assign_agent(self, request, pk=None):
        """Affecter un agent à une demande."""
        if not (request.user.is_admin or request.user.is_embassy):
            return Response({'error': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        agent_id = request.data.get('agent_id')
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            agent = User.objects.get(id=agent_id, role='AGENT')
            application.assigned_agent = agent
            application.save(update_fields=['assigned_agent'])
            return Response({'message': 'Agent affecté.'})
        except User.DoesNotExist:
            return Response({'error': 'Agent introuvable.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def request_missing_docs(self, request, pk=None):
        """Passer la demande en statut PENDING_DOCS."""
        if not (request.user.is_agent or request.user.is_admin or request.user.is_embassy):
            return Response({'error': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        serializer = RequestDocumentsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        application.status = 'PENDING_DOCS'
        application.save(update_fields=['status'])
        
        # Enregistrer le motif comme commentaire interne/externe
        ApplicationComment.objects.create(
            application=application,
            author=request.user,
            content=f"Demande de documents : {serializer.validated_data['message']}",
            is_internal=False
        )
        
        # Envoi de notification
        from apps.notifications.models import NotificationService
        NotificationService.send_documents_requested(application, serializer.validated_data['message'])
        
        return Response({'message': 'Demande de documents envoyée.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upload_supplementary_docs(self, request, pk=None):
        """Action pour que le demandeur puisse envoyer les documents demandés."""
        application = self.get_object()
        
        # Vérifier si l'application est bien en attente de documents
        if application.status != 'PENDING_DOCS':
            return Response(
                {'error': 'Cette demande n\'est pas en attente de documents.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # On attend une liste de fichiers
        files = request.FILES.getlist('files')
        if not files:
            return Response({'error': 'Aucun fichier n\'a été envoyé.'}, status=status.HTTP_400_BAD_REQUEST)
            
        from apps.visa_applications.models import Document
        from apps.visa_applications.serializers import DocumentSerializer
        
        created_docs = []
        for f in files:
            doc = Document.objects.create(
                application=application,
                file=f,
                file_name=f.name,
                file_size=f.size,
                document_type='OTHER', # Par défaut
                mime_type=f.content_type
            )
            created_docs.append(doc)
            
        # Optionnel: On peut changer le statut vers 'SUBMITTED' ou 'PROCESSING' 
        # pour signaler à l'agent que le dossier est à nouveau complet.
        # Ici on le laisse en PENDING_DOCS mais on ajoute un commentaire.
        
        ApplicationComment.objects.create(
            application=application,
            author=request.user,
            content=f"L'utilisateur a envoyé {len(created_docs)} document(s) complémentaire(s).",
            is_internal=False
        )
        
        return Response({
            'message': 'Documents enregistrés avec succès.',
            'documents': DocumentSerializer(created_docs, many=True).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit_opinion(self, request, pk=None):
        """Ajouter un avis consultatif (Ambassade)."""
        if not request.user.is_embassy:
            return Response({'error': 'Permission refusée. Réservé à l\'ambassade.'}, status=status.HTTP_403_FORBIDDEN)
        
        opinion = request.data.get('opinion') # 'FAVORABLE' or 'UNFAVORABLE'
        notes = request.data.get('notes', '')
        
        if opinion not in ['FAVORABLE', 'UNFAVORABLE']:
            return Response({'error': 'L\'avis doit être FAVORABLE ou UNFAVORABLE.'}, status=status.HTTP_400_BAD_REQUEST)
        
        application.embassy_opinion = opinion
        application.embassy_comment = notes
        # Revenir en traitement pour que l'agent puisse décider finalment
        application.status = 'PROCESSING'
        application.save()

        ApplicationComment.objects.create(
            application=application,
            author=request.user,
            content=f"Avis {opinion} fourni par l'ambassade : {notes}",
            is_internal=True
        )
        
        return Response({'message': f'Avis {opinion} enregistré. Demande renvoyée en traitement.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def request_embassy_review(self, request, pk=None):
        """Demander l'avis de l'ambassade."""
        if not (request.user.is_agent or request.user.is_admin):
            return Response({'error': 'Permission refusée.'}, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        application.status = 'PENDING_REVIEW'
        application.save()
        
        ApplicationComment.objects.create(
            application=application,
            author=request.user,
            content="Avis consulaire sollicité auprès de l'Ambassade du Cameroun.",
            is_internal=True
        )
        return Response({'message': 'Demande d\'avis envoyée à l\'ambassade.'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Statistiques des demandes (admin/agents) enrichies pour le Dashboard.
        GET /api/visa-applications/stats/
        """
        user = request.user
        
        if not (user.is_agent or user.is_admin):
            return Response({
                'error': 'Permission refusée.'
            }, status=status.HTTP_403_FORBIDDEN)
            
        today = timezone.now().date()
        from datetime import timedelta
        week_ago = today - timedelta(days=7)
        
        # Filtrer par agent si c'est un agent ou une ambassade qui demande ses stats
        base_queryset = VisaApplication.objects.all()
        if user.is_agent or user.is_embassy:
            base_queryset = base_queryset.filter(assigned_agent=user)

        # Statistiques de base
        total = base_queryset.count()
        today_apps = base_queryset.filter(created_at__date=today).count()
        this_week_apps = base_queryset.filter(created_at__date__gte=week_ago).count()
        
        # Statistiques par statut
        stats_by_status = base_queryset.values('status').annotate(
            count=Count('id')
        )
        
        # Statistiques par type de visa
        stats_by_type = base_queryset.values(
            'visa_type__name'
        ).annotate(count=Count('id'))
        
        # Tendance sur 7 jours (demandes créées par jour)
        trend = base_queryset.filter(created_at__date__gte=week_ago) \
            .values('created_at__date') \
            .annotate(count=Count('id')) \
            .order_by('created_at__date')
            
        trend_data = [{'date': str(item['created_at__date']), 'count': item['count']} for item in trend]
        
        # 5 demandes récentes
        recent = base_queryset.all().order_by('-created_at')[:5]
        recent_data = ApplicationListSerializer(recent, many=True).data
        
        return Response({
            'total': total,
            'today': today_apps,
            'this_week': this_week_apps,
            'by_status': list(stats_by_status),
            'by_type': list(stats_by_type),
            'trend': trend_data,
            'recent_applications': recent_data,
            'pending': VisaApplication.objects.filter(
                status__in=['SUBMITTED', 'PROCESSING', 'PENDING_DOCS', 'PENDING_REVIEW']
            ).count(),
        })

#

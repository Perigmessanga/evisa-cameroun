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
    
    
)


class VisaTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour consulter les types de visa disponibles.
    GET /api/visa-types/           - Liste tous les types
    GET /api/visa-types/{id}/      - Détails d'un type
    """
    queryset = VisaType.objects.filter(is_active=True)
    serializer_class = VisaTypeSerializer
    permission_classes = [AllowAny]


class VisaApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des demandes de visa.
    """
    serializer_class = CreateApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Les demandeurs voient seulement leurs demandes
        if user.is_applicant:
            return VisaApplication.objects.filter(applicant=user)
        
        # Les agents voient les demandes assignées + non assignées
        elif user.is_agent:
            return VisaApplication.objects.filter(
                Q(assigned_agent=user) | Q(assigned_agent__isnull=True)
            ).exclude(status='DRAFT')
        
        # Les admins voient tout
        elif user.is_admin:
            return VisaApplication.objects.all()
        
        # Les ambassades voient les demandes de leur zone (à implémenter selon la logique)
        elif user.is_embassy:
            return VisaApplication.objects.filter(status='PENDING_REVIEW')
        
        return VisaApplication.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateApplicationSerializer
        elif self.action == 'list':
            return ApplicationListSerializer
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
        
        # TODO: Envoyer notification
        
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
        
        # TODO: Si APPROVED, générer l'e-visa
        # TODO: Envoyer notification
        
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
        
        # Statistiques de base
        total = VisaApplication.objects.count()
        today_apps = VisaApplication.objects.filter(created_at__date=today).count()
        this_week_apps = VisaApplication.objects.filter(created_at__date__gte=week_ago).count()
        
        # Statistiques par statut
        stats_by_status = VisaApplication.objects.values('status').annotate(
            count=Count('id')
        )
        
        # Statistiques par type de visa
        stats_by_type = VisaApplication.objects.values(
            'visa_type__name'
        ).annotate(count=Count('id'))
        
        # Tendance sur 7 jours (demandes créées par jour)
        trend = VisaApplication.objects.filter(created_at__date__gte=week_ago) \
            .values('created_at__date') \
            .annotate(count=Count('id')) \
            .order_by('created_at__date')
            
        trend_data = [{'date': str(item['created_at__date']), 'count': item['count']} for item in trend]
        
        # 5 demandes récentes
        recent = VisaApplication.objects.all().order_by('-created_at')[:5]
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

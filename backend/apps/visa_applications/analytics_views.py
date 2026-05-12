from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta
from apps.visa_applications.models import VisaApplication, ApplicationStatus
from apps.evisa.models import BorderCrossing

class AnalyticsStatsView(views.APIView):
    """
    Fournit des statistiques agrégées pour le dashboard Administrateur (Point 2).
    """
    permission_classes = [permissions.IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not getattr(request.user, 'is_admin', False):
            self.permission_denied(request, message="Accès réservé aux administrateurs.")

    def get(self, request):
        # 1. Volume de demandes par statut
        status_stats = VisaApplication.objects.values('status').annotate(count=Count('id'))
        
        # 2. Revenus (Visas + Prorogations)
        from apps.visa_applications.models import StayExtensionRequest
        
        visa_revenue = VisaApplication.objects.filter(
            status__in=['APPROVED', 'SUBMITTED', 'PROCESSING']
        ).aggregate(total=Sum('visa_type__fee'))['total'] or 0
        
        extension_revenue = StayExtensionRequest.objects.filter(
            status='APPROVED'
        ).aggregate(total=Sum('fee'))['total'] or 0
        
        total_revenue = visa_revenue + extension_revenue

        # 3. Répartition Géographique (Nationalité)
        geo_stats = VisaApplication.objects.values('nationality').annotate(count=Count('id')).order_by('-count')[:10]

        # 4. Taux de succès
        total_apps = VisaApplication.objects.exclude(status='DRAFT').count()
        approved_apps = VisaApplication.objects.filter(status='APPROVED').count()
        success_rate = (approved_apps / total_apps * 100) if total_apps > 0 else 0

        # 5. Flux temporels (Derniers 30 jours)
        last_30_days = timezone.now() - timedelta(days=30)
        daily_stats = VisaApplication.objects.filter(
            submitted_at__gte=last_30_days
        ).extra(select={'day': "date(submitted_at)"}).values('day').annotate(count=Count('id')).order_by('day')

        # 6. Passages Frontières
        crossings = BorderCrossing.objects.aggregate(
            entries=Count('id', filter=Q(crossing_type='ENTRY')),
            exits=Count('id', filter=Q(crossing_type='EXIT')),
            denied=Count('id', filter=Q(crossing_type='DENIED'))
        )

        return Response({
            'overview': {
                'total_revenue': total_revenue,
                'total_applications': total_apps,
                'success_rate': round(success_rate, 2),
            },
            'status_distribution': {s['status']: s['count'] for s in status_stats},
            'geo_distribution': {g['nationality']: g['count'] for g in geo_stats},
            'time_series': {str(d['day']): d['count'] for d in daily_stats},
            'border_activity': crossings
        })

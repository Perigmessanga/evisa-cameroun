"""
Filtres — App visa_applications
"""
import django_filters
from .models import VisaApplication


class VisaApplicationFilter(django_filters.FilterSet):
    status      = django_filters.CharFilter(field_name='status', lookup_expr='exact')
    nationality = django_filters.CharFilter(field_name='nationality', lookup_expr='icontains')
    visa_type   = django_filters.UUIDFilter(field_name='visa_type__id')
    date_from   = django_filters.DateFilter(field_name='submitted_at', lookup_expr='date__gte')
    date_to     = django_filters.DateFilter(field_name='submitted_at', lookup_expr='date__lte')

    class Meta:
        model  = VisaApplication
        fields = ['status', 'nationality', 'visa_type', 'date_from', 'date_to']
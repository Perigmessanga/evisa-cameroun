import { useState, useEffect } from 'react';
import visaService from '../../services/visaService';
import { 
  AlertTriangle, ShieldAlert, Clock, MapPin, 
  Search, Filter, CheckCircle2, Loader2, RefreshCw, X
} from 'lucide-react';
import Badge from '../../components/common/Badge';

interface SecurityAlert {
  id: string;
  type: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  location: string;
  is_resolved: boolean;
  created_at: string;
}

export default function AlertesSecuritePage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
      const data = await visaService.getBorderAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'HIGH': return <ShieldAlert className="text-cm-red" size={24} />;
      case 'MEDIUM': return <AlertTriangle className="text-orange-500" size={24} />;
      default: return <AlertTriangle className="text-cm-gold" size={24} />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'HIGH': return 'bg-cm-red/5 border-cm-red/20';
      case 'MEDIUM': return 'bg-orange-50 border-orange-200';
      default: return 'bg-cm-gold-pale/10 border-cm-gold-pale/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-cm-red mb-4" size={40} />
        <p className="text-cm-muted font-semibold">Récupération des alertes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
             <AlertTriangle className="text-cm-red" size={32} /> Alertes & Sécurité
          </h1>
          <p className="text-cm-muted font-semibold">Historique des incidents et notifications critiques</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-cm-border rounded-xl font-bold text-sm hover:bg-cm-cream transition-all disabled:opacity-50"
        >
          <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} /> Actualiser
        </button>
      </div>

      {/* ── ALERTS LIST ── */}
      <div className="grid gap-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-5 transition-all hover:shadow-md ${getAlertBg(alert.type)}`}
            >
              <div className="shrink-0 pt-1">
                 {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 space-y-2">
                 <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-cm-text">{alert.title}</h3>
                    <Badge variant={alert.type === 'HIGH' ? 'danger' : 'warning'}>
                      Niveau {alert.type}
                    </Badge>
                 </div>
                 <p className="text-cm-text text-sm font-semibold max-w-2xl">{alert.description}</p>
                 <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cm-muted">
                       <MapPin size={14} className="text-cm-green" /> {alert.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cm-muted">
                       <Clock size={14} className="text-cm-green" /> {formatDate(alert.created_at)}
                    </div>
                 </div>
              </div>
              <div className="shrink-0 flex items-center md:items-start pt-2">
                 <button className="px-5 py-2 bg-cm-text text-white rounded-xl text-xs font-bold hover:bg-black transition-all">
                   Détails Incident
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-cm-border text-center">
             <CheckCircle2 className="mx-auto text-emerald-500 mb-4 opacity-50" size={64} />
             <h3 className="text-xl font-bold text-cm-text">Tout est en ordre</h3>
             <p className="text-cm-muted font-semibold mt-1">Aucun incident de sécurité reporté récemment.</p>
          </div>
        )}
      </div>

    </div>
  );
}

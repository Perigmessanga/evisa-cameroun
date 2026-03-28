import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import visaService from '../../services/visaService';
import { 
  ShieldCheck, ScanLine, AlertTriangle, 
  Clock, ArrowRight, UserCheck, UserX, AlertCircle,
  CheckCircle2, Loader2
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import { VisaApplication } from '../../types';

export default function FrontiereDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    controleToday: 0,
    visasInvalides: 0,
    alertesDeclenchees: 0,
    averageScanTime: '12s'
  });
  const [recentControls, setRecentControls] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await visaService.getBorderStats();
        setStats(data.stats);
        setRecentControls(data.recent_controls);
      } catch (error) {
        console.error('Erreur chargement dashboard frontière:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ENTERED': return <Badge variant="success">Entré</Badge>;
      case 'EXITED': return <Badge variant="info">Sorti</Badge>;
      case 'DENIED': return <Badge variant="danger">Refusé</Badge>;
      default: return <Badge variant="default">Non contrôlé</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-cm-muted">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p>Chargement du poste frontière...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0">
             <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cm-text">Poste Frontière</h1>
            <p className="text-cm-muted mt-0.5 font-semibold">
              Point de contrôle assigné
            </p>
            <p className="text-sm text-cm-muted flex items-center gap-2 mt-1">
               Agent: <span className="font-bold text-cm-text">{user?.first_name} {user?.last_name}</span>
            </p>
          </div>
        </div>
        <Link 
          to="/frontiere/verification"
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <ScanLine size={18} /> Scanner un Passager
        </Link>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-cm-border rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-full bg-cm-green-pale/20 flex items-center justify-center text-cm-green-mid mb-3">
              <UserCheck size={24} />
           </div>
           <p className="text-xs font-bold text-cm-muted uppercase">Contrôles (Auj.)</p>
           <h3 className="font-display text-2xl font-bold text-cm-text mt-1">{stats.controleToday}</h3>
        </div>
        <div className="bg-cm-red/5 border border-cm-red/20 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-full bg-cm-red/10 flex items-center justify-center text-cm-red mb-3">
              <UserX size={24} />
           </div>
           <p className="text-xs font-bold text-cm-red uppercase">Visas Invalides</p>
           <h3 className="font-display text-2xl font-bold text-cm-red mt-1">{stats.visasInvalides}</h3>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
              <AlertCircle size={24} />
           </div>
           <p className="text-xs font-bold text-orange-600 uppercase">Alertes</p>
           <h3 className="font-display text-2xl font-bold text-orange-600 mt-1">{stats.alertesDeclenchees}</h3>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <Clock size={24} />
           </div>
           <p className="text-xs font-bold text-indigo-600 uppercase">Temps Moyen</p>
           <h3 className="font-display text-2xl font-bold text-indigo-700 mt-1">{stats.averageScanTime}</h3>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* RECENT CONTROLS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text">Activité en direct</h2>
            <Link to="/frontiere/historique" className="text-sm font-bold text-cm-green-mid hover:text-cm-green transition-colors flex items-center gap-1">
              Voir l'historique <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            {recentControls && recentControls.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-cm-cream/50 text-[10px] uppercase tracking-wider font-bold text-cm-muted border-b border-cm-border">
                    <tr>
                      <th className="px-6 py-4">Voyageur</th>
                      <th className="px-6 py-4">Heure</th>
                      <th className="px-6 py-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cm-border/50">
                    {recentControls.map((app) => (
                      <tr key={app.id} className="hover:bg-cm-cream/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-cm-text">{app.full_name}</p>
                          <p className="text-[10px] text-cm-muted font-mono">{app.passport_number}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-cm-muted">
                          {formatDate(app.border_checked_at as string)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(app.border_check_status || '')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-cm-muted text-sm italic">
                  Aucun contrôle récent à ce poste.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECURITY ALERTS WIDGET */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2">
               <AlertTriangle className="text-orange-500" size={20} /> Alertes (Auj.)
            </h2>
            <Link to="/frontiere/alertes" className="text-xs font-bold text-cm-green-mid">Voir tout</Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            {stats.alertesDeclenchees > 0 ? (
              <div className="p-6 text-center text-cm-red">
                <AlertTriangle size={32} className="mx-auto mb-2" />
                <p className="font-bold text-sm">{stats.alertesDeclenchees} incidents détectés</p>
                <p className="text-xs mt-1">Veuillez consulter l'onglet alertes.</p>
              </div>
            ) : (
              <div className="p-6 text-center text-cm-muted border-t border-cm-border">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-sm">Système sécurisé</p>
                <p className="text-xs mt-1">Aucune alerte critique détectée.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

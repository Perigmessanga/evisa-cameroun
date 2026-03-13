// ─────────────────────────────────────────────
//  pages/frontiere/FrontiereDashboardPage.tsx
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockFrontiereStats, mockControleHistory, mockAlerts } from '../../data/mockFrontiereData';
import { 
  ShieldCheck, ScanLine, AlertTriangle, 
  Clock, ArrowRight, UserCheck, UserX, AlertCircle
} from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function FrontiereDashboardPage() {
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AUTHORIZED': return <Badge variant="success">Autorisé</Badge>;
      case 'DENIED_EXPIRED': return <Badge variant="warning">Refusé (Expiré)</Badge>;
      case 'DENIED_FRAUD': return <Badge variant="danger">Refusé (Fraude)</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getAlertSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <Badge variant="danger">Critique</Badge>;
      case 'HIGH': return <Badge variant="warning">Haute</Badge>;
      case 'WARNING': return <Badge variant="default">Moyenne</Badge>;
      default: return <Badge>{severity}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const recentControls = mockControleHistory.slice(0, 5);
  const activeAlerts = mockAlerts.filter(a => a.status === 'UNRESOLVED');

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
              Aéroport International de Yaoundé-Nsimalen
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
           <p className="text-xs font-bold text-cm-muted uppercase">Contrôles (Aujourd'hui)</p>
           <h3 className="font-display text-2xl font-bold text-cm-text mt-1">{mockFrontiereStats.controleToday}</h3>
        </div>
        <div className="bg-cm-red/5 border border-cm-red/20 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-full bg-cm-red/10 flex items-center justify-center text-cm-red mb-3">
              <UserX size={24} />
           </div>
           <p className="text-xs font-bold text-cm-red uppercase">Visas Invalides</p>
           <h3 className="font-display text-2xl font-bold text-cm-red mt-1">{mockFrontiereStats.visasInvalides}</h3>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
              <AlertCircle size={24} />
           </div>
           <p className="text-xs font-bold text-orange-600 uppercase">Alertes de Sécurité</p>
           <h3 className="font-display text-2xl font-bold text-orange-600 mt-1">{mockFrontiereStats.alertesDeclenchees}</h3>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <Clock size={24} />
           </div>
           <p className="text-xs font-bold text-indigo-600 uppercase">Temps Scan Moyen</p>
           <h3 className="font-display text-2xl font-bold text-indigo-700 mt-1">{mockFrontiereStats.averageScanTime}</h3>
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
             <div className="divide-y divide-cm-border/50">
               {recentControls.map(ctrl => (
                 <div key={ctrl.id} className="p-4 hover:bg-cm-cream/20 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                          ctrl.type === 'ENTREE' ? 'bg-indigo-500' : 'bg-slate-500'
                       }`}>
                          {ctrl.type === 'ENTREE' ? 'IN' : 'OUT'}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-cm-text">{ctrl.applicantName}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-xs text-cm-muted">
                             <span className="font-mono">P: {ctrl.passport}</span>
                             <span>•</span>
                             <span className="font-mono text-cm-green-mid">V: {ctrl.visaId}</span>
                          </div>
                          <p className="text-[10px] text-cm-muted/70 font-bold uppercase mt-1">{formatDate(ctrl.time)}</p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       {getStatusBadge(ctrl.status)}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* SECURITY ALERTS WIDGET */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2">
               <AlertTriangle className="text-orange-500" size={20} /> Alertes
            </h2>
            <Link to="/frontiere/alertes" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1">
              Traiter ({activeAlerts.length})
            </Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
             {activeAlerts.length > 0 ? (
                <div className="divide-y divide-cm-border/50">
                  {activeAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 ${alert.severity === 'CRITICAL' ? 'bg-cm-red/5 border-l-4 border-cm-red' : 'bg-orange-50/50 border-l-4 border-orange-400'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-xs text-cm-text uppercase tracking-wider">{alert.type}</span>
                         {getAlertSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-sm font-semibold text-cm-text leading-tight mb-2">{alert.message}</p>
                      <p className="text-[10px] text-cm-muted font-bold uppercase">{formatDate(alert.time)}</p>
                    </div>
                  ))}
                </div>
             ) : (
                <div className="p-6 text-center text-cm-muted border-t border-cm-border">
                   <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                   <p className="font-bold text-sm">Système sécurisé</p>
                   <p className="text-xs mt-1">Aucune alerte en attente.</p>
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}

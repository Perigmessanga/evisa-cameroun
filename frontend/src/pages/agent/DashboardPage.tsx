// ─────────────────────────────────────────────
//  pages/agent/DashboardPage.tsx
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockAgentStats, mockAgentApplications, mockRecentActivity } from '../../data/mockAgentData';
import Badge from '../../components/common/Badge';
import { 
  Users, CheckCircle2, XCircle, Clock, 
  ChevronRight, AlertCircle, FileSearch, ShieldCheck
} from 'lucide-react';

export default function AgentDashboard() {
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Approuvé</Badge>;
      case 'PENDING': return <Badge variant="info">Nouveau</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">En cours</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejeté</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH': return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cm-red/10 text-cm-red border border-cm-red/20 uppercase">Urgent</span>;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-cm-green-pale to-cm-green text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0">
             {user?.first_name[0]}{user?.last_name[0]}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cm-text">Tableau de Bord Agent</h1>
            <p className="text-cm-muted mt-0.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-cm-green-mid" /> Agent d'immigration
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex-1 md:flex-none text-center px-4 py-2 bg-cm-cream rounded-xl border border-cm-border">
            <p className="text-xs text-cm-muted font-bold uppercase mb-1">Traitées (Auj.)</p>
            <p className="text-lg font-bold text-cm-text">{mockAgentStats.processedToday}</p>
          </div>
          <div className="flex-1 md:flex-none text-center px-4 py-2 bg-cm-cream rounded-xl border border-cm-border">
            <p className="text-xs text-cm-muted font-bold uppercase mb-1">Temps Moyen</p>
            <p className="text-lg font-bold text-cm-text">{mockAgentStats.averageProcessingTime}</p>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'À Traiter (Total)', value: mockAgentStats.pendingApplications, icon: <Clock className="text-blue-500" size={24} />, bg: 'bg-blue-50' },
          { title: 'Approuvées (Auj.)', value: mockAgentStats.approvedToday, icon: <CheckCircle2 className="text-cm-green" size={24} />, bg: 'bg-cm-green-pale/10' },
          { title: 'Rejetées (Auj.)', value: mockAgentStats.rejectedToday, icon: <XCircle className="text-cm-red" size={24} />, bg: 'bg-cm-red/5' },
          { title: 'Taux Satisfaction', value: mockAgentStats.satisfactionRate, icon: <Users className="text-cm-gold" size={24} />, bg: 'bg-cm-gold-pale/10' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} border border-cm-border rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between`}>
            <div>
              <p className="text-sm font-semibold text-cm-muted mb-1">{stat.title}</p>
              <h3 className="font-display text-2xl font-bold text-cm-text">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white border border-cm-border/50 shadow-sm`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* PENDING APPLICATIONS TABLE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2">
              <FileSearch size={20} className="text-cm-green-mid" /> Demandes Récentes
            </h2>
            <Link to="/agent/applications" className="text-sm font-semibold text-cm-green-mid hover:text-cm-green transition-colors flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-wider text-cm-muted font-bold">
                    <th className="p-4">Dossier</th>
                    <th className="p-4">Demandeur</th>
                    <th className="p-4">Type / Date</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cm-border/50">
                  {mockAgentApplications.slice(0, 5).map(app => (
                    <tr key={app.id} className="hover:bg-cm-cream/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm text-cm-text">{app.id}</div>
                        <div className="mt-1">{getPriorityBadge(app.priority)}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-cm-text">{app.applicantName}</div>
                        <div className="text-xs text-cm-muted">{app.nationality}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-cm-text">{app.type}</div>
                        <div className="text-xs text-cm-muted">{formatDate(app.submissionDate)}</div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="p-4 text-right">
                        <Link 
                          to={`/agent/applications/${app.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-cm-cream text-cm-text rounded-lg text-xs font-bold hover:bg-cm-green-mid hover:text-white transition-colors border border-cm-border hover:border-cm-green-mid"
                        >
                          Examiner <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY & ALERTS WIDGET */}
        <div className="space-y-8">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-display text-xl font-bold text-cm-text">Activité Récente</h2>
            </div>
            <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5">
              <ul className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-cm-border before:to-transparent">
                {mockRecentActivity.map((activity, i) => (
                  <li key={activity.id} className="relative flex items-start gap-4 z-10">
                    <div className="w-10 h-10 rounded-full bg-cm-cream border border-cm-border shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-cm-muted">{i+1}</span>
                    </div>
                    <div className="pt-1">
                      <p className="text-sm text-cm-text">
                        <span className="font-medium text-cm-muted">{activity.action}</span> <br/>
                        <Link to={`/agent/applications/${activity.target}`} className="font-bold hover:text-cm-green-mid transition-colors">{activity.target}</Link>
                      </p>
                      <span className="text-[10px] text-cm-muted/70 font-semibold uppercase">{activity.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Alert */}
          <div className="bg-cm-red/5 border border-cm-red/20 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="text-cm-red shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-cm-red mb-1">Mise à jour requise</h4>
              <p className="text-xs text-cm-red/80 leading-relaxed">
                Les directives d'approbation pour les visas touristes en provenance d'Europe ont été mises à jour. Veuillez consulter la documentation interne.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

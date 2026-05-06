import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import visaService from '../../services/visaService';
import Badge from '../../components/common/Badge';
import { 
  Users, CheckCircle2, XCircle, Clock, 
  ChevronRight, AlertCircle, FileSearch, ShieldCheck
} from 'lucide-react';
import { VisaApplication } from '../../types';

export default function AgentDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    approved: 0,
    rejected: 0,
    processedToday: 0
  });
  const [recentApps, setRecentApps] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appsData] = await Promise.all([
          visaService.getImmigrationStats(),
          visaService.getImmigrationApplications({ limit: 5 })
        ]);
        setStats(statsData);
        setRecentApps(appsData);
      } catch (error) {
        console.error('Erreur chargement dashboard agent:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">{t('agent_dashboard.badges.approved')}</Badge>;
      case 'SUBMITTED': return <Badge variant="info">{t('agent_dashboard.badges.new')}</Badge>;
      case 'PROCESSING': return <Badge variant="warning">{t('agent_dashboard.badges.processing')}</Badge>;
      case 'REJECTED': return <Badge variant="danger">{t('agent_dashboard.badges.rejected')}</Badge>;
      case 'PENDING_DOCS': return <Badge variant="warning">{t('agent_dashboard.badges.docs_required')}</Badge>;
      case 'PENDING_REVIEW': return <Badge variant="info">{t('agent_dashboard.badges.review_required')}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-cm-muted">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-cm-green-pale to-cm-green text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0">
             {user?.first_name[0]}{user?.last_name[0]}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cm-text">
              {user?.role === 'EMBASSY' ? t('agent_dashboard.title_embassy', { country: user?.embassy_country }) : t('agent_dashboard.title')}
            </h1>
            <p className="text-cm-muted mt-0.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-cm-green-mid" /> 
              {user?.role === 'EMBASSY' ? t('agent_dashboard.role_embassy') : t('agent_dashboard.role_agent')}
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex-1 md:flex-none text-center px-4 py-2 bg-cm-cream rounded-xl border border-cm-border">
            <p className="text-xs text-cm-muted font-bold uppercase mb-1">{t('agent_dashboard.stats.processing')}</p>
            <p className="text-lg font-bold text-cm-text">{stats.processing}</p>
          </div>
          <div className="flex-1 md:flex-none text-center px-4 py-2 bg-cm-cream rounded-xl border border-cm-border">
            <p className="text-xs text-cm-muted font-bold uppercase mb-1">{t('agent_dashboard.stats.today')}</p>
            <p className="text-lg font-bold text-cm-text">{stats.processedToday || 0}</p>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: t('agent_dashboard.stats.total_pending'), value: stats.pending, icon: <Clock className="text-blue-500" size={24} />, bg: 'bg-blue-50' },
          { title: t('agent_dashboard.stats.in_processing'), value: stats.processing, icon: <FileSearch className="text-cm-gold" size={24} />, bg: 'bg-cm-gold-pale/10' },
          { title: t('agent_dashboard.stats.approved'), value: stats.approved, icon: <CheckCircle2 className="text-cm-green" size={24} />, bg: 'bg-cm-green-pale/10' },
          { title: t('agent_dashboard.stats.rejected'), value: stats.rejected, icon: <XCircle className="text-cm-red" size={24} />, bg: 'bg-cm-red/5' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} border border-cm-border rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between`}>
            <div>
              <p className="text-sm font-semibold text-cm-muted mb-1">{stat.title}</p>
              <h3 className="font-display text-2xl font-bold text-cm-text">{(stat.value || 0).toLocaleString('fr-FR')}</h3>
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
              <FileSearch size={20} className="text-cm-green-mid" /> {t('agent_dashboard.recent_apps')}
            </h2>
            <Link to="/agent/applications" className="text-sm font-semibold text-cm-green-mid hover:text-cm-green transition-colors flex items-center gap-1">
              {t('agent_dashboard.view_all')} <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-wider text-cm-muted font-bold">
                    <th className="p-4">{t('agent_dashboard.table.file')}</th>
                    <th className="p-4">{t('agent_dashboard.table.applicant')}</th>
                    <th className="p-4">{t('agent_dashboard.table.type_date')}</th>
                    <th className="p-4">{t('agent_dashboard.table.status')}</th>
                    <th className="p-4 text-right">{t('agent_dashboard.table.action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cm-border/50">
                  {recentApps.length > 0 ? recentApps.map(app => (
                    <tr key={app.id} className={`transition-colors border-l-4 ${app.processing_type === 'EXPRESS' ? 'bg-cm-gold-pale/5 hover:bg-cm-gold-pale/10 border-l-cm-red' : 'hover:bg-cm-cream/20 border-l-transparent'}`}>
                      <td className="p-4">
                        <div className="font-bold text-sm text-cm-text">{app.application_number}</div>
                        {app.processing_type === 'EXPRESS' && (
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-cm-red/10 text-cm-red uppercase tracking-wider">
                            Urgent ⚡
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-cm-text">{app.full_name}</div>
                        <div className="text-xs text-cm-muted">{app.nationality}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-cm-text">{app.visa_type?.name}</div>
                        <div className="text-xs text-cm-muted">{formatDate(app.created_at)}</div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="p-4 text-right">
                        <Link 
                          to={`/agent/applications/${app.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-cm-cream text-cm-text rounded-lg text-xs font-bold hover:bg-cm-green-mid hover:text-white transition-colors border border-cm-border hover:border-cm-green-mid"
                        >
                          {t('agent_dashboard.table.examine')} <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-cm-muted text-sm italic">
                        {t('agent_dashboard.table.no_data')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* RECENT ACTIVITY & ALERTS WIDGET */}
        <div className="space-y-8">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-display text-xl font-bold text-cm-text">{t('agent_dashboard.activity.title')}</h2>
            </div>
            <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5">
              <div className="text-center py-4 text-cm-muted text-sm italic">
                {t('agent_dashboard.activity.coming_soon')}
              </div>
            </div>
          </div>

          {/* Quick Alert */}
          <div className="bg-cm-red/5 border border-cm-red/20 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="text-cm-red shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-cm-red mb-1">{t('agent_dashboard.alert.title')}</h4>
              <p className="text-xs text-cm-red/80 leading-relaxed">
                {t('agent_dashboard.alert.message')}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

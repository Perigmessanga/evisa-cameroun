// ─────────────────────────────────────────────
//  pages/admin/AdminDashboardPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';
import { useTranslation } from 'react-i18next';
import { 
  Users, Activity, ShieldCheck, ChevronRight, 
  Settings, FolderKanban, Server, Banknote, AlertTriangle, FileText
} from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalUsers: 0,
    totalApplications: 0,
    revenueAfc: '0 FCFA',
    systemHealth: '100%'
  });
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStats = await adminService.getDashboardStats();
        setStats({
          activeUsers: dashboardStats.active_users || 0,
          totalUsers: dashboardStats.total_users || 0,
          totalApplications: dashboardStats.total || 0,
          revenueAfc: `${(dashboardStats.revenue || 0).toLocaleString('fr-FR')} FCFA`,
          systemHealth: '100%'
        });
        
        const auditLogs = await adminService.getAuditLogs();
        setLogs(auditLogs.slice(0, 5));
      } catch (error) {
        console.error('Erreur stats dashboard:', error);
      }
    };
    fetchData();
  }, []);

  const getLogStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <Badge variant="success">{t('admin_dashboard.logs.success')}</Badge>;
      case 'WARNING': return <Badge variant="warning">{t('admin_dashboard.logs.warning')}</Badge>;
      case 'ERROR': return <Badge variant="danger">{t('admin_dashboard.logs.error')}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getLogIcon = (status: string) => {
    switch (status) {
      case 'WARNING':
      case 'ERROR': 
        return <AlertTriangle className="text-cm-red" size={16} />;
      default: 
        return <Activity className="text-cm-green-mid" size={16} />;
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
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-gray-700 to-black text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0">
             {user?.first_name[0]}{user?.last_name[0]}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cm-text">{t('admin_dashboard.title')}</h1>
            <p className="text-cm-muted mt-0.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-cm-gold" /> {t('admin_dashboard.role')}
            </p>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: t('admin_dashboard.stats.active_users'), value: (stats?.activeUsers || 0).toLocaleString('fr-FR'), desc: t('admin_dashboard.stats.active_users_desc', { count: stats?.totalUsers || 0 }), icon: <Users className="text-blue-500" size={24} />, bg: 'bg-blue-50' },
          { title: t('admin_dashboard.stats.total_visas'), value: (stats?.totalApplications || 0).toLocaleString('fr-FR'), desc: t('admin_dashboard.stats.total_visas_desc'), icon: <FolderKanban className="text-cm-green" size={24} />, bg: 'bg-cm-green-pale/10' },
          { title: t('admin_dashboard.stats.revenue'), value: stats?.revenueAfc || '0 FCFA', desc: t('admin_dashboard.stats.revenue_desc'), icon: <Banknote className="text-cm-gold" size={24} />, bg: 'bg-cm-gold-pale/10' },
          { title: t('admin_dashboard.stats.health'), value: stats?.systemHealth || '100%', desc: t('admin_dashboard.stats.health_desc'), icon: <Server className="text-emerald-500" size={24} />, bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} border border-cm-border rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-sm font-semibold text-cm-muted mb-1">{stat.title}</p>
                 <h3 className="font-display text-2xl font-bold text-cm-text">{stat.value}</h3>
               </div>
               <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white border border-cm-border/50 shadow-sm`}>
                 {stat.icon}
               </div>
            </div>
            <p className="text-xs font-semibold text-cm-muted border-t border-cm-border/50 pt-3">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* QUICK ACTIONS BOARD */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text">{t('admin_dashboard.actions.title')}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
             <Link to="/admin/users" className="bg-white border border-cm-border p-5 rounded-2xl hover:border-cm-green-mid hover:shadow-md transition-all group flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                   <Users size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-cm-text group-hover:text-cm-green-mid transition-colors">{t('admin_dashboard.actions.users')}</h3>
                   <p className="text-xs text-cm-muted mt-1 leading-relaxed">{t('admin_dashboard.actions.users_desc')}</p>
                </div>
             </Link>
             
             <Link to="/admin/visa-types" className="bg-white border border-cm-border p-5 rounded-2xl hover:border-cm-green-mid hover:shadow-md transition-all group flex items-start gap-4">
                <div className="w-12 h-12 bg-cm-gold-pale/20 rounded-xl flex items-center justify-center text-cm-gold shrink-0 group-hover:bg-cm-gold group-hover:text-white transition-colors">
                   <FileText size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-cm-text group-hover:text-cm-green-mid transition-colors">{t('admin_dashboard.actions.visa_types')}</h3>
                   <p className="text-xs text-cm-muted mt-1 leading-relaxed">{t('admin_dashboard.actions.visa_types_desc')}</p>
                </div>
             </Link>

             <Link to="/admin/settings" className="bg-white border border-cm-border p-5 rounded-2xl hover:border-cm-green-mid hover:shadow-md transition-all group flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 group-hover:bg-gray-700 group-hover:text-white transition-colors">
                   <Settings size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-cm-text group-hover:text-cm-green-mid transition-colors">{t('admin_dashboard.actions.settings')}</h3>
                   <p className="text-xs text-cm-muted mt-1 leading-relaxed">{t('admin_dashboard.actions.settings_desc')}</p>
                </div>
             </Link>

             <Link to="/admin/reports" className="bg-white border border-cm-border p-5 rounded-2xl hover:border-cm-green-mid hover:shadow-md transition-all group flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                   <Activity size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-cm-text group-hover:text-cm-green-mid transition-colors">{t('admin_dashboard.actions.reports')}</h3>
                   <p className="text-xs text-cm-muted mt-1 leading-relaxed">{t('admin_dashboard.actions.reports_desc')}</p>
                </div>
             </Link>
          </div>
        </div>

        {/* SYSTEM LOGS WIDGET */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text">{t('admin_dashboard.logs.title')}</h2>
            <Link to="/admin/logs" className="text-sm font-semibold text-cm-green-mid hover:text-cm-green transition-colors flex items-center gap-1">
              {t('admin_dashboard.logs.view_all')} <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
             <div className="divide-y divide-cm-border/50">
               {logs.length > 0 ? logs.map(log => (
                 <div key={log.id} className="p-4 hover:bg-cm-cream/20 transition-colors flex items-start gap-3">
                   <div className="mt-1">
                      {getLogIcon(log.status || 'INFO')}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <p className={`text-sm font-bold ${log.status === 'WARNING' || log.status === 'ERROR' ? 'text-cm-red' : 'text-cm-text'}`}>
                            {log.module || log.action_type || t('admin_dashboard.logs.system')}
                         </p>
                         {getLogStatusBadge(log.status || 'INFO')}
                      </div>
                      <p className="text-xs text-cm-muted mt-1 mb-2 leading-relaxed">{log.action || log.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-cm-muted font-medium uppercase tracking-wide">
                         <span>{log.user_email || log.user || t('admin_dashboard.logs.system')}</span>
                         <span>{formatDate(log.created_at || log.time)}</span>
                      </div>
                   </div>
                 </div>
               )) : (
                 <div className="p-4 text-center text-sm text-cm-muted">{t('admin_dashboard.logs.no_logs')}</div>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

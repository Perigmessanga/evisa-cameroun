// ─────────────────────────────────────────────
//  pages/applicant/DashboardPage.tsx
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../../components/common/Badge';
import { 
  FileText, Plus, Bell, Clock, FileCheck, FileWarning, 
  ChevronRight, Download, Calendar, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import type { VisaApplication } from '../../types';

export default function ApplicantDashboard() {
  const { user } = useAuth();
  
  const [allApplications, setAllApplications] = useState<VisaApplication[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load applications
      const apps = await applicationService.getApplications();
      console.log("DASHBOARD DATA:", apps); // Debug pour l'utilisateur
      setAllApplications(apps);
      
      // Load notifications
      await loadNotifications();
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const data = await applicationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await applicationService.markNotificationRead(id);
      loadNotifications(); // Refresh
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await applicationService.markAllNotificationsRead();
      loadNotifications(); // Refresh
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Approuvé</Badge>;
      case 'SUBMITTED': 
      case 'PROCESSING': 
      case 'PENDING_REVIEW':
        return <Badge variant="warning">En cours</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejeté</Badge>;
      case 'DRAFT': return <Badge variant="default">Brouillon</Badge>;
      case 'PENDING_DOCS': return <Badge variant="warning">Documents requis</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
      case 'SUBMITTED':
      case 'PROCESSING':
        return <Clock className="text-cm-gold" size={24} />;
      case 'REJECTED': return <FileWarning className="text-cm-red" size={24} />;
      default: return <FileText className="text-cm-muted" size={24} />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text">Tableau de Bord</h1>
          <p className="text-cm-muted mt-1">
            Bienvenue, <span className="font-semibold text-cm-text">{user?.first_name} {user?.last_name}</span>
          </p>
        </div>
        <Link 
          to="/applicant/application" 
          className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} /> Nouvelle Demande
        </Link>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Demandes', value: allApplications.length, icon: <FileText className="text-cm-text/60" size={24} />, bg: 'bg-white' },
          { title: 'Visa Approuvés', value: allApplications.filter(a => a.status === 'APPROVED').length, icon: <FileCheck className="text-cm-green" size={24} />, bg: 'bg-cm-green-pale/10' },
          { title: 'En cours', value: allApplications.filter(a => ['SUBMITTED', 'PROCESSING', 'PENDING_DOCS', 'PENDING_REVIEW'].includes(a.status)).length, icon: <Clock className="text-cm-gold" size={24} />, bg: 'bg-cm-gold-pale/10' },
          { title: 'Rejetées', value: allApplications.filter(a => a.status === 'REJECTED').length, icon: <FileWarning className="text-cm-red" size={24} />, bg: 'bg-cm-red/5' },
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
        
        {/* RECENT APPLICATIONS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text">Demandes Récentes</h2>
            <Link to="/applicant/tracking" className="text-sm font-semibold text-cm-green-mid hover:text-cm-green transition-colors flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden min-h-[200px] flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <Loader2 className="text-cm-green-mid animate-spin" size={32} />
                <p className="text-sm font-medium text-cm-muted">Récupération de vos dossiers...</p>
              </div>
            ) : allApplications.length > 0 ? (
              <ul className="divide-y divide-cm-border">
                {allApplications.slice(0, 5).map((app) => (
                  <li key={app.id} className="p-5 hover:bg-cm-cream/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cm-cream flex items-center justify-center shrink-0">
                          {getStatusIcon(app.status)}
                        </div>
                        <div>
                          <Link to={`/applicant/tracking/${app.id}`} className="font-bold text-cm-text hover:text-cm-green-mid transition-colors">
                            {app.application_number}
                          </Link>
                          <p className="text-sm font-medium text-cm-muted">{typeof app.visa_type === 'object' ? app.visa_type.name : 'Visa'}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-cm-muted/80">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(app.created_at)}</span>
                            <span>•</span>
                            <span>{app.nationality}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                        {getStatusBadge(app.status)}
                        {app.status === 'APPROVED' ? (
                          <Link to={`/applicant/download-visa/${app.id}`} className="text-xs font-bold text-cm-green-mid hover:text-cm-green flex items-center gap-1">
                            <Download size={14} /> Télécharger
                          </Link>
                        ) : (
                          <span className="text-[10px] font-semibold text-cm-muted/60 uppercase">
                            MAJ: {formatDate(app.updated_at)}
                          </span>
                        )}
                      </div>

                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-12 text-center max-w-sm mx-auto">
                <div className="w-16 h-16 bg-cm-cream rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cm-border/50">
                   <FileText className="text-cm-muted/30" size={32} />
                </div>
                <h3 className="font-display font-bold text-cm-text text-lg mb-1">Aucune demande</h3>
                <p className="text-cm-muted text-sm leading-relaxed mb-6">
                  Vous n'avez pas encore soumis de demande de visa. Votre historique apparaîtra ici.
                </p>
                <Link to="/applicant/application" className="inline-flex items-center gap-2 px-6 py-2.5 bg-cm-green text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95">
                  <Plus size={16} /> Commencer une demande
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS WIDGET */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2">
              Notifications 
              {unreadCount > 0 && <span className="bg-cm-red text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </h2>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-cm-muted hover:text-cm-green-mid transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden min-h-[300px]">
             {loadingNotifs ? (
               <div className="flex justify-center p-12"><Loader2 className="text-cm-green-mid animate-spin" size={24} /></div>
             ) : notifications.length > 0 ? (
               <div className="divide-y divide-cm-border max-h-[500px] overflow-y-auto custom-scrollbar">
                 {notifications.map((notif) => (
                   <div 
                    key={notif.id} 
                    className={`p-4 transition-colors group relative ${!notif.read_at ? 'bg-cm-green-pale/5' : 'hover:bg-cm-cream/20'}`}
                   >
                     {!notif.read_at && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cm-green-mid" />}
                     <div className="flex gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.subject?.includes('APPROUVÉE') ? 'bg-cm-green/10 text-cm-green' : notif.subject?.includes('Refusée') ? 'bg-cm-red/10 text-cm-red' : 'bg-cm-gold/10 text-cm-gold'}`}>
                         {notif.subject?.includes('APPROUVÉE') ? <CheckCircle2 size={16} /> : notif.subject?.includes('Refusée') ? <AlertCircle size={16} /> : <Bell size={16} />}
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start gap-2">
                           <h4 className={`text-sm font-bold truncate ${!notif.read_at ? 'text-cm-text' : 'text-cm-muted'}`}>{notif.subject}</h4>
                           <span className="text-[10px] text-cm-muted/60 shrink-0">{formatDate(notif.created_at)}</span>
                         </div>
                         <p className="text-xs text-cm-muted mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                         {!notif.read_at && (
                           <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="mt-2 text-[10px] font-bold text-cm-green-mid opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                            Marquer comme lu
                           </button>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-12 text-center">
                 <Bell size={40} className="mx-auto mb-3 text-cm-border" />
                 <p className="text-cm-muted text-sm">Aucune nouvelle notification.</p>
               </div>
             )}
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-cm-border text-center">
            <p className="text-[10px] text-cm-muted/30 font-mono uppercase tracking-widest">
                e-Visa Cameroon Platform • Production Build v2.4.1 (Sync RealDB)
            </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  pages/applicant/DashboardPage.tsx
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../../components/common/Badge';
import { 
  FileText, Plus, Bell, Clock, FileCheck, FileWarning, 
  ChevronRight, Download, Calendar, Loader2, CheckCircle2, AlertCircle, X, RefreshCcw
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import GroupWidget from '../../components/dashboard/GroupWidget';
import type { VisaApplication } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';

export default function ApplicantDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [allApplications, setAllApplications] = useState<VisaApplication[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  // Modal notification
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await applicationService.getApplications();
      setAllApplications(apps);
      await loadNotifications();
    } catch (err) {
      console.error('Error loading dashboard data:', err);
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
      console.error('Error loading notifications:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await applicationService.markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await applicationService.markAllNotificationsRead();
      loadNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Ouvrir une notification et la marquer automatiquement comme lue
  const openNotif = async (notif: any) => {
    setSelectedNotif(notif);
    if (!notif.read_at) {
      await handleMarkAsRead(notif.id);
      // Mettre à jour localement pour l'UI du modal
      setSelectedNotif({ ...notif, read_at: new Date().toISOString() });
    }
  };

  const closeNotif = () => setSelectedNotif(null);

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

  const getNotifIcon = (notif: any) => {
    if (notif.subject?.includes('APPROUVÉE') || notif.subject?.includes('approuvé')) return <CheckCircle2 size={16} />;
    if (notif.subject?.includes('Refusée') || notif.subject?.includes('refusé')) return <AlertCircle size={16} />;
    return <Bell size={16} />;
  };

  const getNotifColors = (notif: any) => {
    if (notif.subject?.includes('APPROUVÉE') || notif.subject?.includes('approuvé'))
      return { icon: 'bg-cm-green/10 text-cm-green', bar: 'bg-cm-green' };
    if (notif.subject?.includes('Refusée') || notif.subject?.includes('refusé'))
      return { icon: 'bg-cm-red/10 text-cm-red', bar: 'bg-cm-red' };
    return { icon: 'bg-cm-gold/10 text-cm-gold', bar: 'bg-cm-gold' };
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text">{t('nav.dashboard')}</h1>
          <p className="text-cm-muted mt-1">
            {t('dashboard.welcome', { name: `${user?.first_name} ${user?.last_name}` })}
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
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-cm-border/50 shadow-sm">
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
            <h2 className="font-display text-xl font-bold text-cm-text">{t('dashboard.recent_apps')}</h2>
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
                        {app.status === 'APPROVED' && (
                          <div className="flex flex-col items-end gap-1.5">
                            <Link to={`/applicant/download-visa/${app.id}`} className="text-xs font-bold text-cm-green-mid hover:text-cm-green flex items-center gap-1">
                              <Download size={14} /> Télécharger
                            </Link>
                            {app.border_check_status === 'ENTERED' && !app.has_pending_extension && (
                              <Link 
                                to={`/applicant/extend-stay/${app.id}`} 
                                className="text-[10px] font-bold text-cm-gold hover:text-cm-gold-dark flex items-center gap-1 bg-cm-gold/10 px-2 py-0.5 rounded-full transition-colors"
                              >
                                <RefreshCcw size={10} /> Proroger le séjour
                              </Link>
                            {app.has_pending_extension && (
                              <span className="text-[10px] font-bold text-cm-gold flex items-center gap-1 bg-cm-gold/5 px-2 py-0.5 rounded-full border border-cm-gold/20">
                                <Clock size={10} /> Prorogation en cours
                              </span>
                            )}
                          </div>
                        )}
                        {app.status !== 'APPROVED' && (
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

        {/* ── SIDE COLUMN (NOTIFS + GROUP) ── */}
        <div className="space-y-8">
          
          {/* GROUP WIDGET */}
          <GroupWidget 
            groupReference={allApplications.find(a => a.group_reference)?.group_reference || null}
            members={allApplications
              .filter(a => a.group_reference && a.group_reference === allApplications.find(x => x.group_reference)?.group_reference)
              .map(a => ({
                id: a.id,
                full_name: a.full_name,
                application_number: a.application_number,
                is_primary: a.is_group_primary || false,
                status: a.status
              }))
            }
          />

          {/* NOTIFICATIONS WIDGET */}
          <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2">
              {t('nav.notifications') || 'Notifications'} 
              {unreadCount > 0 && <span className="bg-cm-red text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </h2>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-cm-muted hover:text-cm-green-mid transition-colors"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden min-h-[300px]">
             {loadingNotifs ? (
               <div className="flex justify-center p-12"><Loader2 className="text-cm-green-mid animate-spin" size={24} /></div>
             ) : notifications.length > 0 ? (
               <div className="divide-y divide-cm-border max-h-[500px] overflow-y-auto custom-scrollbar">
                 {notifications.map((notif) => {
                   const colors = getNotifColors(notif);
                   return (
                     <button
                       key={notif.id}
                       onClick={() => openNotif(notif)}
                       className={`w-full text-left p-4 transition-colors group relative hover:bg-cm-cream/30 cursor-pointer ${!notif.read_at ? 'bg-cm-green-pale/5' : ''}`}
                     >
                       {!notif.read_at && <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bar}`} />}
                       <div className="flex gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colors.icon}`}>
                           {getNotifIcon(notif)}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start gap-2">
                             <h4 className={`text-sm font-bold truncate ${!notif.read_at ? 'text-cm-text' : 'text-cm-muted'}`}>{notif.subject}</h4>
                             <span className="text-[10px] text-cm-muted/60 shrink-0">{formatDate(notif.created_at)}</span>
                           </div>
                           <p className="text-xs text-cm-muted mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                           <p className="text-[10px] font-semibold text-cm-green-mid mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                             Cliquer pour lire le message complet →
                           </p>
                         </div>
                       </div>
                     </button>
                   );
                 })}
               </div>
             ) : (
               <div className="p-12 text-center">
                 <Bell size={40} className="mx-auto mb-3 text-cm-border" />
                 <p className="text-cm-muted text-sm">Aucune nouvelle notification.</p>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-cm-border text-center">
          <p className="text-[10px] text-cm-muted/30 font-mono uppercase tracking-widest">
              e-Visa Cameroon Platform • Production Build v2.4.1 (Sync RealDB)
          </p>
      </div>
      </div>

      {/* ── MODAL NOTIFICATION ── */}
      {selectedNotif && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeNotif(); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-fadeIn overflow-hidden">
            {/* Header */}
            <div className={`p-6 flex items-start gap-4 ${
              selectedNotif.subject?.includes('APPROUVÉE') || selectedNotif.subject?.includes('approuvé')
                ? 'bg-cm-green-pale/10 border-b border-cm-green-pale/20'
                : selectedNotif.subject?.includes('Refusée') || selectedNotif.subject?.includes('refusé')
                ? 'bg-red-50 border-b border-red-100'
                : 'bg-cm-gold-pale/10 border-b border-cm-gold/20'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getNotifColors(selectedNotif).icon}`}>
                <div className="scale-150">{getNotifIcon(selectedNotif)}</div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-cm-text leading-tight">{selectedNotif.subject}</h3>
                <p className="text-xs text-cm-muted mt-1 flex items-center gap-1">
                  <Calendar size={11} /> {formatDateTime(selectedNotif.created_at)}
                </p>
              </div>
              <button
                onClick={closeNotif}
                className="w-8 h-8 rounded-full bg-cm-cream hover:bg-cm-border/50 flex items-center justify-center transition-colors shrink-0"
              >
                <X size={16} className="text-cm-muted" />
              </button>
            </div>

            {/* Body — message complet */}
            <div className="p-6">
              <p className="text-sm text-cm-text leading-relaxed whitespace-pre-wrap">{selectedNotif.message}</p>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex justify-end gap-3">
              {!selectedNotif.read_at && (
                <button
                  onClick={async () => {
                    await handleMarkAsRead(selectedNotif.id);
                    closeNotif();
                  }}
                  className="px-4 py-2 text-sm font-bold text-cm-green-mid border border-cm-green-pale/50 rounded-xl hover:bg-cm-green-pale/10 transition-colors"
                >
                  <CheckCircle2 size={14} className="inline mr-1" /> Marquer comme lu
                </button>
              )}
              <button
                onClick={closeNotif}
                className="px-5 py-2 text-sm font-bold text-white bg-linear-to-r from-cm-green to-cm-green-mid rounded-xl hover:shadow-md transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

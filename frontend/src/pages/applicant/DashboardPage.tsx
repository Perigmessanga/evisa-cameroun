// ─────────────────────────────────────────────
//  pages/applicant/DashboardPage.tsx
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../../components/common/Badge';
import { 
  FileText, Plus, Bell, Clock, FileCheck, FileWarning, 
  ChevronRight, Download, Calendar, Loader2
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import type { VisaApplication } from '../../types';

export default function ApplicantDashboard() {
  const { user } = useAuth();
  
  const [allApplications, setAllApplications] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await applicationService.getApplications();
      setAllApplications(apps);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
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
      case 'IN_PROGRESS': 
      case 'SUBMITTED': 
      case 'PROCESSING': 
        return <Badge variant="warning">En cours</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejeté</Badge>;
      case 'DRAFT': return <Badge variant="default">Brouillon</Badge>;
      case 'PENDING_DOCS': return <Badge variant="warning">Documents requis</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <FileCheck className="text-cm-green-mid" size={24} />;
      case 'IN_PROGRESS': return <Clock className="text-cm-gold" size={24} />;
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
          { title: 'En cours', value: allApplications.filter(a => ['IN_PROGRESS', 'SUBMITTED', 'PROCESSING', 'PENDING_DOCS'].includes(a.status)).length, icon: <Clock className="text-cm-gold" size={24} />, bg: 'bg-cm-gold-pale/10' },
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
              <div className="flex justify-center p-12"><Loader2 className="text-cm-green-mid animate-spin" size={32} /></div>
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
              <div className="p-12 text-center">
                <FileText className="text-cm-border mx-auto mb-4" size={48} />
                <p className="text-cm-muted font-medium">Vous n'avez aucune demande de visa pour le moment.</p>
                <Link to="/applicant/application" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-cm-green text-white rounded-xl font-bold text-sm hover:bg-cm-green-mid transition-colors">
                  <Plus size={14} /> Créer une demande
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS WIDGET - Simplified for now as it needs a real backend too */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text">Notifications</h2>
            <button className="text-sm font-semibold text-cm-muted hover:text-cm-text transition-colors">
              Tout marquer comme lu
            </button>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 text-center text-cm-muted text-sm">
            <Bell size={32} className="mx-auto mb-3 opacity-20" />
            Aucune nouvelle notification.
          </div>
        </div>

      </div>
    </div>
  );
}

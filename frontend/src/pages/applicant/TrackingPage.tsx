// ─────────────────────────────────────────────
//  pages/applicant/TrackingPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import applicationService from '../../services/applicationService';
import { 
  FileText, Search, ChevronRight, FileCheck, Clock, 
  FileWarning, Download, Eye, Calendar, MapPin, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getApplications()
      .then(res => setApplications(res))
      .catch(err => toast.error('Erreur lors du chargement de vos demandes.'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Approuvé</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">En cours</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejeté</Badge>;
      case 'DRAFT': return <Badge variant="default">Brouillon</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <FileCheck className="text-cm-green-mid" size={20} />;
      case 'IN_PROGRESS': return <Clock className="text-cm-gold" size={20} />;
      case 'REJECTED': return <FileWarning className="text-cm-red" size={20} />;
      default: return <FileText className="text-cm-muted" size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const filteredApps = applications.filter(app => {
    const term = searchTerm.toLowerCase();
    const appNumber = (app.application_number || app.id || '').toString().toLowerCase();
    const appType = (app.visa_type_name || '').toLowerCase();
    const matchesSearch = appNumber.includes(term) || appType.includes(term);
    const matchesFilter = filter === 'ALL' 
      ? true 
      : filter === 'IN_PROGRESS' 
        ? ['SUBMITTED', 'PROCESSING', 'PENDING_REVIEW', 'PENDING_DOCS'].includes(app.status)
        : app.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div>
        <h1 className="font-display text-3xl font-bold text-cm-text">Suivi des Demandes</h1>
        <p className="text-cm-muted mt-1">Consultez l'état d'avancement de tous vos dossiers de visa.</p>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Rechercher par numéro (ex: VA-2024...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-cm-border rounded-xl text-sm focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none transition-all shadow-sm"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'Toutes' },
            { id: 'DRAFT', label: 'Brouillons' },
            { id: 'IN_PROGRESS', label: 'En cours' },
            { id: 'APPROVED', label: 'Approuvées' },
            { id: 'REJECTED', label: 'Rejetées' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border shadow-sm
                ${filter === f.id 
                  ? 'bg-cm-green-mid text-white border-cm-green' 
                  : 'bg-white text-cm-muted hover:text-cm-text hover:bg-cm-cream border-cm-border'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── APPLICATIONS LIST ── */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2 size={32} className="animate-spin text-cm-green-mid mb-4" />
            <p className="text-cm-muted font-medium">Chargement de vos demandes...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cm-cream/50 border-b border-cm-border text-xs uppercase tracking-wider text-cm-muted font-bold">
                  <th className="p-4">Dossier</th>
                  <th className="p-4 hidden sm:table-cell">Détails Voyage</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cm-border/50">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-cm-cream/20 transition-colors">
                    
                    {/* ID & TYPE */}
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cm-cream flex items-center justify-center shrink-0 border border-cm-border/50">
                          {getStatusIcon(app.status)}
                        </div>
                        <div>
                          <div className="font-bold text-cm-text">{app.application_number || app.id}</div>
                          <div className="text-xs font-semibold text-cm-muted mt-0.5">{app.visa_type_name}</div>
                          <div className="text-[10px] text-cm-muted/70 mt-1 sm:hidden">
                            Soumis le {formatDate(app.submitted_at || app.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* DATES & PAYS (Hidden on very small screens) */}
                    <td className="p-4 hidden sm:table-cell align-top">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-cm-muted">
                          <Calendar size={12} /> <span className="font-medium text-cm-text">Soumis:</span> {formatDate(app.submitted_at || app.created_at)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-cm-muted">
                          <MapPin size={12} /> <span className="font-medium text-cm-text">Nationalité:</span> {app.nationality}
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 align-top">
                      <div className="flex flex-col items-start gap-1">
                        {getStatusBadge(app.status)}
                        <span className="text-[10px] text-cm-muted font-medium mt-1">
                          Maj. {formatDate(app.updated_at || app.created_at)}
                        </span>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'APPROVED' ? (
                          <Link 
                            to={`/applicant/download-visa/${app.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cm-green-pale/10 text-cm-green-mid hover:bg-cm-green hover:text-white transition-colors border border-cm-green-pale/30"
                            title="Télécharger l'e-Visa"
                          >
                            <Download size={16} />
                          </Link>
                        ) : null}
                        <Link 
                          to={`/applicant/tracking/${app.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cm-cream text-cm-muted hover:bg-cm-green-mid hover:text-white transition-colors border border-cm-border hover:border-cm-green-mid"
                          title="Voir les détails"
                        >
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-cm-cream rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cm-border/50">
              <Search size={24} className="text-cm-muted" />
            </div>
            <h3 className="font-display font-bold text-lg text-cm-text mb-1">Aucun résultat</h3>
            <p className="text-sm text-cm-muted mb-6">Aucune demande de visa ne correspond à vos filtres.</p>
            {(searchTerm || filter !== 'ALL') && (
              <button 
                onClick={() => { setSearchTerm(''); setFilter('ALL'); }}
                className="text-sm font-semibold text-cm-green-mid hover:text-cm-green transition-colors"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

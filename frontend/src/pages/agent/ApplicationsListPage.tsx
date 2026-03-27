import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import visaService from '../../services/visaService';
import { VisaApplication } from '../../types';
import { 
  Search, Filter, ChevronRight, FileSearch, 
  MapPin, Calendar, Loader2
} from 'lucide-react';

export default function ApplicationsListPage() {
  const [apps, setApps] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const data = await visaService.getImmigrationApplications();
        setApps(data);
      } catch (error) {
        console.error('Erreur chargement applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Approuvé</Badge>;
      case 'PENDING_REVIEW': return <Badge variant="info">Nouvel examen</Badge>;
      case 'DRAFT': return <Badge variant="default">Brouillon</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejeté</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = (app.application_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (app.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div>
        <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
          <FileSearch className="text-cm-green-mid" size={32} /> Dossiers de Visa
        </h1>
        <p className="text-cm-muted mt-1">Gérez et examinez les demandes de visa qui vous sont assignées.</p>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Rechercher par N° dossier, Nom..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cm-cream/50 border border-cm-border rounded-xl text-sm focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none transition-all"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-cm-muted" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-3 pr-8 py-2 bg-cm-cream/50 border border-cm-border rounded-xl text-sm font-semibold outline-none focus:border-cm-green-mid"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING_REVIEW">À examiner</option>
              <option value="APPROVED">Approuvés</option>
              <option value="REJECTED">Rejetés</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── APPLICATIONS TABLE ── */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-cm-muted">
            <Loader2 className="animate-spin mx-auto mb-4" /> Chargement des dossiers...
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-wider text-cm-muted font-bold">
                  <th className="p-4">Dossier / Date</th>
                  <th className="p-4">Demandeur</th>
                  <th className="p-4">Type de Visa</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cm-border/50">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-cm-cream/20 transition-colors">
                    
                    {/* ID & DATE */}
                    <td className="p-4">
                      <div className="font-bold text-cm-text">{app.application_number}</div>
                      <div className="flex items-center gap-1 text-xs text-cm-muted mt-1">
                        <Calendar size={12} /> {formatDate(app.submitted_at || app.created_at)}
                      </div>
                    </td>

                    {/* APPLICANT */}
                    <td className="p-4">
                      <div className="font-bold text-cm-text flex items-center gap-2">
                        {app.full_name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-cm-muted mt-1">
                        <MapPin size={12} /> {app.nationality}
                      </div>
                    </td>

                    {/* VISA TYPE */}
                    <td className="p-4">
                      <div className="text-sm font-medium text-cm-text">{app.visa_type?.name}</div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <Link 
                        to={`/agent/applications/${app.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-cm-text rounded-lg text-xs font-bold shadow-sm hover:shadow hover:bg-cm-green-mid hover:text-white transition-all border border-cm-border hover:border-cm-green-mid"
                      >
                        Examiner <ChevronRight size={14} />
                      </Link>
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
            <p className="text-sm text-cm-muted mb-6">Aucun dossier ne correspond à vos filtres actuels.</p>
            <button 
              onClick={() => { setSearchTerm(''); setFilterStatus('ALL'); }}
              className="text-sm font-semibold text-cm-green-mid hover:text-cm-green transition-colors"
            >
              Effacer tous les filtres
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

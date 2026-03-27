import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import visaService from '../../services/visaService';
import Badge from '../../components/common/Badge';
import { VisaApplication } from '../../types';
import { 
  Building2, Search, Filter, 
  ChevronRight, ArrowUpDown, FileText, Loader2
} from 'lucide-react';

export default function DossiersListPage() {
  const [apps, setApps] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const data = await visaService.getEmbassyApplications();
        setApps(data);
      } catch (error) {
        console.error('Erreur chargement dossiers consulaires:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW': return <Badge variant="warning">Avis Requis</Badge>;
      case 'APPROVED': return <Badge variant="success">Favorable</Badge>;
      case 'REJECTED': return <Badge variant="danger">Défavorable</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const filteredDossiers = apps.filter(dossier => {
    const matchesSearch = (dossier.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (dossier.application_number?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || dossier.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <FileText className="text-cm-gold" size={32} /> Dossiers Consulaires
          </h1>
          <p className="text-cm-muted mt-1">Consultez et donnez votre avis sur les demandes exigeant une validation locale.</p>
        </div>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input 
             type="text" 
             placeholder="Rechercher par Nom, ou N° de dossier..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2.5 bg-cm-cream/50 border border-cm-border rounded-xl text-sm focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none transition-all"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-cm-muted" />
          <select 
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value)}
             className="w-full md:w-auto pl-3 pr-8 py-2.5 bg-cm-cream/50 border border-cm-border rounded-xl text-sm font-semibold outline-none focus:border-cm-green-mid"
          >
             <option value="ALL">Tous les statuts</option>
             <option value="PENDING_REVIEW">Avis Requis (En attente)</option>
             <option value="APPROVED">Favorable (Traité)</option>
             <option value="REJECTED">Défavorable (Traité)</option>
          </select>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-cm-muted">
            <Loader2 className="animate-spin mx-auto mb-4" /> Chargement des dossiers...
          </div>
        ) : filteredDossiers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-wider text-cm-muted font-bold">
                  <th className="p-4 cursor-pointer hover:bg-cm-border/30 transition-colors">
                     <span className="flex items-center gap-1">Numéro Dossier <ArrowUpDown size={12}/></span>
                  </th>
                  <th className="p-4">Demandeur & Info</th>
                  <th className="p-4">Date de demande</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cm-border/50">
                {filteredDossiers.map(dossier => (
                  <tr key={dossier.id} className="hover:bg-cm-cream/20 transition-colors">
                    
                    <td className="p-4">
                       <Link to={`/ambassade/dossiers/${dossier.id}`} className="font-mono text-sm font-bold text-cm-green-mid hover:text-cm-green hover:underline">
                          {dossier.application_number}
                       </Link>
                    </td>

                    <td className="p-4">
                       <div className="font-bold text-sm text-cm-text">{dossier.full_name}</div>
                       <div className="text-xs text-cm-muted flex items-center gap-2 mt-0.5">
                          <span>Nat: {dossier.nationality}</span>
                          <span>• Type: {dossier.visa_type?.name}</span>
                       </div>
                    </td>

                    <td className="p-4 text-sm text-cm-muted font-medium">
                       {formatDate(dossier.submitted_at || dossier.created_at)}
                    </td>

                    <td className="p-4">
                       {getStatusBadge(dossier.status)}
                    </td>

                    <td className="p-4 text-right">
                       <Link 
                         to={`/ambassade/dossiers/${dossier.id}`}
                         className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-cm-border rounded-lg text-xs font-bold text-cm-text hover:bg-cm-cream transition-colors"
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
              <Building2 size={24} className="text-cm-muted" />
            </div>
            <h3 className="font-display font-bold text-lg text-cm-text mb-1">Aucun dossier</h3>
            <p className="text-sm text-cm-muted mb-6">Aucun dossier ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
//  pages/agent/ApplicationsListPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import { mockAgentApplications } from '../../data/mockAgentData';
import { 
  Search, Filter, ChevronRight, FileSearch, 
  MapPin, Clock, Calendar
} from 'lucide-react';

export default function ApplicationsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

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
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredApps = mockAgentApplications.filter(app => {
    const matchesSearch = app.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || app.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
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
              <option value="PENDING">Nouveaux</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="APPROVED">Approuvés</option>
              <option value="REJECTED">Rejetés</option>
            </select>
          </div>

          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="pl-3 pr-8 py-2 bg-cm-cream/50 border border-cm-border rounded-xl text-sm font-semibold outline-none focus:border-cm-green-mid"
          >
            <option value="ALL">Toutes urgences</option>
            <option value="HIGH">Urgent</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Basse</option>
          </select>
        </div>
      </div>

      {/* ── APPLICATIONS TABLE ── */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {filteredApps.length > 0 ? (
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
                      <div className="font-bold text-cm-text">{app.id}</div>
                      <div className="flex items-center gap-1 text-xs text-cm-muted mt-1">
                        <Calendar size={12} /> {formatDate(app.submissionDate).split(' ')[0]}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-cm-muted/70 mt-0.5">
                        <Clock size={10} /> {formatDate(app.submissionDate).split(' ')[1]}
                      </div>
                    </td>

                    {/* APPLICANT */}
                    <td className="p-4">
                      <div className="font-bold text-cm-text flex items-center gap-2">
                        {app.applicantName}
                        {getPriorityBadge(app.priority)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-cm-muted mt-1">
                        <MapPin size={12} /> {app.nationality}
                      </div>
                    </td>

                    {/* VISA TYPE */}
                    <td className="p-4">
                      <div className="text-sm font-medium text-cm-text">{app.type}</div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                      <div className="text-[10px] text-cm-muted mt-1 font-medium">Assigné: {app.assignedTo || 'Non assigné'}</div>
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
              onClick={() => { setSearchTerm(''); setFilterStatus('ALL'); setFilterPriority('ALL'); }}
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

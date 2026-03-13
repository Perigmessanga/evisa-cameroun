// ─────────────────────────────────────────────
//  pages/admin/SystemLogsPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { mockSystemLogs } from '../../data/mockAdminData';
import Badge from '../../components/common/Badge';
import { 
  Server, Search, Filter, Download, 
  AlertTriangle, Activity, Database, CheckCircle2
} from 'lucide-react';

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');

  const getLogStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <Badge variant="success">Succès</Badge>;
      case 'WARNING': return <Badge variant="warning">Alerte</Badge>;
      case 'ERROR': return <Badge variant="danger">Erreur</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getLogIcon = (status: string) => {
    switch (status) {
      case 'WARNING':
      case 'ERROR': 
        return <AlertTriangle className="text-cm-red" size={20} />;
      case 'SUCCESS':
        return <CheckCircle2 className="text-cm-green-mid" size={20} />;
      default: 
        return <Activity className="text-cm-muted" size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const filteredLogs = mockSystemLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === 'ALL' || log.module === filterModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <Database className="text-slate-600" size={32} /> Journal d'Audit (Logs)
          </h1>
          <p className="text-cm-muted mt-1">Tracez toutes les actions effectuées par les utilisateurs sur la plateforme.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-cm-border text-cm-text rounded-xl font-bold text-sm hover:bg-cm-cream shadow-sm transition-colors">
          <Download size={18} /> Exporter (CSV)
        </button>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input 
             type="text" 
             placeholder="Rechercher par action, utilisateur, IP..." 
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
             value={filterModule}
             onChange={(e) => setFilterModule(e.target.value)}
             className="w-full md:w-auto pl-3 pr-8 py-2.5 bg-cm-cream/50 border border-cm-border rounded-xl text-sm font-semibold outline-none focus:border-cm-green-mid"
          >
             <option value="ALL">Tous les modules</option>
             <option value="AUTH">Authentification</option>
             <option value="APPLICATIONS">Dossiers Visa</option>
             <option value="SETTINGS">Paramètres</option>
             <option value="SYSTEM">Système</option>
          </select>
        </div>
      </div>

      {/* ── LOGS TABLE ── */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-wider text-cm-muted font-bold">
                  <th className="p-4 w-12"></th>
                  <th className="p-4">Action & Message</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Utilisateur / IP</th>
                  <th className="p-4 text-right">Horodatage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cm-border/50">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-cm-cream/20 transition-colors">
                    
                    <td className="p-4 text-center">
                       {getLogIcon(log.status)}
                    </td>

                    <td className="p-4">
                       <div className="font-bold text-sm text-cm-text">{log.action}</div>
                       <div className="text-[10px] text-cm-muted font-mono mt-1">LOG_ID: {log.id}</div>
                    </td>

                    <td className="p-4">
                       <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cm-cream text-cm-muted uppercase tracking-wider border border-cm-border">
                          {log.module}
                       </span>
                    </td>

                    <td className="p-4">
                       <div className="font-bold text-cm-text text-sm flex items-center gap-2">
                          {log.user}
                       </div>
                    </td>

                    <td className="p-4 text-right">
                       <div className="text-sm font-bold text-cm-text font-mono">{formatDate(log.time).split(' ')[1]}</div>
                       <div className="text-xs text-cm-muted">{formatDate(log.time).split(' ')[0]}</div>
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
            <h3 className="font-display font-bold text-lg text-cm-text mb-1">Aucun événement</h3>
            <p className="text-sm text-cm-muted mb-6">Aucun log ne correspond à votre recherche.</p>
          </div>
        )}
      </div>

    </div>
  );
}

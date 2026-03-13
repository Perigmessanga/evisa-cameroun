// ─────────────────────────────────────────────
//  pages/admin/UserManagementPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { mockUsersList } from '../../data/mockAdminData';
import Badge from '../../components/common/Badge';
import { 
  Users, Search, Filter, Plus, Edit2, 
  Trash2, ShieldAlert, Mail, MoreVertical 
} from 'lucide-react';

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Badge variant="danger">Admin</Badge>;
      case 'AGENT': return <Badge variant="success">Agent</Badge>;
      case 'EMBASSY': return <Badge variant="warning">Ambassade</Badge>;
      case 'BORDER': return <Badge variant="info">Frontière</Badge>;
      case 'APPLICANT': return <Badge variant="default">Demandeur</Badge>;
      default: return <Badge>{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' 
      ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cm-green-pale/20 text-cm-green-mid border border-cm-green-pale/30"><div className="w-1.5 h-1.5 rounded-full bg-cm-green-mid"></div>Actif</span>
      : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cm-muted/10 text-cm-muted border border-cm-muted/20"><div className="w-1.5 h-1.5 rounded-full bg-cm-muted"></div>Inactif</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredUsers = mockUsersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <Users className="text-cm-green-mid" size={32} /> Gestion Utilisateurs
          </h1>
          <p className="text-cm-muted mt-1">Gérez les accès, rôles et statuts de tous les utilisateurs du système.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-cm-green-mid text-white rounded-xl font-bold text-sm hover:bg-cm-green shadow-md transition-colors"
        >
          <Plus size={18} /> Nouvel Utilisateur
        </button>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Rechercher par Nom, Email, ID..." 
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
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full md:w-auto pl-3 pr-8 py-2.5 bg-cm-cream/50 border border-cm-border rounded-xl text-sm font-semibold outline-none focus:border-cm-green-mid"
          >
            <option value="ALL">Tous les rôles</option>
            <option value="ADMIN">Administrateurs</option>
            <option value="AGENT">Agents DGSN</option>
            <option value="EMBASSY">Ambassades</option>
            <option value="BORDER">Postes Frontières</option>
            <option value="APPLICANT">Demandeurs</option>
          </select>
        </div>
      </div>

      {/* ── USERS TABLE ── */}
      <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-cm-cream/50 border-b border-cm-border text-[10px] uppercase tracking-wider text-cm-muted font-bold">
                  <th className="p-4">Utilisateur / ID</th>
                  <th className="p-4">Rôle</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Dernière Connexion</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cm-border/50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-cm-cream/20 transition-colors">
                    
                    {/* INFO */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cm-cream border border-cm-border flex items-center justify-center font-bold text-cm-text shrink-0 text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-cm-text">{user.name}</div>
                          <div className="flex items-center gap-1 text-xs text-cm-muted mt-0.5">
                            <Mail size={12} /> {user.email}
                          </div>
                          <div className="text-[10px] text-cm-muted/70 mt-1 font-mono">{user.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      {getStatusBadge(user.status)}
                    </td>

                    {/* LAST LOGIN */}
                    <td className="p-4 text-sm text-cm-muted font-medium">
                      {formatDate(user.lastLogin)}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-cm-muted hover:text-cm-green-mid hover:bg-cm-green-pale/10 rounded-lg transition-colors border border-transparent hover:border-cm-green-pale/30">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-cm-muted hover:text-cm-red hover:bg-cm-red/10 rounded-lg transition-colors border border-transparent hover:border-cm-red/30">
                          {user.status === 'ACTIVE' ? <ShieldAlert size={16} /> : <Trash2 size={16} />}
                        </button>
                        <button className="p-2 text-cm-muted hover:text-cm-text hover:bg-cm-cream rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
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
              <Users size={24} className="text-cm-muted" />
            </div>
            <h3 className="font-display font-bold text-lg text-cm-text mb-1">Aucun utilisateur</h3>
            <p className="text-sm text-cm-muted mb-6">Aucun utilisateur ne correspond à votre recherche.</p>
          </div>
        )}
      </div>

      {/* ── CREATE USER MODAL (Placeholder) ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-cm-border flex justify-between items-center bg-cm-cream/30">
                 <h2 className="font-display text-xl font-bold text-cm-text">Nouvel Utilisateur</h2>
                 <button onClick={() => setShowModal(false)} className="text-cm-muted hover:text-cm-red p-1"><MoreVertical size={20} className="rotate-90" /></button>
              </div>
              <div className="p-6 overflow-y-auto">
                 <p className="text-sm text-cm-muted mb-6">Le formulaire de création d'utilisateur sera implémenté ici (Phase 6b).</p>
                 <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-cm-cream text-cm-text hover:bg-cm-border/50 transition-colors">Annuler</button>
                    <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-cm-green-mid text-white hover:bg-cm-green transition-colors">Créer l'utilisateur</button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

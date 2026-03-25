// ─────────────────────────────────────────────
//  pages/admin/UserManagementPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import { 
  Users, Search, Filter, Plus, Edit2, 
  Trash2, ShieldAlert, Mail, MoreVertical, Loader2
} from 'lucide-react';
import adminService, { UserData } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function UserManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: UserData) => {
    try {
      setLoading(true);
      await adminService.updateUser(user.id!, { is_active: !user.is_active });
      toast.success(`Utilisateur ${user.is_active ? 'suspendu' : 'activé'} avec succès`);
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de la modification du statut');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.')) return;
    try {
      setLoading(true);
      await adminService.deleteUser(id);
      toast.success('Utilisateur supprimé');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      setLoading(false);
    }
  };

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

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
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
          onClick={() => navigate('/admin/users/new')}
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
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-cm-green-mid" size={32} />
          </div>
        ) : filteredUsers.length > 0 ? (
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
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-cm-cream/20 transition-colors">
                    
                    {/* INFO */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cm-cream border border-cm-border flex items-center justify-center font-bold text-cm-text shrink-0 text-xs">
                          {user.first_name?.charAt(0) || ''}{user.last_name?.charAt(0) || ''}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-cm-text">{user.full_name || `${user.first_name} ${user.last_name}`}</div>
                          <div className="flex items-center gap-1 text-xs text-cm-muted mt-0.5">
                            <Mail size={12} /> {user.email}
                          </div>
                          <div className="text-[10px] text-cm-muted/70 mt-1 font-mono uppercase">{user.id?.substring(0,8)}</div>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      {getStatusBadge(user.is_active ? 'ACTIVE' : 'INACTIVE')}
                    </td>

                    {/* LAST LOGIN */}
                    <td className="p-4 text-sm text-cm-muted font-medium">
                      {user.last_login ? formatDate(user.last_login) : 'Jamais'}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/users/edit/${user.id}`)} 
                          className="p-2 text-cm-muted hover:text-cm-green-mid hover:bg-cm-green-pale/10 rounded-lg transition-colors border border-transparent hover:border-cm-green-pale/30"
                          title="Modifier"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-lg transition-colors border border-transparent hover:border-opacity-30 ${
                            user.is_active 
                              ? "text-cm-muted hover:text-cm-gold hover:bg-cm-gold/10 hover:border-cm-gold" 
                              : "text-cm-muted hover:text-cm-green-mid hover:bg-cm-green-pale/10 hover:border-cm-green-pale"
                          }`}
                          title={user.is_active ? "Suspendre l'utilisateur" : "Activer l'utilisateur"}
                        >
                          <ShieldAlert size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id!)}
                          className="p-2 text-cm-muted hover:text-cm-red hover:bg-cm-red/10 rounded-lg transition-colors border border-transparent hover:border-cm-red/30"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
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
    </div>
  );
}

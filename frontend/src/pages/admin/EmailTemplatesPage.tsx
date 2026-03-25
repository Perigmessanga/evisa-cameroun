// ─────────────────────────────────────────────
//  pages/admin/EmailTemplatesPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import Badge from '../../components/common/Badge';
import { 
  Mail, Search, Plus, Edit2, 
  Send, AlertCircle, Eye, CheckCircle2, Loader2
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function EmailTemplatesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await adminService.getEmailTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des modèles d\'email.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le modèle "${name}" ?`)) return;
    try {
      setLoading(true);
      await adminService.deleteEmailTemplate(id);
      toast.success('Modèle d\'email supprimé avec succès');
      fetchTemplates();
    } catch (error) {
      toast.error('Erreur lors de la suppression du modèle');
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' 
      ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cm-green-pale/20 text-cm-green-mid border border-cm-green-pale/30"><div className="w-1.5 h-1.5 rounded-full bg-cm-green-mid"></div>Actif</span>
      : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cm-muted/10 text-cm-muted border border-cm-muted/20"><div className="w-1.5 h-1.5 rounded-full bg-cm-muted"></div>Inactif</span>;
  };

  const getLogTypeBadge = (type: string) => {
    switch (type) {
      case 'AUTH': return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-50 text-blue-600 border border-blue-200">Auth</span>;
      case 'APPLICATION': return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cm-green-pale/20 text-cm-green-mid border border-cm-green-pale/30">Dossier</span>;
      case 'SECURITY': return <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cm-red/10 text-cm-red border border-cm-red/20">Sécurité</span>;
      default: return null;
    }
  };

  const filteredTemplates = templates.filter((tpl: any) => 
    tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tpl.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <Mail className="text-cm-gold" size={32} /> Modèles d'Emails
          </h1>
          <p className="text-cm-muted mt-1">Gérez le contenu des emails automatiques envoyés par le système E-Visa.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/email-templates/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-cm-green-mid text-white rounded-xl font-bold text-sm hover:bg-cm-green shadow-md transition-colors"
        >
          <Plus size={18} /> Nouveau Modèle
        </button>
      </div>

      {/* ── SEARCH ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="relative w-full md:w-96">
          <input 
             type="text" 
             placeholder="Rechercher un modèle..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2.5 bg-cm-cream/50 border border-cm-border rounded-xl text-sm focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none transition-all"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
        </div>
      </div>

      {/* ── TEMPLATES LIST ── */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-cm-green-mid" size={32} />
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl: any) => (
            <div key={tpl.id} className="bg-white border border-cm-border rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-cm-green-pale transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                     {getLogTypeBadge(tpl.type)}
                     <span className="text-[10px] font-bold text-cm-muted uppercase px-2 py-0.5 bg-cm-cream border border-cm-border rounded">{tpl.language || 'FR'}</span>
                  </div>
                  {getStatusBadge(tpl.is_active ? 'ACTIVE' : 'INACTIVE')}
                </div>

                <h3 className="font-display font-bold text-lg text-cm-text mb-2 group-hover:text-cm-green-mid transition-colors line-clamp-2">{tpl.name}</h3>
                <p className="text-[10px] text-cm-muted font-mono mb-6">Code: {tpl.code} • Maj: {tpl.updated_at ? new Date(tpl.updated_at).toLocaleDateString('fr-FR') : 'N/A'}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-cm-border">
                 <button 
                   onClick={() => navigate(`/admin/email-templates/edit/${tpl.id}`)}
                   className="flex-1 py-2 bg-cm-cream text-cm-text font-bold text-xs rounded-xl border border-cm-border hover:bg-cm-border/50 transition-colors flex items-center justify-center gap-2"
                 >
                    <Edit2 size={14} /> Éditer
                 </button>
                 <button 
                   onClick={() => handleDelete(tpl.id, tpl.name)}
                   className="flex-1 py-2 bg-white text-cm-red font-bold text-xs rounded-xl border border-cm-red/20 hover:bg-cm-red/5 transition-colors flex items-center justify-center gap-2"
                 >
                    <AlertCircle size={14} /> Supprimer
                 </button>
                 <button className="px-3 py-2 bg-white text-cm-muted border border-cm-border rounded-xl hover:text-cm-text hover:bg-cm-cream transition-colors flex items-center justify-center" title="Test d'envoi">
                    <Send size={14} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-cm-border">
          <Mail className="mx-auto text-cm-muted mb-4" size={32} />
          <h3 className="font-display font-bold text-lg text-cm-text mb-1">Aucun modèle</h3>
          <p className="text-sm text-cm-muted">Aucun modèle d'email correspondant à votre recherche.</p>
        </div>
      )}
    </div>
  );
}

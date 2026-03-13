// ─────────────────────────────────────────────
//  pages/admin/EmailTemplatesPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import Badge from '../../components/common/Badge';
import { 
  Mail, Search, Plus, Edit2, 
  Send, AlertCircle, Eye, CheckCircle2
} from 'lucide-react';

const mockTemplates = [
  { id: 'TPL-001', name: 'Confirmation de Création de Compte', type: 'AUTH', language: 'FR/EN', status: 'ACTIVE', lastUpdated: '2024-01-10T10:00:00Z' },
  { id: 'TPL-002', name: 'Soumission de Demande de Visa', type: 'APPLICATION', language: 'FR/EN', status: 'ACTIVE', lastUpdated: '2024-02-15T14:30:00Z' },
  { id: 'TPL-003', name: 'Visa Approuvé (E-Visa Join)', type: 'APPLICATION', language: 'FR', status: 'ACTIVE', lastUpdated: '2024-03-01T09:15:00Z' },
  { id: 'TPL-004', name: 'Demande de Documents Supplémentaires', type: 'APPLICATION', language: 'FR', status: 'ACTIVE', lastUpdated: '2023-11-20T16:45:00Z' },
  { id: 'TPL-005', name: 'Alerte de Sécurité (Connexion Suspecte)', type: 'SECURITY', language: 'FR/EN', status: 'INACTIVE', lastUpdated: '2023-09-05T11:20:00Z' },
];

export default function EmailTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

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

  const filteredTemplates = mockTemplates.filter(tpl => 
    tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tpl.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={() => setShowModal(true)}
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
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map(tpl => (
          <div key={tpl.id} className="bg-white border border-cm-border rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-cm-green-pale transition-all group flex flex-col justify-between">
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                   {getLogTypeBadge(tpl.type)}
                   <span className="text-[10px] font-bold text-cm-muted uppercase px-2 py-0.5 bg-cm-cream border border-cm-border rounded">{tpl.language}</span>
                </div>
                {getStatusBadge(tpl.status)}
              </div>

              <h3 className="font-display font-bold text-lg text-cm-text mb-2 group-hover:text-cm-green-mid transition-colors line-clamp-2">{tpl.name}</h3>
              <p className="text-[10px] text-cm-muted font-mono mb-6">ID: {tpl.id} • Maj: {new Date(tpl.lastUpdated).toLocaleDateString('fr-FR')}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-cm-border">
               <button className="flex-1 py-2 bg-cm-cream text-cm-text font-bold text-xs rounded-xl border border-cm-border hover:bg-cm-border/50 transition-colors flex items-center justify-center gap-2">
                  <Edit2 size={14} /> Éditer
               </button>
               <button className="flex-1 py-2 bg-white text-cm-text font-bold text-xs rounded-xl border border-cm-border hover:bg-cm-cream transition-colors flex items-center justify-center gap-2">
                  <Eye size={14} /> Aperçu
               </button>
               <button className="px-3 py-2 bg-white text-cm-muted border border-cm-border rounded-xl hover:text-cm-text hover:bg-cm-cream transition-colors flex items-center justify-center" title="Test d'envoi">
                  <Send size={14} />
               </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── CREATE/EDIT MODAL (Placeholder) ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
              <div className="p-6 border-b border-cm-border bg-cm-cream/30">
                 <h2 className="font-display text-xl font-bold text-cm-text">Nouveau Modèle d'Email</h2>
              </div>
              <div className="p-6">
                 <div className="flex flex-col items-center justify-center p-8 bg-cm-cream rounded-2xl border border-cm-border text-center">
                    <AlertCircle size={32} className="text-cm-gold mb-4" />
                    <p className="text-sm font-semibold text-cm-text">L'éditeur de Template riche (WYSIWYG) avec variables dynamiques sera disponible dans la Phase 6b.</p>
                 </div>
                 <div className="flex justify-end mt-8">
                    <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-cm-green-mid text-white hover:bg-cm-green transition-colors">Fermer</button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────
//  pages/admin/VisaTypeManagementPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import { 
  FileText, Plus, Edit2, Trash2, 
  MoreVertical, CheckCircle2, Clock, Loader2
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function VisaTypeManagementPage() {
  const navigate = useNavigate();
  const [visaTypes, setVisaTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisaTypes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getVisaTypes();
      setVisaTypes(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des types de visa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisaTypes();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le type de visa "${name}" ?`)) return;
    try {
      setLoading(true);
      await adminService.deleteVisaType(id);
      toast.success('Type de visa supprimé avec succès');
      fetchVisaTypes();
    } catch (error) {
      toast.error('Erreur lors de la suppression du type de visa');
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' 
      ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cm-green-pale/20 text-cm-green-mid border border-cm-green-pale/30"><div className="w-1.5 h-1.5 rounded-full bg-cm-green-mid"></div>Actif</span>
      : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cm-muted/10 text-cm-muted border border-cm-muted/20"><div className="w-1.5 h-1.5 rounded-full bg-cm-muted"></div>Inactif</span>;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <FileText className="text-cm-gold" size={32} /> Types de Visa
          </h1>
          <p className="text-cm-muted mt-1">Configurez les tarifs, durées et documents requis pour chaque type de visa.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/visa-types/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-cm-green-mid text-white rounded-xl font-bold text-sm hover:bg-cm-green shadow-md transition-colors"
        >
          <Plus size={18} /> Nouveau Type
        </button>
      </div>

      {/* ── VISA TYPES GRID ── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-cm-green-mid" size={32} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visaTypes.map(visa => (
            <div key={visa.id} className="bg-white border border-cm-border rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-cm-green-pale transition-all group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-cm-cream rounded-xl flex items-center justify-center font-display font-bold text-cm-gold text-lg border border-cm-border/50 group-hover:bg-cm-gold/10 group-hover:border-cm-gold/30 transition-colors">
                   {visa.code}
                </div>
                <div className="flex items-center gap-2">
                   {getStatusBadge(visa.is_active ? 'ACTIVE' : 'INACTIVE')}
                   <button className="text-cm-muted hover:text-cm-text p-1 transition-colors"><MoreVertical size={16} /></button>
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-cm-text mb-4 group-hover:text-cm-green-mid transition-colors">{visa.name}</h3>
              
              <div className="space-y-3 mb-6">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-cm-muted flex items-center gap-2"><Clock size={14} /> Durée Max</span>
                    <span className="font-bold text-cm-text">{visa.max_stay_days} Jours</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-cm-muted flex items-center gap-2"><FileText size={14} /> Code Type</span>
                    <span className="font-bold text-cm-text">{visa.code}</span>
                 </div>
                 <div className="pt-3 border-t border-cm-border flex justify-between items-center">
                    <span className="text-xs font-bold text-cm-muted uppercase tracking-wider">Tarif Officiel</span>
                    <span className="font-display font-bold text-lg text-cm-text">
                       {visa.fee === 0 ? 'Gratuit' : `${Number(visa.fee).toLocaleString('fr-FR')} FCFA`}
                    </span>
                 </div>
              </div>

              <div className="flex gap-2">
                 <button 
                   onClick={() => navigate(`/admin/visa-types/edit/${visa.id}`)}
                   className="flex-1 py-2 bg-cm-cream text-cm-text font-bold text-sm rounded-xl border border-cm-border hover:bg-cm-border/50 transition-colors flex items-center justify-center gap-2"
                 >
                    <Edit2 size={14} /> Modifier
                 </button>
                 <button 
                   onClick={() => handleDelete(visa.id, visa.name)}
                   className="px-4 py-2 bg-white text-cm-red border border-cm-red/20 font-bold text-sm rounded-xl hover:bg-cm-red/5 transition-colors flex items-center justify-center"
                 >
                    <Trash2 size={14} />
                 </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

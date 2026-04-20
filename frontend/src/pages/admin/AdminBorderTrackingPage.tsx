import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { 
  Users, Calendar, Clock, MapPin, Search, 
  Filter, AlertTriangle, CheckCircle, PlaneLanding, PlaneTakeoff,
  Loader2
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

interface BorderStay {
  id: string;
  full_name: string;
  visa_type: string;
  visa_number: string;
  entry_date: string;
  expected_exit_date: string;
  actual_exit_date: string | null;
  status: 'EN_COURS' | 'SORTI' | 'DEPASSE' | 'SORTI_DEPASSE' | 'REFUSE';
}

const AdminBorderTrackingPage: React.FC = () => {
  const [stays, setStays] = useState<BorderStay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchStays();
  }, []);

  const fetchStays = async () => {
    try {
      setLoading(true);
      const data = await adminService.getBorderTracking();
      setStays(data);
    } catch (error) {
      console.error('Error fetching border tracking:', error);
      toast.error('Impossible de charger le suivi des frontières');
    } finally {
      setLoading(false);
    }
  };

  const filteredStays = stays.filter(stay => {
    const matchesSearch = stay.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         stay.visa_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || stay.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: BorderStay['status']) => {
    switch (status) {
      case 'EN_COURS':
        return <Badge variant="info" className="flex items-center gap-1"><Clock size={12} /> En cours</Badge>;
      case 'SORTI':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle size={12} /> Sorti</Badge>;
      case 'DEPASSE':
        return <Badge variant="danger" className="flex items-center gap-1 animate-pulse"><AlertTriangle size={12} /> Dépassé</Badge>;
      case 'SORTI_DEPASSE':
        return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle size={12} /> Sorti (Dépassement)</Badge>;
      case 'REFUSE':
        return <Badge variant="danger" className="flex items-center gap-1"><AlertTriangle size={12} /> Refus d'entrée</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="w-12 h-12 text-cm-green animate-spin" />
      <p className="text-gray-500 font-medium animate-pulse">Chargement du suivi...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Suivi des Entrées/Sorties</h1>
          <p className="text-gray-500 mt-1">Gestion et surveillance des séjours des voyageurs sur le territoire.</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-semibold p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
           <AlertTriangle size={18} />
           <span>{stays.filter(s => s.status === 'DEPASSE').length} voyageur(s) en dépassement de séjour</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro de visa..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cm-green/20 focus:border-cm-green outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cm-green/20 focus:border-cm-green outline-none transition-all appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="EN_COURS">En cours</option>
            <option value="SORTI">Sortis</option>
            <option value="DEPASSE">Dépassement (Actif)</option>
            <option value="SORTI_DEPASSE">Sortis (Dépassement)</option>
            <option value="REFUSE">Refus d'entrée</option>
          </select>
        </div>

        <button 
          onClick={fetchStays}
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          Actualiser
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Voyageur</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Visa</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mouvements</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Dates Clés</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStays.length > 0 ? (
                filteredStays.map((stay) => (
                  <tr key={stay.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cm-green/10 flex items-center justify-center text-cm-green font-bold">
                          {stay.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{stay.full_name}</div>
                          <div className="text-xs text-gray-500">Voyageur e-Visa</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{stay.visa_number}</div>
                      <div className="text-xs text-gray-500">{stay.visa_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                          <PlaneLanding size={14} />
                          {new Date(stay.entry_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {stay.actual_exit_date && (
                          <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
                            <PlaneTakeoff size={14} />
                            {new Date(stay.actual_exit_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-medium">Sortie prévue :</span>
                        <span className={stay.status === 'DEPASSE' ? 'text-red-600 font-bold' : ''}>
                          {new Date(stay.expected_exit_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(stay.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Users size={48} />
                      <p className="font-medium">Aucun mouvement frontalier trouvé</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBorderTrackingPage;

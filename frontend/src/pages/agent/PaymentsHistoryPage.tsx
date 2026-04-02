import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  BarChart, Search, Filter, ArrowUpDown, 
  Clock, DollarSign, Download, Loader2, RefreshCw,
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import { Payment } from '../../types';

export default function PaymentsHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments/');
      // Gérer la pagination (DRF rend results) ou le wrapper api_response (rend data)
      const data = response.data.results || response.data.data || response.data;
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => 
    p.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.application_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <Badge variant="success">Complété</Badge>;
      case 'PENDING': return <Badge variant="warning">En attente</Badge>;
      case 'FAILED': return <Badge variant="danger">Échoué</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-cm-green mb-4" size={40} />
        <p className="text-cm-muted font-semibold">Chargement de l'historique financier...</p>
      </div>
    );
  }

  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text">Historique des Paiements</h1>
          <p className="text-cm-muted font-semibold">Suivi des transactions liées à vos dossiers assignés</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100 flex items-center gap-2">
              <DollarSign size={16} /> Total: {totalRevenue.toLocaleString()} XAF
           </div>
           <button 
             onClick={fetchPayments}
             className="p-2.5 bg-white text-cm-green rounded-xl border border-cm-border hover:bg-cm-cream transition-all"
           >
             <RefreshCw size={20} />
           </button>
        </div>
      </div>

      {/* SEARCH & EXPORT */}
      <div className="bg-white p-4 rounded-2xl border border-cm-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Rechercher par ID transaction..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-cm-border focus:border-cm-green outline-hidden transition-all text-sm font-semibold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cm-muted" size={18} />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-cm-cream text-cm-text rounded-xl font-bold text-sm flex items-center gap-2 border border-cm-border hover:bg-cm-border/20 transition-all">
            <Filter size={18} /> Filtrer
          </button>
          <button className="px-4 py-2.5 bg-cm-text text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-all">
            <Download size={18} /> Exporter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-cm-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cm-cream/40 text-[10px] uppercase tracking-wider font-bold text-cm-muted border-b border-cm-border">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Dossier</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Méthode</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-border/50">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-cm-cream/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-bold text-cm-text">{p.transaction_id || 'MOCK-TXN-123'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-cm-muted italic">{p.application_number || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-cm-text text-sm">{Number(p.amount).toLocaleString()} XAF</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-cm-muted uppercase">
                    {p.payment_method?.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(p.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-cm-text font-bold">
                       {formatDate(p.created_at)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="p-20 text-center">
            <BarChart className="mx-auto text-cm-muted opacity-20 mb-4" size={48} />
            <p className="text-cm-muted font-bold italic">Aucune transaction trouvée</p>
          </div>
        )}
      </div>

    </div>
  );
}

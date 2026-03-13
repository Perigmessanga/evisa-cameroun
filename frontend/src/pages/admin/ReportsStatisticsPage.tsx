// ─────────────────────────────────────────────
//  pages/admin/ReportsStatisticsPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { 
  Activity, Download, Filter, 
  Calendar, FileText, CheckCircle2, 
  XCircle, Globe, Wallet
} from 'lucide-react';

export default function ReportsStatisticsPage() {
  const [period, setPeriod] = useState('MONTH');
  
  // Placeholder data for visual representation (Mock Charts)
  const stats = {
    total: 1250,
    approved: 980,
    rejected: 145,
    pending: 125,
    revenue: 145000000,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <Activity className="text-emerald-500" size={32} /> Rapports & Statistiques
          </h1>
          <p className="text-cm-muted mt-1">Générez et analysez les données des demandes de visa électroniques.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-cm-border text-cm-text rounded-xl font-bold text-sm hover:bg-cm-cream shadow-sm transition-colors">
          <Download size={18} /> Exporter Rapport (PDF)
        </button>
      </div>

      {/* ── FILTERS ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-cm-muted" />
          <span className="text-sm font-bold text-cm-text">Période:</span>
        </div>
        <div className="flex gap-2">
          {['WEEK', 'MONTH', 'YEAR', 'ALL'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                period === p 
                  ? 'bg-cm-green-mid text-white border-cm-green' 
                  : 'bg-cm-cream text-cm-muted border-cm-border hover:bg-cm-border/50'
              }`}
            >
              {p === 'WEEK' ? '7 Jours' : p === 'MONTH' ? 'Ce Mois' : p === 'YEAR' ? 'Cette Année' : 'Tout'}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-cm-border mx-2 hidden sm:block"></div>
        <div className="flex items-center gap-2 grow sm:grow-0">
          <Filter size={16} className="text-cm-muted" />
          <select className="flex-1 sm:w-auto pl-3 pr-8 py-2 bg-cm-cream/50 border border-cm-border rounded-xl text-sm font-semibold outline-none focus:border-cm-green-mid">
            <option>Tous les types de visa</option>
            <option>VCS (Tourisme)</option>
            <option>VLS (Long Séjour)</option>
            <option>VTR (Transit)</option>
          </select>
        </div>
      </div>

      {/* ── KPI HIGHLIGHTS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
         <div className="bg-white p-5 border border-cm-border rounded-xl shadow-sm text-center">
            <p className="text-xs font-bold text-cm-muted uppercase mb-1 flex justify-center items-center gap-1"><FileText size={14}/> Total</p>
            <p className="text-2xl font-display font-bold text-cm-text">{stats.total}</p>
         </div>
         <div className="bg-cm-green-pale/10 p-5 border border-cm-border rounded-xl shadow-sm text-center">
            <p className="text-xs font-bold text-cm-green uppercase mb-1 flex justify-center items-center gap-1"><CheckCircle2 size={14}/> Approuvés</p>
            <p className="text-2xl font-display font-bold text-cm-green-mid">{stats.approved}</p>
         </div>
         <div className="bg-cm-red/5 p-5 border border-cm-border rounded-xl shadow-sm text-center">
            <p className="text-xs font-bold text-cm-red uppercase mb-1 flex justify-center items-center gap-1"><XCircle size={14}/> Rejetés</p>
            <p className="text-2xl font-display font-bold text-cm-red">{stats.rejected}</p>
         </div>
         <div className="bg-blue-50 p-5 border border-cm-border rounded-xl shadow-sm text-center">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1 flex justify-center items-center gap-1"><Activity size={14}/> En Cours</p>
            <p className="text-2xl font-display font-bold text-blue-700">{stats.pending}</p>
         </div>
         <div className="bg-cm-gold-pale/10 p-5 border border-cm-border rounded-xl shadow-sm text-center col-span-2 lg:col-span-1">
            <p className="text-xs font-bold text-cm-gold uppercase mb-1 flex justify-center items-center gap-1"><Wallet size={14}/> Recettes FCFA</p>
            <p className="text-xl sm:text-2xl font-display font-bold text-cm-text">{(stats.revenue/1000000).toFixed(1)}M</p>
         </div>
      </div>

      {/* ── MOCK CHARTS SECTION ── */}
      <div className="grid lg:grid-cols-2 gap-8">
         
         {/* Line Chart Placeholder */}
         <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
            <h3 className="font-bold text-cm-text mb-6">Évolution des demandes (Visa Approuvés vs Rejetés)</h3>
            <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-cm-border pb-2 pl-2">
               {/* Simulated Chart Bars */}
               {[40, 60, 45, 80, 50, 90, 100].map((h, i) => (
                 <div key={i} className="w-full flex justify-center gap-1 items-end h-full">
                    <div style={{height: `${h}%`}} className="w-full bg-cm-green-pale/60 rounded-t-sm hover:bg-cm-green transition-colors relative group">
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-0.5 rounded">{h*10}</span>
                    </div>
                    <div style={{height: `${h*0.2}%`}} className="w-full bg-cm-red/40 rounded-t-sm hover:bg-cm-red transition-colors"></div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-cm-muted px-2">
               <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>
         </div>

         {/* Doughnut Chart & Geo Placeholder */}
         <div className="space-y-8">
            <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
               <h3 className="font-bold text-cm-text mb-4">Répartition par Type de Visa</h3>
               <div className="space-y-4">
                  {[
                     { label: 'Visa Tourisme', value: 65, color: 'bg-cm-green' },
                     { label: 'Visa Affaires', value: 20, color: 'bg-cm-gold' },
                     { label: 'Visa Transit', value: 10, color: 'bg-blue-500' },
                     { label: 'Visa Diplomatique', value: 5, color: 'bg-cm-red' },
                  ].map((item, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                           <span className="text-cm-text">{item.label}</span>
                           <span className="text-cm-muted">{item.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-cm-cream rounded-full overflow-hidden">
                           <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
               <h3 className="font-bold text-cm-text flex items-center gap-2 mb-4">
                  <Globe size={18} className="text-blue-500" /> Origine des Demandeurs (Top 3)
               </h3>
               <ul className="space-y-3">
                  <li className="flex justify-between items-center p-3 bg-cm-cream/50 rounded-xl border border-cm-border/50">
                     <span className="font-bold text-sm text-cm-text flex items-center gap-2">🇫🇷 France</span>
                     <span className="text-sm font-bold text-cm-green-mid">450 Demandes</span>
                  </li>
                  <li className="flex justify-between items-center p-3 bg-cm-cream/50 rounded-xl border border-cm-border/50">
                     <span className="font-bold text-sm text-cm-text flex items-center gap-2">🇺🇸 États-Unis</span>
                     <span className="text-sm font-bold text-cm-green-mid">210 Demandes</span>
                  </li>
                  <li className="flex justify-between items-center p-3 bg-cm-cream/50 rounded-xl border border-cm-border/50">
                     <span className="font-bold text-sm text-cm-text flex items-center gap-2">🇧🇪 Belgique</span>
                     <span className="text-sm font-bold text-cm-green-mid">180 Demandes</span>
                  </li>
               </ul>
            </div>
         </div>

      </div>
    </div>
  );
}

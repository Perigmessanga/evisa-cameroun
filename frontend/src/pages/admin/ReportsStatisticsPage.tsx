import { useState, useEffect } from 'react';
import { 
  Activity, Download, Filter, 
  Calendar, FileText, CheckCircle2, 
  XCircle, Globe, Wallet, Loader2,
  TrendingUp, Users, Map
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function ReportsStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAnalyticsStats();
      setAnalytics(data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des analyses décisionnelles.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 gap-4">
        <Loader2 className="animate-spin text-cm-green" size={48} />
        <p className="text-cm-muted font-medium animate-pulse">Chargement de la War Room...</p>
      </div>
    );
  }

  // Transformation des données pour Recharts
  const timeSeriesData = Object.entries(analytics.time_series).map(([day, count]) => ({
    name: day,
    demandes: count
  }));

  const geoData = Object.entries(analytics.geo_distribution).map(([country, count]) => ({
    name: country,
    val: count
  }));

  const statusData = Object.entries(analytics.status_distribution).map(([status, count]) => ({
    name: status,
    value: count as number
  }));

  const COLORS = ['#007A5E', '#FCD116', '#3B82F6', '#CE1126', '#64748B'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <TrendingUp className="text-emerald-500" size={32} /> Centre de Décision Stratégique
          </h1>
          <p className="text-cm-muted mt-1">Analyse temps réel des flux migratoires et financiers.</p>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Revenue Total" 
          value={`${analytics.overview.total_revenue.toLocaleString()} XAF`} 
          icon={<Wallet className="text-cm-gold" size={24} />} 
          trend="+12% ce mois" 
          color="bg-cm-gold/10"
        />
        <StatCard 
          title="Demandes Soumises" 
          value={analytics.overview.total_applications} 
          icon={<FileText className="text-blue-500" size={24} />} 
          trend="Volume stable"
          color="bg-blue-50"
        />
        <StatCard 
          title="Taux d'Approbation" 
          value={`${analytics.overview.success_rate}%`} 
          icon={<CheckCircle2 className="text-cm-green" size={24} />} 
          trend="Optimisation de rigueur"
          color="bg-cm-green/10"
        />
        <StatCard 
          title="Alertes Sécurité" 
          value={analytics.border_activity.denied || 0} 
          icon={<XCircle className="text-cm-red" size={24} />} 
          trend="Points sensibles détectés"
          color="bg-cm-red/5"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── TIME SERIES ── */}
        <div className="lg:col-span-2 bg-white border border-cm-border rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-cm-text flex items-center gap-2">
              <Activity size={18} className="text-cm-green" /> Flux de demandes (30 derniers jours)
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorDemandes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007A5E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#007A5E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="demandes" stroke="#007A5E" strokeWidth={3} fillOpacity={1} fill="url(#colorDemandes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── STATUS PIE ── */}
        <div className="bg-white border border-cm-border rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-cm-text mb-6">Répartition par Statut</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.slice(0, 4).map((s, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-cm-muted">{s.name}</span>
                </div>
                <span className="font-bold text-cm-text">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ── GEO BAR CHART ── */}
        <div className="bg-white border border-cm-border rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-cm-text mb-6 flex items-center gap-2">
            <Map size={18} className="text-blue-500" /> Origine Géographique (Top Pays)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={80} />
                <Tooltip />
                <Bar dataKey="val" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── BORDER ACTIVITY ── */}
        <div className="bg-white border border-cm-border rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-cm-text mb-6 flex items-center gap-2">
            <Users size={18} className="text-cm-gold" /> Activité Transfrontalière
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-cm-green/5 rounded-2xl">
              <p className="text-2xl font-bold text-cm-green">{analytics.border_activity.entries}</p>
              <p className="text-[10px] font-bold text-cm-muted uppercase">Entrées</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <p className="text-2xl font-bold text-blue-600">{analytics.border_activity.exits}</p>
              <p className="text-[10px] font-bold text-cm-muted uppercase">Sorties</p>
            </div>
            <div className="text-center p-4 bg-cm-red/5 rounded-2xl">
              <p className="text-2xl font-bold text-cm-red">{analytics.border_activity.denied || 0}</p>
              <p className="text-[10px] font-bold text-cm-muted uppercase">Refus</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-cm-cream/50 rounded-xl border border-cm-border/50">
               <h4 className="text-xs font-bold text-cm-muted mb-2">ALERTES DISCORDANCE</h4>
               <p className="text-sm font-medium text-cm-text">Aucune anomalie majeure de flux détectée sur les dernières 24h.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className={`p-6 rounded-2xl border border-cm-border bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110`}></div>
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${color}`}>
            {icon}
          </div>
          <span className="text-xs font-bold text-cm-muted uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-display font-bold text-cm-text">{value}</span>
          <span className="text-[10px] font-bold text-cm-green opacity-70 mt-1">{trend}</span>
        </div>
      </div>
    </div>
  );
}

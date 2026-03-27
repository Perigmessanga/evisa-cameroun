import React from 'react';
import { AlertCircle, AlertOctagon, RefreshCw, ShieldAlert, XCircle } from 'lucide-react';


const AlertesSecuritePage: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: "HIGH",
      title: "Visa Révoqué Détecté",
      description: "Tentative de passage avec le visa CM-2023-A789 qui a été révoqué il y a 2 jours.",
      location: "Aéroport NSI - Terminal 2",
      time: "Il y a 10 minutes",
      icon: <XCircle size={24} className="text-cm-red" />,
      color: "border-cm-red bg-red-50 text-cm-red"
    },
    {
      id: 2,
      type: "MEDIUM",
      title: "Passeport Expiré",
      description: "Le passeport associé au visa CM-2023-B456 est arrivé à expiration.",
      location: "Port de Douala",
      time: "Il y a 1 heure",
      icon: <AlertOctagon size={24} className="text-cm-gold" />,
      color: "border-cm-gold bg-yellow-50 text-cm-gold"
    },
    {
      id: 3,
      type: "MEDIUM",
      title: "Signalement Interpol",
      description: "Correspondance partielle avec une fiche de recherche pour le nom 'Marco Polo'.",
      location: "Frontière Kyé-Ossi",
      time: "Il y a 3 heures",
      icon: <ShieldAlert size={24} className="text-cm-gold" />,
      color: "border-cm-gold bg-yellow-50 text-cm-gold"
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-cm-red flex items-center gap-2">
              <AlertCircle />
              Alertes de Sécurité
            </h1>
            <p className="text-gray-600">Surveillance en temps réel des incidents aux postes frontières.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <RefreshCw size={18} />
            Actualiser
          </button>
        </div>

        {/* Global Status Banner */}
        <div className="bg-cm-red text-white p-4 rounded-xl shadow-sm flex items-start sm:items-center gap-4">
          <ShieldAlert size={32} className="shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-lg">Niveau d'Alerte Actuel : Élevé</h3>
            <p className="text-red-100 text-sm">Veuillez vérifier manuellement tous les visas des ressortissants en provenance de la zone Z. Directive du Ministère de l'Intérieur.</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-cm-green border-b border-gray-200 pb-2">Incidents Récents</h2>
          
          {alerts.map((alert) => (
            <div key={alert.id} className={`bg-white border-l-4 rounded-xl shadow-sm overflow-hidden ${alert.color.split(' ')[0]}`}>
              <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className={`p-3 rounded-full ${alert.color.split(' ')[1]}`}>
                  {alert.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{alert.title}</h3>
                    <span className="text-xs font-semibold text-gray-500 uppercase flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${alert.type === 'HIGH' ? 'bg-cm-red text-white' : 'bg-cm-gold text-white'}`}>
                        {alert.type}
                      </span>
                      {alert.time}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                  <p className="text-xs text-gray-500 font-medium">📍 {alert.location}</p>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button className="px-4 py-2 bg-cm-green text-white text-sm font-medium rounded-lg hover:bg-cm-green-mid transition-colors whitespace-nowrap">
                    Prendre en charge
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Ignorer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
  );
};

export default AlertesSecuritePage;

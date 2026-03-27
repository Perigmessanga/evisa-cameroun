import React from 'react';
import { History, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';


const HistoriqueControlesPage: React.FC = () => {
  const passages = [
    { id: 1, type: "ENTRÉE", name: "John Smith", passport: "USA123456", time: "10:32", status: "Autorisé", gate: "Aéroport NSI" },
    { id: 2, type: "SORTIE", name: "Marie Dubois", passport: "FRA987654", time: "09:15", status: "Autorisé", gate: "Aéroport DLA" },
    { id: 3, type: "ENTRÉE", name: "Liam O'Connor", passport: "IRL456123", time: "08:45", status: "Refusé", gate: "Port Kribi" },
    { id: 4, type: "ENTRÉE", name: "Chen Wei", passport: "CHN789012", time: "08:20", status: "Autorisé", gate: "Aéroport NSI" },
  ];

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-cm-green">Historique des Contrôles</h1>
            <p className="text-gray-600">Consultez tous les passages enregistrés aux postes frontières.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Controls */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher par nom, passeport..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold outline-none"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none">
                <Filter size={18} />
                <span>Filtres</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Direction</th>
                  <th className="p-4 font-semibold">Voyageur</th>
                  <th className="p-4 font-semibold">Heure</th>
                  <th className="p-4 font-semibold">Poste</th>
                  <th className="p-4 font-semibold">Statut</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {passages.map((passage) => (
                  <tr key={passage.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {passage.type === "ENTRÉE" ? (
                          <div className="p-1.5 bg-green-100 text-cm-green rounded-full">
                            <ArrowDownRight size={16} />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-full">
                            <ArrowUpRight size={16} />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{passage.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{passage.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{passage.passport}</p>
                    </td>
                    <td className="p-4 text-gray-600">{passage.time}</td>
                    <td className="p-4 text-gray-600">{passage.gate}</td>
                    <td className="p-4">
                      {passage.status === 'Autorisé' ? (
                        <span className="px-2.5 py-1 bg-green-100 text-cm-green rounded-full text-xs font-semibold">Autorisé</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-100 text-cm-red rounded-full text-xs font-semibold">Refusé</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-cm-gold hover:underline font-medium text-sm">
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600 bg-white">
            <span>Affichage de 1 à 4 sur 450 passages</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Précédent</button>
              <button className="px-3 py-1 border border-gray-200 rounded bg-cm-green text-white">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Suivant</button>
            </div>
          </div>
        </div>

      </div>
  );
};

export default HistoriqueControlesPage;

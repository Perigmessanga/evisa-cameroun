import React from 'react';
import { User, Shield, MapPin, Edit3 } from 'lucide-react';


const FrontiereProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-cm-green mb-6">Mon Profil Agent</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-linear-to-r from-[#1d4b38] via-[#2d6b52] to-[#1c4936] relative">
            <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-cm-green">
                <User size={48} />
              </div>
            </div>
          </div>
          
          <div className="px-8 pt-16 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Paul Biya</h2>
                <p className="text-gray-600 font-medium flex items-center gap-2">
                  <Shield size={16} className="text-cm-gold" />
                  Agent de Police des Frontières (Matricule: PF-78945)
                </p>
                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-gray-400" />
                  Aéroport International de Yaoundé-Nsimalen (NSI)
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3 size={18} />
                Modifier Profil
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {/* Informations Personnelles */}
              <div>
                <h3 className="text-lg font-bold text-cm-green border-b border-gray-100 pb-2 mb-4">Informations</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Email Professionnel</label>
                    <p className="text-gray-800 font-medium">p.biya@police.cm</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Téléphone de Service</label>
                    <p className="text-gray-800 font-medium">+237 6 55 55 55 55</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold">Grade</label>
                    <p className="text-gray-800 font-medium">Inspecteur Principal</p>
                  </div>
                </div>
              </div>

              {/* Statistiques d'Agent */}
              <div>
                <h3 className="text-lg font-bold text-cm-green border-b border-gray-100 pb-2 mb-4">Statistiques du Mois</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Visas Vérifiés</p>
                    <p className="text-2xl font-bold text-cm-green">1,245</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Anomalies Détectées</p>
                    <p className="text-2xl font-bold text-cm-red">12</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 col-span-2">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Taux de conformité</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[99%]"></div>
                      </div>
                      <span className="font-bold text-gray-700">99.03%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
  );
};

export default FrontiereProfilePage;

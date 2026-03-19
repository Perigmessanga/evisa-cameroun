import React from 'react';
import { Save, X, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const VisaTypeFormPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-cm-green">Ajouter un Type de Visa</h1>
            <p className="text-gray-600">Configurez les paramètres et les documents requis pour ce type de visa.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form className="space-y-8">
            {/* Informations Générales */}
            <div>
              <h3 className="text-lg font-semibold border-b border-gray-100 pb-2 mb-4 text-cm-green">Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Code Visa <span className="text-cm-red">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all uppercase"
                    placeholder="Ex: T-30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nom du Visa <span className="text-cm-red">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    placeholder="Visa Touristique 30 jours"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Durée de validité (Jours) <span className="text-cm-red">*</span></label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Frais (XAF) <span className="text-cm-red">*</span></label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    placeholder="100000"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                    placeholder="Description du type de visa..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Documents Requis */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                <h3 className="text-lg font-semibold text-cm-green">Documents Requis</h3>
                <button type="button" className="text-cm-gold hover:text-cm-gold-light flex items-center gap-1 text-sm font-medium">
                  <Plus size={16} /> Ajouter un document
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Document Item */}
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      defaultValue="Passeport (page de données)"
                      className="w-full bg-transparent border-none focus:ring-0 outline-none p-0 text-gray-700 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" defaultChecked className="text-cm-green rounded focus:ring-cm-green" /> Obligatoire
                    </label>
                    <button type="button" className="text-gray-400 hover:text-cm-red p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      defaultValue="Billet d'avion (aller-retour)"
                      className="w-full bg-transparent border-none focus:ring-0 outline-none p-0 text-gray-700 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" defaultChecked className="text-cm-green rounded focus:ring-cm-green" /> Obligatoire
                    </label>
                    <button type="button" className="text-gray-400 hover:text-cm-red p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 flex-col sm:flex-row">
              <button 
                type="button" 
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors font-medium w-full sm:w-auto"
              >
                <X size={18} />
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid flex items-center justify-center gap-2 transition-colors font-medium w-full sm:w-auto"
              >
                <Save size={18} />
                Enregistrer le Type
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VisaTypeFormPage;

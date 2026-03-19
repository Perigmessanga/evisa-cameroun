import React from 'react';
import { Save, X, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const UserFormPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-cm-green">Ajouter / Modifier un Utilisateur</h1>
            <p className="text-gray-600">Gérez les informations et les droits d'accès de l'utilisateur.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prénom <span className="text-cm-red">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="Jean"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom <span className="text-cm-red">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="Dupont"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email <span className="text-cm-red">*</span></label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="jean.dupont@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all"
                  placeholder="+237 XXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rôle <span className="text-cm-red">*</span></label>
                <select className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all">
                  <option value="">Sélectionner un rôle</option>
                  <option value="AGENT">Agent d'immigration</option>
                  <option value="EMBASSY">Agent Ambassade</option>
                  <option value="BORDER">Agent Frontière</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cm-gold focus:border-transparent outline-none transition-all">
                  <option value="ACTIVE">Actif</option>
                  <option value="INACTIVE">Inactif</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button 
                type="button" 
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors font-medium"
              >
                <X size={18} />
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-cm-green text-white rounded-lg hover:bg-cm-green-mid flex items-center gap-2 transition-colors font-medium"
              >
                <Save size={18} />
                Enregistrer l'utilisateur
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserFormPage;

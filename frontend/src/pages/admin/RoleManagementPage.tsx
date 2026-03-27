import React from 'react';
import { Shield, ShieldAlert, Key, Plus, Lock } from 'lucide-react';


const RoleManagementPage: React.FC = () => {
  const roles = [
    {
      id: 1,
      name: "Administrateur",
      code: "ADMIN",
      users: 5,
      description: "Accès total au système, gestion des utilisateurs, des paramètres globaux et journaux d'audit.",
      color: "bg-cm-red/10 text-cm-red border-cm-red"
    },
    {
      id: 2,
      name: "Agent d'immigration",
      code: "AGENT",
      users: 42,
      description: "Traitement des demandes de visa, approbation ou rejet, communication avec les demandeurs.",
      color: "bg-cm-green/10 text-cm-green border-cm-green"
    },
    {
      id: 3,
      name: "Agent Ambassade",
      code: "EMBASSY",
      users: 15,
      description: "Examen des dossiers nécessitant un avis consulaire spécifique.",
      color: "bg-cm-gold/10 text-cm-gold border-cm-gold"
    },
    {
      id: 4,
      name: "Agent Frontière",
      code: "BORDER",
      users: 87,
      description: "Vérification des visas à l'arrivée, scan QR code, et gestion des alertes de sécurité.",
      color: "bg-blue-100 text-blue-800 border-blue-200"
    }
  ];

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-cm-green">Gestion des Rôles et Permissions</h1>
            <p className="text-gray-600">Configurez les droits d'accès pour chaque profil utilisateur.</p>
          </div>
          <button className="bg-cm-green text-white px-4 py-2 rounded-lg hover:bg-cm-green-mid transition-colors flex items-center gap-2">
            <Plus size={20} />
            Nouveau Rôle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg border ${role.color}`}>
                  <Shield size={24} />
                </div>
                <div className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                  {role.users} utilisateurs
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-1">{role.name}</h3>
              <p className="text-xs text-gray-400 font-mono mb-3">{role.code}</p>
              
              <p className="text-sm text-gray-600 grow mb-6">
                {role.description}
              </p>
              
              <button className="w-full py-2 bg-gray-50 text-cm-green rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors font-medium flex justify-center items-center gap-2 text-sm">
                <Key size={16} />
                Gérer les permissions
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <Lock className="text-cm-gold" />
            <h2 className="text-lg font-semibold text-cm-green">Permissions Détaillées (Aperçu)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="p-4 rounded-tl-lg">Module</th>
                  <th className="p-4 text-center">ADMIN</th>
                  <th className="p-4 text-center">AGENT</th>
                  <th className="p-4 text-center">EMBASSY</th>
                  <th className="p-4 text-center rounded-tr-lg">BORDER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-800">Gestion des utilisateurs</td>
                  <td className="p-4 text-center text-cm-green"><ShieldAlert size={18} className="mx-auto" /></td>
                  <td className="p-4 text-center text-gray-300">-</td>
                  <td className="p-4 text-center text-gray-300">-</td>
                  <td className="p-4 text-center text-gray-300">-</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-800">Validation des Visas</td>
                  <td className="p-4 text-center text-cm-green"><ShieldAlert size={18} className="mx-auto" /></td>
                  <td className="p-4 text-center text-cm-green"><ShieldAlert size={18} className="mx-auto" /></td>
                  <td className="p-4 text-center text-gray-300">-</td>
                  <td className="p-4 text-center text-gray-300">-</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-800">Contrôle Frontière</td>
                  <td className="p-4 text-center text-cm-green"><ShieldAlert size={18} className="mx-auto" /></td>
                  <td className="p-4 text-center text-gray-300">-</td>
                  <td className="p-4 text-center text-gray-300">-</td>
                  <td className="p-4 text-center text-cm-green"><ShieldAlert size={18} className="mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default RoleManagementPage;

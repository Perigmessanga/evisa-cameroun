// ─────────────────────────────────────────────
//  data/mockAdminData.ts
// ─────────────────────────────────────────────
export const mockAdminStats = {
  totalUsers: 1450,
  activeUsers: 842,
  totalApplications: 12500,
  revenueAfc: '142,5M FCFA',
  systemHealth: '100%'
};

export const mockUsersList = [
  { id: 'USR-001', name: 'Alain Dubois', email: 'alain.dubois@dgsn.cm', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2024-03-12T10:00:00Z' },
  { id: 'USR-002', name: 'Marie Essomba', email: 'marie.e@dgsn.cm', role: 'AGENT', status: 'ACTIVE', lastLogin: '2024-03-12T08:30:00Z' },
  { id: 'USR-003', name: 'Jean-Pierre Ndongo', email: 'jp.ndongo@minrex.cm', role: 'EMBASSY', status: 'INACTIVE', lastLogin: '2024-03-05T14:20:00Z' },
  { id: 'USR-004', name: 'Paul Kamga', email: 'paul.k@douanes.cm', role: 'BORDER', status: 'ACTIVE', lastLogin: '2024-03-12T11:45:00Z' },
  { id: 'USR-005', name: 'Sophie Martin', email: 'smartin@gmail.com', role: 'APPLICANT', status: 'ACTIVE', lastLogin: '2024-03-11T16:10:00Z' },
];

export const mockVisaTypes = [
  { id: 1, name: 'Visa de Court Séjour (Tourisme)', code: 'VCS', price: 100000, duration: '90 Jours', multipleEntry: true, status: 'ACTIVE' },
  { id: 2, name: 'Visa Long Séjour', code: 'VLS', price: 150000, duration: '180 Jours', multipleEntry: true, status: 'ACTIVE' },
  { id: 3, name: 'Visa de Transit', code: 'VTR', price: 50000, duration: '5 Jours', multipleEntry: false, status: 'ACTIVE' },
  { id: 4, name: 'Visa Diplomatique / Service', code: 'VDS', price: 0, duration: 'Permanent', multipleEntry: true, status: 'ACTIVE' },
];

export const mockSystemLogs = [
  { id: 1042, user: 'Alain Dubois', action: 'Modification Paramètres Système', module: 'SETTINGS', time: '2024-03-12T10:15:00Z', status: 'SUCCESS' },
  { id: 1041, user: 'Marie Essomba', action: 'Approbation Visa VA-2024-9965', module: 'APPLICATIONS', time: '2024-03-12T09:30:00Z', status: 'SUCCESS' },
  { id: 1040, user: 'Système', action: 'Sauvegarde Base de Données', module: 'SYSTEM', time: '2024-03-12T00:00:00Z', status: 'SUCCESS' },
  { id: 1039, user: 'Unknown IP', action: 'Tentative de connexion échouée (5x)', module: 'AUTH', time: '2024-03-11T23:45:00Z', status: 'WARNING' },
];

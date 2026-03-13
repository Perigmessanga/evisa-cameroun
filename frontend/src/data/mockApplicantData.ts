// ─────────────────────────────────────────────
//  data/mockApplicantData.ts
// ─────────────────────────────────────────────
export const mockApplications = [
  {
    id: 'VA-2023-8472',
    type: 'Visa Tourisme (Court Séjour)',
    status: 'APPROVED',
    submissionDate: '2023-10-15',
    lastUpdate: '2023-10-18',
    country: 'France',
    validUntil: '2024-01-18',
    amount: '100 €'
  },
  {
    id: 'VA-2024-1029',
    type: 'Visa Affaires (Long Séjour)',
    status: 'IN_PROGRESS',
    submissionDate: '2024-02-10',
    lastUpdate: '2024-02-12',
    country: 'Canada',
    validUntil: null,
    amount: '150 €'
  },
  {
    id: 'VA-2022-5501',
    type: 'Visa Transit',
    status: 'REJECTED',
    submissionDate: '2022-05-01',
    lastUpdate: '2022-05-03',
    country: 'USA',
    validUntil: null,
    amount: '50 €'
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: 'Visa Approuvé',
    message: 'Votre demande de visa VA-2023-8472 a été approuvée. Vous pouvez télécharger votre e-Visa.',
    date: '2023-10-18T14:30:00Z',
    read: true,
    type: 'success'
  },
  {
    id: 2,
    title: 'Examen en cours',
    message: 'Votre demande VA-2024-1029 est actuellement en cours d\'examen par nos agents.',
    date: '2024-02-12T09:15:00Z',
    read: false,
    type: 'info'
  },
  {
    id: 3,
    title: 'Rappel de document',
    message: 'Veuillez uploader une copie plus claire de votre passeport pour la demande VA-2024-1029.',
    date: '2024-02-11T16:45:00Z',
    read: false,
    type: 'warning'
  }
];

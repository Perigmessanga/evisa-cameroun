// ─────────────────────────────────────────────
//  utils/formatters.ts
//  Fonctions utilitaires de formatage
// ─────────────────────────────────────────────

/**
 * Formate un montant en XAF avec séparateurs de milliers.
 * Exemple : 200000 → "200 000,00 XAF"
 */
export function formatAmount(amount: number | string, currency = 'XAF'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `0 ${currency}`;
  return (
    new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num) +
    ` ${currency}`
  );
}

/**
 * Formate une date ISO en date locale française.
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formate une date ISO en date + heure locale française.
 */
export function formatDateTime(dateString?: string): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

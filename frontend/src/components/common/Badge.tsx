// ─────────────────────────────────────────────
//  components/common/Badge.tsx
// ─────────────────────────────────────────────
import { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]';
  
  const variants = {
    success: 'bg-cm-green-pale/20 text-cm-green-mid border border-cm-green-pale/30',
    warning: 'bg-cm-gold-pale/20 text-cm-gold border border-cm-gold-pale/30',
    danger: 'bg-cm-red/10 text-cm-red border border-cm-red/20',
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
    default: 'bg-cm-cream text-cm-muted border border-cm-border',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

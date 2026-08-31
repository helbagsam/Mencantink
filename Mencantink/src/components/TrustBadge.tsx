import React from 'react';
import { ShieldCheck, ShieldAlert, Award, Landmark } from 'lucide-react';
import { TrustTier, TRUST_TIERS } from '../domain/trust';

interface TrustBadgeProps {
  tier: TrustTier;
  size?: 'sm' | 'md' | 'lg';
  /** Tampilkan siapa yang mengakui, bukan cuma namanya. */
  showIssuer?: boolean;
  className?: string;
}

const ICONS: Record<TrustTier, React.ElementType> = {
  registered: ShieldAlert,
  process_verified: ShieldCheck,
  competency_certified: Award,
  batikmark_certified: Landmark,
};

/**
 * Lencana tingkat kepercayaan.
 *
 * Bedanya dengan badge "98% Authenticity" pada versi lama: lencana ini selalu
 * membawa serta siapa yang mengakui. Lencana tanpa penjamin hanyalah tulisan.
 */
export const TrustBadge: React.FC<TrustBadgeProps> = ({
  tier,
  size = 'md',
  showIssuer = false,
  className = '',
}) => {
  const meta = TRUST_TIERS[tier];
  const Icon = ICONS[tier];

  const sizing = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-[10px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3.5 py-1.5 gap-2',
  }[size];

  const iconSize = { sm: 'w-3 h-3', md: 'w-3.5 h-3.5', lg: 'w-4 h-4' }[size];

  return (
    <span className={`inline-flex flex-col items-start ${className}`}>
      <span
        className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${sizing}`}
        style={{ backgroundColor: meta.accent, color: meta.onAccent }}
        title={meta.basisId}
      >
        <Icon className={`${iconSize} shrink-0`} />
        {meta.labelId}
      </span>
      {showIssuer && (
        <span className="text-[9px] text-[#767683] mt-1 leading-tight">
          Diakui oleh {meta.issuer}
        </span>
      )}
    </span>
  );
};

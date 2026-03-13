// ─────────────────────────────────────────────
//  components/common/CameroonFlag.tsx
// ─────────────────────────────────────────────

interface CameroonFlagProps {
  size?: number;
}

export default function CameroonFlag({ size = 32 }: CameroonFlagProps) {
  const h = size * 0.67;
  return (
    <svg width={size} height={h} viewBox="0 0 3 2" style={{ borderRadius: 2, display: 'block', flexShrink: 0 }}>
      <rect width="1" height="2" x="0" fill="#007A5E" />
      <rect width="1" height="2" x="1" fill="#CE1126" />
      <rect width="1" height="2" x="2" fill="#FCD116" />
      <polygon points="1.5,0.5 1.62,0.84 1.95,0.84 1.68,1.03 1.78,1.37 1.5,1.18 1.22,1.37 1.32,1.03 1.05,0.84 1.38,0.84" fill="#FCD116" />
    </svg>
  );
}

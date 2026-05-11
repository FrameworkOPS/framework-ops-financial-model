export default function Logo({ size = 'md' }) {
  const s = size === 'sm' ? 0.38 : 0.52;
  const w = Math.round(352 * s);
  const h = Math.round(200 * s);

  return (
    <div className="flex items-center gap-3">
      {/* Exact icon from brand assets */}
      <svg width={h * 0.65} height={h * 0.65} viewBox="80 80 352 352" xmlns="http://www.w3.org/2000/svg">
        <rect x="80"  y="80"  width="90" height="90" rx="18" fill="#10B981"/>
        <rect x="190" y="80"  width="90" height="90" rx="18" fill="#10B981"/>
        <rect x="300" y="80"  width="90" height="90" rx="18" fill="#10B981"/>
        <rect x="80"  y="190" width="90" height="90" rx="18" fill="#10B981"/>
        <rect x="190" y="190" width="90" height="90" rx="18" fill="#10B981"/>
        <circle cx="345" cy="235" r="16" fill="#10B981"/>
        <rect x="80"  y="300" width="90" height="90" rx="18" fill="#10B981"/>
        <circle cx="235" cy="345" r="16" fill="#10B981"/>
        <circle cx="345" cy="345" r="16" fill="#10B981"/>
      </svg>

      <span className={`font-bold tracking-tight leading-none ${size === 'sm' ? 'text-base' : 'text-xl'}`}>
        <span style={{ color: '#F8FAFC' }}>framework</span>
        <span style={{ color: '#10B981' }}> / ops</span>
      </span>
    </div>
  );
}

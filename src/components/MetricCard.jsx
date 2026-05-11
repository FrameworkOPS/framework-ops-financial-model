const STATUS = {
  green:   { bg: 'rgba(16,185,129,0.1)',  border: '#10B981', text: '#10B981' },
  yellow:  { bg: 'rgba(234,179,8,0.1)',   border: '#ca8a04', text: '#facc15' },
  red:     { bg: 'rgba(239,68,68,0.1)',   border: '#dc2626', text: '#f87171' },
  neutral: { bg: '#081B2F',              border: '#102d4d', text: '#F8FAFC' },
};

export default function MetricCard({ label, value, status, sub }) {
  const c = STATUS[status] || STATUS.neutral;
  return (
    <div className="rounded-lg p-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#64748b' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: c.text }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: '#475569' }}>{sub}</p>}
    </div>
  );
}

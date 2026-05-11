import Logo from './Logo.jsx';

export default function IndustrySelector({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#061220' }}>
      <div className="mb-10">
        <Logo size="lg" />
      </div>

      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 tracking-tight" style={{ color: '#F8FAFC' }}>
          Financial Modeling Tool
        </h1>
        <p className="text-lg" style={{ color: '#94a3b8' }}>
          Enter your numbers to see break-even analysis, P&L projections, and
          AI-powered recommendations tailored to your scenario.
        </p>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#475569' }}>
        Select your business type to get started
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl">
        {[
          {
            id: 'generic',
            icon: '📊',
            title: 'General Business',
            desc: 'Model price × volume against overhead. See break-even, contribution margin, and the impact of pricing or volume shifts.',
          },
          {
            id: 'home',
            icon: '🏠',
            title: 'Home Services',
            desc: 'Built for field service businesses. Model technician capacity, true labor cost, flat rate vs. hourly, and what rate hits your target margin.',
          },
          {
            id: 'recurring',
            icon: '🔁',
            title: 'Recurring Revenue',
            desc: 'Built for retainer and subscription businesses. Model clients × retainer rate against COGS and overhead to see MRR, ARR, and target client count.',
          },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="group rounded-2xl p-8 text-left transition-all duration-200"
            style={{
              background: '#081B2F',
              border: '1px solid #102d4d',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10B981'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#102d4d'}
          >
            <div className="text-4xl mb-4">{opt.icon}</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#F8FAFC' }}>{opt.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{opt.desc}</p>
            <div className="mt-5 text-sm font-semibold group-hover:translate-x-1 transition-transform" style={{ color: '#10B981' }}>
              Get started →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

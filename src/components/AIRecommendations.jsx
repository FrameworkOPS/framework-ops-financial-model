export default function AIRecommendations({ text, loading, error }) {
  if (!loading && !text && !error) return null;

  return (
    <div className="rounded-xl p-5" style={{ background: '#081B2F', border: '1px solid rgba(16,185,129,0.25)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#10B981' }}>Framework Analysis</h3>
        {loading && (
          <span className="ml-auto flex gap-1">
            {[0, 150, 300].map((delay) => (
              <span key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#10B981', animationDelay: `${delay}ms` }} />
            ))}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
      ) : (
        <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#94a3b8' }}>
          {text}
          {loading && <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse align-text-bottom" style={{ background: '#10B981' }} />}
        </div>
      )}
    </div>
  );
}

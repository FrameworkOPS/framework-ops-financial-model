function Field({ label, name, value, onChange, prefix, suffix, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>
        {label}
        {hint && <span className="ml-1.5 text-xs font-normal" style={{ color: '#475569' }}>{hint}</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#475569' }}>{prefix}</span>
        )}
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min="0"
          step="any"
          className={`w-full rounded-lg py-2.5 text-sm transition-colors outline-none ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}`}
          style={{ background: '#061220', border: '1px solid #102d4d', color: '#F8FAFC' }}
          onFocus={(e) => e.target.style.borderColor = '#10B981'}
          onBlur={(e) => e.target.style.borderColor = '#102d4d'}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#475569' }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

export default function RecurringForm({ inputs, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Active clients" name="numClients" value={inputs.numClients} onChange={onChange} hint="current count" />
        <Field label="Monthly retainer" name="retainerRate" value={inputs.retainerRate} onChange={onChange} prefix="$" hint="per client" />
      </div>

      <Field label="COGS per client / month" name="cogsPerClient" value={inputs.cogsPerClient} onChange={onChange} prefix="$" hint="contractors, tools, delivery cost" />

      <Field label="Monthly fixed overhead" name="monthlyOverhead" value={inputs.monthlyOverhead} onChange={onChange} prefix="$" hint="salaries, rent, subscriptions" />

      <Field label="Target net margin" name="targetNetMarginPct" value={inputs.targetNetMarginPct} onChange={onChange} suffix="%" hint="20–30% is healthy for agencies" />
    </div>
  );
}

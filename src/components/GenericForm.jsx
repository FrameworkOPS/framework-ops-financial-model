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
          style={{
            background: '#061220',
            border: '1px solid #102d4d',
            color: '#F8FAFC',
          }}
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

export default function GenericForm({ inputs, onChange }) {
  return (
    <div className="space-y-4">
      <Field label="Price per unit / transaction" name="price" value={inputs.price} onChange={onChange} prefix="$" hint="what you charge per sale" />
      <Field label="Monthly units / transactions" name="monthlyUnits" value={inputs.monthlyUnits} onChange={onChange} hint="sales per month" />
      <Field label="Variable cost per unit" name="variableCostPerUnit" value={inputs.variableCostPerUnit} onChange={onChange} prefix="$" hint="COGS, materials, direct labor" />
      <Field label="Monthly fixed overhead" name="monthlyOverhead" value={inputs.monthlyOverhead} onChange={onChange} prefix="$" hint="rent, salaries, subscriptions" />
    </div>
  );
}

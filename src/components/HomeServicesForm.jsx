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

export default function HomeServicesForm({ inputs, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Technicians" name="numTechs" value={inputs.numTechs} onChange={onChange} />
        <Field label="Hours / week (per tech)" name="hoursPerWeek" value={inputs.hoursPerWeek} onChange={onChange} hint="typical" />
      </div>

      <Field label="Technician hourly wage" name="techHourlyWage" value={inputs.techHourlyWage} onChange={onChange} prefix="$" hint="+17.5% burden auto-applied" />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Material cost %" name="materialCostPct" value={inputs.materialCostPct} onChange={onChange} suffix="%" hint="of revenue" />
        <Field label="Monthly overhead" name="monthlyOverhead" value={inputs.monthlyOverhead} onChange={onChange} prefix="$" />
      </div>

      <Field label="Target net margin" name="targetNetMarginPct" value={inputs.targetNetMarginPct} onChange={onChange} suffix="%" hint="10–20% is healthy" />

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Pricing model</label>
        <div className="flex gap-2">
          {[
            { value: 'flat', label: 'Flat rate per job' },
            { value: 'hourly', label: 'Hourly rate' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ target: { name: 'pricingModel', value: opt.value } })}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={inputs.pricingModel === opt.value
                ? { background: '#10B981', color: '#061220', border: '1px solid #10B981', fontWeight: 600 }
                : { background: '#061220', color: '#94a3b8', border: '1px solid #102d4d' }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Field
        label={inputs.pricingModel === 'flat' ? 'Flat rate per job' : 'Hourly rate charged'}
        name="currentRate"
        value={inputs.currentRate}
        onChange={onChange}
        prefix="$"
      />

      {inputs.pricingModel === 'flat' && (
        <Field label="Avg job duration" name="avgJobDuration" value={inputs.avgJobDuration} onChange={onChange} suffix="hrs" />
      )}
    </div>
  );
}

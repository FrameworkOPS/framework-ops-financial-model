const inputStyle = {
  background: '#061220', border: '1px solid #102d4d', color: '#F8FAFC',
};
const focusHandler = (e) => (e.target.style.borderColor = '#10B981');
const blurHandler = (e) => (e.target.style.borderColor = '#102d4d');

function NumInput({ name, value, onChange, placeholder, prefix, suffix, small }) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#475569' }}>{prefix}</span>}
      <input
        type="number" name={name} value={value} onChange={onChange}
        placeholder={placeholder || '0'} min="0" step="any"
        className={`w-full rounded-lg text-sm outline-none transition-colors ${small ? 'py-2' : 'py-2.5'} ${prefix ? 'pl-6' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
        style={inputStyle}
        onFocus={focusHandler} onBlur={blurHandler}
      />
      {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#475569' }}>{suffix}</span>}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>
        {label}
        {hint && <span className="ml-1.5 text-xs font-normal" style={{ color: '#475569' }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SectionHeader({ label, onAdd, addLabel }) {
  return (
    <div className="flex items-center justify-between mt-5 mb-2">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{label}</span>
      <button type="button" onClick={onAdd}
        className="text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
        style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; }}
      >
        + {addLabel}
      </button>
    </div>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-lg leading-none transition-colors"
      style={{ color: '#475569', background: 'transparent' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
    >×</button>
  );
}

let _id = 100;
const uid = () => String(++_id);

export default function RecurringForm({ inputs, onChange, onListAdd, onListUpdate, onListRemove }) {
  const overheadItems = inputs.overheadItems || [];
  const hires = inputs.hires || [];
  const scalingHires = inputs.scalingHires || [];

  return (
    <div className="space-y-4">
      {/* Core inputs */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Active clients" hint="current count">
          <NumInput name="numClients" value={inputs.numClients} onChange={onChange} />
        </Field>
        <Field label="Monthly retainer" hint="per client">
          <NumInput name="retainerRate" value={inputs.retainerRate} onChange={onChange} prefix="$" />
        </Field>
      </div>
      <Field label="COGS per client / month" hint="delivery, contractors, tools">
        <NumInput name="cogsPerClient" value={inputs.cogsPerClient} onChange={onChange} prefix="$" />
      </Field>
      <Field label="Target net margin" hint="20–30% is healthy">
        <NumInput name="targetNetMarginPct" value={inputs.targetNetMarginPct} onChange={onChange} suffix="%" />
      </Field>

      {/* Overhead line items */}
      <SectionHeader
        label="Monthly Overhead"
        addLabel="Add Line Item"
        onAdd={() => onListAdd('overheadItems', { id: uid(), label: '', amount: '' })}
      />
      <div className="space-y-2">
        {overheadItems.map((item, i) => (
          <div key={item.id} className="flex gap-2 items-center">
            <input
              type="text" placeholder="e.g. Rent, Software, Marketing"
              value={item.label}
              onChange={(e) => onListUpdate('overheadItems', i, { label: e.target.value })}
              className="flex-1 rounded-lg py-2 px-3 text-sm outline-none transition-colors"
              style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
            />
            <div className="w-28 flex-shrink-0">
              <NumInput
                value={item.amount} prefix="$" small
                onChange={(e) => onListUpdate('overheadItems', i, { amount: e.target.value })}
              />
            </div>
            <RemoveBtn onClick={() => onListRemove('overheadItems', i)} />
          </div>
        ))}
        {overheadItems.length === 0 && (
          <p className="text-xs py-1" style={{ color: '#334155' }}>No overhead items yet. Click + Add Line Item.</p>
        )}
      </div>

      {/* Key hires */}
      <SectionHeader
        label="Key Hires"
        addLabel="Add Hire"
        onAdd={() => onListAdd('hires', { id: uid(), role: '', monthlySalary: '' })}
      />
      <div className="space-y-2">
        {hires.map((hire, i) => (
          <div key={hire.id} className="flex gap-2 items-center">
            <input
              type="text" placeholder="Role (e.g. Account Manager)"
              value={hire.role}
              onChange={(e) => onListUpdate('hires', i, { role: e.target.value })}
              className="flex-1 rounded-lg py-2 px-3 text-sm outline-none transition-colors"
              style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
            />
            <div className="w-28 flex-shrink-0">
              <NumInput
                value={hire.monthlySalary} prefix="$" small
                onChange={(e) => onListUpdate('hires', i, { monthlySalary: e.target.value })}
              />
            </div>
            <RemoveBtn onClick={() => onListRemove('hires', i)} />
          </div>
        ))}
        {hires.length === 0 && (
          <p className="text-xs py-1" style={{ color: '#334155' }}>No key hires yet.</p>
        )}
      </div>

      {/* Scaling hires */}
      <SectionHeader
        label="Scaling Hires"
        addLabel="Add Rule"
        onAdd={() => onListAdd('scalingHires', { id: uid(), role: '', monthlySalary: '', clientsPerHire: '' })}
      />
      <div className="space-y-3">
        {scalingHires.map((sh, i) => (
          <div key={sh.id} className="rounded-lg p-3 space-y-2" style={{ background: '#061220', border: '1px solid #0d2540' }}>
            <div className="flex gap-2 items-center">
              <input
                type="text" placeholder="Role (e.g. Copywriter)"
                value={sh.role}
                onChange={(e) => onListUpdate('scalingHires', i, { role: e.target.value })}
                className="flex-1 rounded-lg py-2 px-3 text-sm outline-none transition-colors"
                style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
              />
              <RemoveBtn onClick={() => onListRemove('scalingHires', i)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Monthly salary">
                <NumInput
                  value={sh.monthlySalary} prefix="$" small
                  onChange={(e) => onListUpdate('scalingHires', i, { monthlySalary: e.target.value })}
                />
              </Field>
              <Field label="1 hire per X clients">
                <NumInput
                  value={sh.clientsPerHire} small placeholder="10"
                  onChange={(e) => onListUpdate('scalingHires', i, { clientsPerHire: e.target.value })}
                />
              </Field>
            </div>
          </div>
        ))}
        {scalingHires.length === 0 && (
          <p className="text-xs py-1" style={{ color: '#334155' }}>No scaling rules yet. Example: 1 copywriter per 10 clients.</p>
        )}
      </div>
    </div>
  );
}

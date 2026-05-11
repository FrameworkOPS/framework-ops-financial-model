const fmt = (n) => '$' + Math.round(n).toLocaleString();
const pct = (n) => (isFinite(n) ? n.toFixed(1) + '%' : '—');
const neg = (n) => (n === 0 ? '—' : '(' + fmt(Math.abs(n)) + ')');

const colStyle = { minWidth: 110, textAlign: 'right' };
const labelStyle = { color: '#94a3b8', fontSize: 13, textAlign: 'left', paddingRight: 12 };
const dimStyle = { color: '#475569', fontSize: 12, textAlign: 'left', paddingLeft: 16, paddingRight: 12 };
const sectionStyle = { color: '#475569', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', paddingTop: 14, paddingBottom: 4 };
const dividerStyle = { borderTop: '1px solid #0d2540', margin: '2px 0' };

function Row({ label, values, bold, positive, negative, highlight, dim, section }) {
  const style = section ? sectionStyle : dim ? dimStyle : bold ? { ...labelStyle, color: '#F8FAFC', fontWeight: 700 } : labelStyle;
  return (
    <tr>
      <td style={style}>{label}</td>
      {values.map((v, i) => {
        const color = highlight ? (v >= 0 ? '#10B981' : '#f87171') : bold ? '#F8FAFC' : dim ? '#475569' : '#94a3b8';
        return (
          <td key={i} style={{ ...colStyle, color, fontWeight: bold ? 700 : 400, fontSize: dim ? 12 : 13 }}>
            {v === null ? '' : typeof v === 'string' ? v : bold || positive ? fmt(v) : negative ? neg(v) : fmt(v)}
          </td>
        );
      })}
    </tr>
  );
}

function Divider({ cols }) {
  return (
    <tr>
      <td colSpan={cols + 1} style={dividerStyle} />
    </tr>
  );
}

export default function ProFormaStatement({ results, inputs }) {
  const { proForma, overheadItems, hires } = results;
  if (!proForma || proForma.length === 0) return null;

  const cols = proForma.length;
  const headers = proForma.map((s) => (
    <th key={s.clients} style={{ ...colStyle, color: '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', paddingBottom: 8 }}>
      {s.clients} clients
    </th>
  ));

  return (
    <div className="overflow-x-auto">
      <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#475569' }}>
        Pro Forma P&L — Monthly
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', paddingBottom: 8 }} />
            {headers}
          </tr>
        </thead>
        <tbody>
          {/* Revenue */}
          <Row section label="Revenue" values={proForma.map(() => null)} />
          <Row dim label="Client retainers" values={proForma.map((s) => s.revenue)} positive />
          <Divider cols={cols} />
          <Row bold label="Gross Revenue" values={proForma.map((s) => s.revenue)} positive />

          {/* COGS */}
          <Row section label="Cost of Delivery" values={proForma.map(() => null)} />
          <Row dim label="COGS" values={proForma.map((s) => s.cogs)} negative />
          <Divider cols={cols} />
          <Row bold label="Gross Profit" values={proForma.map((s) => s.grossProfit)} highlight />
          <Row dim label="Gross Margin" values={proForma.map((s) => pct(s.grossMargin))} />

          {/* Overhead */}
          {overheadItems.length > 0 && (
            <>
              <Row section label="Fixed Overhead" values={proForma.map(() => null)} />
              {overheadItems.filter(item => item.label || item.amount).map((item, i) => (
                <Row key={i} dim label={item.label || 'Overhead item'} values={proForma.map(() => -Math.round(Math.abs(item.amount || 0)))} negative />
              ))}
            </>
          )}

          {/* Fixed hires */}
          {hires.length > 0 && (
            <>
              <Row section label="Fixed Team" values={proForma.map(() => null)} />
              {hires.map((h, i) => (
                <Row key={i} dim label={h.role || 'Hire'} values={proForma.map(() => -Math.round(Math.abs(h.monthlySalary || 0)))} negative />
              ))}
            </>
          )}

          {/* Scaling hires */}
          {results.scalingHires.length > 0 && (
            <>
              <Row section label="Scaling Team" values={proForma.map(() => null)} />
              {results.scalingHires.map((sh, i) => (
                <Row key={i} dim
                  label={`${sh.role || 'Role'} (1 per ${sh.clientsPerHire} clients)`}
                  values={proForma.map((s) => {
                    const count = sh.clientsPerHire > 0 ? Math.floor(s.clients / sh.clientsPerHire) : 0;
                    return count > 0 ? -(count * sh.monthlySalary) : 0;
                  })}
                  negative
                />
              ))}
              <Row dim label="  headcount"
                values={proForma.map((s) => {
                  const total = results.scalingHires.reduce((sum, sh) => {
                    return sum + (sh.clientsPerHire > 0 ? Math.floor(s.clients / sh.clientsPerHire) : 0);
                  }, 0);
                  return total > 0 ? `${total} hired` : '—';
                })}
              />
            </>
          )}

          <Divider cols={cols} />
          <Row bold label="Total Expenses" values={proForma.map((s) => -s.totalOpex)} negative />

          {/* Net */}
          <Divider cols={cols} />
          <Row bold label="Net Profit / Month" values={proForma.map((s) => s.netProfit)} highlight />
          <Row dim label="Net Margin" values={proForma.map((s) => pct(s.netMargin))} />
          <Row dim label="ARR run rate" values={proForma.map((s) => s.revenue * 12)} positive />
        </tbody>
      </table>
    </div>
  );
}

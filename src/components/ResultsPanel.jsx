import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import MetricCard from './MetricCard.jsx';
import ProFormaStatement from './ProFormaStatement.jsx';

const fmt = (n) => '$' + Math.round(n).toLocaleString();
const pct = (n) => n.toFixed(1) + '%';

function marginStatus(val, low, mid) {
  if (val >= mid) return 'green';
  if (val >= low) return 'yellow';
  return 'red';
}

const chartStyle = {
  tooltip: {
    contentStyle: { backgroundColor: '#081B2F', border: '1px solid #102d4d', borderRadius: 8, color: '#F8FAFC' },
    labelStyle: { color: '#64748b' },
  },
  xAxis: { tick: { fill: '#475569', fontSize: 11 }, axisLine: false, tickLine: false },
  yAxis: { tick: { fill: '#475569', fontSize: 11 }, axisLine: false, tickLine: false },
  grid: { strokeDasharray: '3 3', stroke: '#0d2540' },
};

export function GenericResults({ results }) {
  const r = results;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Monthly Revenue"      value={fmt(r.revenue)}               status="neutral" />
        <MetricCard label="Net Profit"           value={fmt(r.netProfit)}             status={r.netProfit < 0 ? 'red' : r.netMargin >= 10 ? 'green' : 'yellow'} />
        <MetricCard label="Net Margin"           value={pct(r.netMargin)}             status={marginStatus(r.netMargin, 7, 10)}             sub="Target: 10–20%" />
        <MetricCard label="Contribution Margin"  value={pct(r.contributionMarginPct)} status={marginStatus(r.contributionMarginPct, 20, 30)} sub="Target: 30–50%" />
        <MetricCard label="Break-even Units"     value={r.breakEvenUnits.toLocaleString()} status="neutral" />
        <MetricCard label="Break-even Revenue"   value={fmt(r.breakEvenRevenue)}      status="neutral" />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#475569' }}>Revenue vs. Total Cost</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={r.chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
            <CartesianGrid {...chartStyle.grid} />
            <XAxis dataKey="units" {...chartStyle.xAxis} label={{ value: 'Units', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 11 }} />
            <YAxis tickFormatter={(v) => '$' + (v / 1000).toFixed(0) + 'k'} {...chartStyle.yAxis} />
            <Tooltip {...chartStyle.tooltip} formatter={(v) => fmt(v)} />
            <Line type="monotone" dataKey="revenue"   stroke="#10B981" strokeWidth={2} dot={false} name="Revenue" />
            <Line type="monotone" dataKey="totalCost" stroke="#f87171" strokeWidth={2} dot={false} name="Total Cost" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RecurringResults({ results, inputs }) {
  const r = results;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="MRR"                    value={fmt(r.monthlyRevenue)}           status="neutral" />
        <MetricCard label="ARR"                    value={fmt(r.annualRevenue)}             status="neutral" />
        <MetricCard label="Net Profit / Month"     value={fmt(r.netProfit)}                 status={r.netProfit < 0 ? 'red' : r.netMargin >= 20 ? 'green' : 'yellow'} />
        <MetricCard label="Net Margin"             value={pct(r.netMargin)}                 status={marginStatus(r.netMargin, 15, 20)} sub="Target: 20–30%" />
        <MetricCard label="Gross Margin"           value={pct(r.grossMargin)}               status={marginStatus(r.grossMargin, 40, 55)} sub="Target: 55–70%" />
        <MetricCard label="Contribution / Client"  value={fmt(r.contributionPerClient)}     status={r.contributionPerClient > 0 ? 'green' : 'red'} sub="per month" />
        <MetricCard label="Break-even Clients"     value={r.breakEvenClients.toLocaleString()} status="neutral" />
        <MetricCard label={`Clients for ${inputs.targetNetMarginPct}% Net`} value={r.targetClients.toLocaleString()} status={r.targetClients <= Number(inputs.numClients) ? 'green' : 'yellow'} sub={fmt(r.targetRevenue) + ' MRR'} />
      </div>

      <div className="rounded-xl p-5" style={{ background: '#061220', border: '1px solid #0d2540' }}>
        <ProFormaStatement results={r} inputs={inputs} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#475569' }}>Revenue vs. Total Cost by Client Count</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={r.chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
            <CartesianGrid {...chartStyle.grid} />
            <XAxis dataKey="clients" {...chartStyle.xAxis} label={{ value: 'Clients', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 11 }} />
            <YAxis tickFormatter={(v) => '$' + (v / 1000).toFixed(0) + 'k'} {...chartStyle.yAxis} />
            <Tooltip {...chartStyle.tooltip} formatter={(v) => fmt(v)} />
            <Line type="monotone" dataKey="revenue"   stroke="#10B981" strokeWidth={2} dot={false} name="Revenue" />
            <Line type="monotone" dataKey="totalCost" stroke="#f87171" strokeWidth={2} dot={false} name="Total Cost" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HomeServicesResults({ results, inputs }) {
  const r = results;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Monthly Revenue"      value={fmt(r.monthlyRevenue)} status="neutral" />
        <MetricCard label="Net Profit"           value={fmt(r.netProfit)}      status={r.netProfit < 0 ? 'red' : r.netMargin >= 10 ? 'green' : 'yellow'} />
        <MetricCard label="Net Margin"           value={pct(r.netMargin)}      status={marginStatus(r.netMargin, 7, 10)}    sub="Target: 10–20%" />
        <MetricCard label="Gross Margin"         value={pct(r.grossMargin)}    status={marginStatus(r.grossMargin, 20, 30)} sub="Target: 30–40%" />
        <MetricCard label="True Labor Cost/hr"   value={'$' + r.trueCostPerHour.toFixed(2)} status="neutral" sub="Wage + 17.5% burden" />
        <MetricCard label="Revenue per Tech"     value={fmt(r.revenuePerTech)} status={r.revenuePerTech >= 8000 ? 'green' : r.revenuePerTech >= 5000 ? 'yellow' : 'red'} sub="per month" />
        <MetricCard label="Break-even Revenue"   value={fmt(r.breakEvenRevenue)} status="neutral" />
        <MetricCard
          label={`Recommended ${inputs.pricingModel === 'flat' ? 'Flat Rate' : 'Hourly Rate'}`}
          value={'$' + Math.round(r.recommendedRate)}
          status={r.recommendedRate > (parseFloat(inputs.currentRate) || 0) ? 'yellow' : 'green'}
          sub={`to hit ${inputs.targetNetMarginPct}% net margin`}
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#475569' }}>Revenue Scenarios</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={r.chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
            <CartesianGrid {...chartStyle.grid} />
            <XAxis dataKey="name" {...chartStyle.xAxis} />
            <YAxis tickFormatter={(v) => '$' + (v / 1000).toFixed(0) + 'k'} {...chartStyle.yAxis} />
            <Tooltip {...chartStyle.tooltip} formatter={(v) => fmt(v)} />
            <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

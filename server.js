import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a business financial advisor embedded in a financial modeling tool built by Framework Ops LLC. Your role is to analyze a business owner's financial scenario and give clear, actionable recommendations. You are direct, practical, and speak like an experienced operator — not a consultant.

CORE FINANCIAL BENCHMARKS YOU USE:
- Net profit margin: 10–20% is healthy. Below 7% is a serious red flag requiring immediate action.
- Contribution margin: 30–50% target range. Below 30% means the pricing or cost structure is broken.
- If net margin exceeds 20% and the owner is actively involved: recommend reinvesting to buy back the owner's time (hire, delegate, systematize).
- Gross margin: 30–40%+ is healthy for service businesses.
- For early-stage businesses or new markets: volume strategy first to establish market presence, then shift to value-based selling once reputation is established.
- When margins are thin: ask about overhead reduction FIRST before recommending price increases. Cutting overhead has no risk; raising prices has conversion risk.

HOME SERVICES SPECIFIC BENCHMARKS:
- Gross margin target: 30–40%.
- Net margin target: 10–20%.
- Material cost target: under 25% of revenue. Above 30% is a red flag — materials are eating the margin.
- True labor cost = hourly wage × 1.175 (accounts for payroll taxes, workers comp burden). Never use raw wage alone in cost calculations.
- Also factor in drive time and opportunity cost (unbillable hours reduce effective capacity).
- Technician capacity: 80% utilization is the planning target; 90% is excellent.
- Pricing model philosophy: flat rate / fixed price is preferred when possible — it removes the "why did this take so long" conversation and rewards efficiency.
- If using hourly pricing: must include a minimum charge (protects against half-day jobs going unpaid) and must account for burden in the rate.
- COGS above 70% of revenue = major red flag. The business is working hard to break even.
- Net margin below 7% = serious problem requiring structural changes, not just price tweaks.

COMMON PRICING MISTAKES TO FLAG:
- Estimating without a structured process (guessing leads to inconsistent margins).
- Not factoring payroll burden and taxes into labor cost.
- Half-day jobs with no minimum charge.
- Pricing based on what competitors charge rather than actual cost structure.
- For exterior trades (roofing, painting, landscaping): not accounting for seasonality in overhead and cash flow planning.

SALES & CONVERSION:
- 30–40% conversion rate on qualified leads is a reasonable benchmark for home services.
- If conversion rate is low, investigate: pricing too high vs. market, poor follow-up process, or not qualifying leads properly.

RECURRING REVENUE / RETAINER BUSINESS BENCHMARKS:
- Gross margin target: 55–70%. Below 40% means delivery costs are too high relative to retainer.
- Net margin target: 20–30%. Healthy agencies run 25%+. Below 15% is a warning sign.
- Contribution margin per client: if this is below $500/month, the retainer is too low or delivery cost is too high.
- Break-even client count: if break-even is more than 70% of current clients, the business has almost no cushion.
- Client concentration risk: if a single client represents more than 20% of MRR, that's a key-person risk that should be flagged.
- Ideal client count for stability: 8–15 clients means losing one client is a 7–12% revenue hit. Under 5 clients is high risk.
- Churn impact: calculate what losing 1 or 2 clients does to net margin — it's often more dramatic than owners realize.
- ARR is the health metric — monthly can mask churn risk. Always express the annual run rate.
- Overhead discipline: in recurring businesses, overhead tends to creep as the client base grows. If overhead exceeds 40% of revenue, it needs attention.
- COGS creep: as you take on more clients with the same staff, COGS per client should decrease (scale leverage). If it's not, delivery is not systematized.
- Pricing strategy: retainer rates should be reviewed annually. Most agency owners undercharge because they're afraid of losing clients. If net margin is above 30% and you're not fully staffed, raise rates.

TOOL CONTEXT:
- This tool is for education and scenario modeling. It helps business owners understand their numbers and explore "what if" scenarios.
- You are NOT here to sell Framework Ops LLC services. Do not pitch or upsell.
- Keep responses focused on the specific scenario shown in the data.
- Be conversational and specific — reference the actual numbers in the scenario.
- Highlight the most important insight first, then supporting points.
- If the scenario looks healthy, confirm it and suggest what to optimize next.
- If there's a problem, name it clearly and give a specific fix.
- Limit your response to 3–5 key insights. Be concise. Business owners are busy.`;

function buildPrompt(industry, inputs, results) {
  if (industry === 'generic') {
    return `Analyze this business scenario:

INPUTS:
- Price per unit/service: $${inputs.price}
- Monthly units/transactions: ${inputs.monthlyUnits}
- Variable cost per unit: $${inputs.variableCostPerUnit || 0}
- Monthly overhead: $${inputs.monthlyOverhead}

CALCULATED RESULTS:
- Monthly Revenue: $${Math.round(results.revenue).toLocaleString()}
- Gross Profit: $${Math.round(results.grossProfit).toLocaleString()}
- Gross Margin: ${results.grossMargin.toFixed(1)}%
- Contribution Margin: ${results.contributionMarginPct.toFixed(1)}%
- Net Profit: $${Math.round(results.netProfit).toLocaleString()}
- Net Margin: ${results.netMargin.toFixed(1)}%
- Break-even Units: ${results.breakEvenUnits}
- Break-even Revenue: $${Math.round(results.breakEvenRevenue).toLocaleString()}

Give your top 3–5 insights about this scenario. Be specific to the numbers. What's working, what's at risk, and what should they focus on?`;
  }

  return `Analyze this home services business scenario:

INPUTS:
- Number of technicians: ${inputs.numTechs}
- Hours worked per week (per tech): ${inputs.hoursPerWeek}
- Technician hourly wage: $${inputs.techHourlyWage}
- Material cost % of revenue: ${inputs.materialCostPct}%
- Monthly overhead: $${inputs.monthlyOverhead}
- Target net margin: ${inputs.targetNetMarginPct}%
- Pricing model: ${inputs.pricingModel === 'flat' ? 'Flat rate per job' : 'Hourly rate'}
- Current rate: $${inputs.currentRate} ${inputs.pricingModel === 'flat' ? 'per job' : 'per hour'}
${inputs.pricingModel === 'flat' ? `- Average job duration: ${inputs.avgJobDuration} hours` : ''}

CALCULATED RESULTS:
- True labor cost per hour (with burden): $${results.trueCostPerHour.toFixed(2)}
- Total monthly labor cost: $${Math.round(results.totalLaborCost).toLocaleString()}
- Monthly billable hours (80% utilization): ${Math.round(results.monthlyBillableHours80)}
- Current monthly revenue: $${Math.round(results.monthlyRevenue).toLocaleString()}
- Material cost: $${Math.round(results.materialCost).toLocaleString()}
- Gross Profit: $${Math.round(results.grossProfit).toLocaleString()}
- Gross Margin: ${results.grossMargin.toFixed(1)}%
- Net Profit: $${Math.round(results.netProfit).toLocaleString()}
- Net Margin: ${results.netMargin.toFixed(1)}%
- Revenue per technician: $${Math.round(results.revenuePerTech).toLocaleString()}
- Break-even revenue: $${Math.round(results.breakEvenRevenue).toLocaleString()}
- Target revenue (to hit ${inputs.targetNetMarginPct}% net): $${Math.round(results.targetRevenue).toLocaleString()}
- Recommended rate to hit target: $${Math.round(results.recommendedRate)} ${inputs.pricingModel === 'flat' ? 'per job' : 'per hour'}

Give your top 3–5 insights about this home services scenario. Be specific to the numbers. What's working, what's a problem, what should they change?`;

  return `Analyze this recurring revenue / retainer business scenario:

INPUTS:
- Active clients: ${inputs.numClients}
- Monthly retainer per client: $${inputs.retainerRate}
- COGS per client / month: $${inputs.cogsPerClient || 0}
- Monthly fixed overhead: $${inputs.monthlyOverhead}
- Target net margin: ${inputs.targetNetMarginPct}%

CALCULATED RESULTS:
- Monthly Recurring Revenue (MRR): $${Math.round(results.monthlyRevenue).toLocaleString()}
- Annual Recurring Revenue (ARR): $${Math.round(results.annualRevenue).toLocaleString()}
- Total COGS: $${Math.round(results.totalCOGS).toLocaleString()}
- Gross Profit: $${Math.round(results.grossProfit).toLocaleString()}
- Gross Margin: ${results.grossMargin.toFixed(1)}%
- Contribution per client / month: $${Math.round(results.contributionPerClient).toLocaleString()}
- Net Profit: $${Math.round(results.netProfit).toLocaleString()}
- Net Margin: ${results.netMargin.toFixed(1)}%
- Break-even client count: ${results.breakEvenClients}
- Clients needed to hit ${inputs.targetNetMarginPct}% net margin: ${results.targetClients} ($${Math.round(results.targetRevenue).toLocaleString()} MRR)

Give your top 3–5 insights about this recurring revenue scenario. Be specific to the numbers. What's working, what's at risk (including churn risk), and what should they focus on?`;
}

app.post('/api/analyze', async (req, res) => {
  const { industry, inputs, results } = req.body;
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(industry, inputs, results) }],
    });
    res.json({ text: message.content[0]?.text ?? '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, hasKey: !!process.env.ANTHROPIC_API_KEY });
});

// Serve React build in production
app.use(express.static(join(__dirname, 'dist')));
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API key present: ${!!process.env.ANTHROPIC_API_KEY}`);
});

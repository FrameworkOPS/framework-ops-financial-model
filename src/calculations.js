export const n = (val) => parseFloat(val) || 0;

export function calculateGeneric(inputs) {
  const price = n(inputs.price);
  const units = n(inputs.monthlyUnits);
  const varCost = n(inputs.variableCostPerUnit);
  const overhead = n(inputs.monthlyOverhead);

  const revenue = price * units;
  const totalVarCosts = varCost * units;
  const grossProfit = revenue - totalVarCosts;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const contributionPerUnit = price - varCost;
  const contributionMarginPct = price > 0 ? (contributionPerUnit / price) * 100 : 0;
  const netProfit = grossProfit - overhead;
  const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const breakEvenUnits = contributionPerUnit > 0 ? Math.ceil(overhead / contributionPerUnit) : 0;
  const breakEvenRevenue = breakEvenUnits * price;

  const maxUnits = Math.max(units * 2, breakEvenUnits * 1.5, 1);
  const chartData = Array.from({ length: 11 }, (_, i) => {
    const u = Math.round((i / 10) * maxUnits);
    return {
      units: u,
      revenue: Math.round(price * u),
      totalCost: Math.round(varCost * u + overhead),
    };
  });

  return {
    revenue, totalVarCosts, grossProfit, grossMargin,
    contributionMarginPct, netProfit, netMargin,
    breakEvenUnits, breakEvenRevenue, chartData,
  };
}

export function isGenericComplete(inputs) {
  return n(inputs.price) > 0 && n(inputs.monthlyUnits) > 0 && n(inputs.monthlyOverhead) > 0;
}

export function calculateHomeServices(inputs) {
  const numTechs = n(inputs.numTechs);
  const hoursPerWeek = n(inputs.hoursPerWeek);
  const wage = n(inputs.techHourlyWage);
  const materialPct = n(inputs.materialCostPct) / 100;
  const overhead = n(inputs.monthlyOverhead);
  const targetNet = n(inputs.targetNetMarginPct) / 100;
  const avgJobDuration = n(inputs.avgJobDuration) || 1;
  const currentRate = n(inputs.currentRate);

  const trueCostPerHour = wage * 1.175;
  const totalMonthlyTechHours = numTechs * hoursPerWeek * 4.33;
  const totalLaborCost = trueCostPerHour * totalMonthlyTechHours;
  const monthlyBillableHours80 = totalMonthlyTechHours * 0.80;
  const monthlyBillableHours90 = totalMonthlyTechHours * 0.90;

  let monthlyRevenue, jobsPerMonth;
  if (inputs.pricingModel === 'hourly') {
    monthlyRevenue = monthlyBillableHours80 * currentRate;
    jobsPerMonth = null;
  } else {
    jobsPerMonth = avgJobDuration > 0 ? monthlyBillableHours80 / avgJobDuration : 0;
    monthlyRevenue = jobsPerMonth * currentRate;
  }

  const materialCost = monthlyRevenue * materialPct;
  const grossProfit = monthlyRevenue - materialCost - totalLaborCost;
  const grossMargin = monthlyRevenue > 0 ? (grossProfit / monthlyRevenue) * 100 : 0;
  const netProfit = grossProfit - overhead;
  const netMargin = monthlyRevenue > 0 ? (netProfit / monthlyRevenue) * 100 : 0;
  const revenuePerTech = numTechs > 0 ? monthlyRevenue / numTechs : 0;

  const breakEvenRevenue = (1 - materialPct) > 0
    ? (totalLaborCost + overhead) / (1 - materialPct)
    : 0;

  const denom = 1 - materialPct - targetNet;
  const targetRevenue = denom > 0
    ? (totalLaborCost + overhead) / denom
    : 0;

  const recommendedRate = inputs.pricingModel === 'hourly'
    ? (monthlyBillableHours80 > 0 ? targetRevenue / monthlyBillableHours80 : 0)
    : (jobsPerMonth > 0 ? targetRevenue / jobsPerMonth : 0);

  const revenue90 = monthlyBillableHours80 > 0
    ? (monthlyBillableHours90 / monthlyBillableHours80) * monthlyRevenue
    : 0;

  const chartData = [
    { name: 'Break-even', revenue: Math.round(breakEvenRevenue) },
    { name: 'Current (80%)', revenue: Math.round(monthlyRevenue) },
    { name: 'Target', revenue: Math.round(targetRevenue) },
    { name: 'At 90% Util.', revenue: Math.round(revenue90) },
  ];

  return {
    trueCostPerHour, totalLaborCost, monthlyRevenue, materialCost,
    grossProfit, grossMargin, netProfit, netMargin, revenuePerTech,
    breakEvenRevenue, targetRevenue, recommendedRate,
    monthlyBillableHours80, jobsPerMonth, chartData,
  };
}

export function isHomeComplete(inputs) {
  return (
    n(inputs.numTechs) > 0 &&
    n(inputs.hoursPerWeek) > 0 &&
    n(inputs.techHourlyWage) > 0 &&
    n(inputs.currentRate) > 0 &&
    n(inputs.monthlyOverhead) > 0
  );
}

export function calculateRecurring(inputs) {
  const numClients = n(inputs.numClients);
  const retainerRate = n(inputs.retainerRate);
  const cogsPerClient = n(inputs.cogsPerClient);
  const overhead = n(inputs.monthlyOverhead);
  const targetNet = n(inputs.targetNetMarginPct) / 100;

  const monthlyRevenue = numClients * retainerRate;
  const totalCOGS = numClients * cogsPerClient;
  const grossProfit = monthlyRevenue - totalCOGS;
  const grossMargin = monthlyRevenue > 0 ? (grossProfit / monthlyRevenue) * 100 : 0;
  const contributionPerClient = retainerRate - cogsPerClient;
  const contributionMarginPct = retainerRate > 0 ? (contributionPerClient / retainerRate) * 100 : 0;
  const netProfit = grossProfit - overhead;
  const netMargin = monthlyRevenue > 0 ? (netProfit / monthlyRevenue) * 100 : 0;
  const annualRevenue = monthlyRevenue * 12;

  const breakEvenClients = contributionPerClient > 0 ? Math.ceil(overhead / contributionPerClient) : 0;
  const breakEvenRevenue = breakEvenClients * retainerRate;

  const denominator = contributionPerClient - retainerRate * targetNet;
  const targetClients = denominator > 0 ? Math.ceil(overhead / denominator) : 0;
  const targetRevenue = targetClients * retainerRate;

  const maxClients = Math.max(numClients * 2, breakEvenClients * 1.5, targetClients * 1.2, 1);
  const chartData = Array.from({ length: 11 }, (_, i) => {
    const c = Math.round((i / 10) * maxClients);
    return {
      clients: c,
      revenue: Math.round(c * retainerRate),
      totalCost: Math.round(c * cogsPerClient + overhead),
    };
  });

  return {
    monthlyRevenue, totalCOGS, grossProfit, grossMargin,
    contributionPerClient, contributionMarginPct,
    netProfit, netMargin, annualRevenue,
    breakEvenClients, breakEvenRevenue,
    targetClients, targetRevenue,
    chartData,
  };
}

export function isRecurringComplete(inputs) {
  return n(inputs.numClients) > 0 && n(inputs.retainerRate) > 0 && n(inputs.monthlyOverhead) > 0;
}

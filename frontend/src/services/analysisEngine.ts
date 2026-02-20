// frontend/src/services/analysisEngine.ts

export interface AnalysisResults {
  fragilityScore: number;
  runwayMonths: number;
  ltvCacRatio: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  chartData: number[];
  recommendation: string;
}

export const analyzeStartupLogic = (
  burn: number = 0, 
  cac: number = 0, 
  assumptions: string[] = []
): AnalysisResults => {
  // 1. Calculate Fragility Score (1.0 - 10.0)
  // Logic: Higher burn and higher CAC relative to benchmarks increases fragility
  const normalizedBurn = Math.min(burn / 15000, 5); // Base 5 on 15k burn
  const normalizedCac = Math.min(cac / 300, 5);    // Base 5 on $300 CAC
  const assumptionPenalty = assumptions.filter(a => a.length > 2).length * 0.3;
  
  const rawScore = (normalizedBurn + normalizedCac + 2.5) - assumptionPenalty;
  const fragilityScore = parseFloat(Math.min(Math.max(rawScore, 1.1), 9.9).toFixed(1));

  // 2. Determine Risk Level
  let riskLevel: AnalysisResults['riskLevel'] = 'Low';
  if (fragilityScore > 8) riskLevel = 'Critical';
  else if (fragilityScore > 6.5) riskLevel = 'High';
  else if (fragilityScore > 4) riskLevel = 'Medium';

  // 3. Simple LTV/CAC Ratio Logic (Assumes a $60 ARPU for simulation)
  const ltvCacRatio = parseFloat(((60 * 12) / Math.max(cac, 1)).toFixed(1));

  // 4. Generate Chart Data (12 Months of Projected Load)
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const volatility = Math.random() * 5;
    const baseLine = Math.min(20 + (i * 7) + (burn / 500), 100);
    return Math.round(baseLine + volatility);
  });

  // 5. Strategic Recommendation
  let recommendation = "Structural logic appears sound. Proceed to MVP.";
  if (riskLevel === 'Critical') {
    recommendation = "Immediate logic pivot required. Burn-to-Scale ratio is unsustainable.";
  } else if (cac > 200) {
    recommendation = "High acquisition friction detected. Audit your organic growth channels.";
  } else if (fragilityScore < 3) {
    recommendation = "Exceptional resilience. Model is ready for institutional capital.";
  }

  return {
    fragilityScore,
    runwayMonths: burn > 0 ? Math.floor(150000 / burn) : 36, // Assumes 150k capital
    ltvCacRatio,
    riskLevel,
    chartData,
    recommendation
  };
};
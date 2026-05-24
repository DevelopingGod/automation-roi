import { evaluateSafeExpression } from "./roi-calculator";
import { Currency } from "./currencies";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface LineItem {
  id: string;
  label: string;
  formula: string; // plain number string OR safe arithmetic expression
}

export interface CostingCardData {
  id: string;
  title: string;
  items: LineItem[];
}

export interface BusinessFormulaConfig {
  manualProfit: string;
  automationProfit: string;
  savings: string;
  roi: string;
}

export interface BusinessResult {
  manualCostTotal: number;
  automationCostTotal: number;
  revenueTotal: number;
  manualProfit: number | null;
  automationProfit: number | null;
  savings: number | null;
  roi: number | null;
  profitDelta: number | null; // automationProfit - manualProfit
}

// ─────────────────────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_FORMULA_CONFIG: BusinessFormulaConfig = {
  manualProfit:     "revenue - manual_cost",
  automationProfit: "revenue - automation_cost",
  savings:          "manual_cost - automation_cost",
  roi:              "(savings / automation_cost) * 100",
};

const uid = () => Math.random().toString(36).slice(2, 9);

export const createDefaultManualCard = (): CostingCardData => ({
  id: "manual",
  title: "Manual Costing",
  items: [
    { id: uid(), label: "Labor Cost",       formula: "0" },
    { id: uid(), label: "Setup & Overhead", formula: "0" },
    { id: uid(), label: "Raw Materials",    formula: "0" },
    { id: uid(), label: "Utilities",        formula: "0" },
    { id: uid(), label: "Other Expenses",   formula: "0" },
  ],
});

export const createDefaultAutomationCard = (): CostingCardData => ({
  id: "automation",
  title: "AI / Automation Costing",
  items: [
    { id: uid(), label: "Tool Subscription",   formula: "0" },
    { id: uid(), label: "Setup & Integration", formula: "0" },
    { id: uid(), label: "Maintenance",         formula: "0" },
    { id: uid(), label: "Training",            formula: "0" },
    { id: uid(), label: "Other",               formula: "0" },
  ],
});

export const createDefaultRevenueCard = (): CostingCardData => ({
  id: "revenue",
  title: "Selling Price / Income",
  items: [
    { id: uid(), label: "Product Sales",  formula: "0" },
    { id: uid(), label: "Service Fees",   formula: "0" },
    { id: uid(), label: "Other Income",   formula: "0" },
  ],
});

// ─────────────────────────────────────────────────────────────────────────────
// Computation helpers
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateLineItem(formula: string): number {
  const result = evaluateSafeExpression(formula);
  return result ?? 0;
}

export function isFormulaExpression(formula: string): boolean {
  const trimmed = formula.trim();
  const val = evaluateSafeExpression(trimmed);
  if (val === null) return false;
  return trimmed !== String(val) && trimmed !== val.toFixed(0) && trimmed !== val.toFixed(2);
}

export function computeCardTotal(card: CostingCardData): number {
  return card.items.reduce((sum, item) => sum + evaluateLineItem(item.formula), 0);
}

/**
 * Evaluates an aggregate formula by substituting named variables before safe-evaluating.
 * Variable names are replaced longest-first to avoid partial matches.
 */
export function evaluateWithVariables(
  formula: string,
  variables: Record<string, number>
): number | null {
  let expr = formula.trim();
  const sorted = Object.keys(variables).sort((a, b) => b.length - a.length);
  for (const name of sorted) {
    expr = expr.replace(new RegExp(`\\b${name}\\b`, "g"), String(variables[name]));
  }
  return evaluateSafeExpression(expr);
}

export function computeBusinessResult(
  manual: CostingCardData,
  automation: CostingCardData,
  revenue: CostingCardData,
  config: BusinessFormulaConfig
): BusinessResult {
  const manual_cost      = computeCardTotal(manual);
  const automation_cost  = computeCardTotal(automation);
  const revenue_total    = computeCardTotal(revenue);

  const base = { manual_cost, automation_cost, revenue: revenue_total };

  const manualProfit     = evaluateWithVariables(config.manualProfit,     base);
  const automationProfit = evaluateWithVariables(config.automationProfit, base);

  const withProfits = {
    ...base,
    manual_profit:     manualProfit     ?? 0,
    automation_profit: automationProfit ?? 0,
  };
  const savings = evaluateWithVariables(config.savings, withProfits);

  const roi = evaluateWithVariables(config.roi, {
    ...withProfits,
    savings: savings ?? 0,
  });

  const profitDelta =
    manualProfit !== null && automationProfit !== null
      ? automationProfit - manualProfit
      : null;

  return {
    manualCostTotal:    manual_cost,
    automationCostTotal: automation_cost,
    revenueTotal:       revenue_total,
    manualProfit,
    automationProfit,
    savings,
    roi,
    profitDelta,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Export data builders
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportRow {
  label: string;
  formula: string;
  value: number; // raw number — let each exporter apply its own formatter
}

export interface ExportSheet {
  title: string;
  rows: ExportRow[];
  total: number;
}

export function buildExportSheets(
  manual: CostingCardData,
  automation: CostingCardData,
  revenue: CostingCardData,
  result: BusinessResult,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _currency: Currency
): ExportSheet[] {
  const toSheet = (card: CostingCardData, total: number): ExportSheet => ({
    title: card.title,
    rows: card.items.map((item) => ({
      label:   item.label,
      formula: item.formula,
      value:   evaluateLineItem(item.formula),
    })),
    total,
  });

  return [
    toSheet(manual,     result.manualCostTotal),
    toSheet(automation, result.automationCostTotal),
    toSheet(revenue,    result.revenueTotal),
  ];
}

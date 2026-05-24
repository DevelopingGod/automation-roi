// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ROIInputs {
  hourlyRate: number;       // USD per hour
  manualHoursPerWeek: number;
  automationCostPerMonth: number;
}

/**
 * Overrideable constants exposed in Advanced Configuration.
 * All fields are optional — missing fields fall back to defaults.
 */
export interface AdvancedConfig {
  weeksPerYear?: number;          // default: 52
  overheadMultiplier?: number;    // default: 1.0  (e.g. 1.3 adds 30% overhead)
  hoursRecoveredFraction?: number; // default: 1.0  (fraction of manual hours truly saved)
  customWeeklyFormula?: string;   // optional: user-typed expression evaluated safely
}

export interface ROIResult {
  weeklyManualCost: number;
  monthlyManualCost: number;
  yearlyManualCost: number;
  monthlyAutomationCost: number;
  monthlySavings: number;
  yearlySavings: number;
  roiPercent: number;
  isNegativeROI: boolean;
  breakEvenWeeks: number | null;  // null when automation is free or already profitable
  effectiveHourlyRate: number;    // after overhead multiplier
}

// ─────────────────────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_ADVANCED_CONFIG: Required<AdvancedConfig> = {
  weeksPerYear: 52,
  overheadMultiplier: 1.0,
  hoursRecoveredFraction: 1.0,
  customWeeklyFormula: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// Safe expression evaluator
// Supports: numbers, +, -, *, /, (, )
// Rejects anything that isn't a simple arithmetic expression.
// ─────────────────────────────────────────────────────────────────────────────

const SAFE_EXPR_PATTERN = /^[\d\s+\-*/().]+$/;

export function evaluateSafeExpression(expr: string): number | null {
  const trimmed = expr.trim();
  if (!trimmed) return null;
  if (!SAFE_EXPR_PATTERN.test(trimmed)) return null;

  try {
    // Using Function constructor is intentional here: the regex above ensures
    // only arithmetic operators and numeric literals can pass through, making
    // eval-equivalent execution safe for this constrained input.
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${trimmed})`)() as unknown;
    if (typeof result !== "number" || !isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core calculation
// ─────────────────────────────────────────────────────────────────────────────

export function calculateROI(
  inputs: ROIInputs,
  config: AdvancedConfig = {}
): ROIResult {
  const {
    weeksPerYear,
    overheadMultiplier,
    hoursRecoveredFraction,
    customWeeklyFormula,
  } = { ...DEFAULT_ADVANCED_CONFIG, ...config };

  const { hourlyRate, manualHoursPerWeek, automationCostPerMonth } = inputs;

  // Clamp all inputs to non-negative
  const safeRate = Math.max(0, hourlyRate);
  const safeHours = Math.max(0, manualHoursPerWeek);
  const safeAutomation = Math.max(0, automationCostPerMonth);
  const safeMultiplier = Math.max(0, overheadMultiplier);
  const safeFraction = Math.max(0, Math.min(1, hoursRecoveredFraction));

  const effectiveHourlyRate = safeRate * safeMultiplier;

  // Weekly cost: use custom formula if provided and valid, else standard calc
  let weeklyManualCost: number;
  if (customWeeklyFormula) {
    const evaluated = evaluateSafeExpression(customWeeklyFormula);
    weeklyManualCost = evaluated !== null ? Math.max(0, evaluated) : effectiveHourlyRate * safeHours * safeFraction;
  } else {
    weeklyManualCost = effectiveHourlyRate * safeHours * safeFraction;
  }

  const weeksPerMonth = weeksPerYear / 12;

  const monthlyManualCost = weeklyManualCost * weeksPerMonth;
  const yearlyManualCost = weeklyManualCost * weeksPerYear;

  const monthlySavings = monthlyManualCost - safeAutomation;
  const yearlySavings = monthlySavings * 12;

  // ROI: (net savings / cost) * 100. Guard against division by zero.
  const roiPercent =
    safeAutomation > 0
      ? (monthlySavings / safeAutomation) * 100
      : monthlySavings > 0
      ? Infinity
      : 0;

  const isNegativeROI = monthlySavings < 0;

  // Break-even: months until cumulative savings cover the automation cost
  // Only meaningful when currently negative ROI
  let breakEvenWeeks: number | null = null;
  if (isNegativeROI && weeklyManualCost > 0) {
    breakEvenWeeks = safeAutomation / (weeklyManualCost * safeFraction);
  }

  return {
    weeklyManualCost,
    monthlyManualCost,
    yearlyManualCost,
    monthlyAutomationCost: safeAutomation,
    monthlySavings,
    yearlySavings,
    roiPercent: isFinite(roiPercent) ? roiPercent : 9999,
    isNegativeROI,
    breakEvenWeeks,
    effectiveHourlyRate,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatting helpers (pure — no React dependency)
// ─────────────────────────────────────────────────────────────────────────────

export function formatCurrency(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  if (value >= 9999) return ">9999%";
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function formatWeeks(weeks: number): string {
  if (weeks < 1) return "< 1 week";
  if (weeks < 8) return `${Math.ceil(weeks)} week${Math.ceil(weeks) === 1 ? "" : "s"}`;
  const months = weeks / 4.33;
  return `${months.toFixed(1)} months`;
}

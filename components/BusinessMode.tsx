"use client";

import { useState, useMemo } from "react";
import { Clock, Zap, TrendingUp, ZapOff } from "lucide-react";
import {
  CostingCardData,
  BusinessFormulaConfig,
  DEFAULT_FORMULA_CONFIG,
  createDefaultManualCard,
  createDefaultAutomationCard,
  createDefaultRevenueCard,
  computeBusinessResult,
} from "../lib/business-calculator";
import { useCurrency } from "./ThemeProvider";
import { CostingCard } from "./CostingCard";
import { BusinessSummary } from "./BusinessSummary";
import { BusinessFormulaConfigPanel } from "./BusinessFormulaConfig";
import { ExportButtons } from "./ExportButtons";

// A zeroed-out automation card used when the card is disabled
function makeZeroAutomationCard(base: CostingCardData): CostingCardData {
  return {
    ...base,
    items: base.items.map((item) => ({ ...item, formula: "0" })),
  };
}

export function BusinessMode() {
  const { currency } = useCurrency();

  const [manualCard,       setManualCard]       = useState<CostingCardData>(createDefaultManualCard);
  const [automationCard,   setAutomationCard]   = useState<CostingCardData>(createDefaultAutomationCard);
  const [revenueCard,      setRevenueCard]      = useState<CostingCardData>(createDefaultRevenueCard);
  const [formulaConfig,    setFormulaConfig]    = useState<BusinessFormulaConfig>(DEFAULT_FORMULA_CONFIG);
  const [automationEnabled, setAutomationEnabled] = useState(true);

  const effectiveAutomationCard = automationEnabled ? automationCard : makeZeroAutomationCard(automationCard);

  const result = useMemo(
    () => computeBusinessResult(manualCard, effectiveAutomationCard, revenueCard, formulaConfig),
    [manualCard, effectiveAutomationCard, revenueCard, formulaConfig]
  );

  return (
    <div className="flex flex-col gap-6">

      {/* ── Automation toggle ───────────────────────────────────────────── */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setAutomationEnabled((v) => !v)}
          className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors hover:opacity-80 cursor-pointer"
          style={{
            background: automationEnabled ? "var(--accent-light)" : "var(--danger-light)",
            borderColor: automationEnabled ? "var(--accent)" : "var(--danger)",
            color: automationEnabled ? "var(--accent)" : "var(--danger)",
          }}
        >
          {automationEnabled
            ? <Zap size={13} strokeWidth={2.5} />
            : <ZapOff size={13} strokeWidth={2.5} />}
          {automationEnabled ? "Automation card enabled" : "Automation card disabled"}
        </button>
      </div>

      {/* ── 3 Costing cards ─────────────────────────────────────────────── */}
      <div className={`grid grid-cols-1 gap-4 ${automationEnabled ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        <CostingCard
          data={manualCard}
          onChange={setManualCard}
          icon={Clock}
          accentColor="var(--danger)"
          accentLight="var(--danger-light)"
        />
        {automationEnabled && (
          <CostingCard
            data={automationCard}
            onChange={setAutomationCard}
            icon={Zap}
            accentColor="var(--accent)"
            accentLight="var(--accent-light)"
          />
        )}
        <CostingCard
          data={revenueCard}
          onChange={setRevenueCard}
          icon={TrendingUp}
          accentColor="var(--text-secondary)"
          accentLight="var(--bg-muted)"
        />
      </div>

      {/* ── Formula configuration accordion ─────────────────────────────── */}
      <BusinessFormulaConfigPanel
        config={formulaConfig}
        onChange={setFormulaConfig}
        result={result}
      />

      {/* ── Final summary ────────────────────────────────────────────────── */}
      <BusinessSummary result={result} currency={currency} />

      {/* ── Export buttons ───────────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-3 rounded-2xl border p-4"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <ExportButtons
          manualCard={manualCard}
          automationCard={effectiveAutomationCard}
          revenueCard={revenueCard}
          result={result}
          formulaConfig={formulaConfig}
          currency={currency}
        />
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Excel exports a 4-sheet workbook (Summary + one sheet per card).
          PDF exports a structured A4 report with all tables and formulas used.
        </p>
      </div>

    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Clock, Zap, TrendingUp, CalendarDays, Sparkles } from "lucide-react";

import {
  calculateROI,
  formatPercent,
  ROIInputs,
  AdvancedConfig,
  DEFAULT_ADVANCED_CONFIG,
} from "../lib/roi-calculator";
import { formatAmount } from "../lib/currencies";
import { useCurrency } from "./ThemeProvider";

import { SliderInput } from "./SliderInput";
import { ResultCard } from "./ResultCard";
import { AdvancedConfigPanel } from "./AdvancedConfig";
import { NegativeROIBanner } from "./NegativeROIBanner";
import { SmartNote } from "./SmartNote";
import { SummaryCards } from "./SummaryCards";
import { SimpleExportButtons } from "./SimpleExportButtons";

const DEFAULTS: ROIInputs = {
  hourlyRate: 75,
  manualHoursPerWeek: 10,
  automationCostPerMonth: 50,
};

export function ROICalculator() {
  const { currency } = useCurrency();
  const [inputs, setInputs] = useState<ROIInputs>(DEFAULTS);
  const [advancedConfig, setAdvancedConfig] = useState<AdvancedConfig>(DEFAULT_ADVANCED_CONFIG);

  const result = useMemo(() => calculateROI(inputs, advancedConfig), [inputs, advancedConfig]);

  const set = (key: keyof ROIInputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const fmt = (n: number) => formatAmount(n, currency);

  const weeksPerYear = advancedConfig.weeksPerYear ?? DEFAULT_ADVANCED_CONFIG.weeksPerYear;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Inputs ───────────────────────────────────────────────────────── */}
      <motion.section
        layout
        className="flex flex-col gap-6 rounded-2xl border p-5 sm:p-6"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold" style={{ color: "var(--text-secondary)" }}>
            Your Numbers
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Drag sliders or click the value badge to type a custom number.
          </p>
        </div>

        <div className="flex flex-col gap-7">
          <SliderInput
            label="Hourly Rate"
            icon={DollarSign}
            value={inputs.hourlyRate}
            min={5}
            max={5000}
            step={5}
            onChange={set("hourlyRate")}
            formatDisplay={(v) => fmt(v)}
            hint="Your billable or opportunity-cost rate per hour."
          />
          <SliderInput
            label="Manual Hours / Week"
            icon={Clock}
            value={inputs.manualHoursPerWeek}
            min={0}
            max={80}
            step={0.5}
            onChange={set("manualHoursPerWeek")}
            formatDisplay={(v) => `${v} hr${v === 1 ? "" : "s"}`}
            hint="Time spent on repetitive tasks that could be automated."
          />
          <SliderInput
            label="Automation Cost / Month"
            icon={Zap}
            value={inputs.automationCostPerMonth}
            min={0}
            max={10000}
            step={5}
            onChange={set("automationCostPerMonth")}
            formatDisplay={(v) => fmt(v)}
            hint="Subscription cost for n8n, Make.com, Zapier, etc."
          />
        </div>
      </motion.section>

      {/* ── Advanced config ───────────────────────────────────────────────── */}
      <AdvancedConfigPanel config={advancedConfig} onChange={setAdvancedConfig} />

      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold" style={{ color: "var(--text-secondary)" }}>
          Cost Breakdown
        </h2>
        <SummaryCards
          result={result}
          currency={currency}
          manualHoursPerWeek={inputs.manualHoursPerWeek}
          weeksPerYear={weeksPerYear}
        />
      </div>

      {/* ── Smart recommendation ──────────────────────────────────────────── */}
      <SmartNote result={result} currency={currency} />

      {/* ── Negative ROI banner ───────────────────────────────────────────── */}
      <AnimatePresence>
        {result.isNegativeROI && (
          <NegativeROIBanner
            breakEvenWeeks={result.breakEvenWeeks}
            monthlyCostOverrun={result.monthlySavings}
            currency={currency}
          />
        )}
      </AnimatePresence>

      {/* ── 4 Result cards ────────────────────────────────────────────────── */}
      <motion.section layout className="flex flex-col gap-3">
        <h2 className="text-base font-semibold" style={{ color: "var(--text-secondary)" }}>
          ROI Summary
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ResultCard
            label="Monthly Manual Cost"
            value={result.monthlyManualCost}
            format={fmt}
            icon={Clock}
            variant="default"
            subtext="What you spend in time every month"
            index={0}
          />
          <ResultCard
            label="Monthly Savings"
            value={result.monthlySavings}
            format={fmt}
            icon={TrendingUp}
            variant={result.isNegativeROI ? "danger" : "highlight"}
            subtext={result.isNegativeROI ? "Automation costs more than it saves" : "Net saved after automation cost"}
            index={1}
          />
          <ResultCard
            label="Yearly Savings"
            value={result.yearlySavings}
            format={fmt}
            icon={CalendarDays}
            variant={result.isNegativeROI ? "warning" : "default"}
            subtext="Projected over 12 months"
            index={2}
          />
          <ResultCard
            label="ROI"
            value={result.roiPercent}
            format={(n) => (n >= 9999 ? ">9,999%" : formatPercent(n, 1))}
            icon={Sparkles}
            variant={result.isNegativeROI ? "danger" : "default"}
            subtext="Return on automation spend"
            index={3}
          />
        </div>
      </motion.section>

      {/* ── Export ────────────────────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-3 rounded-2xl border p-4"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <SimpleExportButtons
          inputs={inputs}
          advancedConfig={advancedConfig}
          result={result}
          currency={currency}
        />
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Excel exports inputs and all results in one sheet. PDF exports a structured A4 report.
        </p>
      </div>
    </div>
  );
}

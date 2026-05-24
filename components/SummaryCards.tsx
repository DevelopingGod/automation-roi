"use client";

import { motion } from "framer-motion";
import { Clock, Zap, DollarSign, TimerReset } from "lucide-react";
import { ROIResult } from "../lib/roi-calculator";
import { Currency, formatAmount } from "../lib/currencies";

interface SummaryCardsProps {
  result: ROIResult;
  currency: Currency;
  manualHoursPerWeek: number;
  weeksPerYear: number;
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="font-semibold tabular-nums" style={{ color: "var(--text-secondary)" }}>
        {value}
      </span>
    </div>
  );
}

export function SummaryCards({ result, currency, manualHoursPerWeek, weeksPerYear }: SummaryCardsProps) {
  const yearlyHours = manualHoursPerWeek * weeksPerYear;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Manual Labor Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 rounded-2xl border p-5"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "var(--danger-light)", color: "var(--danger)" }}
          >
            <Clock size={17} strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
              Manual Labor Cost
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              What your time actually costs
            </p>
          </div>
        </div>

        <div
          className="rounded-xl px-4 py-3 text-center"
          style={{ background: "var(--danger-light)" }}
        >
          <p className="text-2xl font-extrabold tabular-nums" style={{ color: "var(--danger)" }}>
            {formatAmount(result.monthlyManualCost, currency)}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            per month
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Line label="Per week"  value={formatAmount(result.weeklyManualCost, currency)} />
          <Line label="Per year"  value={formatAmount(result.yearlyManualCost, currency)} />
          <Line label="Hours/year" value={`${yearlyHours.toFixed(0)} hrs`} />
          <Line
            label="Effective rate"
            value={`${formatAmount(result.effectiveHourlyRate, currency)}/hr`}
          />
        </div>
      </motion.div>

      {/* Automation Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.07 }}
        className="flex flex-col gap-4 rounded-2xl border p-5"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            <Zap size={17} strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
              Automation Cost
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              What automation tools cost
            </p>
          </div>
        </div>

        <div
          className="rounded-xl px-4 py-3 text-center"
          style={{ background: "var(--accent-light)" }}
        >
          <p className="text-2xl font-extrabold tabular-nums" style={{ color: "var(--accent)" }}>
            {formatAmount(result.monthlyAutomationCost, currency)}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            per month
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Line label="Per year" value={formatAmount(result.monthlyAutomationCost * 12, currency)} />
          <Line
            label="Cost per hour saved"
            value={
              manualHoursPerWeek > 0
                ? `${formatAmount(result.monthlyAutomationCost / (manualHoursPerWeek * (weeksPerYear / 12)), currency)}/hr`
                : "—"
            }
          />
          <Line
            label="vs. manual cost"
            value={
              result.monthlyManualCost > 0
                ? `${((result.monthlyAutomationCost / result.monthlyManualCost) * 100).toFixed(1)}%`
                : "—"
            }
          />
          <div className="flex items-center justify-between gap-2 text-sm">
            <span style={{ color: "var(--text-muted)" }}>Net monthly</span>
            <span
              className="font-semibold tabular-nums"
              style={{ color: result.isNegativeROI ? "var(--danger)" : "var(--accent)" }}
            >
              {result.isNegativeROI ? "" : "+"}
              {formatAmount(result.monthlySavings, currency)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

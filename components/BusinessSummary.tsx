"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Zap, ShoppingCart,
  Sparkles, ArrowUpRight, ArrowDownRight, Minus, Percent,
} from "lucide-react";
import { BusinessResult } from "../lib/business-calculator";
import { Currency, formatAmount } from "../lib/currencies";

interface Props {
  result: BusinessResult;
  currency: Currency;
}

interface MetricTileProps {
  label: string;
  value: number | null;
  format: (n: number) => string;
  icon: typeof TrendingUp;
  iconBg: string;
  iconColor: string;
  isPositiveBetter?: boolean;
  suffix?: string;
  index?: number;
}

function MetricTile({
  label, value, format, icon: Icon,
  iconBg, iconColor, isPositiveBetter = true, suffix, index = 0,
}: MetricTileProps) {
  const positive = value !== null && value > 0;
  const negative = value !== null && value < 0;
  const textColor = value === null
    ? "var(--text-muted)"
    : isPositiveBetter
      ? positive ? "var(--accent)" : negative ? "var(--danger)" : "var(--text-secondary)"
      : positive ? "var(--danger)" : negative ? "var(--accent)" : "var(--text-secondary)";

  const TrendIcon = value === null ? Minus
    : isPositiveBetter
      ? positive ? ArrowUpRight : negative ? ArrowDownRight : Minus
      : positive ? ArrowDownRight : negative ? ArrowUpRight : Minus;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="flex flex-col gap-3 rounded-2xl border p-4"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: iconBg, color: iconColor }}
        >
          <Icon size={15} strokeWidth={2.5} />
        </span>
        <TrendIcon size={16} strokeWidth={2.5} style={{ color: textColor }} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className="text-xl font-extrabold tabular-nums leading-none"
          style={{ color: textColor }}
        >
          {value === null
            ? "—"
            : `${format(value)}${suffix ?? ""}`}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 col-span-full">
      <div className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
      <span className="text-xs font-semibold uppercase tracking-wider px-2" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <div className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
    </div>
  );
}

function profitMargin(profit: number | null, revenue: number): number | null {
  if (profit === null || revenue === 0) return null;
  return (profit / revenue) * 100;
}

export function BusinessSummary({ result, currency }: Props) {
  const fmt    = (n: number) => formatAmount(n, currency);
  const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

  const manualMargin     = profitMargin(result.manualProfit,     result.revenueTotal);
  const automationMargin = profitMargin(result.automationProfit, result.revenueTotal);
  const marginDelta      = manualMargin !== null && automationMargin !== null
    ? automationMargin - manualMargin : null;

  const hasData =
    result.manualCostTotal > 0 ||
    result.automationCostTotal > 0 ||
    result.revenueTotal > 0;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: "var(--accent)", borderBottom: "1px solid var(--accent-hover)" }}
      >
        <Sparkles size={18} color="#fff" strokeWidth={2.5} />
        <div>
          <p className="text-sm font-bold text-white">Final ROI Summary</p>
          <p className="text-xs text-white/75">
            {hasData ? "Based on your costing inputs" : "Enter values in the cards above to see results"}
          </p>
        </div>
      </div>

      <div className="p-5">
        {!hasData ? (
          <p className="text-center text-sm py-6" style={{ color: "var(--text-muted)" }}>
            Fill in at least one card above to see your summary.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Divider label="Cost Totals" />

            <MetricTile
              label="Manual Cost Total"
              value={result.manualCostTotal}
              format={fmt}
              icon={DollarSign}
              iconBg="var(--danger-light)"
              iconColor="var(--danger)"
              isPositiveBetter={false}
              index={0}
            />
            <MetricTile
              label="Automation Cost Total"
              value={result.automationCostTotal}
              format={fmt}
              icon={Zap}
              iconBg="var(--accent-light)"
              iconColor="var(--accent)"
              isPositiveBetter={false}
              index={1}
            />
            <MetricTile
              label="Revenue / Selling Price"
              value={result.revenueTotal}
              format={fmt}
              icon={ShoppingCart}
              iconBg="var(--bg-muted)"
              iconColor="var(--text-secondary)"
              index={2}
            />
            <MetricTile
              label="Cost Savings (Auto vs Manual)"
              value={result.savings}
              format={fmt}
              icon={TrendingDown}
              iconBg="var(--accent-light)"
              iconColor="var(--accent)"
              index={3}
            />

            <Divider label="Profit Analysis" />

            <MetricTile
              label="Manual Profit"
              value={result.manualProfit}
              format={fmt}
              icon={DollarSign}
              iconBg="var(--danger-light)"
              iconColor="var(--danger)"
              index={4}
            />
            <MetricTile
              label="Automation Profit"
              value={result.automationProfit}
              format={fmt}
              icon={Zap}
              iconBg="var(--accent-light)"
              iconColor="var(--accent)"
              index={5}
            />
            <MetricTile
              label="Profit Delta (Auto − Manual)"
              value={result.profitDelta}
              format={fmt}
              icon={TrendingUp}
              iconBg="var(--bg-muted)"
              iconColor="var(--text-secondary)"
              index={6}
            />
            <MetricTile
              label="ROI on Automation"
              value={result.roi}
              format={fmtPct}
              icon={Sparkles}
              iconBg="var(--accent-light)"
              iconColor="var(--accent)"
              index={7}
            />

            <Divider label="Profit Margins (% of Revenue)" />

            <MetricTile
              label="Manual Profit Margin"
              value={manualMargin}
              format={fmtPct}
              icon={Percent}
              iconBg="var(--danger-light)"
              iconColor="var(--danger)"
              index={8}
            />
            <MetricTile
              label="Automation Profit Margin"
              value={automationMargin}
              format={fmtPct}
              icon={Percent}
              iconBg="var(--accent-light)"
              iconColor="var(--accent)"
              index={9}
            />
            <MetricTile
              label="Margin Improvement"
              value={marginDelta}
              format={fmtPct}
              icon={TrendingUp}
              iconBg="var(--bg-muted)"
              iconColor="var(--text-secondary)"
              index={10}
            />
          </div>
        )}
      </div>

      {/* Verdict strip */}
      {hasData && result.roi !== null && (
        <div
          className="px-5 py-3 text-sm font-medium"
          style={{
            borderTop: "1px solid var(--border)",
            background: result.roi > 0 ? "var(--accent-light)" : "var(--danger-light)",
            color: result.roi > 0 ? "var(--accent)" : "var(--danger)",
          }}
        >
          {result.roi > 500
            ? "Exceptional ROI — automation is a clear financial winner."
            : result.roi > 100
            ? "Strong ROI — automating significantly improves your profit margin."
            : result.roi > 0
            ? "Positive ROI — automation is profitable, though margins are slim."
            : result.roi === 0
            ? "Break-even — automation costs exactly what it saves."
            : "Negative ROI — at current figures, manual operation is more profitable."}
        </div>
      )}
    </div>
  );
}

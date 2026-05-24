"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, AlertTriangle, XCircle, Zap } from "lucide-react";
import { ROIResult } from "../lib/roi-calculator";
import { Currency, formatAmount } from "../lib/currencies";

interface SmartNoteProps {
  result: ROIResult;
  currency: Currency;
}

interface Verdict {
  icon: typeof CheckCircle2;
  title: string;
  detail: string;
  bg: string;
  border: string;
  iconBg: string;
  textColor: string;
}

function getVerdict(result: ROIResult, currency: Currency): Verdict {
  const { roiPercent, isNegativeROI, monthlySavings, yearlySavings } = result;

  if (isNegativeROI) {
    return {
      icon: XCircle,
      title: "Automation is not worth it yet.",
      detail: `At current rates, manual work costs ${formatAmount(Math.abs(monthlySavings), currency)} less per month than automation. Reduce your automation plan or increase your manual workload before switching.`,
      bg: "var(--danger-light)",
      border: "var(--danger)",
      iconBg: "var(--danger)",
      textColor: "var(--danger)",
    };
  }

  if (roiPercent < 30) {
    return {
      icon: AlertTriangle,
      title: "Marginal ROI — proceed with caution.",
      detail: `You save ${formatAmount(monthlySavings, currency)}/month, but the margin is slim. Automation may still reduce errors and free mental bandwidth even if the pure financial return is modest.`,
      bg: "var(--warning-light)",
      border: "var(--warning)",
      iconBg: "var(--warning)",
      textColor: "var(--warning)",
    };
  }

  if (roiPercent < 150) {
    return {
      icon: TrendingUp,
      title: "Positive ROI — automation is worthwhile.",
      detail: `You save ${formatAmount(monthlySavings, currency)}/month (${formatAmount(yearlySavings, currency)}/year). Automation pays for itself and gives you time back for high-value work.`,
      bg: "var(--bg-surface)",
      border: "var(--border)",
      iconBg: "var(--accent)",
      textColor: "var(--text-secondary)",
    };
  }

  if (roiPercent < 500) {
    return {
      icon: CheckCircle2,
      title: "Strong ROI — automate as soon as possible.",
      detail: `You save ${formatAmount(yearlySavings, currency)} per year. Every month without automation is ${formatAmount(monthlySavings, currency)} left on the table.`,
      bg: "var(--accent-light)",
      border: "var(--accent)",
      iconBg: "var(--accent)",
      textColor: "var(--text-secondary)",
    };
  }

  return {
    icon: Zap,
    title: "Exceptional ROI — this is a no-brainer.",
    detail: `Your automation saves ${roiPercent >= 9999 ? "over 9,999%" : roiPercent.toFixed(0) + "%"} of its cost. At ${formatAmount(yearlySavings, currency)}/year in savings, delaying automation is costing you significantly.`,
    bg: "var(--accent)",
    border: "var(--accent-hover)",
    iconBg: "rgba(255,255,255,0.2)",
    textColor: "#fff",
  };
}

export function SmartNote({ result, currency }: SmartNoteProps) {
  const verdict = getVerdict(result, currency);
  const Icon = verdict.icon;
  const isHighlight = verdict.bg === "var(--accent)";

  return (
    <motion.div
      layout
      key={`verdict-${result.isNegativeROI}-${Math.round(result.roiPercent / 100)}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 rounded-2xl border p-4"
      style={{ background: verdict.bg, borderColor: verdict.border }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: verdict.iconBg }}
      >
        <Icon size={16} color={isHighlight ? "#fff" : "#fff"} strokeWidth={2.5} />
      </span>
      <div className="flex flex-col gap-0.5">
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: isHighlight ? "#fff" : verdict.textColor }}
        >
          {verdict.title}
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: isHighlight ? "rgba(255,255,255,0.85)" : "var(--text-muted)" }}
        >
          {verdict.detail}
        </p>
      </div>
    </motion.div>
  );
}

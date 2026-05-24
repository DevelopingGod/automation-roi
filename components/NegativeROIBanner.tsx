"use client";

import { motion } from "framer-motion";
import { TrendingDown, Clock } from "lucide-react";
import { formatWeeks } from "../lib/roi-calculator";
import { Currency, formatAmount } from "../lib/currencies";

interface NegativeROIBannerProps {
  breakEvenWeeks: number | null;
  monthlyCostOverrun: number;
  currency: Currency;
}

export function NegativeROIBanner({ breakEvenWeeks, monthlyCostOverrun, currency }: NegativeROIBannerProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-2 rounded-2xl border p-4 sm:flex-row sm:items-start sm:gap-3"
      style={{
        background: "var(--warning-light)",
        borderColor: "var(--warning)",
      }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--warning)", color: "#ffffff" }}
      >
        <TrendingDown size={15} strokeWidth={2.5} />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold" style={{ color: "var(--warning)" }}>
          Automation costs more than it saves right now.
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          You&apos;re overspending by {formatAmount(Math.abs(monthlyCostOverrun), currency)}/month on automation.
          {breakEvenWeeks !== null && (
            <span className="flex items-center gap-1 mt-1">
              <Clock size={11} />
              To break even, manual costs would need to rise so automation pays off in{" "}
              <strong>{formatWeeks(breakEvenWeeks)}</strong>.
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
}

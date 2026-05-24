"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";

interface ResultCardProps {
  label: string;
  value: number;
  format: (n: number) => string;
  icon: LucideIcon;
  variant?: "default" | "highlight" | "danger" | "warning";
  subtext?: string;
  index?: number;
}

const variantStyles: Record<NonNullable<ResultCardProps["variant"]>, React.CSSProperties> = {
  default: {
    background: "var(--bg-surface)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
  },
  highlight: {
    background: "var(--accent)",
    borderColor: "var(--accent-hover)",
    color: "#ffffff",
  },
  danger: {
    background: "var(--danger-light)",
    borderColor: "var(--danger)",
    color: "var(--danger)",
  },
  warning: {
    background: "var(--warning-light)",
    borderColor: "var(--warning)",
    color: "var(--warning)",
  },
};

export function ResultCard({
  label,
  value,
  format,
  icon: Icon,
  variant = "default",
  subtext,
  index = 0,
}: ResultCardProps) {
  const styles = variantStyles[variant];
  const isHighlight = variant === "highlight";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      className="flex flex-col gap-2 rounded-2xl border p-5 shadow-sm"
      style={styles}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            background: isHighlight
              ? "rgba(255,255,255,0.2)"
              : "var(--accent-light)",
            color: isHighlight ? "#ffffff" : "var(--accent)",
          }}
        >
          <Icon size={15} strokeWidth={2.5} />
        </span>
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: isHighlight ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}
        >
          {label}
        </span>
      </div>

      <AnimatedNumber
        value={value}
        format={format}
        className="text-2xl font-bold tabular-nums leading-none"
      />

      {subtext && (
        <p
          className="text-xs"
          style={{ color: isHighlight ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}
        >
          {subtext}
        </p>
      )}
    </motion.div>
  );
}

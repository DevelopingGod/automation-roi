"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, BarChart3 } from "lucide-react";

export type AppMode = "simple" | "business";

interface ModeToggleProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

const MODES: { key: AppMode; label: string; icon: typeof SlidersHorizontal; desc: string }[] = [
  {
    key: "simple",
    label: "Simple Mode",
    icon: SlidersHorizontal,
    desc: "Quick ROI estimate with sliders",
  },
  {
    key: "business",
    label: "Business Deep Dive",
    icon: BarChart3,
    desc: "Detailed costing, profit & ROI analysis",
  },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      {MODES.map(({ key, label, icon: Icon, desc }) => {
        const active = mode === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-200 cursor-pointer overflow-hidden"
            style={{
              background: active ? "var(--accent)" : "var(--bg-surface)",
              borderColor: active ? "var(--accent-hover)" : "var(--border)",
            }}
          >
            {active && (
              <motion.div
                layoutId="mode-highlight"
                className="absolute inset-0 rounded-2xl"
                style={{ background: "var(--accent)" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: active ? "rgba(255,255,255,0.2)" : "var(--accent-light)",
                color: active ? "#fff" : "var(--accent)",
              }}
            >
              <Icon size={15} strokeWidth={2.5} />
            </span>
            <div className="relative flex flex-col">
              <span
                className="text-sm font-bold leading-tight"
                style={{ color: active ? "#fff" : "var(--text-secondary)" }}
              >
                {label}
              </span>
              <span
                className="text-xs leading-tight"
                style={{ color: active ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}
              >
                {desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

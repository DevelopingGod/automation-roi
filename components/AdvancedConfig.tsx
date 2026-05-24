"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Settings2, AlertTriangle } from "lucide-react";
import {
  AdvancedConfig as AdvancedConfigType,
  DEFAULT_ADVANCED_CONFIG,
  evaluateSafeExpression,
} from "../lib/roi-calculator";

interface AdvancedConfigPanelProps {
  config: AdvancedConfigType;
  onChange: (config: AdvancedConfigType) => void;
}

interface FieldProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

function Field({ label, description, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {description}
        </span>
      </div>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border px-3 py-2 text-sm font-mono outline-none transition-colors duration-150 focus:ring-2";

function inputStyle(isError = false): React.CSSProperties {
  return {
    background: "var(--bg-base)",
    borderColor: isError ? "var(--danger)" : "var(--border)",
    color: "var(--text-primary)",
  };
}

export function AdvancedConfigPanel({ config, onChange }: AdvancedConfigPanelProps) {
  const [open, setOpen] = useState(false);
  const [formulaError, setFormulaError] = useState(false);

  const merged = { ...DEFAULT_ADVANCED_CONFIG, ...config };

  const update = (patch: Partial<AdvancedConfigType>) =>
    onChange({ ...config, ...patch });

  const handleFormulaChange = (val: string) => {
    if (val === "") {
      setFormulaError(false);
      update({ customWeeklyFormula: "" });
      return;
    }
    const result = evaluateSafeExpression(val);
    setFormulaError(result === null);
    update({ customWeeklyFormula: val });
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-150 hover:opacity-80 cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            <Settings2 size={14} strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
            Advanced Configuration
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="grid grid-cols-1 gap-5 px-5 pb-5 sm:grid-cols-2"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="pt-4">
                <Field
                  label="Weeks per Year"
                  description="Default: 52. Reduce for vacation time."
                >
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={merged.weeksPerYear}
                    onChange={(e) =>
                      update({ weeksPerYear: Math.max(1, Math.min(52, Number(e.target.value))) })
                    }
                    className={inputClass}
                    style={inputStyle()}
                  />
                </Field>
              </div>

              <div className="pt-4">
                <Field
                  label="Overhead Multiplier"
                  description="e.g. 1.3 adds 30% for benefits, tools, taxes."
                >
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.05}
                    value={merged.overheadMultiplier}
                    onChange={(e) =>
                      update({ overheadMultiplier: Math.max(1, Number(e.target.value)) })
                    }
                    className={inputClass}
                    style={inputStyle()}
                  />
                </Field>
              </div>

              <div>
                <Field
                  label="Hours Recovered Fraction"
                  description="0–1. Use 0.8 if automation saves 80% of manual time."
                >
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={merged.hoursRecoveredFraction}
                    onChange={(e) =>
                      update({
                        hoursRecoveredFraction: Math.max(0, Math.min(1, Number(e.target.value))),
                      })
                    }
                    className={inputClass}
                    style={inputStyle()}
                  />
                </Field>
              </div>

              <div>
                <Field
                  label="Custom Weekly Cost Formula"
                  description="Override with arithmetic, e.g. 75 * 10 + 50"
                >
                  <input
                    type="text"
                    placeholder="e.g. 75 * 10 + 50"
                    value={merged.customWeeklyFormula}
                    onChange={(e) => handleFormulaChange(e.target.value)}
                    className={inputClass}
                    style={inputStyle(formulaError)}
                    spellCheck={false}
                  />
                  {formulaError && (
                    <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--danger)" }}>
                      <AlertTriangle size={11} />
                      Only numbers and + - * / ( ) are allowed.
                    </p>
                  )}
                </Field>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

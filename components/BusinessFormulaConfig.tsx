"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FunctionSquare, CheckCircle2, AlertCircle } from "lucide-react";
import {
  BusinessFormulaConfig,
  DEFAULT_FORMULA_CONFIG,
  evaluateWithVariables,
  BusinessResult,
} from "../lib/business-calculator";

interface Props {
  config: BusinessFormulaConfig;
  onChange: (config: BusinessFormulaConfig) => void;
  result: BusinessResult;
}

interface FormulaFieldProps {
  label: string;
  fieldKey: keyof BusinessFormulaConfig;
  value: string;
  hint: string;
  availableVars: string[];
  testVars: Record<string, number>;
  onChange: (val: string) => void;
  onReset: () => void;
}

function FormulaField({
  label,
  value,
  hint,
  availableVars,
  testVars,
  onChange,
  onReset,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fieldKey: _fieldKey,
}: FormulaFieldProps) {
  const computed = evaluateWithVariables(value, testVars);
  const isValid = computed !== null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
        <button
          onClick={onReset}
          className="text-xs transition-opacity hover:opacity-70 cursor-pointer"
          style={{ color: "var(--text-muted)" }}
        >
          Reset
        </button>
      </div>

      <div className="relative flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--accent-light)", color: "var(--accent)" }}
        >
          <FunctionSquare size={13} strokeWidth={2} />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="flex-1 rounded-xl border px-3 py-2 font-mono text-sm outline-none transition-colors"
          style={{
            background: "var(--bg-base)",
            borderColor: isValid ? "var(--border)" : "var(--danger)",
            color: "var(--text-primary)",
          }}
        />
        {isValid ? (
          <CheckCircle2 size={15} strokeWidth={2.5} style={{ color: "var(--accent)", flexShrink: 0 }} />
        ) : (
          <AlertCircle size={15} strokeWidth={2.5} style={{ color: "var(--danger)", flexShrink: 0 }} />
        )}
      </div>

      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{hint}</span>
        {isValid && (
          <span className="font-medium tabular-nums" style={{ color: "var(--accent)" }}>
            = {computed?.toFixed(2)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {availableVars.map((v) => (
          <span
            key={v}
            className="rounded px-1.5 py-0.5 font-mono text-xs"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

const TEST_VARS = {
  manual_cost: 5000,
  automation_cost: 200,
  revenue: 8000,
  manual_profit: 3000,
  automation_profit: 7800,
  savings: 4800,
};

export function BusinessFormulaConfigPanel({ config, onChange, result }: Props) {
  const [open, setOpen] = useState(false);

  const update = (key: keyof BusinessFormulaConfig) => (val: string) =>
    onChange({ ...config, [key]: val });

  const reset = (key: keyof BusinessFormulaConfig) => () =>
    onChange({ ...config, [key]: DEFAULT_FORMULA_CONFIG[key] });

  const FIELDS: {
    label: string;
    fieldKey: keyof BusinessFormulaConfig;
    hint: string;
    availableVars: string[];
    testVars: Record<string, number>;
  }[] = [
    {
      label: "Manual Profit Formula",
      fieldKey: "manualProfit",
      hint: "Profit when work is done manually.",
      availableVars: ["revenue", "manual_cost", "automation_cost"],
      testVars: TEST_VARS,
    },
    {
      label: "Automation Profit Formula",
      fieldKey: "automationProfit",
      hint: "Profit when work is automated.",
      availableVars: ["revenue", "manual_cost", "automation_cost"],
      testVars: TEST_VARS,
    },
    {
      label: "Savings Formula",
      fieldKey: "savings",
      hint: "How much automation saves vs. manual.",
      availableVars: ["manual_cost", "automation_cost", "manual_profit", "automation_profit"],
      testVars: TEST_VARS,
    },
    {
      label: "ROI Formula",
      fieldKey: "roi",
      hint: "Return on automation investment (%).",
      availableVars: ["savings", "automation_cost", "manual_cost", "revenue"],
      testVars: TEST_VARS,
    },
  ];

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:opacity-80 cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            <FunctionSquare size={14} strokeWidth={2.5} />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Configure Formulas
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Edit how profit, savings and ROI are calculated
            </span>
          </div>
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
            key="formula-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {FIELDS.map((f) => (
                <FormulaField
                  key={f.fieldKey}
                  {...f}
                  value={config[f.fieldKey]}
                  onChange={update(f.fieldKey)}
                  onReset={reset(f.fieldKey)}
                />
              ))}
            </div>

            <div
              className="px-5 pb-5 text-xs leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              <strong style={{ color: "var(--text-secondary)" }}>Available variables: </strong>
              <code>manual_cost</code> · <code>automation_cost</code> · <code>revenue</code> ·{" "}
              <code>savings</code> · <code>manual_profit</code> · <code>automation_profit</code>.
              {" "}Use any arithmetic operators: <code>+ - * / ( )</code>.
              Formulas are tested against sample values shown above each field.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, LucideIcon } from "lucide-react";
import { CostingCardData, LineItem, evaluateLineItem, isFormulaExpression, computeCardTotal } from "../lib/business-calculator";
import { formatAmount } from "../lib/currencies";
import { useCurrency } from "./ThemeProvider";

interface CostingCardProps {
  data: CostingCardData;
  onChange: (data: CostingCardData) => void;
  accentColor: string;   // e.g. "var(--danger)"
  accentLight: string;   // e.g. "var(--danger-light)"
  icon: LucideIcon;
  readonlyTitle?: boolean;
}

const uid = () => Math.random().toString(36).slice(2, 9);

function LineItemRow({
  item,
  onUpdate,
  onRemove,
  accentColor,
}: {
  item: LineItem;
  onUpdate: (item: LineItem) => void;
  onRemove: () => void;
  accentColor: string;
}) {
  const { currency } = useCurrency();
  const computed = evaluateLineItem(item.formula);
  const isExpr = isFormulaExpression(item.formula);

  const inputBase =
    "w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none transition-colors duration-150 focus:ring-1";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2"
    >
      {/* Label */}
      <input
        type="text"
        value={item.label}
        onChange={(e) => onUpdate({ ...item, label: e.target.value })}
        placeholder="Item label"
        className={`${inputBase} flex-1 min-w-0`}
        style={{
          background: "var(--bg-base)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
      />

      {/* Formula / Amount */}
      <div className="flex flex-col gap-0.5 w-36 shrink-0">
        <input
          type="text"
          value={item.formula}
          onChange={(e) => onUpdate({ ...item, formula: e.target.value })}
          placeholder="0"
          className={`${inputBase} font-mono text-right`}
          style={{
            background: "var(--bg-base)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          title="Enter a number or arithmetic formula e.g. 50 * 40 * 4.33"
        />
        {isExpr && (
          <span className="text-right text-xs font-medium tabular-nums" style={{ color: accentColor }}>
            = {formatAmount(computed, currency)}
          </span>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 hover:opacity-80 cursor-pointer"
        style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}
        aria-label="Remove item"
        title="Remove item"
      >
        <Trash2 size={13} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

export function CostingCard({
  data,
  onChange,
  accentColor,
  accentLight,
  icon: Icon,
}: CostingCardProps) {
  const { currency } = useCurrency();
  const total = computeCardTotal(data);
  const titleRef = useRef<HTMLInputElement>(null);

  const updateItem = (id: string, updated: LineItem) =>
    onChange({ ...data, items: data.items.map((it) => (it.id === id ? updated : it)) });

  const removeItem = (id: string) =>
    onChange({ ...data, items: data.items.filter((it) => it.id !== id) });

  const addItem = () =>
    onChange({
      ...data,
      items: [...data.items, { id: uid(), label: "New Item", formula: "0" }],
    });

  return (
    <motion.div
      layout
      className="flex flex-col gap-4 rounded-2xl border overflow-hidden"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-3 px-4 pt-4"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: accentLight, color: accentColor }}
        >
          <Icon size={17} strokeWidth={2.5} />
        </span>
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          <input
            ref={titleRef}
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="flex-1 min-w-0 rounded-lg border-0 bg-transparent text-sm font-bold outline-none px-1 py-0.5 hover:bg-opacity-50 focus:ring-1 focus:rounded-lg transition-all"
            style={{ color: "var(--text-secondary)" }}
            title="Click to rename card"
          />
          <Pencil
            size={11}
            strokeWidth={2.5}
            className="shrink-0 cursor-pointer opacity-30 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
            onClick={() => titleRef.current?.focus()}
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 px-4">
        <span className="flex-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Item
        </span>
        <span className="w-36 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Amount / Formula
        </span>
        <span className="w-7" />
      </div>

      {/* Line items */}
      <div className="flex flex-col gap-2.5 px-4">
        <AnimatePresence initial={false}>
          {data.items.map((item) => (
            <LineItemRow
              key={item.id}
              item={item}
              onUpdate={(updated) => updateItem(item.id, updated)}
              onRemove={() => removeItem(item.id)}
              accentColor={accentColor}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer: add button + total */}
      <div
        className="flex items-center justify-between gap-2 px-4 pb-4 pt-2 mt-auto"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150 hover:opacity-80 cursor-pointer"
          style={{ background: accentLight, color: accentColor }}
        >
          <Plus size={13} strokeWidth={2.5} />
          Add item
        </button>

        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Total
          </span>
          <span
            className="text-lg font-extrabold tabular-nums leading-tight"
            style={{ color: accentColor }}
          >
            {formatAmount(total, currency)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

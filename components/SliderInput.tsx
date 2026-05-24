"use client";

import { useState, useRef } from "react";
import { LucideIcon, Pencil, Check } from "lucide-react";

interface SliderInputProps {
  label: string;
  icon: LucideIcon;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatDisplay: (value: number) => string;
  hint?: string;
}

export function SliderInput({
  label,
  icon: Icon,
  value,
  min,
  max,
  step,
  onChange,
  formatDisplay,
  hint,
}: SliderInputProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const commitEdit = () => {
    const parsed = parseFloat(draft.replace(/[^0-9.-]/g, ""));
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, parsed);
      const snapped = Math.round(clamped / step) * step;
      onChange(snapped);
    }
    setEditing(false);
  };

  const startEdit = () => {
    setDraft(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 10);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            <Icon size={14} strokeWidth={2.5} />
          </span>
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {label}
          </label>
        </div>

        {/* Editable value badge */}
        {editing ? (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              type="number"
              value={draft}
              min={min}
              step={step}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-24 rounded-md border px-2 py-0.5 text-sm font-semibold tabular-nums outline-none"
              style={{
                background: "var(--bg-base)",
                borderColor: "var(--accent)",
                color: "var(--accent)",
              }}
            />
            <button
              onClick={commitEdit}
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: "var(--accent)", color: "#fff" }}
              aria-label="Confirm value"
            >
              <Check size={12} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="group flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-sm font-semibold tabular-nums transition-opacity hover:opacity-75 cursor-pointer"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
            aria-label={`Edit ${label} value manually`}
            title="Click to type a value"
          >
            {formatDisplay(value)}
            <Pencil
              size={10}
              strokeWidth={2.5}
              className="opacity-0 group-hover:opacity-60 transition-opacity"
            />
          </button>
        )}
      </div>

      {/* Slider — gradient fill via inline background, no overlay div */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          background: `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`,
        }}
        className="w-full"
      />

      {hint && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

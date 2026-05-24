"use client";

import { TextSize, useTextSize } from "./ThemeProvider";

const SIZES: { key: TextSize; label: string }[] = [
  { key: "small",   label: "S" },
  { key: "regular", label: "M" },
  { key: "large",   label: "L" },
];

export function TextSizeSelector() {
  const { textSize, setTextSize } = useTextSize();

  return (
    <div
      className="flex items-center rounded-lg border overflow-hidden"
      style={{ borderColor: "var(--border)" }}
      role="group"
      aria-label="Text size"
    >
      {SIZES.map(({ key, label }) => {
        const active = textSize === key;
        return (
          <button
            key={key}
            onClick={() => setTextSize(key)}
            aria-pressed={active}
            aria-label={`Text size ${key}`}
            className="px-2.5 py-1.5 text-xs font-bold transition-colors duration-150 cursor-pointer"
            style={{
              background: active ? "var(--accent)" : "var(--bg-surface)",
              color: active ? "#fff" : "var(--text-muted)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

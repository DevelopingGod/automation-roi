"use client";

import { CURRENCIES } from "../lib/currencies";
import { useCurrency } from "./ThemeProvider";

export function CurrencySelector() {
  const { currency, setCurrencyByCode } = useCurrency();

  return (
    <select
      value={currency.code}
      onChange={(e) => setCurrencyByCode(e.target.value)}
      aria-label="Select currency"
      className="rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none transition-colors duration-150 cursor-pointer"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
        color: "var(--accent)",
      }}
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  );
}

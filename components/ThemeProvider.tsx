"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Currency, DEFAULT_CURRENCY, getCurrency } from "../lib/currencies";

type Theme = "light" | "dark";
export type TextSize = "small" | "regular" | "large";

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  currency: Currency;
  setCurrencyByCode: (code: string) => void;
}

const AppContext = createContext<AppContextValue>({
  theme: "light",
  toggleTheme: () => {},
  textSize: "regular",
  setTextSize: () => {},
  currency: DEFAULT_CURRENCY,
  setCurrencyByCode: () => {},
});

const TEXT_SIZE_SCALE: Record<TextSize, string> = {
  small: "13px",
  regular: "16px",
  large: "19px",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [textSize, setTextSizeState] = useState<TextSize>("regular");
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme ?? (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    const storedSize = localStorage.getItem("textSize") as TextSize | null;
    if (storedSize && storedSize in TEXT_SIZE_SCALE) {
      setTextSizeState(storedSize);
      document.documentElement.style.fontSize = TEXT_SIZE_SCALE[storedSize];
    }

    const storedCurrency = localStorage.getItem("currency");
    if (storedCurrency) {
      setCurrencyState(getCurrency(storedCurrency));
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem("textSize", size);
    document.documentElement.style.fontSize = TEXT_SIZE_SCALE[size];
  };

  const setCurrencyByCode = (code: string) => {
    const c = getCurrency(code);
    setCurrencyState(c);
    localStorage.setItem("currency", code);
  };

  return (
    <AppContext.Provider
      value={{ theme, toggleTheme, textSize, setTextSize, currency, setCurrencyByCode }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(AppContext);
  return { theme: ctx.theme, toggle: ctx.toggleTheme };
}

export function useTextSize() {
  const ctx = useContext(AppContext);
  return { textSize: ctx.textSize, setTextSize: ctx.setTextSize };
}

export function useCurrency() {
  const ctx = useContext(AppContext);
  return { currency: ctx.currency, setCurrencyByCode: ctx.setCurrencyByCode };
}

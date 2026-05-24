export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar",          symbol: "$",   locale: "en-US", decimals: 0 },
  { code: "EUR", name: "Euro",               symbol: "€",   locale: "de-DE", decimals: 0 },
  { code: "INR", name: "Indian Rupee",       symbol: "₹",   locale: "en-IN", decimals: 0 },
  { code: "JPY", name: "Japanese Yen",       symbol: "¥",   locale: "ja-JP", decimals: 0 },
  { code: "SGD", name: "Singapore Dollar",   symbol: "S$",  locale: "en-SG", decimals: 0 },
  { code: "GBP", name: "British Pound",      symbol: "£",   locale: "en-GB", decimals: 0 },
  { code: "AUD", name: "Australian Dollar",  symbol: "A$",  locale: "en-AU", decimals: 0 },
  { code: "CAD", name: "Canadian Dollar",    symbol: "C$",  locale: "en-CA", decimals: 0 },
  { code: "CHF", name: "Swiss Franc",        symbol: "Fr",  locale: "de-CH", decimals: 0 },
  { code: "AED", name: "UAE Dirham",         symbol: "AED", locale: "ar-AE", decimals: 0 },
  { code: "MYR", name: "Malaysian Ringgit",  symbol: "RM",  locale: "ms-MY", decimals: 0 },
  { code: "PHP", name: "Philippine Peso",    symbol: "₱",   locale: "fil-PH", decimals: 0 },
];

export const DEFAULT_CURRENCY = CURRENCIES[0];

export function formatAmount(value: number, currency: Currency): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(value);
}

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY;
}

// PDF-safe symbols: jsPDF uses Latin-1 (ISO 8859-1) internally.
// Characters like ₹ (U+20B9), € (U+20AC), ₱ (U+20B1) are outside Latin-1
// and get mangled into garbage bytes. This map uses only ASCII-safe prefixes.
const PDF_SYMBOL: Record<string, string> = {
  USD: "$",   SGD: "S$",  AUD: "A$",  CAD: "C$",
  GBP: "GBP ",EUR: "EUR ",INR: "INR ",JPY: "JPY ",
  CHF: "CHF ",AED: "AED ",MYR: "MYR ",PHP: "PHP ",
};

export function formatAmountPDF(value: number, currency: Currency): string {
  const sym    = PDF_SYMBOL[currency.code] ?? (currency.code + " ");
  const sign   = value < 0 ? "-" : "";
  const absVal = Math.abs(value);
  const num    = absVal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return `${sign}${sym}${num}`;
}

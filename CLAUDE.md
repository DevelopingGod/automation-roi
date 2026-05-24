# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack) at http://localhost:3000
npm run build    # Production build — must pass cleanly before deploy
npm run lint     # ESLint
npx tsc --noEmit # Type-check without emitting (run this before committing)
```

## Architecture

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Framer Motion · Lucide React · TypeScript

**100% client-side** — no API routes, no database. Deployable as a static Vercel site.

### Key files

| Path | Purpose |
|---|---|
| `lib/roi-calculator.ts` | All math logic — pure functions, zero UI dependencies. Edit calculations here. |
| `components/ROICalculator.tsx` | Main stateful shell — owns `inputs` and `advancedConfig` state, calls `calculateROI`, renders all sub-components. |
| `components/SliderInput.tsx` | Reusable range slider with fill-track effect and ARIA attributes. |
| `components/ResultCard.tsx` | Animated result tile — uses `AnimatedNumber` for spring-interpolated counters. |
| `components/AdvancedConfig.tsx` | Collapsible accordion exposing `AdvancedConfig` fields + custom formula input. |
| `components/NegativeROIBanner.tsx` | Warning banner rendered only when `result.isNegativeROI === true`. |
| `components/ThemeProvider.tsx` | Class-based dark mode context — persists to `localStorage`, syncs `dark` class on `<html>`. |
| `app/globals.css` | Design tokens as CSS custom properties (`--accent`, `--bg-surface`, etc.). All components reference these variables directly — no hardcoded colours. |

### Design system

Colours live entirely in CSS variables defined in `globals.css` under `:root` (light) and `.dark` (dark). Components use `style={{ color: "var(--accent)" }}` inline rather than Tailwind colour utilities, so both themes work automatically.

### Advanced config & custom formulas

`AdvancedConfig` in `lib/roi-calculator.ts` accepts `customWeeklyFormula` — a string evaluated by `evaluateSafeExpression()`, which regex-gates input to `[\d\s+\-*/().]+` before using `new Function(...)`. This is the only eval-adjacent code; the regex is the security boundary.

### Adding a new result metric

1. Add the computed field to `ROIResult` in `lib/roi-calculator.ts` and populate it in `calculateROI`.
2. Add a `<ResultCard>` in `components/ROICalculator.tsx` referencing the new field.

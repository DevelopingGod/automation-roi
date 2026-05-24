# 🌿 Automation ROI Calculator

> **Quantify the cost of manual work. Prove the ROI of automation — in 30 seconds.**

A free, beautifully designed financial calculator for freelancers and agencies to answer one critical question: *Is automating my repetitive tasks actually worth paying for?*

Built with Next.js, Tailwind CSS, and Framer Motion. Deployed on Vercel. 100% client-side except for the community star counter.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sankalp-indish/automation-roi)

---

## ✨ Features

### Simple Mode
| Feature | Description |
|---|---|
| **Real-time ROI calculation** | Instant results as you drag sliders — no submit button needed |
| **Smart recommendation** | 5-tier verdict tells you whether to automate or not, in plain language |
| **Cost breakdown cards** | Side-by-side Manual Labor vs. Automation Cost breakdown |
| **Advanced configuration** | Override weeks/year, overhead multiplier, recovery fraction, or enter a custom cost formula |
| **Manual value entry** | Click any slider badge to type a precise number directly |
| **Negative ROI detection** | Warns you when automation costs more than it saves, with break-even analysis |
| **Excel + PDF export** | Download your inputs and all results as a formatted spreadsheet or A4 report |

### Business Deep Dive Mode
| Feature | Description |
|---|---|
| **3-card costing builder** | Editable Manual Costing, AI/Automation Costing, and Revenue cards with line items |
| **Arithmetic formulas in cells** | Enter expressions like `50 * 40 * 4.33` — computed values shown inline |
| **Configurable profit formulas** | Override how profit, savings, and ROI are calculated with named variables |
| **11-metric ROI summary** | Cost totals, profit analysis, and profit margin % tiles in one panel |
| **Automation card toggle** | Disable the automation card to model manual-only scenarios |
| **Excel + PDF export** | Full workbook (Summary + 3 card sheets) or structured A4 PDF with all tables |

### Shared
| Feature | Description |
|---|---|
| **Multi-currency support** | 12 currencies: USD, EUR, INR, JPY, SGD, GBP, AUD, CAD, CHF, AED, MYR, PHP |
| **Community star counter** | Shared live star count powered by Upstash Redis — visible to all visitors |
| **Dark / Light mode** | System-preference aware, persisted to localStorage |
| **Text size controls** | S / M / L — accessibility-friendly font scaling |
| **Animated loading screen** | Polished splash screen on first visit (once per session) |
| **SEO-optimised** | Full OpenGraph, Twitter Card, programmatic OG image, and structured metadata |
| **About page** | Explains what the tool does, how to use it, and its limitations |

---

## 🖥️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with CSS custom property design tokens
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev)
- **Storage:** [Upstash Redis](https://upstash.com) (star counter only)
- **Deployment:** [Vercel](https://vercel.com)

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/automation-roi.git
cd automation-roi
npm install
```

### 2. Configure environment variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

For local development, the star counter will gracefully show `0` without Redis credentials. To enable it locally:

1. Create a free Redis database at [upstash.com](https://upstash.com)
2. Copy the REST URL and token into `.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📦 Deployment on Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial Automation ROI Calculator"
git remote add origin https://github.com/your-username/automation-roi.git
git push -u origin main
```

### Step 2 — Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo
2. Vercel auto-detects Next.js — no build config needed

### Step 3 — Set up the star counter (Upstash Redis)

1. In your Vercel project dashboard → **Storage** tab
2. Click **Create Database** → choose **Upstash Redis**
3. Give it a name (e.g. `roi-stars`) and click **Create & Continue**
4. Vercel automatically injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into your project's environment variables

That's it — the star counter is live. No code changes needed.

### Step 4 — Deploy

Vercel deploys automatically on every push to `main`. For the first deploy, trigger it from the Vercel dashboard.

---

## 🗂️ Project Structure

```
app/
├── layout.tsx              # Root layout — metadata, fonts, favicon
├── page.tsx                # Home page — mode toggle + both calculators
├── opengraph-image.tsx     # Programmatic OG image (edge runtime)
├── globals.css             # CSS custom property design tokens
├── about/
│   └── page.tsx            # About page — what, how, benefits, limitations
└── api/
    └── stars/
        └── route.ts        # GET /api/stars · POST /api/stars (Upstash Redis)

components/
│   # ── Simple Mode
├── ROICalculator.tsx        # Stateful simple-mode shell + export
├── SliderInput.tsx          # Range slider with manual type-in
├── SummaryCards.tsx         # Manual Labor vs. Automation cost cards
├── ResultCard.tsx           # Animated ROI result tiles
├── SmartNote.tsx            # Contextual automation recommendation
├── AdvancedConfig.tsx       # Collapsible advanced settings accordion
├── NegativeROIBanner.tsx    # Warning when ROI is negative
├── SimpleExportButtons.tsx  # Excel + PDF export for Simple Mode
│   # ── Business Deep Dive
├── BusinessMode.tsx         # Orchestrator — state for all 3 cards
├── CostingCard.tsx          # Editable line-item cost card
├── BusinessFormulaConfig.tsx # Accordion to override profit/ROI formulas
├── BusinessSummary.tsx      # 11-metric summary tiles
├── ExportButtons.tsx        # Excel + PDF export for Business Mode
│   # ── Shared
├── ModeToggle.tsx           # Simple ↔ Business Deep Dive switcher
├── StarCounter.tsx          # Community star button + live count
├── Header.tsx               # Sticky nav with logo, controls, links
├── Footer.tsx               # Branded footer with social links
├── LoadingScreen.tsx        # Animated splash screen (once/session)
├── ThemeProvider.tsx        # Theme + text size + currency context
├── ThemeToggle.tsx          # Sun/Moon toggle with animation
├── CurrencySelector.tsx
└── TextSizeSelector.tsx

lib/
├── roi-calculator.ts        # Simple mode math — pure functions
├── business-calculator.ts   # Business mode math — cards, formulas, export
└── currencies.ts            # 12-currency config + formatAmount()
```

---

## 🧮 How the Math Works

### Simple Mode
```
weeklyManualCost  = hourlyRate × manualHoursPerWeek × overheadMultiplier × hoursRecoveredFraction
monthlyManualCost = weeklyManualCost × (weeksPerYear / 12)
monthlySavings    = monthlyManualCost − automationCostPerMonth
ROI %             = (monthlySavings / automationCostPerMonth) × 100
```

All constants are user-overrideable via the **Advanced Configuration** accordion. A regex-gated arithmetic evaluator (`/^[\d\s+\-*/().]+$/`) lets power users enter a custom weekly cost formula.

### Business Deep Dive Mode

Each costing card sums its line items (numbers or arithmetic expressions). The four aggregate formulas are configurable via the **Configure Formulas** accordion, and accept these named variables:

| Variable | Value |
|---|---|
| `manual_cost` | Sum of Manual Costing card |
| `automation_cost` | Sum of AI/Automation Costing card (0 when disabled) |
| `revenue` | Sum of Selling Price / Income card |
| `manual_profit` | Result of your Manual Profit formula |
| `automation_profit` | Result of your Automation Profit formula |
| `savings` | Result of your Savings formula |

**Default formulas:**
```
manual_profit     = revenue - manual_cost
automation_profit = revenue - automation_cost
savings           = manual_cost - automation_cost
roi               = (savings / automation_cost) * 100
```

---

## 🌍 Supported Currencies

USD · EUR · INR · JPY · SGD · GBP · AUD · CAD · CHF · AED · MYR · PHP

All values are formatted using the native `Intl.NumberFormat` API with locale-correct separators and symbols.

---

## 📄 License

MIT — free to use, fork, and adapt.

---

**Built by [Sankalp Indish](https://www.linkedin.com/in/sankalp-indish/) · [All Projects](https://sankalp-indish-all-projects.vercel.app/)**

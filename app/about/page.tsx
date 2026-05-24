import Link from "next/link";
import {
  Calculator,
  Clock,
  DollarSign,
  Zap,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  SlidersHorizontal,
  Globe,
  ShieldCheck,
  Brain,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ThemeProvider } from "../../components/ThemeProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Automation ROI Calculator",
  description:
    "Learn what the Automation ROI Calculator does, how to use it, its benefits, and its limitations.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold" style={{ color: "var(--text-secondary)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({
  icon: Icon,
  title,
  body,
  iconBg,
  iconColor,
}: {
  icon: typeof Calculator;
  title: string;
  body: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div
      className="flex gap-3 rounded-2xl border p-4"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: iconBg ?? "var(--accent-light)", color: iconColor ?? "var(--accent)" }}
      >
        <Icon size={16} strokeWidth={2.5} />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          {title}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {body}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col" style={{ background: "var(--bg-base)" }}>
        <Header />

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-12">

            {/* Hero */}
            <div className="flex flex-col gap-3">
              <div
                className="flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                style={{ borderColor: "var(--border)", color: "var(--accent)", background: "var(--accent-light)" }}
              >
                <Calculator size={11} />
                About this tool
              </div>
              <h1
                className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
                style={{ color: "var(--text-primary)" }}
              >
                What is the Automation ROI Calculator?
              </h1>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A free, client-side financial tool built for freelancers, agencies, and business
                owners who want a clear answer to one question:{" "}
                <strong style={{ color: "var(--text-secondary)" }}>
                  does automating my work actually make financial sense?
                </strong>{" "}
                Two modes — a quick slider estimate and a full business deep dive. No login,
                no data sent anywhere, no strings attached.
              </p>
            </div>

            {/* How to use */}
            <Section title="How to use it">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Pick a mode at the top of the calculator, then fill in your numbers:
              </p>
              <div className="flex flex-col gap-3">
                <Card
                  icon={SlidersHorizontal}
                  title="Simple Mode — quick estimate"
                  body="Three sliders: your hourly rate, manual hours per week, and automation cost per month. Drag or click the badge to type a number. Results update instantly."
                />
                <Card
                  icon={BarChart3}
                  title="Business Deep Dive — full analysis"
                  body="Build a detailed cost model with three editable cards — Manual Costing, AI/Automation Costing, and Revenue. Line items support arithmetic formulas. Produces 11 profit and ROI metrics."
                />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                In Simple Mode, use the{" "}
                <strong style={{ color: "var(--text-secondary)" }}>Advanced Configuration</strong>{" "}
                accordion to tune overhead multiplier, hours recovered fraction, weeks per year, or
                enter a custom weekly cost formula. In Business Deep Dive, open{" "}
                <strong style={{ color: "var(--text-secondary)" }}>Configure Formulas</strong> to
                override how profit, savings, and ROI are calculated.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Use the{" "}
                <strong style={{ color: "var(--text-secondary)" }}>currency selector</strong> in the
                header to display all values in your local currency, and the{" "}
                <strong style={{ color: "var(--text-secondary)" }}>S / M / L</strong> buttons to
                adjust text size. Both modes support{" "}
                <strong style={{ color: "var(--text-secondary)" }}>Excel and PDF export</strong>.
              </p>
            </Section>

            {/* Benefits / what it can do */}
            <Section title="Benefits &amp; what it can do">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card
                  icon={TrendingUp}
                  title="Real-time ROI verdict"
                  body="Instantly tells you whether automation is a no-brainer, marginal, or a money-loser — no submit button, no waiting."
                />
                <Card
                  icon={Brain}
                  title="Smart recommendation"
                  body="A plain-language note tells you what to actually do with the numbers so you can make a confident decision."
                />
                <Card
                  icon={BarChart3}
                  title="Full profit & margin analysis"
                  body="Business Deep Dive computes manual profit, automation profit, profit delta, and margin improvement — not just savings."
                />
                <Card
                  icon={FileSpreadsheet}
                  title="Excel & PDF export"
                  body="Download your full analysis as a formatted spreadsheet or a structured A4 PDF report — ready to share with a client or team."
                />
                <Card
                  icon={Globe}
                  title="Multi-currency support"
                  body="Supports 12 currencies including USD, EUR, INR, JPY, SGD, GBP, AED, and more — all formatted natively."
                />
                <Card
                  icon={ShieldCheck}
                  title="100% private"
                  body="Everything runs in your browser. No data is sent to any server. Preferences are saved only in your local storage."
                />
                <Card
                  icon={SlidersHorizontal}
                  title="Configurable formulas"
                  body="Override any formula — weekly cost, profit, savings, ROI — using safe arithmetic expressions with named variables."
                />
                <Card
                  icon={CheckCircle2}
                  title="Break-even analysis"
                  body="When ROI is negative, the tool tells you exactly how much your workload would need to grow before automation pays off."
                />
              </div>
            </Section>

            {/* What it does NOT do */}
            <Section title="What it does not do">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                The tool is intentionally focused on financial ROI. It is not a full business-case builder:
              </p>
              <div className="flex flex-col gap-3">
                <Card
                  icon={XCircle}
                  title="No setup or implementation costs"
                  body="One-time costs to build, configure, or migrate your automations are not included. Add them as a line item in the Business Deep Dive's automation card if needed."
                  iconBg="var(--danger-light)"
                  iconColor="var(--danger)"
                />
                <Card
                  icon={XCircle}
                  title="No error or rework savings"
                  body="Automation often eliminates human error and the cost of fixing it. This indirect saving is real but hard to quantify — the calculator does not model it."
                  iconBg="var(--danger-light)"
                  iconColor="var(--danger)"
                />
                <Card
                  icon={XCircle}
                  title="No compounding scale effects"
                  body="As your workload grows, manual cost rises but automation cost stays flat. This growing advantage is not projected forward dynamically."
                  iconBg="var(--danger-light)"
                  iconColor="var(--danger)"
                />
                <Card
                  icon={XCircle}
                  title="No tax or depreciation advice"
                  body="Software subscription costs may be deductible in your jurisdiction. This tool does not give tax, legal, or accounting advice."
                  iconBg="var(--danger-light)"
                  iconColor="var(--danger)"
                />
              </div>
            </Section>

            {/* CTA */}
            <div
              className="flex flex-col items-center gap-4 rounded-2xl border p-8 text-center"
              style={{ background: "var(--accent)", borderColor: "var(--accent-hover)" }}
            >
              <p className="text-lg font-bold text-white">
                Ready to see your numbers?
              </p>
              <p className="text-sm text-white/80 max-w-sm">
                Quick estimate in 30 seconds. Full analysis in under 5 minutes. No account needed.
              </p>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: "#fff", color: "var(--accent)" }}
              >
                Open the Calculator
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

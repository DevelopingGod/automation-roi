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
                A free, client-side financial tool that helps freelancers and agencies answer one
                critical question:{" "}
                <strong style={{ color: "var(--text-secondary)" }}>
                  is automating my repetitive tasks actually worth paying for?
                </strong>{" "}
                No login, no data sent anywhere, no strings attached.
              </p>
            </div>

            {/* How to use */}
            <Section title="How to use it">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                The calculator has three inputs. Adjust them with the sliders or click the value
                badge to type a precise number:
              </p>
              <div className="flex flex-col gap-3">
                <Card
                  icon={DollarSign}
                  title="1. Enter your Hourly Rate"
                  body="Your billable rate, your salary-equivalent per hour, or any opportunity-cost rate that reflects what your time is worth."
                />
                <Card
                  icon={Clock}
                  title="2. Enter Manual Hours per Week"
                  body="How many hours each week you spend on repetitive, automatable tasks — data entry, report generation, file transfers, follow-up emails, etc."
                />
                <Card
                  icon={Zap}
                  title="3. Enter Automation Cost per Month"
                  body="The monthly subscription cost of the automation tool you're considering — n8n Cloud, Make.com, Zapier, or any other platform."
                />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Results update in real time. Use the{" "}
                <strong style={{ color: "var(--text-secondary)" }}>Advanced Configuration</strong>{" "}
                accordion to tweak constants like overhead multiplier, hours recovered fraction, or
                weeks per year — or enter a custom weekly cost formula.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Use the{" "}
                <strong style={{ color: "var(--text-secondary)" }}>currency selector</strong> in the
                header to display all values in your local currency, and the{" "}
                <strong style={{ color: "var(--text-secondary)" }}>S / M / L</strong> buttons to
                adjust text size.
              </p>
            </Section>

            {/* Benefits / what it can do */}
            <Section title="Benefits &amp; what it can do">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card
                  icon={TrendingUp}
                  title="Real-time ROI verdict"
                  body="Instantly tells you whether automation is a no-brainer, marginal, or a money-loser at your current rates."
                />
                <Card
                  icon={Brain}
                  title="Smart recommendation"
                  body="A contextual note explains what the numbers mean in plain language so you can make a confident decision."
                />
                <Card
                  icon={SlidersHorizontal}
                  title="Advanced formula mode"
                  body="Power users can override the default weekly-cost formula with any arithmetic expression and tune overhead multipliers."
                />
                <Card
                  icon={Globe}
                  title="Multi-currency support"
                  body="Supports 12 currencies including USD, EUR, INR, JPY, SGD, GBP, AED, and more — all formatted natively."
                />
                <Card
                  icon={ShieldCheck}
                  title="100% private"
                  body="Everything runs in your browser. No data is sent to any server. Preferences are stored only in your local storage."
                />
                <Card
                  icon={CheckCircle2}
                  title="Break-even analysis"
                  body="When ROI is negative, the tool tells you how much your manual workload would need to grow before automation pays off."
                />
              </div>
            </Section>

            {/* What it does NOT do */}
            <Section title="What it does not do">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                This tool is intentionally focused. It is not a full business-case builder:
              </p>
              <div className="flex flex-col gap-3">
                <Card
                  icon={XCircle}
                  title="No setup or implementation costs"
                  body="One-time costs to build, configure, or migrate your automations are not factored in. Add those to the automation cost field manually if needed."
                  iconBg="var(--danger-light)"
                  iconColor="var(--danger)"
                />
                <Card
                  icon={XCircle}
                  title="No error or rework savings"
                  body="Automation often reduces human error. This indirect saving is real but hard to quantify — the calculator does not model it."
                  iconBg="var(--danger-light)"
                  iconColor="var(--danger)"
                />
                <Card
                  icon={XCircle}
                  title="No scaling effects"
                  body="As your workload grows, your manual cost rises but the automation cost stays flat. This compounding benefit is not projected dynamically."
                  iconBg="var(--danger-light)"
                  iconColor="var(--danger)"
                />
                <Card
                  icon={XCircle}
                  title="No tax or depreciation"
                  body="Software subscription costs may be deductible depending on your jurisdiction. This tool does not give tax or accounting advice."
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
                Takes 30 seconds. No account needed.
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

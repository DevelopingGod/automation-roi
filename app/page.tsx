"use client";

import { useState } from "react";
import { ROICalculator } from "../components/ROICalculator";
import { BusinessMode } from "../components/BusinessMode";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";
import { LoadingScreen } from "../components/LoadingScreen";
import { StarCounter } from "../components/StarCounter";
import { ModeToggle, AppMode } from "../components/ModeToggle";

export default function Home() {
  const [mode, setMode] = useState<AppMode>("simple");

  return (
    <ThemeProvider>
      <LoadingScreen />
      <div className="flex min-h-screen flex-col" style={{ background: "var(--bg-base)" }}>
        <Header />

        {/* Hero */}
        <div className="border-b py-10 sm:py-14" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <div
              className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              style={{ borderColor: "var(--border)", color: "var(--accent)", background: "var(--accent-light)" }}
            >
              Free · Client-side · No signup
            </div>
            <h1
              className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
              style={{ color: "var(--text-primary)" }}
            >
              Stop Guessing.{" "}
              <span style={{ color: "var(--accent)" }}>Quantify</span> the Cost
              of Manual Work.
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--text-muted)" }}
            >
              See exactly how much money repetitive tasks drain from your business
              — and whether automating with n8n, Make.com, or Zapier actually pays off.
            </p>
            <div className="mt-6">
              <StarCounter />
            </div>
          </div>
        </div>

        {/* Mode toggle + main content */}
        <main
          className="mx-auto w-full flex-1 px-4 py-8 sm:py-10 transition-all duration-300"
          style={{ maxWidth: mode === "business" ? "1152px" : "768px" }}
        >
          {/* Mode selector */}
          <div className="mb-6">
            <ModeToggle mode={mode} onChange={setMode} />
          </div>

          {/* Both modes stay mounted to preserve state; visibility toggled via CSS */}
          <div style={{ display: mode === "simple" ? "block" : "none" }}>
            <ROICalculator />
          </div>
          <div style={{ display: mode === "business" ? "block" : "none" }}>
            <BusinessMode />
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

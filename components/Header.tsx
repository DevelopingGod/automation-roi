"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencySelector } from "./CurrencySelector";
import { TextSizeSelector } from "./TextSizeSelector";

export function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--bg-surface) 88%, transparent)",
      }}
    >
      {/* Main row */}
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-105"
            style={{ background: "var(--accent)" }}
          >
            <Leaf size={22} color="#fff" strokeWidth={2.5} />
          </span>
          <div className="flex flex-col leading-tight">
            <span
              className="text-base font-extrabold tracking-tight"
              style={{ color: "var(--text-secondary)" }}
            >
              Automation ROI
            </span>
            <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
              Cost Analyzer
            </span>
          </div>
        </Link>

        {/* Nav + controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nav links — hidden on very small screens */}
          <nav className="hidden sm:flex items-center gap-1 mr-1" aria-label="Main navigation">
            {[
              { href: "/",       label: "Calculator" },
              { href: "/about",  label: "About" },
            ].map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150"
                  style={{
                    background: active ? "var(--accent-light)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <CurrencySelector />
          <TextSizeSelector />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile nav row */}
      <div
        className="flex sm:hidden items-center gap-1 px-4 pb-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {[
          { href: "/",      label: "Calculator" },
          { href: "/about", label: "About" },
        ].map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-1 text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--accent-light)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

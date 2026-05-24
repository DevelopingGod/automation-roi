import Link from "next/link";
import { ExternalLink, Globe, Leaf, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="mt-auto w-full border-t py-6"
      style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <Leaf size={14} strokeWidth={2.5} style={{ color: "var(--accent)" }} />
          <span>
            Built by{" "}
            <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
              Sankalp Indish
            </span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Footer links">
          <Link
            href="/about"
            className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            <BookOpen size={14} strokeWidth={2} />
            About
          </Link>

          <span style={{ color: "var(--border)" }} aria-hidden>|</span>

          <a
            href="https://www.linkedin.com/in/sankalp-indish/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
            aria-label="Sankalp Indish on LinkedIn"
          >
            <ExternalLink size={14} strokeWidth={2} />
            LinkedIn
          </a>

          <span style={{ color: "var(--border)" }} aria-hidden>|</span>

          <a
            href="https://sankalp-indish-all-projects.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
            aria-label="Sankalp Indish projects portfolio"
          >
            <Globe size={14} strokeWidth={2} />
            Portfolio
          </a>
        </nav>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const LS_KEY = "roi-tool-starred";

interface StarState {
  count: number;
  loading: boolean;
  hasStarred: boolean;
  justStarred: boolean;
}

export function StarCounter() {
  const [state, setState] = useState<StarState>({
    count: 0,
    loading: true,
    hasStarred: false,
    justStarred: false,
  });

  useEffect(() => {
    const hasStarred = localStorage.getItem(LS_KEY) === "1";
    setState((s) => ({ ...s, hasStarred }));

    fetch("/api/stars")
      .then((r) => r.json())
      .then(({ count }) => setState((s) => ({ ...s, count, loading: false })))
      .catch(() => setState((s) => ({ ...s, loading: false })));
  }, []);

  const handleStar = async () => {
    if (state.hasStarred || state.loading) return;

    // Optimistic update
    setState((s) => ({
      ...s,
      count: s.count + 1,
      hasStarred: true,
      justStarred: true,
    }));
    localStorage.setItem(LS_KEY, "1");

    try {
      const res = await fetch("/api/stars", { method: "POST" });
      const { count } = await res.json();
      setState((s) => ({ ...s, count }));
    } catch {
      // Keep optimistic count on failure — don't punish the user
    }

    setTimeout(() => setState((s) => ({ ...s, justStarred: false })), 2200);
  };

  const { count, loading, hasStarred, justStarred } = state;

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Star button */}
      <motion.button
        onClick={handleStar}
        disabled={hasStarred || loading}
        whileTap={!hasStarred ? { scale: 0.92 } : {}}
        className="group relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200"
        style={{
          background: hasStarred ? "var(--accent)" : "var(--bg-surface)",
          borderColor: hasStarred ? "var(--accent-hover)" : "var(--border)",
          color: hasStarred ? "#fff" : "var(--text-secondary)",
          cursor: hasStarred ? "default" : "pointer",
        }}
        aria-label={hasStarred ? "You already starred this tool" : "Star this tool"}
      >
        {/* Star icon with fill animation */}
        <motion.span
          animate={
            justStarred
              ? { scale: [1, 1.5, 0.9, 1.15, 1], rotate: [0, 15, -10, 5, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center"
        >
          <Star
            size={15}
            strokeWidth={2.5}
            fill={hasStarred ? "#fff" : "none"}
            color={hasStarred ? "#fff" : "var(--accent)"}
          />
        </motion.span>

        <span>{hasStarred ? "Starred" : "Star this tool"}</span>

        {/* Burst particles on star */}
        <AnimatePresence>
          {justStarred && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-1 w-1 rounded-full"
                  style={{
                    background: "#fff",
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((i * 60 * Math.PI) / 180) * 22,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 22,
                    opacity: 0,
                    scale: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Count display */}
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            key={count}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <Star
              size={13}
              fill={count > 0 ? "var(--accent)" : "none"}
              color="var(--accent)"
              strokeWidth={2}
            />
            <span className="tabular-nums font-medium" style={{ color: "var(--text-secondary)" }}>
              {count.toLocaleString()}
            </span>
            <span>{count === 1 ? "star" : "stars"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Just starred" confirmation */}
      <AnimatePresence>
        {justStarred && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Thanks! 🌿
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

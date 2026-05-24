"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, TrendingUp } from "lucide-react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem("roi-loaded");
    if (seen) return;
    setVisible(true);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("roi-loaded", "1");
        }, 300);
      }
      setProgress(Math.min(p, 100));
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
          style={{ background: "var(--bg-base)" }}
        >
          {/* Ambient circles */}
          <motion.div
            className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--accent)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full opacity-15 blur-3xl"
            style={{ background: "var(--accent-light)" }}
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative flex flex-col items-center gap-5"
          >
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg"
              style={{ background: "var(--accent)" }}
            >
              <Leaf size={40} color="white" strokeWidth={2} />
            </div>

            <div className="flex flex-col items-center gap-1">
              <motion.h1
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: "var(--text-secondary)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Automation ROI
              </motion.h1>
              <motion.div
                className="flex items-center gap-1.5 text-sm"
                style={{ color: "var(--text-muted)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <TrendingUp size={13} />
                Quantify the cost of manual work
              </motion.div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="w-48 overflow-hidden rounded-full"
            style={{ height: 4, background: "var(--border)" }}
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--accent)", width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          <motion.p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Preparing your calculator...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

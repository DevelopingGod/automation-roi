"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { ROIInputs, AdvancedConfig, ROIResult, DEFAULT_ADVANCED_CONFIG, formatPercent } from "../lib/roi-calculator";
import { Currency, formatAmount, formatAmountPDF } from "../lib/currencies";

interface Props {
  inputs: ROIInputs;
  advancedConfig: AdvancedConfig;
  result: ROIResult;
  currency: Currency;
}

export function SimpleExportButtons({ inputs, advancedConfig, result, currency }: Props) {
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [pdfLoading,  setPdfLoading]  = useState(false);

  const cfg = { ...DEFAULT_ADVANCED_CONFIG, ...advancedConfig };
  const fmt    = (n: number) => formatAmount(n, currency);
  const fmtP   = (n: number) => formatAmountPDF(n, currency);
  const fmtPct = (n: number) => n >= 9999 ? ">9,999%" : formatPercent(n, 1);

  // ── Excel ──────────────────────────────────────────────────────────────────
  const handleExcel = async () => {
    setXlsxLoading(true);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      const inputsData = [
        ["Automation ROI Calculator — Simple Mode"],
        ["Generated", new Date().toLocaleString()],
        ["Currency", `${currency.name} (${currency.code})`],
        [],
        ["INPUTS"],
        ["Hourly Rate",                  fmt(inputs.hourlyRate)],
        ["Manual Hours / Week",          `${inputs.manualHoursPerWeek} hrs`],
        ["Automation Cost / Month",      fmt(inputs.automationCostPerMonth)],
        [],
        ["ADVANCED CONFIGURATION"],
        ["Weeks per Year",               cfg.weeksPerYear],
        ["Overhead Multiplier",          cfg.overheadMultiplier],
        ["Hours Recovered Fraction",     cfg.hoursRecoveredFraction],
        ["Custom Weekly Formula",        cfg.customWeeklyFormula || "(none)"],
      ];

      const resultsData = [
        ["RESULTS"],
        ["Weekly Manual Cost",           fmt(result.weeklyManualCost)],
        ["Monthly Manual Cost",          fmt(result.monthlyManualCost)],
        ["Yearly Manual Cost",           fmt(result.yearlyManualCost)],
        ["Monthly Automation Cost",      fmt(result.monthlyAutomationCost)],
        ["Monthly Savings",              fmt(result.monthlySavings)],
        ["Yearly Savings",               fmt(result.yearlySavings)],
        ["ROI",                          fmtPct(result.roiPercent)],
        ["Effective Hourly Rate",        fmt(result.effectiveHourlyRate)],
        ["Outcome",                      result.isNegativeROI ? "Negative ROI — automation costs more than it saves" : "Positive ROI — automation is profitable"],
        ...(result.breakEvenWeeks !== null
          ? [["Break-even", `${result.breakEvenWeeks.toFixed(1)} weeks`]]
          : []),
      ];

      const ws = XLSX.utils.aoa_to_sheet([...inputsData, [], ...resultsData]);
      ws["!cols"] = [{ wch: 32 }, { wch: 24 }];
      XLSX.utils.book_append_sheet(wb, ws, "ROI Summary");

      XLSX.writeFile(wb, `Automation-ROI-Simple-${Date.now()}.xlsx`);
    } finally {
      setXlsxLoading(false);
    }
  };

  // ── PDF ────────────────────────────────────────────────────────────────────
  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      const { default: jsPDF }     = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const M     = 15;
      type AutoDoc = { lastAutoTable?: { finalY: number } };

      // Header banner
      doc.setFillColor(22, 163, 74);
      doc.rect(0, 0, pageW, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Automation ROI Calculator", M, 10);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text("Simple Mode Report", M, 16);
      doc.text(new Date().toLocaleDateString("en-GB"), pageW - M, 16, { align: "right" });

      let y = 30;
      doc.setTextColor(20, 83, 45);

      // Inputs table
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Inputs", M, y);

      autoTable(doc, {
        startY: y + 4,
        margin: { left: M, right: M },
        head: [["Parameter", "Value"]],
        body: [
          ["Hourly Rate",              fmtP(inputs.hourlyRate)],
          ["Manual Hours / Week",      `${inputs.manualHoursPerWeek} hrs`],
          ["Automation Cost / Month",  fmtP(inputs.automationCostPerMonth)],
          ["Weeks per Year",           String(cfg.weeksPerYear)],
          ["Overhead Multiplier",      `x${cfg.overheadMultiplier}`],
          ["Hours Recovered Fraction", `${(cfg.hoursRecoveredFraction * 100).toFixed(0)}%`],
          ...(cfg.customWeeklyFormula ? [["Custom Weekly Formula", cfg.customWeeklyFormula]] as [string, string][] : []),
        ],
        headStyles:         { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        styles:             { fontSize: 9, cellPadding: 3 },
        columnStyles:       { 0: { fontStyle: "bold", cellWidth: 75 }, 1: { cellWidth: 55 } },
      });

      // Results table
      const prevY = ((doc as unknown as AutoDoc).lastAutoTable?.finalY ?? y) + 10;
      const resultY = prevY > 245 ? (doc.addPage(), M) : prevY;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 83, 45);
      doc.text("ROI Results", M, resultY);

      autoTable(doc, {
        startY: resultY + 4,
        margin: { left: M, right: M },
        head: [["Metric", "Value"]],
        body: [
          ["Weekly Manual Cost",      fmtP(result.weeklyManualCost)],
          ["Monthly Manual Cost",     fmtP(result.monthlyManualCost)],
          ["Yearly Manual Cost",      fmtP(result.yearlyManualCost)],
          ["Monthly Automation Cost", fmtP(result.monthlyAutomationCost)],
          ["Monthly Savings",         fmtP(result.monthlySavings)],
          ["Yearly Savings",          fmtP(result.yearlySavings)],
          ["ROI",                     fmtPct(result.roiPercent)],
          ["Effective Hourly Rate",   fmtP(result.effectiveHourlyRate)],
          ...(result.breakEvenWeeks !== null
            ? [["Break-even", `${result.breakEvenWeeks.toFixed(1)} weeks`]] as [string, string][]
            : []),
        ],
        headStyles:         { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        styles:             { fontSize: 9, cellPadding: 3 },
        columnStyles:       { 0: { fontStyle: "bold", cellWidth: 75 }, 1: { cellWidth: 55 } },
      });

      // Verdict strip
      const verdictY = ((doc as unknown as AutoDoc).lastAutoTable?.finalY ?? resultY) + 10;
      const safeVerdictY = verdictY > 260 ? (doc.addPage(), M) : verdictY;

      doc.setFillColor(result.isNegativeROI ? 254 : 240, result.isNegativeROI ? 226 : 253, result.isNegativeROI ? 226 : 244);
      doc.roundedRect(M, safeVerdictY, pageW - M * 2, 12, 2, 2, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(result.isNegativeROI ? 185 : 22, result.isNegativeROI ? 28 : 163, result.isNegativeROI ? 28 : 74);
      const verdict = result.isNegativeROI
        ? "Negative ROI - automation costs more than it saves at current figures."
        : result.roiPercent >= 500
        ? "Exceptional ROI - automation is a clear financial winner."
        : result.roiPercent >= 100
        ? "Strong ROI - automating significantly improves your bottom line."
        : "Positive ROI - automation is profitable.";
      doc.text(verdict, M + 3, safeVerdictY + 7.5);

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text(
          `Generated by Automation ROI Calculator  |  Page ${i} of ${totalPages}`,
          pageW / 2, doc.internal.pageSize.getHeight() - 8,
          { align: "center" }
        );
      }

      doc.save(`Automation-ROI-Simple-${Date.now()}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
        Export:
      </span>

      <button
        onClick={handleExcel}
        disabled={xlsxLoading}
        className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:opacity-80 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "#217346" }}
      >
        {xlsxLoading ? <Loader2 size={15} className="animate-spin" /> : <FileSpreadsheet size={15} strokeWidth={2.5} />}
        Download Excel
      </button>

      <button
        onClick={handlePDF}
        disabled={pdfLoading}
        className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:opacity-80 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--danger)" }}
      >
        {pdfLoading ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} strokeWidth={2.5} />}
        Download PDF
      </button>
    </div>
  );
}

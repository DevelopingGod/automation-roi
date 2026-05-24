"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import {
  CostingCardData,
  BusinessResult,
  BusinessFormulaConfig,
  buildExportSheets,
} from "../lib/business-calculator";
import { Currency, formatAmount, formatAmountPDF } from "../lib/currencies";

interface Props {
  manualCard: CostingCardData;
  automationCard: CostingCardData;
  revenueCard: CostingCardData;
  result: BusinessResult;
  formulaConfig: BusinessFormulaConfig;
  currency: Currency;
}

// Excel sheet names cannot contain: \ / ? * [ ] : and must be ≤ 31 chars
function xlsSheetName(title: string): string {
  return title.replace(/[\\/?*[\]:]/g, "-").trim().slice(0, 31);
}

function profitMargin(profit: number | null, revenue: number): number | null {
  if (profit === null || revenue === 0) return null;
  return (profit / revenue) * 100;
}

export function ExportButtons({
  manualCard, automationCard, revenueCard,
  result, formulaConfig, currency,
}: Props) {
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [pdfLoading,  setPdfLoading]  = useState(false);

  const sheets = buildExportSheets(manualCard, automationCard, revenueCard, result, currency);

  // Web-safe formatter (Unicode ok in xlsx)
  const fmt    = (n: number) => formatAmount(n, currency);
  const fmtPct = (n: number | null) => n === null ? "N/A" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

  // PDF-safe formatter (ASCII/Latin-1 only — avoids garbled ₹ € ₱ in jsPDF)
  const fmtP    = (n: number) => formatAmountPDF(n, currency);
  const fmtPPct = (n: number | null) => n === null ? "N/A" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

  const manualMargin     = profitMargin(result.manualProfit,     result.revenueTotal);
  const automationMargin = profitMargin(result.automationProfit, result.revenueTotal);
  const marginDelta      = manualMargin !== null && automationMargin !== null
    ? automationMargin - manualMargin : null;

  // ── Excel ──────────────────────────────────────────────────────────────────
  const handleExcel = async () => {
    setXlsxLoading(true);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      // Summary sheet — xlsx handles Unicode natively, use full fmt()
      const summaryData = [
        ["Automation ROI Calculator — Business Deep Dive"],
        ["Generated", new Date().toLocaleString()],
        ["Currency",  `${currency.name} (${currency.code})`],
        [],
        ["COST TOTALS"],
        ["Manual Cost Total",     fmt(result.manualCostTotal)],
        ["Automation Cost Total", fmt(result.automationCostTotal)],
        ["Revenue / Income",      fmt(result.revenueTotal)],
        ["Cost Savings",          result.savings !== null ? fmt(result.savings) : "N/A"],
        [],
        ["PROFIT ANALYSIS"],
        ["Manual Profit",             result.manualProfit     !== null ? fmt(result.manualProfit)     : "N/A"],
        ["Automation Profit",         result.automationProfit !== null ? fmt(result.automationProfit) : "N/A"],
        ["Profit Delta (Auto−Manual)", result.profitDelta     !== null ? fmt(result.profitDelta)      : "N/A"],
        [],
        ["PROFIT MARGINS (vs Revenue)"],
        ["Manual Profit Margin",       fmtPct(manualMargin)],
        ["Automation Profit Margin",   fmtPct(automationMargin)],
        ["Margin Improvement",         fmtPct(marginDelta)],
        [],
        ["ROI METRICS"],
        ["ROI on Automation", fmtPct(result.roi)],
        [],
        ["FORMULAS USED"],
        ["Manual Profit Formula",     formulaConfig.manualProfit],
        ["Automation Profit Formula", formulaConfig.automationProfit],
        ["Savings Formula",           formulaConfig.savings],
        ["ROI Formula",               formulaConfig.roi],
      ];

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWs["!cols"] = [{ wch: 32 }, { wch: 24 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

      // One sheet per card
      for (const sheet of sheets) {
        const cardData = [
          [sheet.title],
          ["Item Label", "Formula / Amount", "Computed Value"],
          ...sheet.rows.map((r) => [r.label, r.formula, fmt(r.value)]),
          [],
          ["TOTAL", "", fmt(sheet.total)],
        ];
        const ws = XLSX.utils.aoa_to_sheet(cardData);
        ws["!cols"] = [{ wch: 28 }, { wch: 24 }, { wch: 20 }];
        // Sanitize sheet name: remove chars illegal in Excel ( \ / ? * [ ] : )
        XLSX.utils.book_append_sheet(wb, ws, xlsSheetName(sheet.title));
      }

      XLSX.writeFile(wb, `Automation-ROI-${Date.now()}.xlsx`);
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
      const M     = 15; // margin
      type AutoDoc = { lastAutoTable?: { finalY: number } };

      // ── Header banner
      doc.setFillColor(22, 163, 74);
      doc.rect(0, 0, pageW, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Automation ROI Calculator", M, 10);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text("Business Deep Dive Report", M, 16);
      doc.text(new Date().toLocaleDateString("en-GB"), pageW - M, 16, { align: "right" });

      let y = 30;
      doc.setTextColor(20, 83, 45);

      // ── ROI Summary table
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("ROI Summary", M, y);

      autoTable(doc, {
        startY: y + 4,
        margin: { left: M, right: M },
        head: [["Metric", "Value"]],
        body: [
          ["Manual Cost Total",           fmtP(result.manualCostTotal)],
          ["Automation Cost Total",        fmtP(result.automationCostTotal)],
          ["Revenue / Income",             fmtP(result.revenueTotal)],
          ["Cost Savings",                 result.savings      !== null ? fmtP(result.savings)      : "N/A"],
          ["Manual Profit",                result.manualProfit !== null ? fmtP(result.manualProfit) : "N/A"],
          ["Automation Profit",            result.automationProfit !== null ? fmtP(result.automationProfit) : "N/A"],
          ["Profit Delta (Auto - Manual)", result.profitDelta  !== null ? fmtP(result.profitDelta)  : "N/A"],
          ["Manual Profit Margin",         fmtPPct(manualMargin)],
          ["Automation Profit Margin",     fmtPPct(automationMargin)],
          ["Margin Improvement",           fmtPPct(marginDelta)],
          ["ROI on Automation",            fmtPPct(result.roi)],
        ],
        headStyles:         { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        styles:             { fontSize: 9, cellPadding: 3 },
        columnStyles:       { 0: { fontStyle: "bold", cellWidth: 75 }, 1: { cellWidth: 55 } },
      });

      // ── Card tables — one per card
      for (const sheet of sheets) {
        const prevY = ((doc as unknown as AutoDoc).lastAutoTable?.finalY ?? y) + 10;
        const cardY = prevY > 245 ? (doc.addPage(), M) : prevY;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(20, 83, 45);
        doc.text(sheet.title, M, cardY);

        autoTable(doc, {
          startY: cardY + 4,
          margin: { left: M, right: M },
          head: [["Item", "Formula / Amount", "Value"]],
          body: [
            ...sheet.rows.map((r) => [r.label, r.formula, fmtP(r.value)]),
            [
              { content: "TOTAL", styles: { fontStyle: "bold" } },
              "",
              { content: fmtP(sheet.total), styles: { fontStyle: "bold" } },
            ],
          ],
          headStyles:         { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [240, 253, 244] },
          styles:             { fontSize: 9, cellPadding: 3 },
          columnStyles:       { 0: { cellWidth: 62 }, 1: { cellWidth: 58 }, 2: { cellWidth: 40 } },
        });
      }

      // ── Formulas used
      const prevY2 = ((doc as unknown as AutoDoc).lastAutoTable?.finalY ?? y) + 10;
      const formulaY = prevY2 > 245 ? (doc.addPage(), M) : prevY2;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 83, 45);
      doc.text("Formulas Used", M, formulaY);

      autoTable(doc, {
        startY: formulaY + 4,
        margin: { left: M, right: M },
        head: [["Formula Name", "Expression"]],
        body: [
          ["Manual Profit",     formulaConfig.manualProfit],
          ["Automation Profit", formulaConfig.automationProfit],
          ["Savings",           formulaConfig.savings],
          ["ROI (%)",           formulaConfig.roi],
        ],
        headStyles:   { fillColor: [22, 163, 74], textColor: 255, fontStyle: "bold" },
        styles:       { fontSize: 8.5, cellPadding: 2.5 },
        columnStyles: { 0: { cellWidth: 48 }, 1: { cellWidth: 112 } },
      });

      // ── Footer on every page
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

      doc.save(`Automation-ROI-${Date.now()}.pdf`);
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

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Automation ROI Calculator — Quantify the cost of manual work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#052e16",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#14532d",
            border: "1px solid #166534",
            borderRadius: 9999,
            padding: "8px 20px",
            marginBottom: 32,
          }}
        >
          <span style={{ color: "#22c55e", fontSize: 16, fontWeight: 600 }}>
            Free · Client-side · No signup required
          </span>
        </div>

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div
            style={{
              background: "#16a34a",
              width: 72,
              height: 72,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "rgba(255,255,255,0.9)",
                borderRadius: 4,
                transform: "rotate(45deg)",
              }}
            />
          </div>
          <span style={{ color: "#dcfce7", fontSize: 36, fontWeight: 800 }}>
            Automation ROI
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            color: "#f0fdf4",
            fontSize: 58,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.1,
            margin: "0 0 20px",
            maxWidth: 900,
          }}
        >
          Stop Guessing.{" "}
          <span style={{ color: "#22c55e" }}>Quantify</span> the Cost of Manual Work.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "#86efac",
            fontSize: 24,
            textAlign: "center",
            maxWidth: 780,
            margin: "0 0 40px",
            lineHeight: 1.4,
          }}
        >
          Prove the ROI of automating with n8n, Make.com or Zapier — in seconds.
        </p>

        {/* CTA pill */}
        <div
          style={{
            background: "#16a34a",
            color: "#ffffff",
            fontSize: 20,
            fontWeight: 700,
            padding: "14px 36px",
            borderRadius: 9999,
          }}
        >
          automation-roi.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

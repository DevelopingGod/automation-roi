import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://automation-roi.vercel.app"),
  title: "Automation ROI Calculator | Quantify the Cost of Manual Work",
  description:
    "Free client-side calculator that shows freelancers and agencies exactly how much money they lose to manual tasks — and the true ROI of automating with tools like n8n or Make.com.",
  keywords: [
    "automation ROI calculator",
    "n8n ROI",
    "Make.com ROI",
    "freelancer automation savings",
    "manual task cost calculator",
    "workflow automation cost analysis",
    "agency productivity tool",
  ],
  authors: [{ name: "Sankalp Indish", url: "https://www.linkedin.com/in/sankalp-indish/" }],
  creator: "Sankalp Indish",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "Automation ROI Calculator",
    description:
      "Quantify exactly how much manual tasks cost you — and prove the ROI of automation tools like n8n and Make.com in seconds.",
    siteName: "Automation ROI Calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Automation ROI Calculator",
    description: "Free tool: calculate money lost to manual work vs. the cost of automation.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

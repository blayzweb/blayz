import type { Metadata } from "next";
import { JetBrains_Mono, Reem_Kufi, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Font roles (per PRD §2.2).
 *
 * - `blayz` custom display  -> placeholder: Space Grotesk (swap with next/font/local once
 *                              the real wordmark font file is delivered).
 * - Satoshi (body)          -> genuine (variable, self-hosted via next/font/local).
 * - JetBrains Mono (labels) -> genuine.
 * - Reem Kufi (accents)     -> genuine.
 */
// Spec: Primary Display — Light / Regular / Bold (logotype, headlines, large
// statements). Regular (400) MUST be loaded or default-weight `font-display`
// headings silently fall back to a system font.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
});

// Spec: Accent — Reem Kufi at Medium / Bold (Arabic + cultural touchpoints).
const reemKufi = Reem_Kufi({
  variable: "--font-kufi",
  subsets: ["arabic", "latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Blayz — Crafted with code & culture",
  description:
    "Blayz is a studio fusing Arabic geometric ornament with code culture. We build websites that build brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${satoshi.variable} ${jetbrainsMono.variable} ${reemKufi.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}

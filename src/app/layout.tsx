import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Reem_Kufi,
  Manrope,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

/**
 * Font roles (per PRD §2.2).
 *
 * - `blayz` custom display  -> placeholder: Space Grotesk (swap with next/font/local once
 *                              the real wordmark font file is delivered).
 * - Satoshi (body)          -> placeholder: Manrope (closest free geometric grotesque).
 * - JetBrains Mono (labels) -> genuine.
 * - Reem Kufi (accents)     -> genuine.
 */
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const satoshi = Manrope({
  variable: "--font-satoshi",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
});

const reemKufi = Reem_Kufi({
  variable: "--font-kufi",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
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
    >
      <body>{children}</body>
    </html>
  );
}

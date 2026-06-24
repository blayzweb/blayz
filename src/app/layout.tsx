import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Font roles (per PRD §2.2).
 *
 * - Satoshi (body/headings) -> genuine (variable, self-hosted via next/font/local).
 * - JetBrains Mono (labels) -> genuine (restricted to coding elements).
 */
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

export const metadata: Metadata = {
  title: "Blayz | Crafted with code & culture",
  description:
    "Blayz is a studio fusing Arabic geometric tradition with code culture. We build websites that build brands.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){if('scrollRestoration' in history)history.scrollRestoration='manual';window.scrollTo(0,0);var p=location.pathname;if(p==='/'||p==='')document.documentElement.classList.add('intro-active')})();",
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link
          rel="preload"
          as="image"
          href="/assets/hero-sequence/frame_0001.webp"
          type="image/webp"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

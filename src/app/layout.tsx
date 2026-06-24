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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://blayz.ae"),
  title: "Blayz | Crafted with code & culture",
  description:
    "Blayz is a web design & development studio fusing Arabic geometric tradition with code culture. We build websites that build brands.",
  keywords: [
    "web studio",
    "UAE web design",
    "Arabic geometric design",
    "code & culture",
    "creative agency Dubai",
    "website maker",
    "cheap website",
    "website agency",
    "affordable web design UAE",
    "cheap web developer Dubai",
    "custom website agency",
    "freelance web developer Dubai",
    "web agency Dubai",
    "affordable website creator"
  ],
  authors: [{ name: "Blayz Studio" }],
  creator: "Blayz Studio",
  publisher: "Blayz Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Blayz",
    title: "Blayz | Crafted with code & culture",
    description:
      "Blayz is a web design & development studio fusing Arabic geometric tradition with code culture. We build websites that build brands.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Blayz | Crafted with code & culture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blayz | Crafted with code & culture",
    description:
      "Blayz is a web design & development studio fusing Arabic geometric tradition with code culture. We build websites that build brands.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blayz.ae";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Blayz",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          "url": `${siteUrl}/icon.svg`,
          "contentUrl": `${siteUrl}/icon.svg`,
          "caption": "Blayz Logo"
        },
        "image": {
          "@id": `${siteUrl}/#logo`
        },
        "sameAs": [
          "https://www.instagram.com/blayzae/",
          "https://www.linkedin.com/in/blayz-⠀-bb1b8b418"
        ]
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        "name": "Blayz Studio",
        "url": siteUrl,
        "telephone": "",
        "priceRange": "AED 1,999 - AED 9,999",
        "image": `${siteUrl}/icon.svg`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Dubai",
          "addressCountry": "AE"
        },
        "description": "Blayz is a web design & development studio fusing Arabic geometric tradition with code culture. We build websites that build brands for UAE businesses.",
        "areaServed": {
          "@type": "State",
          "name": "United Arab Emirates"
        }
      }
    ]
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

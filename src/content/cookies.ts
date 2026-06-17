import type { LegalSection } from "@/content/legal-types";

export const cookiesMeta = {
  title: "Cookie Policy",
  subtitle: "What cookies we use and why — in plain language.",
  accent: "your choice matters",
  lastUpdated: "18 June 2026",
} as const;

export const cookiesSections: LegalSection[] = [
  {
    id: "introduction",
    index: "01",
    title: "Introduction",
    paragraphs: [
      "This site uses cookies — small text files stored on your device — to keep things working and, with your consent, to understand how visitors use the studio site.",
      "This policy explains what we set, what they do, and how you can control them.",
    ],
  },
  {
    id: "essential",
    index: "02",
    title: "Essential cookies",
    paragraphs: [
      "These are required for the site to function. They cannot be switched off through our site controls.",
    ],
    bullets: [
      "Session and security cookies that protect forms and keep basic preferences.",
      "Load-balancing or infrastructure cookies from our hosting provider.",
    ],
  },
  {
    id: "analytics",
    index: "03",
    title: "Analytics cookies",
    paragraphs: [
      "If you accept optional cookies, we may use privacy-friendly analytics to see aggregate traffic — which pages are visited, how long people stay, and where errors occur.",
      "We do not use analytics cookies to build advertising profiles or track you across other websites.",
    ],
  },
  {
    id: "choices",
    index: "04",
    title: "Your choices",
    paragraphs: [
      "When we show a cookie banner, you can accept or decline optional cookies. You can also clear cookies anytime through your browser settings.",
      "Blocking essential cookies may affect how parts of the site work. Blocking analytics cookies will not affect core browsing.",
    ],
  },
  {
    id: "third-party",
    index: "05",
    title: "Third-party cookies",
    paragraphs: [
      "Some embedded content or tools (for example video players or social links) may set their own cookies when you interact with them. Those providers have their own policies.",
      "We aim to keep third-party scripts minimal and only use services we trust.",
    ],
  },
  {
    id: "updates",
    index: "06",
    title: "Updates",
    paragraphs: [
      "We may update this policy when our tooling changes. The date at the top of this document will reflect the latest version.",
    ],
  },
];

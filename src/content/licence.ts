import type { LegalSection } from "@/content/legal-types";

export const licenceMeta = {
  title: "Licence",
  subtitle: "How you may use this site and our studio work.",
  accent: "respect the craft",
  lastUpdated: "18 June 2026",
} as const;

export const licenceSections: LegalSection[] = [
  {
    id: "introduction",
    index: "01",
    title: "Introduction",
    paragraphs: [
      "This Licence sets out how you may use blayz.studio and the content published on it. It does not replace a signed contract for client projects, as bespoke work is always governed by its own agreement.",
    ],
  },
  {
    id: "site-content",
    index: "02",
    title: "Site content",
    paragraphs: [
      "Unless stated otherwise, all content on this site, including text, visuals, code samples, patterns, and the Blayz brand, is owned by Blayz or used with permission.",
    ],
    bullets: [
      "You may view and share links to our pages for personal or non-commercial reference.",
      "You may not copy, scrape, republish, or redistribute site content without written permission.",
      "Our name, logo, and visual identity may not be used in a way that implies endorsement or partnership.",
    ],
  },
  {
    id: "client-work",
    index: "03",
    title: "Client work",
    paragraphs: [
      "Deliverables created for clients, including websites, brand systems, code, and design files, are licensed under the terms of each project contract. Ownership and usage rights are defined there, not on this page.",
      "Portfolio case studies and previews may show client work with permission. Those assets remain subject to their respective licences.",
    ],
  },
  {
    id: "open-source",
    index: "04",
    title: "Open source & third party",
    paragraphs: [
      "Our site may include open-source software or third-party assets, each governed by its own licence. Where required, attributions are included in the project or site source.",
    ],
  },
  {
    id: "disclaimer",
    index: "05",
    title: "Disclaimer",
    paragraphs: [
      "This site is provided for general information about the studio. We aim to keep it accurate and current, but we do not guarantee that everything is complete, error-free, or always available.",
      "Nothing on this site constitutes professional, legal, or financial advice.",
    ],
  },
  {
    id: "liability",
    index: "06",
    title: "Liability",
    paragraphs: [
      "To the fullest extent permitted by law, Blayz is not liable for any loss or damage arising from your use of this site or reliance on its content.",
      "Some jurisdictions do not allow certain limitations. In those cases, our liability is limited to the maximum extent allowed.",
    ],
  },
  {
    id: "changes",
    index: "07",
    title: "Changes",
    paragraphs: [
      "We may revise this Licence from time to time. Continued use of the site after an update means you accept the revised terms. The date at the top reflects the current version.",
    ],
  },
];

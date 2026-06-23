import type { LegalSection } from "@/content/legal-types";

export type { LegalSection };

export const privacyMeta = {
  title: "Privacy Policy",
  subtitle: "How we handle your data, plainly stated.",
  lastUpdated: "18 June 2026",
} as const;

export const privacySections: LegalSection[] = [
  {
    id: "introduction",
    index: "01",
    title: "Introduction",
    paragraphs: [
      "Blayz (“we”, “us”, “our”) is a design and development studio. This Privacy Policy explains what information we collect when you visit blayz.studio, contact us, or use our services, and what we do with it.",
      "We keep this document readable on purpose. If anything here is unclear, reach out at hello@blayz.studio.",
    ],
  },
  {
    id: "collection",
    index: "02",
    title: "Information we collect",
    paragraphs: [
      "We only collect information that helps us respond to enquiries, deliver projects, and improve the site.",
    ],
    bullets: [
      "Contact details you send us, such as your name, email, company, and project notes via our contact form.",
      "Technical data from your browser, including your IP address, device type, and pages visited, collected through standard server logs and analytics.",
      "Cookie preferences and session identifiers, where you have accepted optional cookies.",
      "Project files or brand assets you voluntarily share during a engagement.",
    ],
  },
  {
    id: "use",
    index: "03",
    title: "How we use your information",
    paragraphs: [
      "We use the information above to operate the studio, and never to build advertising profiles.",
    ],
    bullets: [
      "Reply to enquiries and scope potential projects.",
      "Deliver design, engineering, and support work under contract.",
      "Maintain site security, diagnose errors, and understand aggregate traffic patterns.",
      "Send essential project updates you have asked for.",
    ],
  },
  {
    id: "cookies",
    index: "04",
    title: "Cookies & analytics",
    paragraphs: [
      "Essential cookies keep the site functional. Optional analytics cookies help us see which pages resonate, and they are only set if you consent.",
      "You can change your mind anytime via your browser settings or by clearing stored cookies. See our Cookies policy for more detail.",
    ],
  },
  {
    id: "sharing",
    index: "05",
    title: "Sharing & processors",
    paragraphs: [
      "We do not sell personal data. We share it only with trusted processors who help us run the studio (including hosting, email, analytics, and payment providers) under data-processing agreements where required.",
      "We may disclose information if lawfully required or to protect the rights and safety of Blayz, our clients, and others.",
    ],
  },
  {
    id: "rights",
    index: "06",
    title: "Your rights",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, delete, or restrict use of your personal data, and to object to certain processing.",
      "To exercise any of these rights, email hello@blayz.studio. We will respond within a reasonable timeframe.",
    ],
  },
  {
    id: "retention",
    index: "07",
    title: "Retention & security",
    paragraphs: [
      "We keep enquiry and project records for as long as needed to deliver work, meet legal obligations, and resolve disputes, after which we delete or anonymise them.",
      "We apply sensible technical and organisational measures to protect data. No method of transmission over the internet is perfectly secure; we cannot guarantee absolute security.",
    ],
  },
  {
    id: "changes",
    index: "08",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this page as our practices evolve. The “Last updated” date at the top will change when we do. Continued use of the site after an update means you accept the revised policy.",
    ],
  },
];

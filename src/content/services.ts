/**
 * The six service/process entries reuse the brand guide's existing
 * "06. ASCII WEBDEV ELEMENTS" vocabulary (PRD §7.3) — no new categories.
 */
export interface ServiceEntry {
  /** ASCII tag exactly as written in the brand guide. */
  tag: string;
  /** Human title. */
  title: string;
  description: string;
}

export const SERVICES: ServiceEntry[] = [
  {
    tag: "[ design ]",
    title: "Design",
    description:
      "Identity, interface and art direction built on a real visual system — type, grid, motion and ornament that hold together.",
  },
  {
    tag: "< build />",
    title: "Build",
    description:
      "Production websites and web apps in Next.js. Fast, accessible, and engineered to be maintained, not just shipped.",
  },
  {
    tag: "{ rebrand }",
    title: "Rebrand",
    description:
      "Evolve an existing brand without losing its equity — refresh the system, sharpen the story, modernise every touchpoint.",
  },
  {
    tag: "// optimize",
    title: "Optimize",
    description:
      "Performance, SEO and conversion passes. We measure, then make the numbers move — Core Web Vitals included.",
  },
  {
    tag: "< launch />",
    title: "Launch",
    description:
      "Go-live with confidence: deploys, domains, analytics and the launch campaign that gets people through the door.",
  },
  {
    tag: "/* iterate */",
    title: "Iterate",
    description:
      "Ongoing partnership — experiments, content and feature work that compound long after the first release.",
  },
];

/**
 * Boot sequence lines for the Services entry animation (PRD §7.3).
 * Rendered as chrome only — typed/revealed, then morphs into the grid.
 */
export const BOOT_SEQUENCE: string[] = [
  "$ npm install @blayz/brand-system",
  "  ⠋ resolving arabesque-patterns@2.6.0",
  "  ⠙ resolving ascii-grid@1.0.4",
  "  ⠹ resolving reem-kufi-accent@latest",
  "  ✓ 3 packages installed",
  "",
  "$ npm run blayz -- --build",
  "",
  "  [ design ]     ready",
  "  < build />     ready",
  "  { rebrand }    ready",
  "  // optimize    ready",
  "  < launch />    ready",
  "  /* iterate */  ready",
  "",
  "✓ build complete",
];

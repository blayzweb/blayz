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
      "Identity, interface, and art direction built on a real visual system of typography, grids, and motion that hold together.",
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
      "Evolve an existing brand without losing its identity. We help you refresh the system, sharpen your story, and modernise every touchpoint.",
  },
  {
    tag: "// optimize",
    title: "Optimize",
    description:
      "Performance, SEO, and conversion optimizations. We measure first, then improve the numbers, including your Core Web Vitals.",
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
      "An ongoing partnership for experiments, content, and feature work that compounds long after the first release.",
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

/** Billing cadence for a base price or add-on impact. */
export type Unit = "once" | "mo";

/** Drives which elements light up in the live <SitePreview> mockup. */
export type PreviewKey =
  | "aeo"
  | "multilingual"
  | "cms"
  | "ecom"
  | "motion"
  | "seo"
  | "booking"
  | "maintenance";

export type TierId = "launch" | "studio" | "partner";

export interface PricingTier {
  id: TierId;
  name: string;
  /** Friendly figure shown on the card before it's configured (PRD §12.5). */
  price: string;
  cadence?: string;
  blurb: string;
  features: string[];
  featured?: boolean;
  /** Private numeric range the configurator builds its estimate from. */
  base: [number, number];
  /** Whether the base figure is a one-off build or a monthly retainer. */
  unit: Unit;
}

export interface Addon {
  id: string;
  label: string;
  blurb: string;
  /** Low/high impact on the estimate when selected. */
  delta: [number, number];
  unit: Unit;
  /** Mockup feature this add-on reveals. */
  preview: PreviewKey;
  /** Tiers where this is bundled in — shown as "included", never charged. */
  includedIn?: TierId[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "launch",
    name: "Launch",
    price: "from $4k",
    cadence: "fixed scope",
    blurb: "A sharp one-pager or landing site that makes a brand look inevitable.",
    features: [
      "Up to 3 sections / pages",
      "Brand-led visual design",
      "Next.js build + deploy",
      "Basic analytics & SEO",
    ],
    base: [4000, 6000],
    unit: "once",
  },
  {
    id: "studio",
    name: "Studio",
    price: "from $12k",
    cadence: "project",
    blurb: "Full site or product surface with a bespoke system and motion.",
    features: [
      "Multi-page / app architecture",
      "Custom design system",
      "Scroll & micro-interactions",
      "CMS + integrations",
      "Performance pass",
    ],
    featured: true,
    base: [12000, 16000],
    unit: "once",
  },
  {
    id: "partner",
    name: "Partner",
    price: "let's talk",
    cadence: "retainer",
    blurb: "Ongoing design + engineering as an extension of your team.",
    features: [
      "Everything in Studio",
      "Monthly iteration cycles",
      "Roadmap & experiments",
      "Priority support",
    ],
    base: [3000, 5000],
    unit: "mo",
  },
];

export const ADDONS: Addon[] = [
  {
    id: "aeo",
    label: "AEO — AI answer optimization",
    blurb: "Structured data + content tuned so AI answer engines cite you.",
    delta: [2000, 3000],
    unit: "once",
    preview: "aeo",
  },
  {
    id: "multilingual",
    label: "Multilingual + RTL",
    blurb: "Arabic-ready right-to-left layouts and translated content.",
    delta: [2500, 4000],
    unit: "once",
    preview: "multilingual",
  },
  {
    id: "cms",
    label: "CMS / self-editing",
    blurb: "Edit copy and media yourself, no developer required.",
    delta: [2000, 3000],
    unit: "once",
    preview: "cms",
    includedIn: ["studio", "partner"],
  },
  {
    id: "ecom",
    label: "E-commerce / payments",
    blurb: "Product catalogue, cart and checkout with secure payments.",
    delta: [4000, 7000],
    unit: "once",
    preview: "ecom",
  },
  {
    id: "motion",
    label: "Advanced motion & scroll",
    blurb: "Signature scroll choreography and micro-interactions.",
    delta: [2000, 4000],
    unit: "once",
    preview: "motion",
    includedIn: ["studio", "partner"],
  },
  {
    id: "seo",
    label: "SEO & analytics package",
    blurb: "Technical SEO, Core Web Vitals and conversion analytics.",
    delta: [1000, 2000],
    unit: "once",
    preview: "seo",
  },
  {
    id: "booking",
    label: "Booking / forms / integrations",
    blurb: "Scheduling, lead forms and third-party tool wiring.",
    delta: [1500, 3000],
    unit: "once",
    preview: "booking",
  },
  {
    id: "maintenance",
    label: "Maintenance / retainer",
    blurb: "Updates, monitoring and priority support, billed monthly.",
    delta: [800, 1500],
    unit: "mo",
    preview: "maintenance",
    includedIn: ["partner"],
  },
];

export interface Estimate {
  /** One-off build range, or null when nothing one-off is in scope. */
  once: [number, number] | null;
  /** Recurring monthly range, or null when there's no retainer in scope. */
  monthly: [number, number] | null;
}

/** True when this add-on is bundled into the given tier (and so never charged). */
export function isIncluded(addon: Addon, tierId: TierId): boolean {
  return addon.includedIn?.includes(tierId) ?? false;
}

/** Add-on ids that ship bundled with a tier — the configurator's default selection. */
export function defaultSelection(tierId: TierId): string[] {
  return ADDONS.filter((a) => isIncluded(a, tierId)).map((a) => a.id);
}

/** Build a {once, monthly} estimate from a tier and the set of selected add-on ids. */
export function computeEstimate(tier: PricingTier, selected: string[]): Estimate {
  let onceLo = 0;
  let onceHi = 0;
  let moLo = 0;
  let moHi = 0;

  const add = (unit: Unit, lo: number, hi: number) => {
    if (unit === "once") {
      onceLo += lo;
      onceHi += hi;
    } else {
      moLo += lo;
      moHi += hi;
    }
  };

  add(tier.unit, tier.base[0], tier.base[1]);

  for (const addon of ADDONS) {
    if (!selected.includes(addon.id)) continue;
    if (isIncluded(addon, tier.id)) continue; // bundled — already in base
    add(addon.unit, addon.delta[0], addon.delta[1]);
  }

  return {
    once: onceLo || onceHi ? [onceLo, onceHi] : null,
    monthly: moLo || moHi ? [moLo, moHi] : null,
  };
}

/** Compact brand money format: 4000 -> "$4k", 4500 -> "$4.5k", 800 -> "$800". */
export function formatMoney(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `$${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }
  return `$${n}`;
}

/** "$8k – $13k", collapsing to a single figure when low === high. */
export function formatRange([lo, hi]: [number, number]): string {
  return lo === hi
    ? formatMoney(lo)
    : `${formatMoney(lo)} – ${formatMoney(hi)}`;
}

/** The headline figure for a card: one-off range, else monthly range, else "". */
export function headlineFigure(estimate: Estimate): string {
  if (estimate.once) return formatRange(estimate.once);
  if (estimate.monthly) return `${formatRange(estimate.monthly)}`;
  return "";
}

/** Human-readable build summary used to prefill the contact message. */
export function buildSummary(tier: PricingTier, selected: string[]): string {
  const estimate = computeEstimate(tier, selected);
  const chosen = ADDONS.filter((a) => selected.includes(a.id));

  const lines: string[] = [`Build configuration — ${tier.name} tier`, ""];

  if (chosen.length) {
    lines.push("Add-ons:");
    for (const a of chosen) {
      lines.push(`  • ${a.label}${isIncluded(a, tier.id) ? " (included)" : ""}`);
    }
  } else {
    lines.push("Add-ons: none beyond the base tier");
  }

  lines.push("");
  if (estimate.once) lines.push(`Estimated one-off: ${formatRange(estimate.once)}`);
  if (estimate.monthly)
    lines.push(`Estimated monthly: ${formatRange(estimate.monthly)}/mo`);
  lines.push("");
  lines.push("(Generated from the Blayz configurator — rough estimate.)");

  return lines.join("\n");
}

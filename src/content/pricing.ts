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

export type TierId = "starter" | "business" | "premium";

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
    id: "starter",
    name: "Starter",
    price: "1,999",
    cadence: "one-time",
    blurb:
      "A credible online presence for freelancers and side projects.",
    features: [
      "Up to 5 responsive pages",
      "Contact form, SEO & SSL",
      "1 revision round",
    ],
    base: [1999, 1999],
    unit: "once",
  },
  {
    id: "business",
    name: "Business",
    price: "3,999",
    cadence: "one-time",
    blurb:
      "Professional presence for SMEs and growing brands.",
    features: [
      "Up to 8 custom-designed pages",
      "CMS, WhatsApp & analytics",
      "2 revision rounds",
    ],
    featured: true,
    base: [3999, 3999],
    unit: "once",
  },
  {
    id: "premium",
    name: "Premium",
    price: "6,999",
    cadence: "one-time",
    blurb:
      "Full digital ecosystem for e-commerce and established brands.",
    features: [
      "Up to 15 pages & Figma mockup",
      "E-commerce, payments & booking",
      "3 revision rounds",
    ],
    base: [6999, 6999],
    unit: "once",
  },
];

export const ADDONS: Addon[] = [
  {
    id: "extra-page",
    label: "Additional page",
    blurb: "Beyond your tier's included page count: covers layout, copy, and images.",
    delta: [299, 299],
    unit: "once",
    preview: "cms",
  },
  {
    id: "ecom",
    label: "E-commerce upgrade",
    blurb: "Shopping cart, payment gateway, and product management (up to 50 products).",
    delta: [2000, 2000],
    unit: "once",
    preview: "ecom",
    includedIn: ["premium"],
  },
  {
    id: "booking",
    label: "Booking / appointment system",
    blurb: "Calendar integration with automated reminders.",
    delta: [1000, 1000],
    unit: "once",
    preview: "booking",
    includedIn: ["premium"],
  },
  {
    id: "multilingual",
    label: "Multi-language support",
    blurb: "Arabic + English bilingual setup with RTL layout and translation-ready structure.",
    delta: [1500, 1500],
    unit: "once",
    preview: "multilingual",
  },
  {
    id: "cms",
    label: "CMS / self-editing",
    blurb: "Edit copy and media yourself without needing a developer.",
    delta: [1500, 1500],
    unit: "once",
    preview: "cms",
    includedIn: ["business", "premium"],
  },
  {
    id: "cms-training",
    label: "Custom CMS training",
    blurb: "1-hour video call, written guide, and 30-day email support for your CMS.",
    delta: [150, 150],
    unit: "once",
    preview: "cms",
  },
  {
    id: "three-d",
    label: "3D elements",
    blurb: "Interactive 3D graphics, models, or immersive components. Starting at 1,000 AED.",
    delta: [1000, 1000],
    unit: "once",
    preview: "motion",
  },
  {
    id: "content",
    label: "Content writing (per page)",
    blurb: "SEO-optimized copywriting in English or Arabic, up to 500 words per page.",
    delta: [150, 150],
    unit: "once",
    preview: "cms",
  },
  {
    id: "photography",
    label: "Professional photography",
    blurb: "On-site shoot with up to 15 edited photos for website use. Currently limited to Dubai and Sharjah.",
    delta: [1500, 1500],
    unit: "once",
    preview: "ecom",
  },
  {
    id: "seo",
    label: "SEO monthly retainer",
    blurb: "Monthly reporting, keyword tracking, backlink analysis, and content suggestions.",
    delta: [500, 500],
    unit: "mo",
    preview: "seo",
  },
  {
    id: "rush",
    label: "Urgent delivery (rush fee)",
    blurb: "Halve delivery time, subject to availability.",
    delta: [500, 500],
    unit: "once",
    preview: "motion",
  },
  {
    id: "maintenance",
    label: "Maintenance (Standard)",
    blurb: "Up to 2 small edits/mo, security patches, weekly backups, and 48-hr break/fix SLA.",
    delta: [300, 300],
    unit: "mo",
    preview: "maintenance",
  },
  {
    id: "maintenance-premium",
    label: "Maintenance (Premium)",
    blurb: "Up to 5 edits/mo, daily offsite backups, monthly SEO reports, and 4-hr emergency response.",
    delta: [600, 600],
    unit: "mo",
    preview: "maintenance",
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
  const defaults = ADDONS.filter((a) => isIncluded(a, tierId)).map((a) => a.id);
  if (tierId === "starter") {
    defaults.push("maintenance");
  } else {
    defaults.push("maintenance-premium");
  }
  return defaults;
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

/** ISO currency code for plain-text (non-glyph) contexts like emails. */
export const CURRENCY_CODE = "AED";

/** Compact money format (symbol-free): 1999 -> "1,999", 12000 -> "12k". */
export function formatMoney(n: number): string {
  if (n >= 10_000 && n % 1000 === 0) {
    return `${n / 1000}k`;
  }
  return new Intl.NumberFormat("en-AE").format(n);
}

/** "8k – 13k", collapsing to a single figure when low === high. */
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

  const lines: string[] = [`Build configuration: ${tier.name} tier`, ""];

  if (chosen.length) {
    lines.push("Add-ons:");
    for (const a of chosen) {
      lines.push(`  • ${a.label}${isIncluded(a, tier.id) ? " (included)" : ""}`);
    }
  } else {
    lines.push("Add-ons: none beyond the base tier");
  }

  lines.push("");
  if (estimate.once)
    lines.push(`Estimated one-off: ${CURRENCY_CODE} ${formatRange(estimate.once)}`);
  if (estimate.monthly)
    lines.push(
      `Estimated monthly: ${CURRENCY_CODE} ${formatRange(estimate.monthly)}/mo`,
    );
  lines.push("");
  lines.push("(Generated from the Blayz configurator, as a rough estimate.)");

  return lines.join("\n");
}

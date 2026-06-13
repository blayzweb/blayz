export interface PricingTier {
  name: string;
  /** JetBrains-Mono figure or "let's talk". TBD copy (PRD §12.5). */
  price: string;
  cadence?: string;
  blurb: string;
  features: string[];
  featured?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
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
  },
  {
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
  },
  {
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
  },
];

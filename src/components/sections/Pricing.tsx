"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PRICING_TIERS,
  buildSummary,
  computeEstimate,
  headlineFigure,
  type TierId,
} from "@/content/pricing";
import { useSite } from "@/components/providers/SiteProvider";
import { ConfiguratorModal } from "@/components/configurator/ConfiguratorModal";
import { clsx } from "@/lib/clsx";

/**
 * Pricing (PRD §7.4). Sadu textile theme — tiers framed top/bottom by woven
 * geometric bands. Each tier opens a full-screen configurator (car-dealership
 * style) where add-ons rebuild a live mockup and update a running estimate.
 */
export function Pricing() {
  const { requestQuote } = useSite();
  const [openTier, setOpenTier] = useState<TierId | null>(null);
  const [configs, setConfigs] = useState<Record<string, string[]>>({});

  const activeTier = PRICING_TIERS.find((t) => t.id === openTier) ?? null;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-blayz-cream-deep px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 font-mono text-sm text-blayz-orange">
          [ 04 ] Pricing
        </p>
        <h2 className="mb-6 max-w-2xl font-display text-4xl leading-tight font-bold tracking-tight text-blayz-ink sm:text-5xl">
          Woven to fit — pick a tier, then build it your way.
        </h2>
        <p className="mb-16 max-w-xl font-sans text-blayz-ink/60">
          Start from a tier and configure add-ons like a custom order — watch the
          build and your estimate update in real time.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => {
            const config = configs[tier.id];
            const configured = config !== undefined;
            const estimate = configured
              ? computeEstimate(tier, config)
              : null;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={clsx(
                  "flex flex-col overflow-hidden rounded-xl border bg-blayz-cream",
                  tier.featured
                    ? "border-blayz-orange shadow-[0_30px_80px_-40px_rgba(255,56,0,0.5)]"
                    : "border-blayz-ink/10",
                )}
              >
                <SaduDivider featured={tier.featured} />

                <div className="flex flex-1 flex-col gap-6 p-7">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl text-blayz-ink">
                        {tier.name}
                      </h3>
                      {configured ? (
                        <span className="rounded-full bg-blayz-ink px-2.5 py-1 font-mono text-[10px] tracking-wide text-blayz-cream uppercase">
                          configured
                        </span>
                      ) : (
                        tier.featured && (
                          <span className="rounded-full bg-blayz-orange px-2.5 py-1 font-mono text-[10px] tracking-wide text-blayz-cream uppercase">
                            popular
                          </span>
                        )
                      )}
                    </div>

                    {configured && estimate ? (
                      <>
                        <p className="mt-3 font-mono text-3xl text-blayz-orange">
                          {headlineFigure(estimate)}
                        </p>
                        <p className="font-mono text-xs text-blayz-ink/40">
                          {estimate.once && estimate.monthly
                            ? `your build + ${headlineFigure({ once: null, monthly: estimate.monthly })}/mo`
                            : estimate.monthly
                              ? "/ month"
                              : "your build"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 font-mono text-3xl text-blayz-orange">
                          {tier.price}
                        </p>
                        {tier.cadence && (
                          <p className="font-mono text-xs text-blayz-ink/40">
                            / {tier.cadence}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <p className="font-sans text-sm text-blayz-ink/70">
                    {tier.blurb}
                  </p>

                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 font-sans text-sm text-blayz-ink/80"
                      >
                        <span className="mt-0.5 font-mono text-blayz-orange">
                          ◆
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      onClick={() => setOpenTier(tier.id)}
                      className={clsx(
                        "w-full rounded-lg py-3 font-mono text-sm transition-colors",
                        tier.featured && !configured
                          ? "bg-blayz-orange text-blayz-cream hover:bg-blayz-ink"
                          : "border border-blayz-ink/20 text-blayz-ink hover:border-blayz-orange hover:text-blayz-orange",
                      )}
                    >
                      {configured ? "< reconfigure />" : "⟶ configure build"}
                    </button>

                    {configured && config && (
                      <button
                        onClick={() =>
                          requestQuote({
                            projectType: "Website",
                            message: buildSummary(tier, config),
                          })
                        }
                        className="w-full rounded-lg bg-blayz-orange py-3 font-mono text-sm text-blayz-cream transition-colors hover:bg-blayz-ink"
                      >
                        &lt; request this build /&gt;
                      </button>
                    )}
                  </div>
                </div>

                <SaduDivider flip featured={tier.featured} />
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeTier && (
          <ConfiguratorModal
            key={activeTier.id}
            tier={activeTier}
            initialSelected={configs[activeTier.id]}
            onClose={() => setOpenTier(null)}
            onConfirm={(selected) =>
              setConfigs((prev) => ({ ...prev, [activeTier.id]: selected }))
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/** Horizontal Sadu zigzag/diamond band (PRD §7.4). */
function SaduDivider({
  flip = false,
  featured = false,
}: {
  flip?: boolean;
  featured?: boolean;
}) {
  const c1 = "var(--blayz-orange)";
  const c2 = "var(--blayz-gold)";
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      className={clsx("h-3 w-full", flip && "rotate-180")}
    >
      <defs>
        <pattern
          id={`sadu-${flip ? "b" : "t"}-${featured ? "f" : "n"}`}
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 12 L6 0 L12 12 Z" fill={c1} />
          <path d="M6 12 L12 6 L12 12 Z" fill={c2} opacity="0.6" />
        </pattern>
      </defs>
      <rect
        width="120"
        height="12"
        fill={`url(#sadu-${flip ? "b" : "t"}-${featured ? "f" : "n"})`}
      />
    </svg>
  );
}

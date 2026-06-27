"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PRICING_TIERS,
  computeEstimate,
  defaultSelection,
  headlineFigure,
  type TierId,
} from "@/content/pricing";
import dynamic from "next/dynamic";
import { useSite } from "@/components/providers/SiteProvider";

const ConfiguratorModal = dynamic(
  () => import("@/components/configurator/ConfiguratorModal").then((mod) => mod.ConfiguratorModal),
  { ssr: false }
);

import { clsx } from "@/lib/clsx";
import {
  TatreezBorder,
  TatreezDiamondPattern,
  TatreezFloralPattern,
} from "@/components/ui/tatreez-patterns";
import { Money } from "@/components/ui/money";

/**
 * Pricing (PRD §7.4). Tatreez (Levantine cross-stitch) textile theme — each
 * tier is framed top/bottom by seamless embroidered bands with a large stitched
 * medallion woven behind the copy. Each tier opens a full-screen configurator
 * where add-ons rebuild a live mockup and update a running estimate.
 */
export function Pricing() {
  const { requestQuote } = useSite();
  const [openTier, setOpenTier] = useState<TierId | null>(null);
  const [configs, setConfigs] = useState<Record<string, string[]>>({});

  const activeTier = PRICING_TIERS.find((t) => t.id === openTier) ?? null;

  return (
    <section
      id="pricing"
      className="relative bg-blayz-cream-deep px-6 md:px-28 lg:px-36 pt-14 pb-28"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 font-sans text-sm text-[#7A1118]">
          [ 04 ] Pricing
        </p>
        <h2 className="mb-4 max-w-2xl font-display text-3xl leading-tight font-bold tracking-tight text-blayz-ink sm:text-4xl">
          Woven to fit. Pick a tier, then build it your way.
        </h2>
        <p className="mb-10 max-w-xl font-sans text-sm leading-relaxed text-blayz-ink/65 sm:text-base">
          Fixed AED pricing built for UAE SMEs: start from a tier, add what you
          need, and watch your estimate update in real time.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => {
            const config = configs[tier.id] ?? defaultSelection(tier.id);
            const configured = configs[tier.id] !== undefined;
            const estimate = computeEstimate(tier, config);

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={clsx(
                  "flex flex-col overflow-hidden rounded-2xl border bg-[#F4EFE7]",
                  tier.featured
                    ? "border-[#7A1118] shadow-[0_20px_40px_-8px_rgba(122,17,24,0.45),0_48px_96px_-16px_rgba(122,17,24,0.35)]"
                    : "border-[#4A090D]/25 shadow-[0_16px_32px_-6px_rgba(23,19,19,0.35),0_36px_72px_-12px_rgba(23,19,19,0.28)]",
                )}
              >
                <TatreezBorder
                  variant={tier.featured ? "floral" : "diamonds"}
                  height={20}
                  animated
                />

                <div className="relative flex flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
                  {/* large tatreez medallion woven behind the copy */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-8 -right-12 select-none opacity-[0.09]"
                  >
                    {tier.featured ? (
                      <TatreezFloralPattern className="h-56 w-56" />
                    ) : (
                      <TatreezDiamondPattern className="h-52 w-52" />
                    )}
                  </div>
                  {/* ivory wash keeps the content fully legible over the stitching */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F4EFE7] via-[#F4EFE7]/80 to-[#F4EFE7]/70"
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold text-[#171313] sm:text-2xl">
                        {tier.name}
                      </h3>
                      {configured ? (
                        <span className="rounded-full bg-[#171313] px-3 py-1 font-sans text-xs font-bold tracking-wide text-[#F4EFE7] uppercase">
                          configured
                        </span>
                      ) : (
                        tier.featured && (
                          <span className="rounded-full bg-[#7A1118] px-3 py-1 font-sans text-xs font-bold tracking-wide text-[#F4EFE7] uppercase">
                            best value
                          </span>
                        )
                      )}
                    </div>

                    <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#7A1118]">
                      <Money
                        value={headlineFigure(estimate)}
                        weight="semibold"
                      />
                    </p>
                    {estimate.monthly ? (
                      <p className="mt-1 font-sans text-sm text-[#4A090D]/65">
                        +{" "}
                        <Money
                          value={headlineFigure({
                            once: null,
                            monthly: estimate.monthly,
                          })}
                          weight="regular"
                          symbolSize="0.9em"
                        />
                        /mo maintenance
                      </p>
                    ) : (
                      tier.cadence && (
                        <p className="mt-1 font-sans text-sm text-[#4A090D]/65">
                          / {tier.cadence}
                        </p>
                      )
                    )}
                  </div>

                  <p className="relative font-sans text-sm leading-relaxed text-[#171313]/70">
                    {tier.blurb}
                  </p>

                  <ul className="relative flex flex-col gap-1.5">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 font-sans text-sm leading-snug text-[#171313]/85"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-[#7A1118]"
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto flex flex-col gap-2.5">
                    <button
                      onClick={() => setOpenTier(tier.id)}
                      className={clsx(
                        "w-full rounded-lg py-2.5 font-sans font-bold text-sm transition-colors",
                        tier.featured && !configured
                          ? "bg-[#7A1118] text-[#F4EFE7] hover:bg-[#4A090D]"
                          : "border border-[#4A090D]/30 text-[#171313] hover:border-[#7A1118] hover:text-[#7A1118]",
                      )}
                    >
                      {configured ? (
                        <>
                          <span className="text-[#7A1118]/60">&lt;</span>{" "}
                          reconfigure{" "}
                          <span className="text-[#7A1118]/60">/&gt;</span>
                        </>
                      ) : tier.featured ? (
                        <>
                          <span className="text-[#F4EFE7]/55">&lt;</span>{" "}
                          configure build{" "}
                          <span className="text-[#F4EFE7]/55">/&gt;</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#7A1118]/60">&lt;</span>{" "}
                          configure build{" "}
                          <span className="text-[#7A1118]/60">/&gt;</span>
                        </>
                      )}
                    </button>

                    {configured && config && (
                      <button
                        onClick={() =>
                          requestQuote({
                            projectType: "Website",
                            tierId: tier.id,
                            selectedAddons: config,
                          })
                        }
                        className="w-full rounded-lg bg-[#7A1118] py-2.5 font-sans font-bold text-sm text-[#F4EFE7] transition-colors hover:bg-[#4A090D]"
                      >
                        <span className="text-[#F4EFE7]/55">&lt;</span> request
                        this build{" "}
                        <span className="text-[#F4EFE7]/55">/&gt;</span>
                      </button>
                    )}
                  </div>
                </div>

                <TatreezBorder
                  variant={tier.featured ? "floral" : "diamonds"}
                  height={20}
                  animated
                  flip
                />
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

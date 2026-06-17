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
      className="relative overflow-hidden bg-blayz-cream-deep px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 font-mono text-sm text-[#7A1118]">
          [ 04 ] Pricing
        </p>
        <h2 className="mb-6 max-w-2xl font-display text-4xl leading-tight font-bold tracking-tight text-blayz-ink sm:text-5xl">
          Woven to fit — pick a tier, then build it your way.
        </h2>
        <p className="mb-16 max-w-xl font-sans text-base leading-relaxed text-blayz-ink/65 sm:text-lg">
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
                  "flex flex-col overflow-hidden rounded-2xl border bg-[#F4EFE7]",
                  tier.featured
                    ? "border-[#7A1118] shadow-[0_40px_90px_-50px_rgba(122,17,24,0.6)]"
                    : "border-[#4A090D]/25 shadow-[0_30px_70px_-50px_rgba(23,19,19,0.55)]",
                )}
              >
                <TatreezBorder
                  variant={tier.featured ? "floral" : "diamonds"}
                  height={24}
                  animated
                />

                <div className="relative flex flex-1 flex-col gap-8 overflow-hidden p-8">
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
                      <h3 className="font-display text-2xl font-semibold text-[#171313] sm:text-3xl">
                        {tier.name}
                      </h3>
                      {configured ? (
                        <span className="rounded-full bg-[#171313] px-3 py-1 font-mono text-xs tracking-wide text-[#F4EFE7] uppercase">
                          configured
                        </span>
                      ) : (
                        tier.featured && (
                          <span className="rounded-full bg-[#7A1118] px-3 py-1 font-mono text-xs tracking-wide text-[#F4EFE7] uppercase">
                            popular
                          </span>
                        )
                      )}
                    </div>

                    {configured && estimate ? (
                      <>
                        <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-[#7A1118]">
                          <Money
                            value={headlineFigure(estimate)}
                            weight="semibold"
                          />
                        </p>
                        <p className="mt-1 font-sans text-sm text-[#4A090D]/65">
                          {estimate.once && estimate.monthly ? (
                            <>
                              your build +{" "}
                              <Money
                                value={headlineFigure({
                                  once: null,
                                  monthly: estimate.monthly,
                                })}
                                weight="regular"
                                symbolSize="0.9em"
                              />
                              /mo
                            </>
                          ) : estimate.monthly ? (
                            "/ month"
                          ) : (
                            "your build"
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-[#7A1118]">
                          <Money value={tier.price} weight="semibold" />
                        </p>
                        {tier.cadence && (
                          <p className="mt-1 font-sans text-sm text-[#4A090D]/65">
                            / {tier.cadence}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <p className="relative font-sans text-base leading-relaxed text-[#171313]/80">
                    {tier.blurb}
                  </p>

                  <ul className="relative flex flex-col gap-3">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-3 font-sans text-base leading-snug text-[#171313]/90"
                      >
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#7A1118]"
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto flex flex-col gap-2.5">
                    <button
                      onClick={() => setOpenTier(tier.id)}
                      className={clsx(
                        "w-full rounded-lg py-3.5 font-mono text-base transition-colors",
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
                            message: buildSummary(tier, config),
                          })
                        }
                        className="w-full rounded-lg bg-[#7A1118] py-3.5 font-mono text-base text-[#F4EFE7] transition-colors hover:bg-[#4A090D]"
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
                  height={24}
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

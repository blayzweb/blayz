"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "@/lib/clsx";
import { useSite } from "@/components/providers/SiteProvider";
import { SitePreview } from "@/components/configurator/SitePreview";
import {
  ADDONS,
  buildSummary,
  computeEstimate,
  defaultSelection,
  formatRange,
  isIncluded,
  type Addon,
  type PricingTier,
} from "@/content/pricing";
import { Money } from "@/components/ui/money";

/**
 * Full-screen split configurator (PRD §7.4 extension). Left: tier features +
 * toggleable add-ons + a live estimate. Right: a showroom mockup that rebuilds
 * itself as options change. Confirming hands the build off to the contact form.
 */
export function ConfiguratorModal({
  tier,
  initialSelected,
  onClose,
  onConfirm,
}: {
  tier: PricingTier;
  initialSelected?: string[];
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
}) {
  const { lockScroll, requestQuote } = useSite();
  const [selected, setSelected] = useState<string[]>(
    () => initialSelected ?? defaultSelection(tier.id),
  );

  // Lock the page behind the modal and wire up Escape-to-close.
  useEffect(() => {
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [lockScroll, onClose]);

  function toggle(addon: Addon) {
    if (isIncluded(addon, tier.id)) return; // bundled — not removable
    setSelected((prev) =>
      prev.includes(addon.id)
        ? prev.filter((id) => id !== addon.id)
        : [...prev, addon.id],
    );
  }

  function confirm() {
    onConfirm(selected);
    requestQuote({
      projectType: "Website",
      message: buildSummary(tier, selected),
    });
    onClose();
  }

  const estimate = computeEstimate(tier, selected);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Configure the ${tier.name} build`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-blayz-ink/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
          <p className="font-mono text-xs text-white/50">
            <span className="text-blayz-orange">configure</span> / {tier.name.toLowerCase()}
          </p>
          <button
            onClick={onClose}
            aria-label="Close configurator"
            className="grid size-8 place-items-center rounded-md font-mono text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-2">
          {/* showroom — visually right on desktop, on top for mobile */}
          <div className="order-1 grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br from-blayz-ink to-blayz-ink-soft px-6 py-8 lg:order-2 lg:py-0">
            <div className="arabesque-watermark pointer-events-none absolute inset-0 opacity-[0.04]" />
            <SitePreview tier={tier} selected={selected} />
          </div>

          {/* options */}
          <div className="order-2 flex min-h-0 flex-1 flex-col bg-blayz-cream lg:order-1">
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-5 py-6 sm:px-8"
            >
              <h2 className="font-display text-3xl font-bold tracking-tight text-blayz-ink">
                {tier.name}
              </h2>
              <p className="mt-1 max-w-md font-sans text-sm text-blayz-ink/60">
                {tier.blurb}
              </p>

              {/* base features */}
              <p className="mt-7 font-mono text-xs text-blayz-ink/40">
                ┌ included in {tier.name.toLowerCase()}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {tier.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 font-sans text-sm text-blayz-ink/80"
                  >
                    <span className="mt-0.5 font-mono text-blayz-orange">◆</span>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* add-ons */}
              <p className="mt-8 font-mono text-xs text-blayz-ink/40">
                ┌ customize — add-ons
              </p>
              <div className="mt-3 flex flex-col gap-2.5">
                {ADDONS.map((addon) => {
                  const included = isIncluded(addon, tier.id);
                  const active = included || selected.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggle(addon)}
                      aria-pressed={active}
                      disabled={included}
                      className={clsx(
                        "group flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors",
                        active
                          ? "border-blayz-orange bg-blayz-orange/5"
                          : "border-blayz-ink/15 bg-white/40 hover:border-blayz-ink/30",
                        included && "cursor-default",
                      )}
                    >
                      <span
                        className={clsx(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded border font-mono text-xs transition-colors",
                          active
                            ? "border-blayz-orange bg-blayz-orange text-blayz-cream"
                            : "border-blayz-ink/25 text-transparent",
                        )}
                      >
                        ✓
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-sans text-sm font-medium text-blayz-ink">
                            {addon.label}
                          </span>
                          <span className="shrink-0 font-mono text-xs text-blayz-orange">
                            {included ? (
                              "included"
                            ) : (
                              <>
                                +{" "}
                                <Money
                                  value={formatRange(addon.delta)}
                                  weight="regular"
                                  symbolSize="0.9em"
                                />
                                {addon.unit === "mo" ? "/mo" : ""}
                              </>
                            )}
                          </span>
                        </span>
                        <span className="mt-0.5 block font-sans text-xs text-blayz-ink/55">
                          {addon.blurb}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* estimate + CTA */}
            <div className="border-t border-blayz-ink/10 bg-blayz-cream-deep px-5 py-4 sm:px-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-wide text-blayz-ink/40 uppercase">
                    estimated
                  </p>
                  {estimate.once && (
                    <p className="font-mono text-2xl leading-tight text-blayz-orange">
                      <Money value={formatRange(estimate.once)} />
                    </p>
                  )}
                  {estimate.monthly && (
                    <p className="font-mono text-sm text-blayz-ink/60">
                      {estimate.once && "+ "}
                      <Money
                        value={formatRange(estimate.monthly)}
                        weight="regular"
                        symbolSize="0.9em"
                      />
                      <span className="text-blayz-ink/40">/mo</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={confirm}
                  className="rounded-lg bg-blayz-orange px-5 py-3 font-mono text-sm text-blayz-cream transition-colors hover:bg-blayz-ink"
                >
                  &lt; request this build /&gt;
                </button>
              </div>
              <p className="mt-2 font-mono text-[10px] text-blayz-ink/35">
                rough estimate — final scope confirmed together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "@/lib/clsx";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { PricingTier } from "@/content/pricing";

/**
 * Showroom mockup. A stylized browser window whose contents assemble
 * themselves as the visitor toggles add-ons — the configurator's
 * "watch your build come together" moment.
 */
export function SitePreview({
  tier,
  selected,
}: {
  tier: PricingTier;
  selected: string[];
}) {
  const reduced = useReducedMotion();
  const has = (id: string) => selected.includes(id);
  const rtl = has("multilingual");

  const t = reduced
    ? { duration: 0 }
    : { duration: 0.4, ease: "easeOut" as const };
  const block = {
    initial: reduced ? false : { opacity: 0, y: 12, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -8, height: 0 },
    transition: t,
  } as const;

  return (
    <div className="w-full max-w-md">
      {/* browser chrome */}
      <motion.div
        layout={!reduced}
        className="overflow-hidden rounded-xl border border-white/15 bg-blayz-cream shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center gap-2 border-b border-blayz-ink/10 bg-blayz-cream-deep px-3 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-blayz-orange" />
            <span className="size-2.5 rounded-full bg-blayz-gold" />
            <span className="size-2.5 rounded-full bg-blayz-sage" />
          </span>
          <span className="ml-1 flex flex-1 items-center gap-2 truncate rounded-md bg-blayz-cream px-2.5 py-1 font-sans font-medium text-[10px] text-blayz-ink/50">
            {has("maintenance") && (
              <span className="size-1.5 shrink-0 rounded-full bg-blayz-sage" />
            )}
            yourbrand.com
            {has("ecom") && <span className="text-blayz-ink/30">/shop</span>}
          </span>
          {has("seo") && (
            <motion.span
              initial={reduced ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded bg-blayz-sage/40 px-1.5 py-0.5 font-sans font-bold text-[9px] text-blayz-ink/70"
            >
              100
            </motion.span>
          )}
        </div>

        {/* page body */}
        <motion.div
          layout={!reduced}
          dir={rtl ? "rtl" : "ltr"}
          className="flex flex-col gap-3 p-4"
        >
          {/* nav */}
          <motion.div layout={!reduced} className="flex items-center justify-between">
            <span className="wordmark text-sm text-blayz-ink">blayz.</span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-blayz-ink/15" />
              <span className="h-1.5 w-6 rounded-full bg-blayz-ink/15" />
              <span className="h-1.5 w-6 rounded-full bg-blayz-ink/15" />
              <AnimatePresence>
                {has("multilingual") && (
                  <motion.span
                    key="lang"
                    initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="rounded border border-blayz-ink/15 px-1 font-sans text-[10px] text-blayz-ink/70"
                  >
                    ع / EN
                  </motion.span>
                )}
                {has("ecom") && (
                  <motion.span
                    key="cart"
                    initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="relative grid size-4 place-items-center rounded bg-blayz-orange/10 text-[9px] text-blayz-orange"
                  >
                    ⌗
                    <span className="absolute -top-1 -right-1 size-2 rounded-full bg-blayz-orange" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* motion accent marquee */}
          <AnimatePresence>
            {has("motion") && (
              <motion.div key="motion" {...block} className="overflow-hidden rounded">
                <div className="relative h-2 overflow-hidden rounded-full bg-blayz-ink/5">
                  <motion.div
                    className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-blayz-orange to-blayz-gold"
                    animate={reduced ? undefined : { x: ["-120%", "320%"] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* hero */}
          <motion.div layout={!reduced} className="flex flex-col gap-2 py-1">
            <div
              className={clsx(
                "h-3.5 rounded bg-blayz-ink/80",
                rtl ? "w-3/4 self-end" : "w-3/4",
              )}
            />
            <div
              className={clsx(
                "h-3.5 rounded bg-blayz-orange",
                rtl ? "w-1/2 self-end" : "w-1/2",
              )}
            />
            <AnimatePresence>
              {has("multilingual") && (
                <motion.p
                  key="ar"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-sans text-sm text-blayz-ink/70"
                >
                  علامة تجارية لا تُنسى
                </motion.p>
              )}
            </AnimatePresence>
            <div className="mt-1 flex gap-2" style={{ flexDirection: rtl ? "row-reverse" : "row" }}>
              <span className="h-5 w-20 rounded bg-blayz-orange" />
              <span className="h-5 w-16 rounded border border-blayz-ink/20" />
            </div>
          </motion.div>

          {/* AEO answer card */}
          <AnimatePresence>
            {has("aeo") && (
              <motion.div
                key="aeo"
                {...block}
                className="rounded-lg border border-blayz-orange/30 bg-blayz-orange/5 p-2.5"
              >
                <p className="mb-1 font-sans font-bold text-[9px] text-blayz-orange">
                  ✦ AI answer
                </p>
                <div className="h-1.5 w-full rounded bg-blayz-ink/15" />
                <div className="mt-1 h-1.5 w-2/3 rounded bg-blayz-ink/15" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* E-commerce grid */}
          <AnimatePresence>
            {has("ecom") && (
              <motion.div key="ecom" {...block} className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 rounded-md border border-blayz-ink/10 bg-blayz-cream-deep/60 p-1.5"
                  >
                    <div className="aspect-square rounded bg-blayz-ink/10" />
                    <div className="h-1 w-3/4 rounded bg-blayz-ink/15" />
                    <div className="h-1 w-1/2 rounded bg-blayz-orange/60" />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking block */}
          <AnimatePresence>
            {has("booking") && (
              <motion.div
                key="booking"
                {...block}
                className="flex items-center gap-2 rounded-lg border border-blayz-ink/10 bg-white/60 p-2.5"
              >
                <div className="grid grid-cols-4 gap-0.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className={clsx(
                        "size-1.5 rounded-[2px]",
                        i === 5 ? "bg-blayz-orange" : "bg-blayz-ink/15",
                      )}
                    />
                  ))}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="h-1.5 w-full rounded bg-blayz-ink/15" />
                  <div className="h-4 w-20 rounded bg-blayz-orange/80" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* footer status row */}
          <motion.div
            layout={!reduced}
            className="mt-1 flex items-center gap-2 border-t border-blayz-ink/10 pt-2"
          >
            <span className="h-1.5 flex-1 rounded bg-blayz-ink/10" />
            <AnimatePresence>
              {has("cms") && (
                <motion.span
                  key="cms"
                  initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="rounded bg-blayz-sky/60 px-1.5 py-0.5 font-sans font-bold text-[9px] text-blayz-ink/70"
                >
                  ✎ editable
                </motion.span>
              )}
              {has("maintenance") && (
                <motion.span
                  key="uptime"
                  initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="rounded bg-blayz-sage/40 px-1.5 py-0.5 font-sans font-bold text-[9px] text-blayz-ink/70"
                >
                  ◈ 99.9%
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
 
      <p className="mt-3 text-center font-sans text-[10px] text-white/40">
        live preview: {tier.name.toLowerCase()} build
      </p>
    </div>
  );
}

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
  const hasCms =
    has("cms") || has("cms-training") || has("content") || has("extra-page");
  const hasEcom = has("ecom");
  const hasMaintenance =
    has("maintenance") || has("maintenance-premium");

  const t = reduced
    ? { duration: 0 }
    : { duration: 0.35, ease: "easeOut" as const };
  const block = {
    initial: reduced ? false : { opacity: 0, y: 10, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -6, height: 0 },
    transition: t,
  } as const;
  const pop = {
    initial: reduced ? false : { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.6 },
    transition: t,
  } as const;

  return (
    <div className="w-full max-w-[min(100%,22rem)] sm:max-w-md">
      <motion.div
        layout={!reduced}
        className="overflow-hidden rounded-xl border border-white/15 bg-blayz-cream shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]"
      >
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-blayz-ink/10 bg-blayz-cream-deep px-3 py-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2 rounded-full bg-blayz-orange" />
            <span className="size-2 rounded-full bg-blayz-gold" />
            <span className="size-2 rounded-full bg-blayz-sage" />
          </span>
          <span className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-blayz-cream px-2 py-0.5 font-sans font-medium text-[9px] text-blayz-ink/50 sm:text-[10px]">
            {hasMaintenance && (
              <span
                className={clsx(
                  "size-1.5 shrink-0 rounded-full",
                  has("maintenance-premium")
                    ? "bg-blayz-gold"
                    : "bg-blayz-sage",
                )}
              />
            )}
            yourbrand.com
            {hasEcom && <span className="text-blayz-ink/30">/shop</span>}
          </span>
          <AnimatePresence mode="popLayout">
            {has("rush") && (
              <motion.span
                key="rush"
                {...pop}
                className="shrink-0 rounded bg-blayz-orange/20 px-1 py-0.5 font-sans font-bold text-[8px] text-blayz-orange"
              >
                ⚡ rush
              </motion.span>
            )}
            {has("seo") && (
              <motion.span
                key="seo"
                {...pop}
                className="shrink-0 rounded bg-blayz-sage/40 px-1 py-0.5 font-sans font-bold text-[8px] text-blayz-ink/70"
              >
                100
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* page body */}
        <motion.div
          layout={!reduced}
          dir={rtl ? "rtl" : "ltr"}
          className="flex max-h-[min(52vh,20rem)] flex-col gap-2 overflow-y-auto p-3 sm:max-h-[min(58vh,24rem)] sm:gap-2.5 sm:p-4 md:max-h-[min(62vh,28rem)] lg:max-h-[min(68vh,32rem)]"
        >
          {/* nav */}
          <motion.div layout={!reduced} className="flex items-center justify-between gap-2">
            <span className="wordmark shrink-0 text-xs text-blayz-ink sm:text-sm">
              blayz.
            </span>
            <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {has("extra-page") &&
                  ["home", "about", "blog"].map((tab) => (
                    <motion.span
                      key={tab}
                      {...pop}
                      className="h-1.5 w-5 shrink-0 rounded-full bg-blayz-ink/15 sm:w-6"
                    />
                  ))}
              </AnimatePresence>
              {!has("extra-page") && (
                <>
                  <span className="h-1.5 w-5 shrink-0 rounded-full bg-blayz-ink/15 sm:w-6" />
                  <span className="h-1.5 w-5 shrink-0 rounded-full bg-blayz-ink/15 sm:w-6" />
                </>
              )}
              <AnimatePresence mode="popLayout">
                {has("multilingual") && (
                  <motion.span
                    key="lang"
                    {...pop}
                    className="shrink-0 rounded border border-blayz-ink/15 px-1 font-sans text-[9px] text-blayz-ink/70"
                  >
                    ع / EN
                  </motion.span>
                )}
                {hasEcom && (
                  <motion.span
                    key="cart"
                    {...pop}
                    className="relative grid size-3.5 shrink-0 place-items-center rounded bg-blayz-orange/10 text-[8px] text-blayz-orange sm:size-4 sm:text-[9px]"
                  >
                    ⌗
                    <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-blayz-orange sm:-top-1 sm:-right-1 sm:size-2" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* hero */}
          <motion.div layout={!reduced} className="flex flex-col gap-1.5 py-0.5 sm:gap-2">
            {has("photography") ? (
              <motion.div
                layout={!reduced}
                className="aspect-[16/7] w-full overflow-hidden rounded-md bg-gradient-to-br from-blayz-ink/20 via-blayz-orange/20 to-blayz-gold/30"
              >
                <div className="flex h-full items-end p-2">
                  <span className="rounded bg-black/30 px-1.5 py-0.5 font-sans text-[8px] text-white/80">
                    pro photo
                  </span>
                </div>
              </motion.div>
            ) : (
              <>
                <div
                  className={clsx(
                    "h-3 rounded bg-blayz-ink/80 sm:h-3.5",
                    rtl ? "w-3/4 self-end" : "w-3/4",
                  )}
                />
                <div
                  className={clsx(
                    "h-3 rounded bg-blayz-orange sm:h-3.5",
                    rtl ? "w-1/2 self-end" : "w-1/2",
                  )}
                />
              </>
            )}

            <AnimatePresence>
              {has("multilingual") && (
                <motion.p
                  key="ar"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-sans text-xs text-blayz-ink/70 sm:text-sm"
                >
                  علامة تجارية لا تُنسى
                </motion.p>
              )}
            </AnimatePresence>

            {has("content") && (
              <motion.div
                layout={!reduced}
                className="flex flex-col gap-1"
              >
                <div className="h-1 w-full rounded bg-blayz-ink/12" />
                <div className="h-1 w-11/12 rounded bg-blayz-ink/12" />
                <div className="h-1 w-4/5 rounded bg-blayz-ink/12" />
              </motion.div>
            )}

            <div
              className="mt-0.5 flex gap-2"
              style={{ flexDirection: rtl ? "row-reverse" : "row" }}
            >
              <span className="h-4 w-16 rounded bg-blayz-orange sm:h-5 sm:w-20" />
              <span className="h-4 w-12 rounded border border-blayz-ink/20 sm:h-5 sm:w-16" />
            </div>
          </motion.div>

          {/* motion / 3D accents */}
          <AnimatePresence mode="popLayout">
            {has("three-d") && (
              <motion.div
                key="three-d"
                {...block}
                className="flex items-center gap-2 rounded-lg border border-blayz-gold/30 bg-blayz-gold/5 p-2"
              >
                <motion.div
                  className="size-8 rounded-md bg-gradient-to-br from-blayz-orange to-blayz-gold shadow-md"
                  animate={
                    reduced
                      ? undefined
                      : { rotateY: [0, 180, 360], rotateX: [0, 12, 0] }
                  }
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="h-1.5 w-full rounded bg-blayz-ink/15" />
                  <div className="h-1.5 w-2/3 rounded bg-blayz-ink/10" />
                </div>
              </motion.div>
            )}
            {has("rush") && !has("three-d") && (
              <motion.div key="rush-bar" {...block} className="overflow-hidden rounded">
                <div className="relative h-1.5 overflow-hidden rounded-full bg-blayz-ink/5">
                  <motion.div
                    className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-blayz-orange to-blayz-gold"
                    animate={reduced ? undefined : { x: ["-120%", "320%"] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            )}
            {has("three-d") && has("rush") && (
              <motion.div key="rush-tag" {...block}>
                <span className="font-sans text-[8px] font-bold text-blayz-orange/80">
                  accelerated delivery
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SEO snippet */}
          <AnimatePresence>
            {has("seo") && (
              <motion.div
                key="seo-snippet"
                {...block}
                className="rounded-lg border border-blayz-sage/30 bg-blayz-sage/5 p-2"
              >
                <p className="font-sans text-[8px] text-blayz-sage">google.com</p>
                <p className="font-sans text-[9px] font-medium text-blayz-ink/80">
                  Your Brand — Home
                </p>
                <div className="mt-1 h-1 w-full rounded bg-blayz-ink/10" />
                <div className="mt-0.5 h-1 w-4/5 rounded bg-blayz-ink/10" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* E-commerce grid */}
          <AnimatePresence>
            {has("ecom") && (
              <motion.div key="ecom" {...block} className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 rounded-md border border-blayz-ink/10 bg-blayz-cream-deep/60 p-1 sm:p-1.5"
                  >
                    <div
                      className={clsx(
                        "aspect-square rounded",
                        has("photography")
                          ? "bg-gradient-to-br from-blayz-ink/15 to-blayz-orange/25"
                          : "bg-blayz-ink/10",
                      )}
                    />
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
                className="flex items-center gap-2 rounded-lg border border-blayz-ink/10 bg-white/60 p-2"
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
                  <div className="h-3.5 w-16 rounded bg-blayz-orange/80 sm:h-4 sm:w-20" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CMS / training */}
          <AnimatePresence>
            {hasCms && (
              <motion.div
                key="cms"
                {...block}
                className="rounded-lg border border-blayz-sky/30 bg-blayz-sky/5 p-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans font-bold text-[8px] text-blayz-ink/70 sm:text-[9px]">
                    {has("cms-training") ? "✎ CMS + training" : "✎ self-edit"}
                  </span>
                  {has("extra-page") && (
                    <span className="font-sans text-[8px] text-blayz-ink/45">
                      +pages
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="h-1 flex-1 rounded bg-blayz-ink/12" />
                    {has("cms") && (
                      <span className="size-2 rounded border border-dashed border-blayz-sky/60" />
                    )}
                  </div>
                  <div className="h-1 w-3/4 rounded bg-blayz-ink/10" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* footer status row */}
          <motion.div
            layout={!reduced}
            className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-blayz-ink/10 pt-2"
          >
            <span className="h-1.5 min-w-[40%] flex-1 rounded bg-blayz-ink/10" />
            <AnimatePresence mode="popLayout">
              {hasMaintenance && (
                <motion.span
                  key="uptime"
                  {...pop}
                  className={clsx(
                    "rounded px-1.5 py-0.5 font-sans font-bold text-[8px] text-blayz-ink/70 sm:text-[9px]",
                    has("maintenance-premium")
                      ? "bg-blayz-gold/30"
                      : "bg-blayz-sage/40",
                  )}
                >
                  {has("maintenance-premium") ? "◈ priority 99.9%" : "◈ 99.9%"}
                </motion.span>
              )}
              {tier.id === "premium" && (
                <motion.span
                  key="tier"
                  {...pop}
                  className="rounded bg-blayz-orange/15 px-1.5 py-0.5 font-sans font-bold text-[8px] text-blayz-orange sm:text-[9px]"
                >
                  full stack
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      <p className="mt-2 text-center font-sans text-[9px] text-white/40 sm:mt-3 sm:text-[10px]">
        live preview · {tier.name.toLowerCase()} build
      </p>
    </div>
  );
}

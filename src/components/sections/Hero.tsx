"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HeroIndex } from "@/components/nav/HeroIndex";
import { useSite } from "@/components/providers/SiteProvider";
import { Logo } from "@/components/ui/Logo";

/**
 * Hero (PRD §7.1). Receives Stage A's landed wordmark (large, centered, solid
 * orange) and the centered Index, plus tagline + bracket CTA.
 */
export function Hero() {
  const { scrolled, introDone, scrollTo } = useSite();
  const showBig = !scrolled;

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* faint full-bleed arabesque watermark slot (PRD §7.1) */}
      <div className="arabesque-watermark pointer-events-none absolute inset-0 opacity-[0.05]" />

      <div className="relative flex flex-col items-center gap-10 text-center">
        {/* wordmark — docks to the header on Stage B via shared layoutId */}
        <AnimatePresence>
          {showBig && (
            <motion.button
              layoutId="blayz-logo"
              onClick={() => scrollTo("contact")}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="w-[44vw] h-[22vw] sm:w-[32vw] sm:h-[16vw] lg:w-[24rem] lg:h-[12rem] text-blayz-orange flex items-center justify-center"
              aria-label="Blayz"
            >
              <Logo fillColor="currentColor" className="w-full h-full" />
            </motion.button>
          )}
        </AnimatePresence>

        <HeroIndex />

        <motion.div
          initial={introDone ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: introDone ? 0 : 0.4, duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <p className="max-w-md text-balance font-sans text-lg text-blayz-ink/70">
            We build websites that build brands.
            <span className="mt-1 block font-mono text-sm text-blayz-ink/40">
              crafted with code &amp; culture
            </span>
          </p>

          <button
            onClick={() => scrollTo("contact")}
            className="group font-mono text-base text-blayz-ink transition-colors hover:text-blayz-orange"
          >
            <span className="text-blayz-orange">&lt;</span> start a project{" "}
            <span className="text-blayz-orange">/&gt;</span>
          </button>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showBig ? 1 : 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-blayz-ink/40"
      >
        scroll ↓
      </motion.div>
    </section>
  );
}

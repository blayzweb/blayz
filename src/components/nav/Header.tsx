"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";

/**
 * Persistent header (PRD §6.3). The small docked wordmark only mounts once
 * Stage B fires; it shares `layoutId="blayz-logo"` with the large Hero
 * wordmark so Framer Motion FLIP-animates the dock.
 */
export function Header() {
  const { scrolled, scrollTo, introDone } = useSite();
  const show = scrolled && introDone;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 h-16">
      <AnimatePresence>
        {show && (
          <motion.button
            layoutId="blayz-logo"
            onClick={() => scrollTo("hero")}
            className="wordmark pointer-events-auto absolute top-4 left-5 text-2xl text-blayz-orange sm:left-8"
            aria-label="Blayz — back to top"
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            blayz
          </motion.button>
        )}
      </AnimatePresence>
    </header>
  );
}

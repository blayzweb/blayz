"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";
import { Logo } from "@/components/ui/Logo";

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
            className="pointer-events-auto absolute top-2.5 left-5 flex h-12 w-24 items-center justify-center text-blayz-orange sm:left-8"
            aria-label="Blayz — back to top"
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <Logo fillColor="currentColor" className="w-full h-full" />
          </motion.button>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";
import { navFadeTransition } from "@/lib/nav-motion";
import { Logo } from "@/components/ui/Logo";

/**
 * Persistent header (PRD §6.3). The small docked wordmark is rendered once
 * the intro finishes. It is white with a subtle vignette in the Hero section,
 * transitioning to orange in the other sections.
 */
export function Header() {
  const { scrolled, scrollTo, introDone } = useSite();
  const show = introDone;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 h-16">
      {/* Subtle vignette for the logo when not scrolled */}
      <div
        className={`absolute top-0 left-0 w-[28rem] max-w-full h-[16rem] blur-2xl pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_60%)] ${
          scrolled || !introDone ? "opacity-0" : "opacity-100"
        }`}
      />

      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={navFadeTransition}
            onClick={() => scrollTo("hero")}
            className={`pointer-events-auto absolute top-2.5 left-5 flex h-12 w-24 items-center justify-center transition-colors duration-500 sm:left-8 ${
              scrolled ? "text-blayz-orange" : "text-white"
            }`}
            aria-label="Blayz: back to top"
          >
            <Logo fillColor="currentColor" className="w-full h-full" />
          </motion.button>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";
import { navFadeTransition } from "@/lib/nav-motion";
import { clsx } from "@/lib/clsx";
import { useNavSurface } from "@/lib/useNavSurface";
import type { NavSurface } from "@/lib/navSurface";
import { Logo } from "@/components/ui/Logo";

function headerLogoClass(scrolled: boolean, surface: NavSurface) {
  if (!scrolled) return "text-white";
  if (surface === "dark") return "text-blayz-cream";
  if (surface === "pattern") {
    return "text-blayz-ink drop-shadow-[0_0_10px_rgba(255,242,226,0.92)]";
  }
  return "text-blayz-orange";
}

/**
 * Persistent header (PRD §6.3). The small docked wordmark is rendered once
 * the intro finishes. It is white with a subtle vignette in the Hero section,
 * then adapts to the scrolling surface (orange on light, cream on dark, ink
 * on patterned transitions).
 */
export function Header() {
  const logoRef = useRef<HTMLButtonElement>(null);
  const { scrolled, scrollTo, introDone, heroReady } = useSite();
  const show = introDone && heroReady;
  const surface = useNavSurface(logoRef, show);

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
            ref={logoRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={navFadeTransition}
            onClick={() => scrollTo("hero")}
            className={clsx(
              "pointer-events-auto absolute top-2.5 left-5 flex h-12 w-24 items-center justify-center transition-[color,filter] duration-500 sm:left-8",
              headerLogoClass(scrolled, surface),
            )}
            aria-label="Blayz: back to top"
          >
            <Logo fillColor="currentColor" className="w-full h-full" />
          </motion.button>
        )}
      </AnimatePresence>
    </header>
  );
}

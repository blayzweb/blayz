"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS } from "@/lib/sections";
import { useSite } from "@/components/providers/SiteProvider";
import { clsx } from "@/lib/clsx";

/**
 * The Index in its scrolled state (PRD §6.4): fixed left, compact vertical
 * list, active section highlighted in orange with an ASCII bracket marker.
 * Hidden on small screens (mobile uses the header toggle — PRD §11).
 */
export function SidebarIndex() {
  const { scrolled, introDone, activeSection, scrollTo } = useSite();
  const show = scrolled && introDone;

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Sections"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex"
        >
          {SECTIONS.map((s) => {
            const active = activeSection === s.id;
            return (
              <motion.button
                key={s.id}
                layoutId={`idx-${s.id}`}
                onClick={() => scrollTo(s.id)}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="group flex items-center gap-2 text-left"
                aria-current={active ? "true" : undefined}
              >
                <span
                  className={clsx(
                    "font-mono text-xs transition-colors",
                    active ? "text-blayz-orange" : "text-blayz-ink/40",
                  )}
                >
                  {s.index}
                </span>
                <span
                  className={clsx(
                    "font-mono text-xs tracking-tight transition-colors",
                    active
                      ? "text-blayz-orange"
                      : "text-blayz-ink/50 group-hover:text-blayz-ink",
                  )}
                >
                  {active ? `[ ${s.label} ]` : s.label}
                </span>
              </motion.button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

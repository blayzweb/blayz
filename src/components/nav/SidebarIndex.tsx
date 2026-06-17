"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS } from "@/lib/sections";
import { useSite } from "@/components/providers/SiteProvider";
import { IndexNavItem } from "@/components/nav/IndexNavItem";

/**
 * The Index in its scrolled state (PRD §6.4): fixed left, compact vertical
 * list of `[ 01 ]` / `Hero` pairs, active section in orange with bracket
 * markers on the label. Hidden on small screens (PRD §11).
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
          className="fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 sm:left-8 md:flex"
        >
          {/* left rail — mirrors the Spine rail on the right (PRD §5 layout) */}
          <div
            aria-hidden
            className="mr-3 w-px self-stretch bg-blayz-orange/20"
          />

          <div className="flex flex-col gap-4">
            {SECTIONS.map((s) => (
              <IndexNavItem
                key={s.id}
                section={s}
                active={activeSection === s.id}
                variant="sidebar"
                layoutId={`idx-${s.id}`}
                onClick={() => scrollTo(s.id)}
              />
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

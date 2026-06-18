"use client";

import { motion } from "framer-motion";
import { SECTIONS } from "@/lib/sections";
import { useSite } from "@/components/providers/SiteProvider";
import { IndexNavItem } from "@/components/nav/IndexNavItem";
import { useFooterClamp } from "@/lib/useFooterClamp";

/**
 * Sidebar Index (PRD §6.4): docked section nav after Stage B.
 * Bracket labels, active state, Lenis scroll — no decorative patterns here.
 */
export function SidebarIndex() {
  const { scrolled, introDone, activeSection, scrollTo } = useSite();
  const show = scrolled && introDone;
  const clamp = useFooterClamp(show);

  if (!show) return null;

  return (
    <motion.nav
      aria-label="Sections"
      className="fixed left-5 z-40 hidden flex-col justify-center sm:left-8 md:flex"
      style={{
        top: clamp.top,
        bottom: clamp.bottom,
        transition: "top 0.45s ease, bottom 0.45s ease",
      }}
    >
      <div className="relative flex flex-col">
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-0 w-px bg-blayz-orange/20"
        />

        <div className="flex flex-col gap-4 pl-4">
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
      </div>
    </motion.nav>
  );
}

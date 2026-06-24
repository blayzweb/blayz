"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS } from "@/lib/sections";
import { useSite } from "@/components/providers/SiteProvider";
import { IndexNavItem } from "@/components/nav/IndexNavItem";
import { useSidebarTop } from "@/lib/useFooterClamp";
import { useSidebarSurface } from "@/lib/useSidebarSurface";
import { clsx } from "@/lib/clsx";

/**
 * Sidebar Index (PRD §6.4): docked section nav after Stage B.
 * Bracket labels, active state, Lenis scroll — no decorative patterns here.
 */
export function SidebarIndex() {
  const navRef = useRef<HTMLElement>(null);
  const { scrolled, introDone, activeSection, scrollTo } = useSite();
  const show = scrolled && introDone;
  const top = useSidebarTop(navRef, show);
  const surface = useSidebarSurface(navRef, show);
  const onDark = surface === "dark";

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          ref={navRef}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-label="Sections"
          className="fixed left-5 z-40 hidden flex-col sm:left-8 md:flex"
          style={{ y: top, top: 0 }}
        >
          <div className="relative flex flex-col">
            <div
              aria-hidden
              className={clsx(
                "absolute top-0 bottom-0 left-0 w-px transition-colors duration-500 ease-out",
                onDark ? "bg-blayz-orange/30" : "bg-blayz-orange/20",
              )}
            />

            <div className="flex flex-col gap-4 pl-4">
              {SECTIONS.map((s) => (
                <IndexNavItem
                  key={s.id}
                  section={s}
                  active={activeSection === s.id}
                  variant="sidebar"
                  surface={surface}
                  layoutId={`idx-${s.id}`}
                  onClick={() => scrollTo(s.id)}
                />
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

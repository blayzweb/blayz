"use client";

import { motion } from "framer-motion";
import { SECTIONS } from "@/lib/sections";
import { useSite } from "@/components/providers/SiteProvider";

/**
 * The Index in its Hero state (PRD §6.4 / §7.1): centered list, larger type.
 * Each item shares `layoutId` with its SidebarIndex counterpart for the
 * Stage B dock animation.
 */
export function HeroIndex() {
  const { scrolled, introDone, scrollTo } = useSite();
  if (scrolled) return null;

  return (
    <nav
      aria-label="Sections"
      className="mx-auto grid w-fit grid-cols-2 gap-x-12 gap-y-3 sm:gap-x-20"
    >
      {SECTIONS.map((s, i) => (
        <motion.button
          key={s.id}
          layoutId={`idx-${s.id}`}
          onClick={() => scrollTo(s.id)}
          initial={introDone ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            layout: { type: "spring", stiffness: 220, damping: 26 },
            delay: introDone ? 0 : 0.05 * i,
          }}
          className="group flex items-baseline gap-3 text-left"
        >
          <span className="font-mono text-sm text-blayz-orange">
            [ {s.index} ]
          </span>
          <span className="font-display text-xl text-blayz-ink transition-colors group-hover:text-blayz-orange sm:text-2xl">
            {s.label}
          </span>
        </motion.button>
      ))}
    </nav>
  );
}

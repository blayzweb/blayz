"use client";

import { motion } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";
import { SpineSegment } from "@/components/spine/SpineSegment";
import { SECTIONS } from "@/lib/sections";
import {
  useContentScrollProgress,
  useFooterClamp,
} from "@/lib/useFooterClamp";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The Spine (PRD §6.5): a thin right rail whose pattern shifts per section.
 * Atmospheric accent — not a second nav. Hidden below lg.
 */
export function Spine() {
  const { activeSection, introDone } = useSite();
  const reduced = useReducedMotion();
  const clamp = useFooterClamp(introDone);
  const progress = useContentScrollProgress(introDone);

  if (!introDone) return null;

  return (
    <motion.aside
      aria-hidden
      initial={reduced ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed right-4 z-30 hidden w-20 overflow-visible lg:right-6 lg:block"
      style={{ top: clamp.top, bottom: clamp.bottom }}
    >
      <div className="absolute inset-y-0 left-0 w-px bg-blayz-orange/16" />
      <motion.div
        className="absolute inset-y-0 left-0 w-px origin-top bg-blayz-orange/65"
        style={{ scaleY: reduced ? 1 : progress }}
      />

      <motion.div
        className="absolute left-0 z-10 size-1.5 -translate-x-[2.5px] -translate-y-1/2 rounded-full bg-blayz-orange shadow-[0_0_0_3px_rgba(255,242,226,0.72)]"
        style={{ top: `${progress * 100}%` }}
      />

      <div className="absolute inset-y-0 left-1 w-[4.5rem] overflow-visible">
        {SECTIONS.map((s) => (
          <SpineSegment
            key={s.id}
            sectionId={s.id}
            active={activeSection === s.id}
            introDone={introDone}
          />
        ))}
      </div>
    </motion.aside>
  );
}

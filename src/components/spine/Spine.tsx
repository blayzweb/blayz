"use client";

import { motion } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";
import {
  useContentScrollProgress,
  useFooterClamp,
} from "@/lib/useFooterClamp";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The Spine (PRD §6.5): a thin right rail serving as a scroll progress tracker.
 * Hidden below lg.
 */
export function Spine() {
  const { introDone } = useSite();
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
      className="pointer-events-none fixed right-5 z-30 hidden w-px overflow-visible lg:right-8 lg:block"
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
    </motion.aside>
  );
}

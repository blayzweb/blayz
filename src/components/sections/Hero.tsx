"use client";

import { motion } from "framer-motion";
import { useSite } from "@/components/providers/SiteProvider";
import { HeroCanvas } from "@/components/sections/HeroCanvas";

/**
 * Hero (PRD §7.1). Renders the scroll-through 3D scene.
 */
export function Hero() {
  const { scrolled } = useSite();
  const showBig = !scrolled;

  return (
    <HeroCanvas>
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
        {/* faint full-bleed arabesque watermark slot (PRD §7.1) */}
        <div className="arabesque-watermark pointer-events-none absolute inset-0 opacity-[0.05]" />

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showBig ? 1 : 0 }}
          transition={{ delay: 0.8 }}
          className="hero-fade-out absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-blayz-ink/40"
        >
          scroll ↓
        </motion.div>
      </div>
    </HeroCanvas>
  );
}

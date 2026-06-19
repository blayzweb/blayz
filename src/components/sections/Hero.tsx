"use client";

import { HeroCanvas } from "@/components/sections/HeroCanvas";

/**
 * Hero (PRD §7.1). Renders the scroll-through 3D scene with Stage A elements.
 */
export function Hero() {
  return (
    <HeroCanvas>
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
        {/* faint full-bleed arabesque watermark slot (PRD §7.1) */}
        <div className="arabesque-watermark pointer-events-none absolute inset-0 opacity-[0.05]" />
      </div>
    </HeroCanvas>
  );
}

"use client";

import { useMemo } from "react";
import { SpineSegment } from "./SpineSegment";
import { useSite } from "@/components/providers/SiteProvider";
import {
  bloomVine,
  terminalLines,
  saduBand,
  synthesisVine,
} from "@/lib/patterns";

/**
 * The Spine (PRD §6.5): a thin fixed rail on the right edge. Each section owns
 * one segment that draws as you pass through it, so the whole rail reads as a
 * single element whose character changes section to section.
 *
 * Hidden on small screens (PRD §11 mobile note).
 */
export function Spine() {
  const { activeSection, introDone } = useSite();

  // Patterns are deterministic; memoise so refs stay stable across renders.
  const patterns = useMemo(
    () => ({
      heroBloom: bloomVine(80, 600, 9),
      aboutBloom: bloomVine(80, 600, 11),
      terminal: terminalLines(80, 600, 26),
      sadu: saduBand(80, 600, 14),
      synthesis: synthesisVine(80, 600),
    }),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden w-16 md:block lg:w-20"
    >
      {/* the constant rail */}
      <div className="absolute inset-y-0 left-0 w-px bg-blayz-orange/25" />

      {/* per-section segments (stacked, crossfaded by active section) */}
      <SpineSegment
        paths={patterns.heroBloom}
        color="var(--blayz-orange)"
        sectionId="hero"
        mode="load"
        active={activeSection === "hero"}
        ready={introDone}
      />
      <SpineSegment
        paths={patterns.aboutBloom}
        color="var(--blayz-peach)"
        sectionId="about"
        mode="scrub"
        active={activeSection === "about"}
      />
      <SpineSegment
        paths={patterns.terminal}
        color="var(--blayz-gold)"
        sectionId="services"
        mode="scrub"
        active={activeSection === "services"}
      />
      <SpineSegment
        paths={patterns.sadu}
        color="var(--blayz-gold)"
        sectionId="pricing"
        mode="scrub"
        active={activeSection === "pricing"}
      />
      <SpineSegment
        paths={patterns.synthesis}
        color="var(--blayz-orange)"
        sectionId="contact"
        mode="scrub"
        active={activeSection === "contact"}
      />
    </div>
  );
}

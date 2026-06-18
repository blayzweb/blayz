"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  SPINE_VIEW_HEIGHT,
  SPINE_WIDTH,
  spinePathsFor,
} from "@/lib/spine-patterns";
import type { SectionId } from "@/lib/sections";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface SpineSegmentProps {
  sectionId: SectionId;
  active: boolean;
  introDone: boolean;
}

export function SpineSegment({
  sectionId,
  active,
  introDone,
}: SpineSegmentProps) {
  const reduced = useReducedMotion();
  const scopeRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => spinePathsFor(sectionId), [sectionId]);

  useGSAP(
    () => {
      if (!introDone) return;

      const targets = svgRef.current?.querySelectorAll<SVGPathElement>("path");
      if (!targets?.length) return;
      const stem = svgRef.current?.querySelectorAll<SVGPathElement>(
        '[data-layer="stem"]',
      );
      const motifs = svgRef.current?.querySelectorAll<SVGPathElement>(
        '[data-layer="motif"]',
      );
      const accents = svgRef.current?.querySelectorAll<SVGPathElement>(
        '[data-layer="accent"]',
      );

      if (reduced) {
        if (stem?.length) {
          gsap.set(stem, { strokeDashoffset: 0, opacity: 0.78 });
        }
        if (motifs?.length) {
          gsap.set(motifs, { strokeDashoffset: 0, opacity: 1 });
        }
        if (accents?.length) {
          gsap.set(accents, { strokeDashoffset: 0, opacity: 0.58 });
        }
        return;
      }

      targets.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 0,
        });
      });

      const trigger = document.getElementById(sectionId);
      if (!trigger) return;

      const buildTimeline = (scrollLinked: boolean) => {
        const timeline = gsap.timeline(
          scrollLinked
            ? {
                scrollTrigger: {
                  trigger,
                  start: "top 88%",
                  end: "center 24%",
                  scrub: 1.15,
                },
              }
            : undefined,
        );

        if (stem?.length) {
          timeline.to(stem, {
            strokeDashoffset: 0,
            opacity: 0.78,
            duration: 1.15,
            ease: scrollLinked ? "none" : "power2.out",
          });
        }

        if (motifs?.length) {
          timeline.to(
            motifs,
            {
              strokeDashoffset: 0,
              opacity: 1,
              duration: 0.72,
              stagger: {
                each: 0.09,
                from: "start",
              },
              ease: scrollLinked ? "none" : "power2.out",
            },
            stem?.length ? "-=0.42" : 0,
          );
        }

        if (accents?.length) {
          timeline.to(
            accents,
            {
              strokeDashoffset: 0,
              opacity: 0.58,
              duration: 0.45,
              stagger: 0.045,
              ease: scrollLinked ? "none" : "power2.out",
            },
            "-=0.28",
          );
        }

        return timeline;
      };

      if (sectionId === "hero") {
        const timeline = buildTimeline(false);
        timeline.delay(0.2);
        return;
      }

      buildTimeline(true);
    },
    { scope: scopeRef, dependencies: [introDone, reduced, sectionId] },
  );

  return (
    <motion.div
      ref={scopeRef}
      className="pointer-events-none absolute inset-0 origin-center"
      initial={false}
      animate={{
        opacity: active ? 0.82 : 0,
        x: active ? 0 : 8,
      }}
      transition={{
        duration: reduced ? 0.01 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden={!active}
    >
      <div className="absolute inset-0">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SPINE_WIDTH} ${SPINE_VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full overflow-visible"
          aria-hidden
          fill="none"
        >
          {paths.map((p, i) => (
            <path
              key={`${sectionId}-${i}`}
              d={p.d}
              transform={p.transform}
              data-layer={p.layer ?? "motif"}
              stroke={
                sectionId === "pricing"
                  ? "#7A1118"
                  : sectionId === "services"
                    ? "var(--blayz-peach)"
                    : "var(--blayz-orange)"
              }
              strokeWidth={
                p.layer === "stem" ? 0.8 : p.layer === "accent" ? 0.62 : 0.92
              }
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { SectionId } from "@/lib/sections";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { clsx } from "@/lib/clsx";

interface SpineSegmentProps {
  paths: { d: string; transform?: string }[];
  /** Stroke colour (any CSS colour / var). */
  color: string;
  /** Section that scopes this segment's scroll trigger. */
  sectionId: SectionId;
  /** "scrub" = tied to scroll through the section; "load" = draws once. */
  mode: "scrub" | "load";
  /** Whether the segment's section is currently active (drives opacity). */
  active: boolean;
  /** Gate load-mode animations until the intro handoff completes. */
  ready?: boolean;
  strokeWidth?: number;
}

/**
 * One Spine segment (PRD §6.5). Each path uses SVG `pathLength={1}` so a single
 * strokeDashoffset 1 -> 0 fully draws it regardless of geometry.
 */
export function SpineSegment({
  paths,
  color,
  sectionId,
  mode,
  active,
  ready = true,
  strokeWidth = 1.4,
}: SpineSegmentProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const targets = ref.current?.querySelectorAll<SVGPathElement>("path");
      if (!targets || targets.length === 0) return;

      if (reduced) {
        gsap.set(targets, { strokeDashoffset: 0 });
        return;
      }

      // Dynamically measure path lengths and set stroke properties to hide them completely
      targets.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      if (mode === "scrub") {
        const trigger = document.getElementById(sectionId);
        if (!trigger) return;
        gsap.to(targets, {
          strokeDashoffset: 0,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom center",
            scrub: true,
          },
        });
      } else if (ready) {
        gsap.to(targets, {
          strokeDashoffset: 0,
          ease: "power2.out",
          duration: 1.1,
          stagger: 0.08,
        });
      }
    },
    { scope: ref, dependencies: [reduced, mode, ready, sectionId] },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 80 600"
      preserveAspectRatio="none"
      aria-hidden
      className={clsx(
        "absolute inset-0 h-full w-full transition-opacity duration-700",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          transform={p.transform}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

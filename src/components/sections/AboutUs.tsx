"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { bloomMedallion } from "@/lib/patterns";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * About Us (PRD §7.2). The core ASCII-arabesque bloom at full expression —
 * a generator-style medallion drawn progressively as the user scrolls, with
 * philosophy + founder copy alongside. Leans into --blayz-peach.
 */
export function AboutUs() {
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => bloomMedallion(600, 4), []);

  useGSAP(
    () => {
      const targets = svgRef.current?.querySelectorAll("path");
      if (!targets) return;
      if (reduced) {
        gsap.set(targets, { strokeDashoffset: 0 });
        return;
      }
      const trigger = document.getElementById("about");
      if (!trigger) return;
      gsap.set(targets, { strokeDashoffset: 1 });
      gsap.to(targets, {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger,
          start: "top 70%",
          end: "bottom 80%",
          scrub: true,
        },
      });
    },
    { scope: svgRef, dependencies: [reduced] },
  );

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-blayz-cream px-6 py-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* Medallion centerpiece */}
        <div className="relative mx-auto aspect-square w-full max-w-lg">
          <div className="absolute inset-0 rounded-full bg-blayz-peach/20 blur-3xl" />
          <svg
            ref={svgRef}
            viewBox="0 0 600 600"
            className="relative h-full w-full"
            aria-hidden
          >
            {paths.map((p, i) => (
              <path
                key={i}
                d={p.d}
                fill="none"
                stroke={i % 2 === 0 ? "var(--blayz-orange)" : "var(--blayz-peach)"}
                strokeWidth={1.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
              />
            ))}
          </svg>
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-8">
          <p className="font-mono text-sm text-blayz-orange">[ 02 ] About</p>
          <h2 className="font-display text-4xl leading-tight text-blayz-ink sm:text-5xl">
            A studio where ornament
            <br />
            meets the command line.
          </h2>
          <p className="max-w-prose font-sans text-lg text-blayz-ink/70">
            Blayz is a design-and-build studio fusing Arabic geometric
            tradition — arabesque, Sadu, Tatreez — with the rigour of modern
            web engineering. Every project is{" "}
            <span className="font-kufi text-blayz-orange">
              crafted with code &amp; culture
            </span>
            : systems that are beautiful, fast, and unmistakably yours.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {FOUNDERS.map((person) => (
              <div
                key={person.name}
                className="rounded-lg border border-blayz-ink/10 bg-white/40 p-5"
              >
                <p className="font-mono text-xs text-blayz-ink/40">
                  ┌ {person.role}
                </p>
                <p className="mt-2 font-display text-xl text-blayz-ink">
                  {person.name}
                </p>
                <p className="mt-1 font-sans text-sm text-blayz-ink/60">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const FOUNDERS = [
  {
    name: "Anas",
    role: "design + direction",
    bio: "Leads the visual system — type, ornament, and the brand story.",
  },
  {
    name: "The studio",
    role: "code + craft",
    bio: "Engineers the experience end to end, from pixels to deploys.",
  },
];

"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { bloomMedallion } from "@/lib/patterns";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useSite } from "@/components/providers/SiteProvider";

/**
 * About Us (PRD §7.2). The core ASCII-arabesque bloom at full expression —
 * a generator-style medallion drawn progressively as the user scrolls, with
 * philosophy + founder copy alongside. Leans into --blayz-peach.
 */
export function AboutUs() {
  const reduced = useReducedMotion();
  const { introDone } = useSite();
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => bloomMedallion(600, 4), []);

  useGSAP(
    () => {
      if (!introDone) return;

      const targets = svgRef.current?.querySelectorAll<SVGPathElement>("path");
      if (!targets || targets.length === 0) return;

      if (reduced) {
        gsap.set(targets, { strokeDashoffset: 0, fillOpacity: 1 });
        return;
      }

      // Dynamically measure path lengths and set stroke properties to hide them completely
      targets.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fillOpacity: 0,
        });
      });

      const trigger = svgRef.current;
      if (!trigger) return;

      const guides = svgRef.current?.querySelectorAll('[data-layer="guides"]');
      const l3 = svgRef.current?.querySelectorAll('[data-layer="l3"]');
      const l2 = svgRef.current?.querySelectorAll('[data-layer="l2"]');
      const l1 = svgRef.current?.querySelectorAll('[data-layer="l1"]');
      const core = svgRef.current?.querySelectorAll('[data-layer="core"]');
      const particles = svgRef.current?.querySelectorAll('[data-layer="particles"]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top 80%", // starts when the top of the SVG enters well into viewport
          end: "center 35%",   // stretched scroll distance makes drawing happen slower
          scrub: 1.5,       // slightly more inertia catch-up lag for premium, relaxed pacing
        },
      });

      // Bloom sequence (outside to inside, then core and scattered particles)
      if (guides && guides.length > 0) {
        tl.to(guides, { strokeDashoffset: 0, duration: 0.6 }, 0);
      }
      if (l3 && l3.length > 0) {
        tl.to(l3, { strokeDashoffset: 0, duration: 1.0, stagger: 0.08 }, 0.2);
      }
      if (l2 && l2.length > 0) {
        tl.to(l2, { strokeDashoffset: 0, duration: 1.0, stagger: 0.08 }, 0.5);
      }
      if (l1 && l1.length > 0) {
        tl.to(l1, { strokeDashoffset: 0, duration: 0.8, stagger: 0.06 }, 0.8);
      }
      if (core && core.length > 0) {
        tl.to(core, { strokeDashoffset: 0, duration: 0.4 }, 1.1);
        tl.to(core, { fillOpacity: 1, duration: 0.3 }, 1.3);
      }
      if (particles && particles.length > 0) {
        tl.to(particles, { strokeDashoffset: 0, duration: 0.6, stagger: 0.04 }, 1.2);
        tl.to(particles, { fillOpacity: 1, duration: 0.4 }, 1.6);
      }
    },
    { scope: sectionRef, dependencies: [reduced, introDone] },
  );
 
  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-blayz-cream px-6 md:px-28 lg:px-36 pt-20 pb-12 sm:pt-24 sm:pb-16"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* Medallion centerpiece */}
        <div className="relative mx-auto aspect-square w-full max-w-lg">
          <svg
            ref={svgRef}
            viewBox="0 0 600 600"
            className="relative h-full w-full"
            aria-hidden
          >
            {paths.map((p, i) => {
              const isGuide = p.layer === "guides";
              const isParticle = p.layer === "particles";
              const isCore = p.layer === "core";
              
              // Determine dynamic fill based on layered arabesque specs
              let fill = "none";
              if (isCore) {
                // Outer core circle (r=7, contains '7') is cream filled to mask guides.
                // Inner core circle (r=2.5) is filled with orange.
                fill = p.d.includes("7") ? "var(--blayz-cream)" : "var(--blayz-orange)";
              } else if (isParticle) {
                // Plus shapes have no Z (not closed); diamond shapes are closed with Z
                if (p.d.includes("Z")) {
                  fill = i % 2 === 0 ? "var(--blayz-orange)" : "var(--blayz-peach)";
                }
              }
              
              return (
                <path
                  key={i}
                  d={p.d}
                  transform={p.transform}
                  data-layer={p.layer}
                  fill={fill}
                  stroke={isGuide ? "var(--blayz-orange)" : (i % 2 === 0 ? "var(--blayz-orange)" : "var(--blayz-peach)")}
                  strokeWidth={isGuide ? 0.8 : (isParticle ? 1.4 : 1.2)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isGuide ? 0.18 : 1}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 rounded-full bg-blayz-peach/20 blur-3xl" />
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-8">
          <p className="font-sans text-sm text-blayz-orange">[ 02 ] About</p>
          <h2 className="font-display text-4xl leading-tight font-bold tracking-tight text-blayz-ink sm:text-5xl">
            We build websites
            <br />
            that build brands.
          </h2>
          <p className="max-w-prose font-sans text-lg text-blayz-ink/70">
            Blayz is a web development studio focused on giving local businesses a
            better platform to match their identity, or a thoughtful refresh to their
            existing one. We believe in your brand&rsquo;s story, and we&rsquo;re
            here to help you take that further.
          </p>
        </div>
      </div>
    </section>
  );
}

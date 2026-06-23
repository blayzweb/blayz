"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { TerminalFrame } from "@/components/ui/TerminalFrame";
import { AsciiTag } from "@/components/ui/AsciiTag";
import { SERVICES, BOOT_SEQUENCE } from "@/content/services";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Services (PRD §7.3). Pseudo-terminal chrome on --blayz-ink. A boot sequence
 * plays once on first viewport entry, then the output area morphs into the
 * services grid. Inside the frame, cards use normal UI styling; only labels
 * stay JetBrains Mono.
 */
export function Services() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLPreElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const boot = bootRef.current;
      const grid = gridRef.current;
      if (!boot || !grid) return;

      const lines = boot.querySelectorAll("[data-line]");
      const cards = grid.querySelectorAll("[data-card]");

      if (reduced) {
        gsap.set(boot, { display: "none" });
        gsap.set(grid, { opacity: 1 });
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(lines, { opacity: 0, y: 4 });
      gsap.set(grid, { opacity: 0 });
      gsap.set(cards, { opacity: 0, y: 16 });

      const tl = gsap.timeline({ paused: true });
      tl.to(lines, { opacity: 1, y: 0, duration: 0.12, stagger: 0.09 })
        .to(boot, { opacity: 0, height: 0, duration: 0.4 }, "+=0.4")
        .set(boot, { display: "none" })
        .to(grid, { opacity: 1, duration: 0.3 })
        .to(
          cards,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          "<",
        );

      const trigger = document.getElementById("services");
      if (!trigger) return;
      const st = ScrollTrigger.create({
        trigger,
        start: "top 55%",
        once: true,
        onEnter: () => tl.play(),
      });
      return () => st.kill();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="services"
      className="relative bg-blayz-ink px-6 md:px-28 lg:px-36 pt-16 pb-16 text-blayz-cream"
    >
      <div ref={root} className="mx-auto max-w-5xl">
        <p className="mb-8 font-sans text-sm text-blayz-orange">
          [ 03 ] Services
        </p>

        <TerminalFrame>
          {/* Boot log */}
          <pre
            ref={bootRef}
            className="overflow-hidden font-mono text-xs leading-relaxed text-blayz-cream/80 sm:text-sm"
            aria-hidden
          >
            {BOOT_SEQUENCE.map((line, i) => (
              <div key={i} data-line className="min-h-[1.2em]">
                {line || "\u00A0"}
              </div>
            ))}
          </pre>

          {/* Services grid (morph target) */}
          <div
            ref={gridRef}
            className="grid gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {SERVICES.map((s) => (
              <div
                key={s.tag}
                data-card
                className="group flex flex-col gap-3 bg-blayz-ink-soft p-6 transition-colors hover:bg-blayz-ink"
              >
                <AsciiTag className="text-blayz-orange">{s.tag}</AsciiTag>
                <h3 className="font-display text-xl text-blayz-cream">
                  {s.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-blayz-cream/60">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </TerminalFrame>
      </div>
    </section>
  );
}

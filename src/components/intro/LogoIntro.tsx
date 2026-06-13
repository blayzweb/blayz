"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { INTRO_FRAMES } from "./frames";

/**
 * Stage A intro (PRD §6.1). The wordmark acts as a window: a stack of full-bleed
 * fills cycles through it (craft -> code -> brand) while the composition scales.
 *
 * The fills here are PROCEDURAL PLACEHOLDERS for Anas's texture PNGs (PRD §8
 * assets #1–6) — swap each frame's `background` for an <img> / texture when the
 * real assets land. We use `background-clip: text` so the letterforms mask the
 * fills without needing the wordmark's SVG path data.
 */
export function LogoIntro() {
  const { setIntroDone } = useSite();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const layers = wrap.current?.querySelectorAll<HTMLElement>("[data-frame]");
      if (!layers) return;

      const finish = () => setIntroDone(true);

      if (reduced) {
        // Single white -> brand-orange crossfade, then reveal (PRD §11).
        gsap.set(layers, { opacity: 0 });
        const white = layers[0];
        const brand = layers[layers.length - 1];
        const tl = gsap.timeline({ onComplete: finish });
        tl.set(white, { opacity: 1 })
          .to(white, { opacity: 0, duration: 0.4 }, 0.2)
          .to(brand, { opacity: 1, duration: 0.4 }, 0.2)
          .to(backdrop.current, { backgroundColor: "var(--blayz-cream)", duration: 0.4 }, 0.4)
          .to(root.current, { autoAlpha: 0, duration: 0.3 }, "+=0.2");
        return;
      }

      gsap.set(layers, { opacity: 0 });
      gsap.set(layers[0], { opacity: 1 });

      const tl = gsap.timeline({ onComplete: finish });

      // Continuous slow scale of the whole composition.
      tl.to(
        wrap.current,
        { scale: 1.18, duration: 3.0, ease: "power1.inOut" },
        0,
      );

      // Crossfade each frame in sequence (~0.35s window, 0.15s crossfade).
      const win = 0.35;
      for (let i = 1; i < layers.length; i++) {
        const at = win * i;
        const dur = i === layers.length - 1 ? 0.25 : 0.15;
        tl.to(layers[i], { opacity: 1, duration: dur }, at);
        if (i > 0) tl.to(layers[i - 1], { opacity: 0, duration: dur }, at);
      }

      // Hold on brand orange, then hand off: ink -> cream, scale toward Hero, fade out.
      const holdAt = win * layers.length + 0.2;
      tl.to(
        backdrop.current,
        { backgroundColor: "var(--blayz-cream)", duration: 0.5 },
        holdAt,
      )
        .to(wrap.current, { scale: 1.05, duration: 0.6, ease: "power2.inOut" }, holdAt)
        .to(root.current, { autoAlpha: 0, duration: 0.4 }, holdAt + 0.4);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-label="Loading Blayz"
    >
      <div
        ref={backdrop}
        className="absolute inset-0"
        style={{ backgroundColor: "var(--blayz-ink)" }}
      />
      <div ref={wrap} className="relative">
        {INTRO_FRAMES.map((frame) => (
          <span
            key={frame.id}
            data-frame
            className="wordmark absolute inset-0 flex items-center justify-center text-[22vw] sm:text-[16vw] lg:text-[12rem]"
            style={{
              background: frame.background,
              backgroundSize: frame.size,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
            aria-hidden
          >
            blayz
          </span>
        ))}
        {/* spacer to give the absolutely-positioned layers a box to fill */}
        <span
          className="wordmark invisible text-[22vw] sm:text-[16vw] lg:text-[12rem]"
          aria-hidden
        >
          blayz
        </span>
      </div>
    </div>
  );
}

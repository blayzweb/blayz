"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { INTRO_FAILSAFE_MS, lockPageScroll } from "./introUtils";
import { LOGO_PATH } from "./logoPath";

/**
 * Stage A intro (PRD §6.1).
 * Custom B&W Zoom-reveal transition:
 * - A white logo starts small and centered on a black background.
 * - Gentle breathing pulse while loading the 3D assets.
 * - When loaded, zooms through a mask cutout in the black background.
 * - The white logo fades to transparent, revealing the 3D scene inside the letters.
 * - The cutout expands to infinity to reveal the whole scene.
 */
export function LogoIntro() {
  const { setIntroDone, lockScroll, heroLoaded } = useSite();
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<SVGRectElement>(null);
  const maskLogoRef = useRef<SVGGElement>(null);
  const whiteLogoRef = useRef<SVGGElement>(null);
  const pulseTweenRef = useRef<gsap.core.Tween | null>(null);

  const finish = useCallback(() => {
    setIntroDone(true);
    setDismissed(true);
  }, [setIntroDone]);

  useGSAP(
    () => {
      if (dismissed) return;

      if (!heroLoaded) {
        // While loading, play a gentle pulsing animation around the 0.25 starting scale
        if (whiteLogoRef.current) {
          pulseTweenRef.current = gsap.to(whiteLogoRef.current, {
            scale: 0.26,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "724px 362px",
          });
        }
        return;
      }

      // If we reach here, hero has loaded. Kill the pulse tween.
      pulseTweenRef.current?.kill();

      if (!root.current || !maskLogoRef.current || !whiteLogoRef.current || !backdropRef.current) return;

      let finished = false;
      const complete = () => {
        if (finished) return;
        finished = true;
        gsap.set(root.current, {
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
        });
        lockScroll(false);
        lockPageScroll(false);
        finish();
      };

      lockScroll(true);
      lockPageScroll(true);

      const failsafe = window.setTimeout(complete, INTRO_FAILSAFE_MS);

      const tl = gsap.timeline({ paused: true });

      if (reduced) {
        // Fallback: fade out white logo and backdrop in case of reduced motion setting
        tl.to(whiteLogoRef.current, { opacity: 0, duration: 0.6 }, 0.2)
          .to(backdropRef.current, { opacity: 0, duration: 0.6 }, 0.2);
      } else {
        // Set initial state: start small (scale 0.25) centered on the logo
        gsap.set([whiteLogoRef.current, maskLogoRef.current], {
          scale: 0.25,
          transformOrigin: "724px 362px",
        });
        gsap.set(whiteLogoRef.current, { opacity: 1 });
        gsap.set(backdropRef.current, { opacity: 1 });

        // Phase 1: Slowly zoom in and fade white logo to transparent to reveal the 3D scene inside
        tl.to([whiteLogoRef.current, maskLogoRef.current], {
          scale: 1.2,
          duration: 2.2,
          ease: "power1.out",
        }, 0)
        .to(whiteLogoRef.current, {
          opacity: 0,
          duration: 1.8,
          ease: "power1.inOut",
        }, 0)

        // Phase 2: Zoom INTO the transparent cutout to reveal the full scene
        .to(maskLogoRef.current, {
          scale: 85,
          duration: 1.2,
          ease: "power2.in",
        }, 1.9); // starts slightly before Phase 1 ends
      }

      tl.eventCallback("onComplete", () => {
        window.clearTimeout(failsafe);
        complete();
      });

      // Play
      tl.play(0);

      return () => {
        window.clearTimeout(failsafe);
        tl.kill();
        pulseTweenRef.current?.kill();
        if (!finished) {
          lockScroll(false);
          lockPageScroll(false);
        }
      };
    },
    { scope: root, dependencies: [heroLoaded, reduced, dismissed], revertOnUpdate: false },
  );

  if (dismissed) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex touch-none items-center justify-center select-none overflow-hidden bg-transparent"
      role="status"
      aria-label="Loading Blayz"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1448 724"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id="logo-mask">
            {/* Opaque white background rect: keeps the black rect visible */}
            <rect x="-5000" y="-5000" width="11448" height="10724" fill="white" />
            {/* Black logo cutout group: cuts a transparent hole in the mask */}
            <g ref={maskLogoRef} style={{ transformOrigin: "724px 362px" }}>
              <path d={LOGO_PATH} fill="black" />
            </g>
          </mask>
        </defs>

        {/* Black screen rectangle with the mask applied */}
        <rect
          ref={backdropRef}
          x="-5000"
          y="-5000"
          width="11448"
          height="10724"
          fill="black"
          mask="url(#logo-mask)"
        />

        {/* Solid white logo group on top of the cutout hole */}
        <g ref={whiteLogoRef} style={{ transformOrigin: "724px 362px" }}>
          <path d={LOGO_PATH} fill="white" />
        </g>
      </svg>
    </div>
  );
}

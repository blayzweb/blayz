"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { INTRO_FAILSAFE_MS, lockPageScroll } from "./introUtils";
import { IntroBackdrop, IntroStage } from "./IntroStage";

/**
 * Stage A intro (PRD §6.1).
 * Displays a white blayz logo centered on a black background,
 * then zooms through the logo into the hero section.
 */
export function LogoIntro() {
  const { setIntroDone, lockScroll } = useSite();
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => {
    setIntroDone(true);
    setDismissed(true);
  }, [setIntroDone]);

  useGSAP(
    () => {
      if (dismissed) return;
      if (!root.current || !stage.current || !backdrop.current) return;

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
        // Just fade out logo and backdrop under reduced motion preference
        tl.to(stage.current, { opacity: 0, duration: 0.6 }, 0.2)
          .to(backdrop.current, { opacity: 0, duration: 0.6 }, 0.2);
      } else {
        // Center-zoom the logo, turning opacity down to "go through" it
        gsap.set(stage.current, { scale: 1, opacity: 1, transformOrigin: "center center" });
        gsap.set(backdrop.current, { opacity: 1 });

        tl.to(stage.current, {
          scale: 45,
          opacity: 0,
          duration: 2.2,
          ease: "power2.inOut",
        }, 0.5)
        .to(backdrop.current, {
          opacity: 0,
          duration: 1.8,
          ease: "power2.inOut",
        }, 0.6);
      }

      tl.eventCallback("onComplete", () => {
        window.clearTimeout(failsafe);
        complete();
      });

      // Play the timeline immediately
      tl.play(0);

      return () => {
        window.clearTimeout(failsafe);
        tl.kill();
        if (!finished) {
          lockScroll(false);
          lockPageScroll(false);
        }
      };
    },
    { scope: root, dependencies: [reduced, dismissed], revertOnUpdate: false },
  );

  if (dismissed) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex touch-none items-center justify-center select-none overflow-hidden"
      role="status"
      aria-label="Loading Blayz"
    >
      <IntroBackdrop backdropRef={backdrop} />
      <IntroStage stageRef={stage} />
    </div>
  );
}

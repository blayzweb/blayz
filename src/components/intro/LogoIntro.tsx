"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  INTRO_FAILSAFE_MS,
  INTRO_HOLD_BEFORE_ZOOM_S,
  lockPageScroll,
  setIntroPageBackground,
} from "./introUtils";
import { IntroBackdrop, IntroStage, measureIntroHole } from "./IntroStage";

const INTRO_ZOOM_SCALE = 45;

/**
 * Stage A intro (PRD §6.1).
 * Black backdrop with a logo-shaped window to the hero beneath,
 * then zooms through the wordmark into the site.
 */
export function LogoIntro() {
  const { setIntroDone, lockScroll } = useSite();
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setIntroPageBackground(true);
    if (stage.current && backdrop.current) {
      measureIntroHole(stage.current, backdrop.current);
    }
    return () => setIntroPageBackground(false);
  }, []);

  const finish = useCallback(() => {
    setIntroPageBackground(false);
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
      const backdropEl = backdrop.current;

      if (reduced) {
        tl.to(backdropEl, { opacity: 0, duration: 0.6 }, 0.2);
      } else {
        measureIntroHole(stage.current, backdropEl);
        gsap.set(backdropEl, { opacity: 1, "--hole-scale": 1 });

        tl.to(backdropEl, {
          "--hole-scale": INTRO_ZOOM_SCALE,
          duration: 2.2,
          ease: "power2.inOut",
        }, INTRO_HOLD_BEFORE_ZOOM_S)
          .to(backdropEl, {
            opacity: 0,
            duration: 1.8,
            ease: "power2.inOut",
          }, INTRO_HOLD_BEFORE_ZOOM_S + 0.1);
      }

      tl.eventCallback("onComplete", () => {
        window.clearTimeout(failsafe);
        complete();
      });

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

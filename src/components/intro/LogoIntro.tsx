"use client";

import { useCallback, useRef, useState, useLayoutEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { INTRO_FAILSAFE_MS, lockPageScroll, whenIntroReady } from "./introUtils";
import { buildFullTimeline, buildReducedTimeline } from "./introTimeline";
import { IntroBackdrop, IntroStage } from "./IntroStage";
import { useMobileIntroSequence } from "./useMobileIntroSequence";

function prefersMobileIntro() {
  return window.matchMedia(
    "(max-width: 767px), (hover: none) and (pointer: coarse)",
  ).matches;
}

/**
 * Stage A intro (PRD §6.1).
 * Mobile: timer-driven SVG frame steps (no GSAP — iOS never completes those tweens).
 * Desktop: GSAP timeline with scale + crossfade.
 */
export function LogoIntro() {
  const { setIntroDone, lockScroll } = useSite();
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [mobile, setMobile] = useState<boolean | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setMobile(prefersMobileIntro());
  }, []);

  const finish = useCallback(() => {
    setIntroDone(true);
    setDismissed(true);
  }, [setIntroDone]);

  useMobileIntroSequence({
    enabled: mobile === true && !dismissed,
    reduced,
    rootRef: root,
    backdropRef: backdrop,
    stageRef: stage,
    lockScroll,
    onFinish: finish,
  });

  useGSAP(
    () => {
      if (mobile !== false || dismissed) return;
      if (!root.current || !stage.current) return;

      const layers = stage.current.querySelectorAll("[data-frame]");
      if (!layers.length) return;

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

      const tl = reduced
        ? buildReducedTimeline({
            layers,
            root: root.current,
            backdrop: backdrop.current,
          })
        : buildFullTimeline({
            layers,
            root: root.current,
            backdrop: backdrop.current,
            wrap: stage.current,
            mobile: false,
          });

      tl.pause();
      tl.eventCallback("onComplete", () => {
        window.clearTimeout(failsafe);
        complete();
      });

      const cancelReady = whenIntroReady(() => tl.play(0));

      return () => {
        cancelReady();
        window.clearTimeout(failsafe);
        tl.kill();
        if (!finished) {
          lockScroll(false);
          lockPageScroll(false);
        }
      };
    },
    { scope: root, dependencies: [reduced, mobile, dismissed], revertOnUpdate: false },
  );

  if (dismissed) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex touch-none items-center justify-center select-none"
      role="status"
      aria-label="Loading Blayz"
    >
      <IntroBackdrop backdropRef={backdrop} />
      <IntroStage stageRef={stage} />
    </div>
  );
}

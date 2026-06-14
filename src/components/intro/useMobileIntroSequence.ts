import { useEffect } from "react";
import type { RefObject } from "react";
import { CREAM, lockPageScroll } from "./introUtils";

const FRAME_MS = 300;
const SETUP_RETRY_MS = 50;
const SETUP_MAX_ATTEMPTS = 40;

type MobileIntroOptions = {
  enabled: boolean;
  reduced: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  backdropRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  lockScroll: (locked: boolean) => void;
  onFinish: () => void;
};

/**
 * Mobile intro driver — no GSAP. iOS Safari often never completes GSAP tweens on
 * SVG layers, so we step frames with timers and always force-dismiss the overlay.
 */
export function useMobileIntroSequence({
  enabled,
  reduced,
  rootRef,
  backdropRef,
  stageRef,
  lockScroll,
  onFinish,
}: MobileIntroOptions) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let done = false;
    const timers: number[] = [];
    let retryTimer: number | undefined;

    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const finish = () => {
      if (done || cancelled) return;
      done = true;
      const root = rootRef.current;
      if (root) {
        root.style.opacity = "0";
        root.style.visibility = "hidden";
        root.style.pointerEvents = "none";
      }
      lockScroll(false);
      lockPageScroll(false);
      onFinish();
    };

    const runSequence = () => {
      const root = rootRef.current;
      const backdrop = backdropRef.current;
      const stage = stageRef.current;
      if (!root || !backdrop || !stage) return false;

      const layers = Array.from(stage.querySelectorAll<SVGGElement>("g[data-frame]"));
      if (!layers.length) return false;

      const showFrame = (index: number) => {
        layers.forEach((layer, i) => {
          layer.setAttribute("opacity", i === index ? "1" : "0");
        });
      };

      lockScroll(true);
      lockPageScroll(true);

      // Ultimate failsafe — site must appear even if something throws.
      schedule(finish, 8000);

      if (reduced) {
        showFrame(0);
        schedule(() => showFrame(layers.length - 1), 350);
        schedule(() => {
          backdrop.style.backgroundColor = CREAM;
        }, 650);
        schedule(() => {
          root.style.opacity = "0";
        }, 850);
        schedule(finish, 1100);
        return true;
      }

      showFrame(0);

      for (let i = 1; i < layers.length; i++) {
        schedule(() => showFrame(i), i * FRAME_MS);
      }

      const holdAt = layers.length * FRAME_MS + 350;

      schedule(() => {
        backdrop.style.transition = "background-color 0.5s ease";
        backdrop.style.backgroundColor = CREAM;
      }, holdAt);

      schedule(() => {
        root.style.transition = "opacity 0.45s ease-out";
        root.style.opacity = "0";
      }, holdAt + 400);

      schedule(finish, holdAt + 950);
      return true;
    };

    let attempts = 0;
    const tryStart = () => {
      if (cancelled || done) return;
      if (runSequence()) return;
      attempts += 1;
      if (attempts >= SETUP_MAX_ATTEMPTS) {
        finish();
        return;
      }
      retryTimer = window.setTimeout(tryStart, SETUP_RETRY_MS);
    };

    tryStart();

    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
      timers.forEach(clearTimeout);
      if (!done) {
        lockScroll(false);
        lockPageScroll(false);
      }
    };
  }, [enabled, reduced, rootRef, backdropRef, stageRef, lockScroll, onFinish]);
}

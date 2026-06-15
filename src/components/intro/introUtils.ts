import type { CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import type { IntroFrame } from "./frames";

export const INK = "#1a1a1a";
export const CREAM = "#fff2e2";
export const INTRO_CLIP_ID = "blayz-intro-logo-clip";
export const INTRO_FAILSAFE_MS = 8000;

export const INTRO_FOREIGN_W = 1448;
export const INTRO_FOREIGN_H = 724;

export function frameFillStyle(
  frame: IntroFrame,
  mode: "foreign" | "layer" = "foreign",
): CSSProperties {
  return {
    ...(mode === "foreign"
      ? { width: INTRO_FOREIGN_W, height: INTRO_FOREIGN_H }
      : { width: "100%", height: "100%" }),
    background: frame.background,
    backgroundSize: frame.size,
  };
}

export function lockPageScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
  document.body.style.touchAction = locked ? "none" : "";
}

/** Wait for layout paint before GSAP runs (never block on font loading). */
export function whenIntroReady(run: () => void): () => void {
  let cancelled = false;
  let started = false;
  let delay: gsap.core.Tween | null = null;
  let fontTimeout: number | undefined;

  const start = () => {
    if (cancelled || started) return;
    started = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        delay = gsap.delayedCall(0.12, run);
      });
    });
  };

  // Fonts are irrelevant to the intro — cap wait at 300ms so mobile never stalls.
  fontTimeout = window.setTimeout(start, 300);
  if (document.fonts?.ready) {
    void document.fonts.ready.finally(() => {
      window.clearTimeout(fontTimeout);
      start();
    });
  } else {
    start();
  }

  return () => {
    cancelled = true;
    window.clearTimeout(fontTimeout);
    delay?.kill();
  };
}

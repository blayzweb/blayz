import type { CSSProperties, RefObject } from "react";
import { INTRO_LOGO_MASK } from "./introCutout";

/** Logo-shaped hole punched through the black backdrop (no white layer). */
export const BACKDROP_CUTOUT: CSSProperties = {
  WebkitMaskImage: `${INTRO_LOGO_MASK}, linear-gradient(#fff 0 0)`,
  maskImage: `linear-gradient(#fff 0 0), ${INTRO_LOGO_MASK}`,
  WebkitMaskSize: `var(--hole-w, 44vw) var(--hole-h, 22vw), 100% 100%`,
  maskSize: `100% 100%, var(--hole-w, 44vw) var(--hole-h, 22vw)`,
  WebkitMaskPosition: `center center, 0 0`,
  maskPosition: `0 0, center center`,
  WebkitMaskRepeat: `no-repeat, no-repeat`,
  maskRepeat: `no-repeat, no-repeat`,
  WebkitMaskComposite: "destination-out",
  maskComposite: "exclude",
};

/** Invisible — GSAP scales this; the backdrop hole tracks its bounding box. */
export function IntroStage({
  stageRef,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={stageRef}
      aria-hidden
      className="relative z-10 w-[44vw] h-[22vw] sm:w-[32vw] sm:h-[16vw] lg:w-[24rem] lg:h-[12rem] pointer-events-none invisible"
    />
  );
}

export function IntroBackdrop({
  backdropRef,
}: {
  backdropRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={backdropRef}
      className="absolute inset-0 bg-black"
      style={BACKDROP_CUTOUT}
    />
  );
}

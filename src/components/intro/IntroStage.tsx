import type { CSSProperties, RefObject } from "react";
import { INTRO_LOGO_MASK } from "./introCutout";

const BACKDROP_CUTOUT: CSSProperties = {
  WebkitMaskImage: `${INTRO_LOGO_MASK}, linear-gradient(#fff 0 0)`,
  maskImage: `linear-gradient(#fff 0 0), ${INTRO_LOGO_MASK}`,
  WebkitMaskSize: `var(--hole-w) var(--hole-h), 100% 100%`,
  maskSize: `100% 100%, var(--hole-w) var(--hole-h)`,
  WebkitMaskPosition: `center center, 0 0`,
  maskPosition: `0 0, center center`,
  WebkitMaskRepeat: `no-repeat, no-repeat`,
  maskRepeat: `no-repeat, no-repeat`,
  WebkitMaskComposite: "destination-out",
  maskComposite: "exclude",
};

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
      className="intro-backdrop absolute inset-0 bg-black"
      style={BACKDROP_CUTOUT}
    />
  );
}

export function measureIntroHole(stage: HTMLDivElement, backdrop: HTMLDivElement) {
  const { width, height } = stage.getBoundingClientRect();
  backdrop.style.setProperty("--hole-w-base", `${width}px`);
  backdrop.style.setProperty("--hole-h-base", `${height}px`);
  backdrop.style.setProperty("--hole-scale", "1");
}

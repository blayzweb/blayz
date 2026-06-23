import type { RefObject } from "react";
import { Logo } from "@/components/ui/Logo";

/** Simple starting SVG stage - a white blayz logo centered */
export function IntroStage({
  stageRef,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={stageRef}
      className="relative w-[44vw] h-[22vw] sm:w-[32vw] sm:h-[16vw] lg:w-[24rem] lg:h-[12rem] text-white flex items-center justify-center overflow-visible"
    >
      <Logo fillColor="currentColor" className="w-full h-full" />
    </div>
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
    />
  );
}

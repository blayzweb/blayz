import type { RefObject } from "react";
import { INTRO_FRAMES } from "./frames";
import {
  INTRO_CLIP_ID,
  INTRO_FOREIGN_H,
  INTRO_FOREIGN_W,
  frameFillStyle,
  INK,
} from "./introUtils";
import { LOGO_PATH } from "./logoPath";

/** Single SVG stage — desktop animates with GSAP, mobile with timed opacity attrs. */
export function IntroStage({
  stageRef,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={stageRef}
      className="relative aspect-[2/1] w-[min(88vw,20rem)] md:w-[min(32vw,24rem)]"
    >
      <svg
        viewBox={`0 0 ${INTRO_FOREIGN_W} ${INTRO_FOREIGN_H}`}
        width="100%"
        height="100%"
        className="block h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <clipPath id={INTRO_CLIP_ID} clipPathUnits="userSpaceOnUse">
            <path d={LOGO_PATH} />
          </clipPath>
        </defs>
        {INTRO_FRAMES.map((frame, index) => (
          <g
            key={frame.id}
            data-frame
            clipPath={`url(#${INTRO_CLIP_ID})`}
            opacity={index === 0 ? 1 : 0}
          >
            <foreignObject
              x="0"
              y="0"
              width={INTRO_FOREIGN_W}
              height={INTRO_FOREIGN_H}
            >
              <div
                {...({
                  xmlns: "http://www.w3.org/1999/xhtml",
                } as Record<string, string>)}
                style={frameFillStyle(frame, "foreign")}
              />
            </foreignObject>
          </g>
        ))}
      </svg>
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
      className="absolute inset-0"
      style={{ backgroundColor: INK }}
    />
  );
}

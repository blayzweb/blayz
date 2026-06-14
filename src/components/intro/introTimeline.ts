import { gsap } from "@/lib/gsap";
import { CREAM } from "./introUtils";

type IntroTargets = {
  layers: NodeListOf<Element>;
  root: Element | null;
  backdrop: Element | null;
  wrap: Element | null;
  mobile: boolean;
};

function fadeLayer(
  tl: gsap.core.Timeline,
  layer: Element,
  to: number,
  duration: number,
  position: gsap.Position,
) {
  tl.to(layer, { opacity: to, duration, ease: "power1.inOut" }, position);
}

function crossfadeFrames(
  tl: gsap.core.Timeline,
  layers: NodeListOf<Element>,
  win: number,
) {
  for (let i = 1; i < layers.length; i++) {
    const at = win * i;
    const dur = i === layers.length - 1 ? 0.25 : 0.15;
    fadeLayer(tl, layers[i], 1, dur, at);
    fadeLayer(tl, layers[i - 1], 0, dur, at);
  }
  return win * layers.length + 0.2;
}

function exitHandoff(
  tl: gsap.core.Timeline,
  root: Element | null,
  backdrop: Element | null,
  holdAt: number,
) {
  tl.to(backdrop, { backgroundColor: CREAM, duration: 0.5, ease: "none" }, holdAt);
  tl.to(
    root,
    { opacity: 0, visibility: "hidden", duration: 0.45, ease: "power2.out" },
    holdAt + 0.35,
  );
}

/** Full frame sequence for desktop (includes scale) or mobile (no scale). */
export function buildFullTimeline({
  layers,
  root,
  backdrop,
  wrap,
  mobile,
}: IntroTargets) {
  gsap.set(layers, { opacity: 0 });
  gsap.set(layers[0], { opacity: 1 });

  const tl = gsap.timeline({ paused: true });
  const win = mobile ? 0.3 : 0.35;

  if (!mobile && wrap) {
    tl.to(
      wrap,
      { scale: 1.18, duration: 3.0, ease: "power1.inOut", force3D: true },
      0,
    );
  }

  const holdAt = crossfadeFrames(tl, layers, win);

  if (!mobile && wrap) {
    tl.to(
      wrap,
      { scale: 1.05, duration: 0.6, ease: "power2.inOut", force3D: true },
      holdAt,
    );
  }

  exitHandoff(tl, root, backdrop, holdAt);
  return tl;
}

/** Reduced-motion handoff. */
export function buildReducedTimeline({
  layers,
  root,
  backdrop,
}: Pick<IntroTargets, "layers" | "root" | "backdrop">) {
  gsap.set(layers, { opacity: 0 });
  const white = layers[0];
  const brand = layers[layers.length - 1];

  const tl = gsap.timeline({ paused: true });
  tl.set(white, { opacity: 1 })
    .to(white, { opacity: 0, duration: 0.4 }, 0.2)
    .to(brand, { opacity: 1, duration: 0.4 }, 0.2)
    .to(backdrop, { backgroundColor: CREAM, duration: 0.4, ease: "none" }, 0.4)
    .to(
      root,
      { opacity: 0, visibility: "hidden", duration: 0.3, ease: "power2.out" },
      "+=0.2",
    );

  return tl;
}

// components/hero/Hero.tsx
//
// Parent component: Canvas + HTML overlays + the single GSAP timeline that
// drives EVERYTHING. This is the "single source of truth" — one
// scrollProgress (0→1 via ScrollTrigger scrub), mapped to explicit
// keyframes for every object.
//
// Logo wipe (bug #2 fix): the logo is HTML/SVG only, in two stacked copies
// (orange base + white foreground), white copy revealed via clip-path as
// the Sadu ribbon's x-position crosses it. No WebGL logo mesh at all —
// removes the ExtrudeGeometry/MeshStandardMaterial lighting problem
// entirely, and matches the brand guide's "flat logo, no gradients/shadows"
// rule by construction.
//
// Timeline reference — your 5 sketched frames mapped to scroll progress:
//
//   0%   Frame 1: orange logo (left), laptop closed (right, large)
//   20%  Frame 2: laptop lifts, lid begins opening, slight tilt
//   45%  Frame 3: lid ~fully open, Sadu ribbon begins emerging from screen
//   65%  Frame 4: laptop rotates "sideways", ribbon travels toward logo,
//                 particles begin (if/when added)
//   85%  Frame 5: ribbon crosses logo — logo wipes orange→white in sync
//   100% Settle: ribbon fully across, laptop fades/recedes
//   100%+ (next ScrollTrigger) Stage B dock — logo + index move to header/sidebar

import { useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { HeroScene, type HeroSceneRefs } from "./HeroScene";
import { Logo } from "@/components/ui/Logo"; // your existing SVG logo component

gsap.registerPlugin(ScrollTrigger);

// ---- Explicit keyframes -----------------------------------------------
// One object per timeline position. `at` is the scroll-progress fraction
// (0–1) within this section's pinned scroll range. GSAP timeline positions
// are absolute time units (seconds) when scrub is a duration — using a
// 0–1 "logical duration" keeps these numbers directly readable as %.

const KEYFRAMES = {
  // Lid hinge rotation.x — see CLOSED_X / OPEN_X in HeroScene.tsx
  lidRotationX: [
    { at: 0,    value: 1.6 },   // closed
    { at: 0.2,  value: 1.2 },   // starting to open
    { at: 0.45, value: 0.0 },   // fully open
    { at: 1,    value: 0.0 },   // stays open
  ],
  // Whole laptop group
  laptopRotationX: [
    { at: 0,    value: 0.1 },
    { at: 0.2,  value: 0.15 },
    { at: 0.45, value: 0.2 },
    { at: 0.65, value: 0.35 },  // tipping toward "sideways"
    { at: 1,    value: 0.5 },
  ],
  laptopRotationY: [
    { at: 0,    value: -0.2 },
    { at: 0.2,  value: -0.35 }, // slight tilt to the side (frame 2)
    { at: 0.45, value: -0.5 },
    { at: 0.65, value: -1.4 },  // rotating toward sideways (frame 4)
    { at: 1,    value: -1.55 },
  ],
  laptopRotationZ: [
    { at: 0,   value: 0 },
    { at: 0.65, value: 0.1 },
    { at: 1,   value: 0.15 },
  ],
  laptopPositionY: [
    { at: 0,    value: -0.28 },  // resting base level
    { at: 1,    value: -0.28 },
  ],
  laptopPositionX: [
    { at: 0,   value: 1.2 },    // fixed on the right
    { at: 1,   value: 1.2 },
  ],
  laptopScale: [
    { at: 0,   value: 0.24 },   // increased size, no janky resizing
    { at: 1,   value: 0.24 },
  ],

  // Sadu ribbon — "emerges from nothing" at the screen, travels left
  saduScaleScalar: [
    { at: 0,    value: 0.001 }, // invisible
    { at: 0.45, value: 0.001 }, // still invisible until screen is open
    { at: 0.46, value: 1.6 },   // protrudes instantly at full required size
    { at: 1,    value: 1.6 },
  ],
  saduPositionX: [
    { at: 0,    value: 2.72 },   // hidden off-screen to the right
    { at: 0.45, value: 2.72 },   // left edge is exactly at the screen center (1.2)
    { at: 0.65, value: 0.2 },    // traveling toward logo
    { at: 0.85, value: -0.9 },   // crossing the logo's x-position
    { at: 1,    value: -1.8 },   // fully past
  ],
  saduPositionY: [
    { at: 0.45, value: 0.08 },   // starts at laptop screen center height
    { at: 1,    value: 0.0 },    // settles to logo center height
  ],

  // Screen glow (point light) — flares as the lid opens
  glowIntensity: [
    { at: 0.2,  value: 0 },
    { at: 0.45, value: 1.2 },
    { at: 0.6,  value: 0.6 },
    { at: 1,    value: 0.2 },
  ],

  // Logo wipe progress — drives the white-overlay clip-path, 0 = fully
  // orange, 1 = fully white. Synced to when the Sadu ribbon's x-position
  // crosses the logo's x-position on screen (~0.60–0.76 range).
  logoWipe: [
    { at: 0,    value: 0 },
    { at: 0.60, value: 0 },
    { at: 0.76, value: 1 },
    { at: 1,    value: 1 },
  ],
} as const;

// Build a GSAP timeline tween set from a keyframe array targeting a
// property on `target`.
function applyKeyframes<T extends Record<string, number>>(
  tl: gsap.core.Timeline,
  target: T,
  prop: keyof T,
  frames: readonly { at: number; value: number }[],
  totalDuration: number
) {
  for (let i = 1; i < frames.length; i++) {
    const from = frames[i - 1];
    const to = frames[i];
    tl.to(
      target,
      {
        [prop]: to.value,
        duration: (to.at - from.at) * totalDuration,
        ease: "none",
      },
      from.at * totalDuration
    );
  }
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const whiteLogoRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<HeroSceneRefs | null>(null);

  // Local proxy object — same role as before, but values are applied
  // directly to refs in onUpdate rather than stashed on `canvas.*`.
  const [proxy] = useState(() => ({
    lidRotationX: 1.6,
    laptopRotationX: 0.1,
    laptopRotationY: -0.2,
    laptopRotationZ: 0,
    laptopPositionX: 1.2,
    laptopPositionY: -0.28,
    laptopScale: 0.24,
    saduScaleScalar: 0.001,
    saduPositionX: 2.72,
    saduPositionY: 0.08,
    glowIntensity: 0,
    logoWipe: 0,
  }));

  useGSAP(() => {
    const TOTAL = 100; // "logical duration" — keyframe `at` values are 0–1 fractions of this

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        start: "top top",
        end: "+=200%",
        scrub: 1,
        pinSpacing: true,
      },
      onUpdate: () => {
        const refs = sceneRefs.current;
        if (!refs) return;

        if (refs.lidNode) {
          refs.lidNode.rotation.x = proxy.lidRotationX;
        }
        if (refs.laptopGroup) {
          refs.laptopGroup.rotation.set(
            proxy.laptopRotationX,
            proxy.laptopRotationY,
            proxy.laptopRotationZ
          );
          refs.laptopGroup.position.set(
            proxy.laptopPositionX,
            proxy.laptopPositionY,
            0
          );
          refs.laptopGroup.scale.setScalar(proxy.laptopScale);
        }
        if (refs.saduGroup) {
          refs.saduGroup.scale.setScalar(proxy.saduScaleScalar);
          refs.saduGroup.position.set(proxy.saduPositionX, proxy.saduPositionY, 0);
        }
        if (refs.screenGlowLight) {
          refs.screenGlowLight.intensity = proxy.glowIntensity;
        }

        // Logo wipe — clip-path on the white overlay.
        // logoWipe: 0 = fully clipped (hidden, shows orange beneath),
        //           1 = fully revealed (white).
        if (whiteLogoRef.current) {
          const pct = (1 - proxy.logoWipe) * 100;
          whiteLogoRef.current.style.clipPath = `inset(0 0 0 ${pct}%)`;
        }
      },
    });

    (Object.keys(KEYFRAMES) as Array<keyof typeof KEYFRAMES>).forEach((key) => {
      applyKeyframes(tl, proxy, key, KEYFRAMES[key], TOTAL);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[var(--blayz-cream)]">
      {/* 3D scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 4], fov: 35 }}>
          <Suspense fallback={null}>
            <HeroScene onReady={(refs) => { sceneRefs.current = refs; }} />
          </Suspense>
        </Canvas>
      </div>

      {/* Logo overlay — two stacked copies, white one clip-revealed */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 w-[28rem] h-[14rem] pointer-events-none">
        <Logo fillColor="var(--blayz-orange)" className="absolute inset-0 w-full h-full" />
        <div ref={whiteLogoRef} className="absolute inset-0 w-full h-full" style={{ clipPath: "inset(0 100% 0 0)" }}>
          <Logo fillColor="#ffffff" className="w-full h-full" />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-mono text-[var(--blayz-orange)]/60">
        scroll ↓
      </div>
    </section>
  );
}

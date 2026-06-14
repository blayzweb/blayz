"use client";

import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";

interface Particle {
  id: number;
  char?: string;
  isSadu: boolean;
  color: string;
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleStart: number;
  scaleEnd: number;
}

function createPrng(seed = 12345) {
  let current = seed;
  return function () {
    current = (current * 1103515245 + 12345) % 2147483648;
    return current / 2147483648;
  };
}

export interface Laptop3DHandle {
  laptopRef: HTMLDivElement | null;
  lidRef: HTMLDivElement | null;
  screenRef: HTMLDivElement | null;
  particlesRef: HTMLDivElement | null;
  particles: Particle[];
}

export const Laptop3D = forwardRef<Laptop3DHandle>((_, ref) => {
  const laptopRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Generate 24 diverse particles (12 Sadu diamonds and 12 ASCII glyphs)
  const particles = useMemo(() => {
    const list: Particle[] = [];
    const colors = [
      "var(--blayz-orange)", // Brand orange
      "var(--blayz-peach)",  // Light peach
      "var(--blayz-gold)",   // Accent gold
      "#ffffff",             // Pure white
    ];
    const asciiChars = ["< />", "{ }", "[ ]", "◇", "+", "x", "01", "10", "/", "*", "&&", "||"];
    const rnd = createPrng(42); // Seeded LCG for render purity and hydration safety

    for (let i = 0; i < 24; i++) {
      const isSadu = i % 2 === 0;
      const char = isSadu ? undefined : asciiChars[Math.floor(i / 2) % asciiChars.length];
      
      // Starting positions on the laptop screen (from center-ish of the larger screen)
      const startX = (rnd() - 0.5) * 160; 
      const startY = (rnd() - 0.5) * 100;
      const startZ = 0;

      // End trajectories (flying out towards and past the camera)
      const angle = rnd() * Math.PI * 2;
      const spread = 250 + rnd() * 350; 
      const endX = Math.cos(angle) * spread;
      const endY = Math.sin(angle) * spread - 120;
      const endZ = 1200 + rnd() * 600; 

      list.push({
        id: i,
        char,
        isSadu,
        color: colors[i % colors.length],
        startX,
        startY,
        startZ,
        endX,
        endY,
        endZ,
        rotationX: (rnd() - 0.5) * 720,
        rotationY: (rnd() - 0.5) * 720,
        rotationZ: (rnd() - 0.5) * 360,
        scaleStart: 0.1,
        scaleEnd: 2.2 + rnd() * 1.5,
      });
    }
    return list;
  }, []);

  // Expose refs and data to the parent Hero component
  useImperativeHandle(ref, () => ({
    get laptopRef() { return laptopRef.current; },
    get lidRef() { return lidRef.current; },
    get screenRef() { return screenRef.current; },
    get particlesRef() { return particlesRef.current; },
    particles
  }));

  return (
    <div
      className="relative flex h-[28rem] lg:h-[35rem] w-full items-center justify-center overflow-visible"
    >
      {/* 3D Scene Viewport */}
      <div 
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 30%",
          transformStyle: "preserve-3d"
        }}
        className="relative flex h-full w-full items-center justify-center overflow-visible"
      >
        {/* Laptop Assembly Group (35% bigger: ~380px wide base) */}
        <div
          ref={laptopRef}
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(12deg) rotateY(0deg) rotateZ(0deg)",
          }}
          className="relative flex flex-col items-center overflow-visible transition-transform duration-500"
        >
          {/* A. LAPTOP LID (Rotates around its bottom edge via transform-origin) */}
          <div
            ref={lidRef}
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "bottom center",
              // Start closed flat on the base (parallel to base's X rotation of 82deg)
              transform: "rotateX(82deg)",
              marginBottom: "-2px",
              zIndex: 10,
            }}
            className="relative h-[240px] w-[370px] rounded-t-xl bg-blayz-ink border-4 border-blayz-ink shadow-2xl flex items-center justify-center overflow-visible"
          >
            {/* Screen Panel */}
            <div
              ref={screenRef}
              style={{
                boxShadow: "0 0 10px rgba(255, 56, 0, 0), inset 0 0 10px rgba(0,0,0,0.8)",
                transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                transformStyle: "preserve-3d",
              }}
              className="relative w-[calc(100%-10px)] h-[calc(100%-10px)] rounded-t-lg bg-blayz-ink border border-blayz-ink/60 overflow-visible flex flex-col items-center justify-center"
            >
              {/* Screen Content Graphics */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 font-mono text-[10px] leading-tight text-blayz-orange/70 select-none">
                <div className="flex justify-between w-full opacity-60">
                  <span>SYSTEM_BOOT // READY</span>
                  <span>v0.1.0</span>
                </div>
                {/* Minimal arabesque center mesh */}
                <div className="mx-auto my-auto w-16 h-16 border border-dashed border-blayz-orange/40 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="flex justify-between w-full opacity-60">
                  <span>CRAFT.CODE.CULTURE</span>
                  <span>PORT_8080</span>
                </div>
              </div>

              {/* 3D PARTICLE CONTAINER */}
              <div
                ref={particlesRef}
                style={{
                  transformStyle: "preserve-3d",
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
                className="overflow-visible"
              >
                {particles.map((p) => (
                  <div
                    key={p.id}
                    data-particle
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transformStyle: "preserve-3d",
                      transform: `translate3d(${p.startX}px, ${p.startY}px, ${p.startZ}px) scale(${p.scaleStart})`,
                      color: p.color,
                    }}
                    className="flex items-center justify-center overflow-visible select-none font-mono text-xs font-bold leading-none pointer-events-none"
                  >
                    {p.isSadu ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="overflow-visible w-6 h-6 filter drop-shadow-[0_0_4px_currentColor]"
                      >
                        <path
                          d="M12 2 L22 12 L12 22 L2 12 Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="currentColor"
                          fillOpacity="0.12"
                        />
                        <path
                          d="M12 6 L18 12 L12 18 L6 12 Z"
                          stroke="currentColor"
                          strokeWidth="0.8"
                          fill="none"
                        />
                        <rect
                          x="10.5"
                          y="10.5"
                          width="3"
                          height="3"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <span className="whitespace-nowrap px-1 filter drop-shadow-[0_0_3px_currentColor]">
                        {p.char}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* B. LAPTOP BASE (Keyboard Chassis, tilted on the horizontal plane) */}
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(82deg) translateZ(-4px)",
              transformOrigin: "top center",
              boxShadow: "0 15px 30px rgba(0,0,0,0.6)",
              zIndex: 5,
            }}
            className="relative h-[250px] w-[380px] rounded-b-xl bg-blayz-ink-soft border border-blayz-ink border-t-[3px] flex flex-col justify-between p-5 overflow-visible"
          >
            {/* Keyboard Layout Lines */}
            <div className="flex flex-col gap-2 w-full mt-3 opacity-50">
              <div className="flex justify-between w-full h-[11px] bg-blayz-ink rounded-[2px]" />
              <div className="flex justify-between w-full h-[11px] bg-blayz-ink rounded-[2px]" />
              <div className="flex justify-between w-full h-[11px] bg-blayz-ink rounded-[2px]" />
              <div className="flex justify-between w-full h-[11px] bg-blayz-ink rounded-[2px]" />
              <div className="flex justify-between w-full h-[11px] bg-blayz-ink rounded-[2px]" />
            </div>

            {/* Trackpad Outlines */}
            <div className="mx-auto w-[90px] h-[46px] border border-blayz-ink bg-blayz-ink/30 rounded-md opacity-40 mb-1" />

            {/* Front Edge Lip Thickness */}
            <div
              style={{
                position: "absolute",
                bottom: "-8px",
                left: "-1px",
                width: "382px",
                height: "8px",
                background: "var(--blayz-ink)",
                transform: "rotateX(-90deg)",
                transformOrigin: "bottom center",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

Laptop3D.displayName = "Laptop3D";

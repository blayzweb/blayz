"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HeroIndex } from "@/components/nav/HeroIndex";
import { useSite } from "@/components/providers/SiteProvider";
import { Logo } from "@/components/ui/Logo";
import dynamic from "next/dynamic";
import { type HeroCanvas3DHandle } from "@/components/ui/HeroCanvas3D";

// Dynamically load the WebGL Canvas to prevent SSR issues
const HeroCanvas3D = dynamic(
  () => import("@/components/ui/HeroCanvas3D").then((mod) => mod.HeroCanvas3D),
  { ssr: false }
);

export function Hero() {
  const { scrolled, introDone, scrollTo } = useSite();
  const showBig = !scrolled;

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopLogoRef = useRef<HTMLDivElement>(null);
  const desktopWhiteLogoRef = useRef<HTMLDivElement>(null);
  const desktopTextRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HeroCanvas3DHandle>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useGSAP(
    () => {
      if (!introDone || !canvasReady) return;

      const logo = desktopLogoRef.current;
      const whiteLogo = desktopWhiteLogoRef.current;
      const text = desktopTextRef.current;
      const canvas = canvasRef.current;

      const mm = gsap.matchMedia();

      // 1. DESKTOP TIMELINE (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        if (!logo || !whiteLogo || !text || !canvas) return;

        // Reset positions
        gsap.set(logo, { opacity: 0, scale: 1, left: "50%", top: "50%", xPercent: -50, yPercent: -50, width: "28rem", height: "14rem" });
        gsap.set(whiteLogo, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", opacity: 1 });

        const animProxy = {
          lidRotationX: 1.6,
          laptopRotationX: 0.2,
          laptopRotationY: -0.3,
          laptopRotationZ: 0.0,
          laptopPositionY: -0.6,
          laptopScale: 0.9,
          saduScaleScalar: 0.001,
          saduPositionX: 2.4,
          saduPositionY: -0.2,
          glowIntensity: 0.0,
          logoWipe: 0.0,
          logoScale: 1.0,
          particleProgress: 0.0,
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            start: "top top",
            end: "+=200%",
            scrub: 1.0,
            pinSpacing: true,
          },
          onUpdate: () => {
            if (!canvas) return;
            if (canvas.lidGroup) canvas.lidGroup.rotation.x = animProxy.lidRotationX;
            if (canvas.laptopGroup) {
              canvas.laptopGroup.rotation.set(animProxy.laptopRotationX, animProxy.laptopRotationY, animProxy.laptopRotationZ);
              canvas.laptopGroup.position.y = animProxy.laptopPositionY;
              canvas.laptopGroup.scale.setScalar(animProxy.laptopScale);
            }
            if (canvas.saduGroup) {
              canvas.saduGroup.scale.setScalar(animProxy.saduScaleScalar);
              canvas.saduGroup.position.x = animProxy.saduPositionX;
              canvas.saduGroup.position.y = animProxy.saduPositionY;
            }
            if (canvas.logoGroup) {
              canvas.logoGroup.scale.setScalar(animProxy.logoScale);
            }
            canvas.logoUniforms.uProgress.value = animProxy.logoWipe;
            if (canvas.screenGlowLight) canvas.screenGlowLight.intensity = animProxy.glowIntensity;
            canvas.particleProxy.progress = animProxy.particleProgress;
          }
        });

        // Frame 1 -> Frame 2: Tagline, Index, and CTA fade out (0s -> 0.6s)
        tl.to(text, { opacity: 0, y: -24, duration: 0.6, ease: "power2.out" }, 0);

        // Frame 2 -> Frame 3: Laptop lid opens and chassis tilts back (0s -> 1.2s)
        tl.to(animProxy, { lidRotationX: 0.0, ease: "power2.inOut", duration: 1.2 }, 0);
        tl.to(animProxy, { laptopRotationY: 0.2, laptopRotationX: 0.1, laptopRotationZ: 0.05, ease: "power2.inOut", duration: 1.2 }, 0);

        // Frame 3: Screen glow starts (0.8s -> 1.3s)
        tl.to(animProxy, { glowIntensity: 4.5, duration: 0.5 }, 0.8);

        // Frame 3: Particles launch towards the viewer (1.0s -> 2.2s)
        tl.to(animProxy, { particleProgress: 1.0, ease: "power1.out", duration: 1.2 }, 1.0);

        // Frame 4: Laptop rotates sideways to face the left (2.2s -> 3.0s)
        tl.to(animProxy, { laptopRotationY: 1.35, laptopRotationX: 0.0, laptopRotationZ: 0.0, ease: "power2.inOut", duration: 0.8 }, 2.2);

        // Frame 4 -> Frame 5: Sadu ribbon emerges from screen and grows leftwards (2.2s -> 3.2s)
        tl.to(animProxy, { saduScaleScalar: 4.8, saduPositionX: -0.45, ease: "power2.inOut", duration: 1.0 }, 2.2);

        // Frame 5: Logo turns white in WebGL via uProgress uniform (2.55s -> 3.1s)
        tl.to(animProxy, { logoWipe: 1.0, duration: 0.55, ease: "none" }, 2.55);

        // Frame 5 -> 6: Handoff! Fade out WebGL logo & Fade in HTML logo (3.1s -> 3.2s)
        tl.to(animProxy, { logoScale: 0.0, duration: 0.1 }, 3.1);
        tl.to(logo, { opacity: 1, duration: 0.1 }, 3.1);

        // Frame 6: HTML Logo docks to top-left and scales down to header dimensions (3.2s -> 4.0s)
        const isSm = window.innerWidth >= 640;
        const targetLeft = isSm ? "32px" : "20px";

        tl.to(
          logo,
          {
            left: targetLeft,
            top: "16px",
            xPercent: 0,
            yPercent: 0,
            width: 48,
            height: 24,
            ease: "power2.inOut",
            duration: 0.8,
          },
          3.2
        );

        // Fade out white logo layer at the end of dock to reveal the orange layer underneath (3.7s -> 4.0s)
        tl.to(
          whiteLogo,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          3.7
        );

        // Transition out WebGL canvas elements (drop/shrink laptop & ribbon) (3.4s -> 4.0s)
        tl.to(animProxy, { laptopPositionY: -3.1, laptopScale: 0.0, saduPositionY: -3.1, saduScaleScalar: 0.0, duration: 0.6, ease: "power2.in" }, 3.4);
      });

      // 2. MOBILE TIMELINE (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        if (!canvas) return;

        const mobileProxy = {
          lidRotationX: 1.6,
          laptopRotationY: -0.3,
          glowIntensity: 0.0,
          particleProgress: 0.0,
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 20%",
            scrub: 1.2,
          },
          onUpdate: () => {
            if (canvas.lidGroup) canvas.lidGroup.rotation.x = mobileProxy.lidRotationX;
            if (canvas.laptopGroup) canvas.laptopGroup.rotation.y = mobileProxy.laptopRotationY;
            if (canvas.screenGlowLight) canvas.screenGlowLight.intensity = mobileProxy.glowIntensity;
            canvas.particleProxy.progress = mobileProxy.particleProgress;
          }
        });

        // Simply open the lid
        tl.to(mobileProxy, { lidRotationX: 0.0, laptopRotationY: 0.1, ease: "power2.inOut", duration: 1.0 }, 0);

        // Screen glows
        tl.to(mobileProxy, { glowIntensity: 3.5, duration: 0.8 }, 0.2);

        // Launch particles
        tl.to(mobileProxy, { particleProgress: 1.0, ease: "power1.out", duration: 1.2 }, 0.3);
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [introDone, canvasReady] }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full overflow-hidden bg-blayz-cream min-h-svh flex items-center justify-center"
    >
      {/* faint full-bleed arabesque watermark slot (PRD §7.1) */}
      <div className="arabesque-watermark pointer-events-none absolute inset-0 opacity-[0.05]" />

      {/* WebGL Three.js Canvas centerpiece (Desktop/Tablet/Mobile compatible) */}
      {introDone && <HeroCanvas3D ref={canvasRef} onReady={() => setCanvasReady(true)} />}

      {/* 1. DESKTOP OVERLAY LAYOUT (min-width: 1024px) */}
      <div className="hidden lg:grid grid-cols-2 w-full h-screen items-center justify-between relative max-w-7xl mx-auto z-10 px-12 pointer-events-none">
        {/* Left Column: Logo & Tagline/Index/CTA */}
        <div className="relative flex flex-col justify-center h-full items-start gap-12 w-full pointer-events-none">
          {/* Logo container: starts centered, docks to top-left */}
          <div
            ref={desktopLogoRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[14rem] flex items-center justify-center pointer-events-none opacity-0"
          >
            {/* Background Orange Logo */}
            <Logo fillColor="var(--blayz-orange)" className="absolute inset-0 w-full h-full" />
            
            {/* Foreground White Logo */}
            <div
              ref={desktopWhiteLogoRef}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              <Logo fillColor="#ffffff" className="w-full h-full" />
            </div>
          </div>

          {/* Secondary contents that fade out on scroll */}
          <div ref={desktopTextRef} className="flex flex-col items-start gap-10 mt-[16rem] pointer-events-auto">
            <p className="max-w-md text-balance font-sans text-xl text-blayz-ink/75 text-left">
              We build websites that build brands.
              <span className="mt-1 block font-mono text-sm text-blayz-ink/40">
                crafted with code &amp; culture
              </span>
            </p>

            <HeroIndex />

            <button
              onClick={() => scrollTo("contact")}
              className="group font-mono text-base text-blayz-ink transition-colors hover:text-blayz-orange cursor-pointer"
            >
              <span className="text-blayz-orange">&lt;</span> start a project{" "}
              <span className="text-blayz-orange">/&gt;</span>
            </button>
          </div>
        </div>

        {/* Right Column (Reserved space for laptop canvas) */}
        <div className="relative flex items-center justify-center h-full w-full pointer-events-none" />
      </div>

      {/* 2. MOBILE/TABLET LAYOUT (max-width: 1023px) */}
      <div className="lg:hidden relative flex flex-col items-center gap-10 text-center w-full max-w-4xl z-10 px-6 py-24 pointer-events-none">
        <AnimatePresence>
          {showBig && (
            <motion.button
              layoutId="blayz-logo"
              onClick={() => scrollTo("contact")}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="w-[44vw] h-[22vw] sm:w-[32vw] sm:h-[16vw] text-blayz-orange flex items-center justify-center pointer-events-auto cursor-pointer"
              aria-label="Blayz"
            >
              <Logo fillColor="currentColor" className="w-full h-full" />
            </motion.button>
          )}
        </AnimatePresence>

        <HeroIndex />

        <motion.div
          initial={introDone ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: introDone ? 0 : 0.4, duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <p className="max-w-md text-balance font-sans text-lg text-blayz-ink/70">
            We build websites that build brands.
            <span className="mt-1 block font-mono text-sm text-blayz-ink/40">
              crafted with code &amp; culture
            </span>
          </p>

          <button
            onClick={() => scrollTo("contact")}
            className="group font-mono text-base text-blayz-ink transition-colors hover:text-blayz-orange pointer-events-auto cursor-pointer"
          >
            <span className="text-blayz-orange">&lt;</span> start a project{" "}
            <span className="text-blayz-orange">/&gt;</span>
          </button>
        </motion.div>

        {/* Empty spacing for inline canvas underneath contents on mobile */}
        <div className="h-[200px] sm:h-[300px] w-full pointer-events-none" />
      </div>

      {/* scroll cue (Desktop only, hides as scroll starts) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showBig ? 1 : 0 }}
        transition={{ delay: 0.8 }}
        className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-blayz-ink/40 z-10"
      >
        scroll ↓
      </motion.div>
    </section>
  );
}

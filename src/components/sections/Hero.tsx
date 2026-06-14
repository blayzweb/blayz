"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HeroIndex } from "@/components/nav/HeroIndex";
import { useSite } from "@/components/providers/SiteProvider";
import { Logo } from "@/components/ui/Logo";
import { Laptop3D, type Laptop3DHandle } from "@/components/ui/Laptop3D";
import { SaduRibbon } from "@/components/ui/SaduRibbon";

/**
  * Hero section refactored to support a cinematic 5-stage scroll animation storyboard
  * on desktop viewports using a single consolidated master ScrollTrigger timeline,
  * with a clean flow fallback on mobile viewports.
  */
export function Hero() {
  const { scrolled, introDone, scrollTo } = useSite();
  const showBig = !scrolled;

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopLogoRef = useRef<HTMLDivElement>(null);
  const desktopWhiteLogoRef = useRef<HTMLDivElement>(null);
  const desktopRibbonRef = useRef<HTMLDivElement>(null);
  const desktopTextRef = useRef<HTMLDivElement>(null);
  const laptop3DRef = useRef<Laptop3DHandle>(null);

  useGSAP(
    () => {
      if (!introDone) return;

      const logo = desktopLogoRef.current;
      const whiteLogo = desktopWhiteLogoRef.current;
      const ribbon = desktopRibbonRef.current;
      const text = desktopTextRef.current;
      const laptopHandle = laptop3DRef.current;

      if (!logo || !whiteLogo || !ribbon || !text || !laptopHandle) return;

      const { laptopRef: laptop, lidRef: lid, screenRef: screen, particlesRef, particles } = laptopHandle;
      if (!laptop || !lid || !screen || !particlesRef) return;

      const particleItems = particlesRef.querySelectorAll("[data-particle]");

      const mm = gsap.matchMedia();

      // 1. DESKTOP TIMELINE (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        // Explicitly set initial desktop states to avoid hydration/render race conditions
        gsap.set(lid, { transform: "rotateX(82deg)" }); // closed flat on keyboard
        gsap.set(laptop, { transform: "rotateX(12deg) rotateY(0deg) rotateZ(0deg)", opacity: 1, scale: 1 });
        gsap.set(particleItems, { opacity: 0, scale: 0.1, z: 0 });
        gsap.set(ribbon, { width: "0px", opacity: 1 });
        gsap.set(whiteLogo, { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", opacity: 1 });

        // Single pinned timeline scrub ScrollTrigger (total virtual duration = 4.0s)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            start: "top top",
            end: "+=200%",
            scrub: 1.0,
            pinSpacing: true,
          },
        });

        // Frame 1 -> Frame 2: Tagline, Index, and CTA fade out (0s -> 0.6s)
        tl.to(
          text,
          {
            opacity: 0,
            y: -24,
            duration: 0.6,
            ease: "power2.out",
          },
          0
        );

        // Frame 2 -> Frame 3: Laptop lid opens and tilts back (0s -> 1.2s)
        // Animates from rotateX(82deg) [closed] to rotateX(-15deg) [open/tilted back]
        tl.to(
          lid,
          {
            transform: "rotateX(-15deg)",
            ease: "power2.inOut",
            duration: 1.2,
          },
          0
        );

        tl.to(
          laptop,
          {
            transform: "rotateX(12deg) rotateY(15deg) rotateZ(5deg)",
            ease: "power2.inOut",
            duration: 1.2,
          },
          0
        );

        // Frame 3: Screen glow starts (0.8s -> 1.3s)
        tl.to(
          screen,
          {
            boxShadow: "0 0 50px rgba(255, 56, 0, 0.5), inset 0 0 25px rgba(255, 56, 0, 0.25)",
            borderColor: "rgba(255, 56, 0, 0.8)",
            duration: 0.5,
          },
          0.8
        );

        // Frame 3: Particles launch towards the viewer (1.0s -> 2.2s)
        particles.forEach((p, idx) => {
          const item = particleItems[idx];
          if (!item) return;

          const startAt = 1.0 + (idx % 4) * 0.08;

          tl.to(
            item,
            {
              x: p.endX,
              y: p.endY,
              z: p.endZ,
              scale: p.scaleEnd,
              rotationX: p.rotationX,
              rotationY: p.rotationY,
              rotationZ: p.rotationZ,
              ease: "power1.out",
              duration: 1.2,
            },
            startAt
          );

          tl.to(
            item,
            {
              opacity: 0.9,
              duration: 0.2,
              ease: "power1.in",
            },
            startAt
          );

          tl.to(
            item,
            {
              opacity: 0,
              duration: 0.35,
              ease: "power1.out",
            },
            startAt + 0.85
          );
        });

        // Frame 4: Laptop rotates sideways to face the left (2.2s -> 3.0s)
        // Screen base turns sideways (rotateY 80deg), lid tilts to exactly vertical relative to keyboard (-90deg)
        tl.to(
          laptop,
          {
            transform: "rotateX(0deg) rotateY(80deg) rotateZ(0deg)",
            ease: "power2.inOut",
            duration: 0.8,
          },
          2.2
        );

        tl.to(
          lid,
          {
            transform: "rotateX(-90deg)",
            ease: "power2.inOut",
            duration: 0.8,
          },
          2.2
        );

        // Frame 4 -> Frame 5: Sadu ribbon emerges from screen and grows leftwards (2.2s -> 3.2s)
        tl.to(
          ribbon,
          {
            width: "60vw",
            duration: 1.0,
            ease: "power2.inOut",
          },
          2.2
        );

        // Frame 5: Logo turns white procedurally behind the ribbon leading edge (2.55s -> 3.1s)
        tl.to(
          whiteLogo,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.55,
            ease: "none",
          },
          2.55
        );

        // Frame 6: Logo docks to top-left and scales down to header dimensions (3.2s -> 4.0s)
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

        // Fade out the laptop and ribbon at the end
        tl.to(
          laptop,
          {
            opacity: 0,
            scale: 0.7,
            duration: 0.6,
            ease: "power2.out",
          },
          3.4
        );

        tl.to(
          ribbon,
          {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          3.4
        );
        // No separate cleanup needed as matchMedia handles timeline revert automatically
      });

      // 2. MOBILE TIMELINE (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        // Set initial mobile state
        gsap.set(lid, { transform: "rotateX(82deg)" });
        gsap.set(laptop, { transform: "rotateX(12deg) rotateY(0deg) rotateZ(0deg)", opacity: 1, scale: 1 });
        gsap.set(particleItems, { opacity: 0, scale: 0.1, z: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: laptop,
            start: "top 75%",
            end: "bottom 20%",
            scrub: 1.2,
          },
        });

        // Simply open the lid
        tl.to(
          lid,
          {
            transform: "rotateX(-20deg)",
            ease: "power2.inOut",
            duration: 1.0,
          },
          0
        );

        // Screen glows
        tl.to(
          screen,
          {
            boxShadow: "0 0 30px rgba(255, 56, 0, 0.4), inset 0 0 15px rgba(255, 56, 0, 0.15)",
            borderColor: "rgba(255, 56, 0, 0.6)",
            duration: 0.4,
          },
          0.2
        );

        // Launch particles
        particles.forEach((p, idx) => {
          const item = particleItems[idx];
          if (!item) return;

          const startAt = 0.3 + (idx % 4) * 0.08;

          tl.to(
            item,
            {
              x: p.endX * 0.6, 
              y: p.endY * 0.6,
              z: p.endZ * 0.5,
              scale: p.scaleEnd * 0.7,
              ease: "power1.out",
              duration: 1.2,
            },
            startAt
          );

          tl.to(
            item,
            {
              opacity: 0.8,
              duration: 0.2,
            },
            startAt
          );

          tl.to(
            item,
            {
              opacity: 0,
              duration: 0.3,
            },
            startAt + 0.85
          );
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [introDone] }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full overflow-hidden bg-blayz-cream min-h-svh flex items-center justify-center"
    >
      {/* faint full-bleed arabesque watermark slot (PRD §7.1) */}
      <div className="arabesque-watermark pointer-events-none absolute inset-0 opacity-[0.05]" />

      {/* 1. DESKTOP LAYOUT (min-width: 1024px) */}
      <div className="hidden lg:grid grid-cols-2 w-full h-screen items-center justify-between relative max-w-7xl mx-auto z-10 px-12">
        {/* Left Column: Logo & Tagline/Index/CTA */}
        <div className="relative flex flex-col justify-center h-full items-start gap-12 w-full">
          {/* Logo container: starts centered, docks to top-left */}
          <div
            ref={desktopLogoRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[14rem] flex items-center justify-center pointer-events-none"
          >
            {/* Background Orange Logo */}
            <Logo fillColor="var(--blayz-orange)" className="absolute inset-0 w-full h-full" />
            
            {/* Foreground White Logo (Wiped from right to left) */}
            <div
              ref={desktopWhiteLogoRef}
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
            >
              <Logo fillColor="#ffffff" className="w-full h-full" />
            </div>
          </div>

          {/* Secondary contents that fade out on scroll */}
          <div ref={desktopTextRef} className="flex flex-col items-start gap-10 mt-[16rem]">
            <p className="max-w-md text-balance font-sans text-xl text-blayz-ink/75 text-left">
              We build websites that build brands.
              <span className="mt-1 block font-mono text-sm text-blayz-ink/40">
                crafted with code &amp; culture
              </span>
            </p>

            <HeroIndex />

            <button
              onClick={() => scrollTo("contact")}
              className="group font-mono text-base text-blayz-ink transition-colors hover:text-blayz-orange"
            >
              <span className="text-blayz-orange">&lt;</span> start a project{" "}
              <span className="text-blayz-orange">/&gt;</span>
            </button>
          </div>
        </div>

        {/* Right Column: Laptop centerpiece */}
        <div className="relative flex items-center justify-center h-full w-full">
          <Laptop3D ref={laptop3DRef} />
        </div>
      </div>

      {/* Horizontal Sadu Ribbon (Desktop only) */}
      <div
        ref={desktopRibbonRef}
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
        style={{
          right: "23%", // centered relative to the laptop column
          width: "0px",
          height: "96px", // h-24 equivalent
        }}
      >
        <SaduRibbon className="w-full h-full" />
      </div>

      {/* 2. MOBILE/TABLET LAYOUT (max-width: 1023px) */}
      <div className="lg:hidden relative flex flex-col items-center gap-10 text-center w-full max-w-4xl z-10 px-6 py-24">
        {/* wordmark — docks to the header on Stage B via shared layoutId */}
        <AnimatePresence>
          {showBig && (
            <motion.button
              layoutId="blayz-logo"
              onClick={() => scrollTo("contact")}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="w-[44vw] h-[22vw] sm:w-[32vw] sm:h-[16vw] text-blayz-orange flex items-center justify-center"
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
            className="group font-mono text-base text-blayz-ink transition-colors hover:text-blayz-orange"
          >
            <span className="text-blayz-orange">&lt;</span> start a project{" "}
            <span className="text-blayz-orange">/&gt;</span>
          </button>
        </motion.div>

        {/* Ref is not needed for mobile layout since it runs its own inline triggers */}
        <Laptop3D />
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

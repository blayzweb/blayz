"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";

interface HeroCanvasProps {
  children: React.ReactNode;
}

export function HeroCanvas({ children }: HeroCanvasProps) {
  const { introDone } = useSite();
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);

  // Preload all 120 WebP images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = 300;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalImages; i++) {
      const img = new Image();
      const paddedFrame = String(i).padStart(4, "0");
      img.src = `/assets/hero-sequence/frame_${paddedFrame}.webp`;

      const onImageLoad = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalImages) * 100));
        if (loadedCount === totalImages) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };

      img.onload = onImageLoad;
      img.onerror = onImageLoad; // Fallback to avoid blocking on load error
      loadedImages[i] = img;
    }
  }, []);

  // Handle Resize and Drawing
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      // Draw the current active frame on resize
      drawFrame(currentFrameRef.current);
    };

    const drawFrame = (frameIndex: number) => {
      const img = imagesRef.current[frameIndex];
      const canvas = canvasRef.current;
      if (!img || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const iw = img.width;
      const ih = img.height;

      // Cover scaling calculation (like background-size: cover)
      const r = Math.max(w / iw, h / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (w - nw) / 2;
      const cy = (h - nh) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, cx, cy, nw, nh);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Draw initial frame

    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded]);

  // GSAP ScrollTrigger Sequence
  useGSAP(() => {
    if (!introDone || !imagesLoaded || !canvasRef.current || !canvasContainerRef.current || !triggerRef.current || !pinRef.current) return;

    const canvas = canvasRef.current;
    const canvasContainer = canvasContainerRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (frameIndex: number) => {
      const img = imagesRef.current[frameIndex];
      if (!img || img.width === 0) {
        console.warn(`[HeroCanvas] Missing or unrendered frame image: ${frameIndex}`);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      const iw = img.width;
      const ih = img.height;
      const r = Math.max(w / iw, h / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (w - nw) / 2;
      const cy = (h - nh) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, cx, cy, nw, nh);
    };

    const obj = { frame: 1 };
    
    // Create ScrollTrigger timeline covering 3 full scrolls (300vh)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: pinRef.current,
        anticipatePin: 1,
        onRefresh: () => {
          // Keep canvas dimensions synced on layout changes
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          drawFrame(Math.floor(obj.frame));
        }
      },
    });

    // Animate frame scrubbing from 1 to 300 (mapped to duration 100)
    tl.to(obj, {
      frame: 300,
      ease: "none",
      duration: 100,
      onUpdate: () => {
        const f = Math.floor(obj.frame);
        currentFrameRef.current = f;
        drawFrame(f);
      },
    }, 0);

    // Fade out original hero landing elements (logo, index, tagline) in the first 15% of scroll
    tl.to(".hero-fade-out", {
      opacity: 0,
      pointerEvents: "none",
      duration: 15,
      ease: "power1.out"
    }, 0);

    // Fade in new cultural/digital copywriting on the right between 45% and 75% scroll
    tl.fromTo(".hero-copy-overlay", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 25, ease: "power2.out" },
      45
    );

    // Fade out the canvas container wrapper and the copy overlay at the end (85% to 100%) to transition to About section
    tl.to(canvasContainer, {
      opacity: 0,
      duration: 15,
      ease: "power1.inOut"
    }, 85);

    tl.to(".hero-copy-overlay", {
      opacity: 0,
      y: -30,
      duration: 15,
      ease: "power1.inOut"
    }, 85);

  }, [imagesLoaded, introDone]);

  return (
    <div ref={triggerRef} id="hero" className="relative h-[400vh] w-full">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-blayz-cream">
        {/* Canvas background wrapper container */}
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ opacity: imagesLoaded ? 1 : 0 }}
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full pointer-events-none"
          />
        </div>

        {/* Loading overlay if images are still preloading */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blayz-cream text-blayz-orange z-50">
            <div className="font-mono text-lg mb-2">LOADING 3D EXPERIENCE</div>
            <div className="w-48 h-[2px] bg-blayz-orange/20 relative overflow-hidden rounded">
              <div 
                className="h-full bg-blayz-orange transition-all duration-150" 
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <div className="font-mono text-xs mt-2 opacity-60">{loadProgress}%</div>
          </div>
        )}

        {/* Children content layers on top of canvas */}
        <div className="relative z-10 h-full w-full">
          {children}
          
          {/* New copy overlay that appears during scroll pan */}
          <div className="hero-copy-overlay absolute right-[10%] top-[45%] -translate-y-1/2 max-w-md pointer-events-none opacity-0 select-none">
            <h2 className="font-sans text-3xl font-light text-blayz-ink leading-snug">
              A studio where ornament meets the command line.
            </h2>
            <p className="mt-4 font-mono text-sm text-blayz-orange">
              [ 01 / CRAFT &amp; CODE ]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

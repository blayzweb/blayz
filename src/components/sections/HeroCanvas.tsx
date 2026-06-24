"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HERO_HEIGHT_VH } from "@/lib/hero-scroll";
import { useSite } from "@/components/providers/SiteProvider";
import { ScrollIndicator } from "@/components/sections/ScrollIndicator";

interface HeroCanvasProps {
  children: React.ReactNode;
}

export function HeroCanvas({ children }: HeroCanvasProps) {
  const { introDone, heroReady, setHeroReady } = useSite();
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (imagesLoaded) {
      setHeroReady(true);
    }
  }, [imagesLoaded, setHeroReady]);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);
  const firstFrameDrawnRef = useRef(false);

  const getClosestLoadedImage = (frameIndex: number): HTMLImageElement | undefined => {
    const img = imagesRef.current[frameIndex];
    if (img && img.width > 0) return img;

    let closestIdx = 1;
    let minDiff = Infinity;
    for (let i = 1; i <= 300; i++) {
      const checkImg = imagesRef.current[i];
      if (checkImg && checkImg.width > 0) {
        const diff = Math.abs(i - frameIndex);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      }
    }
    return imagesRef.current[closestIdx];
  };

  const drawFrameToCanvas = (frameIndex: number) => {
    const img = getClosestLoadedImage(frameIndex);
    const canvas = canvasRef.current;
    if (!img?.width || !canvas) return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
    return true;
  };

  const paintFirstFrame = () => {
    if (firstFrameDrawnRef.current) return;
    if (drawFrameToCanvas(1)) {
      firstFrameDrawnRef.current = true;
    }
  };

  // Preload frames progressively so the experience is interactive quickly.
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    imagesRef.current = loadedImages;

    const totalImages = 300;

    // Define draft frames: e.g. every 10th frame, plus first and last.
    const draftIndices = [1];
    for (let i = 11; i < totalImages; i += 10) {
      draftIndices.push(i);
    }
    if (!draftIndices.includes(totalImages)) {
      draftIndices.push(totalImages);
    }

    let draftLoadedCount = 0;

    const registerDraftFrame = (frameIndex: number, img: HTMLImageElement) => {
      loadedImages[frameIndex] = img;

      const afterDecode = () => {
        draftLoadedCount++;
        setLoadProgress(Math.round((draftLoadedCount / draftIndices.length) * 100));

        if (frameIndex === 1) {
          paintFirstFrame();
        }

        if (draftLoadedCount === draftIndices.length) {
          setImagesLoaded(true);
          // Start preloading the remaining gap frames in background batches.
          loadRemainingFrames();
        }
      };

      if (typeof img.decode === "function") {
        img.decode().then(afterDecode).catch(afterDecode);
      } else {
        afterDecode();
      }
    };

    const loadDraftFrame = (frameIndex: number) => {
      const img = new Image();
      img.src = `/assets/hero-sequence/frame_${String(frameIndex).padStart(4, "0")}.webp`;
      img.onload = () => registerDraftFrame(frameIndex, img);
      img.onerror = () => registerDraftFrame(frameIndex, img);
    };

    // Load Phase 2 (Draft sequence)
    draftIndices.forEach((idx) => {
      loadDraftFrame(idx);
    });

    const loadRemainingFrames = () => {
      const remainingIndices: number[] = [];
      for (let i = 1; i <= totalImages; i++) {
        if (!draftIndices.includes(i)) {
          remainingIndices.push(i);
        }
      }

      const BATCH_SIZE = 6;
      let activeIndex = 0;

      const loadNextBatch = () => {
        if (activeIndex >= remainingIndices.length) return;
        const batch = remainingIndices.slice(activeIndex, activeIndex + BATCH_SIZE);
        activeIndex += BATCH_SIZE;

        Promise.all(
          batch.map((idx) => {
            return new Promise<void>((resolve) => {
              const img = new Image();
              img.src = `/assets/hero-sequence/frame_${String(idx).padStart(4, "0")}.webp`;
              img.onload = () => {
                loadedImages[idx] = img;
                if (typeof img.decode === "function") {
                  img.decode().then(() => resolve()).catch(() => resolve());
                } else {
                  resolve();
                }
              };
              img.onerror = () => {
                resolve();
              };
            });
          })
        ).then(() => {
          loadNextBatch();
        });
      };

      loadNextBatch();
    };
  }, []);

  // Keep frame 1 fitted while the intro is playing.
  useEffect(() => {
    if (introDone && imagesLoaded) return;

    const onResize = () => paintFirstFrame();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [introDone, imagesLoaded]);

  // Paint as soon as the canvas element exists (frame 1 may have loaded first).
  useLayoutEffect(() => {
    paintFirstFrame();
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
      const img = getClosestLoadedImage(frameIndex);
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
      const img = getClosestLoadedImage(frameIndex);
      if (!img || img.width === 0) {
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
    let lastFrame = -1;

    const totalFrames = 300;
    const scrubDuration = 100;
    const fadeFrameCount = 10;
    // Last 10 frames (291–300): fade runs in lockstep with the tail of the scrub.
    const fadeStart =
      ((totalFrames - fadeFrameCount) / (totalFrames - 1)) * scrubDuration;
    const fadeDuration = (fadeFrameCount / (totalFrames - 1)) * scrubDuration;
    
    // ScrollTrigger timeline — scroll distance set by HERO_HEIGHT_VH.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        pin: pinRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          // Keep canvas dimensions synced on layout changes
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          drawFrame(Math.floor(obj.frame));
        }
      },
    });

    // Scrub frames 1→300 across the scroll.
    tl.to(obj, {
      frame: totalFrames,
      ease: "none",
      duration: scrubDuration,
      onUpdate: () => {
        const f = Math.floor(obj.frame);
        if (f !== lastFrame) {
          lastFrame = f;
          currentFrameRef.current = f;
          drawFrame(f);
        }
      },
    }, 0);

    // Fade out over the last 10 frames so About is revealed as the sequence ends.
    tl.to(canvasContainer, {
      opacity: 0,
      duration: fadeDuration,
      ease: "power1.inOut"
    }, fadeStart);

  }, [imagesLoaded, introDone]);

  return (
    <div
      ref={triggerRef}
      id="hero"
      className="relative w-full"
      style={{ height: `${HERO_HEIGHT_VH}vh` }}
    >
      <div
        ref={pinRef}
        className={`relative h-screen w-full overflow-hidden ${introDone ? "bg-blayz-cream" : "bg-black"}`}
      >
        {/* Canvas background wrapper container */}
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ opacity: 1 }}
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full pointer-events-none"
            style={{ willChange: "transform" }}
            role="img"
            aria-label="3D rendering sequence of Arabic geometric patterns and code elements"
          />
        </div>

        {/* Loading overlay if images are still preloading */}
        {!imagesLoaded && introDone && (
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

        <ScrollIndicator ready={heroReady} />

        {/* Children content layers on top of canvas */}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

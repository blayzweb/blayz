"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { SectionId } from "@/lib/sections";
import { SECTIONS } from "@/lib/sections";

/** A build configuration handed off from the Pricing configurator to Contact. */
export interface QuotePrefill {
  projectType: string;
  message: string;
}

interface SiteContextValue {
  /** Stage B: true once the user scrolls past the Hero (PRD §6.2). */
  scrolled: boolean;
  /** Section currently in view, drives the Index active state. */
  activeSection: SectionId;
  /** Stage A intro has finished playing (or was skipped). */
  introDone: boolean;
  setIntroDone: (v: boolean) => void;
  /** Smooth-scroll to a section via Lenis. */
  scrollTo: (id: SectionId) => void;
  /** Pause/resume Lenis (used to lock the page behind the configurator modal). */
  lockScroll: (locked: boolean) => void;
  /** Latest build config to prefill the contact form, if any. */
  quote: QuotePrefill | null;
  /** Stash a build config and jump to the contact form. */
  requestQuote: (quote: QuotePrefill) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <SiteProvider>");
  return ctx;
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [introDone, setIntroDone] = useState(false);
  const [quote, setQuote] = useState<QuotePrefill | null>(null);

  // Drive Lenis from GSAP's ticker so scroll + ScrollTrigger stay in sync.
  useEffect(() => {
    function raf(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
    };
  }, []);

  // Bridge Lenis scroll -> ScrollTrigger, and track nav state.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onScroll = () => {
      ScrollTrigger.update();

      const heroThreshold = window.innerHeight * 2.8;
      const hysteresis = 48;
      setScrolled((prev) => {
        if (!prev && window.scrollY > heroThreshold) return true;
        if (prev && window.scrollY < heroThreshold - hysteresis) return false;
        return prev;
      });

      // Active section: last section whose top has crossed the viewport midline.
      const mid = window.scrollY + window.innerHeight * 0.4;
      let current: SectionId = "hero";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= mid) current = s.id;
      }
      setActiveSection(current);
    };

    lenis.on("scroll", onScroll);
    onScroll();
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    return () => {
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
    };
  }, [introDone]);

  // Refresh ScrollTrigger after intro completes (layout may shift).
  useEffect(() => {
    if (introDone) ScrollTrigger.refresh();
  }, [introDone]);

  const scrollTo = useCallback((id: SectionId) => {
    const lenis = lenisRef.current?.lenis;
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.35, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = lenisRef.current?.lenis;
    if (locked) lenis?.stop();
    else lenis?.start();
  }, []);

  const requestQuote = useCallback(
    (next: QuotePrefill) => {
      setQuote(next);
      // Let the modal close + form mount before scrolling to it.
      requestAnimationFrame(() => scrollTo("contact"));
    },
    [scrollTo],
  );

  const value = useMemo<SiteContextValue>(
    () => ({
      scrolled,
      activeSection,
      introDone,
      setIntroDone,
      scrollTo,
      lockScroll,
      quote,
      requestQuote,
    }),
    [scrolled, activeSection, introDone, scrollTo, lockScroll, quote, requestQuote],
  );

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, smoothWheel: true }}
    >
      <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
    </ReactLenis>
  );
}

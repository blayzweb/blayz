"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * AsciiFlames — a monospace "doom fire" effect rendered as ASCII characters.
 *
 * Blayz literally means *blaze*; this footer sets the wordmark alight. The fire
 * is simulated on a character grid (heat seeded at the base, propagated upward
 * with cooling + horizontal drift) and painted to a canvas using JetBrains Mono
 * in the brand's warm palette (oxblood -> orange -> gold -> peach -> cream).
 *
 * Honours `prefers-reduced-motion` by drawing a single settled frame instead of
 * animating, matching the site-wide reduced-motion contract.
 */

// Density ramp: cooler/sparser characters at flame tips, denser toward the core.
const RAMP = " ..::--==++**ooxx##%%@@";

// Heat ramp mapped cold (tip) -> hot (base), with explicit positions so the
// brand orange dominates the mid-range and cream only flares at the white-hot core.
const PALETTE_STOPS: Array<[number, [number, number, number]]> = [
  [0.0, [122, 17, 24]], // #7a1118 oxblood — coolest tip ember
  [0.14, [255, 56, 0]], // #ff3800 orange — kicks in low so flames read orange
  [0.72, [255, 88, 12]], // sustained orange through the body of the flame
  [0.86, [226, 192, 122]], // #e2c07a gold
  [0.95, [255, 182, 154]], // #ffb69a peach
  [1.0, [255, 242, 226]], // #fff2e2 cream — white-hot core
];

const LEVELS = 28;
const FONT_PX = 10;
const LINE_PX = 9; // tighter than font size for a dense, fine-grained flame field
const TARGET_FPS = 30;

function buildColors(): string[] {
  const colors: string[] = new Array(LEVELS + 1);
  colors[0] = "transparent";
  for (let level = 1; level <= LEVELS; level++) {
    const t = (level - 1) / (LEVELS - 1); // 0 = coolest, 1 = hottest
    let i = 0;
    while (i < PALETTE_STOPS.length - 2 && t > PALETTE_STOPS[i + 1][0]) i++;
    const [p0, a] = PALETTE_STOPS[i];
    const [p1, b] = PALETTE_STOPS[i + 1];
    const f = p1 === p0 ? 0 : (t - p0) / (p1 - p0);
    const r = Math.round(a[0] + (b[0] - a[0]) * f);
    const g = Math.round(a[1] + (b[1] - a[1]) * f);
    const bl = Math.round(a[2] + (b[2] - a[2]) * f);
    // Cool tips fade toward transparent so flames dissolve softly into the
    // dark instead of ending on a hard edge.
    const alpha = Math.min(1, 0.08 + t * 1.05);
    colors[level] = `rgba(${r}, ${g}, ${bl}, ${alpha.toFixed(3)})`;
  }
  return colors;
}

export function AsciiFlames({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = buildColors();
    let cols = 0;
    let rows = 0;
    let buffer = new Uint8Array(0);
    let charW = FONT_PX * 0.6;
    let rafId = 0;
    let lastTime = 0;
    let phase = 0; // drives the drifting flame tongues
    let disposed = false;

    function setup() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_PX}px var(--font-mono-code), ui-monospace, monospace`;
      ctx.textBaseline = "top";
      charW = ctx.measureText("M").width || FONT_PX * 0.6;

      cols = Math.max(1, Math.ceil(rect.width / charW));
      rows = Math.max(1, Math.ceil(rect.height / LINE_PX));
      buffer = new Uint8Array(cols * rows);
    }

    function seedBase() {
      const base = (rows - 1) * cols;
      for (let x = 0; x < cols; x++) {
        // Layered, drifting sines carve the fire into discrete rising tongues
        // with cold gaps between them, rather than one continuous sheet.
        const n =
          Math.sin(x * 0.17 + phase) * 0.5 +
          Math.sin(x * 0.045 - phase * 0.6) * 0.3 +
          Math.sin(x * 0.33 + phase * 1.4) * 0.2;
        const m = (n + 1) / 2; // 0..1
        // Keep a warm ember floor so the fire reads as one continuous bed with
        // rising tongues on top, rather than isolated patches with dark gaps.
        const shaped = Math.max(0, m - 0.06) / 0.94;
        const flicker = Math.random() * 0.24;
        const level = Math.round((0.18 + shaped * 0.78 + flicker) * LEVELS);
        buffer[base + x] = level > LEVELS ? LEVELS : level;
      }
      phase += 0.075;
    }

    function step() {
      for (let x = 0; x < cols; x++) {
        for (let y = 1; y < rows; y++) {
          const src = y * cols + x;
          // Gentle cooling keeps tongues tall; finer grid + occasional drift
          // gives an organic flicker without scattering into noise.
          const decay = Math.random() < 0.55 ? 0 : 1;
          const dstX = Math.random() < 0.4 ? x + (Math.random() < 0.5 ? -1 : 1) : x;
          if (dstX < 0 || dstX >= cols) continue;
          const dst = (y - 1) * cols + dstX;
          const v = buffer[src] - decay;
          buffer[dst] = v > 0 ? v : 0;
        }
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.restore();

      let lastColor = "";
      let lastAlpha = -1;
      // Ramp the flames in over the top ~55% of the field (eased) so they
      // emerge gradually from the page rather than starting on a hard edge,
      // matching the background's darkness fade.
      const fadeRows = rows * 0.55;
      for (let y = 0; y < rows; y++) {
        const py = y * LINE_PX;
        const linear = y >= fadeRows ? 1 : Math.max(0, y / fadeRows);
        const rowAlpha = linear * linear; // ease-in for a softer onset
        if (rowAlpha !== lastAlpha) {
          ctx.globalAlpha = rowAlpha;
          lastAlpha = rowAlpha;
        }
        for (let x = 0; x < cols; x++) {
          const v = buffer[y * cols + x];
          if (v <= 0) continue;
          const ch = RAMP[Math.min(RAMP.length - 1, ((v / LEVELS) * (RAMP.length - 1)) | 0)];
          if (ch === " ") continue;
          const color = colors[v];
          if (color !== lastColor) {
            ctx.fillStyle = color;
            lastColor = color;
          }
          ctx.fillText(ch, x * charW, py);
        }
      }
      ctx.globalAlpha = 1;
    }

    function loop(time: number) {
      if (disposed) return;
      rafId = requestAnimationFrame(loop);
      if (time - lastTime < 1000 / TARGET_FPS) return;
      lastTime = time;
      seedBase();
      step();
      draw();
    }

    function start() {
      setup();
      if (cols === 0 || rows === 0) return;
      cancelAnimationFrame(rafId);
      if (reduced) {
        // Settle the simulation, then paint one static frame.
        for (let i = 0; i < rows + 8; i++) {
          seedBase();
          step();
        }
        draw();
        return;
      }
      lastTime = 0;
      rafId = requestAnimationFrame(loop);
    }

    start();

    const ro = new ResizeObserver(() => start());
    ro.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}

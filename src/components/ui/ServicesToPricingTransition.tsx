"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const WIDTH = 1440;
const HEIGHT = 120;
const PERIOD = 60;
const STEP = 10;
const INK = "#1A1A1A";
const BASE_HEIGHTS = [60, 70, 80, 90, 80, 70] as const;

const WAVE = {
  amplitude: 5,
  wavelength: 360,
  speed: 1.05,
} as const;

function steppedY(x: number): number {
  const local = ((x % PERIOD) + PERIOD) % PERIOD;
  return BASE_HEIGHTS[Math.floor(local / STEP)] ?? 60;
}

/** Two blended sines — continuous flow without shearing the pixel steps. */
function waveOffset(x: number, time: number): number {
  const phase = (x / WAVE.wavelength) * Math.PI * 2 - time * WAVE.speed;
  return (
    WAVE.amplitude * Math.sin(phase) +
    WAVE.amplitude * 0.22 * Math.sin(phase * 1.6 + 0.9)
  );
}

function yAt(x: number, time: number): number {
  return Math.min(HEIGHT - 4, Math.max(50, steppedY(x) + waveOffset(x, time)));
}

function traceFlagPath(
  ctx: CanvasRenderingContext2D,
  time: number,
  mapX: (x: number) => number,
  mapY: (y: number) => number,
) {
  const y = (x: number) => yAt(x, time);

  ctx.beginPath();
  ctx.moveTo(mapX(0), mapY(0));
  ctx.lineTo(mapX(WIDTH), mapY(0));
  ctx.lineTo(mapX(WIDTH), mapY(y(WIDTH)));

  let cy = y(WIDTH);
  for (let x = WIDTH - STEP; x >= 0; x -= STEP) {
    const ny = y(x);
    ctx.lineTo(mapX(x), mapY(cy));
    ctx.lineTo(mapX(x), mapY(ny));
    cy = ny;
  }

  ctx.closePath();
}

function sliceTransform(
  width: number,
  height: number,
): { mapX: (x: number) => number; mapY: (y: number) => number } {
  const scale = Math.max(width / WIDTH, height / HEIGHT);
  const offsetX = (width - WIDTH * scale) / 2;
  const offsetY = (height - HEIGHT * scale) / 2;
  return {
    mapX: (x) => offsetX + x * scale,
    mapY: (y) => offsetY + y * scale,
  };
}

export function ServicesToPricingTransition() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let start = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const draw = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const { mapX, mapY } = sliceTransform(width, height);
      traceFlagPath(ctx, t, mapX, mapY);
      ctx.fillStyle = INK;
      ctx.fill();

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(performance.now());
    });
    ro.observe(wrap);

    if (reduced) {
      draw(start);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="relative z-10 h-32 w-full overflow-hidden bg-blayz-cream-deep">
      <div
        ref={wrapRef}
        className="absolute inset-0"
        aria-hidden
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
    </div>
  );
}

"use client";

import { useId } from "react";
import { clsx } from "@/lib/clsx";

/**
 * Tatreez (Levantine / Palestinian cross-stitch) embroidery primitives.
 *
 * Every motif is constructed from a strict grid of small square "stitch" units
 * rendered as SVG <rect>s with `shape-rendering: crispEdges`, so the geometry
 * stays hard-edged and pixel-like — woven, not drawn. No smooth curves, no
 * calligraphy, no mandalas. Bands tile seamlessly and are mirror-symmetric.
 */

/** Selects which large motif + band styling a surface uses. */
export type PatternType = "diamonds" | "floral" | "mixed";

/** Embroidery thread palette (deep red, oxblood, ivory, muted blue, beige, ink). */
export const TATREEZ_PALETTE = {
  ivory: "#F4EFE7",
  red: "#7A1118",
  oxblood: "#4A090D",
  ink: "#171313",
  blue: "#31496B",
  beige: "#C8B9A5",
} as const;

/** Single-char stitch codes used by the hand-authored band tiles and grids. */
const CODE: Record<string, string> = {
  R: TATREEZ_PALETTE.red,
  O: TATREEZ_PALETTE.oxblood,
  B: TATREEZ_PALETTE.blue,
  G: TATREEZ_PALETTE.beige,
  K: TATREEZ_PALETTE.ink,
  I: TATREEZ_PALETTE.ivory,
};

type Tile = readonly string[];

/* ============================================================
   Seamless horizontal band tiles (one repeating unit each).
   Mirror-symmetric and periodic so they repeat with no seam.
   ============================================================ */

/** Diamonds linked by small plus-stitches — a classic tatreez border run. */
const DIAMOND_TILE: Tile = [
  "RRRRRRRR",
  "........",
  "..R.....",
  ".RBR..G.",
  "RBOBRGRG",
  ".RBR..G.",
  "..R.....",
  "........",
  "RRRRRRRR",
];

/** Eight-point flowers joined by a beige "vine" — an organic border run. */
const FLORAL_TILE: Tile = [
  "RRRRRRRR",
  "........",
  "..R.....",
  ".BOB..G.",
  "RORORGGG",
  ".BOB..G.",
  "..R.....",
  "........",
  "RRRRRRRR",
];

/** Emit one stitch <rect> per filled cell of a grid of single-char codes. */
function stitches(grid: Tile, cell: number, overlap = 0) {
  const out: React.ReactElement[] = [];
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const fill = CODE[row[c]];
      if (!fill) continue;
      out.push(
        <rect
          key={`${r}-${c}`}
          x={c * cell}
          y={r * cell}
          width={cell + overlap}
          height={cell + overlap}
          fill={fill}
        />,
      );
    }
  }
  return out;
}

/* ============================================================
   TatreezBorder — a thin embroidered band that tiles full-width.
   ============================================================ */

export interface TatreezBorderProps {
  /** Which repeating motif to run. */
  variant?: "diamonds" | "floral";
  /** Band height in px (drives the stitch size). */
  height?: number;
  /** Flip vertically — pair a top band with its mirror at the bottom. */
  flip?: boolean;
  className?: string;
}

/**
 * Full-width embroidered band. Tiles a single motif in pixel space via an SVG
 * <pattern> with `userSpaceOnUse`, so stitches stay perfectly square at any
 * width and repeat with no visible seam.
 */
export function TatreezBorder({
  variant = "diamonds",
  height = 26,
  flip = false,
  className,
}: TatreezBorderProps) {
  const id = useId();
  const tile = variant === "floral" ? FLORAL_TILE : DIAMOND_TILE;
  const rows = tile.length;
  const cols = tile[0].length;
  const cell = height / rows;
  const tileW = cols * cell;

  return (
    <svg
      role="presentation"
      aria-hidden
      width="100%"
      height={height}
      shapeRendering="crispEdges"
      className={clsx("block", flip && "rotate-180", className)}
    >
      <defs>
        <pattern
          id={id}
          width={tileW}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          {stitches(tile, cell, 0.5)}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}

/* ============================================================
   Large motifs — single centered medallions on a cell grid.
   Built by formula so they're guaranteed symmetric.
   ============================================================ */

/** Concentric stepped diamonds — the dominant tatreez medallion. */
function buildDiamondGrid(size = 13): (string | null)[][] {
  const cc = (size - 1) / 2;
  const grid: (string | null)[][] = [];
  for (let r = 0; r < size; r++) {
    const row: (string | null)[] = [];
    for (let c = 0; c < size; c++) {
      const d = Math.abs(r - cc) + Math.abs(c - cc);
      let code: string | null;
      switch (d) {
        case 0:
          code = "O";
          break;
        case 1:
          code = "R";
          break;
        case 2:
          code = "B";
          break;
        case 4:
          code = "O";
          break;
        case 6:
          code = "R";
          break;
        default:
          code = null; // breathing rings at d = 3 and d = 5
      }
      row.push(code);
    }
    grid.push(row);
  }
  return grid;
}

/** Eight-point star / flower with a filled core and radiating stitched arms. */
function buildStarGrid(size = 15): (string | null)[][] {
  const cc = (size - 1) / 2;
  const grid: (string | null)[][] = [];
  for (let r = 0; r < size; r++) {
    const row: (string | null)[] = [];
    for (let c = 0; c < size; c++) {
      const ar = Math.abs(r - cc);
      const ac = Math.abs(c - cc);
      const dC = ar + ac;
      const cheb = Math.max(ar, ac);
      const dd = Math.abs(ar - ac);
      let code: string | null = null;

      if (dC === 0) code = "O";
      else if (dC === 1) code = "R";
      else if (dC === 2) code = "B";
      else if (dC === 3) code = "R";
      else if ((ar === 0 || ac === 0) && cheb >= 4 && cheb <= 7) {
        code = cheb === 7 ? "O" : "R"; // axis spikes, oxblood tips
      } else if (dd <= 1 && cheb >= 4 && cheb <= 6) {
        code = cheb === 6 ? "O" : "R"; // diagonal petals, oxblood tips
      }
      row.push(code);
    }
    grid.push(row);
  }
  return grid;
}

const DIAMOND_GRID = buildDiamondGrid(13);
const STAR_GRID = buildStarGrid(15);

function MotifSvg({
  grid,
  className,
}: {
  grid: (string | null)[][];
  className?: string;
}) {
  const size = grid.length;
  return (
    <svg
      role="presentation"
      aria-hidden
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className={clsx("block", className)}
    >
      {grid.flatMap((row, r) =>
        row.map((code, c) =>
          code ? (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width={1.02}
              height={1.02}
              fill={CODE[code]}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

/** Large concentric-diamond medallion. */
export function TatreezDiamondPattern({ className }: { className?: string }) {
  return <MotifSvg grid={DIAMOND_GRID} className={className} />;
}

/** Large eight-point flower/star medallion. */
export function TatreezFloralPattern({ className }: { className?: string }) {
  return <MotifSvg grid={STAR_GRID} className={className} />;
}

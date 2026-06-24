"use client";

import { useId, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const DIAMOND_TILE = [
  "RRRRRRRR",
  "..R.....",
  ".RBR..G.",
  "RBOBRGRG",
  ".RBR..G.",
  "..R.....",
  "RRRRRRRR",
];

const CELL_SIZE = 4;
const TILE_WIDTH = 8 * CELL_SIZE;

interface RibbonConfig {
  bgColor: string;
  colors: Record<string, string>;
  driftDirection: "ltr" | "rtl";
}

/**
 * Dulled-pastel palette — softer, more muted versions of the original brand
 * colors. Thread stitches are toned down to keep the tone-on-tone textile feel
 * without competing visually with the section content above or below.
 */
const RIBBON_CONFIGS: RibbonConfig[] = [
  {
    bgColor: "#D9E8F7",
    colors: { R: "#6B869E", B: "#8BA4B8", O: "#7A9088", G: "#EDE9E2" },
    driftDirection: "ltr",
  },
  {
    bgColor: "#D2E3CE",
    colors: { R: "#6E8472", B: "#90A893", O: "#6B8197", G: "#EDE9E2" },
    driftDirection: "rtl",
  },
  {
    bgColor: "#E8D5A4",
    colors: { R: "#A8636A", B: "#8D5558", O: "#C48E6A", G: "#EDE9E2" },
    driftDirection: "ltr",
  },
  {
    bgColor: "#F2CDBF",
    colors: { R: "#CC8C76", B: "#D9A894", O: "#A8636A", G: "#EDE9E2" },
    driftDirection: "rtl",
  },
];

function renderStitches(colorMap: Record<string, string>) {
  const out: React.ReactElement[] = [];
  for (let r = 0; r < DIAMOND_TILE.length; r++) {
    const row = DIAMOND_TILE[r];
    for (let c = 0; c < row.length; c++) {
      const fill = colorMap[row[c]];
      if (fill) {
        out.push(
          <rect
            key={`${r}-${c}`}
            x={c * CELL_SIZE}
            y={r * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={fill}
          />,
        );
      }
    }
  }
  return out;
}

function Ribbon({
  id,
  config,
  index,
  inView,
  reduced,
}: {
  id: string;
  config: RibbonConfig;
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  const drift = !reduced;
  const fromVal = config.driftDirection === "ltr" ? "0 0" : `${TILE_WIDTH} 0`;
  const toVal = config.driftDirection === "ltr" ? `${TILE_WIDTH} 0` : "0 0";

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={
        inView
          ? { scaleY: 1, opacity: 1 }
          : { scaleY: 0, opacity: 0 }
      }
      transition={{
        duration: 0.45,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ originY: 0, flex: "1 1 0%" }}
    >
      <svg
        role="presentation"
        aria-hidden
        width="100%"
        height="28"
        shapeRendering="crispEdges"
        className="block"
      >
        <defs>
          <pattern
            id={id}
            width={TILE_WIDTH}
            height="28"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(0 0)"
          >
            {drift && (
              <animateTransform
                attributeName="patternTransform"
                type="translate"
                from={fromVal}
                to={toVal}
                dur="2.5s"
                repeatCount="indefinite"
              />
            )}
            {renderStitches(config.colors)}
          </pattern>
        </defs>
        <rect width="100%" height="28" fill={config.bgColor} />
        <rect width="100%" height="28" fill={`url(#${id})`} />
      </svg>
    </motion.div>
  );
}

export function AboutToServicesTransition() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-40px" });

  const id0 = useId();
  const id1 = useId();
  const id2 = useId();
  const id3 = useId();
  const ids = [id0, id1, id2, id3];

  return (
    <div
      ref={containerRef}
      data-nav-surface="pattern"
      className="relative h-28 w-full overflow-hidden bg-blayz-cream"
    >
      <div className="absolute inset-0 flex flex-col justify-stretch">
        {RIBBON_CONFIGS.map((config, i) => (
          <Ribbon
            key={ids[i]}
            id={ids[i]}
            config={config}
            index={i}
            inView={inView}
            reduced={reduced}
          />
        ))}
      </div>
    </div>
  );
}

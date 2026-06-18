/**
 * Headless port of blayz-generator/generator/app.js geometry engine.
 * Produces drawable SVG primitives for React + GSAP stroke animations.
 */
import type {
  CornerStyle,
  DrawableShape,
  GeneratorState,
  PetalStyle,
} from "./types";

type CornerFn = (r: number) => string;

const CORNER_PATHS: Record<Exclude<CornerStyle, "none">, CornerFn> = {
  "star-4": (r) =>
    `M 0 ${-r} Q 0 0 ${r} 0 Q 0 0 0 ${r} Q 0 0 ${-r} 0 Q 0 0 0 ${-r} Z`,
  "star-detailed": (r) => {
    const r2 = r / 3;
    return `M 0 ${-r} L ${r2} ${-r2} L ${r} 0 L ${r2} ${r2} L 0 ${r} L ${-r2} ${r2} L ${-r} 0 L ${-r2} ${-r2} Z M 0 ${-r2} L ${r2} 0 L 0 ${r2} L ${-r2} 0 Z`;
  },
  "diamond-open": (r) =>
    `M 0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z M 0 ${-r / 2} L ${-r / 2} 0 L 0 ${r / 2} L ${r / 2} 0 Z`,
  "diamond-solid": (r) =>
    `M 0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z`,
  plus: (r) => {
    const w = r / 3;
    return `M ${-r} ${-w} L ${-w} ${-w} L ${-w} ${-r} L ${w} ${-r} L ${w} ${-w} L ${r} ${-w} L ${r} ${w} L ${w} ${w} L ${w} ${r} L ${-w} ${r} L ${-w} ${w} L ${-r} ${w} Z`;
  },
  box: (r) =>
    `M ${-r / 2} ${-r / 2} H ${r / 2} V ${r / 2} H ${-r / 2} Z M ${-r / 4} ${-r / 4} H ${r / 4} V ${r / 4} H ${-r / 4} Z`,
  "ornate-flower": (r) => {
    const petals = 8;
    let path = `M 0 0 A ${r / 4} ${r / 4} 0 1 0 0.01 0 `;
    for (let i = 0; i < petals; i++) {
      const angle = (i * 2 * Math.PI) / petals;
      const x1 = Math.cos(angle) * r;
      const y1 = Math.sin(angle) * r;
      const x2 = Math.cos(angle + Math.PI / petals) * (r / 2);
      const y2 = Math.sin(angle + Math.PI / petals) * (r / 2);
      path += `M 0 0 Q ${x2} ${y2} ${x1} ${y1} Q ${x2} ${y2} 0 0 `;
    }
    return path;
  },
};

function pushPath(
  out: DrawableShape[],
  d: string,
  opts: Partial<DrawableShape> = {},
): void {
  out.push({ tag: "path", d, ...opts });
}

function pushLine(
  out: DrawableShape[],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opts: Partial<DrawableShape> = {},
): void {
  out.push({ tag: "line", x1, y1, x2, y2, ...opts });
}

function pushCircle(
  out: DrawableShape[],
  cx: number,
  cy: number,
  r: number,
  opts: Partial<DrawableShape> = {},
): void {
  out.push({ tag: "circle", cx, cy, r, ...opts });
}

function ornamentalBorderPaths(
  bx: number,
  by: number,
  bw: number,
  bh: number,
  cOffset: number,
): string[] {
  const spacing = 16;
  const paths: string[] = [];

  const drawSegment = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isVert: boolean,
  ) => {
    let segment = "";
    const len = isVert ? y2 - y1 : x2 - x1;
    const steps = Math.floor(len / spacing);
    const startOffset = (len - steps * spacing) / 2;

    for (let i = 0; i <= steps; i++) {
      const t = startOffset + i * spacing;
      const px = isVert ? x1 : x1 + t;
      const py = isVert ? y1 + t : y1;
      segment += `M ${px - 2} ${py} L ${px} ${py - 2} L ${px + 2} ${py} L ${px} ${py + 2} Z `;
    }
    return segment;
  };

  paths.push(drawSegment(bx + cOffset, by, bx + bw - cOffset, by, false));
  paths.push(
    drawSegment(bx + cOffset, by + bh, bx + bw - cOffset, by + bh, false),
  );
  paths.push(drawSegment(bx, by + cOffset, bx, by + bh - cOffset, true));
  paths.push(
    drawSegment(bx + bw, by + cOffset, bx + bw, by + bh - cOffset, true),
  );
  return paths;
}

function getPetalPath(w: number, h: number, type: PetalStyle): string {
  switch (type) {
    case "floral":
      return `M 0 0 C ${-w / 2} ${-h / 3} ${-w} ${-h * 0.8} 0 ${-h} C ${w} ${-h * 0.8} ${w / 2} ${-h / 3} 0 0 Z`;
    case "arabesque":
      return `M 0 0 C ${-w} ${-h / 4} ${-w} ${-h / 2} ${-w / 3} ${-h * 0.7} C ${-w / 4} ${-h * 0.8} ${-w / 8} ${-h * 0.9} 0 ${-h} C ${w / 8} ${-h * 0.9} ${w / 4} ${-h * 0.8} ${w / 3} ${-h * 0.7} C ${w} ${-h / 2} ${w} ${-h / 4} 0 0 Z`;
    case "scallop":
      return `M 0 0 C ${-w / 2} 0 ${-w} ${-h / 3} ${-w} ${-h / 2} C ${-w} ${-h * 0.8} ${-w / 2} ${-h} 0 ${-h} C ${w / 2} ${-h} ${w} ${-h * 0.8} ${w} ${-h / 2} C ${w} ${-h / 3} ${w / 2} 0 0 0 Z`;
    case "geometric":
      return `M 0 0 L ${-w / 2} ${-h / 2} L 0 ${-h} L ${w / 2} ${-h / 2} Z`;
    case "minimalist":
      return `M 0 0 L 0 ${-h} M 0 ${-h} A 3 3 0 1 0 0.01 ${-h}`;
    default:
      return `M 0 0 L 0 ${-h}`;
  }
}

function drawProceduralMandala(
  state: GeneratorState,
  cx: number,
  cy: number,
  ink: string,
  stroke: number,
  bg: string,
): DrawableShape[] {
  const out: DrawableShape[] = [];
  const scale = state.ornamentScale;
  const symmetry = state.ornamentSymmetry;
  const sector = 360 / symmetry;

  if (state.ornamentGridEnable) {
    for (let i = 0; i < symmetry; i++) {
      const rad = (i * sector * Math.PI) / 180;
      pushLine(
        out,
        cx,
        cy,
        cx + Math.cos(rad) * (scale * 1.3),
        cy + Math.sin(rad) * (scale * 1.3),
        {
          layer: "guides",
          stroke: ink,
          strokeWidth: 1,
          opacity: 0.12,
        },
      );
    }
    pushCircle(out, cx, cy, scale * 0.5, {
      layer: "guides",
      stroke: ink,
      strokeWidth: 1,
      opacity: 0.12,
      fill: "none",
    });
    pushCircle(out, cx, cy, scale, {
      layer: "guides",
      stroke: ink,
      strokeWidth: 1,
      opacity: 0.12,
      fill: "none",
    });
  }

  const drawLayer = (
    styleKey: PetalStyle,
    scalePct: number,
    doubleOutline: boolean,
    rotateOffset: number,
    layerName: string,
  ) => {
    const layerH = scale * (scalePct / 100);
    const layerW = layerH * 0.45;
    const petalPath = getPetalPath(layerW, layerH, styleKey);

    for (let i = 0; i < symmetry; i++) {
      const rot = rotateOffset + i * sector;
      pushPath(out, petalPath, {
        transform: `translate(${cx}, ${cy}) rotate(${rot})`,
        layer: layerName,
        stroke: ink,
        strokeWidth: stroke,
        fill: bg,
      });
      if (doubleOutline) {
        pushPath(out, petalPath, {
          transform: `translate(${cx}, ${cy}) rotate(${rot}) scale(0.82)`,
          layer: layerName,
          stroke: ink,
          strokeWidth: stroke,
          fill: bg,
        });
      }
    }
  };

  if (state.layer3Enable) {
    drawLayer(
      state.layer3Style,
      state.layer3Scale,
      state.layer3Double,
      state.layer3Rotate,
      "l3",
    );
  }
  if (state.layer2Enable) {
    drawLayer(
      state.layer2Style,
      state.layer2Scale,
      state.layer2Double,
      state.layer2Rotate,
      "l2",
    );
  }
  if (state.layer1Enable) {
    drawLayer(
      state.layer1Style,
      state.layer1Scale,
      state.layer1Double,
      state.layer1Rotate,
      "l1",
    );
  }

  pushCircle(out, cx, cy, 7, { layer: "core", fill: bg, stroke: ink, strokeWidth: stroke });
  pushCircle(out, cx, cy, 2.5, {
    layer: "core",
    fill: ink,
    stroke: ink,
    strokeWidth: stroke,
  });

  if (state.particlesEnable) {
    const dist = state.particlesDist;
    const diamondPath = CORNER_PATHS["diamond-solid"](6);

    for (let i = 0; i < 4; i++) {
      const angle = (i * 90 * Math.PI) / 180;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      pushPath(out, diamondPath, {
        transform: `translate(${x}, ${y})`,
        layer: "particles",
        fill: ink,
        stroke: ink,
        strokeWidth: 1,
      });
    }

    for (let i = 0; i < 4; i++) {
      const angle = ((i * 90 + 45) * Math.PI) / 180;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      pushLine(out, x - 4, y, x + 4, y, {
        layer: "particles",
        stroke: ink,
        strokeWidth: 1.2,
      });
      pushLine(out, x, y - 4, x, y + 4, {
        layer: "particles",
        stroke: ink,
        strokeWidth: 1.2,
      });
    }
  }

  return out;
}

/** Generate animatable shapes from generator state (headless app.js logic). */
export function generateShapes(
  state: GeneratorState,
  opts: { includeBackground?: boolean } = {},
): DrawableShape[] {
  const { includeBackground = false } = opts;
  const w = state.canvasWidth;
  const h = state.canvasHeight;
  const ink = state.colorPrimary;
  const bg = state.colorBg;
  const stroke = state.borderStroke;
  const p = state.borderPadding;
  const cx = w / 2;
  const cy = h / 2;
  const out: DrawableShape[] = [];

  if (includeBackground && bg !== "transparent") {
    pushPath(out, `M 0 0 H ${w} V ${h} H 0 Z`, { fill: bg, stroke: "none" });
  }

  if (state.borderEnable) {
    const bx = p;
    const by = p;
    const bw = w - 2 * p;
    const bh = h - 2 * p;
    const cOffset = state.cornerStyle !== "none" ? state.cornerSize / 2 : 0;

    if (state.cornerStyle !== "none" && CORNER_PATHS[state.cornerStyle]) {
      const cornerSize = state.cornerSize;
      const pData = CORNER_PATHS[state.cornerStyle](cornerSize / 2);
      const corners = [
        `translate(${bx}, ${by})`,
        `translate(${bx + bw}, ${by})`,
        `translate(${bx}, ${by + bh})`,
        `translate(${bx + bw}, ${by + bh})`,
      ];
      for (const transform of corners) {
        pushPath(out, pData, {
          transform,
          layer: "border",
          stroke: ink,
          strokeWidth: stroke,
          fill: "none",
        });
      }
    }

    if (state.borderStyle !== "ornamental") {
      pushLine(out, bx + cOffset, by, bx + bw - cOffset, by, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
      pushLine(out, bx + cOffset, by + bh, bx + bw - cOffset, by + bh, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
      pushLine(out, bx, by + cOffset, bx, by + bh - cOffset, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
      pushLine(out, bx + bw, by + cOffset, bx + bw, by + bh - cOffset, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
    } else {
      for (const d of ornamentalBorderPaths(bx, by, bw, bh, cOffset)) {
        pushPath(out, d, {
          layer: "border",
          stroke: ink,
          strokeWidth: stroke,
          fill: "none",
        });
      }
    }

    if (state.doubleSidesEnable) {
      const off = state.doubleOffset;
      pushLine(out, bx - off, by + cOffset, bx - off, by + bh - cOffset, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
      pushLine(out, bx + bw + off, by + cOffset, bx + bw + off, by + bh - cOffset, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
      pushLine(out, bx - off, by + cOffset, bx, by + cOffset, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
      pushLine(out, bx - off, by + bh - cOffset, bx, by + bh - cOffset, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
      pushLine(out, bx + bw, by + cOffset, bx + bw + off, by + cOffset, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
      pushLine(out, bx + bw, by + bh - cOffset, bx + bw + off, by + bh - cOffset, {
        layer: "border",
        stroke: ink,
        strokeWidth: stroke,
      });
    }

    if (state.sideNodesEnable) {
      const nodePath = CORNER_PATHS["star-4"](12);
      const nodes = [
        `translate(${bx + bw / 2}, ${by})`,
        `translate(${bx + bw / 2}, ${by + bh})`,
        `translate(${bx}, ${by + bh / 2})`,
        `translate(${bx + bw}, ${by + bh / 2})`,
      ];
      for (const transform of nodes) {
        pushPath(out, nodePath, {
          transform,
          layer: "border",
          stroke: ink,
          strokeWidth: stroke,
          fill: bg === "transparent" ? "none" : bg,
        });
      }
    }
  }

  if (state.ornamentEnable) {
    out.push(
      ...drawProceduralMandala(state, cx, cy, ink, stroke, bg === "transparent" ? "none" : bg),
    );
  }

  return out;
}

/** Full SVG string export — matches generateSVGCode() from app.js. */
export function generateSVG(
  state: GeneratorState,
  opts: { includeBackground?: boolean } = {},
): string {
  const shapes = generateShapes(state, opts);
  const w = state.canvasWidth;
  const h = state.canvasHeight;

  const body = shapes
    .map((s) => {
      const attrs = [
        s.fill ? `fill="${s.fill}"` : 'fill="none"',
        s.stroke ? `stroke="${s.stroke}"` : "",
        s.strokeWidth != null ? `stroke-width="${s.strokeWidth}"` : "",
        s.opacity != null ? `opacity="${s.opacity}"` : "",
        s.transform ? `transform="${s.transform}"` : "",
      ]
        .filter(Boolean)
        .join(" ");

      if (s.tag === "path") return `<path d="${s.d}" ${attrs} />`;
      if (s.tag === "line") {
        return `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" ${attrs} />`;
      }
      return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" ${attrs} />`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n${body}\n</svg>`;
}

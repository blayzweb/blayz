/**
 * Procedural pattern generators using the Blayz ornament generator mathematics.
 *
 * Every path is designed to be stroked and "drawn" via stroke-dashoffset.
 * We rely on SVG `pathLength={1}` normalisation so a single scrub from
 * strokeDashoffset 1 -> 0 fully draws any path regardless of its real length.
 */

const TAU = Math.PI * 2;

function pt(cx: number, cy: number, r: number, a: number): [number, number] {
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

const f = (n: number) => Number(n.toFixed(2));

export interface PatternPath {
  d: string;
  transform?: string;
  layer?: string;
}

/**
 * Arabesque / Floral / Geometric "bloom" medallion.
 * Concentric layers of rotating petals radiating from the centre — the core brand motif.
 * Returns an ordered list of paths (guides first, outer layers, inner layers, core hub)
 * so drawing them in sequence reads as the bloom expanding outward.
 */
export function bloomMedallion(
  size = 600,
  _rings = 4, // maintained for signature compatibility
): PatternPath[] {
  void _rings;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38; // Max radius for medallion (228px)
  const paths: PatternPath[] = [];

  const tr = (angle: number) => `translate(${cx}, ${cy}) rotate(${angle})`;

  // 1. Grid/Guides (6 cardinal lines and 2 concentric circles)
  // Radial guides (6 spokes)
  for (let i = 0; i < 6; i++) {
    const angle = i * 60;
    const rad = (angle * Math.PI) / 180;
    const x2 = Math.cos(rad) * (maxR * 1.1);
    const y2 = Math.sin(rad) * (maxR * 1.1);
    paths.push({
      d: `M 0 0 L ${f(x2)} ${f(y2)}`,
      transform: tr(0),
      layer: "guides",
    });
  }
  // Concentric circles guides
  paths.push({ d: circlePath(cx, cy, maxR * 0.5), layer: "guides" });
  paths.push({ d: circlePath(cx, cy, maxR * 1.0), layer: "guides" });

  // 2. Petal path generators (drawn centered at 0, 0, pointing up)
  const getPetalPath = (w: number, h: number, type: string) => {
    switch (type) {
      case "floral": // Round curves teardrop
        return `M 0 0 C ${f(-w / 2)} ${f(-h / 3)} ${f(-w)} ${f(-h * 0.8)} 0 ${f(-h)} C ${f(w)} ${f(-h * 0.8)} ${f(w / 2)} ${f(-h / 3)} 0 0 Z`;
      case "arabesque": // Pointed arch shape (single outline for simplicity)
        return `M 0 0 C ${f(-w)} ${f(-h / 4)} ${f(-w)} ${f(-h / 2)} ${f(-w / 3)} ${f(-h * 0.7)} C ${f(-w / 4)} ${f(-h * 0.8)} ${f(-w / 8)} ${f(-h * 0.9)} 0 ${f(-h)} C ${f(w / 8)} ${f(-h * 0.9)} ${f(w / 4)} ${f(-h * 0.8)} ${f(w / 3)} ${f(-h * 0.7)} C ${f(w)} ${f(-h / 2)} ${f(w)} ${f(-h / 4)} 0 0 Z`;
      case "geometric": // Sharp diamond
        return `M 0 0 L ${f(-w / 2)} ${f(-h / 2)} L 0 ${f(-h)} L ${f(w / 2)} ${f(-h / 2)} Z`;
      default:
        return `M 0 0 L 0 ${f(-h)}`;
    }
  };

  // Layer 3 (Outer): geometric petals, symmetry 6, scale 1.0, rotated 30 deg offset
  const l3H = maxR * 1.0;
  const l3W = l3H * 0.45;
  const l3Path = getPetalPath(l3W, l3H, "geometric");
  for (let i = 0; i < 6; i++) {
    paths.push({
      d: l3Path,
      transform: tr(i * 60 + 30),
      layer: "l3",
    });
  }

  // Layer 2 (Middle): arabesque petals, symmetry 6, scale 0.72, rotated 0 deg (single outline for clean geometry)
  const l2H = maxR * 0.72;
  const l2W = l2H * 0.45;
  const l2Path = getPetalPath(l2W, l2H, "arabesque");
  for (let i = 0; i < 6; i++) {
    paths.push({
      d: l2Path,
      transform: tr(i * 60),
      layer: "l2",
    });
  }

  // Layer 1 (Inner): floral petals, symmetry 6, scale 0.45, rotated 0 deg
  const l1H = maxR * 0.45;
  const l1W = l1H * 0.45;
  const l1Path = getPetalPath(l1W, l1H, "floral");
  for (let i = 0; i < 6; i++) {
    paths.push({
      d: l1Path,
      transform: tr(i * 60),
      layer: "l1",
    });
  }

  // 3. Core Hub (circles at center)
  paths.push({
    d: `M -7 0 A 7 7 0 1 0 7 0 A 7 7 0 1 0 -7 0 Z`,
    transform: tr(0),
    layer: "core",
  });
  paths.push({
    d: `M -2.5 0 A 2.5 2.5 0 1 0 2.5 0 A 2.5 2.5 0 1 0 -2.5 0 Z`,
    transform: tr(0),
    layer: "core",
  });

  // 4. Middle Particles (diamonds and plus signs at maxR * 1.22)
  const midDist = maxR * 1.22;
  const diamondPath = `M 0 -6 L 6 0 L 0 6 L -6 0 Z`;
  // 4 cardinal diamonds
  for (let i = 0; i < 4; i++) {
    const angle = i * 90;
    const rad = (angle * Math.PI) / 180;
    const px = Math.cos(rad) * midDist;
    const py = Math.sin(rad) * midDist;
    paths.push({
      d: diamondPath,
      transform: `translate(${f(cx + px)}, ${f(cy + py)})`,
      layer: "particles",
    });
  }
  // 4 diagonal pluses
  for (let i = 0; i < 4; i++) {
    const angle = i * 90 + 45;
    const rad = (angle * Math.PI) / 180;
    const px = Math.cos(rad) * midDist;
    const py = Math.sin(rad) * midDist;
    paths.push({
      d: `M -4 0 L 4 0 M 0 -4 L 0 4`,
      transform: `translate(${f(cx + px)}, ${f(cy + py)})`,
      layer: "particles",
    });
  }

  // 5. Outer scattered ASCII glyphs halo (12 points at maxR * 1.42)
  const outerDist = maxR * 1.42;
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const rad = (angle * Math.PI) / 180;
    const px = Math.cos(rad) * outerDist;
    const py = Math.sin(rad) * outerDist;

    let d = "";
    if (i % 3 === 0) {
      // Small diamond
      d = `M 0 -4 L 4 0 L 0 4 L -4 0 Z`;
    } else if (i % 3 === 1) {
      // Cross 'x'
      d = `M -3 -3 L 3 3 M 3 -3 L -3 3`;
    } else {
      // Brackets
      const isLeft = Math.cos(rad) < 0;
      d = isLeft
        ? `M 2 -3 L -1 -3 L -1 3 L 2 3`  // [
        : `M -2 -3 L 1 -3 L 1 3 L -2 3`; // ]
    }

    paths.push({
      d,
      transform: `translate(${f(cx + px)}, ${f(cy + py)})`,
      layer: "particles",
    });
  }

  return paths;
}

function circlePath(cx: number, cy: number, r: number): string {
  return `M ${f(cx - r)} ${f(cy)} a ${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0 a ${f(
    r,
  )} ${f(r)} 0 1 0 ${f(-r * 2)} 0`;
}

function smoothPath(points: Array<[number, number]>): string {
  if (points.length < 2) return "";

  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const previous = points[i - 1] ?? points[i];
    const current = points[i];
    const next = points[i + 1];
    const afterNext = points[i + 2] ?? next;

    const cp1x = current[0] + (next[0] - previous[0]) / 6;
    const cp1y = current[1] + (next[1] - previous[1]) / 6;
    const cp2x = next[0] - (afterNext[0] - current[0]) / 6;
    const cp2y = next[1] - (afterNext[1] - current[1]) / 6;

    d += ` C ${f(cp1x)} ${f(cp1y)} ${f(cp2x)} ${f(cp2y)} ${f(next[0])} ${f(next[1])}`;
  }
  return d;
}

function arabesquePetalPath(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
  widthFactor: number,
): string {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const nx = -uy;
  const ny = ux;
  const baseDistance = radius * 0.08;

  const bx = cx + ux * baseDistance;
  const by = cy + uy * baseDistance;
  const tx = cx + ux * radius;
  const ty = cy + uy * radius;
  const c1x = cx + ux * radius * 0.2 + nx * radius * widthFactor;
  const c1y = cy + uy * radius * 0.2 + ny * radius * widthFactor;
  const c2x =
    cx + ux * radius * 0.72 + nx * radius * widthFactor * 0.52;
  const c2y =
    cy + uy * radius * 0.72 + ny * radius * widthFactor * 0.52;
  const c3x =
    cx + ux * radius * 0.72 - nx * radius * widthFactor * 0.52;
  const c3y =
    cy + uy * radius * 0.72 - ny * radius * widthFactor * 0.52;
  const c4x = cx + ux * radius * 0.2 - nx * radius * widthFactor;
  const c4y = cy + uy * radius * 0.2 - ny * radius * widthFactor;

  return `M ${f(bx)} ${f(by)} C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(tx)} ${f(ty)} C ${f(c3x)} ${f(c3y)} ${f(c4x)} ${f(c4y)} ${f(bx)} ${f(by)} Z`;
}

function floralPetalPath(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): string {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const nx = -uy;
  const ny = ux;
  const point = (along: number, across: number): [number, number] => [
    cx + ux * radius * along + nx * radius * across,
    cy + uy * radius * along + ny * radius * across,
  ];

  const baseLeft = point(0.08, 0.055);
  const shoulderLeft = point(0.34, 0.36);
  const tipLeft = point(0.8, 0.12);
  const tip = point(1.04, 0);
  const tipRight = point(0.8, -0.12);
  const shoulderRight = point(0.34, -0.36);
  const baseRight = point(0.08, -0.055);

  return `M ${f(baseLeft[0])} ${f(baseLeft[1])} C ${f(shoulderLeft[0])} ${f(shoulderLeft[1])} ${f(tipLeft[0])} ${f(tipLeft[1])} ${f(tipLeft[0])} ${f(tipLeft[1])} Q ${f(tip[0])} ${f(tip[1])} ${f(tipRight[0])} ${f(tipRight[1])} C ${f(tipRight[0])} ${f(tipRight[1])} ${f(shoulderRight[0])} ${f(shoulderRight[1])} ${f(baseRight[0])} ${f(baseRight[1])} Q ${f(cx)} ${f(cy)} ${f(baseLeft[0])} ${f(baseLeft[1])} Z`;
}

function leafPath(
  cx: number,
  cy: number,
  length: number,
  angle: number,
): string {
  return arabesquePetalPath(cx, cy, length, angle, 0.2);
}

/**
 * Bloom "vine" — a vertical climbing stem with petal clusters, sized to the
 * thin Spine rail (PRD §6.5 Hero/About segment). Drawn bottom-up so it reads
 * as the bloom growing.
 */
export function bloomVine(
  width = 80,
  height = 600,
  nodes = 9,
): PatternPath[] {
  const paths: PatternPath[] = [];
  const cx = width / 2;
  const flowerCount = Math.max(3, nodes - 1);
  const step = height / (flowerCount + 1);
  const stemPoints: Array<[number, number]> = [];

  // Build bottom-up so the draw order follows the natural growth direction.
  for (let i = 0; i <= flowerCount + 1; i++) {
    const y = height + 12 - i * ((height + 24) / (flowerCount + 1));
    const x =
      cx +
      Math.sin(i * 1.17 + 0.35) * width * 0.095 +
      Math.cos(i * 0.61) * width * 0.035;
    stemPoints.push([x, y]);
  }
  paths.push({ d: smoothPath(stemPoints), layer: "stem" });

  for (let i = 1; i <= flowerCount; i++) {
    const [x, y] = stemPoints[i];
    const scale = i % 3 === 0 ? 1 : i % 2 === 0 ? 0.86 : 0.94;
    const radius = Math.min(width * 0.36, step * 0.37) * scale;
    const rotation = -Math.PI / 2 + i * 0.17;
    const petals = 5;

    // Side leaves keep the vine feeling botanical between the rosettes.
    const leafSide = i % 2 === 0 ? -1 : 1;
    paths.push({
      d: leafPath(
        x,
        y + step * 0.24,
        radius * 0.72,
        -Math.PI / 2 + leafSide * 1.02,
      ),
      layer: "motif",
    });

    // Broad outer petals remain legible even at the Spine's narrow size.
    for (let petal = 0; petal < petals; petal++) {
      paths.push({
        d: floralPetalPath(
          x,
          y,
          radius,
          rotation + (petal / petals) * TAU,
        ),
        layer: "motif",
      });
    }

    // A small, rotated arabesque corolla supplies cultural detail without
    // competing with the flower silhouette.
    for (let petal = 0; petal < petals; petal++) {
      paths.push({
        d: arabesquePetalPath(
          x,
          y,
          radius * 0.38,
          rotation + Math.PI / petals + (petal / petals) * TAU,
          0.18,
        ),
        layer: "accent",
      });
    }

    paths.push({
      d: circlePath(x, y, Math.max(1.25, radius * 0.1)),
      layer: "accent",
    });
  }

  // A tapered bud resolves the top of the vine more elegantly than a hard stop.
  const [topX, topY] = stemPoints[stemPoints.length - 1];
  paths.push({
    d: arabesquePetalPath(topX, topY + 5, width * 0.13, -Math.PI / 2, 0.25),
    layer: "accent",
  });

  return paths;
}

/**
 * Synthesis vine — bloom vine overlaid with sadu diamonds and terminal ticks,
 * for the closing Contact spine segment (PRD §7.5).
 */
export function synthesisVine(width = 80, height = 600): PatternPath[] {
  const out = bloomVine(width, height, 6);
  const cx = width / 2;
  const ticks = 14;
  const step = height / ticks;
  for (let i = 0; i < ticks; i++) {
    const y = f(i * step + step / 2);
    if (i % 4 === 0) {
      // sadu diamond
      const r = Math.min(width * 0.13, step * 0.32);
      out.push({
        d: `M ${f(cx)} ${f(y - r)} L ${f(cx + r)} ${f(y)} L ${f(cx)} ${f(
          y + r,
        )} L ${f(cx - r)} ${f(y)} Z`,
        layer: "accent",
      });
    } else if (i % 2 === 0) {
      // terminal tick
      out.push({
        d: `M ${f(cx + width * 0.24)} ${y} L ${f(width * (i % 3 === 0 ? 0.88 : 0.72))} ${y}`,
        layer: "accent",
      });
    }
  }
  return out;
}

/**
 * Sadu textile band — woven zigzags + diamonds (PRD §7.4).
 * Vertical band intended for the Pricing spine segment / card dividers.
 */
export function saduBand(
  width = 80,
  height = 600,
  rows = 14,
): PatternPath[] {
  const paths: PatternPath[] = [];
  const motifCount = Math.max(5, Math.floor(rows / 2));
  const step = height / motifCount;
  const cx = width / 2;
  const outerRadius = Math.min(width * 0.3, step * 0.34);
  const innerRadius = outerRadius * 0.48;

  paths.push({
    d: `M ${f(cx)} ${f(height + 8)} L ${f(cx)} -8`,
    layer: "stem",
  });

  for (let i = 0; i < motifCount; i++) {
    const cy = step * (i + 0.5);
    const r = outerRadius * (i % 2 === 0 ? 1 : 0.84);

    paths.push({
      d: `M ${f(cx)} ${f(cy - r)} L ${f(cx + r)} ${f(cy)} L ${f(cx)} ${f(
        cy + r,
      )} L ${f(cx - r)} ${f(cy)} Z`,
      layer: "motif",
    });
    paths.push({
      d: `M ${f(cx)} ${f(cy - innerRadius)} L ${f(cx + innerRadius)} ${f(cy)} L ${f(cx)} ${f(cy + innerRadius)} L ${f(cx - innerRadius)} ${f(cy)} Z`,
      layer: "accent",
    });
    paths.push({
      d: `M ${f(cx - r * 0.72)} ${f(cy - r * 0.72)} L ${f(cx + r * 0.72)} ${f(cy + r * 0.72)} M ${f(cx + r * 0.72)} ${f(cy - r * 0.72)} L ${f(cx - r * 0.72)} ${f(cy + r * 0.72)}`,
      layer: "accent",
    });

    if (i < motifCount - 1) {
      const connectorY = cy + step / 2;
      paths.push({
        d: `M ${f(cx - width * 0.12)} ${f(connectorY)} L ${f(cx)} ${f(connectorY + width * 0.08)} L ${f(cx + width * 0.12)} ${f(connectorY)}`,
        layer: "accent",
      });
    }
  }
  return paths;
}

/**
 * Terminal / ASCII line pattern (PRD §7.3 spine).
 * Stacked horizontal "code lines" of varying length growing from the rail.
 */
export function terminalLines(
  width = 80,
  height = 600,
  lines = 26,
): PatternPath[] {
  const paths: PatternPath[] = [];
  const clusterCount = Math.max(4, Math.floor(lines / 3));
  const step = height / clusterCount;
  const x0 = width * 0.12;

  paths.push({
    d: `M ${f(x0)} -8 L ${f(x0)} ${f(height + 8)}`,
    layer: "stem",
  });

  // deterministic pseudo-random lengths
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  for (let i = 0; i < clusterCount; i++) {
    const centerY = step * (i + 0.5);
    const bracketHeight = Math.min(step * 0.52, 34);
    const lineGap = bracketHeight / 3;

    paths.push({
      d: `M ${f(x0 + 5)} ${f(centerY - bracketHeight / 2)} H ${f(x0)} V ${f(centerY + bracketHeight / 2)} H ${f(x0 + 5)}`,
      layer: "motif",
    });

    for (let row = 0; row < 3; row++) {
      const y = centerY - lineGap + row * lineGap;
      const length = width * (0.28 + rnd() * 0.4);
      paths.push({
        d: `M ${f(x0 + 9)} ${f(y)} H ${f(Math.min(width * 0.94, x0 + 9 + length))}`,
        layer: "motif",
      });
    }

    if (i % 2 === 0) {
      const glyphX = width * 0.84;
      const glyphY = centerY - bracketHeight * 0.46;
      const glyphR = width * 0.055;
      paths.push({
        d: `M ${f(glyphX)} ${f(glyphY - glyphR)} L ${f(glyphX + glyphR)} ${f(glyphY)} L ${f(glyphX)} ${f(glyphY + glyphR)} L ${f(glyphX - glyphR)} ${f(glyphY)} Z`,
        layer: "accent",
      });
    }
  }
  return paths;
}

/**
 * Synthesis bloom — the "collected" reprise (PRD §7.5).
 * A bloom medallion overlaid with sadu diamonds + terminal ticks so the
 * closing segment echoes all prior motifs.
 */
export function synthesisBloom(size = 600): PatternPath[] {
  const cx = size / 2;
  const cy = size / 2;
  const out = bloomMedallion(size, 3);
  // radial terminal ticks
  const spokes = 24;
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * TAU;
    const [x0, y0] = pt(cx, cy, size * 0.3, a);
    const [x1, y1] = pt(cx, cy, size * 0.44, a);
    out.push({ d: `M ${f(x0)} ${f(y0)} L ${f(x1)} ${f(y1)}` });
  }
  // sadu diamonds on a mid ring
  const diamonds = 8;
  for (let i = 0; i < diamonds; i++) {
    const a = (i / diamonds) * TAU;
    const [dx, dy] = pt(cx, cy, size * 0.24, a);
    const r = size * 0.03;
    out.push({
      d: `M ${f(dx)} ${f(dy - r)} L ${f(dx + r)} ${f(dy)} L ${f(dx)} ${f(
        dy + r,
      )} L ${f(dx - r)} ${f(dy)} Z`,
    });
  }
  return out;
}

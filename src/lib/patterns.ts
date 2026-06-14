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

interface PatternPath {
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
  const step = height / nodes;
  const amp = width * 0.22;

  // sinuous stem
  let stem = `M ${f(cx)} ${f(height)} `;
  for (let i = nodes; i >= 0; i--) {
    const y = i * step;
    const x = cx + Math.sin(i * 0.9) * amp;
    stem += `L ${f(x)} ${f(y)} `;
  }
  paths.push({ d: stem });

  // petal clusters at each node (closed teardrop curves matching floral style)
  for (let i = 1; i < nodes; i++) {
    const y = i * step;
    const x = cx + Math.sin(i * 0.9) * amp;
    const petals = 5;
    const r = step * 0.42;
    let d = "";
    for (let p = 0; p < petals; p++) {
      const a = (p / petals) * TAU - Math.PI / 2;
      const [tx, ty] = pt(x, y, r, a);
      const [mx1, my1] = pt(x, y, r * 0.55, a + 0.35);
      const [mx2, my2] = pt(x, y, r * 0.55, a - 0.35);
      d += `M ${f(x)} ${f(y)} Q ${f(mx1)} ${f(my1)} ${f(tx)} ${f(ty)} Q ${f(mx2)} ${f(my2)} ${f(x)} ${f(y)} `;
    }
    paths.push({ d });
  }
  return paths;
}

/**
 * Synthesis vine — bloom vine overlaid with sadu diamonds and terminal ticks,
 * for the closing Contact spine segment (PRD §7.5).
 */
export function synthesisVine(width = 80, height = 600): PatternPath[] {
  const out = bloomVine(width, height, 7);
  const cx = width / 2;
  const ticks = 18;
  const step = height / ticks;
  for (let i = 0; i < ticks; i++) {
    const y = f(i * step + step / 2);
    if (i % 3 === 0) {
      // sadu diamond
      const r = step * 0.4;
      out.push({
        d: `M ${f(cx)} ${f(y - r)} L ${f(cx + r)} ${f(y)} L ${f(cx)} ${f(
          y + r,
        )} L ${f(cx - r)} ${f(y)} Z`,
      });
    } else {
      // terminal tick
      out.push({ d: `M ${f(cx + width * 0.18)} ${y} L ${f(width * 0.92)} ${y}` });
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
  const step = height / rows;
  const m = width * 0.18;

  // Zigzag chains.
  let zig = "";
  for (let i = 0; i <= rows; i++) {
    const y = i * step;
    const x = i % 2 === 0 ? m : width - m;
    zig += `${i === 0 ? "M" : "L"} ${f(x)} ${f(y)} `;
  }
  paths.push({ d: zig });

  let zag = "";
  for (let i = 0; i <= rows; i++) {
    const y = i * step;
    const x = i % 2 === 0 ? width - m : m;
    zag += `${i === 0 ? "M" : "L"} ${f(x)} ${f(y)} `;
  }
  paths.push({ d: zag });

  // Diamonds at every other crossing.
  for (let i = 1; i < rows; i += 2) {
    const cy = i * step;
    const cx = width / 2;
    const r = step * 0.5;
    paths.push({
      d: `M ${f(cx)} ${f(cy - r)} L ${f(cx + r)} ${f(cy)} L ${f(cx)} ${f(
        cy + r,
      )} L ${f(cx - r)} ${f(cy)} Z`,
    });
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
  const step = height / lines;
  // deterministic pseudo-random lengths
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < lines; i++) {
    const y = f(i * step + step / 2);
    const len = width * (0.25 + rnd() * 0.7);
    const x0 = width * 0.1;
    paths.push({ d: `M ${f(x0)} ${y} L ${f(x0 + len)} ${y}` });
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

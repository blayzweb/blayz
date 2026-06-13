/**
 * Procedural pattern generators.
 *
 * These are PLACEHOLDERS for Anas's SVG generator output (PRD §8, asset #7–10).
 * Every path is designed to be stroked and "drawn" via stroke-dashoffset.
 * We rely on SVG `pathLength={1}` normalisation so a single scrub from
 * strokeDashoffset 1 -> 0 fully draws any path regardless of its real length.
 */

const TAU = Math.PI * 2;

function pt(cx: number, cy: number, r: number, a: number): [number, number] {
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

const f = (n: number) => Number(n.toFixed(2));

/**
 * Arabesque / Tatreez "bloom" medallion.
 * Concentric rings of petals radiating from the centre — the core brand motif.
 * Returns an ordered list of path `d` strings (inner rings first) so drawing
 * them in sequence reads as the bloom expanding outward.
 */
export function bloomMedallion(
  size = 600,
  rings = 4,
): { d: string }[] {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.46;
  const paths: { d: string }[] = [];

  for (let ring = 1; ring <= rings; ring++) {
    const rOuter = (maxR * ring) / rings;
    const rInner = (maxR * (ring - 0.55)) / rings;
    const petals = 6 + ring * 6;

    // The ring circle itself.
    paths.push({ d: circlePath(cx, cy, rInner) });

    let d = "";
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * TAU;
      const aNext = ((i + 0.5) / petals) * TAU;
      const [bx, by] = pt(cx, cy, rInner, a);
      const [tx, ty] = pt(cx, cy, rOuter, a);
      const [mx, my] = pt(cx, cy, (rInner + rOuter) / 2, aNext);
      // teardrop petal: base -> tip via one control, back via the gap control
      d += `M ${f(bx)} ${f(by)} Q ${f(mx)} ${f(my)} ${f(tx)} ${f(ty)} `;
      const [mx2, my2] = pt(cx, cy, (rInner + rOuter) / 2, a - aNext + a);
      d += `Q ${f(mx2)} ${f(my2)} ${f(bx)} ${f(by)} `;
    }
    paths.push({ d });
  }

  // Central star.
  paths.unshift({ d: starPath(cx, cy, maxR / rings / 1.6, 8) });
  return paths;
}

function circlePath(cx: number, cy: number, r: number): string {
  return `M ${f(cx - r)} ${f(cy)} a ${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0 a ${f(
    r,
  )} ${f(r)} 0 1 0 ${f(-r * 2)} 0`;
}

function starPath(cx: number, cy: number, r: number, points: number): string {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = (i / (points * 2)) * TAU - Math.PI / 2;
    const [x, y] = pt(cx, cy, rr, a);
    d += `${i === 0 ? "M" : "L"} ${f(x)} ${f(y)} `;
  }
  return d + "Z";
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
): { d: string }[] {
  const paths: { d: string }[] = [];
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

  // petal clusters at each node
  for (let i = 1; i < nodes; i++) {
    const y = i * step;
    const x = cx + Math.sin(i * 0.9) * amp;
    const petals = 5;
    const r = step * 0.42;
    let d = "";
    for (let p = 0; p < petals; p++) {
      const a = (p / petals) * TAU - Math.PI / 2;
      const [tx, ty] = pt(x, y, r, a);
      const [mx, my] = pt(x, y, r * 0.5, a + 0.4);
      d += `M ${f(x)} ${f(y)} Q ${f(mx)} ${f(my)} ${f(tx)} ${f(ty)} `;
    }
    paths.push({ d });
  }
  return paths;
}

/**
 * Synthesis vine — bloom vine overlaid with sadu diamonds and terminal ticks,
 * for the closing Contact spine segment (PRD §7.5).
 */
export function synthesisVine(width = 80, height = 600): { d: string }[] {
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
): { d: string }[] {
  const paths: { d: string }[] = [];
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
): { d: string }[] {
  const paths: { d: string }[] = [];
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
export function synthesisBloom(size = 600): { d: string }[] {
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

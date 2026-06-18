import type { PatternPath } from "@/lib/patterns";
import type { SectionId } from "@/lib/sections";

export const SPINE_WIDTH = 72;
export const SPINE_VIEW_HEIGHT = 520;

const OUTER_PETAL =
  "M 0 -2 C -4.6 -7.5 -4.8 -14.5 0 -19 C 4.8 -14.5 4.6 -7.5 0 -2 Z";
const INNER_PETAL =
  "M 0 -1 C -2.4 -4 -2.5 -7.5 0 -10 C 2.5 -7.5 2.4 -4 0 -1 Z";
const LEAF =
  "M 0 0 C 3 -4 8 -5 12 -2 C 8 3 3 4 0 0 Z";

function circle(cx: number, cy: number, radius: number): string {
  return `M ${cx - radius} ${cy} a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
}

function diamond(cx: number, cy: number, rx: number, ry = rx): string {
  return `M ${cx} ${cy - ry} L ${cx + rx} ${cy} L ${cx} ${cy + ry} L ${cx - rx} ${cy} Z`;
}

function rosette(
  cx: number,
  cy: number,
  scale: number,
  rotation = 0,
): PatternPath[] {
  const paths: PatternPath[] = [];

  for (let index = 0; index < 8; index++) {
    paths.push({
      d: OUTER_PETAL,
      transform: `translate(${cx} ${cy}) rotate(${rotation + index * 45}) scale(${scale})`,
      layer: "motif",
    });
  }

  for (let index = 0; index < 4; index++) {
    paths.push({
      d: INNER_PETAL,
      transform: `translate(${cx} ${cy}) rotate(${rotation + 22.5 + index * 90}) scale(${scale})`,
      layer: "accent",
    });
  }

  paths.push({
    d: circle(cx, cy, 2.25 * scale),
    layer: "accent",
  });

  return paths;
}

function leaf(
  x: number,
  y: number,
  rotation: number,
  scale: number,
): PatternPath {
  return {
    d: LEAF,
    transform: `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`,
    layer: "accent",
  };
}

function floralSpine(expanded: boolean): PatternPath[] {
  const paths: PatternPath[] = [
    {
      d: expanded
        ? "M 31 532 C 29 475 39 445 31 398 C 24 354 38 320 32 278 C 25 233 41 201 34 158 C 29 122 35 82 33 -12"
        : "M 31 532 C 28 474 38 442 31 390 C 25 340 40 309 33 258 C 28 215 40 179 34 135 C 30 99 35 63 34 -12",
      layer: "stem",
    },
    {
      d: expanded
        ? "M 31 398 C 35 381 42 369 49 360 M 32 278 C 27 262 20 251 13 244 M 34 158 C 38 143 45 132 51 125"
        : "M 31 390 C 35 374 42 362 48 354 M 33 258 C 28 243 21 232 14 225",
      layer: "accent",
    },
  ];

  const flowers = expanded
    ? [
        [31, 438, 0.84, 7],
        [49, 360, 0.68, -8],
        [27, 294, 0.9, 4],
        [14, 218, 0.7, -5],
        [39, 142, 0.82, 8],
        [32, 68, 0.64, 0],
      ]
    : [
        [31, 430, 0.82, 6],
        [48, 354, 0.68, -8],
        [29, 276, 0.88, 4],
        [14, 205, 0.68, -5],
        [37, 126, 0.8, 8],
      ];

  for (const [cx, cy, scale, rotation] of flowers) {
    paths.push(...rosette(cx, cy, scale, rotation));
  }

  paths.push(
    leaf(31, 401, 148, 0.72),
    leaf(31, 330, -37, 0.66),
    leaf(32, 252, 146, 0.62),
    leaf(34, 177, -38, 0.68),
    {
      d: "M 34 42 C 29 32 30 20 34 12 C 40 21 40 33 34 42 Z",
      layer: "accent",
    },
  );

  return paths;
}

function terminalSpine(): PatternPath[] {
  const paths: PatternPath[] = [
    { d: "M 17 -12 V 532", layer: "stem" },
    { d: "M 17 62 H 28 M 17 174 H 28 M 17 286 H 28 M 17 398 H 28", layer: "accent" },
  ];

  const groups = [
    { y: 58, lengths: [26, 34, 20] },
    { y: 170, lengths: [31, 22, 37] },
    { y: 282, lengths: [23, 38, 29] },
    { y: 394, lengths: [35, 25, 32] },
  ];

  for (const [index, group] of groups.entries()) {
    paths.push({
      d: `M 31 ${group.y - 19} H 27 V ${group.y + 19} H 31`,
      layer: "motif",
    });

    group.lengths.forEach((length, row) => {
      const y = group.y - 12 + row * 12;
      paths.push({
        d: `M 35 ${y} H ${35 + length}`,
        layer: row === 1 ? "motif" : "accent",
      });
    });

    paths.push({
      d: index % 2 === 0
        ? diamond(63, group.y - 19, 2.5)
        : `M 58 ${group.y - 21} H 65 V ${group.y - 14}`,
      layer: "accent",
    });
  }

  return paths;
}

function textileSpine(): PatternPath[] {
  const paths: PatternPath[] = [
    { d: "M 35 -12 V 532", layer: "stem" },
    { d: "M 23 -12 V 532 M 47 -12 V 532", layer: "accent" },
  ];

  const centers = [58, 158, 258, 358, 458];
  for (const [index, cy] of centers.entries()) {
    const size = index % 2 === 0 ? 15 : 12;
    paths.push(
      { d: diamond(35, cy, size, size + 5), layer: "motif" },
      { d: diamond(35, cy, size * 0.48, (size + 5) * 0.48), layer: "accent" },
      {
        d: `M ${35 - size * 0.7} ${cy - (size + 5) * 0.7} L ${35 + size * 0.7} ${cy + (size + 5) * 0.7} M ${35 + size * 0.7} ${cy - (size + 5) * 0.7} L ${35 - size * 0.7} ${cy + (size + 5) * 0.7}`,
        layer: "accent",
      },
    );

    if (index < centers.length - 1) {
      const connectorY = cy + 50;
      paths.push({
        d: `M 23 ${connectorY - 8} L 35 ${connectorY} L 47 ${connectorY - 8} M 23 ${connectorY + 8} L 35 ${connectorY} L 47 ${connectorY + 8}`,
        layer: "accent",
      });
    }
  }

  return paths;
}

function synthesisSpine(): PatternPath[] {
  return [
    { d: "M 31 532 C 30 470 37 427 32 371 C 28 318 38 275 33 222 C 29 172 36 119 34 -12", layer: "stem" },
    { d: diamond(31, 430, 10, 14), layer: "motif" },
    { d: diamond(31, 430, 4.5, 6.5), layer: "accent" },
    { d: circle(33, 304, 5), layer: "motif" },
    { d: "M 28 304 H 38 M 33 299 V 309", layer: "accent" },
    { d: "M 32 228 H 61 M 47 222 V 234", layer: "accent" },
    { d: "M 34 132 H 60 M 34 142 H 51 M 34 152 H 56", layer: "motif" },
    { d: "M 29 122 H 25 V 162 H 29", layer: "accent" },
    { d: "M 34 42 C 29 32 30 20 34 12 C 40 21 40 33 34 42 Z", layer: "accent" },
  ];
}

/** Curated Spine artwork. Each section shares one axis and line language. */
export function spinePathsFor(section: SectionId): PatternPath[] {
  switch (section) {
    case "hero":
      return floralSpine(false);
    case "about":
      return floralSpine(true);
    case "services":
      return terminalSpine();
    case "pricing":
      return textileSpine();
    case "contact":
      return synthesisSpine();
  }
}

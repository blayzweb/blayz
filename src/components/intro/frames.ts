/**
 * Stage A intro frames (PRD §6.1 table).
 *
 * Each `background` is a PROCEDURAL PLACEHOLDER standing in for a hand-produced
 * texture (PRD §8). To use real assets, replace `background` with
 * `url('/intro/01-tatreez.png')` etc. and keep the same frame order.
 */
export interface IntroFrame {
  id: string;
  theme: string;
  background: string;
  size?: string;
}

export const INTRO_FRAMES: IntroFrame[] = [
  {
    id: "white",
    theme: "start",
    background: "#ffffff",
  },
  {
    id: "tatreez",
    theme: "craft",
    background:
      "repeating-linear-gradient(45deg, #ff3800 0 4px, transparent 4px 8px), repeating-linear-gradient(-45deg, #ffb69a 0 4px, transparent 4px 8px), #fff2e2",
    size: "16px 16px",
  },
  {
    id: "sketch",
    theme: "analog",
    background:
      "repeating-linear-gradient(20deg, #1a1a1a 0 1px, transparent 1px 6px), #fffaf2",
    size: "10px 10px",
  },
  {
    id: "collage",
    theme: "print",
    background:
      "conic-gradient(#ff3800 0 25%, #dce8f6 0 50%, #e2c07a 0 75%, #ffb69a 0)",
    size: "60px 60px",
  },
  {
    id: "halftone",
    theme: "digital",
    background:
      "radial-gradient(circle, #1a1a1a 30%, transparent 32%), #fff2e2",
    size: "12px 12px",
  },
  {
    id: "ascii",
    theme: "code",
    background:
      "repeating-linear-gradient(0deg, #0d2818 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, #18b46e 0 1px, transparent 1px 7px), #07140d",
    size: "8px 8px",
  },
  {
    id: "arabesque",
    theme: "culture",
    background:
      "radial-gradient(circle at center, transparent 28%, #ff3800 29% 32%, transparent 33% 60%, #ffb69a 61% 63%, transparent 64%), #fff2e2",
    size: "44px 44px",
  },
  {
    id: "brand",
    theme: "brand",
    background: "#ff3800",
  },
];

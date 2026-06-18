/** Generator state — mirrors blayz-generator/generator/app.js */
export interface GeneratorState {
  canvasWidth: number;
  canvasHeight: number;
  colorBg: string;
  colorPrimary: string;

  borderEnable: boolean;
  borderStroke: number;
  borderPadding: number;
  cornerStyle: CornerStyle;
  cornerSize: number;
  borderStyle: "solid" | "dashed" | "dotted" | "ornamental";
  borderDasharray: string;

  doubleSidesEnable: boolean;
  doubleOffset: number;
  doubleDasharray: string;

  sideNodesEnable: boolean;

  ornamentEnable: boolean;
  ornamentSymmetry: number;
  ornamentScale: number;
  ornamentGridEnable: boolean;

  layer1Enable: boolean;
  layer1Style: PetalStyle;
  layer1Scale: number;
  layer1Double: boolean;
  layer1Rotate: number;

  layer2Enable: boolean;
  layer2Style: PetalStyle;
  layer2Scale: number;
  layer2Double: boolean;
  layer2Rotate: number;

  layer3Enable: boolean;
  layer3Style: PetalStyle;
  layer3Scale: number;
  layer3Double: boolean;
  layer3Rotate: number;

  particlesEnable: boolean;
  particlesDist: number;

  brandingType: "none" | "logo" | "text" | "both";
}

export type CornerStyle =
  | "none"
  | "star-4"
  | "star-detailed"
  | "diamond-open"
  | "diamond-solid"
  | "plus"
  | "box"
  | "ornate-flower";

export type PetalStyle =
  | "floral"
  | "arabesque"
  | "scallop"
  | "geometric"
  | "minimalist";

export type DrawableTag = "path" | "line" | "circle";

/** Animatable SVG primitive from the generator engine. */
export interface DrawableShape {
  tag: DrawableTag;
  d?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  transform?: string;
  layer?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export type GeneratorPresetName =
  | "terminal-frame"
  | "component-box"
  | "medallion"
  | "divider";

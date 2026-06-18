import type { GeneratorPresetName, GeneratorState } from "./types";

export const DEFAULT_STATE: GeneratorState = {
  canvasWidth: 800,
  canvasHeight: 350,
  colorBg: "transparent",
  colorPrimary: "#FF3800",

  borderEnable: true,
  borderStroke: 1.5,
  borderPadding: 20,
  cornerStyle: "star-4",
  cornerSize: 24,
  borderStyle: "dashed",
  borderDasharray: "8, 6",

  doubleSidesEnable: true,
  doubleOffset: 12,
  doubleDasharray: "3, 3",

  sideNodesEnable: true,

  ornamentEnable: false,
  ornamentSymmetry: 4,
  ornamentScale: 100,
  ornamentGridEnable: true,

  layer1Enable: true,
  layer1Style: "floral",
  layer1Scale: 40,
  layer1Double: false,
  layer1Rotate: 0,

  layer2Enable: true,
  layer2Style: "arabesque",
  layer2Scale: 80,
  layer2Double: true,
  layer2Rotate: 0,

  layer3Enable: false,
  layer3Style: "geometric",
  layer3Scale: 110,
  layer3Double: false,
  layer3Rotate: 45,

  particlesEnable: true,
  particlesDist: 140,

  brandingType: "none",
};

/** Presets from blayz-generator/generator/app.js */
export const PRESETS: Record<GeneratorPresetName, Partial<GeneratorState>> = {
  "terminal-frame": {
    borderEnable: true,
    borderStroke: 1.5,
    borderPadding: 20,
    cornerStyle: "star-4",
    cornerSize: 24,
    borderStyle: "dashed",
    borderDasharray: "8, 6",
    doubleSidesEnable: true,
    doubleOffset: 12,
    doubleDasharray: "3, 3",
    sideNodesEnable: true,
    ornamentEnable: false,
    brandingType: "none",
  },
  "component-box": {
    borderEnable: true,
    borderStroke: 1.5,
    borderPadding: 16,
    cornerStyle: "box",
    cornerSize: 16,
    borderStyle: "dashed",
    borderDasharray: "4, 6",
    doubleSidesEnable: false,
    sideNodesEnable: true,
    ornamentEnable: true,
    ornamentSymmetry: 4,
    ornamentScale: 60,
    layer1Enable: true,
    layer1Style: "minimalist",
    layer1Scale: 60,
    layer1Double: false,
    layer1Rotate: 0,
    layer2Enable: false,
    layer3Enable: false,
    particlesEnable: false,
    brandingType: "none",
  },
  medallion: {
    borderEnable: true,
    borderStroke: 1,
    borderPadding: 30,
    cornerStyle: "diamond-open",
    cornerSize: 20,
    borderStyle: "solid",
    doubleSidesEnable: false,
    sideNodesEnable: true,
    ornamentEnable: true,
    ornamentSymmetry: 4,
    ornamentScale: 120,
    layer1Enable: true,
    layer1Style: "floral",
    layer1Scale: 40,
    layer1Double: false,
    layer1Rotate: 0,
    layer2Enable: true,
    layer2Style: "arabesque",
    layer2Scale: 80,
    layer2Double: true,
    layer2Rotate: 0,
    layer3Enable: true,
    layer3Style: "geometric",
    layer3Scale: 110,
    layer3Double: false,
    layer3Rotate: 45,
    particlesEnable: true,
    particlesDist: 140,
    brandingType: "none",
  },
  divider: {
    borderEnable: true,
    borderStroke: 1.5,
    borderPadding: 0,
    cornerStyle: "star-detailed",
    cornerSize: 24,
    borderStyle: "solid",
    doubleSidesEnable: false,
    sideNodesEnable: true,
    ornamentEnable: false,
    brandingType: "none",
  },
};

export function createGeneratorState(
  preset: GeneratorPresetName | Partial<GeneratorState>,
  overrides: Partial<GeneratorState> = {},
): GeneratorState {
  const base =
    typeof preset === "string"
      ? { ...DEFAULT_STATE, ...PRESETS[preset] }
      : { ...DEFAULT_STATE, ...preset };
  return { ...base, ...overrides };
}

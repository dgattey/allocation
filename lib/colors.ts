/**
 * Muted, sophisticated color palette for treemap visualization.
 * Desaturated hues that feel refined — not vivid/garish Tailwind defaults.
 */

const PALETTE = [
  "#5B7BA8",
  "#8B74AB",
  "#4E9999",
  "#C49A5C",
  "#5E9E74",
  "#B86B6B",
  "#7A8FB8",
  "#9C7EA0",
  "#6A9B8F",
  "#C08B56",
  "#7BAA6C",
  "#A87B8E",
  "#5E8EA8",
  "#B07878",
  "#A89B5C",
  "#6BA088",
  "#9878A8",
  "#5A95A0",
  "#8A7CA0",
  "#A88070",
  "#6A9878",
  "#7088A8",
  "#A89060",
  "#8E6E8A",
];

export const DEFAULT_TREEMAP_COLOR = "#64748b";

export function assignColors(
  symbols: string[],
  offset = 0
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [index, symbol] of symbols.entries()) {
    result[symbol] = PALETTE[(index + offset) % PALETTE.length];
  }

  return result;
}

/**
 * Generate child colors by blending the parent base toward white/light.
 * Produces softer, layered variants.
 */
export function getChildColor(parentColor: string, index: number): string {
  const opacities = [0.88, 0.75, 0.65, 0.55, 0.48, 0.42, 0.38, 0.34];
  const opacity = opacities[index % opacities.length];
  return hexWithOpacity(parentColor, opacity);
}

function hexWithOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const blend = (c: number) => Math.round(c * opacity + 255 * (1 - opacity));
  return `#${blend(r).toString(16).padStart(2, "0")}${blend(g).toString(16).padStart(2, "0")}${blend(b).toString(16).padStart(2, "0")}`;
}

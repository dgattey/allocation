/**
 * Muted, sophisticated color palette for treemap visualization.
 * Desaturated hues that feel refined — not vivid/garish Tailwind defaults.
 */

import { hashString } from "./utils";

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

export function getColorForSymbol(symbol: string): string {
  const normalized = symbol.trim().toUpperCase();
  if (!normalized) {
    return DEFAULT_TREEMAP_COLOR;
  }

  return PALETTE[hashString(normalized, PALETTE.length)] ?? DEFAULT_TREEMAP_COLOR;
}

/**
 * Deterministic symbol → color mapping for the entire app.
 *
 * The palette is spread evenly across the hue wheel so that hash
 * collisions still produce visually distinct neighbours. Every
 * component (treemap tiles, table avatars, fund chips) must call
 * `getColorForSymbol` — never maintain a separate color list.
 */

import { hashString } from "./utils";

const PALETTE = [
  // ---- reds / warm ----
  "#B85C5C", // brick red
  "#C47858", // terra cotta
  "#BE6E4A", // rust
  // ---- oranges / golds ----
  "#C49A5C", // gold
  "#B8864A", // copper
  "#D4976A", // peach
  // ---- yellows / olives ----
  "#A89B5C", // olive gold
  "#9B8B4E", // khaki
  // ---- greens (only two) ----
  "#6A9B6A", // sage
  "#5A8E6E", // jade
  // ---- teals / cyans ----
  "#4E9999", // teal
  "#4A8E9E", // dark teal
  // ---- blues ----
  "#5B7BA8", // steel blue
  "#4A7AAE", // cobalt
  "#5E8EA8", // ocean
  "#6478A8", // slate blue
  // ---- indigos / purples ----
  "#7B68AE", // iris
  "#8B74AB", // violet
  "#9058A0", // grape
  "#7A5AAE", // deep violet
  // ---- pinks / magentas ----
  "#A44E80", // berry
  "#B86B8B", // fuchsia
  "#A87B8E", // dusty pink
  "#AE5A8E", // magenta
  // ---- roses / mauves ----
  "#B07878", // rose
  "#A8607A", // plum
  "#C46E7A", // coral
  "#8E6E8A", // mauve
];

export const DEFAULT_TREEMAP_COLOR = "#64748b";

export function getColorForSymbol(symbol: string): string {
  const normalized = symbol.trim().toUpperCase();
  if (!normalized) {
    return DEFAULT_TREEMAP_COLOR;
  }

  return PALETTE[hashString(normalized, PALETTE.length)] ?? DEFAULT_TREEMAP_COLOR;
}

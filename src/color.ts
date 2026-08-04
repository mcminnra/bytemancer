// Color helpers

export const HEX_RE = /^#([0-9a-fA-F]{6})$/;

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * Split a `#RRGGBB` string into its 8-bit red/green/blue channels.
 * @throws if `hex` is not a 6-digit, `#`-prefixed hex color.
 */
export function parseHex(hex: string): Rgb {
  const m = HEX_RE.exec(hex);
  if (!m) throw new Error(`invalid hex color: ${hex}`);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

/**
 * Append an 8-bit alpha channel to a `#RRGGBB` color, producing `#RRGGBBAA`.
 * The base color's case is preserved.
 * @param a Opacity fraction in [0, 1], rounded to the nearest byte.
 * @throws if `hex` already carries an alpha channel, or `a` is out of range.
 */
export function alpha(hex: string, a: number): string {
  if (!HEX_RE.test(hex)) throw new Error(`invalid hex color: ${hex}`);
  if (Number.isNaN(a) || a < 0 || a > 1) throw new Error(`alpha out of range: ${a}`);
  const byte = Math.round(a * 255);
  return hex + byte.toString(16).padStart(2, "0");
}

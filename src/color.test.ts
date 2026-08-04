import { describe, it, expect } from "vitest";
import { alpha, parseHex } from "./color";

describe("alpha", () => {
  // The three named opacity levels, checked against the hexes they replace.
  it("subtle (0.2) -> 33", () => expect(alpha("#2b2d45", 0.2)).toBe("#2b2d4533"));
  it("muted (0.4) -> 66", () => expect(alpha("#191919", 0.4)).toBe("#19191966"));
  it("strong (0.6) -> 99", () => expect(alpha("#2b2d45", 0.6)).toBe("#2b2d4599"));

  it("clamps of the range: 0 -> 00, 1 -> ff", () => {
    expect(alpha("#000000", 0)).toBe("#00000000");
    expect(alpha("#ffffff", 1)).toBe("#ffffffff");
  });

  it("rounds to nearest byte", () => {
    // 0.5 * 255 = 127.5 -> 128 -> 0x80
    expect(alpha("#123456", 0.5)).toBe("#12345680");
  });

  it("preserves the base color's case", () => {
    expect(alpha("#A485DD", 0.2)).toBe("#A485DD33");
  });

  it("rejects a hex without a leading #", () => {
    expect(() => alpha("A485DD", 0.2)).toThrow(/invalid hex/);
  });

  it("rejects a hex that already carries an alpha channel", () => {
    expect(() => alpha("#A485DD33", 0.2)).toThrow(/invalid hex/);
  });

  it("rejects an out-of-range alpha", () => {
    expect(() => alpha("#000000", 2)).toThrow(/out of range/);
    expect(() => alpha("#000000", -0.1)).toThrow(/out of range/);
    expect(() => alpha("#000000", NaN)).toThrow(/out of range/);
  });
});

describe("parseHex", () => {
  it("splits channels", () => {
    expect(parseHex("#A485DD")).toEqual({ r: 0xa4, g: 0x85, b: 0xdd });
  });

  it("rejects malformed input", () => {
    expect(() => parseHex("#zzz")).toThrow(/invalid hex/);
    expect(() => parseHex("#fff")).toThrow(/invalid hex/);
  });
});

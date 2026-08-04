// Zod schemas for the untrusted TOML boundary. smol-toml's parse() returns an
// untyped table; these validate the shape so a malformed file fails with a precise
// error rather than an `undefined` crash downstream.

import { z } from "zod";
import { HEX_RE } from "./color";

// Palette values must be #RRGGBB; a malformed hex fails here rather than shipping
// verbatim into every generated theme. (Role color/bg are palette *names*, not hex,
// and are validated by existence in resolveRoles.)
export const PaletteSchema = z.record(z.string(), z.string().regex(HEX_RE, "expected a #RRGGBB hex color"));

const OpacitySchema = z.object({
  subtle: z.number(),
  muted: z.number(),
  strong: z.number(),
});

// strictObject rejects unknown keys, catching a misspelled style flag (e.g. `itali`).
const RawRoleSchema = z.strictObject({
  color: z.string(),
  bg: z.string().optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
});

export const RolesFileSchema = z.object({
  opacity: OpacitySchema,
  roles: z.record(z.string(), RawRoleSchema),
});

// Entry point: read the palette + role map, resolve roles to hex, and render
// every surface template into ports/. Outputs are committed; CI fails on a dirty tree.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "smol-toml";
import type {
  BuildContext,
  Opacity,
  Palette,
  RawRoles,
  Roles,
  Template,
} from "./types";
import { vscode } from "../templates/vscode";
import { emacs } from "../templates/emacs";
import { ghostty } from "../templates/ghostty";
import { PaletteSchema, RolesFileSchema } from "./schema";

const root = resolve(fileURLToPath(import.meta.url), "../..");

/**
 * Read and validate the theme definition (palette + role map) from disk.
 * @returns the palette, the raw palette-name role map, and the opacity ladder.
 * @throws {ZodError} if either TOML file does not match its schema.
 */
function readTheme(): { palette: Palette; rawRoles: RawRoles; opacity: Opacity } {
  const palette = PaletteSchema.parse(
    parse(readFileSync(join(root, "theme/flavors/dark.toml"), "utf8")),
  );
  const { roles, opacity } = RolesFileSchema.parse(
    parse(readFileSync(join(root, "theme/roles.toml"), "utf8")),
  );
  return { palette, rawRoles: roles, opacity };
}

/**
 * Resolve each role's palette-name references (`color`, `bg`) to concrete hex
 * values, carrying style flags through unchanged.
 * @throws if a role names a color or bg that is not defined in the palette.
 */
function resolveRoles(rawRoles: RawRoles, palette: Palette): Roles {
  const out: Roles = {};
  for (const [name, def] of Object.entries(rawRoles)) {
    const color = palette[def.color];
    if (!color) throw new Error(`role ${name}: unknown palette color "${def.color}"`);

    const role: Roles[string] = { color };

    if (def.bg !== undefined) {
      const bg = palette[def.bg];
      if (!bg) throw new Error(`role ${name}: unknown palette bg "${def.bg}"`);
      role.bg = bg;
    }

    if (def.bold) role.bold = true;
    if (def.italic) role.italic = true;
    if (def.underline) role.underline = true;

    out[name] = role;
  }

  return out;
}

// Create ctx
const { palette, rawRoles, opacity } = readTheme();
const roles = resolveRoles(rawRoles, palette);
const ctx: BuildContext = { palette, roles, rawRoles, opacity };

// Init ports
const templates: Template[] = [vscode, emacs, ghostty];
const outDir = join(root, "ports");

// Build ports
let count = 0;
for (const template of templates) {
  for (const file of template.render(ctx)) {
    const dest = join(outDir, file.path);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, file.content);
    count++;
  }
}

console.log(`build complete: ${count} files, ${Object.keys(roles).length} roles`);

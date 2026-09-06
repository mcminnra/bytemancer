// Ghostty surface: bg/fg/cursor + 16 ANSI palette entries. Fixes the two drifts —
// foreground b0b0b0 -> fg (#bfc2cc) and cursor b0b0b0 -> purple (#A485DD).

import type { BuildContext, OutputFile, Template } from "../src/types";

// ANSI slot -> semantic role
const ANSI: string[] = [
  "ansi.black", "ansi.red", "ansi.green", "ansi.yellow",
  "ansi.blue", "ansi.magenta", "ansi.cyan", "ansi.white",
  "ansi.bright.black", "ansi.bright.red", "ansi.bright.green", "ansi.bright.yellow",
  "ansi.bright.blue", "ansi.bright.magenta", "ansi.bright.cyan", "ansi.bright.white",
];

function render(ctx: BuildContext): OutputFile[] {
  const c = (role: string): string => ctx.roles[role].color;

  const lines = [
    "# Bytemancer theme -- GENERATED, do not edit",
    `background = ${c("ui.bg.base")}`,
    `foreground = ${c("ui.fg")}`,
    `cursor-color = ${c("ui.fg")}`,
    `cursor-text = ${c("ui.bg.base")}`,
    ...ANSI.map((role, i) => `palette = ${i}=${c(role)}`),
    "",
  ];

  return [{ path: "ghostty/bytemancer", content: lines.join("\n") }];
}

export const ghostty: Template = { render };

// Ghostty surface: bg/fg/cursor + 16 ANSI palette entries. Fixes the two drifts —
// foreground b0b0b0 -> fg (#bfc2cc) and cursor b0b0b0 -> purple (#A485DD).

import type { BuildContext, OutputFile, Template } from "../src/types";

// ANSI slot -> palette name
const ANSI: string[] = [
  "base", "red", "green", "yellow", "blue", "purple", "cyan", "fg_bright",
  "fg_muted", "red", "green", "yellow", "blue", "purple", "cyan", "fg_bright",
];

function render(ctx: BuildContext): OutputFile[] {
  const p = ctx.palette;
  const c = (role: string): string => ctx.roles[role].color;

  const lines = [
    "# Bytemancer theme -- GENERATED, do not edit",
    `background = ${c("ui.bg.base")}`,
    `foreground = ${c("ui.fg")}`,
    `cursor-color = ${c("ui.cursor")}`,
    `cursor-text = ${c("ui.bg.base")}`,
    ...ANSI.map((name, i) => `palette = ${i}=${p[name]}`),
    "",
  ];

  return [{ path: "ghostty/bytemancer", content: lines.join("\n") }];
}

export const ghostty: Template = { render };

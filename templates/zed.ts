import { alpha } from "../src/color";
import type { BuildContext, OutputFile, Opacity, Role, Template } from "../src/types";

// SOURCE: https://zed.dev/docs/extensions/languages#syntax-highlighting
const SYNTAX: Record<string, string> = {
  attribute: "syntax.attribute",
  boolean: "syntax.constant",
  comment: "syntax.comment",
  "comment.doc": "syntax.doc",
  constant: "syntax.constant",
  "constant.builtin": "syntax.builtin",
  constructor: "syntax.type",
  embedded: "syntax.variable",
  emphasis: "markdown.italic",
  "emphasis.strong": "markdown.bold",
  enum: "syntax.enum",
  function: "syntax.function",
  hint: "ui.hint",
  keyword: "syntax.keyword",
  label: "syntax.namespace",
  link_text: "markdown.link",
  link_uri: "markdown.link",
  number: "syntax.number",
  operator: "syntax.operator",
  predictive: "ui.fg.muted",
  preproc: "syntax.keyword",
  primary: "ui.fg",
  property: "syntax.property",
  punctuation: "syntax.punctuation",
  "punctuation.bracket": "syntax.punctuation",
  "punctuation.delimiter": "syntax.punctuation",
  "punctuation.list_marker": "syntax.punctuation",
  "punctuation.special": "syntax.punctuation",
  "punctuation.markup": "syntax.punctuation",
  "punctuation.embedded.markup": "markdown.code.block",
  string: "syntax.string",
  "string.escape": "syntax.escape",
  "string.regex": "syntax.regexp",
  "string.special": "syntax.string",
  "string.special.symbol": "syntax.constant",
  tag: "syntax.tag",
  "tag.doctype": "syntax.tag",
  // NOTE: Markdown exposes inline code and fence markers, not a block-body capture.
  "text.literal": "markdown.code.inline",
  title: "markdown.heading",
  type: "syntax.type",
  "type.builtin": "syntax.builtin",
  variable: "syntax.variable",
  "variable.special": "syntax.language_var",
  "variable.parameter": "syntax.parameter",
  variant: "syntax.enum_member",
};

function syntaxStyle(role: Role) {
  return {
    color: role.color,
    ...(role.bg ? { background_color: role.bg } : {}),
    ...(role.italic ? { font_style: "italic" } : {}),
    ...(role.bold ? { font_weight: 700 } : {}),
  };
}

function render(ctx: BuildContext): OutputFile[] {
  const c = (role: string): string => ctx.roles[role].color;
  const a = (role: string, level: keyof Opacity): string =>
    alpha(c(role), ctx.opacity[level]);
  const bg = (role: string): string => {
    const value = ctx.roles[role].bg;
    if (!value) throw new Error(`role ${role} has no bg`);
    return value;
  };

  // SOURCE: https://zed.dev/schema/themes/v0.2.0.json
  const colors: Record<string, string> = {
    background: c("ui.bg.base"),
    "surface.background": c("ui.bg.base"),
    "elevated_surface.background": c("ui.bg.overlay"),
    border: a("ui.fg.muted", "muted"),
    "border.variant": a("ui.fg.muted", "muted"),
    "border.focused": c("ui.accent"),
    "border.selected": c("ui.accent"),
    "border.disabled": a("ui.fg.muted", "muted"),
    "border.transparent": "#00000000",
    "element.background": c("ui.bg.overlay"),
    "element.hover": c("ui.bg.selection"),
    "element.active": c("ui.bg.selection"),
    "element.selected": c("ui.bg.selection"),
    "element.disabled": c("ui.bg.raised"),
    "ghost_element.background": "#00000000",
    "ghost_element.hover": c("ui.bg.overlay"),
    "ghost_element.active": c("ui.bg.selection"),
    "ghost_element.selected": c("ui.bg.selection"),
    "ghost_element.disabled": c("ui.bg.base"),
    "drop_target.background": a("ui.accent", "subtle"),
    text: c("ui.fg"),
    "text.muted": c("ui.fg"),
    "text.placeholder": c("ui.fg"),
    "text.disabled": c("ui.fg"),
    "text.accent": c("ui.accent"),
    icon: c("ui.fg"),
    "icon.muted": c("ui.fg"),
    "icon.placeholder": c("ui.fg"),
    "icon.disabled": c("ui.fg"),
    "icon.accent": c("ui.accent"),
    "link_text.hover": c("ui.link"),
    "status_bar.background": c("ui.bg.base"),
    "title_bar.background": c("ui.bg.base"),
    "title_bar.inactive_background": c("ui.bg.base"),
    "toolbar.background": c("ui.bg.raised"),
    "tab_bar.background": c("ui.bg.base"),
    "tab.active_background": c("ui.bg.raised"),
    "tab.inactive_background": c("ui.bg.base"),
    "panel.background": c("ui.bg.base"),
    "panel.focused_border": c("ui.accent"),
    "panel.indent_guide": a("ui.fg.muted", "subtle"),
    "panel.indent_guide_hover": a("ui.fg.muted", "muted"),
    "panel.indent_guide_active": a("ui.fg.muted", "strong"),
    "pane.focused_border": c("ui.accent"),
    "pane_group.border": a("ui.fg.muted", "muted"),
    "scrollbar.thumb.background": a("ui.fg.muted", "subtle"),
    "scrollbar.thumb.hover_background": a("ui.fg.muted", "muted"),
    "scrollbar.thumb.border": a("ui.fg.muted", "muted"),
    "scrollbar.track.background": "#00000000",
    "scrollbar.track.border": a("ui.fg.muted", "muted"),
    "editor.background": c("ui.bg.raised"),
    "editor.foreground": c("ui.fg"),
    "editor.gutter.background": c("ui.bg.raised"),
    "editor.subheader.background": c("ui.bg.overlay"),
    "editor.active_line.background": c("ui.bg.overlay"),
    "editor.highlighted_line.background": a("ui.bg.selection", "strong"),
    "editor.line_number": c("ui.line_number"),
    "editor.active_line_number": c("ui.line_number.active"),
    "editor.invisible": a("ui.fg.muted", "subtle"),
    "editor.wrap_guide": a("ui.fg.muted", "subtle"),
    "editor.active_wrap_guide": a("ui.fg.muted", "muted"),
    "editor.indent_guide": a("ui.fg.muted", "subtle"),
    "editor.indent_guide_active": a("ui.fg.muted", "muted"),
    "editor.document_highlight.read_background": a("ui.bg.selection", "muted"),
    "editor.document_highlight.write_background": a("ui.bg.selection", "strong"),
    "editor.document_highlight.bracket_background": a("ui.accent", "subtle"),
    "search.match_background": bg("ui.search.current"),
    "terminal.background": c("ui.bg.base"),
    "terminal.ansi.background": c("ui.bg.base"),
    "terminal.foreground": c("ui.fg"),
    "terminal.bright_foreground": c("ui.fg.bright"),
  };

  const statuses: Record<string, string> = {
    error: "ui.error", warning: "ui.warning", info: "ui.info",
    hint: "ui.hint", success: "ui.success", predictive: "ui.fg.muted",
    created: "git.added", modified: "git.modified", deleted: "git.deleted",
    renamed: "git.renamed", ignored: "git.ignored", conflict: "git.conflict",
    hidden: "ui.fg.muted", unreachable: "ui.fg.muted",
  };
  for (const [key, role] of Object.entries(statuses)) {
    colors[key] = c(role);
    colors[`${key}.background`] = a(role, "subtle");
    colors[`${key}.border`] = c(role);
  }

  for (const name of ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]) {
    colors[`terminal.ansi.${name}`] = c(`ansi.${name}`);
    colors[`terminal.ansi.bright_${name}`] = c(`ansi.bright.${name}`);
  }

  const family = {
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name: "Bytemancer",
    author: "ryder",
    themes: [{
      name: "Bytemancer",
      appearance: "dark",
      style: {
        ...colors,
        // NOTE: The first player controls the local cursor and selection.
        players: [{
          cursor: c("ui.cursor"),
          background: c("ui.cursor"),
          selection: c("ui.bg.selection"),
        }],
        syntax: Object.fromEntries(
          Object.entries(SYNTAX).map(([capture, role]) => [capture, syntaxStyle(ctx.roles[role])]),
        ),
      },
    }],
  };

  return [{ path: "zed/bytemancer.json", content: JSON.stringify(family, null, 2) + "\n" }];
}

export const zed: Template = { render };

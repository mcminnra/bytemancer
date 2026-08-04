// VS Code surface: builds the color-theme object and the extension manifest.
// Output is JSON, so we build an object and JSON.stringify rather than templating text.

import { alpha } from "../src/color";
import type { BuildContext, OutputFile, Opacity, Role, Template } from "../src/types";

type Level = keyof Opacity;

interface Settings {
  foreground: string;
  fontStyle?: string;
}

interface TokenColor {
  name: string;
  scope: string[];
  settings: Settings;
}

function styleStr(r: Role): string | undefined {
  const parts: string[] = [];
  if (r.bold) parts.push("bold");
  if (r.italic) parts.push("italic");
  if (r.underline) parts.push("underline");
  return parts.length ? parts.join(" ") : undefined;
}

function render(ctx: BuildContext): OutputFile[] {
  const p = ctx.palette;
  const c = (role: string): string => ctx.roles[role].color;
  const bg = (role: string): string => {
    const b = ctx.roles[role].bg;
    if (!b) throw new Error(`role ${role} has no bg`);
    return b;
  };
  // alpha off a role's foreground / off a bare palette color.
  const a = (role: string, level: Level): string =>
    alpha(c(role), ctx.opacity[level]);
  const ap = (name: string, level: Level): string =>
    alpha(p[name], ctx.opacity[level]);

  // Syntax token: foreground (+ fontStyle) from a role.
  const tok = (name: string, scope: string[], role: string): TokenColor => {
    const s = styleStr(ctx.roles[role]);
    return { name, scope, settings: s ? { foreground: c(role), fontStyle: s } : { foreground: c(role) } };
  };
  // Same, but a literal palette color (language-specific fan-out, no shared role).
  const tokP = (name: string, scope: string[], color: string): TokenColor => ({
    name,
    scope,
    settings: { foreground: color },
  });
  // Semantic token value: string, or {foreground, fontStyle} when styled.
  const sem = (role: string): string | Settings => {
    const s = styleStr(ctx.roles[role]);
    return s ? { foreground: c(role), fontStyle: s } : c(role);
  };

  const colors: Record<string, string> = {
    focusBorder: c("ui.accent"),
    foreground: c("ui.fg"),
    descriptionForeground: c("ui.fg"),
    "icon.foreground": c("ui.fg"),
    "selection.background": c("ui.bg.selection"),
    errorForeground: c("ui.error"),

    "textLink.foreground": c("ui.link"),
    "textLink.activeForeground": c("ui.link"),
    "textBlockQuote.background": c("ui.bg.overlay"),
    "textBlockQuote.border": c("ui.bg.selection"),
    "textCodeBlock.background": c("ui.bg.overlay"),

    "widget.shadow": ap("black", "muted"),

    "input.background": c("ui.bg.overlay"),
    "input.foreground": c("ui.fg"),
    "input.border": c("ui.bg.selection"),
    "input.placeholderForeground": c("ui.fg.muted"),
    "inputOption.activeBorder": c("ui.accent"),
    "inputOption.activeBackground": a("ui.accent", "subtle"),
    "inputOption.activeForeground": c("ui.fg.bright"),
    "inputValidation.errorBackground": p.red_bg,
    "inputValidation.errorBorder": c("ui.error"),
    "inputValidation.warningBackground": p.yellow_bg,
    "inputValidation.warningBorder": c("ui.warning"),
    "inputValidation.infoBackground": p.blue_bg,
    "inputValidation.infoBorder": c("ui.info"),

    "dropdown.background": c("ui.bg.overlay"),
    "dropdown.foreground": c("ui.fg"),
    "dropdown.border": c("ui.bg.selection"),
    "dropdown.listBackground": c("ui.bg.overlay"),

    "button.background": c("ui.accent"),
    "button.foreground": c("ui.bg.raised"),
    "button.hoverBackground": p.accent_hover,
    "button.secondaryBackground": c("ui.bg.selection"),
    "button.secondaryForeground": c("ui.fg"),

    "badge.background": c("ui.accent"),
    "badge.foreground": c("ui.bg.raised"),

    "scrollbar.shadow": ap("black", "muted"),
    "scrollbarSlider.background": a("ui.fg.muted", "subtle"),
    "scrollbarSlider.hoverBackground": a("ui.fg.muted", "muted"),
    "scrollbarSlider.activeBackground": a("ui.fg.muted", "strong"),

    "progressBar.background": c("ui.accent"),

    "list.activeSelectionBackground": c("ui.bg.selection"),
    "list.activeSelectionForeground": c("ui.fg.bright"),
    "list.focusBackground": c("ui.bg.selection"),
    "list.focusForeground": c("ui.fg.bright"),
    "list.highlightForeground": p.yellow,
    "list.hoverBackground": c("ui.bg.overlay"),
    "list.hoverForeground": c("ui.fg"),
    "list.inactiveSelectionBackground": a("ui.bg.selection", "strong"),
    "list.inactiveSelectionForeground": c("ui.fg"),
    "list.errorForeground": c("ui.error"),
    "list.warningForeground": c("ui.warning"),

    "tree.indentGuidesStroke": c("ui.bg.selection"),

    "activityBar.background": c("ui.bg.base"),
    "activityBar.foreground": c("ui.fg"),
    "activityBar.inactiveForeground": c("ui.fg.muted"),
    "activityBar.border": c("ui.bg.base"),
    "activityBarBadge.background": c("ui.accent"),
    "activityBarBadge.foreground": c("ui.bg.raised"),

    "sideBar.background": c("ui.bg.base"),
    "sideBar.foreground": c("ui.fg"),
    "sideBar.border": c("ui.bg.base"),
    "sideBarTitle.foreground": c("ui.fg"),
    "sideBarSectionHeader.background": c("ui.bg.base"),
    "sideBarSectionHeader.foreground": c("ui.fg"),

    "minimap.findMatchHighlight": a("ui.search.current", "muted"),
    "minimap.selectionHighlight": c("ui.bg.selection"),
    "minimap.errorHighlight": c("ui.error"),
    "minimap.warningHighlight": c("ui.warning"),
    "minimapGutter.addedBackground": c("git.added"),
    "minimapGutter.modifiedBackground": c("git.modified"),
    "minimapGutter.deletedBackground": c("git.deleted"),

    "editorGroup.border": c("ui.bg.selection"),
    "editorGroupHeader.tabsBackground": c("ui.bg.base"),
    "editorGroupHeader.noTabsBackground": c("ui.bg.raised"),

    "tab.activeBackground": c("ui.bg.raised"),
    "tab.activeForeground": c("ui.fg.bright"),
    "tab.activeBorderTop": c("ui.accent"),
    "tab.inactiveBackground": c("ui.bg.base"),
    "tab.inactiveForeground": c("ui.fg.muted"),
    "tab.border": c("ui.bg.base"),
    "tab.hoverBackground": c("ui.bg.raised"),

    "editor.background": c("ui.bg.raised"),
    "editor.foreground": c("ui.fg"),
    "editorCursor.foreground": c("ui.cursor"),
    "editor.selectionBackground": c("ui.bg.selection"),
    "editor.selectionHighlightBackground": a("ui.bg.selection", "muted"),
    "editor.inactiveSelectionBackground": a("ui.bg.selection", "strong"),
    "editor.wordHighlightBackground": a("ui.bg.selection", "muted"),
    "editor.wordHighlightStrongBackground": a("ui.bg.selection", "strong"),
    "editor.findMatchBackground": bg("ui.search.current"),
    "editor.findMatchHighlightBackground": alpha(bg("ui.search.other"), ctx.opacity.strong),
    "editor.findRangeHighlightBackground": a("ui.bg.selection", "subtle"),
    "editor.hoverHighlightBackground": a("ui.bg.selection", "muted"),
    "editor.lineHighlightBackground": c("ui.bg.overlay"),
    "editor.rangeHighlightBackground": a("ui.bg.selection", "subtle"),
    "editorLink.activeForeground": c("ui.link"),

    "editorWhitespace.foreground": a("ui.fg.muted", "subtle"),
    "editorIndentGuide.background": a("ui.fg.muted", "subtle"),
    "editorIndentGuide.activeBackground": a("ui.fg.muted", "muted"),
    "editorRuler.foreground": a("ui.fg.muted", "subtle"),

    "editorLineNumber.foreground": c("ui.line_number"),
    "editorLineNumber.activeForeground": c("ui.line_number.active"),

    "editorBracketMatch.background": a("ui.accent", "subtle"),
    "editorBracketMatch.border": c("ui.accent"),
    "editorBracketHighlight.foreground1": c("ui.bracket.1"),
    "editorBracketHighlight.foreground2": c("ui.bracket.2"),
    "editorBracketHighlight.foreground3": c("ui.bracket.3"),
    "editorBracketHighlight.foreground4": c("ui.bracket.1"),
    "editorBracketHighlight.foreground5": c("ui.bracket.2"),
    "editorBracketHighlight.foreground6": c("ui.bracket.3"),
    "editorBracketHighlight.unexpectedBracket.foreground": c("ui.bracket.unmatched"),

    "editorError.foreground": c("ui.error"),
    "editorWarning.foreground": c("ui.warning"),
    "editorInfo.foreground": c("ui.info"),
    "editorHint.foreground": c("ui.hint"),

    "editorGutter.addedBackground": c("git.added"),
    "editorGutter.modifiedBackground": c("git.modified"),
    "editorGutter.deletedBackground": c("git.deleted"),

    "editorOverviewRuler.addedForeground": c("git.added"),
    "editorOverviewRuler.modifiedForeground": c("git.modified"),
    "editorOverviewRuler.deletedForeground": c("git.deleted"),
    "editorOverviewRuler.errorForeground": c("ui.error"),
    "editorOverviewRuler.warningForeground": c("ui.warning"),
    "editorOverviewRuler.infoForeground": c("ui.info"),
    "editorOverviewRuler.bracketMatchForeground": c("ui.accent"),

    "editorWidget.background": c("ui.bg.overlay"),
    "editorWidget.foreground": c("ui.fg"),
    "editorWidget.border": c("ui.bg.selection"),
    "editorSuggestWidget.background": c("ui.bg.overlay"),
    "editorSuggestWidget.foreground": c("ui.fg"),
    "editorSuggestWidget.selectedBackground": c("ui.bg.selection"),
    "editorSuggestWidget.highlightForeground": p.yellow,

    "peekView.border": c("ui.accent"),
    "peekViewEditor.background": c("ui.bg.overlay"),
    "peekViewEditor.matchHighlightBackground": ap("yellow_bg", "strong"),
    "peekViewResult.background": c("ui.bg.base"),
    "peekViewResult.fileForeground": c("ui.fg"),
    "peekViewResult.lineForeground": c("ui.fg"),
    "peekViewResult.matchHighlightBackground": ap("yellow_bg", "strong"),
    "peekViewResult.selectionBackground": c("ui.bg.selection"),
    "peekViewResult.selectionForeground": c("ui.fg.bright"),
    "peekViewTitle.background": c("ui.bg.overlay"),
    "peekViewTitleDescription.foreground": c("ui.fg.muted"),
    "peekViewTitleLabel.foreground": c("ui.fg"),

    "diffEditor.insertedTextBackground": a("diff.added.bg", "strong"),
    "diffEditor.removedTextBackground": a("diff.removed.bg", "strong"),
    "diffEditor.diagonalFill": a("ui.bg.selection", "subtle"),

    "merge.currentHeaderBackground": a("diff.added.emphasis", "strong"),
    "merge.currentContentBackground": a("diff.added.bg", "strong"),
    "merge.incomingHeaderBackground": ap("blue_bg", "strong"),
    "merge.incomingContentBackground": ap("blue_bg", "muted"),

    "panel.background": c("ui.bg.base"),
    "panel.border": c("ui.bg.selection"),
    "panelTitle.activeBorder": c("ui.accent"),
    "panelTitle.activeForeground": c("ui.fg.bright"),
    "panelTitle.inactiveForeground": c("ui.fg.muted"),

    "statusBar.background": c("ui.bg.overlay"),
    "statusBar.foreground": c("ui.fg"),
    "statusBar.border": c("ui.bg.overlay"),
    "statusBar.debuggingBackground": c("ui.warning"),
    "statusBar.debuggingForeground": c("ui.bg.raised"),
    "statusBar.noFolderBackground": c("ui.bg.overlay"),
    "statusBar.noFolderForeground": c("ui.fg"),
    "statusBarItem.remoteBackground": c("ui.accent"),
    "statusBarItem.remoteForeground": c("ui.bg.raised"),
    "statusBarItem.hoverBackground": c("ui.bg.selection"),

    "titleBar.activeBackground": c("ui.bg.base"),
    "titleBar.activeForeground": c("ui.fg"),
    "titleBar.inactiveBackground": c("ui.bg.base"),
    "titleBar.inactiveForeground": c("ui.fg.muted"),
    "titleBar.border": c("ui.bg.base"),

    "menu.background": c("ui.bg.overlay"),
    "menu.foreground": c("ui.fg"),
    "menu.selectionBackground": c("ui.bg.selection"),
    "menu.selectionForeground": c("ui.fg.bright"),
    "menu.separatorBackground": c("ui.bg.selection"),
    "menubar.selectionBackground": c("ui.bg.selection"),

    "notifications.background": c("ui.bg.overlay"),
    "notifications.foreground": c("ui.fg"),
    "notifications.border": c("ui.bg.selection"),
    "notificationsErrorIcon.foreground": c("ui.error"),
    "notificationsWarningIcon.foreground": c("ui.warning"),
    "notificationsInfoIcon.foreground": c("ui.info"),

    "breadcrumb.foreground": c("ui.fg.muted"),
    "breadcrumb.focusForeground": c("ui.fg"),
    "breadcrumb.activeSelectionForeground": c("ui.fg.bright"),
    "breadcrumbPicker.background": c("ui.bg.overlay"),

    "terminal.background": c("ui.bg.base"),
    "terminal.foreground": c("ui.fg"),
    "terminal.ansiBlack": c("ui.bg.base"),
    "terminal.ansiRed": p.red,
    "terminal.ansiGreen": p.green,
    "terminal.ansiYellow": p.yellow,
    "terminal.ansiBlue": p.blue,
    "terminal.ansiMagenta": p.purple,
    "terminal.ansiCyan": p.cyan,
    "terminal.ansiWhite": c("ui.fg.bright"),
    "terminal.ansiBrightBlack": c("ui.fg.muted"),
    "terminal.ansiBrightRed": p.red,
    "terminal.ansiBrightGreen": p.green,
    "terminal.ansiBrightYellow": p.yellow,
    "terminal.ansiBrightBlue": p.blue,
    "terminal.ansiBrightMagenta": p.purple,
    "terminal.ansiBrightCyan": p.cyan,
    "terminal.ansiBrightWhite": c("ui.fg.bright"),
    "terminal.selectionBackground": c("ui.bg.selection"),
    "terminalCursor.foreground": c("ui.cursor"),

    "gitDecoration.addedResourceForeground": c("git.added"),
    "gitDecoration.modifiedResourceForeground": c("git.modified"),
    "gitDecoration.deletedResourceForeground": c("git.deleted"),
    "gitDecoration.untrackedResourceForeground": c("git.untracked"),
    "gitDecoration.conflictingResourceForeground": c("git.conflict"),
    "gitDecoration.ignoredResourceForeground": c("git.ignored"),
    "gitDecoration.stageModifiedResourceForeground": c("git.modified"),
    "gitDecoration.stageDeletedResourceForeground": c("git.deleted"),

    "debugToolBar.background": c("ui.bg.overlay"),
    "debugIcon.breakpointForeground": c("ui.error"),
    "debugIcon.startForeground": c("ui.success"),
    "debugIcon.pauseForeground": p.yellow,
    "debugIcon.stopForeground": c("ui.error"),
    "debugIcon.stepOverForeground": c("ui.info"),
    "debugIcon.stepIntoForeground": c("ui.info"),
    "debugIcon.stepOutForeground": c("ui.info"),
    "debugIcon.restartForeground": c("ui.success"),

    "editorLightBulb.foreground": p.yellow,
    "editorLightBulbAutoFix.foreground": c("ui.success"),
  };

  const tokenColors: TokenColor[] = [
    tok("Comments", ["comment", "punctuation.definition.comment"], "syntax.comment"),
    tok("Strings", ["string", "string.quoted", "string.template"], "syntax.string"),
    tok("String escape characters", ["constant.character.escape"], "syntax.escape"),
    tok("Keywords", ["keyword", "keyword.control", "storage.type", "storage.modifier"], "syntax.keyword"),
    tok(
      "Operators",
      [
        "keyword.operator",
        "keyword.operator.assignment",
        "keyword.operator.arithmetic",
        "keyword.operator.logical",
        "keyword.operator.comparison",
      ],
      "syntax.operator",
    ),
    tok("Functions", ["entity.name.function", "meta.function-call", "support.function"], "syntax.function"),
    tok("Function parameters", ["variable.parameter"], "syntax.parameter"),
    tok("Types", ["entity.name.type", "entity.name.class", "support.type", "support.class"], "syntax.type"),
    tok("Type parameters", ["entity.name.type.parameter"], "syntax.type"),
    tok("Variables", ["variable", "variable.other", "variable.other.readwrite"], "syntax.variable"),
    tok("Language variables (this/self/super)", ["variable.language"], "syntax.language_var"),
    tok(
      "Properties",
      ["variable.other.property", "variable.other.object.property", "support.variable.property"],
      "syntax.property",
    ),
    tok("Constants", ["constant", "constant.language", "constant.other"], "syntax.constant"),
    tok("Numbers", ["constant.numeric"], "syntax.number"),
    tok("Built-in / Language support", ["support.constant", "support.variable", "entity.name.tag"], "syntax.builtin"),
    tok("Tag attributes", ["entity.other.attribute-name"], "syntax.attribute"),
    tok("Doc comments / docstrings", ["string.quoted.docstring", "comment.block.documentation"], "syntax.doc"),
    tok(
      "Punctuation",
      ["punctuation", "punctuation.definition.tag", "punctuation.separator", "punctuation.terminator"],
      "syntax.punctuation",
    ),
    tok(
      "Brackets",
      [
        "punctuation.bracket",
        "punctuation.definition.block",
        "punctuation.definition.parameters",
        "punctuation.section",
      ],
      "syntax.punctuation",
    ),
    tok("Invalid / Errors", ["invalid", "invalid.illegal"], "syntax.invalid"),
    tok(
      "Markdown headings",
      ["markup.heading", "heading.1.markdown entity.name", "heading.2.markdown entity.name", "heading.3.markdown entity.name"],
      "markdown.heading",
    ),
    tok("Markdown bold", ["markup.bold"], "markdown.bold"),
    tok("Markdown italic", ["markup.italic"], "markdown.italic"),
    tok("Markdown inline code", ["markup.inline.raw"], "markdown.code.inline"),
    tok("Markdown code block", ["markup.fenced_code.block"], "markdown.code.block"),
    tok("Markdown link", ["markup.underline.link"], "markdown.link"),
    tok("Diff inserted", ["markup.inserted"], "diff.added.fg"),
    tok("Diff deleted", ["markup.deleted"], "diff.removed.fg"),
    tok("Diff changed", ["markup.changed"], "diff.changed.fg"),
    tok("Regex", ["string.regexp"], "syntax.regexp"),
    tok("Decorators / Annotations", ["meta.decorator", "entity.name.function.decorator", "punctuation.decorator"], "syntax.decorator"),
    tokP("CSS selectors", ["entity.other.attribute-name.class.css", "entity.other.attribute-name.id.css"], p.green),
    tokP("CSS property names", ["support.type.property-name.css"], p.blue),
    tokP("CSS property values", ["support.constant.property-value.css", "meta.property-value.css"], p.orange),
    tokP("JSON keys", ["support.type.property-name.json"], p.blue),
    tok(
      "Template string interpolation",
      ["punctuation.definition.template-expression", "string.template meta.template.expression"],
      "syntax.operator",
    ),
    tok("Namespace / Module", ["entity.name.namespace", "entity.name.module"], "syntax.namespace"),
    tok("Interface", ["entity.name.type.interface"], "syntax.type"),
    tok("Enum", ["entity.name.type.enum"], "syntax.enum"),
    tok("Enum member", ["variable.other.enummember"], "syntax.enum_member"),
  ];

  const semanticTokenColors: Record<string, string | Settings> = {
    namespace: sem("syntax.namespace"),
    type: sem("syntax.type"),
    class: sem("syntax.type"),
    interface: sem("syntax.type"),
    enum: sem("syntax.enum"),
    enumMember: sem("syntax.enum_member"),
    function: sem("syntax.function"),
    method: sem("syntax.function"),
    macro: sem("syntax.builtin"),
    variable: sem("syntax.variable"),
    "variable.readonly": sem("syntax.variable"),
    "variable.defaultLibrary": sem("syntax.language_var"),
    parameter: sem("syntax.parameter"),
    property: sem("syntax.property"),
    "property.readonly": sem("syntax.property"),
    keyword: sem("syntax.keyword"),
    comment: sem("syntax.comment"),
    string: sem("syntax.string"),
    number: sem("syntax.number"),
    operator: sem("syntax.operator"),
    decorator: sem("syntax.decorator"),
    typeParameter: sem("syntax.type"),
  };

  const theme = {
    $schema: "vscode://schemas/color-theme",
    name: "Bytemancer",
    type: "dark",
    colors,
    tokenColors,
    semanticHighlighting: true,
    semanticTokenColors,
  };

  const manifest = {
    name: "bytemancer",
    displayName: "Bytemancer",
    description: "A dark theme custom tailored to mancing bytes",
    version: "0.1.0",
    publisher: "rydermcminn",
    license: "MIT",
    engines: { vscode: "^1.60.0" },
    categories: ["Themes"],
    contributes: {
      themes: [{ label: "Bytemancer", uiTheme: "vs-dark", path: "./themes/bytemancer-color-theme.json" }],
    },
  };

  return [
    { path: "vscode/themes/bytemancer-color-theme.json", content: JSON.stringify(theme, null, 2) + "\n" },
    { path: "vscode/package.json", content: JSON.stringify(manifest, null, 2) + "\n" },
  ];
}

export const vscode: Template = { render };

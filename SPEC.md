# Bytemancer: Single-Source Theme Generation

**Status:** 📋 PROPOSED

Define the Bytemancer palette and its semantic role mapping exactly once, and generate the VS Code, Emacs, and Ghostty themes from it.

## TL;DR

- **Problem:** Bytemancer exists as three independently hand-maintained copies (Emacs, VS Code, Ghostty) that have already drifted — the foreground color, the cursor color, and several git decoration colors disagree across surfaces.
- **Solution:** One repo holding a palette file, a semantic role map, and per-surface templates. A Node/TS builder emits each surface's native format. Outputs are committed; dotfiles consumes them.
- **Key insight:** The drift is in *role assignment* as much as in hex values. A palette-only abstraction would not have prevented a single one of the observed defects — the intermediate layer has to encode "what color is a keyword," not just "what is red."
- **Later:** Additional surfaces (tmux, fish, delta, oh-my-posh), a light flavor, Marketplace and MELPA publishing.

## Motivation

### Current State

Three copies, no shared vocabulary:

| Surface | Location | Form |
|---|---|---|
| Emacs | `dotfiles/modules/home/emacs/themes/bytemancer-theme.el` | `let`-bound palette + ~150 `custom-theme-set-faces` entries |
| VS Code | `bytemancer-vscode/themes/bytemancer-color-theme.json` | ~270 flat hex literals, no names |
| Ghostty | `dotfiles/modules/home/ghostty/config` | inline `# Bytemancer theme` block, 16 ANSI + bg/fg/cursor |

Observed defects:

- **`fg` disagrees.** Emacs `#bfc2cc`, VS Code `#b0b0b0`, Ghostty `#b0b0b0`.
- **Cursor disagrees.** Emacs and VS Code use purple `#A485DD`; Ghostty uses `#b0b0b0`.
- **Background tints are named in exactly one place.** Emacs names `red_bg`/`red_bg2`/`red_bg3`, `green_bg`/`2`/`3`, `yellow_bg`, `blue_bg`, `purple_bg`. VS Code inlines the same hexes with ad-hoc alpha suffixes and no names. Ghostty has none.
- **Dead palette entries.** `red_bg3` (`#170306`) and `green_bg3` (`#0d1307`) are defined and never referenced.
- **Layer names are inverted.** The stack is `core #131313` → `mantle #191919` → `crust #1A1B2A` → `surface #2b2d45`, placing Catppuccin's word for the *darkest* layer in the third-lightest slot. Origin is the commented-out TokyoNight-derived palette at `bytemancer-theme.el:51-79`.
- **Five ad-hoc alpha levels** on `selection` alone in VS Code (`33`, `40`, `66`, `80`, `99`), accumulated rather than designed.
- **Cyan is a VS Code-only role.** VS Code gives cyan namespaces, regex, and tag attributes; Emacs gives it only `link`, `org-list-dt`, and rainbow delimiters.

The role mapping is otherwise well aligned across surfaces — keyword=red, operator=red, string=yellow, function=green, type=blue-italic, constant=orange, number=purple, builtin=purple, variable=fg, comment=grey-italic. That alignment is the real asset, and it is currently encoded nowhere.

### Desired State

A single `bytemancer` repo where changing a color is one edit to one file, `npm run build` regenerates all surfaces, and the resulting git diff is the review surface. Adding a fourth surface means writing one template, not re-deriving the whole theme.

## Design

### Layers

```
flavors/dark.toml     palette:  name -> hex          (e.g. purple = "#A485DD")
roles.toml            roles:    role -> palette name (e.g. syntax.keyword = red)
templates/*.ts        fan-out:  role -> N native keys per surface
```

**The IR owns decisions; templates own fan-out.** One `ui.selection.bg` role feeds `region` + `secondary-selection` + `helm-selection` in Emacs and `selection.background` + `editor.selectionBackground` + `menu.selectionBackground` + `list.activeSelectionBackground` in VS Code. If a role is being added to serve exactly one surface's one key, that is a smell — the target is ~50–70 roles against 150 Emacs faces and 270 VS Code keys.

### Source of Truth

**Palette hex values come from the current Emacs theme.** This resolves `fg` to `#bfc2cc`.

**Role assignments merge:** Emacs wins where both surfaces define a role; VS Code fills roles Emacs has no face for. This preserves commit `c568114` (cyan tag attributes, foreground enums) — a deliberate recent decision Emacs has no equivalent for, which a strict Emacs-wins rule would have reverted.

**Font style is decided per role, explicitly** — it does not follow the color merge rule. The known conflict is doc comments: Emacs `font-lock-doc-face` is yellow with no italic; VS Code docstrings are yellow italic. Pick one at extraction time rather than letting the merge policy silently restyle it.

#### Worked example: applying the merge rule to `git.*`

The merge rule has visible consequences. Emacs `treemacs-git-*` and VS Code `gitDecoration.*` both define these roles, so Emacs wins:

| Role | Emacs (wins) | VS Code (current) | Result |
|---|---|---|---|
| `git.modified` | yellow | blue | VS Code file decorations turn **yellow** |
| `git.untracked` | cyan | green | VS Code file decorations turn **cyan** |
| `git.conflict` | red bold | orange | VS Code file decorations turn **red** |

Note that VS Code's `editorGutter.modifiedBackground` (blue) is arguably a distinct role from file-tree decoration. Extraction should decide whether gutter and decoration share `git.modified` or split into `git.modified` / `diff.changed`. Recommendation: they are the same decision and should share.

### Layer Naming

Renamed to a neutral, ordered, semantic scheme. Hex values are unchanged.

| New | Old | Hex | Used for |
|---|---|---|---|
| `base` | `core` | `#131313` | sidebars, panels, activity bar, terminal, solaire windows |
| `raised` | `mantle` | `#191919` | editor background, `default` face, fringe |
| `overlay` | `crust` | `#1A1B2A` | `hl-line`, widgets, popups, input backgrounds |
| `selection` | `surface` | `#2b2d45` | region, selection, active list item |

Note for later: `base` and `raised` are pure neutral grey while `overlay` and `selection` are navy-tinted, so backgrounds shift hue as they lighten. Possibly deliberate depth cueing, possibly an artifact of the TokyoNight-derived origin. Centralizing the palette makes this a one-line change if it turns out to be unwanted; not in scope here.

### Role Namespace (sketch)

Neutral and flat. Not exhaustive — final list is produced by the extraction.

```
syntax.keyword          red          syntax.attribute        cyan   italic   [VS Code origin]
syntax.operator         red          syntax.namespace        cyan            [VS Code origin]
syntax.string           yellow       syntax.regexp           cyan            [VS Code origin]
syntax.doc              yellow  ?    syntax.decorator        orange          [VS Code origin]
syntax.comment          grey  italic syntax.escape           orange
syntax.function         green        syntax.enum             fg     italic   [VS Code origin]
syntax.type             blue  italic syntax.enum_member      fg              [VS Code origin]
syntax.variable         fg           syntax.language_var     purple          [VS Code origin]
syntax.parameter        fg           syntax.punctuation      fg
syntax.property         fg           syntax.invalid          red    bold
syntax.constant         orange
syntax.number           purple       ui.bg.base / raised / overlay / selection
syntax.builtin          purple       ui.fg / fg.bright / fg.muted
syntax.tag              purple       ui.accent               purple
                                     ui.cursor               purple
diff.added.bg           green_bg2    ui.link                 cyan
diff.added.emphasis     green_bg     ui.error / warning / info / success / hint
diff.added.fg           green        ui.bracket.1 / .2 / .3  purple / cyan / blue
diff.removed.bg         red_bg2      ui.bracket.unmatched    red
diff.removed.emphasis   red_bg       ui.line_number / .active
diff.removed.fg         red          ui.search.current       yellow_bg
diff.changed.fg         blue         ui.search.other         blue_bg
diff.changed.bg         blue_bg
                                     markdown.heading        purple bold
git.added               green        markdown.bold           orange bold
git.modified            yellow       markdown.italic         red    italic
git.deleted             red          markdown.code.inline    yellow
git.untracked           cyan         markdown.code.block     yellow
git.renamed             purple       markdown.link           cyan
git.ignored             grey
git.conflict            red   bold   opacity.subtle / muted / strong
```

**Markup namespaces are not shared.** `markdown.*` stays in the IR as a forward bet — Emacs `markdown-mode` is currently unthemed, and a second consumer (markdown-mode, `bat`, `glow`, `delta`) is plausible. `org.*` drops out of the IR entirely: ~40 faces, Emacs-only forever, no second consumer will exist. It lives in the Emacs template referencing palette names directly.

Note that VS Code's `markup.inserted` / `markup.deleted` / `markup.changed` are *diff* roles wearing a TextMate markup prefix. They map to `diff.*`, which is genuinely shared three ways. Do not let the naming mislead the extraction.

### Style Vocabulary

The IR expresses **color plus `bold` / `italic` / `underline`**, and nothing else. Whether types are italic is a design decision that should hold across surfaces, so it belongs in the IR. `:height`, `:box`, `:extend`, and `:strike-through` are Emacs rendering details with no cross-surface meaning — they stay in the Emacs template, hardcoded. This keeps `org-document-title`'s `:height 1.5` and `helm-M-x-key`'s `:box` out of a neutral IR.

### Alpha

The IR stores opaque colors only. Emacs faces cannot express alpha at all; Ghostty has one global `background-opacity` and nothing per-element. Alpha is a VS Code rendering concern, so the VS Code template calls a helper:

```ts
alpha(roles["ui.selection.bg"], opacity.subtle)   // -> "#2b2d4533"
```

Templates never write raw alpha numbers. Three named levels replace the existing five ad-hoc ones:

| Name | Value | Replaces |
|---|---|---|
| `opacity.subtle` | 0.2 | `33` |
| `opacity.muted` | 0.4 | `40`, `66` |
| `opacity.strong` | 0.6 | `80`, `99` |

Expect small, near-imperceptible visual shifts on roughly six keys against `#191919`.

### Repo Layout

```
bytemancer/
├── SPEC.md
├── package.json
├── flavors/
│   └── dark.toml            # palette: name -> hex
├── roles.toml               # role -> palette name + optional style
├── src/
│   ├── build.ts             # entry point
│   ├── color.ts             # alpha(), parsing  [unit tested]
│   └── types.ts
├── templates/
│   ├── vscode.ts
│   ├── emacs.ts
│   └── ghostty.ts
└── out/                     # committed
    ├── vscode/
    │   ├── package.json
    │   └── themes/bytemancer-color-theme.json
    ├── emacs/bytemancer-theme.el
    └── ghostty/bytemancer
```

Flavors are directory-structured from day one with a single `dark` flavor, so adding a light variant later does not require refactoring every template.

**Templates are TypeScript modules exporting a render function**, not a template language. *(Implementation decision not covered in deliberation — flagged.)* Rationale: VS Code's output is JSON, and generating valid JSON from a text templating language means fighting trailing commas; building an object and calling `JSON.stringify` is strictly better. Emacs `.el` and Ghostty config are text formats where template literals read fine. One mechanism, correct for both shapes.

### Consumption

| Surface | Mechanism |
|---|---|
| Emacs | `emacs.nix` repoints `xdg.configFile."emacs/themes"` at the generated `out/emacs/` |
| VS Code | `mkOutOfStoreSymlink` into `~/.vscode/extensions/bytemancer` |
| Ghostty | generated `out/ghostty/bytemancer` symlinked into Ghostty's theme dir; `config` references it by name |

Dotfiles pins `bytemancer` as a flake input for reproducibility, with a local path override (`--override-input bytemancer path:~/repos/bytemancer`) so color iteration does not require commit → push → `nix flake update`.

### Verification

Visual review only. No equivalence harness, no completeness or contrast assertions.

**This is a conscious deviation** from the project's normal "tests exist and pass" bar, taken because a theme's feedback loop *is* visual and the artifact will be actively tuned for weeks. The accepted risk: a dropped Emacs face inherits from `default` rather than failing loudly, so a straggler in a rarely-opened mode (ediff, org-habit, helm) may go unnoticed for a long time.

**One exception:** `src/color.ts` gets unit tests. `alpha()` compositing is mechanical, not visual — a wrong result is a plausible-looking hex the eye will not catch.

The Q5 CI diff check is the only automated guard: CI runs the build and fails if the working tree is dirty, ensuring committed outputs always match their inputs.

## Implementation

### Phase 1: Scaffold and VS Code

- Rename repo `bytemancer-vscode` → `bytemancer`.
- Write `flavors/dark.toml` from the Emacs palette, applying the Q14 layer renames.
- Write `roles.toml` by extracting and merging both existing themes per the merge rule.
- Build `src/build.ts`, `src/color.ts` (+ unit tests), `src/types.ts`.
- Write `templates/vscode.ts`; generate `out/vscode/`.
- Symlink `out/vscode/` into `~/.vscode/extensions/bytemancer`; visually compare against the current theme.
- Add `npm run build` and the CI dirty-tree check.

**Decide during extraction:** the `syntax.doc` italic conflict; whether gutter and file-decoration share `git.modified`; whether to carry or drop the dead `red_bg3` / `green_bg3` entries (recommendation: drop, they are unreferenced); whether the `<color>_bg` / `_bg2` tint names deserve the same cleanup as the layer names (roles insulate templates from this, so it is low-stakes).

### Phase 2: Emacs

- Write `templates/emacs.ts`, including the Emacs-local `org.*` block and non-color attributes.
- Generate `out/emacs/bytemancer-theme.el`.
- **Repoint `emacs.nix:11-12` in the same change.** The current symlink targets the in-tree `themes/` directory; leaving it means editing a stale copy out of muscle memory and watching regeneration revert it.
- Delete the old hand-written `.el`.

### Phase 3: Ghostty

- Write `templates/ghostty.ts`; generate `out/ghostty/bytemancer`.
- Replace the inline `# Bytemancer theme` block in `ghostty/config` with a reference to the generated theme.
- Fixes the cursor drift (`#b0b0b0` → purple `#A485DD`) as a side effect.

### Phase 4+ (deferred, out of scope)

Marketplace and MELPA publishing; light flavor; additional surfaces (tmux, fish, delta, oh-my-posh); the neutral-vs-navy background hue question.

## File Changes Summary

### This repo (→ `bytemancer`)

| File | Change |
|---|---|
| `flavors/dark.toml` | new — palette |
| `roles.toml` | new — role map |
| `src/*.ts` | new — builder |
| `templates/*.ts` | new — three surface templates |
| `out/**` | new — committed generated output |
| `package.json` | moves to `out/vscode/package.json` (generated); root gains a build-tooling `package.json` |
| `themes/bytemancer-color-theme.json` | deleted; regenerated at `out/vscode/` |
| `README.md` | rewritten — no longer "ported from Emacs" |

### dotfiles

| File | Change |
|---|---|
| `flake.nix` | add `bytemancer` input |
| `modules/home/emacs/emacs.nix` | repoint theme symlink at flake input |
| `modules/home/emacs/themes/bytemancer-theme.el` | deleted |
| `modules/home/ghostty/config` | inline theme block → theme reference |
| `modules/home/vscode/vscode.nix` | add `mkOutOfStoreSymlink` for the theme extension |

### Unchanged

| File | Why |
|---|---|
| `modules/home/emacs/init.el` | loads the theme by name; name is stable |
| `modules/home/vscode/vscode.nix` extension list | Marketplace pins unaffected; theme installs by symlink |

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Dropped face/key during extraction goes unnoticed | High | Low | Accepted (Q15). Emacs faces inherit silently; fix as encountered. |
| Stale `emacs.nix` symlink → editing the wrong file | Medium | Medium | Repoint in the same commit as Phase 2; delete the old `.el` immediately. |
| Flake pin friction slows color iteration | Medium | Medium | Local path override documented in README. |
| `git.*` merge changes VS Code colors unexpectedly | High | Low | Documented above as intended; visually confirm in Phase 1. |
| Role namespace inflates toward 1:1 with VS Code keys | Medium | High | Hold the ~50–70 target; a single-surface role is a smell. |
| Fresh machine lacks the theme (no Marketplace pin) | Low | Low | Accepted for now; resolved by Phase 4 publishing. |
| Opacity remap visibly changes highlight colors | Low | Low | ~6 keys, near-imperceptible on `#191919`; revert individually if wrong. |

## Success Definition

- [ ] Repo renamed to `bytemancer`; palette and roles defined in `flavors/dark.toml` and `roles.toml`
- [ ] `npm run build` regenerates all three surfaces from those two files alone
- [ ] `src/color.ts` unit tests exist and pass
- [ ] CI fails when committed output does not match regenerated output
- [ ] `fg` is `#bfc2cc` on all three surfaces
- [ ] Cursor is `#A485DD` on all three surfaces
- [ ] Commit `c568114`'s decisions survive (cyan tag attributes, foreground enums)
- [ ] Layer names are `base` / `raised` / `overlay` / `selection` throughout
- [ ] No raw alpha literals in any template — only `opacity.*` names
- [ ] `org.*` appears in the Emacs template, not in `roles.toml`
- [ ] No hand-maintained Bytemancer colors remain in dotfiles
- [ ] Role count is within ~50–70
- [ ] All three surfaces visually reviewed against their predecessors

## Related Documents

None yet. Publishing (Marketplace + MELPA) will warrant its own spec.

## Appendix: Deliberation Record

| # | Decision | Choice |
|---|---|---|
| Q1 | Repo topology | Rename this repo → `bytemancer`; dotfiles consumes as flake input |
| Q2 | Framework | Bespoke; borrow Whiskers' shape, reject base16 (fixed slot semantics conflict with strings=yellow) |
| Q3 | Abstraction | Palette + semantic roles, two layers |
| Q4 | Language | Node/TypeScript |
| Q5 | Artifacts | Committed; CI fails on nonempty regen diff |
| Q6 | Truth scope | Palette hexes from Emacs; roles merge with VS Code filling gaps |
| Q7 | Role naming | Neutral flat namespace, ~50–70 roles; IR owns decisions, templates own fan-out |
| Q8 | Alpha | Opaque in IR; VS Code template calls `alpha()` |
| Q9 | Delivery | Flake input + local path override for dev |
| Q10 | Markup | Separate namespaces; `markdown.*` in IR, `org.*` template-local |
| Q11 | Style vocabulary | Color + bold/italic/underline only |
| Q12 | Alpha ladder | Named `opacity.*` roles on a fixed ladder |
| Q13 | VS Code install | `mkOutOfStoreSymlink`; publishing deferred |
| Q14 | Layer naming | `base` / `raised` / `overlay` / `selection` |
| Q15 | Verification | Visual review only |
| Q16 | Build invariants | Regen diff check only |

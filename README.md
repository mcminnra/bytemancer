# Bytemancer

A dark theme custom tailored to mancing bytes, generated for VS Code, Emacs, and
Ghostty from a single source of truth.

The palette and its semantic role map are each defined exactly once; a small
TypeScript builder fans them out into each surface's native format. Changing a
color is one edit to one file — `npm run build` regenerates every surface, and the
resulting git diff is the review surface.

## Layout

```
theme/              the definition (source of truth)
  flavors/dark.toml   palette: name -> hex  (per flavor)
  roles.toml          role -> palette name (+ optional style) + opacity ladder
src/                builder (build.ts, color.ts [unit tested], types.ts)
templates/          one render function per surface (vscode, emacs, ghostty)
ports/              committed generated output (one installable theme per surface)
```

`roles.toml` owns the decisions ("a keyword is red"); each template owns the
fan-out to native keys (one `ui.bg.selection` role feeds many VS Code keys and
several Emacs faces). Alpha lives only in the VS Code template, via a named
`opacity.*` ladder — templates never write raw alpha numbers.

## Build

```
npm install
npm run build   # regenerate ports/
npm test        # unit tests for src/color.ts
npm run check   # type-check
```

Outputs in `out/` are committed; CI fails if a rebuild leaves the tree dirty.

## Palette

| Color  | Hex       | Usage                          |
|--------|-----------|--------------------------------|
| Red    | `#EE6D85` | Keywords, operators, errors    |
| Orange | `#F6955B` | Constants, decorators, escapes |
| Yellow | `#D7A65F` | Strings, docs, search, modified|
| Green  | `#95C561` | Functions, added               |
| Blue   | `#7199EE` | Types, info                    |
| Cyan   | `#38A89D` | Links, namespaces, attributes  |
| Purple | `#A485DD` | Numbers, built-ins, cursor     |

## Consuming the output

| Surface | Mechanism |
|---|---|
| VS Code | symlink `ports/vscode/` into `~/.vscode/extensions/bytemancer` |
| Emacs   | point `custom-theme-load-path` at `ports/emacs/`, then `load-theme 'bytemancer` |
| Ghostty | symlink `ports/ghostty/bytemancer` into Ghostty's theme dir; reference it by name |

For local color iteration from dotfiles, pin this repo as a flake input with a
local path override so changes don't require commit → push → `nix flake update`.

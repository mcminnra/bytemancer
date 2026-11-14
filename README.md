# Bytemancer

A dark theme custom tailored to mancing bytes

## Layout

```
theme/                  theme definition (source of truth)
  palettes/base.toml      palette: token -> hex
  roles.toml              role -> palette token (+ optional style) + opacity ladder
src/bytemancer/         generator
  model.py                Theme, the shared object every surface reads
  load.py                 TOML -> validated Theme
  surfaces/               one render function per surface
ports/                  generated output
```

Outputs generated into `ports/` are committed.

## Build

Tools are pinned with [mise](https://mise.jdx.dev). Python dependencies are managed by uv.

```
mise install        # python + uv
mise run build      # regenerate ports/
mise run fmt        # format and apply safe lint fixes
mise run ci         # lint, typecheck, test, and check ports/ is up to date
mise run preview    # print ANSI swatches for the palette
```

# Bytemancer

A dark theme custom tailored to mancing bytes

## Layout

```
theme/              theme definition (source of truth for templates)
  flavors/dark.toml   palette: name -> hex  (per flavor)
  roles.toml          role -> palette name (+ optional style) + opacity ladder
src/                builder
templates/          one render function per surface
ports/              generated output
```

Outputs generated into `ports/` are committed.

## Build

```
npm install
npm run build   # regenerate ports/
npm test
npm run check
```

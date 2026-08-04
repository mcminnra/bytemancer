// Shared types for the Bytemancer builder

export type Palette = Record<string, string>;

export interface StyleFlags {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// A role as authored in roles.toml: `color`/`bg` are palette names.
export interface RawRole extends StyleFlags {
  color: string;
  bg?: string;
}

// A role after resolution: `color`/`bg` are hex strings.
export interface Role extends StyleFlags {
  color: string;
  bg?: string;
}

export type RawRoles = Record<string, RawRole>;
export type Roles = Record<string, Role>;

export interface Opacity {
  subtle: number;
  muted: number;
  strong: number;
}

export interface BuildContext {
  palette: Palette;
  roles: Roles; // resolved to hex
  rawRoles: RawRoles; // palette-name references
  opacity: Opacity;
}

export interface OutputFile {
  path: string; // relative to ports/
  content: string;
}

export interface Template {
  render(ctx: BuildContext): OutputFile[];
}

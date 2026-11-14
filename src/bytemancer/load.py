"""Read the TOML theme definition and resolve it into a `Theme`."""

import tomllib
from pathlib import Path

from pydantic import BaseModel

from bytemancer.color import Hex
from bytemancer.model import Opacity, Role, Swatch, Theme

ROOT = Path(__file__).resolve().parents[2]


class PaletteFile(BaseModel, extra="forbid", frozen=True):
    """The tokens every palette file must define, each a `#RRGGBB` color.

    Field order is the order generators see, whatever the file's order.
    """

    base: Hex
    raised: Hex
    overlay: Hex
    selection: Hex
    fg: Hex
    fg_bright: Hex
    fg_muted: Hex
    red: Hex
    orange: Hex
    yellow: Hex
    green: Hex
    blue: Hex
    cyan: Hex
    purple: Hex
    red_bright: Hex
    yellow_bright: Hex
    green_bright: Hex
    blue_bright: Hex
    cyan_bright: Hex
    purple_bright: Hex
    red_bg: Hex
    red_bg2: Hex
    yellow_bg: Hex
    yellow_bg2: Hex
    green_bg: Hex
    green_bg2: Hex
    blue_bg: Hex
    blue_bg2: Hex
    cyan_bg: Hex
    cyan_bg2: Hex
    purple_bg: Hex
    purple_bg2: Hex
    accent_hover: Hex
    black: Hex


class RoleDef(BaseModel, extra="forbid", frozen=True):
    """A role as authored in roles.toml, where `color` and `bg` are palette tokens."""

    color: str
    bg: str | None = None
    bold: bool = False
    italic: bool = False
    underline: bool = False


class RolesFile(BaseModel, frozen=True):
    """The shape of roles.toml."""

    opacity: Opacity
    roles: dict[str, RoleDef]


def resolve_roles(defs: dict[str, RoleDef], palette: dict[str, Swatch]) -> dict[str, Role]:
    """Resolve each role's palette-token references to swatches.

    Args:
        defs: Role name -> authored definition.
        palette: Palette token -> swatch.

    Returns:
        Role name -> resolved role, in authored order.

    Raises:
        ValueError: If a role names a token the palette does not define.
    """

    def swatch(role: str, field: str, token: str) -> Swatch:
        if token not in palette:
            raise ValueError(f'role {role}: unknown palette {field} "{token}"')
        return palette[token]

    return {
        name: Role(
            fg=swatch(name, "color", d.color),
            bg=None if d.bg is None else swatch(name, "bg", d.bg),
            bold=d.bold,
            italic=d.italic,
            underline=d.underline,
        )
        for name, d in defs.items()
    }


def load_theme(palette: str = "base", theme_dir: Path = ROOT / "theme") -> Theme:
    """Read and validate one palette plus the shared role map.

    Args:
        palette: Palette name, the stem of a file in `palettes/`.
        theme_dir: Directory holding `palettes/` and `roles.toml`.

    Returns:
        The resolved theme.

    Raises:
        pydantic.ValidationError: If either TOML file does not match its schema.
        ValueError: If a role names a token the palette does not define.
    """
    with (theme_dir / "palettes" / f"{palette}.toml").open("rb") as f:
        tokens = PaletteFile.model_validate(tomllib.load(f))
    with (theme_dir / "roles.toml").open("rb") as f:
        roles_file = RolesFile.model_validate(tomllib.load(f))

    swatches = {name: Swatch(name=name, hex=value) for name, value in tokens.model_dump().items()}
    return Theme(
        name=palette,
        palette=swatches,
        roles=resolve_roles(roles_file.roles, swatches),
        opacity=roles_file.opacity,
    )

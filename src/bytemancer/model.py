"""Theme primitives: the shared object every surface generator reads."""

from dataclasses import dataclass
from typing import Literal

from pydantic import BaseModel, Field

from bytemancer.color import Hex, alpha

Level = Literal["subtle", "muted", "strong"]


class Swatch(BaseModel, frozen=True):
    """A palette token resolved to its color.

    Attributes:
        name: The palette token, e.g. `purple`.
        hex: The token's `#RRGGBB` value.
    """

    name: str
    hex: Hex


class Role(BaseModel, frozen=True):
    """A usage (e.g. `syntax.keyword`) resolved to palette swatches and style.

    Attributes:
        fg: Foreground swatch.
        bg: Background swatch, for the few roles that define one.
        bold: Render in bold.
        italic: Render in italics.
        underline: Render underlined.
    """

    fg: Swatch
    bg: Swatch | None = None
    bold: bool = False
    italic: bool = False
    underline: bool = False


class Opacity(BaseModel, frozen=True):
    """Named opacity levels, each a fraction in [0, 1]."""

    subtle: float = Field(ge=0, le=1)
    muted: float = Field(ge=0, le=1)
    strong: float = Field(ge=0, le=1)


class Theme(BaseModel, frozen=True):
    """One palette plus the shared role map, ready for generators.

    Generators use roles where surfaces should agree, and may read palette
    tokens directly for anything only that surface needs.

    Attributes:
        name: The palette name, e.g. `base`.
        palette: Palette token -> swatch, in schema order.
        roles: Role name -> resolved role.
        opacity: The named opacity levels.
    """

    name: str
    palette: dict[str, Swatch]
    roles: dict[str, Role]
    opacity: Opacity

    def role(self, name: str) -> Role:
        """Look up a role.

        Raises:
            KeyError: If no role has that name.
        """
        if name not in self.roles:
            raise KeyError(f"unknown role: {name}")
        return self.roles[name]

    def token(self, name: str) -> Swatch:
        """Look up a palette token.

        Raises:
            KeyError: If the palette has no such token.
        """
        if name not in self.palette:
            raise KeyError(f"unknown palette token: {name}")
        return self.palette[name]

    def fg(self, role: str) -> str:
        """Return the hex of a role's foreground."""
        return self.role(role).fg.hex

    def bg(self, role: str) -> str:
        """Return the hex of a role's background.

        Raises:
            ValueError: If the role defines no background.
        """
        swatch = self.role(role).bg
        if swatch is None:
            raise ValueError(f"role {role} has no bg")
        return swatch.hex

    def fade(self, hex_color: str, level: Level) -> str:
        """Apply a named opacity level to a `#RRGGBB` color, giving `#RRGGBBAA`."""
        return alpha(hex_color, getattr(self.opacity, level))


@dataclass(frozen=True)
class OutputFile:
    """A generated file.

    Attributes:
        path: Destination relative to `ports/`.
        content: Full file content.
    """

    path: str
    content: str

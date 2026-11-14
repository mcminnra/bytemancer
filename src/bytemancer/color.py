"""Color helpers shared by the loader and the surface generators."""

import math
import re
from typing import Annotated, NamedTuple

from pydantic import StringConstraints

HEX_PATTERN = r"^#[0-9a-fA-F]{6}$"
HEX_RE = re.compile(HEX_PATTERN)

# A `#RRGGBB` string, validated wherever pydantic sees it.
Hex = Annotated[str, StringConstraints(pattern=HEX_PATTERN)]


class Rgb(NamedTuple):
    """8-bit red/green/blue channels."""

    r: int
    g: int
    b: int


def parse_hex(hex_color: str) -> Rgb:
    """Split a `#RRGGBB` string into its 8-bit channels.

    Args:
        hex_color: A 6-digit, `#`-prefixed hex color.

    Returns:
        The red, green, and blue channels.

    Raises:
        ValueError: If `hex_color` is not a `#RRGGBB` string.
    """
    if not HEX_RE.match(hex_color):
        raise ValueError(f"invalid hex color: {hex_color}")
    n = int(hex_color[1:], 16)
    return Rgb((n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF)


def alpha(hex_color: str, a: float) -> str:
    """Append an 8-bit alpha channel to a `#RRGGBB` color, giving `#RRGGBBAA`.

    The base color's case is preserved.

    Args:
        hex_color: A 6-digit, `#`-prefixed hex color without alpha.
        a: Opacity fraction in [0, 1], rounded to the nearest byte.

    Returns:
        The color with a two-digit lowercase alpha suffix.

    Raises:
        ValueError: If `hex_color` is not `#RRGGBB`, or `a` is outside [0, 1].
    """
    if not HEX_RE.match(hex_color):
        raise ValueError(f"invalid hex color: {hex_color}")
    if math.isnan(a) or a < 0 or a > 1:
        raise ValueError(f"alpha out of range: {a}")
    # NOTE(agent): half rounds up, since round() would round half to even
    byte = math.floor(a * 255 + 0.5)
    return f"{hex_color}{byte:02x}"

"""Print the palette's ANSI colors as truecolor terminal swatches."""

from bytemancer.color import parse_hex
from bytemancer.load import load_theme
from bytemancer.model import Theme

ANSI_NAMES = ("black", "red", "green", "yellow", "blue", "magenta", "cyan", "white")


def swatch(hex_color: str | None) -> str:
    """Return a colored block followed by its hex, or a dash when there is no color."""
    if hex_color is None:
        return "—".ljust(10)
    r, g, b = parse_hex(hex_color)
    return f"\x1b[48;2;{r};{g};{b}m  \x1b[0m {hex_color}"


def rows(theme: Theme) -> list[str]:
    """Build one line per ANSI color: its bg2 and bg tints, then normal and bright.

    Tints come from the `<token>_bg2` and `<token>_bg` palette tokens when the
    normal color's token has them.
    """

    def tint(token: str, suffix: str) -> str | None:
        found = theme.palette.get(f"{token}{suffix}")
        return found.hex if found else None

    lines = []
    for name in ANSI_NAMES:
        normal = theme.role(f"ansi.{name}").fg
        bright = theme.role(f"ansi.bright.{name}").fg
        lines.append(
            f"{name:<8} bg2 {swatch(tint(normal.name, '_bg2'))}"
            f"  bg {swatch(tint(normal.name, '_bg'))}"
            f"  normal {swatch(normal.hex)}  bright {swatch(bright.hex)}"
        )
    return lines


def main() -> None:
    """Print the swatch table."""
    print("\n".join(rows(load_theme())))


if __name__ == "__main__":
    main()

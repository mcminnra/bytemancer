"""Ghostty surface: background, foreground, cursor, and the 16 ANSI palette entries."""

from bytemancer.model import OutputFile, Theme

# ANSI slot -> role
ANSI: tuple[str, ...] = (
    "ansi.black",
    "ansi.red",
    "ansi.green",
    "ansi.yellow",
    "ansi.blue",
    "ansi.magenta",
    "ansi.cyan",
    "ansi.white",
    "ansi.bright.black",
    "ansi.bright.red",
    "ansi.bright.green",
    "ansi.bright.yellow",
    "ansi.bright.blue",
    "ansi.bright.magenta",
    "ansi.bright.cyan",
    "ansi.bright.white",
)


def render(theme: Theme) -> list[OutputFile]:
    """Render the Ghostty theme file."""
    c = theme.fg
    lines = [
        "# Bytemancer theme -- GENERATED, do not edit",
        f"background = {c('ui.bg.base')}",
        f"foreground = {c('ui.fg')}",
        f"cursor-color = {c('ui.fg')}",
        f"cursor-text = {c('ui.bg.base')}",
        *(f"palette = {i}={c(role)}" for i, role in enumerate(ANSI)),
        "",
    ]
    return [OutputFile("ghostty/bytemancer", "\n".join(lines))]

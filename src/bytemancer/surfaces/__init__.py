"""Surface generators: each turns a `Theme` into that surface's config files."""

from collections.abc import Callable

from bytemancer.model import OutputFile, Theme
from bytemancer.surfaces import emacs, ghostty, vscode, zed

Surface = Callable[[Theme], list[OutputFile]]

SURFACES: tuple[Surface, ...] = (vscode.render, emacs.render, ghostty.render, zed.render)

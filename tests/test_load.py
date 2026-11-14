import shutil
from pathlib import Path

import pytest
from pydantic import ValidationError

from bytemancer.load import ROOT, load_theme


@pytest.fixture
def theme_dir(tmp_path: Path) -> Path:
    """A writable copy of the real theme directory."""
    dest = tmp_path / "theme"
    shutil.copytree(ROOT / "theme", dest)
    return dest


def edit(path: Path, old: str, new: str) -> None:
    text = path.read_text()
    assert old in text
    path.write_text(text.replace(old, new, 1))


def test_loads_real_theme() -> None:
    theme = load_theme()
    assert theme.name == "base"
    assert theme.token("purple").hex == "#A485DD"
    # A resolved role keeps both the token name and its hex
    cursor = theme.role("ui.cursor")
    assert (cursor.fg.name, cursor.fg.hex) == ("purple", "#A485DD")
    assert theme.bg("ui.search.current") == theme.token("yellow_bg").hex


def test_unknown_role_and_token_fail_by_name() -> None:
    theme = load_theme()
    with pytest.raises(KeyError, match="syntax.keywrd"):
        theme.role("syntax.keywrd")
    with pytest.raises(KeyError, match="redd"):
        theme.token("redd")
    with pytest.raises(ValueError, match="has no bg"):
        theme.bg("ui.fg")


def test_rejects_malformed_hex(theme_dir: Path) -> None:
    edit(theme_dir / "palettes/base.toml", '"#EE6D85"', '"#EE6D8"')
    with pytest.raises(ValidationError, match="red"):
        load_theme(theme_dir=theme_dir)


def test_rejects_missing_palette_token(theme_dir: Path) -> None:
    edit(theme_dir / "palettes/base.toml", "orange = ", "orangee = ")
    with pytest.raises(ValidationError) as err:
        load_theme(theme_dir=theme_dir)
    # Both the missing token and the unexpected one are reported
    assert {e["loc"] for e in err.value.errors()} == {("orange",), ("orangee",)}


def test_rejects_unknown_style_flag(theme_dir: Path) -> None:
    edit(theme_dir / "roles.toml", "italic = true", "itali = true")
    with pytest.raises(ValidationError, match="itali"):
        load_theme(theme_dir=theme_dir)


def test_rejects_unknown_palette_reference(theme_dir: Path) -> None:
    edit(theme_dir / "roles.toml", '{ color = "red" }', '{ color = "crimson" }')
    with pytest.raises(ValueError, match='unknown palette color "crimson"'):
        load_theme(theme_dir=theme_dir)


def test_rejects_opacity_out_of_range(theme_dir: Path) -> None:
    edit(theme_dir / "roles.toml", "subtle = 0.2", "subtle = 1.2")
    with pytest.raises(ValidationError, match="subtle"):
        load_theme(theme_dir=theme_dir)

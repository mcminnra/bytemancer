import math

import pytest

from bytemancer.color import Rgb, alpha, parse_hex


@pytest.mark.parametrize(
    ("hex_color", "a", "expected"),
    [
        # The three named opacity levels
        ("#2b2d45", 0.2, "#2b2d4533"),
        ("#191919", 0.4, "#19191966"),
        ("#2b2d45", 0.6, "#2b2d4599"),
        # Ends of the range
        ("#000000", 0, "#00000000"),
        ("#ffffff", 1, "#ffffffff"),
        # 0.5 * 255 = 127.5 -> 128 -> 0x80
        ("#123456", 0.5, "#12345680"),
        # 0.3 * 255 = 76.5 -> 77 -> 0x4d. round() would give 76 (half to even).
        ("#123456", 0.3, "#1234564d"),
        # The base color's case is preserved
        ("#A485DD", 0.2, "#A485DD33"),
    ],
)
def test_alpha(hex_color: str, a: float, expected: str) -> None:
    assert alpha(hex_color, a) == expected


@pytest.mark.parametrize("hex_color", ["A485DD", "#A485DD33"])
def test_alpha_rejects_bad_hex(hex_color: str) -> None:
    with pytest.raises(ValueError, match="invalid hex"):
        alpha(hex_color, 0.2)


@pytest.mark.parametrize("a", [2, -0.1, math.nan])
def test_alpha_rejects_out_of_range(a: float) -> None:
    with pytest.raises(ValueError, match="out of range"):
        alpha("#000000", a)


def test_parse_hex_splits_channels() -> None:
    assert parse_hex("#A485DD") == Rgb(0xA4, 0x85, 0xDD)


@pytest.mark.parametrize("hex_color", ["#zzz", "#fff"])
def test_parse_hex_rejects_malformed(hex_color: str) -> None:
    with pytest.raises(ValueError, match="invalid hex"):
        parse_hex(hex_color)

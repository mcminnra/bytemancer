"""Entry point: load the theme and render every surface into ports/.

Outputs are committed, and CI fails when they no longer match their inputs.
"""

from bytemancer.load import ROOT, load_theme
from bytemancer.surfaces import SURFACES


def main() -> None:
    """Regenerate every file under ports/."""
    theme = load_theme()
    out_dir = ROOT / "ports"

    count = 0
    for render in SURFACES:
        for file in render(theme):
            dest = out_dir / file.path
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(file.content, encoding="utf-8", newline="\n")
            count += 1

    print(f"build complete: {count} files, {len(theme.roles)} roles")


if __name__ == "__main__":
    main()

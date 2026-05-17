from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"


@dataclass(frozen=True)
class OptimizeRule:
    label: str
    path: Path
    max_width: int | None
    max_height: int | None
    colors: int


RULES: tuple[OptimizeRule, ...] = (
    OptimizeRule(
        "battle backgrounds",
        ASSETS / "world" / "battle-backgrounds",
        540,
        960,
        192,
    ),
    OptimizeRule(
        "monster illustrations",
        ASSETS / "illustrations" / "monsters",
        512,
        512,
        192,
    ),
    OptimizeRule(
        "dialogue character portraits",
        ASSETS / "dialogue" / "characters",
        512,
        512,
        256,
    ),
    OptimizeRule(
        "dialogue npc portraits",
        ASSETS / "dialogue" / "npcs",
        512,
        512,
        256,
    ),
    OptimizeRule(
        "dialogue enemy portraits",
        ASSETS / "dialogue" / "enemies",
        512,
        512,
        256,
    ),
    OptimizeRule(
        "dialogue event portraits",
        ASSETS / "dialogue" / "events",
        640,
        640,
        256,
    ),
    OptimizeRule(
        "world map scenes",
        ASSETS / "world" / "world-map",
        540,
        960,
        192,
    ),
    OptimizeRule(
        "palace scene plates",
        ASSETS / "world" / "palace",
        720,
        1080,
        256,
    ),
    OptimizeRule(
        "gacha item art",
        ASSETS / "ui" / "gacha" / "items",
        512,
        768,
        256,
    ),
    OptimizeRule(
        "storage item art",
        ASSETS / "ui" / "storage" / "items",
        512,
        512,
        256,
    ),
    OptimizeRule(
        "gacha card surfaces",
        ASSETS / "ui" / "gacha",
        384,
        700,
        256,
    ),
)


def iter_pngs(path: Path) -> Iterable[Path]:
    if not path.exists():
        return ()
    return tuple(sorted(p for p in path.glob("*.png") if p.is_file()))


def resize_to_fit(image: Image.Image, max_width: int | None, max_height: int | None) -> Image.Image:
    if max_width is None or max_height is None:
        return image
    width, height = image.size
    scale = min(max_width / width, max_height / height, 1.0)
    if scale >= 0.999:
        return image
    size = (max(1, round(width * scale)), max(1, round(height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def quantize_for_png(image: Image.Image, colors: int) -> Image.Image:
    if image.mode in ("RGBA", "LA") or "transparency" in image.info:
        return image.convert("RGBA").quantize(colors=colors, method=Image.Quantize.FASTOCTREE)
    return image.convert("RGB").quantize(colors=colors, method=Image.Quantize.MEDIANCUT)


def optimize_png(path: Path, rule: OptimizeRule) -> tuple[int, int, bool]:
    before = path.stat().st_size
    with Image.open(path) as source:
        source.load()
        image = source.copy()
        temp = path.with_suffix(path.suffix + ".tmp")
        temp.unlink(missing_ok=True)
        image = resize_to_fit(image, rule.max_width, rule.max_height)
        image = quantize_for_png(image, rule.colors)
        image.save(temp, format="PNG", optimize=True, compress_level=9)

    after = temp.stat().st_size
    if after < before:
        try:
            temp.replace(path)
        except PermissionError:
            path.unlink()
            temp.replace(path)
        return before, after, True
    temp.unlink(missing_ok=True)
    return before, before, False


def main() -> None:
    total_before = 0
    total_after = 0
    total_changed = 0

    for rule in RULES:
        rule_before = 0
        rule_after = 0
        rule_changed = 0
        files = iter_pngs(rule.path)
        for path in files:
            before, after, changed = optimize_png(path, rule)
            rule_before += before
            rule_after += after
            if changed:
                rule_changed += 1
        total_before += rule_before
        total_after += rule_after
        total_changed += rule_changed
        saved_mb = (rule_before - rule_after) / (1024 * 1024)
        print(
            f"{rule.label}: {rule_changed}/{len(files)} files, "
            f"saved {saved_mb:.2f} MB"
        )

    print(
        "total: "
        f"{total_changed} files changed, "
        f"saved {(total_before - total_after) / (1024 * 1024):.2f} MB"
    )


if __name__ == "__main__":
    main()

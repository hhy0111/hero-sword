from __future__ import annotations

import json
from collections import deque
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "image"
OUTPUT_BASE = ROOT / "public" / "assets" / "dialogue"
OUTPUT_DIRS = {
    "character": OUTPUT_BASE / "characters",
    "npc": OUTPUT_BASE / "npcs",
    "enemy": OUTPUT_BASE / "enemies",
}
REPORT_PATH = ROOT / "output" / "dialogue-portrait-generation-report.json"
REVIEW_SHEET_PATH = ROOT / "output" / "dialogue-portrait-review-sheet.png"

CANVAS_SIZE = 512
MAX_RENDER_SIZE = 436
BOTTOM_MARGIN = 18
ALPHA_THRESHOLD = 18
REMBG_MAX_SIDE = 768


@dataclass(frozen=True)
class PortraitSpec:
    category: str
    subject_id: str
    source_name: str
    output_name: str


PORTRAIT_SPECS: tuple[PortraitSpec, ...] = (
    PortraitSpec("character", "hero", "01-kain.png", "hero.png"),
    PortraitSpec("character", "bram", "02-bram.png", "bram.png"),
    PortraitSpec("character", "sera", "03-sera.png", "sera.png"),
    PortraitSpec("character", "luna", "04-luna.png", "luna.png"),
    PortraitSpec("character", "ria", "05-ria.png", "ria.png"),
    PortraitSpec("character", "theo", "06-theo.png", "theo.png"),
    PortraitSpec("character", "dorgan", "07-dorgan.png", "dorgan.png"),
    PortraitSpec("character", "kiera", "08-kiera.png", "kiera.png"),
    PortraitSpec("character", "helma", "09-helma.png", "helma.png"),
    PortraitSpec("character", "marin", "10-marin.png", "marin.png"),
    PortraitSpec("character", "serena", "11-serena.png", "serena.png"),
    PortraitSpec("character", "fin", "12-fin.png", "fin.png"),
    PortraitSpec("character", "iris", "13-iris.png", "iris.png"),
    PortraitSpec("character", "wolf", "14-wolf.png", "wolf.png"),
    PortraitSpec("character", "erin", "15-erin.png", "erin.png"),
    PortraitSpec("character", "nazir", "16-nazir.png", "nazir.png"),
    PortraitSpec("character", "laila", "17-laila.png", "laila.png"),
    PortraitSpec("character", "hakan", "18-hakan.png", "hakan.png"),
    PortraitSpec("character", "seraphin", "19-seraphin.png", "seraphin.png"),
    PortraitSpec("character", "micaela", "20-micaela.png", "micaela.png"),
    PortraitSpec("character", "lucian", "21-lucian.png", "lucian.png"),
    PortraitSpec("npc", "orin", "22-orin.png", "orin.png"),
    PortraitSpec("npc", "marta", "23-marta.png", "marta.png"),
    PortraitSpec("npc", "neri", "24-neri.png", "neri.png"),
    PortraitSpec("npc", "torren", "25-torren.png", "torren.png"),
    PortraitSpec("npc", "seline", "26-seline.png", "seline.png"),
    PortraitSpec("npc", "guard_east", "27-the-east-gate-guard-of-lumen-village.png", "guard_east.png"),
    PortraitSpec("npc", "villager_plaza", "28-a-plaza-villager-of-lumen-village.png", "villager_plaza.png"),
    PortraitSpec("npc", "runner_lane", "29-the-courier-of-lumen-village.png", "runner_lane.png"),
    PortraitSpec("npc", "child_south", "30-a-young-resident-of-lumen-village.png", "child_south.png"),
    PortraitSpec("npc", "weapon_merchant", "31-the-general-weapon-merchant-used-in-town-shop-dialogue-scenes.png", "weapon_merchant.png"),
    PortraitSpec("npc", "armor_merchant", "32-the-general-armor-merchant-used-in-town-shop-dialogue-scenes.png", "armor_merchant.png"),
    PortraitSpec("npc", "item_merchant", "33-the-general-item-merchant-used-in-town-shop-dialogue-scenes.png", "item_merchant.png"),
    PortraitSpec("npc", "relic_merchant", "34-the-general-relic-merchant-used-in-town-shop-dialogue-scenes.png", "relic_merchant.png"),
    PortraitSpec("npc", "blacksmith", "35-the-blacksmith-used-in-forge-dialogue-scenes.png", "blacksmith.png"),
    PortraitSpec("enemy", "greenhaven_fragment_lord", "36-the-greenhaven-fragment-lord.png", "greenhaven_fragment_lord.png"),
    PortraitSpec("enemy", "ironreach_rebel_captain", "37-the-ironreach-rebel-captain.png", "ironreach_rebel_captain.png"),
    PortraitSpec("enemy", "blueharbor_tide_cult_guardian", "38-the-blueharbor-tide-cult-guardian.png", "blueharbor_tide_cult_guardian.png"),
    PortraitSpec("enemy", "frost_grave_commander", "39-the-frost-grave-commander.png", "frost_grave_commander.png"),
    PortraitSpec("enemy", "solkazar_relic_tyrant", "40-the-solkazar-relic-tyrant.png", "solkazar_relic_tyrant.png"),
    PortraitSpec("enemy", "black_moon_inquisitor", "41-the-black-moon-inquisitor.png", "black_moon_inquisitor.png"),
    PortraitSpec("enemy", "black_gate_warlord", "42-the-black-gate-warlord.png", "black_gate_warlord.png"),
)


def has_meaningful_alpha(image: Image.Image) -> bool:
    alpha = np.array(image.getchannel("A"))
    transparent_ratio = float(np.count_nonzero(alpha < 250)) / float(alpha.size)
    return transparent_ratio >= 0.03


def keep_largest_alpha_component(image: Image.Image) -> Image.Image:
    alpha = np.array(image.getchannel("A"))
    mask = alpha > ALPHA_THRESHOLD
    coords = np.argwhere(mask)
    if coords.size == 0:
      return image

    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0) + 1
    submask = mask[y0:y1, x0:x1]
    visited = np.zeros(submask.shape, dtype=bool)

    best_component: list[tuple[int, int]] = []
    height, width = submask.shape

    for row in range(height):
        for col in range(width):
            if not submask[row, col] or visited[row, col]:
                continue

            queue: deque[tuple[int, int]] = deque([(row, col)])
            visited[row, col] = True
            component: list[tuple[int, int]] = []

            while queue:
                y, x = queue.popleft()
                component.append((y, x))

                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < height and 0 <= nx < width and submask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((ny, nx))

            if len(component) > len(best_component):
                best_component = component

    cleaned_alpha = np.zeros_like(alpha)
    for row, col in best_component:
        cleaned_alpha[y0 + row, x0 + col] = alpha[y0 + row, x0 + col]

    result = image.copy()
    result.putalpha(Image.fromarray(cleaned_alpha, mode="L"))
    return result


def crop_with_padding(image: Image.Image) -> Image.Image:
    bbox = image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    pad_x = max(16, int((right - left) * 0.08))
    pad_top = max(18, int((bottom - top) * 0.09))
    pad_bottom = max(14, int((bottom - top) * 0.05))

    crop_box = (
        max(0, left - pad_x),
        max(0, top - pad_top),
        min(image.width, right + pad_x),
        min(image.height, bottom + pad_bottom),
    )
    return image.crop(crop_box)


def fit_on_canvas(image: Image.Image) -> Image.Image:
    scale = min(MAX_RENDER_SIZE / image.width, MAX_RENDER_SIZE / image.height, 1.0)
    target_size = (
        max(1, int(round(image.width * scale))),
        max(1, int(round(image.height * scale))),
    )
    resized = image.resize(target_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    paste_x = (CANVAS_SIZE - resized.width) // 2
    paste_y = CANVAS_SIZE - resized.height - BOTTOM_MARGIN
    canvas.alpha_composite(resized, (paste_x, paste_y))
    return canvas


def process_portrait(session, source: Image.Image) -> Image.Image:
    if has_meaningful_alpha(source):
        cutout = source.copy()
    else:
        rembg_input = source.copy()
        if max(rembg_input.width, rembg_input.height) > REMBG_MAX_SIDE:
            scale = REMBG_MAX_SIDE / max(rembg_input.width, rembg_input.height)
            rembg_input = rembg_input.resize(
                (
                    max(1, int(round(rembg_input.width * scale))),
                    max(1, int(round(rembg_input.height * scale))),
                ),
                Image.Resampling.LANCZOS,
            )
        cutout = remove(rembg_input, session=session).convert("RGBA")

    cutout = keep_largest_alpha_component(cutout)
    cutout = crop_with_padding(cutout)
    return fit_on_canvas(cutout)


def alpha_bounds(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()


def build_review_sheet(entries: list[tuple[PortraitSpec, Path]]) -> None:
    cols = 6
    cell = 164
    label_band = 28
    rows = (len(entries) + cols - 1) // cols
    canvas = Image.new("RGBA", (cols * cell, rows * (cell + label_band)), (20, 20, 22, 255))
    checker_a = (58, 58, 60, 255)
    checker_b = (92, 92, 96, 255)

    for index, (spec, image_path) in enumerate(entries):
        row = index // cols
        col = index % cols
        x = col * cell
        y = row * (cell + label_band)
        tile = Image.new("RGBA", (cell, cell), checker_a)
        for cy in range(0, cell, 24):
            for cx in range(0, cell, 24):
                if ((cx // 24) + (cy // 24)) % 2 == 0:
                    for sy in range(cy, min(cy + 24, cell)):
                        for sx in range(cx, min(cx + 24, cell)):
                            tile.putpixel((sx, sy), checker_b)

        portrait = Image.open(image_path).convert("RGBA")
        thumb = portrait.resize((cell, cell), Image.Resampling.LANCZOS)
        tile.alpha_composite(thumb, (0, 0))
        canvas.alpha_composite(tile, (x, y))

    REVIEW_SHEET_PATH.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(REVIEW_SHEET_PATH)


def main() -> None:
    for output_dir in OUTPUT_DIRS.values():
        output_dir.mkdir(parents=True, exist_ok=True)

    session = new_session("u2netp")
    report_rows: list[dict[str, object]] = []
    review_entries: list[tuple[PortraitSpec, Path]] = []

    for spec in PORTRAIT_SPECS:
        source_path = IMAGE_DIR / spec.source_name
        if not source_path.exists():
            raise FileNotFoundError(f"Missing portrait source: {source_path}")

        source_image = Image.open(source_path).convert("RGBA")
        result = process_portrait(session, source_image)
        output_path = OUTPUT_DIRS[spec.category] / spec.output_name
        result.save(output_path)
        review_entries.append((spec, output_path))

        bbox = alpha_bounds(result)
        report_rows.append(
            {
                "category": spec.category,
                "subjectId": spec.subject_id,
                "source": str(source_path.relative_to(ROOT)),
                "output": str(output_path.relative_to(ROOT)),
                "size": [result.width, result.height],
                "alphaBounds": list(bbox) if bbox else None,
            }
        )

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    build_review_sheet(review_entries)
    print(f"generated {len(report_rows)} dialogue portraits")


if __name__ == "__main__":
    main()

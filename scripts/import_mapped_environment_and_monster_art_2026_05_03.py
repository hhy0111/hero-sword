from __future__ import annotations

import json
import re
import shutil
from collections import deque
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
from rembg import new_session, remove


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "image"
MONSTER_SOURCE_DIR = IMAGE_DIR / "MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02"
TILE_SOURCE_DIR = IMAGE_DIR / "TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03"

OUTPUT_DIR = ROOT / "output" / "mapped-environment-and-monster-art-2026-05-03"
HOLD_DIR = OUTPUT_DIR / "source-hold"
REPORT_PATH = OUTPUT_DIR / "report.json"
MONSTER_REVIEW_PATH = OUTPUT_DIR / "monster_illustration_review.png"
ENVIRONMENT_REVIEW_PATH = OUTPUT_DIR / "environment_runtime_review.png"

MONSTER_OUTPUT_DIR = ROOT / "public" / "assets" / "illustrations" / "monsters"

TOWN_OUTPUTS = {
    "road_stone": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "outdoor" / "road_stone.png",
    "road_stone_alt": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "outdoor" / "road_stone_alt.png",
    "plaza_stone": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "outdoor" / "plaza_stone.png",
    "dirt_plain": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "outdoor" / "dirt_plain.png",
    "dirt_pebbles": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "outdoor" / "dirt_pebbles.png",
    "dirt_edge": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "outdoor" / "dirt_edge.png",
    "wood_planks": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "indoor" / "wood_planks.png",
    "dark_wood_planks": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "indoor" / "dark_wood_planks.png",
    "warm_stone": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "indoor" / "warm_stone.png",
    "workshop_stone": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "indoor" / "workshop_stone.png",
    "clean_brick": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "indoor" / "clean_brick.png",
    "worn_brick": ROOT / "public" / "assets" / "world" / "town" / "tiles" / "indoor" / "worn_brick.png",
    "bench": ROOT / "public" / "assets" / "world" / "town" / "props" / "bench.png",
    "crate_stack": ROOT / "public" / "assets" / "world" / "town" / "props" / "crate_stack.png",
    "lamp_post": ROOT / "public" / "assets" / "world" / "town" / "props" / "lamp_post.png",
    "notice_board": ROOT / "public" / "assets" / "world" / "town" / "props" / "notice_board.png",
    "planter": ROOT / "public" / "assets" / "world" / "town" / "props" / "planter.png",
    "wall_tower": ROOT / "public" / "assets" / "world" / "town" / "landmarks" / "wall_tower.png",
}

PALACE_OUTPUTS = {
    "throne_platform": ROOT / "public" / "assets" / "world" / "palace" / "throne_platform.png",
    "decor_torch_bowl": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "torch_bowl.png",
    "decor_wall_torch": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "wall_torch.png",
    "decor_banner_blue": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "banner_blue.png",
    "decor_banner_white": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "banner_white.png",
    "decor_bust": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "bust.png",
    "decor_lectern": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "lectern.png",
    "decor_bench": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "bench.png",
    "decor_planter": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "planter.png",
    "decor_lantern": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "lantern.png",
    "decor_notice_board": ROOT / "public" / "assets" / "world" / "palace" / "decor" / "notice_board.png",
}


@dataclass(frozen=True)
class SheetComponentExport:
    source_path: Path
    component_index: int
    output_path: Path


ALPHA_THRESHOLD = 18
REMBG_MAX_SIDE = 1024

TILE_EXPORTS: tuple[SheetComponentExport, ...] = (
    SheetComponentExport(TILE_SOURCE_DIR / "02-village-road-plaza-and-crossroad-tile-sheet.png", 0, TOWN_OUTPUTS["road_stone"]),
    SheetComponentExport(TILE_SOURCE_DIR / "02-village-road-plaza-and-crossroad-tile-sheet.png", 4, TOWN_OUTPUTS["road_stone_alt"]),
    SheetComponentExport(TILE_SOURCE_DIR / "02-village-road-plaza-and-crossroad-tile-sheet.png", 1, TOWN_OUTPUTS["plaza_stone"]),
    SheetComponentExport(TILE_SOURCE_DIR / "03-village-dirt-path-edge-and-soft-transition-tile-sheet.png", 0, TOWN_OUTPUTS["dirt_plain"]),
    SheetComponentExport(TILE_SOURCE_DIR / "03-village-dirt-path-edge-and-soft-transition-tile-sheet.png", 4, TOWN_OUTPUTS["dirt_pebbles"]),
    SheetComponentExport(TILE_SOURCE_DIR / "03-village-dirt-path-edge-and-soft-transition-tile-sheet.png", 8, TOWN_OUTPUTS["dirt_edge"]),
    SheetComponentExport(TILE_SOURCE_DIR / "09-shared-village-house-interior-tile-sheet.png", 1, TOWN_OUTPUTS["wood_planks"]),
    SheetComponentExport(TILE_SOURCE_DIR / "09-shared-village-house-interior-tile-sheet.png", 2, TOWN_OUTPUTS["dark_wood_planks"]),
    SheetComponentExport(TILE_SOURCE_DIR / "10-palace-main-floor-tile-sheet.png", 0, TOWN_OUTPUTS["warm_stone"]),
    SheetComponentExport(TILE_SOURCE_DIR / "10-palace-main-floor-tile-sheet.png", 2, TOWN_OUTPUTS["workshop_stone"]),
    SheetComponentExport(TILE_SOURCE_DIR / "10-palace-main-floor-tile-sheet.png", 1, TOWN_OUTPUTS["clean_brick"]),
    SheetComponentExport(TILE_SOURCE_DIR / "10-palace-main-floor-tile-sheet.png", 3, TOWN_OUTPUTS["worn_brick"]),
    SheetComponentExport(TILE_SOURCE_DIR / "06-village-utility-and-town-furnishing-prop-sheet.png", 3, TOWN_OUTPUTS["bench"]),
    SheetComponentExport(TILE_SOURCE_DIR / "06-village-utility-and-town-furnishing-prop-sheet.png", 1, TOWN_OUTPUTS["crate_stack"]),
    SheetComponentExport(TILE_SOURCE_DIR / "06-village-utility-and-town-furnishing-prop-sheet.png", 4, TOWN_OUTPUTS["lamp_post"]),
    SheetComponentExport(TILE_SOURCE_DIR / "06-village-utility-and-town-furnishing-prop-sheet.png", 0, TOWN_OUTPUTS["notice_board"]),
    SheetComponentExport(TILE_SOURCE_DIR / "06-village-utility-and-town-furnishing-prop-sheet.png", 7, TOWN_OUTPUTS["planter"]),
    SheetComponentExport(TILE_SOURCE_DIR / "17-top-down-tower-tile-sheet.png", 15, TOWN_OUTPUTS["wall_tower"]),
    SheetComponentExport(TILE_SOURCE_DIR / "13-palace-throne-dais-and-ceremony-platform-sheet.png", 1, PALACE_OUTPUTS["throne_platform"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 0, PALACE_OUTPUTS["decor_torch_bowl"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 1, PALACE_OUTPUTS["decor_wall_torch"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 2, PALACE_OUTPUTS["decor_banner_blue"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 3, PALACE_OUTPUTS["decor_banner_white"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 8, PALACE_OUTPUTS["decor_bust"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 9, PALACE_OUTPUTS["decor_lectern"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 11, PALACE_OUTPUTS["decor_bench"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 14, PALACE_OUTPUTS["decor_planter"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 15, PALACE_OUTPUTS["decor_lantern"]),
    SheetComponentExport(TILE_SOURCE_DIR / "14-palace-lighting-banner-and-interior-decor-prop-sheet.png", 16, PALACE_OUTPUTS["decor_notice_board"]),
)


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def move_to_hold(source: Path, target_dir: Path, target_name: str | None = None) -> Path | None:
    if not source.exists():
        return None
    ensure_dir(target_dir)
    destination = target_dir / (target_name or source.name)
    if destination.exists():
        destination.unlink()
    shutil.move(str(source), str(destination))
    return destination


def rename_if_exists(source: Path, destination: Path) -> None:
    if not source.exists():
        return
    ensure_dir(destination.parent)
    if destination.exists():
        destination.unlink()
    source.rename(destination)


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
    height, width = submask.shape
    best_component: list[tuple[int, int]] = []

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


def crop_with_padding(
    image: Image.Image,
    *,
    pad_x_ratio: float = 0.08,
    pad_top_ratio: float = 0.08,
    pad_bottom_ratio: float = 0.06,
) -> Image.Image:
    bbox = image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    pad_x = max(18, int((right - left) * pad_x_ratio))
    pad_top = max(18, int((bottom - top) * pad_top_ratio))
    pad_bottom = max(16, int((bottom - top) * pad_bottom_ratio))
    crop_box = (
        max(0, left - pad_x),
        max(0, top - pad_top),
        min(image.width, right + pad_x),
        min(image.height, bottom + pad_bottom),
    )
    return image.crop(crop_box)


def fit_on_canvas(image: Image.Image, canvas_size: tuple[int, int], max_render: tuple[int, int], bottom_margin: int) -> Image.Image:
    scale = min(max_render[0] / image.width, max_render[1] / image.height, 1.0)
    target_size = (
        max(1, int(round(image.width * scale))),
        max(1, int(round(image.height * scale))),
    )
    resized = image.resize(target_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    paste_x = (canvas_size[0] - resized.width) // 2
    paste_y = canvas_size[1] - resized.height - bottom_margin
    canvas.alpha_composite(resized, (paste_x, paste_y))
    return canvas


def process_monster_illustration(session, source_path: Path) -> Image.Image:
    source = Image.open(source_path).convert("RGBA")
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
    return fit_on_canvas(cutout, (1024, 1024), (860, 860), 40)


def is_white_bg(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    return a < 10 or (r > 242 and g > 242 and b > 242)


def extract_white_bg_components(sheet_path: Path) -> list[tuple[int, int, int, int]]:
    image = Image.open(sheet_path).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    visited = [[False] * width for _ in range(height)]
    boxes: list[tuple[int, int, int, int]] = []

    for y in range(height):
        for x in range(width):
            if visited[y][x]:
                continue
            visited[y][x] = True
            if is_white_bg(pixels[x, y]):
                continue

            stack = [(x, y)]
            min_x = max_x = x
            min_y = max_y = y
            count = 1

            while stack:
                cx, cy = stack.pop()
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < width and 0 <= ny < height and not visited[ny][nx]:
                        visited[ny][nx] = True
                        if not is_white_bg(pixels[nx, ny]):
                            stack.append((nx, ny))
                            count += 1
                            min_x = min(min_x, nx)
                            max_x = max(max_x, nx)
                            min_y = min(min_y, ny)
                            max_y = max(max_y, ny)

            if count >= 30:
                boxes.append((min_x, min_y, max_x + 1, max_y + 1))

    boxes.sort(key=lambda box: (box[1], box[0]))
    return boxes


def extract_component(sheet_path: Path, index: int) -> Image.Image:
    image = Image.open(sheet_path).convert("RGBA")
    boxes = extract_white_bg_components(sheet_path)
    box = boxes[index]
    cropped = image.crop(box)
    data = np.array(cropped)
    white_mask = (data[:, :, 3] > 0) & (data[:, :, 0] > 242) & (data[:, :, 1] > 242) & (data[:, :, 2] > 242)
    data[white_mask, 3] = 0
    return Image.fromarray(data, mode="RGBA")


def build_review_sheet(entries: list[tuple[str, Path]], output_path: Path, *, cols: int, cell_size: tuple[int, int], label_height: int = 28) -> None:
    if not entries:
        return
    rows = (len(entries) + cols - 1) // cols
    canvas = Image.new("RGBA", (cols * cell_size[0], rows * (cell_size[1] + label_height)), (20, 20, 22, 255))
    checker_a = (58, 58, 60, 255)
    checker_b = (92, 92, 96, 255)

    for index, (label, image_path) in enumerate(entries):
        row = index // cols
        col = index % cols
        x = col * cell_size[0]
        y = row * (cell_size[1] + label_height)
        tile = Image.new("RGBA", cell_size, checker_a)
        for cy in range(0, cell_size[1], 24):
            for cx in range(0, cell_size[0], 24):
                if ((cx // 24) + (cy // 24)) % 2 == 0:
                    for sy in range(cy, min(cy + 24, cell_size[1])):
                        for sx in range(cx, min(cx + 24, cell_size[0])):
                            tile.putpixel((sx, sy), checker_b)

        portrait = Image.open(image_path).convert("RGBA")
        thumb = ImageOps.contain(portrait, cell_size, Image.Resampling.LANCZOS)
        tile.alpha_composite(thumb, ((cell_size[0] - thumb.width) // 2, (cell_size[1] - thumb.height) // 2))
        canvas.alpha_composite(tile, (x, y))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path)


def normalize_source_folders() -> dict[str, list[str]]:
    notes: dict[str, list[str]] = {"moved_to_hold": [], "renamed": [], "missing": []}

    move_to_hold(
        MONSTER_SOURCE_DIR / "01-village-grass-and-meadow-ground-tile-sheet.png",
        HOLD_DIR / "monster_duplicates",
        "01-village-grass-and-meadow-ground-tile-sheet__actually_tusk_boarling_duplicate.png",
    )
    notes["moved_to_hold"].append("monster/01-village-grass-and-meadow-ground-tile-sheet.png -> hold as tusk_boarling duplicate")

    rename_if_exists(
        MONSTER_SOURCE_DIR / "04-reed-shaman-2.png",
        MONSTER_SOURCE_DIR / "04-reed-shaman.png",
    )
    move_to_hold(
        MONSTER_SOURCE_DIR / "04-reed-shaman-1.png",
        HOLD_DIR / "monster_variants",
        "04-reed-shaman-1__unused_variant.png",
    )
    notes["renamed"].append("monster/04-reed-shaman-2.png -> 04-reed-shaman.png")

    rename_if_exists(
        MONSTER_SOURCE_DIR / "52-fallen-acolyte-2.png",
        MONSTER_SOURCE_DIR / "52-fallen-acolyte.png",
    )
    move_to_hold(
        MONSTER_SOURCE_DIR / "52-fallen-acolyte-1.png",
        HOLD_DIR / "monster_variants",
        "52-fallen-acolyte-1__unused_variant.png",
    )
    notes["renamed"].append("monster/52-fallen-acolyte-2.png -> 52-fallen-acolyte.png")

    move_to_hold(
        TILE_SOURCE_DIR / "01-orin-runtime-dot-sheet.png",
        HOLD_DIR / "tile_duplicates",
        "01-orin-runtime-dot-sheet__actually_palace_decor_duplicate.png",
    )
    notes["moved_to_hold"].append("tile/01-orin-runtime-dot-sheet.png -> hold as palace decor duplicate")

    if not (MONSTER_SOURCE_DIR / "01-meadow-slime.png").exists():
        notes["missing"].append("monster illustration missing: 01-meadow-slime.png")
    if not (TILE_SOURCE_DIR / "01-village-grass-and-meadow-ground-tile-sheet.png").exists():
        notes["missing"].append("tile sheet missing: 01-village-grass-and-meadow-ground-tile-sheet.png")

    return notes


def export_monster_illustrations() -> dict[str, object]:
    session = new_session("u2net")
    ensure_dir(MONSTER_OUTPUT_DIR)

    available_files = sorted(MONSTER_SOURCE_DIR.glob("*.png"))
    pattern = re.compile(r"^\d{2}-([a-z0-9-]+)\.png$")
    written: list[str] = []
    missing_ids = ["meadow_slime"]

    for source_path in available_files:
        match = pattern.match(source_path.name)
        if not match:
            continue
        monster_id = match.group(1).replace("-", "_")
        processed = process_monster_illustration(session, source_path)
        output_path = MONSTER_OUTPUT_DIR / f"{monster_id}.png"
        processed.save(output_path)
        written.append(monster_id)

    review_entries = [(monster_id, MONSTER_OUTPUT_DIR / f"{monster_id}.png") for monster_id in sorted(written)]
    build_review_sheet(review_entries, MONSTER_REVIEW_PATH, cols=5, cell_size=(220, 220))

    return {
        "written_monster_ids": written,
        "missing_monster_ids": [monster_id for monster_id in missing_ids if monster_id not in written],
    }


def export_environment_assets() -> dict[str, object]:
    written: list[str] = []
    for export in TILE_EXPORTS:
        component = extract_component(export.source_path, export.component_index)
        ensure_dir(export.output_path.parent)
        component.save(export.output_path)
        written.append(str(export.output_path.relative_to(ROOT)).replace("\\", "/"))

    review_entries = [
        ("road_stone", TOWN_OUTPUTS["road_stone"]),
        ("road_stone_alt", TOWN_OUTPUTS["road_stone_alt"]),
        ("plaza_stone", TOWN_OUTPUTS["plaza_stone"]),
        ("dirt_plain", TOWN_OUTPUTS["dirt_plain"]),
        ("wood_planks", TOWN_OUTPUTS["wood_planks"]),
        ("warm_stone", TOWN_OUTPUTS["warm_stone"]),
        ("bench", TOWN_OUTPUTS["bench"]),
        ("crate_stack", TOWN_OUTPUTS["crate_stack"]),
        ("lamp_post", TOWN_OUTPUTS["lamp_post"]),
        ("notice_board", TOWN_OUTPUTS["notice_board"]),
        ("planter", TOWN_OUTPUTS["planter"]),
        ("wall_tower", TOWN_OUTPUTS["wall_tower"]),
        ("throne_platform", PALACE_OUTPUTS["throne_platform"]),
        ("torch_bowl", PALACE_OUTPUTS["decor_torch_bowl"]),
        ("banner_blue", PALACE_OUTPUTS["decor_banner_blue"]),
        ("bench_palace", PALACE_OUTPUTS["decor_bench"]),
    ]
    build_review_sheet(review_entries, ENVIRONMENT_REVIEW_PATH, cols=4, cell_size=(220, 220))
    return {
        "written_environment_assets": written,
    }


def main() -> None:
    ensure_dir(OUTPUT_DIR)
    normalization_notes = normalize_source_folders()
    monster_result = export_monster_illustrations()
    environment_result = export_environment_assets()

    report = {
        "normalization": normalization_notes,
        "monster_result": monster_result,
        "environment_result": environment_result,
        "reviews": {
            "monster": str(MONSTER_REVIEW_PATH.relative_to(ROOT)).replace("\\", "/"),
            "environment": str(ENVIRONMENT_REVIEW_PATH.relative_to(ROOT)).replace("\\", "/"),
        },
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

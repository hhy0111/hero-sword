from __future__ import annotations

import json
import re
from collections import deque
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable

import numpy as np
from PIL import Image, ImageOps
from rembg import new_session, remove


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "image"
PORTRAIT_SOURCE_DIR = IMAGE_DIR / "CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03"
MONSTER_SOURCE_DIR = IMAGE_DIR / "MONSTER_RUNTIME_ANIMATION_READY_TO_COPY_PROMPTS_2026-05-03"

PORTRAIT_OUTPUT_DIR = ROOT / "public" / "assets" / "dialogue" / "characters"
GACHA_OUTPUT_DIR = ROOT / "public" / "assets" / "ui" / "gacha"
MONSTER_OUTPUT_DIR = ROOT / "public" / "assets" / "runtime" / "enemies"
MANIFEST_PATH = ROOT / "public" / "assets" / "runtime" / "animation-manifest.json"
MONSTER_DEFS_PATH = ROOT / "src" / "game" / "data" / "monsters.ts"

OUTPUT_REVIEW_DIR = ROOT / "output" / "prompt-asset-import-2026-05-03"
REPORT_PATH = OUTPUT_REVIEW_DIR / "report.json"
PORTRAIT_REVIEW_PATH = OUTPUT_REVIEW_DIR / "portraits_review.png"
GACHA_REVIEW_PATH = OUTPUT_REVIEW_DIR / "gacha_backplates_review.png"
MONSTER_REVIEW_PATH = OUTPUT_REVIEW_DIR / "monster_idle_review.png"

ALPHA_THRESHOLD = 18
REMBG_MAX_SIDE = 1024
PORTRAIT_CANVAS = 512
PORTRAIT_RENDER = 436
PORTRAIT_BOTTOM_MARGIN = 18
GACHA_CANVAS = (640, 800)

REGULAR_FRAME = 96
BOSS_FRAME = 128
REGULAR_MARGIN = 8
BOSS_MARGIN = 10


@dataclass(frozen=True)
class CharacterPortraitImportSpec:
    character_id: str
    source_name: str
    output_name: str


@dataclass(frozen=True)
class MonsterDefinition:
    id: str
    name: str
    pattern: str
    kind: str


PORTRAIT_IMPORT_SPECS: tuple[CharacterPortraitImportSpec, ...] = (
    CharacterPortraitImportSpec("hero", "01-kain.png", "hero.png"),
    CharacterPortraitImportSpec("bram", "02-bram.png", "bram.png"),
    CharacterPortraitImportSpec("sera", "03-sera.png", "sera.png"),
    CharacterPortraitImportSpec("luna", "04-luna.png", "luna.png"),
    CharacterPortraitImportSpec("ria", "05-ria.png", "ria.png"),
    CharacterPortraitImportSpec("theo", "06-theo.png", "theo.png"),
    CharacterPortraitImportSpec("dorgan", "07-dorgan.png", "dorgan.png"),
    CharacterPortraitImportSpec("kiera", "08-kiera.png", "kiera.png"),
    CharacterPortraitImportSpec("helma", "09-helma.png", "helma.png"),
    CharacterPortraitImportSpec("marin", "10-marin.png", "marin.png"),
    CharacterPortraitImportSpec("serena", "11-serena.png", "serena.png"),
    CharacterPortraitImportSpec("fin", "12-fin-2.png", "fin.png"),
    CharacterPortraitImportSpec("iris", "13-iris.png", "iris.png"),
    CharacterPortraitImportSpec("wolf", "14-wolf.png", "wolf.png"),
    CharacterPortraitImportSpec("erin", "15-erin-2.png", "erin.png"),
    CharacterPortraitImportSpec("nazir", "16-nazir.png", "nazir.png"),
    CharacterPortraitImportSpec("laila", "17-laila.png", "laila.png"),
    CharacterPortraitImportSpec("hakan", "18-hakan.png", "hakan.png"),
    CharacterPortraitImportSpec("seraphin", "19-seraphin.png", "seraphin.png"),
    CharacterPortraitImportSpec("micaela", "20-micaela.png", "micaela.png"),
    CharacterPortraitImportSpec("lucian", "21-lucian.png", "lucian.png"),
)

GACHA_BACKPLATE_IMPORT_SPECS = {
    3: "22-gacha-backplate-3-star.png",
    4: "23-gacha-backplate-4-star.png",
    5: "24-gacha-backplate-5-star.png",
}


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


def crop_with_padding(image: Image.Image, *, pad_x_ratio: float = 0.08, pad_top_ratio: float = 0.09, pad_bottom_ratio: float = 0.05) -> Image.Image:
    bbox = image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    pad_x = max(16, int((right - left) * pad_x_ratio))
    pad_top = max(18, int((bottom - top) * pad_top_ratio))
    pad_bottom = max(14, int((bottom - top) * pad_bottom_ratio))

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
    return fit_on_canvas(cutout, (PORTRAIT_CANVAS, PORTRAIT_CANVAS), (PORTRAIT_RENDER, PORTRAIT_RENDER), PORTRAIT_BOTTOM_MARGIN)


def process_gacha_backplate(session, source: Image.Image) -> Image.Image:
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

    cutout = crop_with_padding(cutout, pad_x_ratio=0.04, pad_top_ratio=0.04, pad_bottom_ratio=0.04)
    return fit_on_canvas(cutout, GACHA_CANVAS, (560, 720), 18)


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


def parse_monster_definitions() -> dict[str, MonsterDefinition]:
    source = MONSTER_DEFS_PATH.read_text(encoding="utf-8")
    pattern = re.compile(
        r"\{ id: '([^']+)', continentId: '[^']+', name: '([^']+)', pattern: '([^']+)', kind: '([^']+)'",
    )
    result: dict[str, MonsterDefinition] = {}
    for monster_id, name, monster_pattern, monster_kind in pattern.findall(source):
        result[monster_id] = MonsterDefinition(
            id=monster_id,
            name=name,
            pattern=monster_pattern,
            kind=monster_kind,
        )
    return result


def infer_monster_id(file_path: Path) -> str:
    stem = file_path.stem
    name_part = stem.split("-", 1)[1]
    return name_part.replace("-", "_")


def crop_grid_cells(image: Image.Image, cols: int, rows: int, *, inset: int = 4) -> list[Image.Image]:
    cells: list[Image.Image] = []
    for row in range(rows):
        y0 = round(row * image.height / rows)
        y1 = round((row + 1) * image.height / rows)
        for col in range(cols):
            x0 = round(col * image.width / cols)
            x1 = round((col + 1) * image.width / cols)
            left = min(x1, x0 + inset)
            top = min(y1, y0 + inset)
            right = max(left + 1, x1 - inset)
            bottom = max(top + 1, y1 - inset)
            cells.append(image.crop((left, top, right, bottom)).convert("RGBA"))
    return cells


def border_connected_mask(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    visited = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def try_add(y: int, x: int) -> None:
        if 0 <= y < h and 0 <= x < w and mask[y, x] and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

    for x in range(w):
        try_add(0, x)
        try_add(h - 1, x)
    for y in range(h):
        try_add(y, 0)
        try_add(y, w - 1)

    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            try_add(ny, nx)

    return visited


def remove_runtime_sheet_background(image: Image.Image) -> Image.Image:
    rgba = np.array(image.convert("RGBA"))
    rgb = rgba[:, :, :3].astype(np.int16)
    value = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    green = rgb[:, :, 1]
    red = rgb[:, :, 0]
    blue = rgb[:, :, 2]

    neutral_bg = (value >= 176) & (chroma <= 42)
    chroma_bg = (green >= 220) & (red <= 90) & (blue <= 100)
    candidate_bg = neutral_bg | chroma_bg
    bg_mask = border_connected_mask(candidate_bg)

    alpha = rgba[:, :, 3]
    alpha[bg_mask] = 0

    # Remove thin leftover background fringe connected to the transparent border.
    light_fringe = (value >= 150) & (chroma <= 48)
    fringe_mask = border_connected_mask(light_fringe & (alpha > 0))
    alpha[fringe_mask] = 0

    return Image.fromarray(rgba, mode="RGBA")


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()


def trim_alpha(image: Image.Image, *, padding: int = 4) -> Image.Image:
    bbox = alpha_bbox(image)
    if bbox is None:
        return image
    left, top, right, bottom = bbox
    return image.crop((
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    ))


def fit_monster_frames(frames: list[Image.Image], frame_size: int, margin: int) -> list[Image.Image]:
    bbox_sizes = [
        (img.width, img.height)
        for img in frames
        if alpha_bbox(img) is not None
    ]
    if not bbox_sizes:
        return [Image.new("RGBA", (frame_size, frame_size), (0, 0, 0, 0)) for _ in frames]

    max_width = max(width for width, _ in bbox_sizes)
    max_height = max(height for _, height in bbox_sizes)
    available_w = frame_size - margin * 2
    available_h = frame_size - margin * 2
    scale = min(available_w / max_width, available_h / max_height)

    result: list[Image.Image] = []
    baseline_margin = margin
    for source in frames:
        if alpha_bbox(source) is None:
            result.append(Image.new("RGBA", (frame_size, frame_size), (0, 0, 0, 0)))
            continue
        target = source.resize(
            (
                max(1, int(round(source.width * scale))),
                max(1, int(round(source.height * scale))),
            ),
            Image.Resampling.LANCZOS,
        )
        canvas = Image.new("RGBA", (frame_size, frame_size), (0, 0, 0, 0))
        paste_x = (frame_size - target.width) // 2
        paste_y = frame_size - target.height - baseline_margin
        canvas.alpha_composite(target, (paste_x, paste_y))
        result.append(canvas)
    return result


def build_strip(frames: Iterable[Image.Image], frame_size: int) -> Image.Image:
    frames = list(frames)
    strip = Image.new("RGBA", (frame_size * len(frames), frame_size), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        strip.alpha_composite(frame, (index * frame_size, 0))
    return strip


def regular_clip_map(monster: MonsterDefinition, rows: list[list[Image.Image]]) -> dict[str, tuple[list[Image.Image], int]]:
    if monster.pattern == "melee":
        return {
            "idle": (rows[0], 8),
            "walk": (rows[1], 9),
            "attack_basic_01": (rows[2], 11),
            "hit_react": (rows[3][:2], 12),
            "down_or_death": (rows[3][2:], 8),
        }
    if monster.pattern == "ranged":
        base = {
            "idle": (rows[0], 8),
            "walk": (rows[1], 9),
            "aim": (rows[2][:2], 10),
            "attack_basic_01": (rows[2][2:], 11),
            "hit_react": (rows[3][:2], 12),
            "down_or_death": (rows[3][2:], 8),
        }
        if monster.id == "mist_raider":
            base["evade_step"] = (rows[1], 11)
        if monster.id == "mirage_raider":
            base["stealth_step"] = (rows[1], 11)
        return base
    if monster.pattern == "charger":
        return {
            "idle": (rows[0], 8),
            "walk": (rows[1], 10),
            "run": (rows[1], 12),
            "charge_start": (rows[2][:2], 12),
            "charge_impact": (rows[2][2:], 12),
            "attack_basic_01": (rows[2][2:], 12),
            "hit_react": (rows[3][:2], 12),
            "down_or_death": (rows[3][2:], 8),
        }
    base = {
        "idle": (rows[0], 8),
        "walk": (rows[1], 8),
        "cast_start": (rows[2][:2], 10),
        "cast_loop": (rows[2][:2], 8),
        "cast_release": (rows[2][2:], 11),
        "attack_basic_01": (rows[2][2:], 11),
        "hit_react": (rows[3][:2], 12),
        "down_or_death": (rows[3][2:], 8),
    }
    if monster.id == "barrow_wraith":
        base["float"] = (rows[1], 7)
    if monster.id == "ruin_automaton":
        base["aim"] = (rows[2][:2], 8)
        base["heavy_attack"] = (rows[2][2:], 10)
    if monster.id == "corrupted_sanctuary_guardian":
        base["guard_or_block"] = (rows[0][:2], 8)
    return base


def boss_clip_map(monster: MonsterDefinition, rows: list[list[Image.Image]]) -> dict[str, tuple[list[Image.Image], int]]:
    special = rows[3]
    hit = rows[4][:2]
    death = rows[4][2:]
    base: dict[str, tuple[list[Image.Image], int]] = {
        "idle": (rows[0], 8),
        "walk": (rows[1], 8),
        "run": (rows[1], 9),
        "heavy_attack": (rows[2], 10),
        "hit_react": (hit, 12),
        "down_or_death": (death, 8),
    }
    if monster.id == "blackhorn_chieftain":
        base.update({
            "horn_sweep": (special, 10),
            "taunt_or_command": (special, 8),
            "charge_start": (special[:2], 10),
            "charge_impact": (special[2:], 10),
        })
    elif monster.id == "morgan":
        base.update({
            "slam_burst": (special, 10),
            "roar_or_enrage": (special, 8),
            "charge_start": (special[:2], 10),
            "charge_impact": (special[2:], 10),
        })
    elif monster.id == "bares":
        base.update({
            "crusher_slam": (special, 10),
            "burst_release": (special, 10),
            "taunt_or_command": (special, 8),
        })
    elif monster.id == "dravorn":
        base.update({
            "cast_start": (special[:2], 10),
            "cast_loop": (special[:2], 8),
            "cast_release": (special[2:], 10),
            "charge_burst": (special, 10),
        })
    elif monster.id == "elrent":
        base.update({
            "cast_start": (rows[2][:2], 10),
            "cast_loop": (rows[2][:2], 8),
            "cast_release": (rows[2][2:], 10),
            "tidal_burst": (special, 10),
        })
    elif monster.id == "nereph":
        base.update({
            "cast_start": (special[:2], 10),
            "cast_release": (special[2:], 10),
            "tidal_sweep": (special, 10),
        })
    elif monster.id == "hrod":
        base.update({
            "charge_step": (special[:2], 10),
            "stomp_burst": (special, 10),
            "roar_or_enrage": (special, 8),
        })
    elif monster.id == "valtern":
        base.update({
            "cast_start": (special[:2], 10),
            "cast_loop": (special[:2], 8),
            "cast_release": (special[2:], 10),
            "taunt_or_command": (special, 8),
        })
    elif monster.id == "setra":
        base.update({
            "charge_start": (special[:2], 10),
            "charge_impact": (special[2:], 10),
            "leap_strike": (special, 10),
            "roar_or_command": (special, 8),
        })
    elif monster.id == "kazer":
        base.update({
            "cast_start": (special[:2], 10),
            "cast_loop": (special[:2], 8),
            "cast_release": (special[2:], 10),
            "judgment_burst": (special, 10),
        })
    elif monster.id == "cardinal_serdin":
        base.update({
            "cast_start": (special[:2], 10),
            "cast_loop": (special[:2], 8),
            "cast_release": (special[2:], 10),
            "judgment_wave": (special, 10),
            "taunt_or_command": (special, 8),
        })
    elif monster.id == "varkan":
        base.update({
            "cast_start": (special[:2], 10),
            "cast_loop": (special[:2], 8),
            "cast_release": (special[2:], 10),
            "charge_burst": (special, 10),
            "taunt_or_command": (special, 8),
        })
    return base


def generate_monster_runtime_assets(monster_defs: dict[str, MonsterDefinition]) -> list[dict[str, object]]:
    manifests: list[dict[str, object]] = []
    review_entries: list[tuple[str, Path]] = []

    for image_path in sorted(MONSTER_SOURCE_DIR.glob("*.png")):
        monster_id = infer_monster_id(image_path)
        monster = monster_defs.get(monster_id)
        if monster is None:
            raise KeyError(f"Unknown monster image source: {image_path.name}")

        source = Image.open(image_path).convert("RGBA")
        is_boss = monster.kind == "boss"
        cols = 4
        rows_count = 5 if is_boss else 4
        frame_size = BOSS_FRAME if is_boss else REGULAR_FRAME
        frame_margin = BOSS_MARGIN if is_boss else REGULAR_MARGIN

        raw_cells = crop_grid_cells(source, cols, rows_count, inset=4)
        processed_cells = [trim_alpha(remove_runtime_sheet_background(cell), padding=4) for cell in raw_cells]
        fitted_cells = fit_monster_frames(processed_cells, frame_size, frame_margin)
        rows = [fitted_cells[index * cols : (index + 1) * cols] for index in range(rows_count)]

        clip_map = boss_clip_map(monster, rows) if is_boss else regular_clip_map(monster, rows)
        subject_dir = MONSTER_OUTPUT_DIR / monster.id
        subject_dir.mkdir(parents=True, exist_ok=True)
        clips_manifest: list[dict[str, object]] = []

        for clip_id, (frames, fps) in clip_map.items():
            strip = build_strip(frames, frame_size)
            clip_path = subject_dir / f"{clip_id}.png"
            strip.save(clip_path)
            clips_manifest.append(
                {
                    "id": clip_id,
                    "path": f"assets/runtime/enemies/{monster.id}/{clip_id}.png",
                    "frameWidth": frame_size,
                    "frameHeight": frame_size,
                    "frameCount": len(frames),
                    "fps": fps,
                }
            )

        manifests.append(
            {
                "id": monster.id,
                "name": monster.name,
                "category": "enemy",
                "clips": clips_manifest,
            }
        )

        idle_path = subject_dir / "idle.png"
        if idle_path.exists():
            review_entries.append((monster.id, idle_path))

    build_review_sheet(review_entries, MONSTER_REVIEW_PATH, cols=5, cell_size=(192, 96))
    return manifests


def update_runtime_manifest(enemy_subjects: list[dict[str, object]]) -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    non_enemy_subjects = [subject for subject in manifest["subjects"] if subject.get("category") != "enemy"]
    manifest["subjects"] = [*non_enemy_subjects, *enemy_subjects]
    manifest["generatedAt"] = datetime.now().strftime("%Y-%m-%d")
    manifest["note"] = "Runtime animation clips regenerated after 2026-05-03 portrait and monster prompt asset import."
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    OUTPUT_REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    PORTRAIT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    GACHA_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    MONSTER_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    rembg_session = new_session("u2netp")

    portrait_review_entries: list[tuple[str, Path]] = []
    for spec in PORTRAIT_IMPORT_SPECS:
        source_path = PORTRAIT_SOURCE_DIR / spec.source_name
        if not source_path.exists():
            raise FileNotFoundError(f"Missing portrait source: {source_path}")
        source = Image.open(source_path).convert("RGBA")
        result = process_portrait(rembg_session, source)
        output_path = PORTRAIT_OUTPUT_DIR / spec.output_name
        result.save(output_path)
        portrait_review_entries.append((spec.character_id, output_path))

    build_review_sheet(portrait_review_entries, PORTRAIT_REVIEW_PATH, cols=6, cell_size=(164, 164))

    gacha_review_entries: list[tuple[str, Path]] = []
    for rarity, source_name in GACHA_BACKPLATE_IMPORT_SPECS.items():
        source_path = PORTRAIT_SOURCE_DIR / source_name
        if not source_path.exists():
            raise FileNotFoundError(f"Missing gacha backplate source: {source_path}")
        source = Image.open(source_path).convert("RGBA")
        result = process_gacha_backplate(rembg_session, source)
        output_path = GACHA_OUTPUT_DIR / f"rarity_{rarity}_backplate.png"
        result.save(output_path)
        gacha_review_entries.append((f"{rarity}star", output_path))

    build_review_sheet(gacha_review_entries, GACHA_REVIEW_PATH, cols=3, cell_size=(180, 220))

    monster_defs = parse_monster_definitions()
    enemy_subjects = generate_monster_runtime_assets(monster_defs)
    update_runtime_manifest(enemy_subjects)

    report = {
        "portraitSources": len(PORTRAIT_IMPORT_SPECS),
        "gachaBackplates": len(GACHA_BACKPLATE_IMPORT_SPECS),
        "monsterSheets": len(enemy_subjects),
        "portraitReview": str(PORTRAIT_REVIEW_PATH.relative_to(ROOT)),
        "gachaReview": str(GACHA_REVIEW_PATH.relative_to(ROOT)),
        "monsterReview": str(MONSTER_REVIEW_PATH.relative_to(ROOT)),
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()

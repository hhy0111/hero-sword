from __future__ import annotations

from collections import deque
from pathlib import Path
from shutil import copyfile

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "image" / "IMAGE_PROMPTS_ADDED_GATE_PALACE_TOUCH_REWORK_2026-05-10"

PUBLIC = ROOT / "public" / "assets"


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def copy_asset(source_name: str, target: Path) -> None:
    ensure_parent(target)
    copyfile(SOURCE_DIR / source_name, target)
    print(f"copied {target.relative_to(ROOT)}")


def color_close(pixel: tuple[int, int, int, int], base: tuple[int, int, int], tolerance: int) -> bool:
    red, green, blue, alpha = pixel
    if alpha == 0:
        return True
    return abs(red - base[0]) + abs(green - base[1]) + abs(blue - base[2]) <= tolerance


def flood_clear_background(image: Image.Image, tolerance: int = 56) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int, tuple[int, int, int]]] = deque()

    seed_points = [
        (0, 0),
        (width - 1, 0),
        (0, height - 1),
        (width - 1, height - 1),
        (width // 2, 0),
        (width // 2, height - 1),
        (0, height // 2),
        (width - 1, height // 2),
    ]
    for x, y in seed_points:
        red, green, blue, _ = pixels[x, y]
        queue.append((x, y, (red, green, blue)))

    while queue:
        x, y, base = queue.popleft()
        if x < 0 or y < 0 or x >= width or y >= height or (x, y) in visited:
            continue
        visited.add((x, y))
        if not color_close(pixels[x, y], base, tolerance):
            continue

        red, green, blue, _ = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)
        queue.extend(
            [
                (x + 1, y, base),
                (x - 1, y, base),
                (x, y + 1, base),
                (x, y - 1, base),
            ],
        )

    return rgba


def trim_alpha(image: Image.Image, padding: int = 4) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return image

    left, top, right, bottom = bbox
    return image.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(image.width, right + padding),
            min(image.height, bottom + padding),
        ),
    )


def save_processed_crop(
    source_name: str,
    target: Path,
    box: tuple[int, int, int, int],
    *,
    tolerance: int = 56,
    padding: int = 4,
    rotate_degrees: int = 0,
) -> None:
    source = Image.open(SOURCE_DIR / source_name).convert("RGBA")
    crop = source.crop(box)
    if rotate_degrees:
        crop = crop.rotate(rotate_degrees, expand=True)
    processed = trim_alpha(flood_clear_background(crop, tolerance=tolerance), padding=padding)
    ensure_parent(target)
    processed.save(target)
    print(f"processed {target.relative_to(ROOT)} {processed.width}x{processed.height}")


def main() -> None:
    copy_asset(
        "01-palace_exterior_tile_runtime_set.png",
        PUBLIC / "world" / "town" / "palace" / "palace_exterior_tile_runtime_set.png",
    )
    copy_asset(
        "02-palace_interior_tile_runtime_set.png",
        PUBLIC / "world" / "palace" / "tiles" / "palace_interior_tile_runtime_set.png",
    )
    copy_asset(
        "03-castle_gate_wall_repair_runtime_set.png",
        PUBLIC / "world" / "town" / "walls" / "castle_gate_wall_repair_runtime_set.png",
    )

    save_processed_crop(
        "02-palace_interior_tile_runtime_set.png",
        PUBLIC / "world" / "palace" / "tiles" / "palace_center_carpet_segment.png",
        (58, 196, 315, 284),
        tolerance=46,
        padding=0,
        rotate_degrees=90,
    )
    save_processed_crop(
        "03-castle_gate_wall_repair_runtime_set.png",
        PUBLIC / "world" / "town" / "landmarks" / "gate_arch.png",
        (592, 520, 1000, 858),
        tolerance=58,
        padding=6,
    )
    save_processed_crop(
        "04-palace_warp_single_marker.png",
        PUBLIC / "world" / "town" / "effects" / "palace_warp_single_marker.png",
        (350, 250, 1195, 790),
        tolerance=70,
        padding=8,
    )
    save_processed_crop(
        "05-summon_card_back.png",
        PUBLIC / "ui" / "gacha" / "summon_card_back.png",
        (210, 170, 820, 1282),
        tolerance=46,
        padding=6,
    )
    save_processed_crop(
        "06-battle_command_dock_background.png",
        PUBLIC / "ui" / "battle" / "battle_command_dock_background.png",
        (166, 1012, 866, 1348),
        tolerance=38,
        padding=4,
    )


if __name__ == "__main__":
    main()

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "image"
PUBLIC_ROOT = ROOT / "public" / "assets"


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def open_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def remove_checkerboard_background(image: Image.Image) -> Image.Image:
    result = image.copy().convert("RGBA")
    arr = np.array(result)
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3]
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)

    candidate = (
        ((brightness >= 205) & (saturation <= 38))
        | ((brightness >= 182) & (saturation <= 24))
    ) & (alpha > 0)

    height, width = candidate.shape
    visited = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def push(y: int, x: int) -> None:
        if 0 <= y < height and 0 <= x < width and candidate[y, x] and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

    for x in range(width):
        push(0, x)
        push(height - 1, x)
    for y in range(height):
        push(y, 0)
        push(y, width - 1)

    while queue:
        y, x = queue.popleft()
        push(y - 1, x)
        push(y + 1, x)
        push(y, x - 1)
        push(y, x + 1)

    arr[visited, 3] = 0
    return Image.fromarray(arr, mode="RGBA")


def trim_alpha(image: Image.Image, *, pad: int = 4) -> Image.Image:
    bbox = image.getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    return image.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(image.width, right + pad),
            min(image.height, bottom + pad),
        )
    )


def save_image(image: Image.Image, path: Path) -> None:
    ensure_dir(path.parent)
    image.save(path)


def export_palace_assets() -> None:
    palace_root = PUBLIC_ROOT / "world" / "palace"

    exterior = trim_alpha(remove_checkerboard_background(open_rgba(IMAGE_ROOT / "18-lumen-palace-exterior.png")), pad=8)
    save_image(exterior, palace_root / "exterior.png")

    outer_court = open_rgba(IMAGE_ROOT / "20-lumen-palace-outer-court-ground.png")
    save_image(outer_court, palace_root / "outer_court_ground.png")

    throne = trim_alpha(remove_checkerboard_background(open_rgba(IMAGE_ROOT / "22-lumen-palace-throne-platform.png")), pad=6)
    save_image(throne, palace_root / "throne_platform.png")

    archive = open_rgba(IMAGE_ROOT / "23-the-archive-corridor-inside-lumen-palace.png")
    save_image(archive, palace_root / "archive_corridor.png")


def export_world_landmarks() -> None:
    source = remove_checkerboard_background(open_rgba(IMAGE_ROOT / "01-world-landmark-sheet-remake.png"))
    landmarks_root = PUBLIC_ROOT / "world" / "world-map" / "landmarks"

    crops = {
        "greenhaven_watchtower.png": (41, 41, 324, 460),
        "granforge_furnace.png": (336, 60, 684, 465),
        "blueharbor_shrine.png": (703, 135, 998, 489),
        "winterguard_fortress.png": (28, 493, 507, 896),
        "sunscar_relic_tower.png": (527, 512, 947, 905),
        "lumina_sanctuary.png": (46, 917, 475, 1352),
        "black_gate_final.png": (511, 937, 994, 1330),
    }

    for filename, crop in crops.items():
        asset = trim_alpha(source.crop(crop), pad=6)
        save_image(asset, landmarks_root / filename)


def main() -> None:
    export_palace_assets()
    export_world_landmarks()


if __name__ == "__main__":
    main()

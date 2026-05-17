from __future__ import annotations

from collections import deque
import shutil
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "image"
EQUIPMENT_BASE = ROOT / "assets" / "source" / "equipment-sheets"
APPROVED_DIR = EQUIPMENT_BASE / "approved"
ORIGINAL_DIR = EQUIPMENT_BASE / "original-package-boards"
BLOCKED_DIR = EQUIPMENT_BASE / "blocked"

APPROVED_FILES = [
    "01-4.png",
    "02-item-02.png",
    "03-item-03.png",
    "04-item-04.png",
    "05-item-05.png",
    "06-item-06.png",
    "07-item-07.png",
    "08-item-08.png",
    "09-item-09.png",
    "10-item-10.png",
    "11-item-11.png",
    "12-item-12.png",
]

BLOCKED_FILES = []


def source_path_for(filename: str) -> Path:
    image_path = IMAGE_DIR / filename
    archived_path = ORIGINAL_DIR / filename
    if image_path.exists():
        return image_path
    if archived_path.exists():
        return archived_path
    raise FileNotFoundError(f"Missing source image: {filename}")


def move_to_archive_if_needed(source_path: Path, destination_dir: Path) -> None:
    if source_path.parent == destination_dir:
        return
    destination_dir.mkdir(parents=True, exist_ok=True)
    destination_path = destination_dir / source_path.name
    if destination_path.exists():
        destination_path.unlink()
    shutil.move(str(source_path), str(destination_path))


def background_connected_mask(candidate: np.ndarray) -> np.ndarray:
    height, width = candidate.shape
    visited = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(y: int, x: int) -> None:
        if candidate[y, x] and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

    for x in range(width):
        enqueue(0, x)
        enqueue(height - 1, x)
    for y in range(height):
        enqueue(y, 0)
        enqueue(y, width - 1)

    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < height and 0 <= nx < width and candidate[ny, nx] and not visited[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))
    return visited


def convert_to_transparent_sheet(source_path: Path, destination_path: Path) -> None:
    image = Image.open(source_path).convert("RGBA")
    pixels = np.array(image)
    rgb = pixels[:, :, :3].astype(np.int16)
    max_channel = rgb.max(axis=2)
    min_channel = rgb.min(axis=2)
    brightness = rgb.mean(axis=2)

    # The baked checkerboard background is bright and nearly neutral gray.
    background_candidate = (brightness >= 205) & ((max_channel - min_channel) <= 24)
    connected_background = background_connected_mask(background_candidate)

    alpha = np.where(connected_background, 0, 255).astype(np.uint8)
    pixels[:, :, 3] = alpha
    Image.fromarray(pixels).save(destination_path)


def main() -> None:
    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)
    BLOCKED_DIR.mkdir(parents=True, exist_ok=True)

    for filename in APPROVED_FILES:
        source_path = source_path_for(filename)
        convert_to_transparent_sheet(source_path, APPROVED_DIR / filename)
        move_to_archive_if_needed(source_path, ORIGINAL_DIR)
        print(f"approved: {filename}")

    for filename in BLOCKED_FILES:
        source_path = IMAGE_DIR / filename
        if source_path.exists():
            move_to_archive_if_needed(source_path, BLOCKED_DIR)
            print(f"blocked: {filename}")


if __name__ == "__main__":
    main()

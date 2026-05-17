from __future__ import annotations

from collections import deque
import shutil
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "image"
ASSET_BASE = ROOT / "assets" / "source" / "ready-copy-mixed-assets"
APPROVED_DIR = ASSET_BASE / "approved"
ORIGINAL_DIR = ASSET_BASE / "original-package-boards"

SOURCE_FILE = "01-the-main-player-hero-in-a-super-deformed-2-head-tall-proportion.png"


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


def convert_checkerboard_to_alpha(source_path: Path, destination_path: Path) -> None:
    image = Image.open(source_path).convert("RGBA")
    pixels = np.array(image)
    rgb = pixels[:, :, :3].astype(np.int16)
    max_channel = rgb.max(axis=2)
    min_channel = rgb.min(axis=2)
    brightness = rgb.mean(axis=2)

    background_candidate = (brightness >= 205) & ((max_channel - min_channel) <= 24)
    connected_background = background_connected_mask(background_candidate)

    pixels[:, :, 3] = np.where(connected_background, 0, 255).astype(np.uint8)
    Image.fromarray(pixels).save(destination_path)


def main() -> None:
    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)

    source_path = IMAGE_DIR / SOURCE_FILE
    if not source_path.exists():
        raise FileNotFoundError(source_path)

    convert_checkerboard_to_alpha(source_path, APPROVED_DIR / SOURCE_FILE)

    archived_path = ORIGINAL_DIR / SOURCE_FILE
    if archived_path.exists():
        archived_path.unlink()
    shutil.move(str(source_path), str(archived_path))
    print(f"converted: {SOURCE_FILE}")


if __name__ == "__main__":
    main()

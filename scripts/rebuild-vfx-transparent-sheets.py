from __future__ import annotations

from collections import deque
import shutil
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "image"
ASSET_BASE = ROOT / "assets" / "source" / "vfx-sheets"
APPROVED_DIR = ASSET_BASE / "approved"
ORIGINAL_DIR = ASSET_BASE / "original-package-boards"
BLOCKED_DIR = ASSET_BASE / "blocked"

REFRESH_MAP = {
    "01-vfx.png": "01-sword-slash-vfx-sheet.png",
    "02-vfx.png": "02-shield-impact-vfx-sheet.png",
    "03-vfx.png": "03-fire-arcane-spell-vfx-sheet.png",
    "04-vfx.png": "04-holy-healing-vfx-sheet.png",
    "06-vfx.png": "05-water-sigil-support-vfx-sheet.png",
    "07-vfx.png": "06-arrow-trail-vfx-sheet.png",
    "08-vfx.png": "07-gunner-muzzle-vfx-sheet.png",
    "11-vfx.png": "09-dark-dash-vfx-sheet.png",
    "12-ui-vfx.png": "10-desert-slash-vfx-sheet.png",
    "14-screen-settings-panel-001-2.png": "11-frost-burst-vfx-sheet.png",
    "14-screen-settings-panel-001-1.png": "12-ui-reward-feedback-vfx-sheet.png",
}

LEGACY_FILE_MAP = {
    "01-vfx.png": "01-sword-slash-vfx-sheet.png",
    "02-vfx.png": "02-shield-impact-vfx-sheet.png",
    "03-vfx.png": "03-fire-arcane-spell-vfx-sheet.png",
    "04-vfx.png": "04-holy-healing-vfx-sheet.png",
    "05-vfx.png": "05-water-sigil-support-vfx-sheet.png",
    "06-vfx.png": "06-arrow-trail-vfx-sheet.png",
    "07-vfx.png": "07-gunner-muzzle-vfx-sheet.png",
    "08-vfx.png": "08-rune-circle-vfx-sheet.png",
    "09-vfx.png": "09-dark-dash-vfx-sheet.png",
    "10-vfx.png": "10-desert-slash-vfx-sheet.png",
    "11-vfx.png": "11-frost-burst-vfx-sheet.png",
    "12-ui-vfx.png": "12-ui-reward-feedback-vfx-sheet.png",
}


def source_path_for(filename: str) -> Path:
    image_path = IMAGE_DIR / filename
    archived_path = ORIGINAL_DIR / filename
    if image_path.exists():
        return image_path
    if archived_path.exists():
        return archived_path
    raise FileNotFoundError(f"Missing source image: {filename}")


def move_to_archive_if_needed(source_path: Path) -> None:
    if source_path.parent == ORIGINAL_DIR:
        return
    ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)
    destination_path = ORIGINAL_DIR / source_path.name
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


def grow_background_from_borders(
    rgb: np.ndarray,
    seed_mask: np.ndarray,
    step_threshold: int = 16,
    edge_threshold: int = 28,
) -> np.ndarray:
    height, width, _ = rgb.shape
    visited = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    luma = rgb.mean(axis=2).astype(np.int16)
    edge_strength = np.zeros((height, width), dtype=np.int16)
    edge_strength[:-1, :] = np.maximum(edge_strength[:-1, :], np.abs(luma[:-1, :] - luma[1:, :]))
    edge_strength[:, :-1] = np.maximum(edge_strength[:, :-1], np.abs(luma[:, :-1] - luma[:, 1:]))

    def enqueue(y: int, x: int) -> None:
        if visited[y, x]:
            return
        visited[y, x] = True
        queue.append((y, x))

    seeded = False
    for x in range(width):
        if seed_mask[0, x]:
            enqueue(0, x)
            seeded = True
        if seed_mask[height - 1, x]:
            enqueue(height - 1, x)
            seeded = True
    for y in range(height):
        if seed_mask[y, 0]:
            enqueue(y, 0)
            seeded = True
        if seed_mask[y, width - 1]:
            enqueue(y, width - 1)
            seeded = True

    if not seeded:
        for x in range(width):
            enqueue(0, x)
            enqueue(height - 1, x)
        for y in range(height):
            enqueue(y, 0)
            enqueue(y, width - 1)

    while queue:
        y, x = queue.popleft()
        current = rgb[y, x].astype(np.int16)

        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if not (0 <= ny < height and 0 <= nx < width) or visited[ny, nx]:
                continue

            neighbor = rgb[ny, nx].astype(np.int16)
            step_delta = np.max(np.abs(neighbor - current))
            if step_delta > step_threshold or edge_strength[ny, nx] > edge_threshold:
                continue

            visited[ny, nx] = True
            queue.append((ny, nx))

    return visited


def collect_border_palette(rgb: np.ndarray, step: int = 12, tolerance: int = 18) -> list[np.ndarray]:
    height, width, _ = rgb.shape
    samples: list[np.ndarray] = []

    for x in range(0, width, step):
        samples.append(rgb[0, x])
        samples.append(rgb[height - 1, x])
    for y in range(0, height, step):
        samples.append(rgb[y, 0])
        samples.append(rgb[y, width - 1])

    palette: list[np.ndarray] = []
    for sample in samples:
        if any(np.max(np.abs(sample.astype(np.int16) - color.astype(np.int16))) <= tolerance for color in palette):
            continue
        palette.append(sample.copy())
        if len(palette) >= 48:
            break
    return palette


def convert_to_transparent_sheet(source_path: Path, destination_path: Path) -> None:
    image = Image.open(source_path).convert("RGBA")
    pixels = np.array(image)
    original_alpha = pixels[:, :, 3].copy()
    rgb = pixels[:, :, :3].astype(np.int16)
    max_channel = rgb.max(axis=2)
    min_channel = rgb.min(axis=2)
    brightness = rgb.mean(axis=2)

    background_candidate = (brightness >= 205) & ((max_channel - min_channel) <= 24)
    min_distance_sq = np.full(background_candidate.shape, 255 * 255 * 3, dtype=np.int32)

    for color in collect_border_palette(pixels[:, :, :3]):
        color_diff = rgb.astype(np.int32) - color.astype(np.int32)
        distance_sq = np.sum(color_diff * color_diff, axis=2).astype(np.int32)
        min_distance_sq = np.minimum(min_distance_sq, distance_sq)

    palette_candidate = min_distance_sq <= 28 * 28
    connected_background = background_connected_mask(background_candidate | palette_candidate)
    gradient_background = grow_background_from_borders(
        pixels[:, :, :3],
        background_candidate | palette_candidate,
    )
    connected_background = connected_background | gradient_background

    distance = np.sqrt(min_distance_sq.astype(np.float32))
    computed_alpha = np.clip((distance - 10.0) / 18.0, 0, 1) * 255
    computed_alpha = computed_alpha.astype(np.uint8)
    computed_alpha[connected_background] = 0
    pixels[:, :, 3] = np.minimum(original_alpha, computed_alpha)
    Image.fromarray(pixels).save(destination_path)


def main() -> None:
    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)
    BLOCKED_DIR.mkdir(parents=True, exist_ok=True)

    refreshed_targets = set()

    for source_name, approved_name in REFRESH_MAP.items():
        try:
            source_path = source_path_for(source_name)
        except FileNotFoundError:
            continue

        convert_to_transparent_sheet(source_path, APPROVED_DIR / approved_name)
        move_to_archive_if_needed(source_path)
        refreshed_targets.add(approved_name)
        print(f"approved refresh: {approved_name} <= {source_name}")

    for source_name, approved_name in LEGACY_FILE_MAP.items():
        if approved_name in refreshed_targets or (APPROVED_DIR / approved_name).exists():
            continue

        source_path = source_path_for(source_name)
        convert_to_transparent_sheet(source_path, APPROVED_DIR / approved_name)
        move_to_archive_if_needed(source_path)
        print(f"approved fallback: {approved_name} <= {source_name}")


if __name__ == "__main__":
    main()

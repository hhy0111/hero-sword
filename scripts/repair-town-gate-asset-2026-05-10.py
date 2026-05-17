from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/source/world/pixel-town-rework/approved/03-lumen-outer-wall-gate-kit.png"
TARGET = ROOT / "public/assets/world/town/landmarks/gate_arch.png"


def is_close_color(pixel: tuple[int, int, int, int], base: tuple[int, int, int], tolerance: int) -> bool:
    r, g, b, a = pixel
    if a == 0:
        return True
    return abs(r - base[0]) + abs(g - base[1]) + abs(b - base[2]) <= tolerance


def flood_clear_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int, tuple[int, int, int], int]] = deque()

    seed_points = [
        (0, 0),
        (width - 1, 0),
        (0, height - 1),
        (width - 1, height - 1),
        (width // 2, height // 2),
    ]
    for x, y in seed_points:
        r, g, b, _ = pixels[x, y]
        queue.append((x, y, (r, g, b), 54))

    while queue:
        x, y, base, tolerance = queue.popleft()
        if x < 0 or y < 0 or x >= width or y >= height or (x, y) in visited:
            continue
        visited.add((x, y))
        if not is_close_color(pixels[x, y], base, tolerance):
            continue

        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        queue.extend(
            [
                (x + 1, y, base, tolerance),
                (x - 1, y, base, tolerance),
                (x, y + 1, base, tolerance),
                (x, y - 1, base, tolerance),
            ],
        )

    return rgba


def trim_to_alpha(image: Image.Image, padding: int = 4) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return image
    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(image.width, right + padding)
    bottom = min(image.height, bottom + padding)
    return image.crop((left, top, right, bottom))


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    # Central arch from the approved wall/gate kit. Keep the original pixels,
    # only clear leaked sheet background around and inside the entrance.
    crop = source.crop((362, 706, 862, 865))
    repaired = trim_to_alpha(flood_clear_background(crop), padding=6)
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    repaired.save(TARGET)
    print(f"saved {TARGET} {repaired.width}x{repaired.height}")


if __name__ == "__main__":
    main()

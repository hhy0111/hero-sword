from __future__ import annotations

from pathlib import Path
from collections import deque

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "source" / "store-ready-assets" / "approved" / "01-app-icon.png"
RES = ROOT / "android" / "app" / "src" / "main" / "res"


LEGACY_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

FOREGROUND_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}


def fit_square(source: Image.Image, size: int, inset_ratio: float = 0.0) -> Image.Image:
    image = source.convert("RGBA")
    target_size = max(1, round(size * (1.0 - inset_ratio * 2)))
    scale = target_size / max(image.size)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
    return canvas


def remove_edge_white_background(source: Image.Image, threshold: int = 238) -> Image.Image:
    image = source.convert("RGBA")
    width, height = image.size
    pixels = image.load()
    visited = set()
    queue: deque[tuple[int, int]] = deque()

    def is_edge_white(x: int, y: int) -> bool:
        r, g, b, a = pixels[x, y]
        return a > 0 and r >= threshold and g >= threshold and b >= threshold

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
            continue
        visited.add((x, y))
        if not is_edge_white(x, y):
            continue
        pixels[x, y] = (255, 255, 255, 0)
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return image


def apply_rounded_mask(image: Image.Image, radius_ratio: float = 0.18) -> Image.Image:
    rounded = image.convert("RGBA")
    mask = Image.new("L", rounded.size, 0)
    draw = ImageDraw.Draw(mask)
    radius = round(min(rounded.size) * radius_ratio)
    draw.rounded_rectangle((0, 0, rounded.width - 1, rounded.height - 1), radius=radius, fill=255)
    rounded.putalpha(mask)
    return rounded


def apply_circle_mask(image: Image.Image) -> Image.Image:
    circle = image.convert("RGBA")
    mask = Image.new("L", circle.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, circle.width - 1, circle.height - 1), fill=255)
    circle.putalpha(mask)
    return circle


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True, compress_level=9)


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing launcher icon source: {SOURCE}")

    with Image.open(SOURCE) as source:
        source = remove_edge_white_background(source)
        for folder, size in LEGACY_SIZES.items():
            base = fit_square(source, size)
            save_png(apply_rounded_mask(base), RES / folder / "ic_launcher.png")
            save_png(apply_circle_mask(base), RES / folder / "ic_launcher_round.png")

        for folder, size in FOREGROUND_SIZES.items():
            foreground = fit_square(source, size, inset_ratio=0.09)
            save_png(apply_rounded_mask(foreground), RES / folder / "ic_launcher_foreground.png")

    print(f"Generated Android launcher icons from {SOURCE}")


if __name__ == "__main__":
    main()

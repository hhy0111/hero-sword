from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps
from rembg import new_session, remove


ROOT = Path(__file__).resolve().parents[1]
ENEMY_BASE = ROOT / "assets" / "source" / "enemy-package-sheets"
APPROVED_DIR = ENEMY_BASE / "approved"
REVIEW_DIR = ENEMY_BASE / "review-needed"
ARCHIVE_DIR = ENEMY_BASE / "original-package-boards"

REGULAR_FILES = [
    "01-thorn-wolf-1.png",
    "02-corrupted-wild-boar-1.png",
    "03-grassland-raider-vanguard-1.png",
    "06-ash-mine-worker-1.png",
    "07-slag-automaton-1.png",
    "08-ember-heavy-trooper-1.png",
    "11-mist-raider.png",
    "12-coastal-horror.png",
    "13-corrupted-sanctuary-guardian.png",
    "16-frost-hound.png",
    "17-frozen-legion-trooper.png",
    "18-barrow-wraith.png",
    "21-sand-tracker-beast.png",
    "22-ruin-automaton.png",
    "23-mirage-raider.png",
    "26-fallen-holy-knight.png",
    "27-black-moon-inquisitor.png",
    "28-black-moon-vanguard.png",
]

# Shared crop boxes for the top turnaround poses on the regular-enemy boards.
CUTOUT_BOXES = [
    (0, 150, 280, 400),
    (180, 150, 520, 400),
    (460, 150, 790, 400),
    (720, 150, 1085, 400),
]

# Slot layout on the rebuilt transparent sheet.
SLOTS = [
    (30, 30, 260, 290),
    (330, 30, 290, 290),
    (680, 30, 290, 290),
    (1030, 30, 300, 290),
    (360, 390, 700, 620),
]

CANVAS_SIZE = (1402, 1121)

CUSTOM_RENDERERS = {
    "26-fallen-holy-knight.png": {
        "front_box": (0, 150, 320, 420),
        "side_box": (430, 150, 780, 420),
        "back_box": (700, 150, 1090, 420),
        "enhance_front": False,
    },
    "27-black-moon-inquisitor.png": {
        "front_box": (0, 140, 300, 410),
        "side_box": (430, 140, 780, 410),
        "back_box": (700, 140, 1090, 410),
        "enhance_front": True,
    },
    "28-black-moon-vanguard.png": {
        "front_box": (0, 150, 320, 420),
        "side_box": (430, 150, 780, 420),
        "back_box": (700, 150, 1090, 420),
        "enhance_front": False,
    },
}


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def alpha_area(image: Image.Image) -> int:
    return sum(1 for value in image.getchannel("A").tobytes() if value > 0)


def remove_background(session, image: Image.Image, box: tuple[int, int, int, int]) -> Image.Image | None:
    cutout = remove(image.crop(box), session=session)
    bbox = alpha_bbox(cutout)
    if bbox is None:
        return None
    return cutout.crop(bbox)


def remove_background_with_enhance(
    session,
    image: Image.Image,
    box: tuple[int, int, int, int],
    *,
    brighten: bool,
) -> Image.Image | None:
    crop = image.crop(box)
    if brighten:
        crop = ImageEnhance.Brightness(crop).enhance(1.25)
        crop = ImageEnhance.Contrast(crop).enhance(1.15)
    return remove_background(session, crop, (0, 0, crop.width, crop.height))


def paste_scaled(canvas: Image.Image, cutout: Image.Image, slot: tuple[int, int, int, int]) -> None:
    x, y, max_w, max_h = slot
    scale = min(max_w / cutout.width, max_h / cutout.height)
    size = (
        max(1, int(cutout.width * scale)),
        max(1, int(cutout.height * scale)),
    )
    resized = cutout.resize(size, Image.LANCZOS)
    px = x + (max_w - resized.width) // 2
    py = y + (max_h - resized.height) // 2
    canvas.alpha_composite(resized, (px, py))


def rebuild_sheet(session, source_image: Image.Image) -> Image.Image:
    pieces = [remove_background(session, source_image, box) for box in CUTOUT_BOXES]
    pieces = [piece for piece in pieces if piece is not None]
    if not pieces:
        raise RuntimeError("No usable cutouts were extracted from the source image.")

    hero_piece = max(pieces, key=alpha_area)
    render_pieces = pieces[:4]
    while len(render_pieces) < 4:
        render_pieces.append(hero_piece)

    canvas = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    for piece, slot in zip(render_pieces + [hero_piece], SLOTS):
        paste_scaled(canvas, piece, slot)
    return canvas


def rebuild_custom_sheet(session, source_image: Image.Image, config: dict[str, object]) -> Image.Image:
    front_piece = remove_background_with_enhance(
        session,
        source_image,
        config["front_box"],
        brighten=bool(config["enhance_front"]),
    )
    side_piece = remove_background(session, source_image, config["side_box"])
    back_piece = remove_background(session, source_image, config["back_box"])
    if front_piece is None or side_piece is None or back_piece is None:
        raise RuntimeError("Missing custom cutouts for shield/staff enemy rebuild.")

    mirrored_front = ImageOps.mirror(front_piece)
    canvas = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    for piece, slot in zip(
        [front_piece, mirrored_front, side_piece, back_piece, front_piece],
        SLOTS,
    ):
        paste_scaled(canvas, piece, slot)
    return canvas


def main() -> None:
    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)

    session = new_session("u2net")

    for filename in REGULAR_FILES:
        review_path = REVIEW_DIR / filename
        archive_path = ARCHIVE_DIR / filename
        if review_path.exists():
            source_path = review_path
        elif archive_path.exists():
            source_path = archive_path
        else:
            raise FileNotFoundError(f"Missing source image for rebuild: {filename}")

        source_image = Image.open(source_path).convert("RGBA")
        if filename in CUSTOM_RENDERERS:
            rebuilt = rebuild_custom_sheet(session, source_image, CUSTOM_RENDERERS[filename])
        else:
            rebuilt = rebuild_sheet(session, source_image)

        if source_path == review_path:
            if archive_path.exists():
                archive_path.unlink()
            shutil.move(str(review_path), str(archive_path))
        rebuilt.save(APPROVED_DIR / filename)
        print(f"rebuilt: {filename}")


if __name__ == "__main__":
    main()

from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "image"
PUBLIC_ROOT = ROOT / "public" / "assets"


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def open_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


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


def extract_crop(source_name: str, crop: tuple[int, int, int, int], output_path: Path, *, pad: int = 4) -> None:
    image = open_rgba(IMAGE_ROOT / source_name).crop(crop)
    save_image(trim_alpha(image, pad=pad), output_path)


def find_row_bands(image: Image.Image, *, min_alpha: int = 8) -> list[tuple[int, int]]:
    alpha = image.getchannel("A")
    width, height = image.size
    row_activity = []
    for y in range(height):
        active = False
        for x in range(width):
            if alpha.getpixel((x, y)) >= min_alpha:
                active = True
                break
        row_activity.append(active)

    bands: list[tuple[int, int]] = []
    start: int | None = None
    for y, active in enumerate(row_activity):
        if active and start is None:
            start = y
        elif not active and start is not None:
            bands.append((start, y))
            start = None

    if start is not None:
        bands.append((start, height))

    return bands


def export_button_frames() -> None:
    source = open_rgba(IMAGE_ROOT / "06-battle-ui-button-frame-sheet-remake.png")
    bands = find_row_bands(source)
    output_root = PUBLIC_ROOT / "ui" / "buttons"
    names = [
        "frame_normal.png",
        "frame_hover.png",
        "frame_pressed.png",
        "frame_disabled.png",
    ]

    for filename, (top, bottom) in zip(names, bands, strict=False):
        band_image = source.crop((0, top, source.width, bottom))
        save_image(trim_alpha(band_image, pad=6), output_root / filename)


def export_battle_ui_frames() -> None:
    output_root = PUBLIC_ROOT / "ui" / "battle"

    top_hud = trim_alpha(open_rgba(IMAGE_ROOT / "09-palace-core-runtime-npc-sheet-remake.png"), pad=8)
    save_image(top_hud, output_root / "top_hud_frame.png")

    command_sheet = open_rgba(IMAGE_ROOT / "07-battle-bottom-command-bar-frame-remake.png")
    command_bands = find_row_bands(command_sheet)
    if command_bands:
        top, bottom = command_bands[0]
        command_frame = trim_alpha(command_sheet.crop((0, top, command_sheet.width, bottom)), pad=8)
        save_image(command_frame, output_root / "bottom_command_frame.png")


def export_town_and_palace_gates() -> None:
    town_landmarks_root = PUBLIC_ROOT / "world" / "town" / "landmarks"
    palace_root = PUBLIC_ROOT / "world" / "palace"

    extract_crop(
        "03-lumen-center-plaza-tile-sheet-remake.png",
        (41, 128, 557, 233),
        town_landmarks_root / "wall_segment.png",
        pad=4,
    )
    extract_crop(
        "03-lumen-center-plaza-tile-sheet-remake.png",
        (589, 128, 724, 435),
        town_landmarks_root / "wall_vertical.png",
        pad=4,
    )
    extract_crop(
        "03-lumen-center-plaza-tile-sheet-remake.png",
        (36, 313, 376, 495),
        town_landmarks_root / "wall_corner.png",
        pad=4,
    )
    extract_crop(
        "03-lumen-center-plaza-tile-sheet-remake.png",
        (774, 962, 969, 1146),
        town_landmarks_root / "wall_tower.png",
        pad=4,
    )

    gate_arch = trim_alpha(open_rgba(IMAGE_ROOT / "05-utility-ui-button-frame-sheet-remake.png"), pad=8)
    save_image(gate_arch, town_landmarks_root / "gate_arch.png")

    palace_gate = trim_alpha(open_rgba(IMAGE_ROOT / "04-primary-ui-button-frame-sheet-remake.png"), pad=8)
    save_image(palace_gate, palace_root / "north_gate.png")


def main() -> None:
    export_button_frames()
    export_battle_ui_frames()
    export_town_and_palace_gates()


if __name__ == "__main__":
    main()

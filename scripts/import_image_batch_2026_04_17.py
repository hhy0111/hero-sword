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


def remove_near_white_background(
    image: Image.Image,
    *,
    brightness_threshold: int = 230,
    max_channel_delta: int = 18,
) -> Image.Image:
    result = image.copy().convert("RGBA")
    pixels = result.load()
    width, height = result.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if min(r, g, b) >= brightness_threshold and max(r, g, b) - min(r, g, b) <= max_channel_delta:
                pixels[x, y] = (r, g, b, 0)
    return result


def trim_alpha(image: Image.Image, *, pad: int = 2) -> Image.Image:
    bbox = image.getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(image.width, right + pad)
    bottom = min(image.height, bottom + pad)
    return image.crop((left, top, right, bottom))


def save_image(image: Image.Image, path: Path) -> None:
    ensure_dir(path.parent)
    image.save(path)


def extract_with_white_bg(
    source_name: str,
    output_path: Path,
    *,
    crop: tuple[int, int, int, int] | None = None,
    pad: int = 2,
) -> None:
    source_path = IMAGE_ROOT / source_name
    if not source_path.exists():
        return

    image = open_rgba(source_path)
    if crop is not None:
        image = image.crop(crop)
    image = remove_near_white_background(image)
    image = trim_alpha(image, pad=pad)
    save_image(image, output_path)


def copy_opaque(
    source_name: str,
    output_path: Path,
    *,
    crop: tuple[int, int, int, int] | None = None,
) -> None:
    source_path = IMAGE_ROOT / source_name
    if not source_path.exists():
        return

    image = Image.open(source_path).convert("RGBA")
    if crop is not None:
        image = image.crop(crop)
    save_image(image, output_path)


def export_world_map_assets() -> None:
    world_map_root = PUBLIC_ROOT / "world" / "world-map"
    copy_opaque(
        "07-world-route-full-screen-background-replacement.png",
        world_map_root / "overview.png",
    )

    frame_source = "08-world-route-node-card-frame-sheet-1.png"
    frame_crops = {
        "node_open.png": (0, 0, 512, 768),
        "node_locked.png": (512, 0, 1024, 768),
        "node_selected.png": (0, 768, 512, 1536),
        "node_disabled.png": (512, 768, 1024, 1536),
    }
    for filename, crop in frame_crops.items():
        extract_with_white_bg(frame_source, world_map_root / filename, crop=crop, pad=6)


def export_town_assets() -> None:
    landmarks_root = PUBLIC_ROOT / "world" / "town" / "landmarks"
    effects_root = PUBLIC_ROOT / "world" / "town" / "effects"

    extract_with_white_bg(
        "03-lumen-plaza-ground-remake.png",
        landmarks_root / "wall_segment.png",
        crop=(16, 18, 414, 184),
        pad=4,
    )
    extract_with_white_bg(
        "03-lumen-plaza-ground-remake.png",
        landmarks_root / "wall_tower.png",
        crop=(205, 214, 453, 738),
        pad=4,
    )
    extract_with_white_bg(
        "03-lumen-plaza-ground-remake.png",
        landmarks_root / "gate_arch.png",
        crop=(20, 724, 990, 1328),
        pad=6,
    )
    extract_with_white_bg(
        "04-lumen-fountain-base-remake.png",
        landmarks_root / "fountain_base.png",
        pad=4,
    )
    extract_with_white_bg(
        "05-lumen-fountain-water-layer-remake.png",
        landmarks_root / "fountain_water.png",
        pad=4,
    )
    extract_with_white_bg(
        "06-safe-warp-marker-remake.png",
        effects_root / "warp_marker.png",
        crop=(160, 710, 864, 1368),
        pad=6,
    )


def export_palace_assets() -> None:
    palace_root = PUBLIC_ROOT / "world" / "palace"
    copy_opaque("21-lumen-palace-royal-audience-hall.png", palace_root / "royal_audience_hall.png")
    copy_opaque("20-lumen-palace-outer-court-ground.png", palace_root / "outer_court_ground.png")
    copy_opaque("23-the-archive-corridor-inside-lumen-palace.png", palace_root / "archive_corridor.png")
    extract_with_white_bg("18-lumen-palace-exterior.png", palace_root / "exterior.png", pad=4)
    extract_with_white_bg("19-lumen-palace-north-gate.png", palace_root / "north_gate.png", pad=4)
    extract_with_white_bg("22-lumen-palace-throne-platform.png", palace_root / "throne_platform.png", pad=4)


def export_palace_portraits() -> None:
    portraits_root = PUBLIC_ROOT / "dialogue" / "npcs"
    source_name = "24-palace-core-npc-dialogue-portrait-set.png"
    portrait_crops = {
        "king_aldren.png": (0, 0, 512, 512),
        "queen_regent_celestine.png": (512, 0, 1024, 512),
        "captain_rowan.png": (0, 512, 512, 1024),
        "archivist_mirel.png": (512, 512, 1024, 1024),
    }
    for filename, crop in portrait_crops.items():
        extract_with_white_bg(source_name, portraits_root / filename, crop=crop, pad=4)


def export_battle_ui_assets() -> None:
    battle_ui_root = PUBLIC_ROOT / "ui" / "battle"
    extract_with_white_bg("12-battle-top-hud-frame.png", battle_ui_root / "top_hud_frame.png", pad=4)
    extract_with_white_bg("13-battle-bottom-command-frame-2.png", battle_ui_root / "bottom_command_frame.png", pad=4)
    extract_with_white_bg("14-ally-hp-bar-frame-2.png", battle_ui_root / "ally_hp_frame.png", pad=4)
    extract_with_white_bg("15-enemy-hp-bar-frame.png", battle_ui_root / "enemy_hp_frame.png", pad=4)
    extract_with_white_bg("17-battle-result-fail-frame-1.png", battle_ui_root / "result_fail_frame.png", pad=4)


def main() -> None:
    export_world_map_assets()
    export_town_assets()
    export_palace_assets()
    export_palace_portraits()
    export_battle_ui_assets()


if __name__ == "__main__":
    main()

from __future__ import annotations

from collections import deque
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import remove as rembg_remove


ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "image"
PUBLIC_ROOT = ROOT / "public" / "assets"


def choose_existing(*names: str) -> Path:
    for name in names:
        candidate = IMAGE_ROOT / name
        if candidate.exists():
            return candidate
    raise FileNotFoundError(f"No image found for candidates: {names}")


def choose_existing_optional(*names: str) -> Path | None:
    for name in names:
        candidate = IMAGE_ROOT / name
        if candidate.exists():
            return candidate
    return None


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def open_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def save_image(image: Image.Image, path: Path) -> None:
    ensure_dir(path.parent)
    image.save(path)


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

    arr[..., 3][visited] = 0
    return Image.fromarray(arr, mode="RGBA")


def remove_edge_background(image: Image.Image, *, threshold: int = 42) -> Image.Image:
    arr = np.array(image.convert("RGBA"))
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3]
    height, width = alpha.shape

    edge_rgb = []
    edge_alpha = []
    for x in range(width):
        edge_rgb.append(rgb[0, x])
        edge_rgb.append(rgb[height - 1, x])
        edge_alpha.append(alpha[0, x])
        edge_alpha.append(alpha[height - 1, x])
    for y in range(height):
        edge_rgb.append(rgb[y, 0])
        edge_rgb.append(rgb[y, width - 1])
        edge_alpha.append(alpha[y, 0])
        edge_alpha.append(alpha[y, width - 1])

    edge_rgb_arr = np.array(edge_rgb)
    edge_alpha_arr = np.array(edge_alpha)
    opaque_edge_rgb = edge_rgb_arr[edge_alpha_arr > 0]
    if len(opaque_edge_rgb) == 0:
        return image

    background = np.median(opaque_edge_rgb, axis=0)
    diff = np.abs(rgb - background).max(axis=2)
    brightness = rgb.mean(axis=2)
    bg_brightness = background.mean()
    candidate = (diff <= threshold) & (np.abs(brightness - bg_brightness) <= 50) & (alpha > 0)

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

    arr[..., 3][visited] = 0
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


def grabcut_center_subject(image: Image.Image, *, margin_ratio: float = 0.08, pad: int = 6) -> Image.Image:
    rgba = image.convert("RGBA")
    arr = np.array(rgba)
    rgb = cv2.cvtColor(arr, cv2.COLOR_RGBA2RGB)
    height, width = rgb.shape[:2]
    scale = min(1.0, 640 / max(width, height))
    if scale < 1.0:
        scaled_rgb = cv2.resize(
            rgb,
            (max(1, int(width * scale)), max(1, int(height * scale))),
            interpolation=cv2.INTER_AREA,
        )
    else:
        scaled_rgb = rgb

    scaled_height, scaled_width = scaled_rgb.shape[:2]
    margin_x = max(8, int(scaled_width * margin_ratio))
    margin_y = max(8, int(scaled_height * margin_ratio))
    rect = (
        margin_x,
        margin_y,
        max(1, scaled_width - margin_x * 2),
        max(1, scaled_height - margin_y * 2),
    )

    mask = np.zeros((scaled_height, scaled_width), np.uint8)
    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)

    cv2.grabCut(scaled_rgb, mask, rect, bgd_model, fgd_model, 3, cv2.GC_INIT_WITH_RECT)
    foreground_mask = np.where(
        (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD),
        255,
        0,
    ).astype(np.uint8)
    if scale < 1.0:
        foreground_mask = cv2.resize(foreground_mask, (width, height), interpolation=cv2.INTER_LINEAR)

    result = arr.copy()
    result[:, :, 3] = np.minimum(result[:, :, 3], foreground_mask)
    return trim_alpha(Image.fromarray(result, mode="RGBA"), pad=pad)


def clean_transparent_asset(image: Image.Image, *, pad: int = 6) -> Image.Image:
    cleaned = remove_checkerboard_background(image)
    cleaned = remove_edge_background(cleaned)
    return trim_alpha(cleaned, pad=pad)


def clean_scene_asset(image: Image.Image) -> Image.Image:
    return image.convert("RGBA")


def clean_subject_asset(image: Image.Image, *, pad: int = 6) -> Image.Image:
    removed = rembg_remove(image.convert("RGBA"))
    if not isinstance(removed, Image.Image):
        raise TypeError("rembg did not return a PIL image")
    return trim_alpha(removed.convert("RGBA"), pad=pad)


def export_palace_assets() -> None:
    palace_root = PUBLIC_ROOT / "world" / "palace"

    exterior_path = choose_existing_optional(
        "10-optional-follow-up-palace-exterior-entry-scene.png",
        "18-lumen-palace-exterior.png",
    )
    if exterior_path is not None:
        exterior = clean_transparent_asset(open_rgba(exterior_path), pad=10)
        save_image(exterior, palace_root / "exterior.png")

    north_gate_path = choose_existing_optional("01-lumen-palace-north-court-gate-remake.png")
    if north_gate_path is not None:
        north_gate = clean_transparent_asset(open_rgba(north_gate_path), pad=8)
        save_image(north_gate, palace_root / "north_gate.png")

    audience_hall_path = choose_existing_optional(
        "03-palace-audience-hall-final-background.png",
        "02-lumen-palace-audience-hall-background-remake.png",
    )
    if audience_hall_path is not None:
        audience_hall = clean_scene_asset(open_rgba(audience_hall_path))
        save_image(audience_hall, palace_root / "royal_audience_hall.png")

    npc_sheet_path = choose_existing_optional(
        "09-palace-core-runtime-npc-sheet-remake.png",
        "03-lumen-palace-core-runtime-npc-sheet-remake.png",
    )
    if npc_sheet_path is None:
        return

    npc_sheet = open_rgba(npc_sheet_path)
    npc_root = palace_root / "npcs"

    if npc_sheet_path.name == "09-palace-core-runtime-npc-sheet-remake.png":
        npc_crops = {
            "king.png": (46, 24, 236, 326),
            "queen.png": (528, 18, 754, 336),
            "guard.png": (766, 20, 1010, 332),
            "scholar.png": (1260, 18, 1506, 334),
        }
    else:
        npc_crops = {
            # Tight single-subject crops avoid bleeding from adjacent variants in the portrait sheet.
            "king.png": (20, 10, 210, 295),
            "queen.png": (520, 12, 720, 295),
            "guard.png": (24, 620, 214, 910),
            "scholar.png": (20, 1230, 208, 1512),
        }

    for filename, crop in npc_crops.items():
        if npc_sheet_path.name == "09-palace-core-runtime-npc-sheet-remake.png":
            npc_image = clean_subject_asset(npc_sheet.crop(crop), pad=6)
        else:
            npc_image = clean_transparent_asset(npc_sheet.crop(crop), pad=6)
        save_image(npc_image, npc_root / filename)


def export_palace_dialogue_portraits() -> None:
    dialogue_root = PUBLIC_ROOT / "dialogue" / "npcs"
    event_root = PUBLIC_ROOT / "dialogue" / "events"

    portrait_set_path = choose_existing_optional("02-palace-core-runtime-npc-sheet-remake.png")
    if portrait_set_path is not None:
        portrait_set = Image.open(portrait_set_path).convert("RGB")
        half_w = portrait_set.width // 2
        half_h = portrait_set.height // 2
        portrait_crops = {
            "queen_regent_celestine.png": (half_w, 0, portrait_set.width, half_h),
            "captain_rowan.png": (0, half_h, half_w, portrait_set.height),
            "archivist_mirel.png": (half_w, half_h, portrait_set.width, portrait_set.height),
        }
        for filename, crop in portrait_crops.items():
            portrait = portrait_set.crop(crop)
            save_image(portrait, dialogue_root / filename)

    king_portrait_path = choose_existing_optional("03-palace-dialogue-portrait-set-remake.png")
    if king_portrait_path is not None:
        king_portrait = Image.open(king_portrait_path).convert("RGB")
        save_image(king_portrait, dialogue_root / "king_aldren.png")

    king_event_path = choose_existing_optional("04-optional-king-throne-event-portrait.png")
    if king_event_path is not None:
        king_event = Image.open(king_event_path).convert("RGB")
        save_image(king_event, event_root / "king_aldren_throne.png")


def export_town_landmarks_and_props() -> None:
    town_landmarks_root = PUBLIC_ROOT / "world" / "town" / "landmarks"
    town_props_root = PUBLIC_ROOT / "world" / "town" / "props"
    town_tiles_root = PUBLIC_ROOT / "world" / "town" / "tiles" / "outdoor"

    gate_path = choose_existing_optional(
        "01-lumen-village-square-south-wall-south-gate-tile-set.png",
        "02-lumen-village-right-edge-stage-gate-remake.png",
        "01-lumen-village-south-gate-outer-wall-modular-tile-set.png",
        "03-lumen-plaza-ground-remake.png",
    )
    if gate_path is not None:
        if gate_path.name == "01-lumen-village-square-south-wall-south-gate-tile-set.png":
            gate_sheet = open_rgba(gate_path)
            gate = clean_subject_asset(gate_sheet.crop((214, 520, 810, 996)), pad=10)
        elif gate_path.name == "02-lumen-village-right-edge-stage-gate-remake.png":
            gate = clean_subject_asset(open_rgba(gate_path), pad=10)
        elif gate_path.name == "01-lumen-village-south-gate-outer-wall-modular-tile-set.png":
            wall_sheet = open_rgba(gate_path)
            gate = clean_transparent_asset(wall_sheet.crop((650, 250, 1410, 810)), pad=8)
        else:
            transparent_wall_sheet = open_rgba(gate_path)
            gate = clean_transparent_asset(transparent_wall_sheet.crop((392, 760, 840, 1062)), pad=10)
        save_image(gate, town_landmarks_root / "gate_arch.png")

    wall_path = choose_existing_optional(
        "01-lumen-village-square-south-wall-south-gate-tile-set.png",
        "01-lumen-village-outer-wall-modular-kit-remake.png",
        "01-lumen-village-south-gate-outer-wall-modular-tile-set.png",
        "03-lumen-plaza-ground-remake.png",
    )
    if wall_path is not None:
        wall_sheet = open_rgba(wall_path)
        if wall_path.name == "01-lumen-village-square-south-wall-south-gate-tile-set.png":
            wall_crops = {
                "wall_segment.png": (224, 84, 616, 244),
                "wall_vertical.png": (34, 76, 196, 246),
                "wall_corner.png": (638, 66, 884, 264),
                "wall_tower.png": (846, 42, 1014, 306),
            }
        elif wall_path.name == "01-lumen-village-outer-wall-modular-kit-remake.png":
            wall_crops = {
                "wall_segment.png": (246, 462, 740, 684),
                "wall_vertical.png": (0, 314, 178, 692),
                "wall_corner.png": (0, 692, 472, 1042),
                "wall_tower.png": (744, 446, 1018, 1120),
            }
        elif wall_path.name == "01-lumen-village-south-gate-outer-wall-modular-tile-set.png":
            wall_crops = {
                "wall_segment.png": (20, 420, 395, 582),
                "wall_vertical.png": (425, 468, 535, 650),
                "wall_corner.png": (235, 650, 505, 895),
                "wall_tower.png": (52, 604, 228, 950),
            }
        else:
            wall_crops = {
                "wall_segment.png": (35, 145, 335, 306),
                "wall_vertical.png": (270, 372, 418, 698),
                "wall_corner.png": (596, 145, 967, 360),
                "wall_tower.png": (810, 680, 982, 1058),
            }

        for filename, crop in wall_crops.items():
            if wall_path.name in {
                "01-lumen-village-outer-wall-modular-kit-remake.png",
                "01-lumen-village-square-south-wall-south-gate-tile-set.png",
            }:
                wall_image = clean_subject_asset(wall_sheet.crop(crop), pad=8)
            else:
                wall_image = clean_transparent_asset(wall_sheet.crop(crop), pad=8)
            save_image(wall_image, town_landmarks_root / filename)

    plaza_tile_path = choose_existing_optional("03-lumen-center-plaza-tile-sheet-remake.png")
    if plaza_tile_path is not None:
        plaza_sheet = open_rgba(plaza_tile_path)
        plaza_tile = plaza_sheet.crop((18, 18, 332, 332)).convert("RGBA")
        save_image(plaza_tile, town_tiles_root / "plaza_stone.png")

    signpost_path = choose_existing_optional("04-village-plaza-wayfinding-signpost-remake.png")
    if signpost_path is not None:
        signpost = clean_transparent_asset(open_rgba(signpost_path), pad=8)
        save_image(signpost, town_props_root / "bench.png")


def export_world_map_assets() -> None:
    world_map_root = PUBLIC_ROOT / "world" / "world-map"
    landmarks_root = world_map_root / "landmarks"

    scenic_background_path = choose_existing_optional("05-stage-select-scenic-background-remake.png")
    if scenic_background_path is not None:
        scenic_background = clean_scene_asset(open_rgba(scenic_background_path))
        save_image(scenic_background, world_map_root / "scenic_background.png")

    landmark_sheet_path = choose_existing_optional("01-world-landmark-sheet-remake.png")
    if landmark_sheet_path is not None:
        landmark_sheet = clean_transparent_asset(open_rgba(landmark_sheet_path), pad=0)
        landmark_crops = {
            "greenhaven_watchtower.png": (41, 41, 324, 460),
            "granforge_furnace.png": (336, 60, 684, 465),
            "blueharbor_shrine.png": (703, 135, 998, 489),
            "winterguard_fortress.png": (28, 493, 507, 896),
            "sunscar_relic_tower.png": (527, 512, 947, 905),
            "lumina_sanctuary.png": (46, 917, 475, 1352),
            "black_gate_final.png": (511, 937, 994, 1330),
        }
        for filename, crop in landmark_crops.items():
            asset = trim_alpha(landmark_sheet.crop(crop), pad=8)
            save_image(asset, landmarks_root / filename)

    node_sheet_path = choose_existing_optional("08-world-route-node-card-frame-sheet-2.png")
    if node_sheet_path is not None:
        node_sheet = open_rgba(node_sheet_path)
        node_crops = {
            "node_open.png": (40, 36, 454, 598),
            "node_selected.png": (470, 32, 896, 604),
            "node_locked.png": (40, 606, 454, 1184),
            "node_disabled.png": (470, 606, 896, 1184),
        }
        for filename, crop in node_crops.items():
            node_asset = clean_transparent_asset(node_sheet.crop(crop), pad=4)
            save_image(node_asset, world_map_root / filename)


def export_ui_assets() -> None:
    button_root = PUBLIC_ROOT / "ui" / "buttons"
    battle_root = PUBLIC_ROOT / "ui" / "battle"
    stage_select_root = PUBLIC_ROOT / "ui" / "stage-select"
    town_ui_root = PUBLIC_ROOT / "world" / "town" / "ui"

    button_sheet_path = choose_existing_optional(
        "04-primary-ui-button-frame-sheet-remake.png",
        "06-battle-ui-button-frame-sheet-remake.png",
    )
    if button_sheet_path is not None:
        button_sheet = open_rgba(button_sheet_path)
        if button_sheet_path.name == "04-primary-ui-button-frame-sheet-remake.png":
            button_rows = {
                "frame_normal.png": (92, 58, 932, 246),
                "frame_hover.png": (92, 348, 932, 536),
                "frame_pressed.png": (92, 942, 932, 1130),
                "frame_disabled.png": (92, 1236, 932, 1424),
            }
        else:
            button_rows = {
                "frame_normal.png": (330, 170, 756, 388),
                "frame_hover.png": (0, 170, 330, 388),
                "frame_pressed.png": (1088, 170, 1528, 388),
                "frame_disabled.png": (1104, 640, 1528, 864),
            }
        for filename, crop in button_rows.items():
            frame = clean_subject_asset(button_sheet.crop(crop), pad=10)
            save_image(frame, button_root / filename)

    preview_frame_path = choose_existing_optional("06-stage-select-header-preview-frame.png")
    if preview_frame_path is not None:
        preview_frame = clean_transparent_asset(open_rgba(preview_frame_path), pad=2)
        save_image(preview_frame, stage_select_root / "preview_frame.png")

    route_card_sheet_path = choose_existing_optional("07-stage-select-route-card-frame-sheet.png")
    if route_card_sheet_path is not None:
        route_card_sheet = open_rgba(route_card_sheet_path)
        route_card_crops = {
            "route_card_open.png": (0, 0, 384, 1024),
            "route_card_locked.png": (384, 0, 768, 1024),
            "route_card_selected.png": (768, 0, 1152, 1024),
            "route_card_boss.png": (1152, 0, 1536, 1024),
        }
        for filename, crop in route_card_crops.items():
            route_card = clean_transparent_asset(route_card_sheet.crop(crop), pad=2)
            save_image(route_card, stage_select_root / filename)

    top_hud_path = choose_existing_optional("08-battle-top-hud-frame-remake.png")
    if top_hud_path is not None:
        top_hud = clean_transparent_asset(open_rgba(top_hud_path), pad=2)
        save_image(top_hud, battle_root / "top_hud_frame.png")

    bottom_command_path = choose_existing_optional(
        "07-battle-bottom-command-bar-frame-remake.png",
        "09-battle-bottom-command-bar-frame-remake.png",
    )
    if bottom_command_path is not None:
        bottom_command = clean_subject_asset(open_rgba(bottom_command_path), pad=6)
        save_image(bottom_command, battle_root / "bottom_command_frame.png")

    result_clear_path = choose_existing_optional(
        "08-battle-result-clear-frame-remake.png",
        "04-result-clear-screen-final-frame.png",
        "10-result-clear-frame-remake.png",
    )
    if result_clear_path is not None:
        result_clear = clean_subject_asset(open_rgba(result_clear_path), pad=2)
        save_image(result_clear, battle_root / "result_clear_frame.png")

    result_fail_path = choose_existing_optional(
        "05-optional-result-fail-screen-matching-frame.png",
        "11-result-fail-frame-remake.png",
    )
    if result_fail_path is not None:
        result_fail = clean_subject_asset(open_rgba(result_fail_path), pad=2)
        save_image(result_fail, battle_root / "result_fail_frame.png")

    if (IMAGE_ROOT / "02-lumen-shop-ui-frame-set.png").exists():
        shop_sheet = open_rgba(IMAGE_ROOT / "02-lumen-shop-ui-frame-set.png")
        shop_crops = {
            "shop_header_frame.png": (74, 43, 697, 144),
            "shop_feature_frame.png": (80, 238, 688, 545),
            "shop_list_frame.png": (768, 68, 1280, 754),
            "shop_footer_frame.png": (80, 611, 693, 736),
            "shop_bottom_bar.png": (104, 812, 1427, 938),
            "shop_scroll_up.png": (1320, 331, 1457, 432),
            "shop_scroll_down.png": (1320, 450, 1458, 544),
        }
        for filename, crop in shop_crops.items():
            asset = clean_transparent_asset(shop_sheet.crop(crop), pad=4)
            save_image(asset, town_ui_root / filename)


def main() -> None:
    export_palace_assets()
    export_palace_dialogue_portraits()
    export_town_landmarks_and_props()
    export_world_map_assets()
    export_ui_assets()


if __name__ == "__main__":
    main()

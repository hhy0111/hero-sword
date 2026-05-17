from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import remove as rembg_remove


ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "image"
PUBLIC_ROOT = ROOT / "public" / "assets" / "world" / "town" / "shop-refresh"

SHOP_IDS = [
    "weapon_shop",
    "armor_shop",
    "item_shop",
    "forge_shop",
    "relic_shop",
]


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def open_rgba(name: str) -> Image.Image:
    return Image.open(IMAGE_ROOT / name).convert("RGBA")


def stage_exists(name: str) -> bool:
    return (IMAGE_ROOT / name).exists()


def public_asset_path(relative_path: str) -> Path:
    return PUBLIC_ROOT / relative_path


def open_public_rgba(relative_path: str) -> Image.Image:
    return Image.open(public_asset_path(relative_path)).convert("RGBA")


def ensure_existing_assets(*relative_paths: str) -> None:
    missing = [relative_path for relative_path in relative_paths if not public_asset_path(relative_path).exists()]
    if missing:
        joined = ", ".join(missing)
        raise FileNotFoundError(f"Missing required exported assets: {joined}")


def save_image(image: Image.Image, relative_path: str) -> None:
    target = PUBLIC_ROOT / relative_path
    ensure_dir(target.parent)
    image.save(target)


def connected_mask(candidate: np.ndarray) -> np.ndarray:
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

    return visited


def remove_checkerboard_background(image: Image.Image) -> Image.Image:
    result = image.convert("RGBA")
    pixels = np.array(result)
    rgb = pixels[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)

    background_candidate = (
        ((brightness >= 205) & (saturation <= 38))
        | ((brightness >= 182) & (saturation <= 24))
    ) & (pixels[:, :, 3] > 0)
    pixels[:, :, 3][connected_mask(background_candidate)] = 0
    return Image.fromarray(pixels, mode="RGBA")


def trim_alpha(image: Image.Image, pad: int = 4) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
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


def clean_checker_asset(image: Image.Image, pad: int = 4) -> Image.Image:
    return trim_alpha(remove_checkerboard_background(image), pad=pad)


def clean_subject_asset(image: Image.Image, pad: int = 4) -> Image.Image:
    removed = rembg_remove(image.convert("RGBA"))
    if not isinstance(removed, Image.Image):
        raise TypeError("rembg did not return an image")
    return trim_alpha(removed.convert("RGBA"), pad=pad)


def clear_checker_fill_pixels(image: Image.Image) -> Image.Image:
    pixels = np.array(image.convert("RGBA"))
    rgb = pixels[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    candidate = (brightness >= 198) & (saturation <= 18) & (pixels[:, :, 3] > 0)
    pixels[candidate, 3] = 0
    return Image.fromarray(pixels, mode="RGBA")


def remove_dark_edge_background(
    image: Image.Image,
    *,
    brightness_threshold: int = 28,
    saturation_threshold: int = 26,
) -> Image.Image:
    pixels = np.array(image.convert("RGBA"))
    rgb = pixels[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    candidate = (
        (brightness <= brightness_threshold)
        & (saturation <= saturation_threshold)
        & (pixels[:, :, 3] > 0)
    )
    pixels[:, :, 3][connected_mask(candidate)] = 0
    return Image.fromarray(pixels, mode="RGBA")


def build_soft_shadow_overlay(image: Image.Image, alpha_scale: float = 5.4) -> Image.Image:
    rgba = np.array(image.convert("RGBA")).astype(np.int16)
    edge_rgb = np.concatenate(
        [
            rgba[0, :, :3],
            rgba[-1, :, :3],
            rgba[:, 0, :3],
            rgba[:, -1, :3],
        ],
        axis=0,
    )
    background_luma = edge_rgb.mean(axis=1).mean()
    pixel_luma = rgba[:, :, :3].mean(axis=2)
    alpha = np.clip((background_luma - pixel_luma) * alpha_scale, 0, 255).astype(np.uint8)

    overlay = np.zeros((rgba.shape[0], rgba.shape[1], 4), dtype=np.uint8)
    overlay[:, :, 3] = alpha
    return trim_alpha(Image.fromarray(overlay, mode="RGBA"), pad=0)


def fit_pixel_art(image: Image.Image, max_size: int, *, min_scale: int = 1, max_scale: int = 4) -> Image.Image:
    width, height = image.size
    if width == 0 or height == 0:
        return image

    largest = max(width, height)
    scale_up = max(min_scale, min(max_scale, max_size // max(1, largest)))
    if scale_up > 1:
        image = image.resize((width * scale_up, height * scale_up), Image.NEAREST)
        width, height = image.size
        largest = max(width, height)

    if largest > max_size:
        ratio = max_size / largest
        width = max(1, round(width * ratio))
        height = max(1, round(height * ratio))
        image = image.resize((width, height), Image.NEAREST)

    return image


def place_on_canvas(image: Image.Image, canvas_size: int) -> Image.Image:
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    offset_x = (canvas_size - image.width) // 2
    offset_y = (canvas_size - image.height) // 2
    canvas.alpha_composite(image, (offset_x, offset_y))
    return canvas


def save_visual_pair(base_id: str, source: Image.Image) -> None:
    thumb = place_on_canvas(fit_pixel_art(source, 96, max_scale=3), 96)
    detail = place_on_canvas(fit_pixel_art(source, 240, max_scale=4), 240)
    save_image(thumb, f"items/{base_id}_thumb.png")
    save_image(detail, f"items/{base_id}_detail.png")


def save_detail_only(base_id: str, source: Image.Image) -> None:
    detail = place_on_canvas(fit_pixel_art(source, 240, max_scale=4), 240)
    save_image(detail, f"items/{base_id}_detail.png")


def save_thumb_only(base_id: str, source: Image.Image) -> None:
    thumb = place_on_canvas(fit_pixel_art(source, 96, max_scale=3), 96)
    save_image(thumb, f"items/{base_id}_thumb.png")


def detect_component_boxes(image: Image.Image, *, min_area: int = 250) -> list[tuple[int, int, int, int]]:
    rgba = np.array(image.convert("RGBA"))
    mask = rgba[:, :, 3] > 0
    height, width = mask.shape
    visited = np.zeros((height, width), dtype=bool)
    boxes: list[tuple[int, int, int, int]] = []

    for y in range(height):
        for x in range(width):
            if not mask[y, x] or visited[y, x]:
                continue

            queue: deque[tuple[int, int]] = deque([(y, x)])
            visited[y, x] = True
            area = 0
            min_x = max_x = x
            min_y = max_y = y

            while queue:
                current_y, current_x = queue.popleft()
                area += 1
                min_x = min(min_x, current_x)
                max_x = max(max_x, current_x)
                min_y = min(min_y, current_y)
                max_y = max(max_y, current_y)
                for next_y, next_x in (
                    (current_y - 1, current_x),
                    (current_y + 1, current_x),
                    (current_y, current_x - 1),
                    (current_y, current_x + 1),
                ):
                    if (
                        0 <= next_y < height
                        and 0 <= next_x < width
                        and mask[next_y, next_x]
                        and not visited[next_y, next_x]
                    ):
                        visited[next_y, next_x] = True
                        queue.append((next_y, next_x))

            if area >= min_area:
                boxes.append((min_x, min_y, max_x + 1, max_y + 1))

    boxes.sort(key=lambda box: (box[1], box[0]))
    return boxes


def export_shop_backgrounds() -> None:
    if stage_exists("02-calm-purchase-background-set.png"):
        purchase_sheet = open_rgba("02-calm-purchase-background-set.png")
        slice_edges = [0, 307, 614, 921, 1228, purchase_sheet.width]
        for index, shop_id in enumerate(SHOP_IDS):
            crop = purchase_sheet.crop((slice_edges[index], 0, slice_edges[index + 1], purchase_sheet.height))
            save_image(crop, f"backgrounds/{shop_id}_purchase.png")
    else:
        ensure_existing_assets(*(f"backgrounds/{shop_id}_purchase.png" for shop_id in SHOP_IDS))

    if stage_exists("01-runtime-shop-movement-background-set.png"):
        movement_sheet = open_rgba("01-runtime-shop-movement-background-set.png")
        for shop_id, box in zip(
            SHOP_IDS,
            [
                (14, 11, 416, 604),
                (438, 11, 840, 604),
                (15, 626, 417, 1219),
                (438, 626, 840, 1219),
                (220, 1240, 635, 1833),
            ],
            strict=True,
        ):
            save_image(movement_sheet.crop(box), f"interiors/{shop_id}.png")
    else:
        ensure_existing_assets(*(f"interiors/{shop_id}.png" for shop_id in SHOP_IDS))


def export_shop_ui_assets() -> None:
    if stage_exists("03-shop-purchase-frame-and-panel-sheet.png"):
        frame_sheet = open_rgba("03-shop-purchase-frame-and-panel-sheet.png")
        save_image(frame_sheet.crop((48, 57, 570, 869)), "ui/main_frame.png")
        save_image(frame_sheet.crop((608, 237, 976, 1055)), "ui/detail_outer_frame.png")
        save_image(frame_sheet.crop((47, 1144, 573, 1456)), "ui/detail_footer_panel.png")
    else:
        ensure_existing_assets("ui/main_frame.png", "ui/detail_outer_frame.png", "ui/detail_footer_panel.png")

    if stage_exists("05-scroll-list-row-card-and-scrollbar-sheet.png"):
        row_sheet = open_rgba("05-scroll-list-row-card-and-scrollbar-sheet.png")
        save_image(row_sheet.crop((80, 72, 941, 212)), "ui/offer_row_normal.png")
        save_image(row_sheet.crop((80, 263, 944, 400)), "ui/offer_row_selected.png")
        save_image(row_sheet.crop((939, 842, 986, 1312)), "ui/scroll_bar_vertical.png")
    else:
        ensure_existing_assets("ui/offer_row_normal.png", "ui/offer_row_selected.png", "ui/scroll_bar_vertical.png")

    if stage_exists("06-inventory-grid-slot-detail-stage-and-sell-plate-sheet.png"):
        inventory_sheet = open_rgba("06-inventory-grid-slot-detail-stage-and-sell-plate-sheet.png")
        save_image(clean_checker_asset(inventory_sheet.crop((45, 216, 169, 355)), pad=0), "ui/bag_slot_normal.png")
        save_image(clean_checker_asset(inventory_sheet.crop((45, 371, 169, 511)), pad=0), "ui/bag_slot_selected.png")
        detail_stage = clean_checker_asset(inventory_sheet.crop((479, 87, 971, 772)), pad=0)
        save_image(clear_checker_fill_pixels(detail_stage), "ui/detail_stage.png")
        save_image(clean_checker_asset(inventory_sheet.crop((379, 796, 971, 1237)), pad=0), "ui/detail_text_panel.png")
    else:
        ensure_existing_assets(
            "ui/bag_slot_normal.png",
            "ui/bag_slot_selected.png",
            "ui/detail_stage.png",
            "ui/detail_text_panel.png",
        )
        detail_stage = open_public_rgba("ui/detail_stage.png")
        save_image(clear_checker_fill_pixels(detail_stage), "ui/detail_stage.png")

    if stage_exists("11-shop-ui-header-and-badge-accent-pack.png"):
        header_sheet = clean_checker_asset(open_rgba("11-shop-ui-header-and-badge-accent-pack.png"), pad=0)
        save_image(header_sheet.crop((61, 40, 1466, 244)), "ui/header_bar.png")

        icon_boxes = [
            (126, 292, 326, 514),
            (395, 304, 593, 514),
            (654, 304, 848, 515),
            (911, 304, 1103, 514),
            (1162, 304, 1351, 514),
        ]
        for shop_id, box in zip(SHOP_IDS, icon_boxes, strict=True):
            save_image(header_sheet.crop(box), f"icons/{shop_id}.png")
    else:
        ensure_existing_assets("ui/header_bar.png", *(f"icons/{shop_id}.png" for shop_id in SHOP_IDS))

    if stage_exists("04-compact-header-currency-strip-and-tab-sheet.png"):
        compact_sheet = open_rgba("04-compact-header-currency-strip-and-tab-sheet.png")
        section_bar = clean_subject_asset(compact_sheet.crop((78, 858, 946, 933)), pad=0)
        save_image(section_bar, "ui/section_bar.png")
    else:
        ensure_existing_assets("ui/section_bar.png")


def export_merchant_assets() -> None:
    if not stage_exists("07-marta.png") or not stage_exists("08-torren.png"):
        ensure_existing_assets("merchants/armor_counter.png", "merchants/forge_counter.png")
        return

    marta_sheet = clean_checker_asset(open_rgba("07-marta.png"), pad=0)
    torren_sheet = clean_subject_asset(open_rgba("08-torren.png"), pad=0)

    marta_boxes = detect_component_boxes(marta_sheet, min_area=5000)
    torren_boxes = detect_component_boxes(torren_sheet, min_area=5000)

    save_image(trim_alpha(marta_sheet.crop(marta_boxes[3]), pad=4), "merchants/armor_counter.png")
    save_image(trim_alpha(torren_sheet.crop(torren_boxes[6]), pad=4), "merchants/forge_counter.png")


def export_item_visuals() -> None:
    export_weapon_visuals()
    export_armor_visuals()
    export_forge_relic_visuals()
    export_consumable_visuals()
    export_misc_visuals()


def export_weapon_visuals() -> None:
    weapon_base_ids = [
        "weapon_sword_basic",
        "weapon_sword_oath",
        "weapon_greatsword",
        "weapon_spear",
        "weapon_hammer",
        "weapon_bow",
        "weapon_crystal_staff",
        "weapon_orb_staff",
    ]
    ensure_existing_assets(*(f"items/{base_id}_detail.png" for base_id in weapon_base_ids))
    detail_cache = {base_id: open_public_rgba(f"items/{base_id}_detail.png") for base_id in weapon_base_ids}
    detail_sources = {
        "weapon_sword_basic": "weapon_spear",
        "weapon_sword_oath": "weapon_greatsword",
        "weapon_greatsword": "weapon_sword_basic",
        "weapon_spear": "weapon_sword_oath",
        "weapon_hammer": "weapon_orb_staff",
        "weapon_bow": "weapon_bow",
        "weapon_crystal_staff": "weapon_crystal_staff",
        "weapon_orb_staff": "weapon_hammer",
    }
    for base_id, source_base_id in detail_sources.items():
        save_image(detail_cache[source_base_id], f"items/{base_id}_detail.png")

    if not stage_exists("07-weapon-thumbnail-icon-sheet.png"):
        ensure_existing_assets(*(f"items/{base_id}_thumb.png" for base_id in weapon_base_ids))
        return

    weapon_sheet = clean_checker_asset(open_rgba("07-weapon-thumbnail-icon-sheet.png"), pad=0)
    weapon_boxes = detect_component_boxes(weapon_sheet, min_area=300)
    thumb_sources = {
        "weapon_sword_basic": weapon_boxes[2],
        "weapon_sword_oath": weapon_boxes[1],
        "weapon_greatsword": weapon_boxes[0],
        "weapon_spear": weapon_boxes[3],
        "weapon_hammer": weapon_boxes[4],
        "weapon_bow": weapon_boxes[5],
        "weapon_crystal_staff": weapon_boxes[8],
        "weapon_orb_staff": weapon_boxes[6],
    }
    for base_id, box in thumb_sources.items():
        save_thumb_only(base_id, trim_alpha(weapon_sheet.crop(box), pad=4))


def export_armor_visuals() -> None:
    armor_base_ids = [
        "armor_plate",
        "armor_chain",
        "armor_leather",
        "armor_cloak",
        "armor_hood",
    ]
    ensure_existing_assets(*(f"items/{base_id}_detail.png" for base_id in armor_base_ids))
    if not stage_exists("08-armor-thumbnail-icon-sheet.png"):
        ensure_existing_assets(*(f"items/{base_id}_thumb.png" for base_id in armor_base_ids))
        return

    armor_sheet = clean_checker_asset(open_rgba("08-armor-thumbnail-icon-sheet.png"), pad=0)
    armor_boxes = detect_component_boxes(armor_sheet, min_area=300)
    thumb_sources = {
        "armor_plate": armor_boxes[0],
        "armor_chain": armor_boxes[3],
        "armor_leather": armor_boxes[2],
        "armor_cloak": armor_boxes[1],
        "armor_hood": armor_boxes[5],
    }
    for base_id, box in thumb_sources.items():
        source = trim_alpha(armor_sheet.crop(box), pad=4)
        save_thumb_only(base_id, source)
        if base_id == "armor_hood":
            save_detail_only(base_id, source)


def export_forge_relic_visuals() -> None:
    forge_base_ids = [
        "forge_ingot",
        "forge_ember_core",
        "forge_bundle",
        "forge_anvil_token",
    ]
    relic_base_ids = [
        "relic_sun_coin",
        "relic_seal",
        "relic_bracelet",
        "relic_lantern",
    ]
    all_base_ids = [*forge_base_ids, *relic_base_ids]
    ensure_existing_assets(*(f"items/{base_id}_detail.png" for base_id in all_base_ids))
    detail_cache = {base_id: open_public_rgba(f"items/{base_id}_detail.png") for base_id in all_base_ids}
    detail_sources = {
        "forge_ingot": "forge_bundle",
        "forge_ember_core": "forge_ember_core",
        "forge_bundle": "forge_anvil_token",
        "forge_anvil_token": "forge_ingot",
        "relic_sun_coin": "relic_bracelet",
        "relic_seal": "relic_seal",
        "relic_bracelet": "relic_lantern",
        "relic_lantern": "relic_sun_coin",
    }
    for base_id, source_base_id in detail_sources.items():
        save_image(detail_cache[source_base_id], f"items/{base_id}_detail.png")

    if stage_exists("10-forge-material-thumbnail-icon-sheet.png"):
        forge_sheet = clean_checker_asset(open_rgba("10-forge-material-thumbnail-icon-sheet.png"), pad=0)
        forge_boxes = detect_component_boxes(forge_sheet, min_area=300)
        forge_thumb_sources = {
            "forge_ingot": forge_boxes[3],
            "forge_ember_core": forge_boxes[4],
            "forge_bundle": forge_boxes[11],
            "forge_anvil_token": forge_boxes[8],
        }
        for base_id, box in forge_thumb_sources.items():
            save_thumb_only(base_id, trim_alpha(forge_sheet.crop(box), pad=4))
    else:
        ensure_existing_assets(*(f"items/{base_id}_thumb.png" for base_id in forge_base_ids))

    if stage_exists("11-relic-thumbnail-icon-sheet.png"):
        relic_sheet = clean_checker_asset(open_rgba("11-relic-thumbnail-icon-sheet.png"), pad=0)
        relic_boxes = detect_component_boxes(relic_sheet, min_area=300)
        relic_thumb_sources = {
            "relic_sun_coin": relic_boxes[2],
            "relic_seal": relic_boxes[1],
            "relic_bracelet": relic_boxes[4],
            "relic_lantern": relic_boxes[5],
        }
        for base_id, box in relic_thumb_sources.items():
            save_thumb_only(base_id, trim_alpha(relic_sheet.crop(box), pad=4))
    else:
        ensure_existing_assets(*(f"items/{base_id}_thumb.png" for base_id in relic_base_ids))


def export_consumable_visuals() -> None:
    consumable_base_ids = [
        "consumable_red_potion",
        "consumable_blue_vial",
        "consumable_blue_bottle",
        "consumable_green_flask",
        "consumable_purple_vial",
        "consumable_amber_oil",
        "consumable_food_pack",
        "consumable_tool_box",
        "consumable_smoke_bomb",
        "consumable_charm",
    ]
    ensure_existing_assets(*(f"items/{base_id}_thumb.png" for base_id in consumable_base_ids))
    ensure_existing_assets(*(f"items/{base_id}_detail.png" for base_id in consumable_base_ids))
    for base_id in consumable_base_ids:
        detail = open_public_rgba(f"items/{base_id}_detail.png")
        cleaned = remove_dark_edge_background(detail)
        trimmed = trim_alpha(cleaned, pad=8)
        save_detail_only(base_id, trimmed)


def export_misc_visuals() -> None:
    misc_base_ids = [
        "supply_padding_roll",
        "icon_weapon_shop",
        "icon_armor_shop",
        "icon_item_shop",
        "icon_forge_shop",
        "icon_relic_shop",
    ]
    ensure_existing_assets(*(f"items/{base_id}_thumb.png" for base_id in misc_base_ids))
    ensure_existing_assets(*(f"items/{base_id}_detail.png" for base_id in misc_base_ids))


def export_shop_decor_assets() -> None:
    required_outputs = [f"decor/{shop_id}_floor_prop.png" for shop_id in SHOP_IDS]
    required_inputs = [
        "02-weapon-shop-prop-set.png",
        "03-armor-shop-prop-set.png",
        "04-item-shop-supply-prop-set.png",
        "05-forge-interior-prop-set.png",
        "06-relic-shop-prop-set.png",
    ]
    if not all(stage_exists(name) for name in required_inputs):
        ensure_existing_assets(*required_outputs)
        return

    weapon_sheet = open_rgba("02-weapon-shop-prop-set.png")
    armor_sheet = open_rgba("03-armor-shop-prop-set.png")
    item_sheet = open_rgba("04-item-shop-supply-prop-set.png")
    forge_sheet = open_rgba("05-forge-interior-prop-set.png")
    relic_sheet = open_rgba("06-relic-shop-prop-set.png")

    save_image(
        clean_subject_asset(weapon_sheet.crop((45, 864, 440, 1114)), pad=4),
        "decor/weapon_shop_floor_prop.png",
    )
    save_image(
        clean_subject_asset(armor_sheet.crop((523, 468, 973, 649)), pad=4),
        "decor/armor_shop_floor_prop.png",
    )
    save_image(
        clean_subject_asset(item_sheet.crop((84, 1095, 549, 1357)), pad=4),
        "decor/item_shop_floor_prop.png",
    )
    save_image(
        clean_subject_asset(forge_sheet.crop((92, 1258, 467, 1466)), pad=4),
        "decor/forge_shop_floor_prop.png",
    )
    save_image(
        clean_subject_asset(relic_sheet.crop((41, 1237, 372, 1435)), pad=4),
        "decor/relic_shop_floor_prop.png",
    )


def export_shop_marker_assets() -> None:
    if not stage_exists("09-shop-sign-and-category-icon-set.png"):
        ensure_existing_assets(*(f"markers/{shop_id}.png" for shop_id in SHOP_IDS))
        return

    marker_sheet = clean_checker_asset(open_rgba("09-shop-sign-and-category-icon-set.png"), pad=0)
    marker_boxes = {
        "weapon_shop": (94, 88, 280, 376),
        "armor_shop": (370, 88, 556, 376),
        "item_shop": (646, 88, 832, 377),
        "forge_shop": (922, 90, 1108, 380),
        "relic_shop": (1196, 90, 1382, 380),
    }
    for shop_id, box in marker_boxes.items():
        save_image(trim_alpha(marker_sheet.crop(box), pad=2), f"markers/{shop_id}.png")


def export_shop_overlay_assets() -> None:
    if not stage_exists("10-indoor-lighting-and-shadow-overlay-set.png"):
        ensure_existing_assets("overlays/interior_top_shadow.png")
        return

    lighting_sheet = open_rgba("10-indoor-lighting-and-shadow-overlay-set.png")
    interior_top_shadow = build_soft_shadow_overlay(lighting_sheet.crop((86, 70, 946, 136)))
    save_image(interior_top_shadow, "overlays/interior_top_shadow.png")


def main() -> None:
    export_shop_backgrounds()
    export_shop_ui_assets()
    export_merchant_assets()
    export_item_visuals()
    export_shop_decor_assets()
    export_shop_marker_assets()
    export_shop_overlay_assets()


if __name__ == "__main__":
    main()

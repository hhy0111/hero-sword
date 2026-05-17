from __future__ import annotations

from collections import deque
from pathlib import Path
from typing import Iterable

from PIL import Image
from rembg import remove as rembg_remove


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "assets" / "source" / "world" / "pixel-town-rework" / "approved"
REFERENCE_FACADE_ROOT = ROOT / "assets" / "source" / "world" / "reference-concepts" / "shop-facades"
RUNTIME_ROOT = ROOT / "public" / "assets" / "world" / "town"


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def open_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def remove_light_background(image: Image.Image, threshold: int = 238) -> Image.Image:
    image = image.copy()
    pixels = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if max(r, g, b) >= threshold and max(r, g, b) - min(r, g, b) < 30:
                pixels[x, y] = (r, g, b, 0)
    return image


def remove_checkerboard_background(image: Image.Image) -> Image.Image:
    image = image.copy().convert("RGBA")
    pixels = image.load()
    width, height = image.size
    visited = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    def qualifies(pixel: tuple[int, int, int, int]) -> bool:
        r, g, b, a = pixel
        if a == 0:
            return False
        brightness = (r + g + b) / 3
        delta = max(r, g, b) - min(r, g, b)
        return brightness >= 188 and delta <= 42

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        current_x, current_y = queue.popleft()
        if not (0 <= current_x < width and 0 <= current_y < height):
            continue
        if visited[current_y][current_x]:
            continue
        visited[current_y][current_x] = True

        pixel = pixels[current_x, current_y]
        if not qualifies(pixel):
            continue

        r, g, b, _ = pixel
        pixels[current_x, current_y] = (r, g, b, 0)
        queue.extend(
            (
                (current_x + 1, current_y),
                (current_x - 1, current_y),
                (current_x, current_y + 1),
                (current_x, current_y - 1),
            )
        )

    return image


def remove_edge_neutral_background(
    image: Image.Image,
    *,
    min_brightness: int = 215,
    max_channel_delta: int = 40,
) -> Image.Image:
    image = image.copy().convert("RGBA")
    pixels = image.load()
    width, height = image.size
    visited = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    def qualifies(pixel: tuple[int, int, int, int]) -> bool:
        r, g, b, a = pixel
        if a == 0:
            return False
        return max(r, g, b) >= min_brightness and max(r, g, b) - min(r, g, b) <= max_channel_delta

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        current_x, current_y = queue.popleft()
        if not (0 <= current_x < width and 0 <= current_y < height):
            continue
        if visited[current_y][current_x]:
            continue

        visited[current_y][current_x] = True
        if not qualifies(pixels[current_x, current_y]):
            continue

        r, g, b, _ = pixels[current_x, current_y]
        pixels[current_x, current_y] = (r, g, b, 0)
        queue.extend(
            (
                (current_x + 1, current_y),
                (current_x - 1, current_y),
                (current_x, current_y + 1),
                (current_x, current_y - 1),
            )
        )

    return image


def remove_dark_background(image: Image.Image, threshold: int = 165) -> Image.Image:
    image = image.copy()
    pixels = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if max(r, g, b) <= threshold and max(r, g, b) - min(r, g, b) < 24:
                pixels[x, y] = (r, g, b, 0)
    return image


def remove_orange_background(image: Image.Image) -> Image.Image:
    image = image.copy()
    pixels = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if r > 120 and r > g * 1.08 and g > b * 1.08 and b < 130:
                pixels[x, y] = (r, g, b, 0)
    return image


def color_distance(left: tuple[int, int, int, int], right: tuple[int, int, int, int]) -> int:
    return abs(left[0] - right[0]) + abs(left[1] - right[1]) + abs(left[2] - right[2])


def remove_edge_background(image: Image.Image, tolerance: int = 55) -> Image.Image:
    image = image.copy().convert("RGBA")
    pixels = image.load()
    width, height = image.size
    visited = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int, tuple[int, int, int, int]]] = deque()

    seeds: list[tuple[int, int]] = []
    for x in range(width):
        seeds.append((x, 0))
        seeds.append((x, height - 1))
    for y in range(height):
        seeds.append((0, y))
        seeds.append((width - 1, y))

    for seed_x, seed_y in seeds:
        if visited[seed_y][seed_x]:
            continue

        visited[seed_y][seed_x] = True
        seed_pixel = pixels[seed_x, seed_y]
        queue.append((seed_x, seed_y, seed_pixel))

        while queue:
            current_x, current_y, seed_pixel = queue.popleft()
            r, g, b, a = pixels[current_x, current_y]
            if a != 0 and color_distance((r, g, b, a), seed_pixel) <= tolerance:
                pixels[current_x, current_y] = (r, g, b, 0)
            else:
                continue

            for next_x, next_y in (
                (current_x + 1, current_y),
                (current_x - 1, current_y),
                (current_x, current_y + 1),
                (current_x, current_y - 1),
            ):
                if 0 <= next_x < width and 0 <= next_y < height and not visited[next_y][next_x]:
                    visited[next_y][next_x] = True
                    queue.append((next_x, next_y, seed_pixel))

    return image


def crop_and_trim(image: Image.Image, box: tuple[int, int, int, int], trim_alpha: int = 8) -> Image.Image:
    cropped = image.crop(box)
    bbox = cropped.getbbox()
    if bbox is None:
        return cropped

    left, top, right, bottom = bbox
    left = max(0, left - trim_alpha)
    top = max(0, top - trim_alpha)
    right = min(cropped.width, right + trim_alpha)
    bottom = min(cropped.height, bottom + trim_alpha)
    return cropped.crop((left, top, right, bottom))


def trim_to_alpha(image: Image.Image, trim_alpha: int = 8) -> Image.Image:
    bbox = image.getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    left = max(0, left - trim_alpha)
    top = max(0, top - trim_alpha)
    right = min(image.width, right + trim_alpha)
    bottom = min(image.height, bottom + trim_alpha)
    return image.crop((left, top, right, bottom))


def remove_subject_background(image: Image.Image) -> Image.Image:
    removed = rembg_remove(image.convert("RGBA"))
    if not isinstance(removed, Image.Image):
        raise TypeError("rembg did not return a PIL image")
    return removed.convert("RGBA")


def inset_region(region: tuple[int, int, int, int], inset: int) -> tuple[int, int, int, int]:
    left, top, right, bottom = region
    return (left + inset, top + inset, right - inset, bottom - inset)


def connected_components(image: Image.Image, *, min_pixels: int = 50) -> list[tuple[int, int, int, int, int]]:
    pixels = image.load()
    width, height = image.size
    seen = [[False] * width for _ in range(height)]
    boxes: list[tuple[int, int, int, int, int]] = []

    for y in range(height):
        for x in range(width):
            if seen[y][x] or pixels[x, y][3] == 0:
                continue

            queue = deque([(x, y)])
            seen[y][x] = True
            min_x = max_x = x
            min_y = max_y = y
            count = 0

            while queue:
                current_x, current_y = queue.popleft()
                count += 1
                min_x = min(min_x, current_x)
                min_y = min(min_y, current_y)
                max_x = max(max_x, current_x)
                max_y = max(max_y, current_y)

                for next_x, next_y in (
                    (current_x + 1, current_y),
                    (current_x - 1, current_y),
                    (current_x, current_y + 1),
                    (current_x, current_y - 1),
                ):
                    if 0 <= next_x < width and 0 <= next_y < height and not seen[next_y][next_x] and pixels[next_x, next_y][3] != 0:
                        seen[next_y][next_x] = True
                        queue.append((next_x, next_y))

            if count >= min_pixels:
                boxes.append((min_x, min_y, max_x + 1, max_y + 1, count))

    return boxes


def pack_frames(frames: Iterable[Image.Image], output_path: Path) -> tuple[int, int]:
    frames = list(frames)
    if not frames:
        raise RuntimeError(f"No frames available for {output_path}")

    frame_width = max(frame.width for frame in frames)
    frame_height = max(frame.height for frame in frames)
    strip = Image.new("RGBA", (frame_width * len(frames), frame_height), (0, 0, 0, 0))

    for index, frame in enumerate(frames):
        offset_x = index * frame_width + (frame_width - frame.width) // 2
        offset_y = frame_height - frame.height
        strip.paste(frame, (offset_x, offset_y), frame)

    ensure_dir(output_path.parent)
    strip.save(output_path)
    return frame_width, frame_height


def save_single(image: Image.Image, output_path: Path) -> None:
    ensure_dir(output_path.parent)
    image.save(output_path)


def select_largest_component(image: Image.Image, *, min_pixels: int = 400) -> tuple[int, int, int, int]:
    boxes = connected_components(image, min_pixels=min_pixels)
    if not boxes:
        raise RuntimeError("No component found")
    return max(boxes, key=lambda entry: entry[4])[:4]


def extract_largest_from_region(
    source_path: Path,
    *,
    region: tuple[int, int, int, int],
    background: str = "light",
    min_pixels: int = 180,
    trim_alpha: int = 6,
) -> Image.Image:
    image = open_rgba(source_path)
    if background == "light":
        image = remove_light_background(image)
    elif background == "dark":
        image = remove_dark_background(image)
    elif background == "orange":
        image = remove_orange_background(image)

    cropped = image.crop(region)
    box = select_largest_component(cropped, min_pixels=min_pixels)
    return crop_and_trim(cropped, box, trim_alpha=trim_alpha)


def extract_exact_region(
    source_path: Path,
    *,
    region: tuple[int, int, int, int],
    background: str = "light",
    trim_alpha: int = 6,
    light_threshold: int = 232,
    edge_cleanup: bool = False,
    edge_tolerance: int = 55,
) -> Image.Image:
    image = open_rgba(source_path)
    if background == "light":
        image = remove_light_background(image, threshold=light_threshold)
    elif background == "dark":
        image = remove_dark_background(image)
    elif background == "orange":
        image = remove_orange_background(image)

    cropped = image.crop(region)
    if edge_cleanup:
        cropped = remove_edge_background(cropped, tolerance=edge_tolerance)
    if background == "light":
        cropped = remove_light_background(cropped, threshold=light_threshold)
    return trim_to_alpha(cropped, trim_alpha=trim_alpha)


def extract_row_frames(
    source_path: Path,
    *,
    region: tuple[int, int, int, int],
    frame_filter: tuple[int, int, int, int],
    background: str,
    expected_count: int,
) -> list[Image.Image]:
    image = open_rgba(source_path)
    image = remove_light_background(image)

    if background == "dark":
        image = remove_dark_background(image)
    elif background == "orange":
        image = remove_orange_background(image)

    cropped = image.crop(region)
    min_width, max_width, min_height, max_height = frame_filter
    boxes = [
        box
        for box in connected_components(cropped, min_pixels=60)
        if min_width <= box[2] - box[0] <= max_width and min_height <= box[3] - box[1] <= max_height
    ]
    boxes = sorted(boxes, key=lambda entry: (entry[0], entry[1]))
    if len(boxes) < expected_count:
        raise RuntimeError(f"Expected {expected_count} frames in {source_path.name}, found {len(boxes)}")

    frames = [crop_and_trim(cropped, box[:4], trim_alpha=6) for box in boxes[:expected_count]]
    return frames


def generate():
    ensure_dir(RUNTIME_ROOT)

    buildings_dir = RUNTIME_ROOT / "buildings"
    landmarks_dir = RUNTIME_ROOT / "landmarks"
    outdoor_tiles_dir = RUNTIME_ROOT / "tiles" / "outdoor"
    indoor_tiles_dir = RUNTIME_ROOT / "tiles" / "indoor"
    npcs_dir = RUNTIME_ROOT / "npcs"
    effects_dir = RUNTIME_ROOT / "effects"
    props_dir = RUNTIME_ROOT / "props"
    ui_dir = RUNTIME_ROOT / "ui"

    reference_facade_source = REFERENCE_FACADE_ROOT / "08-town-shop-facade-set-lumen-village.png"
    reference_facade_regions = {
        "weapon_shop": (20, 80, 530, 540),
        "armor_shop": (520, 80, 1000, 540),
        "item_shop": (980, 80, 1534, 540),
        "forge_shop": (220, 560, 800, 1010),
        "relic_shop": (835, 560, 1345, 1010),
    }

    relic_source = SOURCE_ROOT / "10-relic-rune-shop-exterior.png"

    for target_name, region in reference_facade_regions.items():
        if target_name == "relic_shop" and relic_source.exists():
            cleaned = remove_subject_background(open_rgba(relic_source))
            save_single(trim_to_alpha(cleaned, trim_alpha=10), buildings_dir / f"{target_name}.png")
            continue

        source_crop = open_rgba(reference_facade_source).crop(region)
        cleaned = remove_edge_background(source_crop, tolerance=24)
        save_single(trim_to_alpha(cleaned, trim_alpha=8), buildings_dir / f"{target_name}.png")

    outdoor_tile_sources = {
        "grass_plain": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (61, 43, 194, 146), "dark"),
        "grass_wild": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (219, 42, 352, 146), "dark"),
        "grass_white_flowers": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (535, 42, 669, 146), "dark"),
        "grass_yellow_flowers": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (694, 43, 827, 147), "dark"),
        "dirt_plain": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (61, 269, 194, 398), "dark"),
        "dirt_pebbles": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (220, 269, 351, 398), "dark"),
        "dirt_edge": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (535, 269, 670, 399), "dark"),
        "road_stone": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (63, 423, 194, 509), "dark"),
        "road_stone_alt": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (379, 423, 510, 509), "dark"),
        "plaza_stone": (SOURCE_ROOT / "01-lumen-outdoor-ground-tiles.png", (535, 423, 669, 509), "dark"),
    }

    for target_name, (source_path, region, background) in outdoor_tile_sources.items():
        tile = extract_exact_region(
            source_path,
            region=inset_region(region, 4),
            background=background,
            trim_alpha=0,
        )
        save_single(tile, outdoor_tiles_dir / f"{target_name}.png")

    indoor_tile_sources = {
        "wood_planks": (SOURCE_ROOT / "25-indoor-floor-material-tiles.png", (34, 260, 102, 327)),
        "dark_wood_planks": (SOURCE_ROOT / "25-indoor-floor-material-tiles.png", (338, 260, 405, 327)),
        "warm_stone": (SOURCE_ROOT / "25-indoor-floor-material-tiles.png", (635, 261, 706, 332)),
        "workshop_stone": (SOURCE_ROOT / "25-indoor-floor-material-tiles.png", (945, 261, 1012, 327)),
        "clean_brick": (SOURCE_ROOT / "25-indoor-floor-material-tiles.png", (339, 545, 410, 614)),
        "worn_brick": (SOURCE_ROOT / "25-indoor-floor-material-tiles.png", (634, 545, 709, 622)),
    }

    for target_name, (source_path, region) in indoor_tile_sources.items():
        tile = extract_exact_region(
            source_path,
            region=inset_region(region, 3),
            background="light",
            trim_alpha=0,
            light_threshold=240,
        )
        save_single(tile, indoor_tiles_dir / f"{target_name}.png")

    wall_sheet = remove_dark_background(open_rgba(SOURCE_ROOT / "03-lumen-outer-wall-gate-kit.png"))
    gate_region = trim_to_alpha(wall_sheet.crop((362, 706, 862, 865)), trim_alpha=4)
    save_single(gate_region, landmarks_dir / "gate_arch.png")
    # Keep a narrow neutral stone strip for optional wall decoration.
    wall_segment = trim_to_alpha(wall_sheet.crop((689, 172, 781, 188)), trim_alpha=2)
    save_single(wall_segment, landmarks_dir / "wall_segment.png")
    # Recut the real tower pillar. The earlier crop hit the gate threshold tile.
    wall_tower = trim_to_alpha(wall_sheet.crop((41, 720, 191, 1120)), trim_alpha=4)
    save_single(wall_tower, landmarks_dir / "wall_tower.png")

    fountain_sheet = remove_dark_background(open_rgba(SOURCE_ROOT / "04-lumen-fountain-base-kit.png"))
    fountain_crop = crop_and_trim(fountain_sheet, (70, 818, 560, 970), trim_alpha=6)
    save_single(fountain_crop, landmarks_dir / "fountain_base.png")

    entrance_sheet = remove_light_background(open_rgba(SOURCE_ROOT / "22-entrance-transition-fx-sheet.png"))
    manual_effect_strips = {
        "world_gate": [
            (368, 178, 492, 327),
            (520, 178, 658, 327),
            (684, 166, 835, 327),
            (846, 168, 998, 327),
            (1012, 178, 1146, 327),
        ],
        "interior_exit": [
            (388, 724, 526, 816),
            (552, 724, 690, 816),
            (714, 681, 853, 816),
            (878, 681, 1016, 816),
            (1041, 724, 1178, 816),
        ],
        "important_doorway": [
            (390, 973, 530, 1065),
            (554, 973, 693, 1065),
            (717, 930, 856, 1065),
            (881, 930, 1019, 1065),
            (1043, 973, 1182, 1065),
        ],
    }
    for name, boxes in manual_effect_strips.items():
        frames = [trim_to_alpha(entrance_sheet.crop(box), trim_alpha=4) for box in boxes]
        pack_frames(frames, effects_dir / f"{name}.png")

    # Shop entrance markers currently stay on the vector pulse fallback in-scene.
    # The source strip still contains sign / panel fragments that are not clean enough for runtime use.

    npc_regions = {
        "weapon_merchant": (SOURCE_ROOT / "14-weapon-merchant-sprite-sheet.png", (24, 198, 150, 418), "light", False),
        "item_merchant": (SOURCE_ROOT / "16-item-merchant-sprite-sheet.png", (24, 224, 182, 420), "light", False),
        "relic_merchant": (SOURCE_ROOT / "18-relic-rune-merchant-sprite-sheet.png", (26, 224, 154, 424), "light", False),
        "master_blacksmith": (SOURCE_ROOT / "17-master-blacksmith-sprite-sheet.png", (56, 221, 193, 457), "orange", True),
        "villager": (SOURCE_ROOT / "19-ambient-villager-sprite-set.png", (183, 226, 305, 444), "light", False),
        "traveler": (SOURCE_ROOT / "19-ambient-villager-sprite-set.png", (379, 227, 524, 444), "light", False),
        "child": (SOURCE_ROOT / "19-ambient-villager-sprite-set.png", (600, 264, 743, 444), "light", False),
        "guard_spear": (SOURCE_ROOT / "20-ambient-guard-sprite-set.png", (283, 205, 438, 410), "light", False),
        "guard_sword": (SOURCE_ROOT / "20-ambient-guard-sprite-set.png", (599, 204, 775, 410), "light", False),
        "guard_crossbow": (SOURCE_ROOT / "20-ambient-guard-sprite-set.png", (938, 205, 1114, 409), "light", False),
    }

    for name, (source_path, box, background, edge_cleanup) in npc_regions.items():
        if background == "light" and not edge_cleanup:
            source_crop = open_rgba(source_path).crop(box)
            cropped = remove_checkerboard_background(source_crop)
            cropped = remove_edge_neutral_background(cropped, min_brightness=170, max_channel_delta=48)
            cropped = trim_to_alpha(cropped, trim_alpha=4)
        else:
            cropped = extract_exact_region(
                source_path,
                region=box,
                background=background,
                trim_alpha=4,
                edge_cleanup=edge_cleanup,
                edge_tolerance=58,
            )
        save_single(cropped, npcs_dir / f"{name}.png")

    ui_sheet = remove_light_background(open_rgba(SOURCE_ROOT / "24-shop-item-list-card-ui-sheet.png"))
    save_single(ui_sheet, ui_dir / "shop_item_list_sheet.png")


if __name__ == "__main__":
    generate()

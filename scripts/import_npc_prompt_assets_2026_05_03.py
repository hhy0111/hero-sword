from __future__ import annotations

import json
import os
from collections import deque
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
from rembg import new_session, remove


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "image" / "NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03"
RUNTIME_REMAKE_SOURCE_DIR = ROOT / "image" / "NPC_2HEAD_RUNTIME_DOT_REMAKE_READY_TO_COPY_PROMPTS_2026-05-03"
PORTRAIT_OUTPUT_DIR = ROOT / "public" / "assets" / "dialogue" / "npcs"
RUNTIME_OUTPUT_DIR = ROOT / "public" / "assets" / "runtime" / "npcs"
MANIFEST_PATH = ROOT / "public" / "assets" / "runtime" / "animation-manifest.json"
OUTPUT_DIR = ROOT / "output" / "npc-prompt-import-2026-05-03"
REPORT_PATH = OUTPUT_DIR / "report.json"
PORTRAIT_REVIEW_PATH = OUTPUT_DIR / "npc_portraits_review.png"
RUNTIME_REVIEW_PATH = OUTPUT_DIR / "npc_runtime_review.png"

ALPHA_THRESHOLD = 18
REMBG_MAX_SIDE = 1024
PORTRAIT_CANVAS = 512
PORTRAIT_RENDER = 440
PORTRAIT_BOTTOM_MARGIN = 20

RUNTIME_FRAME = 64
RUNTIME_MARGIN = 4

RUNTIME_REMAKE_SOURCE_NAMES = {
    "01-orin-runtime-dot-sheet.png": "01-orin-weapon-merchant.png",
    "02-marta-runtime-dot-sheet.png": "02-marta-armor-merchant.png",
    "03-neri-runtime-dot-sheet.png": "03-neri-supply-merchant.png",
    "04-torren-runtime-dot-sheet.png": "04-torren-forge-master.png",
    "05-seline-runtime-dot-sheet.png": "05-seline-relic-merchant.png",
    "06-mayor-haru-runtime-dot-sheet.png": "06-mayor-haru-village-elder.png",
    "07-bram-runtime-dot-sheet.png": "07-bram-starter-companion-recruit-2.png",
    "08-scribe-len-runtime-dot-sheet.png": "08-scribe-len-records-keeper.png",
    "09-captain-ysold-runtime-dot-sheet.png": "09-captain-ysold-village-guard-captain.png",
    "10-quartermaster-dina-runtime-dot-sheet.png": "10-quartermaster-dina-supply-officer.png",
    "11-east-guard-runtime-dot-sheet.png": "11-east-guard-gate-watch.png",
    "12-south-guard-runtime-dot-sheet.png": "12-south-guard-garden-gate-watch.png",
    "13-rookie-sentry-runtime-dot-sheet.png": "13-rookie-sentry-young-guard.png",
    "14-plaza-villager-runtime-dot-sheet.png": "14-plaza-villager-town-resident.png",
    "15-route-runner-runtime-dot-sheet.png": "15-route-runner-messenger.png",
    "16-market-courier-runtime-dot-sheet.png": "16-market-courier-courier.png",
    "17-dock-loader-runtime-dot-sheet.png": "17-dock-loader-harbor-laborer.png",
    "18-square-bard-runtime-dot-sheet.png": "18-square-bard-plaza-performer.png",
    "19-south-ward-child-runtime-dot-sheet.png": "19-south-ward-child-village-child.png",
    "20-king-aldren-runtime-dot-sheet.png": "20-king-aldren-lumen-king.png",
    "21-queen-regent-celestine-runtime-dot-sheet.png": "21-queen-regent-celestine-lumen-queen.png",
    "22-captain-rowan-runtime-dot-sheet-2.png": "22-captain-rowan-palace-captain.png",
    "22-captain-rowan-runtime-dot-sheet.png": "22-captain-rowan-palace-captain.png",
    "23-archivist-mirel-runtime-dot-sheet.png": "23-archivist-mirel-palace-archivist.png",
    "24-chamberlain-orla-runtime-dot-sheet.png": "24-chamberlain-orla-palace-chamberlain.png",
    "25-sanctum-knight-runtime-dot-sheet.png": "25-sanctum-knight-palace-holy-guard.png",
    "26-archive-aide-runtime-dot-sheet.png": "26-archive-aide-junior-archivist.png",
    "27-garden-caretaker-runtime-dot-sheet.png": "27-garden-caretaker-palace-gardener.png",
    "28-lantern-keeper-runtime-dot-sheet.png": "28-lantern-keeper-palace-lighting-attendant.png",
    "29-gate-clerk-runtime-dot-sheet.png": "29-gate-clerk-palace-entry-clerk.png",
    "30-traveling-healer-runtime-dot-sheet.png": "30-traveling-healer-road-healer.png",
    "31-fountain-vendor-runtime-dot-sheet.png": "31-fountain-vendor-plaza-seller.png",
    "32-forge-apprentice-runtime-dot-sheet.png": "32-forge-apprentice-junior-smith.png",
    "33-armor-fitter-runtime-dot-sheet.png": "33-armor-fitter-armor-assistant.png",
    "34-relic-custodian-runtime-dot-sheet.png": "34-relic-custodian-relic-assistant.png",
    "35-palace-page-runtime-dot-sheet.png": "35-palace-page-palace-attendant.png",
    "36-royal-cook-runtime-dot-sheet.png": "36-royal-cook-palace-cook.png",
}


@dataclass(frozen=True)
class PortraitSpec:
    subject_id: str
    source_name: str
    output_names: tuple[str, ...]


@dataclass(frozen=True)
class RuntimeSpec:
    subject_id: str
    source_name: str
    profile: str


PORTRAIT_SPECS: tuple[PortraitSpec, ...] = (
    PortraitSpec("orin", "01-orin-portrait.png", ("orin.png", "weapon_merchant.png")),
    PortraitSpec("marta", "02-marta-portrait.png", ("marta.png", "armor_merchant.png")),
    PortraitSpec("neri", "03-neri-portrait.png", ("neri.png", "item_merchant.png")),
    PortraitSpec("torren", "04-torren-portrait.png", ("torren.png", "blacksmith.png")),
    PortraitSpec("seline", "05-seline-portrait.png", ("seline.png", "relic_merchant.png")),
    PortraitSpec("elder_haru", "06-mayor-haru-portrait-1.png", ("elder_haru.png", "mayor_haru.png")),
    PortraitSpec("bram_recruit", "07-bram-portrait.png", ("bram_recruit.png",)),
    PortraitSpec("scribe_len", "08-scribe-len-portrait.png", ("scribe_len.png",)),
    PortraitSpec("captain_ysold", "09-captain-ysold-portrait.png", ("captain_ysold.png",)),
    PortraitSpec("quartermaster_dina", "10-quartermaster-dina-portrait.png", ("quartermaster_dina.png",)),
    PortraitSpec("guard_east", "11-east-guard-portrait.png", ("guard_east.png", "east_guard.png")),
    PortraitSpec("garden_guard", "12-south-guard-portrait.png", ("garden_guard.png", "south_guard.png")),
    PortraitSpec("rookie_sentry", "13-rookie-sentry-portrait.png", ("rookie_sentry.png",)),
    PortraitSpec("villager_plaza", "14-plaza-villager-portrait.png", ("villager_plaza.png", "plaza_villager.png")),
    PortraitSpec("runner_lane", "15-route-runner-portrait.png", ("runner_lane.png", "route_runner.png")),
    PortraitSpec("market_courier", "16-market-courier-portrait.png", ("market_courier.png",)),
    PortraitSpec("dock_loader", "17-dock-loader-portrait.png", ("dock_loader.png",)),
    PortraitSpec("plaza_bard", "18-square-bard-portrait.png", ("plaza_bard.png", "square_bard.png")),
    PortraitSpec("child_south", "19-south-ward-child-portrait.png", ("child_south.png", "south_ward_child.png")),
    PortraitSpec("king_aldren", "20-king-aldren-portrait.png", ("king_aldren.png",)),
    PortraitSpec("queen_regent_celestine", "21-queen-regent-celestine-portrait.png", ("queen_regent_celestine.png",)),
    PortraitSpec("captain_rowan", "22-captain-rowan-portrait.png", ("captain_rowan.png",)),
    PortraitSpec("archivist_mirel", "23-archivist-mirel-portrait.png", ("archivist_mirel.png",)),
    PortraitSpec("chamberlain_orla", "24-chamberlain-orla-portrait.png", ("chamberlain_orla.png",)),
    PortraitSpec("sanctum_knight", "25-sanctum-knight-portrait.png", ("sanctum_knight.png",)),
    PortraitSpec("archive_aide", "26-archive-aide-portrait.png", ("archive_aide.png",)),
    PortraitSpec("garden_caretaker", "27-garden-caretaker-portrait.png", ("garden_caretaker.png",)),
    PortraitSpec("lantern_keeper", "28-lantern-keeper-portrait.png", ("lantern_keeper.png",)),
    PortraitSpec("gate_clerk", "29-gate-clerk-portrait.png", ("gate_clerk.png",)),
    PortraitSpec("traveling_healer", "30-traveling-healer-portrait.png", ("traveling_healer.png",)),
    PortraitSpec("fountain_vendor", "31-fountain-vendor-portrait.png", ("fountain_vendor.png",)),
    PortraitSpec("forge_apprentice", "32-forge-apprentice-portrait.png", ("forge_apprentice.png",)),
    PortraitSpec("armor_fitter", "33-armor-fitter-portrait.png", ("armor_fitter.png",)),
    PortraitSpec("relic_custodian", "34-relic-custodian-portrait.png", ("relic_custodian.png",)),
    PortraitSpec("palace_page", "35-palace-page-portrait.png", ("palace_page.png",)),
    PortraitSpec("royal_cook", "36-royal-cook-portrait.png", ("royal_cook.png",)),
)

RUNTIME_SPECS: tuple[RuntimeSpec, ...] = (
    RuntimeSpec("orin", "01-orin-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("weapon_merchant", "01-orin-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("marta", "02-marta-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("armor_merchant", "02-marta-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("neri", "03-neri-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("item_merchant", "03-neri-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("torren", "04-torren-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("blacksmith", "04-torren-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("seline", "05-seline-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("relic_merchant", "05-seline-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("elder_haru", "06-mayor-haru-runtime-dot-sheet.png", "default"),
    RuntimeSpec("bram_recruit", "07-bram-runtime-dot-sheet.png", "default"),
    RuntimeSpec("scribe_len", "08-scribe-len-runtime-dot-sheet.png", "default"),
    RuntimeSpec("captain_ysold", "09-captain-ysold-runtime-dot-sheet.png", "guard"),
    RuntimeSpec("quartermaster_dina", "10-quartermaster-dina-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("guard_east", "11-east-guard-runtime-dot-sheet.png", "guard"),
    RuntimeSpec("garden_guard", "12-south-guard-runtime-dot-sheet.png", "guard"),
    RuntimeSpec("rookie_sentry", "13-rookie-sentry-runtime-dot-sheet.png", "guard"),
    RuntimeSpec("villager_plaza", "14-plaza-villager-runtime-dot-sheet.png", "default"),
    RuntimeSpec("runner_lane", "15-route-runner-runtime-dot-sheet.png", "runner"),
    RuntimeSpec("market_courier", "16-market-courier-runtime-dot-sheet.png", "runner"),
    RuntimeSpec("dock_loader", "17-dock-loader-runtime-dot-sheet.png", "default"),
    RuntimeSpec("plaza_bard", "18-square-bard-runtime-dot-sheet.png", "default"),
    RuntimeSpec("child_south", "19-south-ward-child-runtime-dot-sheet.png", "child"),
    RuntimeSpec("king_aldren", "20-king-aldren-runtime-dot-sheet.png", "royal"),
    RuntimeSpec("queen_regent_celestine", "21-queen-regent-celestine-runtime-dot-sheet.png", "royal"),
    RuntimeSpec("captain_rowan", "22-captain-rowan-runtime-dot-sheet-2.png", "guard"),
    RuntimeSpec("archivist_mirel", "23-archivist-mirel-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("chamberlain_orla", "24-chamberlain-orla-runtime-dot-sheet.png", "royal"),
    RuntimeSpec("sanctum_knight", "25-sanctum-knight-runtime-dot-sheet.png", "guard"),
    RuntimeSpec("archive_aide", "26-archive-aide-runtime-dot-sheet.png", "default"),
    RuntimeSpec("garden_caretaker", "27-garden-caretaker-runtime-dot-sheet.png", "default"),
    RuntimeSpec("lantern_keeper", "28-lantern-keeper-runtime-dot-sheet.png", "default"),
    RuntimeSpec("gate_clerk", "29-gate-clerk-runtime-dot-sheet.png", "merchant"),
    RuntimeSpec("traveling_healer", "30-traveling-healer-runtime-dot-sheet.png", "default"),
    RuntimeSpec("fountain_vendor", "31-fountain-vendor-runtime-dot-sheet.png", "default"),
    RuntimeSpec("forge_apprentice", "32-forge-apprentice-runtime-dot-sheet.png", "default"),
    RuntimeSpec("armor_fitter", "33-armor-fitter-runtime-dot-sheet.png", "default"),
    RuntimeSpec("relic_custodian", "34-relic-custodian-runtime-dot-sheet.png", "default"),
    RuntimeSpec("palace_page", "35-palace-page-runtime-dot-sheet.png", "default"),
    RuntimeSpec("royal_cook", "36-royal-cook-runtime-dot-sheet.png", "default"),
)


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def resolve_runtime_source_path(source_name: str) -> Path:
    remake_name = RUNTIME_REMAKE_SOURCE_NAMES.get(source_name)
    if remake_name:
        remake_path = RUNTIME_REMAKE_SOURCE_DIR / remake_name
        if remake_path.exists():
            return remake_path
    return SOURCE_DIR / source_name


def has_meaningful_alpha(image: Image.Image) -> bool:
    alpha = np.array(image.getchannel("A"))
    transparent_ratio = float(np.count_nonzero(alpha < 250)) / float(alpha.size)
    return transparent_ratio >= 0.03


def keep_largest_alpha_component(image: Image.Image) -> Image.Image:
    alpha = np.array(image.getchannel("A"))
    mask = alpha > ALPHA_THRESHOLD
    coords = np.argwhere(mask)
    if coords.size == 0:
        return image

    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0) + 1
    submask = mask[y0:y1, x0:x1]
    visited = np.zeros(submask.shape, dtype=bool)
    height, width = submask.shape
    best_component: list[tuple[int, int]] = []

    for row in range(height):
        for col in range(width):
            if not submask[row, col] or visited[row, col]:
                continue

            queue: deque[tuple[int, int]] = deque([(row, col)])
            visited[row, col] = True
            component: list[tuple[int, int]] = []

            while queue:
                y, x = queue.popleft()
                component.append((y, x))
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < height and 0 <= nx < width and submask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((ny, nx))

            if len(component) > len(best_component):
                best_component = component

    cleaned_alpha = np.zeros_like(alpha)
    for row, col in best_component:
        cleaned_alpha[y0 + row, x0 + col] = alpha[y0 + row, x0 + col]

    result = image.copy()
    result.putalpha(Image.fromarray(cleaned_alpha, mode="L"))
    return result


def crop_with_padding(
    image: Image.Image,
    *,
    pad_x_ratio: float = 0.08,
    pad_top_ratio: float = 0.08,
    pad_bottom_ratio: float = 0.06,
) -> Image.Image:
    bbox = image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    pad_x = max(18, int((right - left) * pad_x_ratio))
    pad_top = max(18, int((bottom - top) * pad_top_ratio))
    pad_bottom = max(16, int((bottom - top) * pad_bottom_ratio))
    return image.crop((
        max(0, left - pad_x),
        max(0, top - pad_top),
        min(image.width, right + pad_x),
        min(image.height, bottom + pad_bottom),
    ))


def fit_on_canvas(image: Image.Image, canvas_size: tuple[int, int], max_render: tuple[int, int], bottom_margin: int) -> Image.Image:
    scale = min(max_render[0] / image.width, max_render[1] / image.height, 1.0)
    target_size = (
        max(1, int(round(image.width * scale))),
        max(1, int(round(image.height * scale))),
    )
    resized = image.resize(target_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    paste_x = (canvas_size[0] - resized.width) // 2
    paste_y = canvas_size[1] - resized.height - bottom_margin
    canvas.alpha_composite(resized, (paste_x, paste_y))
    return canvas


def process_portrait(session, source_path: Path) -> Image.Image:
    source = Image.open(source_path).convert("RGBA")
    if has_meaningful_alpha(source):
        cutout = source.copy()
    else:
        rembg_input = source.copy()
        if max(rembg_input.width, rembg_input.height) > REMBG_MAX_SIDE:
            scale = REMBG_MAX_SIDE / max(rembg_input.width, rembg_input.height)
            rembg_input = rembg_input.resize(
                (
                    max(1, int(round(rembg_input.width * scale))),
                    max(1, int(round(rembg_input.height * scale))),
                ),
                Image.Resampling.LANCZOS,
            )
        cutout = remove(rembg_input, session=session).convert("RGBA")

    cutout = keep_largest_alpha_component(cutout)
    cutout = crop_with_padding(cutout)
    return fit_on_canvas(cutout, (PORTRAIT_CANVAS, PORTRAIT_CANVAS), (PORTRAIT_RENDER, PORTRAIT_RENDER), PORTRAIT_BOTTOM_MARGIN)


def border_connected_mask(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    visited = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def try_add(y: int, x: int) -> None:
        if 0 <= y < h and 0 <= x < w and mask[y, x] and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

    for x in range(w):
        try_add(0, x)
        try_add(h - 1, x)
    for y in range(h):
        try_add(y, 0)
        try_add(y, w - 1)

    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            try_add(ny, nx)

    return visited


def remove_runtime_sheet_background(image: Image.Image) -> Image.Image:
    rgba = np.array(image.convert("RGBA"))
    alpha = rgba[:, :, 3]
    if np.count_nonzero(alpha < 250) > alpha.size * 0.03:
        return image.convert("RGBA")

    rgb = rgba[:, :, :3].astype(np.int16)
    value = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    border_rgb = np.concatenate(
        [
            rgb[0, :, :],
            rgb[-1, :, :],
            rgb[:, 0, :],
            rgb[:, -1, :],
        ],
        axis=0,
    )
    border_median = np.median(border_rgb, axis=0)
    border_distance = np.abs(rgb - border_median).sum(axis=2)
    candidate_bg = ((value >= 176) & (chroma <= 42)) | (border_distance <= 42)
    bg_mask = border_connected_mask(candidate_bg)
    alpha[bg_mask] = 0

    light_fringe = ((value >= 150) & (chroma <= 48)) | (border_distance <= 60)
    fringe_mask = border_connected_mask(light_fringe & (alpha > 0))
    alpha[fringe_mask] = 0
    return Image.fromarray(rgba, mode="RGBA")


def trim_alpha(image: Image.Image, *, padding: int = 4) -> Image.Image:
    bbox = image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()
    if bbox is None:
        return image
    left, top, right, bottom = bbox
    return image.crop((
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    ))


@dataclass(frozen=True)
class ComponentInfo:
    area: int
    left: int
    top: int
    right: int
    bottom: int
    cx: float
    cy: float


def extract_components(alpha_mask: np.ndarray, *, min_area: int = 32) -> list[ComponentInfo]:
    height, width = alpha_mask.shape
    visited = np.zeros((height, width), dtype=bool)
    components: list[ComponentInfo] = []

    for row in range(height):
        for col in range(width):
            if not alpha_mask[row, col] or visited[row, col]:
                continue

            queue: deque[tuple[int, int]] = deque([(row, col)])
            visited[row, col] = True
            pixels: list[tuple[int, int]] = []

            while queue:
                y, x = queue.popleft()
                pixels.append((y, x))
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < height and 0 <= nx < width and alpha_mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((ny, nx))

            if len(pixels) < min_area:
                continue

            ys = [pixel[0] for pixel in pixels]
            xs = [pixel[1] for pixel in pixels]
            components.append(
                ComponentInfo(
                    area=len(pixels),
                    left=min(xs),
                    top=min(ys),
                    right=max(xs) + 1,
                    bottom=max(ys) + 1,
                    cx=float(sum(xs)) / float(len(xs)),
                    cy=float(sum(ys)) / float(len(ys)),
                )
            )

    return components


def cluster_axis(values: list[float], *, distance_threshold: float) -> list[list[float]]:
    if not values:
        return []

    groups: list[list[float]] = [[values[0]]]
    for value in values[1:]:
        current_mean = float(sum(groups[-1])) / float(len(groups[-1]))
        if abs(value - current_mean) <= distance_threshold:
            groups[-1].append(value)
            continue
        groups.append([value])
    return groups


def infer_slot_bounds(components: list[ComponentInfo], image_size: tuple[int, int]) -> tuple[list[tuple[int, int]], list[tuple[int, int]]]:
    if not components:
        raise ValueError("Unable to infer runtime sheet slots without any subject components.")

    width, height = image_size
    max_area = max(component.area for component in components)
    primary_components = [
        component
        for component in components
        if component.area >= max(1500, int(max_area * 0.22))
    ]
    if len(primary_components) < 8:
        primary_components = sorted(components, key=lambda component: component.area, reverse=True)[:16]

    x_groups = cluster_axis(
        sorted(component.cx for component in primary_components),
        distance_threshold=max(64.0, width * 0.08),
    )
    y_groups = cluster_axis(
        sorted(component.cy for component in primary_components),
        distance_threshold=max(64.0, height * 0.08),
    )
    if len(x_groups) < 2 or len(y_groups) < 2:
        raise ValueError("Runtime sheet clustering did not produce enough row/column groups.")

    col_components: list[list[ComponentInfo]] = [[] for _ in range(len(x_groups))]
    row_components: list[list[ComponentInfo]] = [[] for _ in range(len(y_groups))]
    x_centers = [float(sum(group)) / float(len(group)) for group in x_groups]
    y_centers = [float(sum(group)) / float(len(group)) for group in y_groups]

    for component in primary_components:
        col_index = min(range(len(x_centers)), key=lambda index: abs(component.cx - x_centers[index]))
        row_index = min(range(len(y_centers)), key=lambda index: abs(component.cy - y_centers[index]))
        col_components[col_index].append(component)
        row_components[row_index].append(component)

    col_bounds: list[tuple[int, int]] = []
    for index, group in enumerate(col_components):
        group_left = min(component.left for component in group)
        group_right = max(component.right for component in group)
        if index == 0:
            left = max(0, group_left - 32)
        else:
            prev_right = max(component.right for component in col_components[index - 1])
            left = max(0, int(round((prev_right + group_left) / 2)))
        if index == len(col_components) - 1:
            right = min(width, group_right + 32)
        else:
            next_left = min(component.left for component in col_components[index + 1])
            right = min(width, int(round((group_right + next_left) / 2)))
        col_bounds.append((left, right))

    row_bounds: list[tuple[int, int]] = []
    for index, group in enumerate(row_components):
        group_top = min(component.top for component in group)
        group_bottom = max(component.bottom for component in group)
        if index == 0:
            top = max(0, group_top - 32)
        else:
            prev_bottom = max(component.bottom for component in row_components[index - 1])
            top = max(0, int(round((prev_bottom + group_top) / 2)))
        if index == len(row_components) - 1:
            bottom = min(height, group_bottom + 32)
        else:
            next_top = min(component.top for component in row_components[index + 1])
            bottom = min(height, int(round((group_bottom + next_top) / 2)))
        row_bounds.append((top, bottom))

    return row_bounds, col_bounds


def clean_slot_crop(image: Image.Image) -> Image.Image:
    alpha_mask = np.array(image.getchannel("A")) > ALPHA_THRESHOLD
    components = extract_components(alpha_mask, min_area=18)
    if not components:
        return Image.new("RGBA", image.size, (0, 0, 0, 0))

    largest_area = max(component.area for component in components)
    keep_mask = np.zeros(alpha_mask.shape, dtype=bool)
    for component in components:
        if component.area < max(32, int(largest_area * 0.05)):
            continue
        keep_mask[component.top:component.bottom, component.left:component.right] = True

    rgba = np.array(image.convert("RGBA"))
    rgba[:, :, 3] = np.where(keep_mask, rgba[:, :, 3], 0)
    return Image.fromarray(rgba, mode="RGBA")


def crop_sheet_rows(source_path: Path) -> list[list[Image.Image]]:
    image = Image.open(source_path).convert("RGBA")
    cleaned = remove_runtime_sheet_background(image)
    alpha_mask = np.array(cleaned.getchannel("A")) > ALPHA_THRESHOLD
    components = extract_components(alpha_mask, min_area=18)
    row_bounds, col_bounds = infer_slot_bounds(components, cleaned.size)

    rows: list[list[Image.Image]] = []
    for row_top, row_bottom in row_bounds:
        row_cells: list[Image.Image] = []
        for col_left, col_right in col_bounds:
            cell = cleaned.crop((col_left, row_top, col_right, row_bottom)).convert("RGBA")
            cell = clean_slot_crop(cell)
            cell = trim_alpha(cell, padding=6)
            row_cells.append(cell)
        rows.append(row_cells)
    return rows


def fit_runtime_frames(frames: list[Image.Image]) -> list[Image.Image]:
    bbox_sizes = [(img.width, img.height) for img in frames if img.getbbox() is not None]
    if not bbox_sizes:
        return [Image.new("RGBA", (RUNTIME_FRAME, RUNTIME_FRAME), (0, 0, 0, 0)) for _ in frames]

    max_width = max(width for width, _ in bbox_sizes)
    max_height = max(height for _, height in bbox_sizes)
    available_w = RUNTIME_FRAME - RUNTIME_MARGIN * 2
    available_h = RUNTIME_FRAME - RUNTIME_MARGIN * 2
    scale = min(available_w / max_width, available_h / max_height, 1.0)
    fitted: list[Image.Image] = []
    for frame in frames:
        if frame.getbbox() is None:
            fitted.append(Image.new("RGBA", (RUNTIME_FRAME, RUNTIME_FRAME), (0, 0, 0, 0)))
            continue
        target = frame.resize(
            (
                max(1, int(round(frame.width * scale))),
                max(1, int(round(frame.height * scale))),
            ),
            Image.Resampling.NEAREST,
        )
        canvas = Image.new("RGBA", (RUNTIME_FRAME, RUNTIME_FRAME), (0, 0, 0, 0))
        paste_x = (RUNTIME_FRAME - target.width) // 2
        paste_y = RUNTIME_FRAME - target.height - RUNTIME_MARGIN
        canvas.alpha_composite(target, (paste_x, paste_y))
        fitted.append(canvas)
    return fitted


def build_strip(frames: list[Image.Image]) -> Image.Image:
    strip = Image.new("RGBA", (RUNTIME_FRAME * len(frames), RUNTIME_FRAME), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        strip.alpha_composite(frame, (index * RUNTIME_FRAME, 0))
    return strip


def clip_map_for_profile(profile: str, rows: list[list[Image.Image]]) -> dict[str, tuple[list[Image.Image], int]]:
    def pick_row(index: int, *, fallback: int | None = None) -> list[Image.Image]:
        if 0 <= index < len(rows):
            return rows[index]
        if fallback is not None and 0 <= fallback < len(rows):
            return rows[fallback]
        return rows[-1]

    if profile == "merchant":
        return {
            "idle": (pick_row(0), 8),
            "walk": (pick_row(1, fallback=0), 8),
            "talk": (pick_row(2, fallback=1), 8),
            "greet": (pick_row(2, fallback=1), 8),
            "counter_stand": (pick_row(3, fallback=2), 6),
            "turn_short_rotation": (pick_row(3, fallback=2), 8),
        }
    if profile == "guard":
        return {
            "idle": (pick_row(0), 7),
            "patrol_walk": (pick_row(1, fallback=0), 8),
            "talk": (pick_row(2, fallback=1), 8),
            "greet": (pick_row(2, fallback=1), 8),
            "halt": (pick_row(3, fallback=2), 6),
        }
    if profile == "runner":
        return {
            "idle": (pick_row(0), 7),
            "walk": (pick_row(1, fallback=0), 10),
            "talk": (pick_row(2, fallback=1), 8),
            "greet": (pick_row(2, fallback=1), 8),
        }
    if profile == "child":
        return {
            "idle": (pick_row(0), 6),
            "walk": (pick_row(1, fallback=0), 8),
            "talk": (pick_row(2, fallback=1), 8),
            "greet": (pick_row(2, fallback=1), 8),
        }
    if profile == "royal":
        return {
            "idle": (pick_row(0), 7),
            "walk": (pick_row(1, fallback=0), 7),
            "talk": (pick_row(2, fallback=1), 8),
            "greet": (pick_row(2, fallback=1), 8),
        }
    return {
        "idle": (pick_row(0), 7),
        "walk": (pick_row(1, fallback=0), 8),
        "talk": (pick_row(2, fallback=1), 8),
        "greet": (pick_row(2, fallback=1), 8),
    }


def build_review_sheet(entries: list[tuple[str, Path]], output_path: Path, *, cols: int, cell_size: tuple[int, int], label_height: int = 28) -> None:
    if not entries:
        return
    rows = (len(entries) + cols - 1) // cols
    canvas = Image.new("RGBA", (cols * cell_size[0], rows * (cell_size[1] + label_height)), (20, 20, 22, 255))
    checker_a = (58, 58, 60, 255)
    checker_b = (92, 92, 96, 255)

    for index, (label, image_path) in enumerate(entries):
        row = index // cols
        col = index % cols
        x = col * cell_size[0]
        y = row * (cell_size[1] + label_height)
        tile = Image.new("RGBA", cell_size, checker_a)
        for cy in range(0, cell_size[1], 24):
            for cx in range(0, cell_size[0], 24):
                if ((cx // 24) + (cy // 24)) % 2 == 0:
                    for sy in range(cy, min(cy + 24, cell_size[1])):
                        for sx in range(cx, min(cx + 24, cell_size[0])):
                            tile.putpixel((sx, sy), checker_b)
        preview = Image.open(image_path).convert("RGBA")
        thumb = ImageOps.contain(preview, cell_size, Image.Resampling.NEAREST)
        tile.alpha_composite(thumb, ((cell_size[0] - thumb.width) // 2, (cell_size[1] - thumb.height) // 2))
        canvas.alpha_composite(tile, (x, y))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path)


def import_portraits() -> list[str]:
    ensure_dir(PORTRAIT_OUTPUT_DIR)
    session = new_session("u2netp")
    review_entries: list[tuple[str, Path]] = []
    written: list[str] = []
    for spec in PORTRAIT_SPECS:
        source_path = SOURCE_DIR / spec.source_name
        if not source_path.exists():
            raise FileNotFoundError(f"Missing portrait source: {source_path.name}")
        processed = process_portrait(session, source_path)
        primary_output = PORTRAIT_OUTPUT_DIR / spec.output_names[0]
        processed.save(primary_output)
        review_entries.append((spec.subject_id, primary_output))
        written.append(spec.output_names[0])
        for alias_name in spec.output_names[1:]:
            processed.save(PORTRAIT_OUTPUT_DIR / alias_name)
            written.append(alias_name)

    build_review_sheet(review_entries, PORTRAIT_REVIEW_PATH, cols=6, cell_size=(164, 164))
    return written


def import_runtime_subjects() -> list[dict[str, object]]:
    ensure_dir(RUNTIME_OUTPUT_DIR)
    review_entries: list[tuple[str, Path]] = []
    payloads: list[dict[str, object]] = []
    for spec in RUNTIME_SPECS:
        source_path = resolve_runtime_source_path(spec.source_name)
        if not source_path.exists():
            raise FileNotFoundError(f"Missing runtime source: {source_path.name}")
        rows = crop_sheet_rows(source_path)
        clip_defs = clip_map_for_profile(spec.profile, rows)
        subject_dir = RUNTIME_OUTPUT_DIR / spec.subject_id
        ensure_dir(subject_dir)
        clips: list[dict[str, object]] = []
        for clip_id, (frames, fps) in clip_defs.items():
            fitted = fit_runtime_frames(frames)
            strip = build_strip(fitted)
            output_path = subject_dir / f"{clip_id}.png"
            strip.save(output_path)
            clips.append({
                "id": clip_id,
                "path": f"assets/runtime/npcs/{spec.subject_id}/{clip_id}.png",
                "frameWidth": RUNTIME_FRAME,
                "frameHeight": RUNTIME_FRAME,
                "frameCount": len(frames),
                "fps": fps,
            })
            if clip_id == "idle":
                review_entries.append((spec.subject_id, output_path))
        payloads.append({
            "id": spec.subject_id,
            "name": spec.subject_id.replace("_", " ").title(),
            "category": "npc",
            "clips": clips,
        })

    build_review_sheet(review_entries, RUNTIME_REVIEW_PATH, cols=5, cell_size=(180, 64))
    return payloads


def update_manifest(npc_subjects: list[dict[str, object]]) -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    replaced_ids = {subject["id"] for subject in npc_subjects}
    kept_subjects = [
        subject
        for subject in manifest["subjects"]
        if not (subject.get("category") == "npc" and subject.get("id") in replaced_ids)
    ]
    manifest["subjects"] = [*kept_subjects, *npc_subjects]
    manifest["generatedAt"] = datetime.now().strftime("%Y-%m-%d")
    manifest["note"] = "Runtime animation clips regenerated after 2026-05-03 NPC prompt asset import."
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    ensure_dir(OUTPUT_DIR)
    skip_portraits = os.environ.get("HS_SKIP_NPC_PORTRAIT_IMPORT") == "1"
    portrait_outputs = [] if skip_portraits else import_portraits()
    npc_subjects = import_runtime_subjects()
    update_manifest(npc_subjects)

    report = {
        "portraitSourceCount": len(PORTRAIT_SPECS),
        "runtimeSourceCount": len(RUNTIME_SPECS),
        "writtenPortraitFiles": portrait_outputs,
        "writtenNpcSubjects": [subject["id"] for subject in npc_subjects],
        "missingNotes": [
            "Runtime dot import prefers image/NPC_2HEAD_RUNTIME_DOT_REMAKE_READY_TO_COPY_PROMPTS_2026-05-03 when matching files exist.",
            "01-orin-runtime-dot-sheet.png is now mapped from the 2-head remake batch for orin and weapon_merchant.",
            "06-mayor-haru-portrait-1.png selected as canonical mayor portrait.",
            "22-captain-rowan-runtime-dot-sheet-2.png selected as canonical Rowan runtime sheet.",
        ],
        "reviews": {
            "portraits": str(PORTRAIT_REVIEW_PATH.relative_to(ROOT)).replace("\\", "/"),
            "runtime": str(RUNTIME_REVIEW_PATH.relative_to(ROOT)).replace("\\", "/"),
        },
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

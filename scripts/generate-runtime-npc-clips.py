from __future__ import annotations

from dataclasses import dataclass
from importlib.machinery import SourceFileLoader
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BASE = SourceFileLoader(
    "base_runtime_character_generator",
    str(ROOT / "scripts" / "generate-runtime-character-clips.py"),
).load_module()
SOURCE_DIR = ROOT / "assets" / "source" / "world" / "pixel-town-rework" / "approved"
OUTPUT_DIR = ROOT / "public" / "assets" / "runtime" / "npcs"
STATIC_NPC_SOURCE_DIR = ROOT / "public" / "assets" / "world" / "town" / "npcs"
MANIFEST_PATH = ROOT / "public" / "assets" / "runtime" / "animation-manifest.json"
FRAME_SIZE = 48


@dataclass(frozen=True)
class Region:
    left: int
    top: int
    right: int
    bottom: int


@dataclass(frozen=True)
class ClipSpec:
    id: str
    fps: int
    frame_count: int
    region: Region


@dataclass(frozen=True)
class SubjectSpec:
    id: str
    name: str
    sheet_name: str
    clips: tuple[ClipSpec, ...]
    static_source_name: str | None = None


MERCHANT_CLIPS = (
    ClipSpec("idle", 8, 4, Region(0, 150, 610, 420)),
    ClipSpec("talk", 8, 4, Region(610, 150, 1254, 420)),
    ClipSpec("greet", 8, 3, Region(0, 420, 610, 760)),
    ClipSpec("counter_stand", 6, 4, Region(610, 420, 1254, 760)),
    ClipSpec("turn_short_rotation", 8, 8, Region(0, 860, 1254, 1118)),
)


SUBJECT_SPECS: tuple[SubjectSpec, ...] = (
    SubjectSpec(
        id="weapon_merchant",
        name="Weapon Merchant",
        sheet_name="14-weapon-merchant-sprite-sheet.png",
        clips=MERCHANT_CLIPS,
    ),
    SubjectSpec(
        id="item_merchant",
        name="Item Merchant",
        sheet_name="16-item-merchant-sprite-sheet.png",
        clips=MERCHANT_CLIPS,
    ),
    SubjectSpec(
        id="relic_merchant",
        name="Relic Merchant",
        sheet_name="18-relic-rune-merchant-sprite-sheet.png",
        clips=MERCHANT_CLIPS,
    ),
    SubjectSpec(
        id="villager",
        name="Civilian Villager",
        sheet_name="19-ambient-villager-sprite-set.png",
        static_source_name="villager.png",
        clips=(
            ClipSpec("idle", 6, 1, Region(96, 150, 254, 320)),
            ClipSpec("walk", 8, 1, Region(96, 320, 254, 510)),
            ClipSpec("talk", 8, 1, Region(96, 510, 254, 700)),
            ClipSpec("greet", 8, 1, Region(96, 700, 254, 900)),
        ),
    ),
    SubjectSpec(
        id="traveler",
        name="Traveler",
        sheet_name="19-ambient-villager-sprite-set.png",
        static_source_name="traveler.png",
        clips=(
            ClipSpec("idle", 6, 1, Region(304, 150, 470, 320)),
            ClipSpec("walk", 8, 1, Region(304, 320, 470, 510)),
            ClipSpec("talk", 8, 1, Region(304, 510, 470, 700)),
            ClipSpec("greet", 8, 1, Region(304, 700, 470, 900)),
        ),
    ),
    SubjectSpec(
        id="child",
        name="Child",
        sheet_name="19-ambient-villager-sprite-set.png",
        static_source_name="child.png",
        clips=(
            ClipSpec("idle", 6, 1, Region(520, 150, 684, 320)),
            ClipSpec("walk", 8, 1, Region(520, 320, 684, 510)),
            ClipSpec("talk", 8, 1, Region(520, 510, 684, 700)),
            ClipSpec("greet", 8, 1, Region(520, 700, 684, 900)),
        ),
    ),
    SubjectSpec(
        id="guard_spear",
        name="Spear Guard",
        sheet_name="20-ambient-guard-sprite-set.png",
        static_source_name="guard_spear.png",
        clips=(
            ClipSpec("idle", 6, 1, Region(130, 150, 308, 336)),
            ClipSpec("patrol_walk", 8, 1, Region(130, 336, 308, 532)),
            ClipSpec("halt", 6, 1, Region(130, 532, 308, 728)),
            ClipSpec("talk", 8, 1, Region(130, 728, 308, 924)),
            ClipSpec("greet", 8, 1, Region(130, 924, 308, 1216)),
        ),
    ),
    SubjectSpec(
        id="guard_sword",
        name="Sword Guard",
        sheet_name="20-ambient-guard-sprite-set.png",
        static_source_name="guard_sword.png",
        clips=(
            ClipSpec("idle", 6, 1, Region(458, 150, 624, 336)),
            ClipSpec("patrol_walk", 8, 1, Region(458, 336, 624, 532)),
            ClipSpec("halt", 6, 1, Region(458, 532, 624, 728)),
            ClipSpec("talk", 8, 1, Region(458, 728, 624, 924)),
            ClipSpec("greet", 8, 1, Region(458, 924, 624, 1216)),
        ),
    ),
    SubjectSpec(
        id="guard_crossbow",
        name="Crossbow Guard",
        sheet_name="20-ambient-guard-sprite-set.png",
        static_source_name="guard_crossbow.png",
        clips=(
            ClipSpec("idle", 6, 1, Region(850, 150, 1042, 336)),
            ClipSpec("patrol_walk", 8, 1, Region(850, 336, 1042, 532)),
            ClipSpec("halt", 6, 1, Region(850, 532, 1042, 728)),
            ClipSpec("talk", 8, 1, Region(850, 728, 1042, 924)),
            ClipSpec("greet", 8, 1, Region(850, 924, 1042, 1216)),
        ),
    ),
)


def fit_frames(frames: list[BASE.ExtractedFrame]) -> Image.Image:
    max_left_extent = max(frame.anchor_x for frame in frames)
    max_right_extent = max(frame.image.size[0] - frame.anchor_x for frame in frames)
    max_above_extent = max(frame.anchor_y for frame in frames)
    max_below_extent = max(frame.image.size[1] - frame.anchor_y for frame in frames)
    scale = min(
        (FRAME_SIZE - 4) / max(max_left_extent + max_right_extent, 1.0),
        (FRAME_SIZE - 4) / max(max_above_extent + max_below_extent, 1.0),
        1.0,
    )
    scaled_left_extent = max_left_extent * scale
    scaled_right_extent = max_right_extent * scale
    scaled_below_extent = max_below_extent * scale
    cell_anchor_x = ((FRAME_SIZE - (scaled_left_extent + scaled_right_extent)) / 2) + scaled_left_extent
    cell_anchor_y = FRAME_SIZE - 2 - scaled_below_extent
    strip = Image.new("RGBA", (FRAME_SIZE * len(frames), FRAME_SIZE), (0, 0, 0, 0))

    for index, frame in enumerate(frames):
        width = max(1, int(round(frame.image.size[0] * scale)))
        height = max(1, int(round(frame.image.size[1] * scale)))
        resized = (
            frame.image.resize((width, height), Image.Resampling.NEAREST)
            if scale != 1.0
            else frame.image
        )
        scaled_anchor_x = frame.anchor_x * scale
        scaled_anchor_y = frame.anchor_y * scale
        paste_x = int(round(index * FRAME_SIZE + cell_anchor_x - scaled_anchor_x))
        paste_y = int(round(cell_anchor_y - scaled_anchor_y))
        paste_x = max(index * FRAME_SIZE, min(index * FRAME_SIZE + FRAME_SIZE - resized.size[0], paste_x))
        paste_y = max(0, min(FRAME_SIZE - resized.size[1], paste_y))
        strip.paste(resized, (paste_x, paste_y), resized)

    return strip


def extract_single_frame_from_region(image: Image.Image, region: Region) -> BASE.ExtractedFrame:
    crop_rgba = np.array(
        image.crop((region.left, region.top, region.right, region.bottom)).convert("RGBA")
    )
    alpha_mask = crop_rgba[:, :, 3] > 0
    labels, components = BASE.label_connected_components(alpha_mask)

    if not components:
        empty = Image.new("RGBA", (24, 24), (0, 0, 0, 0))
        return BASE.ExtractedFrame(image=empty, anchor_x=12.0, anchor_y=23.0)

    region_height = crop_rgba.shape[0]
    body_like_components = [
        component
        for component in components
        if (
            ((component.min_y + component.max_y) / 2) >= region_height * 0.35
            or (component.max_y - component.min_y + 1) >= region_height * 0.25
        )
    ]
    max_area = max(component.area for component in components)
    substantial_components = [
        component for component in body_like_components
        if component.area >= max(40, int(max_area * 0.35))
    ]
    lower_substantial_components = [
        component for component in substantial_components
        if component.max_y >= region_height * 0.45
    ]
    core_components = [component for component in lower_substantial_components if not component.touches_border]
    candidate_components = core_components or lower_substantial_components or substantial_components or body_like_components or components
    main_component = max(
        candidate_components,
        key=lambda component: (component.area, component.max_y, component.max_x - component.min_x),
    )
    component_mask = labels == main_component.index
    coords = np.argwhere(component_mask)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = component_mask[min_y : max_y + 1, min_x : max_x + 1]
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_coords = np.argwhere(frame_mask)
    anchor_x, anchor_y = BASE.compute_frame_anchor(frame_coords)
    frame_rgba = BASE.cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = BASE.compute_frame_anchor(final_coords)
    return BASE.ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_frames(image: Image.Image, clip_spec: ClipSpec) -> list[BASE.ExtractedFrame]:
    if clip_spec.frame_count == 1:
        return [extract_single_frame_from_region(image, clip_spec.region)]

    component_frames = BASE.extract_component_frames_from_region(
        image=image,
        x_start=clip_spec.region.left,
        x_end=clip_spec.region.right,
        y_start=clip_spec.region.top,
        y_end=clip_spec.region.bottom,
        clip_id=clip_spec.id,
        expected_frame_count=clip_spec.frame_count,
        cleanup_character_artifacts=True,
        suppress_presentation_artifacts=True,
    )

    if len(component_frames) >= 1:
        frames = BASE.resample_frames_to_count(component_frames, clip_spec.frame_count)
    else:
        frames = BASE.extract_frames_from_region(
            image=image,
            x_start=clip_spec.region.left,
            x_end=clip_spec.region.right,
            y_start=clip_spec.region.top,
            y_end=clip_spec.region.bottom,
            frame_count=clip_spec.frame_count,
            clip_id=clip_spec.id,
            suppress_presentation_artifacts=True,
        )

    frames = BASE.postprocess_character_frames(frames)
    frames = BASE.stabilize_character_clip_frames(frames)
    return BASE.resample_frames_to_count(frames, clip_spec.frame_count)


def extract_frames_from_static_source(static_source_name: str, frame_count: int) -> list[BASE.ExtractedFrame]:
    static_image = Image.open(STATIC_NPC_SOURCE_DIR / static_source_name).convert("RGBA")
    rgba = np.array(static_image)
    coords = np.argwhere(rgba[:, :, 3] > 0)

    if coords.size == 0:
        empty = Image.new("RGBA", (24, 24), (0, 0, 0, 0))
        frame = BASE.ExtractedFrame(image=empty, anchor_x=12.0, anchor_y=23.0)
        return [frame for _ in range(frame_count)]

    anchor_x, anchor_y = BASE.compute_frame_anchor(coords)
    frames = [
        BASE.ExtractedFrame(
            image=static_image.copy(),
            anchor_x=anchor_x,
            anchor_y=anchor_y,
        )
        for _ in range(frame_count)
    ]
    return BASE.stabilize_character_clip_frames(frames)


def extract_frames_from_source_boxes(
    image: Image.Image,
    source_boxes: tuple[tuple[int, int, int, int], ...],
    frame_count: int,
) -> list[BASE.ExtractedFrame]:
    frames = []
    for source_box in source_boxes:
        crop_image = BASE.remove_checkerboard_background(image.crop(source_box))
        crop_rgba = np.array(crop_image.convert("RGBA"))
        alpha_mask = crop_rgba[:, :, 3] > 0
        labels, components = BASE.label_connected_components(alpha_mask)

        if not components:
            frames.append(BASE.ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0))
            continue

        main_component = max(
            components,
            key=lambda component: (
                component.area,
                component.max_y,
                component.max_x - component.min_x,
            ),
        )
        component_mask = labels == main_component.index
        coords = np.argwhere(component_mask)
        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        frame_mask = component_mask[min_y : max_y + 1, min_x : max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_mask)
        anchor_x, anchor_y = BASE.compute_frame_anchor(frame_coords)
        frames.append(
            BASE.ExtractedFrame(
                image=Image.fromarray(frame_rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            )
        )

    frames = BASE.resample_frames_to_count(frames, frame_count)
    return BASE.stabilize_character_clip_frames(frames)


def cleanup_npc_frame_artifacts(
    frames: list[BASE.ExtractedFrame],
    allow_support_icons: bool,
    keep_only_main_component: bool = False,
) -> list[BASE.ExtractedFrame]:
    cleaned_frames: list[BASE.ExtractedFrame] = []

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        alpha_mask = rgba[:, :, 3] > 0
        labels, components = BASE.label_connected_components(alpha_mask)

        if not components:
            cleaned_frames.append(frame)
            continue

        main_component = max(components, key=lambda component: component.area)
        keep_indices = {main_component.index}
        main_width = main_component.max_x - main_component.min_x + 1
        main_height = main_component.max_y - main_component.min_y + 1

        if keep_only_main_component:
            keep_mask = labels == main_component.index
            rgba[:, :, 3] = np.where(keep_mask, rgba[:, :, 3], 0).astype(np.uint8)
            coords = np.argwhere(rgba[:, :, 3] > 0)
            if coords.size == 0:
                cleaned_frames.append(frame)
                continue
            anchor_x, anchor_y = BASE.compute_frame_anchor(coords)
            cleaned_frames.append(
                BASE.ExtractedFrame(
                    image=Image.fromarray(rgba),
                    anchor_x=anchor_x,
                    anchor_y=anchor_y,
                )
            )
            continue

        for component in components:
            if component.index == main_component.index:
                continue

            area_ratio = component.area / max(1, main_component.area)
            gap_x = max(
                0,
                max(
                    main_component.min_x - component.max_x,
                    component.min_x - main_component.max_x,
                ),
            )
            gap_y = max(
                0,
                max(
                    main_component.min_y - component.max_y,
                    component.min_y - main_component.max_y,
                ),
            )
            close_to_body = gap_x <= max(6, int(main_width * 0.24)) and gap_y <= max(10, int(main_height * 0.3))
            likely_support_icon = (
                allow_support_icons
                and area_ratio >= 0.03
                and area_ratio <= 0.22
                and gap_y <= max(20, int(main_height * 0.5))
            )

            if close_to_body or likely_support_icon:
                keep_indices.add(component.index)

        keep_mask = np.isin(labels, list(keep_indices))
        rgba[:, :, 3] = np.where(keep_mask, rgba[:, :, 3], 0).astype(np.uint8)
        coords = np.argwhere(rgba[:, :, 3] > 0)
        if coords.size == 0:
            cleaned_frames.append(frame)
            continue

        anchor_x, anchor_y = BASE.compute_frame_anchor(coords)
        cleaned_frames.append(
            BASE.ExtractedFrame(
                image=Image.fromarray(rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            )
        )

    return BASE.stabilize_character_clip_frames(cleaned_frames)


def write_strip(subject_id: str, clip_spec: ClipSpec, strip: Image.Image) -> dict:
    target_dir = OUTPUT_DIR / subject_id
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / f"{clip_spec.id}.png"
    strip.save(target_path)
    return {
        "id": clip_spec.id,
        "path": target_path.relative_to(ROOT / "public").as_posix(),
        "frameWidth": FRAME_SIZE,
        "frameHeight": FRAME_SIZE,
        "frameCount": clip_spec.frame_count,
        "fps": clip_spec.fps,
    }


def build_subject_payload(subject: SubjectSpec) -> dict:
    clips: list[dict] = []

    for clip_spec in subject.clips:
        if subject.static_source_name is not None:
            frames = extract_frames_from_static_source(subject.static_source_name, clip_spec.frame_count)
        else:
            image = BASE.remove_checkerboard_background(
                Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
            )
            frames = extract_frames(image, clip_spec)
            frames = cleanup_npc_frame_artifacts(
                frames,
                allow_support_icons=clip_spec.id in {"talk", "greet"},
                keep_only_main_component=clip_spec.id in {"idle", "counter_stand", "turn_short_rotation"},
            )
        strip = fit_frames(frames)
        clips.append(write_strip(subject.id, clip_spec, strip))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": "npc",
        "clips": clips,
    }


def merge_manifest(subject_payloads: list[dict]) -> None:
    manifest = {
        "version": 1,
        "generatedAt": "2026-04-08",
        "note": "Runtime animation clips generated from approved character, enemy, npc, and VFX source sheets.",
        "subjects": [],
    }

    if MANIFEST_PATH.exists():
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    manifest["subjects"] = [
        subject
        for subject in manifest.get("subjects", [])
        if subject.get("category") != "npc"
    ] + subject_payloads
    manifest["version"] = 1
    manifest["generatedAt"] = "2026-04-08"
    manifest["note"] = "Runtime animation clips generated from approved character, enemy, npc, and VFX source sheets."
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main() -> None:
    payloads: list[dict] = []

    for subject in SUBJECT_SPECS:
        payload = build_subject_payload(subject)
        payloads.append(payload)
        print(f"generated runtime clips: npc:{subject.id} ({len(payload['clips'])} clips)")

    merge_manifest(payloads)
    print(f"updated manifest: {MANIFEST_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

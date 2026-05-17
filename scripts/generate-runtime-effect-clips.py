from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "source" / "vfx-sheets" / "approved"
OUTPUT_DIR = ROOT / "public" / "assets" / "runtime" / "effects"
MANIFEST_PATH = ROOT / "public" / "assets" / "runtime" / "animation-manifest.json"
FRAME_SIZE = 128


@dataclass(frozen=True)
class CropBox:
    left: int
    top: int
    right: int
    bottom: int


@dataclass(frozen=True)
class EffectClipSpec:
    id: str
    fps: int
    source_sheet: str
    boxes: tuple[CropBox, ...]
    note: str
    trim_threshold: int = 8


def grid_boxes(
    width: int,
    height: int,
    columns: int,
    rows: int,
    cells: tuple[tuple[int, int], ...],
    margin_x: float = 0.1,
    margin_y: float = 0.12,
) -> tuple[CropBox, ...]:
    cell_width = width / columns
    cell_height = height / rows
    boxes: list[CropBox] = []

    for column, row in cells:
        left = int(column * cell_width + cell_width * margin_x)
        top = int(row * cell_height + cell_height * margin_y)
        right = int((column + 1) * cell_width - cell_width * margin_x)
        bottom = int((row + 1) * cell_height - cell_height * margin_y)
        boxes.append(CropBox(left, top, right, bottom))

    return tuple(boxes)


CLIP_LIBRARY: tuple[EffectClipSpec, ...] = (
    EffectClipSpec(
        id="fx_slash_arc",
        fps=14,
        source_sheet="10-desert-slash-vfx-sheet.png",
        boxes=grid_boxes(
            1402,
            1121,
            5,
            4,
            ((0, 0), (1, 0), (2, 0), (3, 0), (1, 1)),
            margin_x=0.05,
            margin_y=0.08,
        ),
        note="Desert slash arc sequence sampled from the refreshed slash sheet.",
        trim_threshold=6,
    ),
    EffectClipSpec(
        id="fx_impact_burst",
        fps=12,
        source_sheet="02-shield-impact-vfx-sheet.png",
        boxes=grid_boxes(
            1402,
            1121,
            4,
            3,
            ((0, 0), (1, 0), (2, 0), (3, 0), (2, 2)),
            margin_x=0.12,
            margin_y=0.14,
        ),
        note="Shield impact bursts and front-block flashes.",
        trim_threshold=8,
    ),
    EffectClipSpec(
        id="fx_projectile_arcane",
        fps=12,
        source_sheet="03-fire-arcane-spell-vfx-sheet.png",
        boxes=grid_boxes(
            1402,
            1121,
            4,
            4,
            ((0, 1), (1, 1), (2, 1), (3, 1), (0, 2), (1, 2)),
            margin_x=0.11,
            margin_y=0.12,
        ),
        note="Fire-arcane projectile travel strip.",
        trim_threshold=6,
    ),
    EffectClipSpec(
        id="fx_projectile_enemy",
        fps=11,
        source_sheet="06-arrow-trail-vfx-sheet.png",
        boxes=grid_boxes(
            1402,
            1121,
            4,
            6,
            ((0, 0), (1, 0), (2, 0), (3, 0), (0, 1), (1, 1)),
            margin_x=0.1,
            margin_y=0.14,
        ),
        note="Arrow / hostile projectile trail strip.",
        trim_threshold=6,
    ),
    EffectClipSpec(
        id="fx_burst_arcane",
        fps=10,
        source_sheet="03-fire-arcane-spell-vfx-sheet.png",
        boxes=grid_boxes(
            1402,
            1121,
            4,
            4,
            ((0, 0), (1, 0), (2, 0), (3, 0), (0, 3), (1, 3)),
            margin_x=0.11,
            margin_y=0.12,
        ),
        note="Arcane burst strip sampled from fire circle and release impacts.",
        trim_threshold=6,
    ),
    EffectClipSpec(
        id="fx_burst_boss",
        fps=10,
        source_sheet="11-frost-burst-vfx-sheet.png",
        boxes=grid_boxes(
            1536,
            1024,
            5,
            4,
            ((0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (0, 1), (1, 1)),
            margin_x=0.12,
            margin_y=0.16,
        ),
        note="Large cold burst strip for boss-scale impacts.",
        trim_threshold=8,
    ),
    EffectClipSpec(
        id="fx_telegraph_ring",
        fps=8,
        source_sheet="08-rune-circle-vfx-sheet.png",
        boxes=(
            CropBox(40, 84, 242, 304),
            CropBox(280, 84, 484, 304),
            CropBox(528, 84, 732, 304),
            CropBox(768, 84, 972, 304),
            CropBox(1004, 84, 1212, 304),
            CropBox(980, 914, 1224, 1186),
        ),
        note="Looping rune-circle telegraph strip.",
        trim_threshold=12,
    ),
    EffectClipSpec(
        id="fx_charge_trail",
        fps=12,
        source_sheet="09-dark-dash-vfx-sheet.png",
        boxes=grid_boxes(
            1402,
            1121,
            2,
            3,
            ((0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2)),
            margin_x=0.09,
            margin_y=0.12,
        ),
        note="Dark dash / charge trail strip refreshed from the focused shadow-dash sheet.",
        trim_threshold=4,
    ),
    EffectClipSpec(
        id="fx_heal_wave",
        fps=10,
        source_sheet="04-holy-healing-vfx-sheet.png",
        boxes=grid_boxes(
            1402,
            1121,
            3,
            2,
            ((0, 0), (1, 0), (2, 0), (1, 1), (0, 1), (1, 1)),
            margin_x=0.12,
            margin_y=0.14,
        ),
        note="Healing wave / restoration strip refreshed from the dedicated holy-heal sheet.",
        trim_threshold=4,
    ),
    EffectClipSpec(
        id="fx_buff_halo",
        fps=9,
        source_sheet="08-rune-circle-vfx-sheet.png",
        boxes=(
            CropBox(42, 311, 242, 555),
            CropBox(287, 311, 487, 555),
            CropBox(532, 311, 731, 555),
            CropBox(774, 311, 972, 555),
            CropBox(1006, 311, 1208, 555),
            CropBox(764, 932, 970, 1168),
        ),
        note="Support buff halo sampled from rune activation seals.",
        trim_threshold=8,
    ),
    EffectClipSpec(
        id="fx_guardian_shield",
        fps=9,
        source_sheet="05-water-sigil-support-vfx-sheet.png",
        boxes=grid_boxes(
            1402,
            1121,
            3,
            2,
            ((1, 1), (0, 0), (1, 0), (2, 0), (0, 1), (2, 0)),
            margin_x=0.12,
            margin_y=0.14,
        ),
        note="Guardian barrier strip refreshed from the dedicated water-protection sheet.",
        trim_threshold=10,
    ),
)


MANIFEST_EFFECT_SUBJECTS = (
    {
        "id": "party_melee",
        "name": "Party Melee",
        "category": "effect",
        "clips": (
            {"id": "fx_slash_arc", "path": "assets/runtime/effects/fx_slash_arc.png"},
            {"id": "fx_impact_burst", "path": "assets/runtime/effects/fx_impact_burst.png"},
            {"id": "fx_charge_trail", "path": "assets/runtime/effects/fx_charge_trail.png"},
        ),
    },
    {
        "id": "party_magic",
        "name": "Party Magic",
        "category": "effect",
        "clips": (
            {"id": "fx_projectile_arcane", "path": "assets/runtime/effects/fx_projectile_arcane.png"},
            {"id": "fx_burst_arcane", "path": "assets/runtime/effects/fx_burst_arcane.png"},
            {"id": "fx_buff_halo", "path": "assets/runtime/effects/fx_buff_halo.png"},
        ),
    },
    {
        "id": "support_magic",
        "name": "Support Magic",
        "category": "effect",
        "clips": (
            {"id": "fx_heal_wave", "path": "assets/runtime/effects/fx_heal_wave.png"},
            {"id": "fx_buff_halo", "path": "assets/runtime/effects/fx_buff_halo.png"},
            {"id": "fx_guardian_shield", "path": "assets/runtime/effects/fx_guardian_shield.png"},
        ),
    },
    {
        "id": "enemy_ranged",
        "name": "Enemy Ranged",
        "category": "effect",
        "clips": (
            {"id": "fx_telegraph_ring", "path": "assets/runtime/effects/fx_telegraph_ring.png"},
            {"id": "fx_projectile_enemy", "path": "assets/runtime/effects/fx_projectile_enemy.png"},
            {"id": "fx_impact_burst", "path": "assets/runtime/effects/fx_impact_burst.png"},
        ),
    },
    {
        "id": "boss_battle",
        "name": "Boss Battle",
        "category": "effect",
        "clips": (
            {"id": "fx_telegraph_ring", "path": "assets/runtime/effects/fx_telegraph_ring.png"},
            {"id": "fx_burst_boss", "path": "assets/runtime/effects/fx_burst_boss.png"},
            {"id": "fx_charge_trail", "path": "assets/runtime/effects/fx_charge_trail.png"},
        ),
    },
)


def trim_to_alpha(image: Image.Image, threshold: int = 8) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value >= threshold else 0).getbbox()
    if bbox is None:
        return image.copy()
    return image.crop(bbox)


def compose_frame(image: Image.Image, trim_threshold: int) -> Image.Image:
    trimmed = trim_to_alpha(image, trim_threshold)
    frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    trimmed.thumbnail((FRAME_SIZE - 6, FRAME_SIZE - 6), Image.Resampling.LANCZOS)
    offset_x = (FRAME_SIZE - trimmed.width) // 2
    offset_y = (FRAME_SIZE - trimmed.height) // 2
    frame.alpha_composite(trimmed, (offset_x, offset_y))
    return frame


def save_runtime_clip(spec: EffectClipSpec) -> dict:
    source = Image.open(SOURCE_DIR / spec.source_sheet).convert("RGBA")
    strip = Image.new("RGBA", (FRAME_SIZE * len(spec.boxes), FRAME_SIZE), (0, 0, 0, 0))

    for index, box in enumerate(spec.boxes):
        cropped = source.crop((box.left, box.top, box.right, box.bottom))
        frame = compose_frame(cropped, spec.trim_threshold)
        strip.alpha_composite(frame, (index * FRAME_SIZE, 0))

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    strip.save(OUTPUT_DIR / f"{spec.id}.png")
    return {
        "id": spec.id,
        "path": f"assets/runtime/effects/{spec.id}.png",
        "frameWidth": FRAME_SIZE,
        "frameHeight": FRAME_SIZE,
        "frameCount": len(spec.boxes),
        "fps": spec.fps,
        "note": spec.note,
    }


def update_manifest(clips_by_id: dict[str, dict]) -> None:
    manifest = {
        "version": 1,
        "generatedAt": "2026-04-05",
        "note": "Runtime animation clips generated from approved character, enemy, npc, and VFX source sheets.",
        "subjects": [],
    }

    if MANIFEST_PATH.exists():
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    subjects = [
        subject
        for subject in manifest.get("subjects", [])
        if subject.get("category") != "effect"
    ]

    for subject in MANIFEST_EFFECT_SUBJECTS:
        subjects.append(
            {
                "id": subject["id"],
                "name": subject["name"],
                "category": "effect",
                "clips": [
                    {
                        **clips_by_id[clip["id"]],
                        "id": clip["id"],
                        "path": clip["path"],
                    }
                    for clip in subject["clips"]
                ],
            }
        )

    manifest["generatedAt"] = "2026-04-05"
    manifest["note"] = "Runtime animation clips generated from approved character, enemy, npc, and VFX source sheets."
    manifest["subjects"] = subjects
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main() -> None:
    clips_by_id: dict[str, dict] = {}
    for spec in CLIP_LIBRARY:
        clip_manifest = save_runtime_clip(spec)
        clips_by_id[spec.id] = clip_manifest
        print(f"generated: {spec.id} ({clip_manifest['frameCount']}f)")

    update_manifest(clips_by_id)
    print(f"updated manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()

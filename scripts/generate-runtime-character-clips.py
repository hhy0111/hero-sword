from __future__ import annotations

import argparse
from collections import Counter
from collections import deque
from dataclasses import dataclass
from itertools import combinations
import json
from pathlib import Path
from statistics import median

import numpy as np
from PIL import Image

try:
    import cv2
except ImportError:  # pragma: no cover - optional local dependency for manual sprite extraction
    cv2 = None

try:
    from rembg import remove as rembg_remove
except ImportError:  # pragma: no cover - optional local dependency for manual sprite extraction
    rembg_remove = None


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "source" / "character-animation-master-sheets" / "approved"
PACKAGE_SOURCE_DIR = ROOT / "assets" / "source" / "character-package-sheets" / "approved"
LEGACY_SOURCE_REFRESH_DIR = (
    ROOT
    / "assets"
    / "source"
    / "character-animation-master-sheets"
    / "legacy-replaced"
    / "2026-04-07-source-refresh"
)
HERO_LEGACY_MASTER_SHEET_PATH = (
    LEGACY_SOURCE_REFRESH_DIR / "01-kain.png"
)
PUBLIC_CHARACTER_DIR = ROOT / "public" / "assets" / "runtime" / "characters"
MANIFEST_PATH = ROOT / "public" / "assets" / "runtime" / "animation-manifest.json"
FRAME_SIZE = 128
RUNTIME_RESAMPLE = Image.Resampling.LANCZOS

EDGE_FRINGE_CLEANUP_PROFILES: dict[str, dict[str, int]] = {
    "hero": {"brightness_min": 178, "saturation_max": 84, "brightness_delta": 20, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "bram": {"brightness_min": 178, "saturation_max": 84, "brightness_delta": 20, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "sera": {"brightness_min": 182, "saturation_max": 82, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "luna": {"brightness_min": 205, "saturation_max": 72, "brightness_delta": 34, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "ria": {"brightness_min": 194, "saturation_max": 78, "brightness_delta": 28, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "theo": {"brightness_min": 180, "saturation_max": 84, "brightness_delta": 20, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "dorgan": {"brightness_min": 176, "saturation_max": 88, "brightness_delta": 18, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "kiera": {"brightness_min": 188, "saturation_max": 82, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "helma": {"brightness_min": 188, "saturation_max": 82, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "marin": {"brightness_min": 188, "saturation_max": 82, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "serena": {"brightness_min": 192, "saturation_max": 78, "brightness_delta": 26, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "fin": {"brightness_min": 180, "saturation_max": 84, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "iris": {"brightness_min": 184, "saturation_max": 82, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "wolf": {"brightness_min": 174, "saturation_max": 86, "brightness_delta": 18, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "erin": {"brightness_min": 186, "saturation_max": 82, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "nazir": {"brightness_min": 176, "saturation_max": 86, "brightness_delta": 20, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "laila": {"brightness_min": 184, "saturation_max": 82, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "hakan": {"brightness_min": 176, "saturation_max": 86, "brightness_delta": 18, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "seraphin": {"brightness_min": 202, "saturation_max": 74, "brightness_delta": 30, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "micaela": {"brightness_min": 188, "saturation_max": 82, "brightness_delta": 22, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
    "lucian": {"brightness_min": 180, "saturation_max": 84, "brightness_delta": 20, "min_transparent_neighbors": 1, "max_opaque_neighbors": 6},
}

OUTLINE_SHADE_PROFILES: dict[str, dict[str, float]] = {
    "hero": {"brightness_floor": 42, "strong_factor": 0.62, "strong_offset": -10.0, "mid_factor": 0.72, "mid_offset": -8.0, "base_factor": 0.82, "base_offset": -4.0},
    "bram": {"brightness_floor": 42, "strong_factor": 0.62, "strong_offset": -10.0, "mid_factor": 0.72, "mid_offset": -8.0, "base_factor": 0.82, "base_offset": -4.0},
    "sera": {"brightness_floor": 44, "strong_factor": 0.64, "strong_offset": -10.0, "mid_factor": 0.74, "mid_offset": -8.0, "base_factor": 0.84, "base_offset": -4.0},
    "luna": {"brightness_floor": 58, "strong_factor": 0.70, "strong_offset": -8.0, "mid_factor": 0.80, "mid_offset": -6.0, "base_factor": 0.88, "base_offset": -3.0},
    "ria": {"brightness_floor": 54, "strong_factor": 0.70, "strong_offset": -8.0, "mid_factor": 0.80, "mid_offset": -6.0, "base_factor": 0.88, "base_offset": -3.0},
    "theo": {"brightness_floor": 44, "strong_factor": 0.64, "strong_offset": -10.0, "mid_factor": 0.74, "mid_offset": -8.0, "base_factor": 0.84, "base_offset": -4.0},
    "dorgan": {"brightness_floor": 40, "strong_factor": 0.60, "strong_offset": -10.0, "mid_factor": 0.70, "mid_offset": -8.0, "base_factor": 0.80, "base_offset": -4.0},
    "kiera": {"brightness_floor": 48, "strong_factor": 0.68, "strong_offset": -8.0, "mid_factor": 0.78, "mid_offset": -6.0, "base_factor": 0.86, "base_offset": -3.0},
    "helma": {"brightness_floor": 48, "strong_factor": 0.68, "strong_offset": -8.0, "mid_factor": 0.78, "mid_offset": -6.0, "base_factor": 0.86, "base_offset": -3.0},
    "marin": {"brightness_floor": 48, "strong_factor": 0.68, "strong_offset": -8.0, "mid_factor": 0.78, "mid_offset": -6.0, "base_factor": 0.86, "base_offset": -3.0},
    "serena": {"brightness_floor": 52, "strong_factor": 0.70, "strong_offset": -8.0, "mid_factor": 0.80, "mid_offset": -6.0, "base_factor": 0.88, "base_offset": -3.0},
    "fin": {"brightness_floor": 46, "strong_factor": 0.66, "strong_offset": -9.0, "mid_factor": 0.76, "mid_offset": -7.0, "base_factor": 0.85, "base_offset": -4.0},
    "iris": {"brightness_floor": 46, "strong_factor": 0.66, "strong_offset": -9.0, "mid_factor": 0.76, "mid_offset": -7.0, "base_factor": 0.85, "base_offset": -4.0},
    "wolf": {"brightness_floor": 40, "strong_factor": 0.60, "strong_offset": -10.0, "mid_factor": 0.70, "mid_offset": -8.0, "base_factor": 0.80, "base_offset": -4.0},
    "erin": {"brightness_floor": 48, "strong_factor": 0.68, "strong_offset": -8.0, "mid_factor": 0.78, "mid_offset": -6.0, "base_factor": 0.86, "base_offset": -3.0},
    "nazir": {"brightness_floor": 42, "strong_factor": 0.62, "strong_offset": -10.0, "mid_factor": 0.72, "mid_offset": -8.0, "base_factor": 0.82, "base_offset": -4.0},
    "laila": {"brightness_floor": 48, "strong_factor": 0.68, "strong_offset": -8.0, "mid_factor": 0.78, "mid_offset": -6.0, "base_factor": 0.86, "base_offset": -3.0},
    "hakan": {"brightness_floor": 40, "strong_factor": 0.60, "strong_offset": -10.0, "mid_factor": 0.70, "mid_offset": -8.0, "base_factor": 0.80, "base_offset": -4.0},
    "seraphin": {"brightness_floor": 56, "strong_factor": 0.70, "strong_offset": -8.0, "mid_factor": 0.80, "mid_offset": -6.0, "base_factor": 0.88, "base_offset": -3.0},
    "micaela": {"brightness_floor": 48, "strong_factor": 0.68, "strong_offset": -8.0, "mid_factor": 0.78, "mid_offset": -6.0, "base_factor": 0.86, "base_offset": -3.0},
    "lucian": {"brightness_floor": 44, "strong_factor": 0.64, "strong_offset": -10.0, "mid_factor": 0.74, "mid_offset": -8.0, "base_factor": 0.84, "base_offset": -4.0},
}

OUTLINE_CLEANUP_SUBJECT_IDS: set[str] = set(EDGE_FRINGE_CLEANUP_PROFILES)

AGGRESSIVE_OUTLINE_SUBJECT_IDS: set[str] = {
    "fin",
}

OUTLINE_CLEANUP_SKIP_CLIPS: dict[str, set[str]] = {}

FIT_STRIP_MAX_SCALE_OVERRIDES: dict[str, dict[str, float]] = {
    "dorgan": {
        "idle": 0.94,
    },
    "fin": {
        "shoot_loop": 1.0,
    },
    "iris": {
        "attack_basic_01": 1.0,
    },
}

POST_FIT_STRIP_SCALE_OVERRIDES: dict[str, dict[str, float]] = {
    "hero": {
        "walk": 0.91,
    },
    "fin": {
        "shoot_loop": 0.92,
    },
}

FRAME_MARGIN_POST_SCALE_SUBJECT_CLIPS: dict[str, set[str]] = {
    "dorgan": {"interact"},
    "helma": {"dash_or_dodge", "idle"},
    "serena": {"victory", "down_or_death"},
    "fin": {"aim", "shoot_loop"},
    "iris": {"attack_basic_01", "attack_basic_03", "victory"},
    "wolf": {"attack_basic_01", "attack_basic_02", "charge", "dash_or_dodge", "victory", "down_or_death"},
    "erin": {"walk", "run", "summon_or_rune", "dash_or_dodge"},
    "nazir": {"idle", "attack_basic_03"},
    "laila": {"run"},
    "hakan": {"walk", "run", "heavy_attack"},
    "seraphin": {"run", "attack_basic_02", "pray_idle", "down_or_death"},
}

MANUAL_SOURCE_BOX_IMAGE_OVERRIDES: dict[str, dict[str, str]] = {
    "iris": {
        "attack_basic_01": "approved_master",
    },
    "laila": {},
    "hakan": {},
}

LEGACY_SOURCE_REFRESH_FILES: dict[str, str] = {
    "hero": "01-kain.png",
    "bram": "02-bram.png",
    "sera": "03-sera.png",
    "luna": "04-luna.png",
    "ria": "05-ria.png",
    "theo": "06-theo.png",
    "dorgan": "07-dorgan.png",
    "kiera": "08-kiera.png",
    "helma": "09-helma.png",
    "marin": "10-marin.png",
    "serena": "11-serena.png",
    "fin": "12-finn.png",
    "iris": "13-iris.png",
    "wolf": "14-volf.png",
    "erin": "15-erin.png",
    "nazir": "16-nazir.png",
    "laila": "17-laila.png",
    "hakan": "18-hakan.png",
    "seraphin": "19-seraphine.png",
    "micaela": "20-michaela.png",
    "lucian": "21-lucian.png",
}

FORCE_APPROVED_MASTER_SOURCE_SUBJECT_IDS: set[str] = set()


@dataclass(frozen=True)
class ClipSpec:
    id: str
    frame_count: int
    fps: int
    region: str = "full"
    row_span: int = 1


@dataclass(frozen=True)
class SubjectSpec:
    id: str
    name: str
    sheet_name: str
    layout: str
    rows: tuple[tuple[ClipSpec, ...], ...]


@dataclass(frozen=True)
class CustomClipRepairSpec:
    source_kind: str = "band"
    anchor_mode: str = "upper_body"
    center_detection_mode: str = "uniform"
    search_margin_ratio: float = 0.24
    merge_neighbor_components: bool = False
    merge_area_ratio: float = 0.04
    max_merge_gap_x: int = 18
    max_merge_gap_y: int = 18
    min_component_area: int = 32
    fill_internal_holes: bool = False
    visual_core_start_ratio: float = 0.36
    visual_core_end_ratio: float = 0.88
    upper_body_ratio: float = 0.58


TARGETED_CUSTOM_CLIP_REPAIR_SPECS: dict[str, dict[str, CustomClipRepairSpec]] = {
    "luna": {
        "heal_cast": CustomClipRepairSpec(
            source_kind="band",
            anchor_mode="visual_core",
            search_margin_ratio=0.32,
            merge_neighbor_components=True,
            merge_area_ratio=0.02,
            max_merge_gap_x=40,
            max_merge_gap_y=26,
            fill_internal_holes=True,
            visual_core_start_ratio=0.34,
            visual_core_end_ratio=0.82,
        ),
    },
    "ria": {
        "town_idle": CustomClipRepairSpec(
            source_kind="band",
            anchor_mode="feet",
            search_margin_ratio=0.2,
            fill_internal_holes=True,
        ),
    },
    "helma": {
        "dash_or_dodge": CustomClipRepairSpec(
            source_kind="region_manual",
            anchor_mode="visual_core",
            search_margin_ratio=0.3,
            fill_internal_holes=True,
            visual_core_start_ratio=0.3,
            visual_core_end_ratio=0.9,
        ),
        "idle": CustomClipRepairSpec(source_kind="band", anchor_mode="feet", search_margin_ratio=0.2, fill_internal_holes=True),
    },
    "serena": {
        "victory": CustomClipRepairSpec(source_kind="band", anchor_mode="upper_body", center_detection_mode="components", search_margin_ratio=0.22, fill_internal_holes=True),
        "down_or_death": CustomClipRepairSpec(
            source_kind="band",
            anchor_mode="visual_core",
            center_detection_mode="components",
            search_margin_ratio=0.24,
            fill_internal_holes=True,
            visual_core_start_ratio=0.28,
            visual_core_end_ratio=0.76,
        ),
    },
    "fin": {
        "aim": CustomClipRepairSpec(source_kind="band", anchor_mode="upper_body", center_detection_mode="components", search_margin_ratio=0.22, fill_internal_holes=True),
        "shoot_loop": CustomClipRepairSpec(
            source_kind="band",
            anchor_mode="upper_body",
            center_detection_mode="components",
            search_margin_ratio=0.26,
            merge_neighbor_components=True,
            merge_area_ratio=0.03,
            max_merge_gap_x=24,
            max_merge_gap_y=18,
            fill_internal_holes=True,
        ),
    },
    "iris": {
        "attack_basic_01": CustomClipRepairSpec(
            source_kind="approved_box",
            anchor_mode="upper_body",
            center_detection_mode="components",
            search_margin_ratio=0.22,
            merge_neighbor_components=True,
            merge_area_ratio=0.025,
            max_merge_gap_x=24,
            max_merge_gap_y=18,
        ),
        "attack_basic_03": CustomClipRepairSpec(
            source_kind="band",
            anchor_mode="upper_body",
            center_detection_mode="components",
            search_margin_ratio=0.24,
            merge_neighbor_components=True,
            merge_area_ratio=0.025,
            max_merge_gap_x=24,
            max_merge_gap_y=20,
        ),
        "victory": CustomClipRepairSpec(
            source_kind="band",
            anchor_mode="upper_body",
            search_margin_ratio=0.22,
            fill_internal_holes=True,
        ),
    },
    "wolf": {
        "attack_basic_01": CustomClipRepairSpec(source_kind="band", anchor_mode="upper_body", center_detection_mode="components", search_margin_ratio=0.2, merge_neighbor_components=True, merge_area_ratio=0.02, max_merge_gap_x=22, max_merge_gap_y=18),
        "attack_basic_02": CustomClipRepairSpec(source_kind="band", anchor_mode="upper_body", center_detection_mode="components", search_margin_ratio=0.2, merge_neighbor_components=True, merge_area_ratio=0.02, max_merge_gap_x=24, max_merge_gap_y=20),
        "charge": CustomClipRepairSpec(source_kind="band", anchor_mode="visual_core", center_detection_mode="components", search_margin_ratio=0.22, merge_neighbor_components=True, merge_area_ratio=0.02, max_merge_gap_x=26, max_merge_gap_y=20),
        "dash_or_dodge": CustomClipRepairSpec(source_kind="band", anchor_mode="visual_core", center_detection_mode="components", search_margin_ratio=0.24, fill_internal_holes=True, visual_core_start_ratio=0.28, visual_core_end_ratio=0.84),
        "victory": CustomClipRepairSpec(source_kind="band", anchor_mode="upper_body", center_detection_mode="components", search_margin_ratio=0.2, fill_internal_holes=True),
        "down_or_death": CustomClipRepairSpec(source_kind="band", anchor_mode="visual_core", center_detection_mode="components", search_margin_ratio=0.24, fill_internal_holes=True, visual_core_start_ratio=0.28, visual_core_end_ratio=0.74),
    },
    "erin": {
        "walk": CustomClipRepairSpec(source_kind="band", anchor_mode="feet", search_margin_ratio=0.2, fill_internal_holes=True),
        "run": CustomClipRepairSpec(source_kind="band", anchor_mode="feet", search_margin_ratio=0.22, fill_internal_holes=True),
        "summon_or_rune": CustomClipRepairSpec(source_kind="band", anchor_mode="upper_body", search_margin_ratio=0.28, merge_neighbor_components=True, merge_area_ratio=0.02, max_merge_gap_x=30, max_merge_gap_y=22),
        "dash_or_dodge": CustomClipRepairSpec(source_kind="approved_box", anchor_mode="visual_core", center_detection_mode="components", search_margin_ratio=0.24, fill_internal_holes=True, visual_core_start_ratio=0.28, visual_core_end_ratio=0.86),
    },
    "nazir": {
        "idle": CustomClipRepairSpec(source_kind="approved_box", anchor_mode="feet", center_detection_mode="components", search_margin_ratio=0.2, fill_internal_holes=True),
        "attack_basic_03": CustomClipRepairSpec(source_kind="approved_box", anchor_mode="upper_body", center_detection_mode="components", search_margin_ratio=0.22, merge_neighbor_components=True, merge_area_ratio=0.025, max_merge_gap_x=24, max_merge_gap_y=18),
    },
    "laila": {
        "run": CustomClipRepairSpec(source_kind="approved_box", anchor_mode="feet", center_detection_mode="components", search_margin_ratio=0.2, fill_internal_holes=True),
    },
    "hakan": {
        "walk": CustomClipRepairSpec(source_kind="approved_box", anchor_mode="feet", center_detection_mode="components", search_margin_ratio=0.2, fill_internal_holes=True),
        "run": CustomClipRepairSpec(source_kind="approved_box", anchor_mode="feet", center_detection_mode="components", search_margin_ratio=0.22, fill_internal_holes=True),
        "heavy_attack": CustomClipRepairSpec(source_kind="approved_box", anchor_mode="upper_body", center_detection_mode="components", search_margin_ratio=0.24, merge_neighbor_components=True, merge_area_ratio=0.025, max_merge_gap_x=28, max_merge_gap_y=22),
    },
    "seraphin": {
        "run": CustomClipRepairSpec(source_kind="band", anchor_mode="feet", center_detection_mode="components", search_margin_ratio=0.22, fill_internal_holes=True),
        "attack_basic_02": CustomClipRepairSpec(source_kind="legacy_box", anchor_mode="upper_body", center_detection_mode="components", search_margin_ratio=0.22, merge_neighbor_components=True, merge_area_ratio=0.025, max_merge_gap_x=24, max_merge_gap_y=18),
        "pray_idle": CustomClipRepairSpec(source_kind="band", anchor_mode="feet", center_detection_mode="components", search_margin_ratio=0.2, fill_internal_holes=True),
        "down_or_death": CustomClipRepairSpec(source_kind="band", anchor_mode="visual_core", center_detection_mode="components", search_margin_ratio=0.24, fill_internal_holes=True, visual_core_start_ratio=0.28, visual_core_end_ratio=0.74),
    },
}


@dataclass(frozen=True)
class MaskComponent:
    index: int
    min_x: int
    min_y: int
    max_x: int
    max_y: int
    area: int
    touches_border: bool

    @property
    def center_x(self) -> float:
        return (self.min_x + self.max_x) / 2


@dataclass(frozen=True)
class ExtractedFrame:
    image: Image.Image
    anchor_x: float
    anchor_y: float


@dataclass(frozen=True)
class ManualFrameSource:
    component_index: int
    split_part: int = 0
    split_total: int = 1


@dataclass(frozen=True)
class ManualClipExtractionSpec:
    y_start: int
    y_end: int
    frames: tuple[ManualFrameSource, ...]


@dataclass(frozen=True)
class RegionManualClipExtractionSpec:
    x_start: int
    x_end: int
    y_start: int
    y_end: int
    frames: tuple[ManualFrameSource, ...]
    use_alpha_analysis: bool = False
    source_frame_count: int | None = None


@dataclass(frozen=True)
class SlotLockedRowRegionSpec:
    x_start: int
    x_end: int
    y_start: int
    y_end: int
    slots: tuple[tuple[int, int], ...]
    source_frame_count: int | None = None


@dataclass(frozen=True)
class PackagePanelBox:
    x_start: int
    x_end: int
    y_start: int
    y_end: int
    source_clip_id: str | None = None


MANUAL_CLIP_EXTRACTION_SPECS: dict[str, dict[str, ManualClipExtractionSpec]] = {
    "hero": {
        "idle": ManualClipExtractionSpec(
            y_start=110,
            y_end=192,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
        "walk": ManualClipExtractionSpec(
            y_start=205,
            y_end=280,
            frames=tuple(ManualFrameSource(index) for index in range(7)),
        ),
        "run": ManualClipExtractionSpec(
            y_start=300,
            y_end=370,
            frames=tuple(ManualFrameSource(index) for index in range(7)),
        ),
        "attack_basic_01": ManualClipExtractionSpec(
            y_start=382,
            y_end=456,
            frames=tuple(ManualFrameSource(index) for index in range(6)),
        ),
        "attack_basic_02": ManualClipExtractionSpec(
            y_start=471,
            y_end=546,
            frames=tuple(ManualFrameSource(index) for index in range(6)),
        ),
        "attack_basic_03": ManualClipExtractionSpec(
            y_start=560,
            y_end=631,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
        "skill_cast": ManualClipExtractionSpec(
            y_start=646,
            y_end=727,
            frames=(
                ManualFrameSource(0),
                ManualFrameSource(1),
                ManualFrameSource(2),
                ManualFrameSource(3),
                ManualFrameSource(4),
                ManualFrameSource(5, 0, 2),
                ManualFrameSource(5, 1, 2),
            ),
        ),
        "hit_react": ManualClipExtractionSpec(
            y_start=742,
            y_end=816,
            frames=tuple(ManualFrameSource(index) for index in range(4)),
        ),
        "dash_or_dodge": ManualClipExtractionSpec(
            y_start=835,
            y_end=898,
            frames=tuple(ManualFrameSource(index) for index in range(4)),
        ),
        "guard_or_block": ManualClipExtractionSpec(
            y_start=914,
            y_end=980,
            frames=tuple(ManualFrameSource(index) for index in range(3)),
        ),
        "charge": ManualClipExtractionSpec(
            y_start=994,
            y_end=1062,
            frames=tuple(ManualFrameSource(index) for index in range(4)),
        ),
        "town_idle": ManualClipExtractionSpec(
            y_start=1077,
            y_end=1148,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
        "talk": ManualClipExtractionSpec(
            y_start=1161,
            y_end=1227,
            frames=tuple(ManualFrameSource(index) for index in range(3)),
        ),
        "victory": ManualClipExtractionSpec(
            y_start=1241,
            y_end=1307,
            frames=tuple(ManualFrameSource(index) for index in range(6)),
        ),
        "down_or_death": ManualClipExtractionSpec(
            y_start=1324,
            y_end=1377,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
    },
}


def build_manual_source_boxes(centers: tuple[int, ...], y_start: int, y_end: int, width: int) -> tuple[tuple[int, int, int, int], ...]:
    half_width = width // 2
    return tuple((center - half_width, y_start, center + half_width, y_end) for center in centers)


def build_variable_width_source_boxes(
    entries: tuple[int | tuple[int, int], ...],
    y_start: int,
    y_end: int,
    default_width: int,
) -> tuple[tuple[int, int, int, int], ...]:
    boxes: list[tuple[int, int, int, int]] = []

    for entry in entries:
        if isinstance(entry, tuple):
            center, width = entry
        else:
            center, width = entry, default_width
        half_width = width // 2
        boxes.append((center - half_width, y_start, center + half_width, y_end))

    return tuple(boxes)


def build_even_source_boxes(
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    frame_count: int,
    pad: int = 0,
) -> tuple[tuple[int, int, int, int], ...]:
    width = (x_end - x_start) / frame_count
    boxes: list[tuple[int, int, int, int]] = []
    for index in range(frame_count):
        left = int(round(x_start + (index * width))) - pad
        right = int(round(x_start + ((index + 1) * width))) + pad
        boxes.append((left, y_start, right, y_end))
    return tuple(boxes)


def build_package_panel_even_source_boxes(
    panel_box: PackagePanelBox,
    frame_count: int,
    pad: int = 4,
    inset_left: int = 18,
    inset_right: int = 10,
    inset_top: int = 22,
    inset_bottom: int = 6,
) -> tuple[tuple[int, int, int, int], ...]:
    return build_even_source_boxes(
        panel_box.x_start + inset_left,
        panel_box.x_end - inset_right,
        panel_box.y_start + inset_top,
        panel_box.y_end - inset_bottom,
        frame_count,
        pad=pad,
    )


HERO_SOURCE_BOXES = {
    "idle": (
        (19, 150, 91, 236),
        (83, 150, 156, 236),
        (148, 150, 220, 236),
        (212, 150, 286, 236),
        (278, 150, 351, 236),
    ),
    "walk": build_manual_source_boxes((670, 760, 850, 940, 1030, 1120), 150, 236, 92),
    "run": build_manual_source_boxes((57, 122, 188, 253, 320, 385, 451, 516), 322, 406, 90),
    "attack_basic_01": build_manual_source_boxes((674, 781, 888, 995, 1100), 334, 410, 102),
    "attack_basic_02": build_manual_source_boxes((65, 152, 243, 332, 423, 516), 520, 670, 100),
    "attack_basic_03": build_manual_source_boxes((675, 790, 908, 1020, 1131), 520, 670, 112),
    "talk": (
        (20, 1170, 108, 1300),
        (126, 1170, 222, 1300),
    ),
    "victory": (
        (372, 1164, 488, 1290),
        (488, 1160, 610, 1290),
        (432, 1230, 560, 1300),
        (538, 1222, 700, 1300),
    ),
    "down_or_death": (
        (756, 1152, 908, 1292),
        (868, 1202, 1040, 1300),
        (996, 1210, 1198, 1300),
    ),
}

HERO_MANUAL_BOX_CLIP_SOURCES: dict[str, tuple[tuple[int, int, int, int], ...]] = {
    "idle": HERO_SOURCE_BOXES["idle"],
    "walk": HERO_SOURCE_BOXES["walk"],
    "run": HERO_SOURCE_BOXES["run"],
    "attack_basic_01": HERO_SOURCE_BOXES["attack_basic_01"],
    "attack_basic_02": HERO_SOURCE_BOXES["attack_basic_02"],
    "attack_basic_03": HERO_SOURCE_BOXES["attack_basic_03"],
    # The current sheet only provides head-closeups for hit rows, so keep the closest
    # full-body proxy there until corrected source rows arrive.
    "skill_cast": HERO_SOURCE_BOXES["attack_basic_02"],
    "hit_react": HERO_SOURCE_BOXES["attack_basic_01"],
    "dash_or_dodge": HERO_SOURCE_BOXES["run"],
    "talk": HERO_SOURCE_BOXES["talk"],
    "down_or_death": HERO_SOURCE_BOXES["down_or_death"],
}

HERO_ROW_INTERVAL_CLIP_SPECS: dict[str, tuple[tuple[int, int, int, int], tuple[tuple[int, int], ...]]] = {
    "idle": (
        (20, 146, 540, 236),
        ((21, 69), (83, 130), (145, 192), (205, 252), (267, 316)),
    ),
    "walk": (
        (640, 146, 1145, 236),
        ((32, 92), (141, 214), (227, 283), (316, 374), (384, 442), (454, 504)),
    ),
    "run": (
        (20, 320, 540, 408),
        ((22, 67), (80, 127), (137, 184), (201, 248), (259, 306), (336, 385), (412, 461), (479, 519)),
    ),
    "attack_basic_01": (
        (630, 330, 1145, 430),
        ((35, 86), (133, 185), (233, 286), (331, 388), (457, 511)),
    ),
    "attack_basic_02": (
        (18, 545, 530, 650),
        ((28, 71), (79, 126), (149, 191), (202, 253), (304, 348), (385, 430)),
    ),
    "attack_basic_03": (
        (640, 545, 1155, 650),
        ((30, 88), (126, 213), (223, 312), (334, 389), (457, 505)),
    ),
    "guard_or_block": (
        (650, 735, 1148, 828),
        ((0, 78), (106, 184), (210, 288), (314, 392), (420, 498)),
    ),
    "charge": (
        (10, 910, 566, 1015),
        ((0, 80), (68, 148), (136, 216), (204, 284), (272, 352), (340, 420), (408, 488), (476, 556)),
    ),
    "town_idle": (
        (650, 915, 1146, 1035),
        ((0, 80), (110, 190), (202, 282), (314, 394), (416, 496)),
    ),
}

HERO_PROXY_SOURCE_CLIPS: dict[str, str] = {
    "skill_cast": "charge",
    "hit_react": "attack_basic_01",
    "dash_or_dodge": "run",
    "victory": "talk",
}

HERO_EXACT_BOX_CLIP_IDS = {
    "run",
    "attack_basic_03",
    "down_or_death",
}

HERO_FILTERED_BOX_CLIP_IDS = {
    "talk",
}

HERO_PACKAGE_OVERRIDE_CLIP_IDS = {
    "idle",
    "walk",
    "run",
    "attack_basic_01",
    "attack_basic_02",
    "attack_basic_03",
    "skill_cast",
    "hit_react",
    "dash_or_dodge",
    "guard_or_block",
    "charge",
    "town_idle",
    "talk",
    "victory",
    "down_or_death",
}

REGION_MANUAL_CLIP_EXTRACTION_SPECS: dict[str, dict[str, RegionManualClipExtractionSpec]] = {
    "bram": {
        "idle": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=98,
            y_end=182,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
        "walk": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=182,
            y_end=266,
            frames=tuple(ManualFrameSource(index) for index in range(7)),
        ),
        "run": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=266,
            y_end=347,
            frames=tuple(ManualFrameSource(index) for index in range(6)),
        ),
        "attack_basic_01": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=347,
            y_end=429,
            frames=tuple(ManualFrameSource(index) for index in range(6)),
        ),
        "attack_basic_02": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=429,
            y_end=514,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
        "heavy_attack": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=514,
            y_end=605,
            frames=(
                ManualFrameSource(0),
                ManualFrameSource(1),
                ManualFrameSource(2),
                ManualFrameSource(3),
                ManualFrameSource(4, 0, 2),
                ManualFrameSource(4, 1, 2),
                ManualFrameSource(5),
                ManualFrameSource(6),
            ),
        ),
        "skill_cast": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=605,
            y_end=692,
            frames=tuple(ManualFrameSource(index) for index in range(6)),
        ),
        "hit_react": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=692,
            y_end=775,
            frames=tuple(ManualFrameSource(index) for index in range(4)),
        ),
        "dash_or_dodge": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=775,
            y_end=856,
            frames=tuple(ManualFrameSource(index) for index in range(4)),
        ),
        "guard_or_block": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=856,
            y_end=940,
            frames=tuple(ManualFrameSource(index) for index in range(3)),
        ),
        "taunt_or_command": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=940,
            y_end=1024,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
        "town_idle": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=1024,
            y_end=1111,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
        "interact": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=1111,
            y_end=1191,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
        "victory": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=1191,
            y_end=1278,
            frames=(
                ManualFrameSource(0),
                ManualFrameSource(4),
                ManualFrameSource(5),
                ManualFrameSource(6),
            ),
        ),
        "down_or_death": RegionManualClipExtractionSpec(
            x_start=209,
            x_end=1103,
            y_start=1278,
            y_end=1392,
            frames=tuple(ManualFrameSource(index) for index in range(5)),
        ),
    },
    "helma": {
        "dash_or_dodge": RegionManualClipExtractionSpec(
            x_start=216,
            x_end=640,
            y_start=919,
            y_end=1010,
            frames=tuple(ManualFrameSource(1, index, 5) for index in range(5)),
            use_alpha_analysis=True,
        ),
        "guard_or_block": RegionManualClipExtractionSpec(
            x_start=231,
            x_end=640,
            y_start=850,
            y_end=928,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=3,
        ),
    },
    "sera": {
        "cast_loop": RegionManualClipExtractionSpec(
            x_start=250,
            x_end=560,
            y_start=604,
            y_end=698,
            frames=(
                ManualFrameSource(0),
                ManualFrameSource(1),
                ManualFrameSource(2),
                ManualFrameSource(3),
            ),
            use_alpha_analysis=True,
        ),
    },
    "seraphin": {
        "attack_basic_01": RegionManualClipExtractionSpec(
            x_start=761,
            x_end=1187,
            y_start=264,
            y_end=402,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=6,
        ),
        "hit_react": RegionManualClipExtractionSpec(
            x_start=148,
            x_end=390,
            y_start=650,
            y_end=797,
            frames=(
                ManualFrameSource(0, 0, 2),
                ManualFrameSource(0, 1, 2),
                ManualFrameSource(2, 0, 2),
                ManualFrameSource(2, 1, 2),
            ),
            use_alpha_analysis=True,
        ),
    },
    "marin": {
        "dash_or_dodge": RegionManualClipExtractionSpec(
            x_start=227,
            x_end=780,
            y_start=841,
            y_end=919,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=5,
        ),
    },
    "luna": {
        "walk": RegionManualClipExtractionSpec(
            x_start=225,
            x_end=1103,
            y_start=200,
            y_end=285,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=8,
        ),
        "buff_cast": RegionManualClipExtractionSpec(
            x_start=225,
            x_end=1103,
            y_start=629,
            y_end=717,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=6,
        ),
        "talk": RegionManualClipExtractionSpec(
            x_start=225,
            x_end=1103,
            y_start=1054,
            y_end=1140,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=4,
        ),
        "victory": RegionManualClipExtractionSpec(
            x_start=224,
            x_end=1103,
            y_start=1140,
            y_end=1234,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=6,
        ),
    },
    "iris": {
        "attack_basic_01": RegionManualClipExtractionSpec(
            x_start=880,
            x_end=1236,
            y_start=273,
            y_end=418,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=6,
        ),
    },
    "laila": {
        "walk": RegionManualClipExtractionSpec(
            x_start=699,
            x_end=1187,
            y_start=124,
            y_end=272,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=8,
        ),
        "hit_react": RegionManualClipExtractionSpec(
            x_start=154,
            x_end=584,
            y_start=688,
            y_end=959,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=4,
        ),
        "victory": RegionManualClipExtractionSpec(
            x_start=173,
            x_end=584,
            y_start=1100,
            y_end=1199,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=8,
        ),
        "down_or_death": RegionManualClipExtractionSpec(
            x_start=190,
            x_end=740,
            y_start=1100,
            y_end=1199,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=6,
        ),
    },
    "hakan": {
        "charge": RegionManualClipExtractionSpec(
            x_start=158,
            x_end=609,
            y_start=557,
            y_end=695,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=5,
        ),
        "dash_or_dodge": RegionManualClipExtractionSpec(
            x_start=196,
            x_end=609,
            y_start=828,
            y_end=960,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=4,
        ),
    },
    "nazir": {
        "walk": RegionManualClipExtractionSpec(
            x_start=696,
            x_end=1185,
            y_start=120,
            y_end=265,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=8,
        ),
        "attack_basic_02": RegionManualClipExtractionSpec(
            x_start=162,
            x_end=583,
            y_start=405,
            y_end=543,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=6,
        ),
        "hit_react": RegionManualClipExtractionSpec(
            x_start=619,
            x_end=1185,
            y_start=676,
            y_end=812,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=4,
        ),
        "attack_basic_03": RegionManualClipExtractionSpec(
            x_start=761,
            x_end=1185,
            y_start=405,
            y_end=543,
            frames=(),
            use_alpha_analysis=False,
            source_frame_count=6,
        ),
    },
}

SLOT_LOCKED_ROW_REGION_SPECS: dict[str, dict[str, SlotLockedRowRegionSpec]] = {
    "iris": {
        "victory": SlotLockedRowRegionSpec(
            x_start=767,
            x_end=1203,
            y_start=972,
            y_end=1082,
            slots=((0, 66), (72, 138), (144, 210), (216, 282), (288, 354), (360, 430)),
            source_frame_count=6,
        ),
    },
    "wolf": {
        "attack_basic_02": SlotLockedRowRegionSpec(
            x_start=143,
            x_end=598,
            y_start=428,
            y_end=526,
            slots=((0, 62), (68, 130), (136, 198), (204, 266), (272, 334), (340, 402)),
            source_frame_count=6,
        ),
    },
    "laila": {
        "run": SlotLockedRowRegionSpec(
            x_start=141,
            x_end=646,
            y_start=276,
            y_end=368,
            slots=((0, 66), (72, 138), (144, 210), (216, 282), (288, 354), (360, 426), (432, 498)),
            source_frame_count=7,
        ),
    },
    "seraphin": {
        "pray_idle": SlotLockedRowRegionSpec(
            x_start=703,
            x_end=1176,
            y_start=945,
            y_end=1053,
            slots=((0, 68), (76, 144), (152, 220), (228, 296), (304, 372), (380, 448)),
            source_frame_count=6,
        ),
    },
}

SLOT_LOCKED_ROW_REGION_CENTER_OPTIONS: dict[str, dict[str, dict[str, float | int]]] = {
    "iris": {
        "victory": {"target_x_ratio": 0.72, "target_y_ratio": 0.58, "merge_gap": 4},
    },
    "seraphin": {
        "pray_idle": {"target_x_ratio": 0.72, "target_y_ratio": 0.6, "merge_gap": 4},
    },
}

DIRECT_CURATED_SLOT_LOCKED_STRIP_OPTIONS: dict[str, dict[str, dict[str, object]]] = {
    "laila": {
        "run": {
            "max_scale": 0.94,
        },
    },
}

FINAL_DIRECT_CURATED_SLOT_LOCKED_OVERRIDES: dict[str, set[str]] = {
    "laila": {"run"},
}

EXPLICIT_FULLSHEET_FRAME_SEQUENCE_SPECS: dict[str, dict[str, dict[str, object]]] = {
    "iris": {
        "victory": {
            "source_boxes": (
                (763, 930, 875, 1082),
                (856, 930, 930, 1082),
                (931, 930, 998, 1082),
                (999, 930, 1068, 1082),
                (1069, 930, 1138, 1082),
                (1139, 930, 1208, 1082),
            ),
            "frame_order": (0, 1, 2, 3, 4, 5, 5, 5),
            "max_scale": 0.90,
            "extract_mode": "raw",
            "anchor_mode": "upper_body",
        },
    },
    "wolf": {
        "attack_basic_02": {
            "source_boxes": (
                (712, 498, 775, 578),
                (792, 498, 855, 578),
                (875, 498, 938, 578),
                (956, 498, 1019, 578),
                (1037, 498, 1100, 578),
                (1124, 498, 1187, 578),
                (1211, 494, 1276, 580),
                (1288, 490, 1388, 582),
            ),
            "frame_order": (0, 1, 2, 3, 4, 5, 6, 7),
            "max_scale": 0.88,
            "extract_mode": "package_raw",
            "anchor_mode": "upper_body",
        },
    },
    "seraphin": {
        "pray_idle": {
            "source_boxes": (
                (710, 824, 788, 904),
                (794, 824, 872, 904),
                (881, 824, 959, 904),
                (968, 824, 1046, 904),
                (1054, 824, 1132, 904),
            ),
            "frame_order": (0, 1, 2, 3, 4, 4),
            "max_scale": 0.90,
            "extract_mode": "raw",
            "anchor_mode": "upper_body",
        },
    },
}

FINAL_EXPLICIT_FULLSHEET_FRAME_SEQUENCE_OVERRIDES: dict[str, set[str]] = {
    "iris": {"victory"},
    "wolf": {"attack_basic_02"},
    "seraphin": {"pray_idle"},
}

EXACT_ORIGINAL_ROW_REGION_SPECS: dict[str, dict[str, tuple[int, int, int, int]]] = {
    "iris": {
        "attack_basic_01": (880, 273, 1236, 418),
    },
    "wolf": {
        "attack_basic_01": (818, 284, 1248, 379),
        "charge": (142, 582, 585, 679),
    },
    "erin": {
        "summon_or_rune": (668, 583, 1177, 685),
        "dash_or_dodge": (646, 739, 1149, 839),
    },
    "hakan": {
        "run": (209, 273, 647, 370),
        "heavy_attack": (738, 550, 1253, 656),
    },
    "seraphin": {
        "run": (150, 266, 618, 349),
        "down_or_death": (167, 1118, 724, 1201),
    },
}

EXACT_ORIGINAL_ROW_REGION_SOURCE_COUNTS: dict[str, dict[str, int]] = {
    "iris": {
        "attack_basic_01": 6,
    },
    "wolf": {
        "attack_basic_01": 7,
        "charge": 6,
    },
    "erin": {
        "summon_or_rune": 6,
        "dash_or_dodge": 5,
    },
    "hakan": {
        "run": 6,
        "heavy_attack": 6,
    },
    "seraphin": {
        "run": 7,
        "down_or_death": 6,
    },
}

EXACT_ORIGINAL_ROW_REGION_GRID_SUBJECT_CLIPS: dict[str, set[str]] = {}

MANUAL_SOURCE_BOX_CLIP_SPECS: dict[str, dict[str, tuple[tuple[int, int, int, int], ...]]] = {
    "helma": {
        "summon_or_rune": build_manual_source_boxes((267, 370, 472, 578, 681, 789, 896, 996), 602, 687, 78),
        "idle": (
            (241, 102, 333, 186),
            (337, 102, 428, 185),
            (436, 102, 523, 185),
            (534, 102, 621, 185),
            (629, 103, 716, 185),
        ),
        "dash_or_dodge": (
            (240, 852, 335, 928),
            (336, 852, 445, 928),
            (446, 852, 555, 928),
        ),
    },
    "serena": {
        "attack_basic_01": build_manual_source_boxes((200, 280, 354, 433, 511), 278, 370, 88),
        "victory": (
            (244, 1068, 320, 1190),
            (320, 1068, 399, 1190),
            (398, 1068, 477, 1190),
            (476, 1068, 555, 1190),
            (554, 1068, 633, 1190),
            (632, 1068, 708, 1190),
        ),
        "down_or_death": (
            (924, 1068, 1004, 1190),
            (1003, 1068, 1084, 1190),
            (1083, 1068, 1163, 1190),
            (1162, 1068, 1240, 1190),
        ),
        "hit_react": (
            (146, 720, 238, 860),
            (238, 720, 332, 860),
            (332, 720, 426, 860),
            (426, 720, 530, 860),
        ),
    },
    "fin": {
        "aim": (
            (918, 285, 1003, 394),
            (995, 285, 1084, 394),
            (1076, 285, 1166, 394),
            (1158, 285, 1243, 394),
        ),
        "shoot_loop": (
            (164, 441, 261, 548),
            (254, 441, 362, 548),
            (350, 441, 459, 548),
            (447, 441, 549, 548),
        ),
    },
    "iris": {
        "attack_basic_01": (
            (655, 254, 735, 336),
            (739, 254, 820, 336),
            (824, 254, 905, 336),
            (909, 254, 990, 336),
            (994, 254, 1075, 336),
            (1079, 254, 1160, 336),
        ),
        "attack_basic_03": (
            (770, 425, 845, 520),
            (848, 425, 923, 520),
            (926, 425, 1001, 520),
            (1004, 425, 1079, 520),
            (1082, 425, 1157, 520),
            (1160, 425, 1235, 520),
        ),
        "victory": (
            (767, 972, 851, 1082),
            (852, 972, 921, 1082),
            (922, 972, 991, 1082),
            (992, 972, 1061, 1082),
            (1062, 972, 1131, 1082),
            (1132, 972, 1203, 1082),
        ),
    },
    "luna": {
        "idle": build_manual_source_boxes((282, 389, 494, 597, 704), 114, 186, 114),
        "walk": build_manual_source_boxes((278, 384, 488, 592, 697, 796, 895, 994), 200, 285, 116),
        "run": build_manual_source_boxes((285, 396, 504, 611, 721, 832, 944), 285, 370, 122),
        "attack_basic_01": build_variable_width_source_boxes((283, 395, 504, 616, (759, 290)), 370, 455, 118),
        "attack_basic_02": build_variable_width_source_boxes((283, 395, 504, 616, (770, 270)), 448, 534, 118),
        "heal_cast": build_variable_width_source_boxes(
            (280, 399, 506, 612, 719, 832, (910, 208), (930, 380)),
            530,
            635,
            118,
        ),
        "buff_cast": build_variable_width_source_boxes((286, 403, 511, 616, (842, 330)), 629, 717, 118),
        "pray_idle": build_manual_source_boxes((268, 391, 505, 605, 712), 721, 799, 112),
        "hit_react": build_manual_source_boxes((265, 388, 501), 807, 889, 108),
        "dash_or_dodge": build_variable_width_source_boxes(
            ((279, 150), (398, 170), (535, 176), (535, 176), (682, 160), (682, 160)),
            888,
            979,
            118,
        ),
        "town_idle": build_manual_source_boxes((274, 389, 504, 608, 714), 970, 1054, 108),
        "talk": build_manual_source_boxes((282, 395, 504, 606), 1054, 1140, 112),
        "victory": build_manual_source_boxes((292, 402, 509, 616, 725, 843), 1140, 1234, 116),
        "down_or_death": build_variable_width_source_boxes((279, 390, 502, (626, 160), (768, 220), (928, 240)), 1230, 1332, 118),
    },
    "sera": {
        "walk": (
            (184, 198, 316, 285),
            (296, 198, 426, 285),
            (408, 198, 538, 285),
            (520, 198, 646, 285),
            (632, 198, 758, 285),
            (744, 198, 870, 285),
            (856, 198, 982, 285),
            (968, 198, 1095, 285),
        ),
    },
    "dorgan": {
        "idle": build_variable_width_source_boxes(
            ((272, 116), (380, 116), (487, 116), (594, 116), (701, 120)),
            90,
            185,
            116,
        ),
        "attack_basic_02": (
            (188, 430, 313, 520),
            (313, 430, 438, 520),
            (438, 430, 563, 520),
            (563, 430, 688, 520),
            (688, 430, 813, 520),
            (813, 430, 938, 520),
            (938, 430, 1095, 520),
        ),
        "interact": (
            (219, 1008, 327, 1076),
            (337, 1008, 447, 1076),
            (449, 1008, 557, 1076),
            (559, 1008, 669, 1076),
            (667, 1008, 775, 1076),
            (772, 1008, 872, 1076),
        ),
        "skill_cast": build_even_source_boxes(213, 1121, 590, 673, 8, pad=4),
    },
    "laila": {
        "run": (
            (141, 276, 213, 368),
            (214, 276, 286, 368),
            (287, 276, 359, 368),
            (360, 276, 432, 368),
            (433, 276, 505, 368),
            (506, 276, 578, 368),
            (579, 276, 646, 368),
        ),
    },
    "wolf": {
        "attack_basic_01": (
            (821, 286, 878, 378),
            (879, 286, 936, 378),
            (937, 286, 994, 378),
            (995, 286, 1052, 378),
            (1053, 286, 1110, 378),
            (1111, 286, 1168, 378),
            (1169, 286, 1248, 378),
        ),
        "attack_basic_02": (
            (143, 428, 207, 526),
            (208, 428, 272, 526),
            (273, 428, 337, 526),
            (338, 428, 402, 526),
            (403, 428, 467, 526),
            (468, 428, 532, 526),
            (533, 428, 598, 526),
        ),
        "charge": (
            (145, 584, 214, 678),
            (219, 584, 288, 678),
            (293, 584, 362, 678),
            (367, 584, 436, 678),
            (441, 584, 510, 678),
            (515, 584, 584, 678),
        ),
        "dash_or_dodge": (
            (743, 886, 833, 989),
            (826, 886, 926, 989),
            (916, 886, 1014, 989),
            (1010, 886, 1098, 989),
            (1098, 886, 1188, 989),
        ),
        "down_or_death": (
            (851, 1072, 930, 1170),
            (920, 1072, 1000, 1170),
            (990, 1072, 1085, 1170),
            (1070, 1072, 1158, 1170),
            (1138, 1072, 1239, 1170),
            (1138, 1072, 1239, 1170),
        ),
        "victory": (
            (162, 1072, 233, 1170),
            (221, 1072, 298, 1170),
            (286, 1072, 363, 1170),
            (351, 1072, 428, 1170),
            (416, 1072, 492, 1170),
            (480, 1072, 557, 1170),
            (545, 1072, 622, 1170),
            (610, 1072, 681, 1170),
        ),
        "heavy_attack": (
            (744, 430, 809, 565),
            (809, 430, 872, 565),
            (872, 430, 936, 565),
            (936, 430, 999, 565),
            (999, 430, 1062, 565),
            (1062, 430, 1125, 565),
            (1125, 430, 1188, 565),
            (1188, 430, 1254, 565),
        ),
    },
    "erin": {
        "walk": (
            (672, 120, 744, 223),
            (737, 120, 813, 223),
            (806, 120, 881, 223),
            (875, 120, 950, 223),
            (943, 120, 1019, 223),
            (1012, 120, 1088, 223),
            (1081, 120, 1153, 223),
        ),
        "run": (
            (118, 276, 193, 379),
            (185, 276, 264, 379),
            (257, 276, 335, 379),
            (328, 276, 407, 379),
            (400, 276, 478, 379),
            (471, 276, 550, 379),
            (543, 276, 618, 379),
        ),
        "summon_or_rune": (
            (669, 583, 744, 685),
            (747, 583, 822, 685),
            (825, 583, 900, 685),
            (903, 583, 978, 685),
            (981, 583, 1056, 685),
            (1059, 583, 1136, 685),
        ),
        "dash_or_dodge": (
            (647, 739, 734, 839),
            (747, 739, 834, 839),
            (847, 739, 934, 839),
            (947, 739, 1034, 839),
            (1047, 739, 1134, 839),
        ),
    },
    "hakan": {
        "run": (
            (210, 273, 284, 370),
            (283, 273, 357, 370),
            (356, 273, 430, 370),
            (429, 273, 503, 370),
            (502, 273, 576, 370),
            (575, 273, 649, 370),
        ),
        "heavy_attack": (
            (739, 550, 812, 656),
            (821, 550, 894, 656),
            (903, 550, 976, 656),
            (985, 550, 1058, 656),
            (1067, 550, 1140, 656),
            (1149, 550, 1250, 656),
        ),
        "walk": (
            (724, 129, 800, 229),
            (793, 129, 872, 229),
            (865, 129, 944, 229),
            (937, 129, 1016, 229),
            (1009, 129, 1088, 229),
            (1081, 129, 1160, 229),
            (1153, 129, 1229, 229),
        ),
    },
    "seraphin": {
        "attack_basic_01": (
            (744, 257, 812, 409),
            (812, 257, 880, 409),
            (880, 257, 948, 409),
            (948, 257, 1016, 409),
            (1016, 257, 1084, 409),
            (1084, 257, 1148, 409),
            (1084, 257, 1148, 409),
        ),
        "run": (
            (151, 266, 218, 349),
            (219, 266, 286, 349),
            (287, 266, 354, 349),
            (355, 266, 422, 349),
            (423, 266, 490, 349),
            (491, 266, 558, 349),
            (559, 266, 626, 349),
        ),
        "attack_basic_02": (
            (150, 382, 223, 496),
            (211, 382, 289, 496),
            (277, 382, 356, 496),
            (344, 382, 422, 496),
            (410, 382, 489, 496),
            (477, 382, 555, 496),
            (543, 382, 616, 496),
        ),
        "pray_idle": (
            (703, 945, 781, 1053),
            (782, 945, 860, 1053),
            (861, 945, 939, 1053),
            (940, 945, 1018, 1053),
            (1019, 945, 1097, 1053),
            (1098, 945, 1176, 1053),
        ),
        "down_or_death": (
            (167, 1118, 236, 1201),
            (239, 1118, 308, 1201),
            (311, 1118, 380, 1201),
            (383, 1118, 466, 1201),
            (469, 1118, 580, 1201),
            (583, 1118, 724, 1201),
        ),
    },
    "nazir": {
        "idle": (
            (157, 122, 237, 206),
            (230, 122, 315, 206),
            (308, 122, 392, 206),
            (385, 122, 470, 206),
            (463, 122, 544, 206),
        ),
        "attack_basic_03": (
            (744, 398, 821, 488),
            (813, 398, 894, 488),
            (886, 398, 967, 488),
            (958, 398, 1040, 488),
            (1031, 398, 1112, 488),
            (1104, 398, 1179, 488),
        ),
        "walk": (
            (696, 110, 753, 254),
            (753, 110, 812, 254),
            (812, 110, 880, 254),
            (880, 110, 948, 254),
            (948, 110, 1016, 254),
            (1016, 110, 1085, 254),
            (1085, 110, 1154, 254),
            (1154, 110, 1185, 254),
        ),
        "run": (
            (144, 255, 214, 395),
            (214, 255, 280, 395),
            (280, 255, 347, 395),
            (347, 255, 414, 395),
            (414, 255, 481, 395),
            (481, 255, 548, 395),
            (548, 255, 615, 395),
            (615, 255, 640, 395),
        ),
    },
}

AUTO_PAIRED_SINGLE_LAYOUT_IDS: set[str] = {
    "iris",
    "serena",
    "wolf",
    "erin",
    "nazir",
    "laila",
    "hakan",
    "seraphin",
    "micaela",
}

AUTO_PAIRED_SINGLE_LAYOUT_SKIP_SUBJECT_IDS: set[str] = {
    "luna",
}

FORCE_UNIFORM_SINGLE_ROW_BAND_SUBJECT_IDS: set[str] = {
    "dorgan",
}

AUTO_PAIRED_TRAILING_FULL_ROW_SUBJECT_IDS: set[str] = {
    "erin",
    "laila",
    "micaela",
}

NUMBERED_ROW_SOURCE_BOX_SUBJECT_IDS: set[str] = {
    "dorgan",
    "wolf",
    "erin",
    "nazir",
    "laila",
    "hakan",
    "seraphin",
    "micaela",
}

NUMBERED_ROW_SOURCE_BOX_SUBJECT_CLIPS: dict[str, set[str]] = {
    "iris": {"attack_basic_01"},
    "erin": {"dash_or_dodge"},
}

APPROVED_MASTER_CLIP_SOURCE_BOXES: dict[str, dict[str, tuple[int, int, int, int]]] = {
    "nazir": {
        "idle": (14, 126, 549, 262),
        "walk": (569, 125, 1146, 266),
        "run": (15, 276, 603, 413),
        "attack_basic_01": (617, 276, 1150, 413),
        "attack_basic_02": (15, 423, 555, 562),
        "attack_basic_03": (568, 423, 1147, 558),
        "charge": (15, 573, 539, 709),
        "skill_cast": (555, 573, 1151, 705),
        "stealth_entry": (16, 721, 622, 856),
        "hit_react": (638, 721, 1151, 856),
        "dash_or_dodge": (15, 868, 583, 1003),
        "town_idle": (602, 868, 1151, 1004),
        "talk": (16, 1016, 402, 1161),
        "victory": (424, 1016, 1151, 1162),
        "down_or_death": (17, 1175, 712, 1308),
    },
    "laila": {
        "idle": (17, 125, 546, 270),
        "walk": (565, 125, 1137, 270),
        "run": (17, 283, 619, 419),
        "attack_basic_01": (640, 283, 1137, 418),
        "attack_basic_02": (17, 433, 577, 568),
        "cast_start": (590, 433, 1136, 567),
        "cast_release": (17, 580, 565, 719),
        "summon_or_rune": (576, 580, 1137, 719),
        "hit_react": (17, 729, 435, 864),
        "dash_or_dodge": (455, 720, 1137, 866),
        "town_idle": (22, 884, 576, 1024),
        "interact": (593, 883, 1141, 1021),
        "victory": (19, 1031, 847, 1174),
        "down_or_death": (20, 1184, 716, 1317),
    },
    "hakan": {
        "idle": (417, 26, 1097, 172),
        "walk": (38, 231, 636, 355),
        "run": (645, 230, 1188, 353),
        "attack_basic_01": (26, 380, 624, 507),
        "attack_basic_02": (643, 380, 1187, 507),
        "heavy_attack": (26, 534, 679, 666),
        "charge": (701, 534, 1188, 663),
        "skill_cast": (26, 691, 875, 830),
        "hit_react": (889, 691, 1184, 824),
        "guard_or_block": (26, 859, 351, 994),
        "dash_or_dodge": (377, 859, 816, 990),
        "town_idle": (841, 859, 1188, 993),
        "taunt_or_command": (26, 1019, 463, 1150),
        "victory": (478, 1019, 1188, 1150),
        "down_or_death": (26, 1172, 784, 1292),
    },
    "iris": {
        "attack_basic_01": (653, 197, 1187, 336),
    },
    "erin": {
        "dash_or_dodge": (523, 721, 1185, 854),
    },
}

LEGACY_REFRESH_CLIP_SOURCE_BOXES: dict[str, dict[str, tuple[int, int, int, int]]] = {
    "sera": {
        "idle": (150, 90, 1030, 185),
        "walk": (150, 185, 1100, 285),
        "run": (150, 285, 1100, 370),
        "attack_basic_01": (150, 370, 950, 449),
        "attack_basic_02": (150, 449, 950, 532),
        "cast_start": (150, 532, 760, 615),
        "cast_loop": (150, 615, 760, 694),
        "cast_release": (150, 694, 960, 779),
        "hit_react": (150, 779, 760, 857),
        "dash_or_dodge": (150, 857, 980, 941),
        "town_idle": (150, 1010, 1030, 1115),
        "talk": (150, 1026, 760, 1105),
        "victory": (150, 1105, 1030, 1201),
        "down_or_death": (150, 1201, 1100, 1390),
    },
    "dorgan": {
        "attack_basic_02": (20, 430, 1088, 520),
    },
    "hakan": {
        "walk": (38, 231, 636, 355),
    },
    "seraphin": {
        "attack_basic_02": (20, 398, 700, 500),
    },
}

FULL_HEIGHT_LEGACY_REFRESH_SOURCE_BOX_SUBJECT_CLIPS: dict[str, set[str]] = {
    "sera": {
        "idle",
        "walk",
        "run",
        "attack_basic_01",
        "attack_basic_02",
        "cast_start",
        "cast_release",
        "hit_react",
        "dash_or_dodge",
        "town_idle",
        "talk",
        "victory",
        "down_or_death",
    },
}

COMPONENT_EXTRACTION_ACTION_IDS = {
    "idle",
    "walk",
    "run",
    "attack_basic_01",
    "attack_basic_02",
    "attack_basic_03",
    "heavy_attack",
    "skill_cast",
    "cast_start",
    "cast_loop",
    "cast_release",
    "heal_cast",
    "buff_cast",
    "summon_or_rune",
    "hit_react",
    "dash_or_dodge",
    "charge",
    "guard_or_block",
    "town_idle",
    "talk",
    "victory",
    "down_or_death",
    "pray_idle",
    "aim",
    "shoot_loop",
    "reload_or_reset",
    "interact",
    "taunt_or_command",
    "stealth_entry",
}

COMPANION_MANUAL_REVIEW_SUBJECT_IDS = {
    "sera",
}

NO_COMPONENT_EXTRACTION_SUBJECT_CLIPS: dict[str, set[str]] = {
    "bram": {
        "idle",
        "walk",
        "run",
        "attack_basic_01",
        "attack_basic_02",
        "heavy_attack",
        "skill_cast",
        "hit_react",
        "dash_or_dodge",
        "guard_or_block",
        "taunt_or_command",
        "town_idle",
        "interact",
        "victory",
        "down_or_death",
    },
    "luna": {"walk", "talk", "victory", "down_or_death"},
    "ria": {"town_idle"},
    "serena": {"idle", "hit_react", "pray_idle"},
    "iris": {"attack_basic_01"},
    "wolf": {"attack_basic_02", "down_or_death"},
    "erin": {"dash_or_dodge", "town_idle"},
    "laila": {"idle", "town_idle", "down_or_death"},
    "hakan": {"walk", "attack_basic_02", "charge", "dash_or_dodge", "taunt_or_command"},
    "helma": {"guard_or_block"},
    "marin": {"dash_or_dodge"},
    "nazir": {"idle", "attack_basic_02", "attack_basic_03", "hit_react", "town_idle"},
    "seraphin": {"attack_basic_01"},
}

SKIP_CHARACTER_ARTIFACT_CLEANUP_SUBJECTS: set[str] = set()

POST_STRIP_INTERNAL_HOLE_CLEANUP_SPECS: dict[str, dict[str, dict[str, float | int]]] = {
    "serena": {
        "idle": {"max_area": 420, "max_width": 26, "max_height": 34, "max_bottom_ratio": 0.94},
        "walk": {"max_area": 420, "max_width": 26, "max_height": 34, "max_bottom_ratio": 0.96},
        "attack_basic_02": {"max_area": 380, "max_width": 24, "max_height": 32, "max_bottom_ratio": 0.95},
        "heal_cast": {"max_area": 380, "max_width": 24, "max_height": 32, "max_bottom_ratio": 0.9},
        "buff_cast": {"max_area": 380, "max_width": 24, "max_height": 32, "max_bottom_ratio": 0.95},
        "cast_loop": {"max_area": 380, "max_width": 24, "max_height": 32, "max_bottom_ratio": 0.95},
        "dash_or_dodge": {"max_area": 360, "max_width": 24, "max_height": 32, "max_bottom_ratio": 0.96},
        "hit_react": {"max_area": 120, "max_width": 14, "max_height": 16, "max_bottom_ratio": 0.95},
        "town_idle": {"max_area": 380, "max_width": 24, "max_height": 32, "max_bottom_ratio": 0.94},
        "pray_idle": {"max_area": 380, "max_width": 24, "max_height": 32, "max_bottom_ratio": 0.95},
        "victory": {"max_area": 360, "max_width": 24, "max_height": 32, "max_bottom_ratio": 0.9},
    },
    "luna": {
        "attack_basic_01": {"max_area": 280, "max_width": 20, "max_height": 28, "max_bottom_ratio": 0.78},
        "walk": {"max_area": 220, "max_width": 18, "max_height": 24, "max_bottom_ratio": 0.74},
        "buff_cast": {"max_area": 220, "max_width": 18, "max_height": 24, "max_bottom_ratio": 0.74},
        "talk": {"max_area": 320, "max_width": 22, "max_height": 28, "max_bottom_ratio": 0.78},
        "victory": {"max_area": 420, "max_width": 28, "max_height": 34, "max_bottom_ratio": 0.96},
        "down_or_death": {"max_area": 180, "max_width": 16, "max_height": 22, "max_bottom_ratio": 0.66},
    },
    "hakan": {
        "charge": {"max_area": 420, "max_width": 28, "max_height": 34, "max_bottom_ratio": 0.96},
        "dash_or_dodge": {"max_area": 420, "max_width": 28, "max_height": 34, "max_bottom_ratio": 0.96},
    },
    "nazir": {
        "attack_basic_03": {"max_area": 180, "max_width": 18, "max_height": 24, "max_bottom_ratio": 0.92},
    },
    "marin": {
        "dash_or_dodge": {"max_area": 180, "max_width": 16, "max_height": 22, "max_bottom_ratio": 0.7},
    },
    "laila": {
        "idle": {"max_area": 420, "max_width": 28, "max_height": 34, "max_bottom_ratio": 0.94},
        "down_or_death": {"max_area": 180, "max_width": 16, "max_height": 22, "max_bottom_ratio": 0.68},
    },
    "erin": {
        "dash_or_dodge": {"max_area": 280, "max_width": 20, "max_height": 28, "max_bottom_ratio": 0.9},
        "interact": {"max_area": 280, "max_width": 20, "max_height": 28, "max_bottom_ratio": 0.96},
    },
    "seraphin": {
        "attack_basic_01": {"max_area": 120, "max_width": 16, "max_height": 16, "max_bottom_ratio": 0.95},
        "heavy_attack": {"max_area": 420, "max_width": 28, "max_height": 34, "max_bottom_ratio": 0.98},
        "guard_or_block": {"max_area": 420, "max_width": 28, "max_height": 34, "max_bottom_ratio": 0.98},
        "run": {"max_area": 120, "max_width": 16, "max_height": 16, "max_bottom_ratio": 0.96},
        "attack_basic_02": {"max_area": 140, "max_width": 18, "max_height": 18, "max_bottom_ratio": 0.96},
        "skill_cast": {"max_area": 90, "max_width": 14, "max_height": 18, "max_bottom_ratio": 0.96},
        "victory": {"max_area": 420, "max_width": 28, "max_height": 34, "max_bottom_ratio": 0.98},
        "down_or_death": {"max_area": 420, "max_width": 28, "max_height": 34, "max_bottom_ratio": 0.98},
    },
}

POST_STRIP_SIDE_SLIVER_CLEANUP_SPECS: dict[str, dict[str, dict[str, float | int]]] = {
    "iris": {
        "attack_basic_01": {"max_width": 16, "max_area": 260, "max_area_ratio": 0.34},
    },
    "wolf": {
        "attack_basic_01": {"max_width": 14, "max_area": 220, "max_area_ratio": 0.28},
        "attack_basic_02": {"max_width": 14, "max_area": 220, "max_area_ratio": 0.28},
        "charge": {"max_width": 16, "max_area": 240, "max_area_ratio": 0.3},
    },
    "erin": {
        "summon_or_rune": {"max_width": 16, "max_area": 240, "max_area_ratio": 0.32},
        "dash_or_dodge": {"max_width": 16, "max_area": 240, "max_area_ratio": 0.32},
    },
    "hakan": {
        "run": {"max_width": 14, "max_area": 220, "max_area_ratio": 0.28},
        "heavy_attack": {"max_width": 18, "max_area": 260, "max_area_ratio": 0.34},
    },
    "seraphin": {
        "run": {"max_width": 14, "max_area": 200, "max_area_ratio": 0.28},
        "pray_idle": {"max_width": 18, "max_area": 260, "max_area_ratio": 0.32},
        "down_or_death": {"max_width": 18, "max_area": 260, "max_area_ratio": 0.32},
    },
}

POST_STRIP_PRUNE_SMALL_NONPRIMARY_SPECS: dict[str, dict[str, dict[str, float | int]]] = {
    "iris": {
        "victory": {"max_area": 80},
    },
    "wolf": {
        "attack_basic_02": {"max_area": 140},
    },
    "laila": {
        "run": {"max_area": 80},
    },
    "seraphin": {
        "pray_idle": {"max_area": 40},
    },
}

POST_STRIP_NONPRIMARY_SCRAP_CLEANUP_SPECS: dict[str, dict[str, dict[str, float | int]]] = {}

POST_STRIP_FRAME_REPLACEMENTS: dict[str, dict[str, dict[int, int]]] = {}

ALPHA_ANALYSIS_ACTION_IDS = {
    "dash_or_dodge",
    "charge",
    "cast_loop",
    "buff_cast",
    "pray_idle",
    "hit_react",
}


def should_use_component_extraction(subject_id: str, clip_id: str) -> bool:
    if clip_id not in COMPONENT_EXTRACTION_ACTION_IDS:
        return False

    if subject_id in COMPANION_MANUAL_REVIEW_SUBJECT_IDS:
        return False

    return clip_id not in NO_COMPONENT_EXTRACTION_SUBJECT_CLIPS.get(subject_id, set())


def should_run_character_artifact_cleanup(subject_id: str, clip_id: str) -> bool:
    return subject_id not in SKIP_CHARACTER_ARTIFACT_CLEANUP_SUBJECTS

# Active package-sheet source mapping.
# Use curated package sheets for subjects that have better runtime extraction quality
# than the newer master-sheet batches.
PACKAGE_PANEL_SOURCE_FILES: dict[str, str] = {
    "hero": "01-kain-package-sheet-v1.png",
    "dorgan": "07-dorgan-package-sheet-v1.png",
    "erin": "15-erin-package-sheet-v1.png",
    "hakan": "18-hakan-package-sheet-v1.png",
    "laila": "17-laila-package-sheet-v1.png",
    "luna": "04-luna-package-sheet-v1.png",
    "micaela": "20-michaela-package-sheet-v1.png",
    "nazir": "16-nazir-package-sheet-v1.png",
    "sera": "03-sera-package-sheet-v1.png",
    "seraphin": "19-seraphine-package-sheet-v1.png",
    "wolf": "14-volf-package-sheet-v1.png",
}

PACKAGE_PANEL_FULL_SUBJECT_IDS: set[str] = {
    "hero",
    "dorgan",
    "erin",
    "hakan",
    "laila",
    "luna",
    "micaela",
    "nazir",
    "sera",
    "seraphin",
    "wolf",
}

FORCE_LEGACY_REFRESH_SUBJECT_IDS: set[str] = {
    "sera",
    "luna",
    "dorgan",
    "wolf",
    "erin",
    "nazir",
    "laila",
    "hakan",
    "seraphin",
    "micaela",
}

FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS: set[str] = {
    "dorgan",
    "wolf",
    "erin",
    "nazir",
    "laila",
    "hakan",
    "seraphin",
    "micaela",
}


HERO_PACKAGE_MANUAL_SOURCE_BOXES: dict[str, tuple[tuple[int, int, int, int], ...]] = {
    "idle": (
        (28, 438, 104, 586),
        (113, 438, 187, 586),
        (183, 438, 257, 586),
        (255, 438, 301, 586),
    ),
    "walk": (
        (338, 438, 412, 586),
        (455, 438, 530, 586),
        (534, 438, 605, 586),
        (605, 438, 647, 586),
    ),
    "run": (
        (750, 438, 832, 586),
        (836, 438, 918, 586),
        (922, 438, 1004, 586),
        (1006, 438, 1092, 586),
        (1094, 438, 1180, 586),
        (1180, 438, 1268, 586),
    ),
    "attack_basic_01": (
        (36, 621, 112, 748),
        (110, 621, 186, 748),
        (182, 621, 258, 748),
        (255, 621, 331, 748),
    ),
    "attack_basic_02": (
        (346, 608, 448, 740),
        (448, 608, 513, 740),
        (513, 608, 581, 740),
        (581, 608, 626, 740),
    ),
    "attack_basic_03": (
        (674, 621, 754, 748),
        (746, 621, 826, 748),
        (818, 621, 898, 748),
        (886, 621, 958, 748),
    ),
    "skill_cast": (
        (986, 621, 1078, 748),
        (1050, 621, 1142, 748),
        (1114, 621, 1206, 748),
        (1178, 621, 1270, 748),
        (1242, 621, 1384, 748),
    ),
    "hit_react": (
        (36, 788, 112, 926),
        (104, 788, 180, 926),
        (172, 788, 248, 926),
    ),
    "dash_or_dodge": (
        (282, 788, 358, 926),
        (350, 788, 426, 926),
        (418, 788, 494, 926),
        (486, 788, 562, 926),
        (554, 788, 630, 926),
    ),
    "guard_or_block": (
        (684, 788, 764, 926),
        (764, 788, 844, 926),
    ),
    "charge": (
        (986, 621, 1078, 748),
        (1050, 621, 1142, 748),
        (1114, 621, 1206, 748),
        (1178, 621, 1270, 748),
    ),
    "town_idle": (
        (900, 788, 976, 926),
        (970, 788, 1046, 926),
        (1040, 788, 1116, 926),
        (1110, 788, 1178, 926),
    ),
    "talk": (
        (1208, 788, 1288, 926),
        (1290, 788, 1370, 926),
    ),
    "victory": (
        (18, 970, 92, 1110),
        (100, 970, 174, 1110),
        (182, 970, 256, 1110),
        (264, 970, 338, 1110),
        (346, 970, 420, 1110),
        (428, 970, 502, 1110),
    ),
    "down_or_death": (
        (736, 970, 848, 1110),
        (858, 970, 970, 1110),
        (980, 970, 1092, 1110),
        (1102, 970, 1214, 1110),
        (1224, 970, 1336, 1110),
    ),
}

PACKAGE_PANEL_MANUAL_SOURCE_BOXES: dict[str, dict[str, tuple[tuple[int, int, int, int], ...]]] = {
    "sera": {
        "idle": build_manual_source_boxes((61, 126, 191, 256, 321, 386), 426, 524, 72),
        "walk": build_manual_source_boxes((486, 541, 596, 651, 706, 761, 816, 871), 426, 524, 68),
        "run": build_manual_source_boxes((968, 1021, 1074, 1127, 1180, 1233, 1286, 1339), 426, 524, 70),
        "attack_basic_01": (
            (20, 548, 102, 648),
            (88, 548, 170, 648),
            (154, 548, 236, 648),
            (220, 544, 328, 648),
            (284, 540, 372, 648),
        ),
        "attack_basic_02": (
            (470, 548, 548, 650),
            (548, 548, 626, 650),
            (626, 548, 704, 650),
            (704, 548, 782, 650),
            (782, 540, 900, 650),
        ),
    },
    "luna": {
        "walk": build_manual_source_boxes((478, 539, 599, 662, 724, 785, 846, 898), 426, 522, 72),
    },
    "dorgan": {
        "attack_basic_01": build_manual_source_boxes((58, 114, 170, 226, 282, 338, 394), 516, 618, 74),
    },
    "serena": {
        "attack_basic_01": build_manual_source_boxes((68, 158, 248, 338, 428), 540, 620, 92),
        "victory": build_even_source_boxes(24, 1006, 917, 1009, 10, pad=4),
        "down_or_death": build_manual_source_boxes((89, 267, 445, 623, 801, 979, 1157, 1335), 998, 1110, 128),
    },
    "iris": {
        "attack_basic_03": (
            (940, 506, 1008, 620),
            (1008, 506, 1078, 620),
            (1078, 506, 1148, 620),
            (1148, 506, 1218, 620),
            (1218, 506, 1290, 620),
            (1290, 498, 1390, 620),
        ),
    },
    "wolf": {
        "attack_basic_01": build_manual_source_boxes((68, 144, 220, 297, 375, 452, 530, 606), 508, 612, 76),
        "attack_basic_02": build_manual_source_boxes((766, 844, 922, 1000, 1078, 1156, 1234, 1312), 540, 620, 84),
        "charge": build_manual_source_boxes((811, 902, 993, 1084, 1175, 1266), 640, 699, 96),
        "dash_or_dodge": build_manual_source_boxes((115, 248, 381, 514, 647), 828, 926, 110),
        "down_or_death": build_manual_source_boxes((149, 373, 597, 821, 1045, 1269), 1006, 1110, 150),
    },
    "nazir": {
        "attack_basic_03": build_manual_source_boxes((956, 1020, 1084, 1148, 1212, 1276, 1340), 546, 616, 76),
        "down_or_death": build_manual_source_boxes((152, 341, 530, 719, 908, 1097), 1000, 1110, 154),
    },
    "laila": {
        "run": (
            (30, 292, 144, 419),
            (119, 292, 219, 419),
            (202, 291, 300, 418),
            (281, 292, 380, 418),
            (360, 294, 458, 418),
            (442, 295, 538, 417),
            (523, 295, 619, 418),
        ),
    },
    "fin": {
        "shoot_loop": build_manual_source_boxes((559, 668, 777, 886), 520, 620, 100),
    },
    "erin": {
        "walk": build_variable_width_source_boxes(
            ((467, 66), (525, 66), (583, 66), (641, 66), (699, 66), (757, 66), (815, 66), (867, 66)),
            356,
            490,
            66,
        ),
        "run": build_variable_width_source_boxes(
            ((937, 66), (997, 66), (1057, 66), (1117, 66), (1177, 66), (1237, 66), (1297, 66), (1359, 66)),
            356,
            490,
            66,
        ),
        "dash_or_dodge": build_manual_source_boxes((414, 485, 556, 627, 698, 769), 770, 872, 94),
        "summon_or_rune": build_even_source_boxes(704, 1390, 640, 760, 8, pad=6),
    },
    "hakan": {
        "run": build_variable_width_source_boxes(
            ((681, 72), (753, 72), (825, 72), (897, 72), (969, 72), (1041, 72), (1113, 72), (1152, 72)),
            230,
            353,
            72,
        ),
        "heavy_attack": build_variable_width_source_boxes(
            ((63, 74), (136, 74), (208, 74), (280, 74), (352, 74), (424, 74), (496, 74), (568, 74), (641, 74)),
            534,
            666,
            74,
        ),
        "walk": build_manual_source_boxes((495, 551, 607, 663, 719, 775, 831, 887), 378, 488, 80),
    },
    "helma": {
        "idle": build_variable_width_source_boxes(
            ((301, 160), (461, 160), (621, 160), (781, 160), (941, 160), (1101, 160)),
            0,
            93,
            160,
        ),
        "dash_or_dodge": build_variable_width_source_boxes(
            ((127, 218), (360, 218), (593, 218), (826, 218), (1059, 218)),
            864,
            963,
            218,
        ),
    },
    "seraphin": {
        "run": build_manual_source_boxes((960, 1015, 1070, 1125, 1180, 1235, 1290, 1345), 378, 490, 72),
        "attack_basic_02": (
            (720, 514, 798, 610),
            (812, 514, 890, 610),
            (904, 514, 982, 610),
            (996, 514, 1074, 610),
            (1088, 514, 1166, 610),
            (1180, 514, 1258, 610),
            (1260, 506, 1368, 610),
        ),
        "pray_idle": build_variable_width_source_boxes(
            ((47, 70), (117, 70), (187, 70), (257, 70), (327, 70), (405, 70)),
            878,
            1008,
            70,
        ),
        "skill_cast": (
            (744, 639, 812, 744),
            (814, 639, 882, 744),
            (884, 639, 952, 744),
            (954, 639, 1022, 744),
            (1024, 639, 1092, 744),
            (1094, 639, 1162, 744),
            (1164, 639, 1232, 744),
            (1234, 631, 1386, 744),
        ),
    },
    "micaela": {
        "attack_basic_01": (
            (22, 514, 104, 612),
            (116, 514, 198, 612),
            (208, 514, 290, 612),
            (300, 514, 382, 612),
            (352, 514, 450, 612),
        ),
    },
}

PACKAGE_PANEL_REMBG_SOURCE_BOXES: dict[str, dict[str, tuple[tuple[int, int, int, int], ...]]] = {
    "nazir": {
        "attack_basic_03": (
            (918, 532, 988, 620),
            (984, 532, 1054, 620),
            (1050, 532, 1120, 620),
            (1116, 532, 1186, 620),
            (1182, 532, 1252, 620),
            (1248, 532, 1318, 620),
            (1290, 522, 1390, 620),
        ),
    },
    "sera": {
        "cast_start": (
            (949, 547, 1049, 652),
            (1070, 547, 1170, 652),
            (1188, 547, 1288, 652),
            (1306, 547, 1396, 652),
        ),
        "cast_loop": (
            (60, 683, 160, 779),
            (191, 683, 291, 779),
            (322, 683, 422, 779),
            (453, 683, 553, 779),
        ),
    },
}

PACKAGE_PANEL_CLIP_OVERRIDES: dict[str, set[str]] = {
    "serena": {
        "attack_basic_01",
        "victory",
        "down_or_death",
    },
    "iris": {
        "attack_basic_01",
        "attack_basic_03",
    },
    "wolf": {
        "attack_basic_01",
        "attack_basic_02",
        "charge",
        "dash_or_dodge",
        "down_or_death",
    },
    "fin": {
        "shoot_loop",
    },
    "erin": {
        "dash_or_dodge",
        "summon_or_rune",
    },
    "nazir": {
        "idle",
        "walk",
        "run",
        "attack_basic_01",
        "attack_basic_02",
        "attack_basic_03",
        "skill_cast",
        "charge",
        "stealth_entry",
        "hit_react",
        "dash_or_dodge",
        "town_idle",
        "talk",
        "down_or_death",
        "victory",
    },
    "laila": {
        "idle",
        "walk",
        "run",
        "attack_basic_01",
        "attack_basic_02",
        "cast_start",
        "cast_release",
        "summon_or_rune",
        "hit_react",
        "dash_or_dodge",
        "town_idle",
        "interact",
        "victory",
        "down_or_death",
    },
    "hakan": {
        "idle",
        "walk",
        "run",
        "attack_basic_01",
        "attack_basic_02",
        "heavy_attack",
        "charge",
        "skill_cast",
        "hit_react",
        "guard_or_block",
        "dash_or_dodge",
        "town_idle",
        "taunt_or_command",
        "victory",
        "down_or_death",
    },
}

HERO_TALK_PACKAGE_RECLIP_SOURCE_BOXES: tuple[tuple[int, int, int, int], ...] = (
    (1186, 784, 1290, 898),
    (1274, 790, 1338, 898),
)

PACKAGE_PANEL_BOXES: dict[str, dict[str, PackagePanelBox]] = {
    "hero": {
        "idle": PackagePanelBox(12, 314, 392, 586),
        "walk": PackagePanelBox(322, 652, 392, 586),
        "run": PackagePanelBox(660, 1392, 392, 586),
        "attack_basic_01": PackagePanelBox(12, 334, 584, 748),
        "attack_basic_02": PackagePanelBox(338, 642, 584, 748),
        "attack_basic_03": PackagePanelBox(648, 959, 584, 748),
        "skill_cast": PackagePanelBox(964, 1392, 584, 748),
        "hit_react": PackagePanelBox(12, 255, 748, 926),
        "dash_or_dodge": PackagePanelBox(260, 653, 748, 926),
        "guard_or_block": PackagePanelBox(660, 873, 748, 926),
        "charge": PackagePanelBox(964, 1392, 584, 748, source_clip_id="skill_cast"),
        "town_idle": PackagePanelBox(879, 1178, 748, 926),
        "talk": PackagePanelBox(1184, 1392, 748, 926),
        "victory": PackagePanelBox(12, 709, 924, 1110),
        "down_or_death": PackagePanelBox(714, 1392, 924, 1110),
    },
    "sera": {
        "idle": PackagePanelBox(12, 444, 402, 524),
        "walk": PackagePanelBox(448, 924, 402, 524),
        "run": PackagePanelBox(928, 1392, 402, 524),
        "attack_basic_01": PackagePanelBox(12, 464, 526, 652),
        "attack_basic_02": PackagePanelBox(468, 904, 526, 652),
        "cast_start": PackagePanelBox(908, 1392, 526, 652),
        "cast_loop": PackagePanelBox(12, 556, 652, 778),
        "cast_release": PackagePanelBox(556, 1392, 652, 778),
        "hit_react": PackagePanelBox(12, 412, 778, 894),
        "dash_or_dodge": PackagePanelBox(412, 808, 778, 894),
        "town_idle": PackagePanelBox(808, 1196, 778, 894),
        "talk": PackagePanelBox(1196, 1392, 778, 894),
        "victory": PackagePanelBox(12, 684, 894, 1024),
        "down_or_death": PackagePanelBox(684, 1392, 894, 1024),
    },
    "luna": {
        "idle": PackagePanelBox(12, 440, 402, 524),
        "walk": PackagePanelBox(444, 924, 402, 524),
        "run": PackagePanelBox(928, 1392, 402, 524),
        "attack_basic_01": PackagePanelBox(12, 444, 526, 652),
        "attack_basic_02": PackagePanelBox(448, 920, 526, 652),
        "heal_cast": PackagePanelBox(924, 1392, 526, 652),
        "buff_cast": PackagePanelBox(12, 532, 652, 778),
        "pray_idle": PackagePanelBox(536, 924, 652, 778),
        "hit_react": PackagePanelBox(928, 1188, 652, 778),
        "dash_or_dodge": PackagePanelBox(1192, 1392, 652, 778),
        "town_idle": PackagePanelBox(12, 548, 778, 894),
        "talk": PackagePanelBox(552, 1188, 778, 894),
        "victory": PackagePanelBox(12, 708, 894, 1024),
        "down_or_death": PackagePanelBox(712, 1392, 894, 1024),
    },
    "dorgan": {
        "idle": PackagePanelBox(12, 296, 356, 490),
        "walk": PackagePanelBox(300, 648, 356, 490),
        "run": PackagePanelBox(652, 1392, 356, 490),
        "attack_basic_01": PackagePanelBox(12, 460, 490, 620),
        "attack_basic_02": PackagePanelBox(464, 924, 490, 620),
        "heavy_attack": PackagePanelBox(928, 1392, 490, 620),
        "skill_cast": PackagePanelBox(12, 708, 620, 748),
        "charge": PackagePanelBox(712, 1136, 620, 748),
        "hit_react": PackagePanelBox(1140, 1392, 620, 748),
        "guard_or_block": PackagePanelBox(12, 296, 748, 878),
        "dash_or_dodge": PackagePanelBox(300, 760, 748, 878),
        "town_idle": PackagePanelBox(764, 1392, 748, 878),
        "interact": PackagePanelBox(12, 704, 878, 1008),
        "victory": PackagePanelBox(708, 1392, 878, 1008),
        "down_or_death": PackagePanelBox(12, 1392, 1008, 1110),
    },
    "nazir": {
        "idle": PackagePanelBox(12, 456, 356, 490),
        "walk": PackagePanelBox(460, 922, 356, 490),
        "run": PackagePanelBox(926, 1392, 356, 490),
        "attack_basic_01": PackagePanelBox(12, 448, 490, 620),
        "attack_basic_02": PackagePanelBox(452, 904, 490, 620),
        "attack_basic_03": PackagePanelBox(908, 1392, 490, 620),
        "skill_cast": PackagePanelBox(12, 720, 620, 748),
        "charge": PackagePanelBox(720, 1392, 620, 748),
        "stealth_entry": PackagePanelBox(12, 576, 748, 878),
        "hit_react": PackagePanelBox(576, 912, 748, 878),
        "dash_or_dodge": PackagePanelBox(912, 1392, 748, 878),
        "town_idle": PackagePanelBox(12, 560, 878, 1008),
        "talk": PackagePanelBox(560, 916, 878, 1008),
        "victory": PackagePanelBox(916, 1392, 878, 1008),
        "down_or_death": PackagePanelBox(12, 1392, 1008, 1110),
    },
    "laila": {
        "idle": PackagePanelBox(12, 440, 356, 490),
        "walk": PackagePanelBox(444, 908, 356, 490),
        "run": PackagePanelBox(912, 1392, 356, 490),
        "attack_basic_01": PackagePanelBox(12, 476, 490, 620),
        "attack_basic_02": PackagePanelBox(476, 888, 490, 620),
        "cast_start": PackagePanelBox(888, 1392, 490, 620),
        "cast_release": PackagePanelBox(12, 632, 620, 748),
        "summon_or_rune": PackagePanelBox(632, 1392, 620, 748),
        "hit_react": PackagePanelBox(12, 372, 748, 878),
        "dash_or_dodge": PackagePanelBox(372, 844, 748, 878),
        "town_idle": PackagePanelBox(844, 1392, 748, 878),
        "interact": PackagePanelBox(12, 656, 878, 1008),
        "victory": PackagePanelBox(656, 1392, 878, 1008),
        "down_or_death": PackagePanelBox(12, 1392, 1008, 1110),
    },
    "hakan": {
        "idle": PackagePanelBox(12, 448, 356, 490),
        "walk": PackagePanelBox(452, 920, 356, 490),
        "run": PackagePanelBox(924, 1392, 356, 490),
        "attack_basic_01": PackagePanelBox(12, 492, 490, 620),
        "attack_basic_02": PackagePanelBox(492, 920, 490, 620),
        "heavy_attack": PackagePanelBox(924, 1392, 490, 620),
        "charge": PackagePanelBox(12, 700, 620, 748),
        "skill_cast": PackagePanelBox(700, 1392, 620, 748),
        "hit_react": PackagePanelBox(12, 384, 748, 878),
        "guard_or_block": PackagePanelBox(384, 760, 748, 878),
        "dash_or_dodge": PackagePanelBox(760, 1392, 748, 878),
        "town_idle": PackagePanelBox(12, 468, 878, 1008),
        "taunt_or_command": PackagePanelBox(468, 888, 878, 1008),
        "victory": PackagePanelBox(888, 1392, 878, 1008),
        "down_or_death": PackagePanelBox(12, 1392, 1008, 1110),
    },
    "iris": {
        "attack_basic_01": PackagePanelBox(12, 470, 490, 620),
        "attack_basic_03": PackagePanelBox(932, 1392, 490, 620),
    },
    "erin": {
        "idle": PackagePanelBox(12, 430, 356, 490),
        "walk": PackagePanelBox(434, 900, 356, 490),
        "run": PackagePanelBox(904, 1392, 356, 490),
        "attack_basic_01": PackagePanelBox(12, 450, 490, 620),
        "attack_basic_02": PackagePanelBox(454, 920, 490, 620),
        "cast_start": PackagePanelBox(924, 1392, 490, 620),
        "cast_loop": PackagePanelBox(12, 698, 620, 748),
        "summon_or_rune": PackagePanelBox(702, 1392, 620, 748),
        "hit_react": PackagePanelBox(12, 375, 748, 878),
        "dash_or_dodge": PackagePanelBox(392, 860, 748, 878),
        "town_idle": PackagePanelBox(864, 1392, 748, 878),
        "interact": PackagePanelBox(12, 700, 878, 1008),
        "victory": PackagePanelBox(704, 1392, 878, 1008),
        "down_or_death": PackagePanelBox(12, 1392, 1008, 1110),
    },
    "seraphin": {
        "idle": PackagePanelBox(12, 448, 356, 490),
        "walk": PackagePanelBox(452, 916, 356, 490),
        "run": PackagePanelBox(920, 1392, 356, 490),
        "attack_basic_01": PackagePanelBox(12, 692, 490, 620),
        "attack_basic_02": PackagePanelBox(696, 1392, 490, 620),
        "heavy_attack": PackagePanelBox(12, 732, 620, 748),
        "skill_cast": PackagePanelBox(736, 1392, 620, 748, source_clip_id="heal_cast"),
        "heal_cast": PackagePanelBox(736, 1392, 620, 748),
        "guard_or_block": PackagePanelBox(12, 448, 748, 878),
        "dash_or_dodge": PackagePanelBox(448, 1392, 748, 878),
        "pray_idle": PackagePanelBox(12, 440, 878, 1008),
        "town_idle": PackagePanelBox(440, 800, 878, 1008),
        "victory": PackagePanelBox(800, 1392, 878, 1008),
        "down_or_death": PackagePanelBox(12, 1392, 1008, 1110),
        "hit_react": PackagePanelBox(12, 448, 748, 878, source_clip_id="guard_or_block"),
    },
    "wolf": {
        "idle": PackagePanelBox(12, 440, 356, 490),
        "walk": PackagePanelBox(444, 912, 356, 490),
        "run": PackagePanelBox(916, 1392, 356, 490),
        "attack_basic_01": PackagePanelBox(12, 688, 490, 620),
        "attack_basic_02": PackagePanelBox(692, 1392, 490, 620),
        "heavy_attack": PackagePanelBox(12, 932, 620, 748),
        "charge": PackagePanelBox(936, 1392, 620, 748),
        "taunt_or_command": PackagePanelBox(12, 776, 748, 878),
        "hit_react": PackagePanelBox(780, 1392, 748, 878),
        "dash_or_dodge": PackagePanelBox(12, 780, 878, 996),
        "town_idle": PackagePanelBox(784, 1392, 878, 996),
        "interact": PackagePanelBox(12, 696, 996, 1050),
        "victory": PackagePanelBox(700, 1392, 996, 1050),
        "down_or_death": PackagePanelBox(12, 1392, 1050, 1110),
    },
    "micaela": {
        "idle": PackagePanelBox(12, 444, 356, 490),
        "walk": PackagePanelBox(448, 920, 356, 490),
        "run": PackagePanelBox(924, 1392, 356, 490),
        "attack_basic_01": PackagePanelBox(12, 452, 490, 620),
        "attack_basic_02": PackagePanelBox(456, 920, 490, 620),
        "cast_start": PackagePanelBox(924, 1392, 490, 620),
        "heal_cast": PackagePanelBox(12, 700, 620, 748),
        "buff_cast": PackagePanelBox(704, 1392, 620, 748),
        "pray_idle": PackagePanelBox(12, 540, 748, 878),
        "hit_react": PackagePanelBox(544, 916, 748, 878),
        "dash_or_dodge": PackagePanelBox(920, 1392, 748, 878),
        "town_idle": PackagePanelBox(12, 536, 878, 1008),
        "victory": PackagePanelBox(540, 1392, 878, 1008),
        "down_or_death": PackagePanelBox(12, 1392, 1008, 1110),
    },
}


SUBJECT_SPECS: tuple[SubjectSpec, ...] = (
    SubjectSpec(
        id="hero",
        name="Kain",
        sheet_name="01-kain.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 10),),
            (ClipSpec("run", 8, 12),),
            (ClipSpec("attack_basic_01", 6, 12),),
            (ClipSpec("attack_basic_02", 6, 12),),
            (ClipSpec("attack_basic_03", 7, 12),),
            (ClipSpec("skill_cast", 8, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 14),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("charge", 6, 12),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("talk", 4, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="bram",
        name="Bram",
        sheet_name="03-sera.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 7, 10),),
            (ClipSpec("attack_basic_02", 6, 10),),
            (ClipSpec("heavy_attack", 9, 9),),
            (ClipSpec("skill_cast", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 5, 12),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("taunt_or_command", 6, 8),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="sera",
        name="Sera",
        sheet_name="04-luna.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 11),),
            (ClipSpec("attack_basic_01", 5, 12),),
            (ClipSpec("attack_basic_02", 5, 12),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("cast_release", 6, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 13),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("talk", 4, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="luna",
        name="Luna",
        sheet_name="04-luna.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 5, 11),),
            (ClipSpec("attack_basic_02", 5, 11),),
            (ClipSpec("heal_cast", 8, 10),),
            (ClipSpec("buff_cast", 6, 10),),
            (ClipSpec("pray_idle", 6, 6),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 13),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("talk", 4, 8),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="ria",
        name="Ria",
        sheet_name="05-ria.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 10),),
            (ClipSpec("run", 8, 11),),
            (ClipSpec("attack_basic_01", 5, 12),),
            (ClipSpec("attack_basic_02", 5, 12),),
            (ClipSpec("heal_cast", 8, 10),),
            (ClipSpec("buff_cast", 6, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 13),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("talk", 4, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="theo",
        name="Theo",
        sheet_name="06-theo.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 10),),
            (ClipSpec("run", 8, 13),),
            (ClipSpec("aim", 4, 8),),
            (ClipSpec("shoot_loop", 4, 12),),
            (ClipSpec("reload_or_reset", 5, 10),),
            (ClipSpec("skill_cast", 7, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 15),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="dorgan",
        name="Dorgan",
        sheet_name="07-dorgan.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 7, 10),),
            (ClipSpec("attack_basic_02", 7, 10),),
            (ClipSpec("heavy_attack", 9, 9),),
            (ClipSpec("skill_cast", 8, 10),),
            (ClipSpec("charge", 6, 11),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("dash_or_dodge", 5, 12),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="kiera",
        name="Kiera",
        sheet_name="08-kiera.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 10),),
            (ClipSpec("run", 8, 12),),
            (ClipSpec("aim", 4, 8),),
            (ClipSpec("shoot_loop", 4, 12),),
            (ClipSpec("reload_or_reset", 5, 10),),
            (ClipSpec("charge", 6, 12),),
            (ClipSpec("skill_cast", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 14),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8, row_span=2),),
        ),
    ),
    SubjectSpec(
        id="helma",
        name="Helma",
        sheet_name="09-helma.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 9),),
            (ClipSpec("attack_basic_01", 6, 10),),
            (ClipSpec("attack_basic_02", 6, 10),),
            (ClipSpec("buff_cast", 6, 10),),
            (ClipSpec("summon_or_rune", 8, 10),),
            (ClipSpec("charge", 6, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("dash_or_dodge", 5, 12),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="marin",
        name="Marin",
        sheet_name="10-marin.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 10),),
            (ClipSpec("run", 8, 13),),
            (ClipSpec("attack_basic_01", 6, 12),),
            (ClipSpec("attack_basic_02", 6, 12),),
            (ClipSpec("attack_basic_03", 7, 12),),
            (ClipSpec("charge", 6, 13),),
            (ClipSpec("skill_cast", 7, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 15),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("talk", 4, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="serena",
        name="Serena",
        sheet_name="11-serena.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 5, 11),),
            (ClipSpec("attack_basic_02", 5, 11),),
            (ClipSpec("heal_cast", 8, 10),),
            (ClipSpec("buff_cast", 6, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("dash_or_dodge", 6, 13),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("pray_idle", 6, 6),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="fin",
        name="Fin",
        sheet_name="12-finn.png",
        layout="paired",
        rows=(
            (ClipSpec("idle", 6, 8, "left"), ClipSpec("walk", 8, 10, "right")),
            (ClipSpec("run", 8, 13, "left"), ClipSpec("aim", 4, 8, "right")),
            (ClipSpec("shoot_loop", 4, 12, "left"), ClipSpec("reload_or_reset", 5, 10, "right")),
            (ClipSpec("skill_cast", 7, 12, "full"),),
            (ClipSpec("hit_react", 4, 12, "left"), ClipSpec("dash_or_dodge", 6, 15, "right")),
            (ClipSpec("town_idle", 6, 6, "left"), ClipSpec("talk", 4, 8, "right")),
            (ClipSpec("victory", 8, 10, "left"), ClipSpec("down_or_death", 6, 8, "right")),
        ),
    ),
    SubjectSpec(
        id="iris",
        name="Iris",
        sheet_name="13-iris.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 11),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("attack_basic_02", 6, 11),),
            (ClipSpec("attack_basic_03", 7, 11),),
            (ClipSpec("charge", 6, 11),),
            (ClipSpec("skill_cast", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("dash_or_dodge", 6, 13),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="wolf",
        name="Wolf",
        sheet_name="14-volf.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 8, 10),),
            (ClipSpec("attack_basic_02", 8, 10),),
            (ClipSpec("heavy_attack", 10, 9),),
            (ClipSpec("charge", 6, 10),),
            (ClipSpec("taunt_or_command", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 5, 12),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="erin",
        name="Erin",
        sheet_name="15-erin.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 5, 11),),
            (ClipSpec("attack_basic_02", 5, 11),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("summon_or_rune", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 13),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="laila",
        name="Laila",
        sheet_name="17-laila.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 5, 11),),
            (ClipSpec("attack_basic_02", 5, 11),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_release", 6, 12),),
            (ClipSpec("summon_or_rune", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 13),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="hakan",
        name="Hakan",
        sheet_name="18-hakan.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 12),),
            (ClipSpec("attack_basic_01", 7, 11),),
            (ClipSpec("attack_basic_02", 7, 11),),
            (ClipSpec("heavy_attack", 9, 10),),
            (ClipSpec("charge", 6, 13),),
            (ClipSpec("skill_cast", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("dash_or_dodge", 5, 12),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("taunt_or_command", 6, 8),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="seraphin",
        name="Seraphine",
        sheet_name="19-seraphine.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 7, 10),),
            (ClipSpec("attack_basic_02", 7, 10),),
            (ClipSpec("heavy_attack", 9, 9),),
            (ClipSpec("skill_cast", 8, 10),),
            (ClipSpec("heal_cast", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("dash_or_dodge", 5, 12),),
            (ClipSpec("pray_idle", 6, 6),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="micaela",
        name="Micaela",
        sheet_name="20-michaela.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 5, 11),),
            (ClipSpec("attack_basic_02", 5, 11),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("heal_cast", 8, 10),),
            (ClipSpec("buff_cast", 6, 10),),
            (ClipSpec("pray_idle", 6, 6),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 13),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("victory", 8, 9),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="lucian",
        name="Lucian",
        sheet_name="21-lucian.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 10),),
            (ClipSpec("run", 8, 14),),
            (ClipSpec("attack_basic_01", 6, 13),),
            (ClipSpec("attack_basic_02", 6, 13),),
            (ClipSpec("attack_basic_03", 7, 13),),
            (ClipSpec("charge", 6, 13),),
            (ClipSpec("skill_cast", 7, 12),),
            (ClipSpec("stealth_entry", 6, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 15),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("interact", 6, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="nazir",
        name="Nazir",
        sheet_name="16-nazir.png",
        layout="single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 10),),
            (ClipSpec("run", 8, 14),),
            (ClipSpec("attack_basic_01", 6, 13),),
            (ClipSpec("attack_basic_02", 6, 13),),
            (ClipSpec("attack_basic_03", 7, 13),),
            (ClipSpec("charge", 6, 13),),
            (ClipSpec("skill_cast", 7, 12),),
            (ClipSpec("stealth_entry", 6, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("dash_or_dodge", 6, 15),),
            (ClipSpec("town_idle", 6, 6),),
            (ClipSpec("talk", 4, 8),),
            (ClipSpec("victory", 8, 10),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
)


def connected_components(mask: np.ndarray) -> list[tuple[int, int, int, int, int]]:
    height, width = mask.shape
    visited = np.zeros((height, width), dtype=bool)
    components: list[tuple[int, int, int, int, int]] = []

    for y in range(height):
        for x in range(width):
            if not mask[y, x] or visited[y, x]:
                continue

            queue: deque[tuple[int, int]] = deque([(y, x)])
            visited[y, x] = True
            min_y = max_y = y
            min_x = max_x = x
            area = 0

            while queue:
                current_y, current_x = queue.popleft()
                area += 1
                min_y = min(min_y, current_y)
                max_y = max(max_y, current_y)
                min_x = min(min_x, current_x)
                max_x = max(max_x, current_x)

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

            components.append((min_x, min_y, max_x, max_y, area))

    return components


def label_connected_components(mask: np.ndarray) -> tuple[np.ndarray, list[MaskComponent]]:
    height, width = mask.shape
    labels = np.full((height, width), fill_value=-1, dtype=np.int32)
    components: list[MaskComponent] = []

    for y in range(height):
        for x in range(width):
            if not mask[y, x] or labels[y, x] >= 0:
                continue

            component_index = len(components)
            queue: deque[tuple[int, int]] = deque([(y, x)])
            labels[y, x] = component_index
            min_y = max_y = y
            min_x = max_x = x
            area = 0

            while queue:
                current_y, current_x = queue.popleft()
                area += 1
                min_y = min(min_y, current_y)
                max_y = max(max_y, current_y)
                min_x = min(min_x, current_x)
                max_x = max(max_x, current_x)

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
                        and labels[next_y, next_x] < 0
                    ):
                        labels[next_y, next_x] = component_index
                        queue.append((next_y, next_x))

            components.append(
                MaskComponent(
                    index=component_index,
                    min_x=min_x,
                    min_y=min_y,
                    max_x=max_x,
                    max_y=max_y,
                    area=area,
                    touches_border=min_x == 0 or min_y == 0 or max_x == width - 1 or max_y == height - 1,
                )
            )

    return labels, components


def merge_boxes(boxes: list[tuple[int, int, int, int]]) -> list[tuple[int, int, int, int]]:
    if not boxes:
        return []

    boxes = sorted(boxes, key=lambda box: (box[1], box[0]))
    merged: list[tuple[int, int, int, int]] = [boxes[0]]

    for current in boxes[1:]:
        last = merged[-1]
        overlap_y = max(0, min(last[3], current[3]) - max(last[1], current[1]))
        overlap_x = max(0, min(last[2], current[2]) - max(last[0], current[0]))
        similar_center = abs(((last[1] + last[3]) / 2) - ((current[1] + current[3]) / 2)) <= 8

        if (overlap_y >= 10 and overlap_x >= 40) or similar_center:
            merged[-1] = (
                min(last[0], current[0]),
                min(last[1], current[1]),
                max(last[2], current[2]),
                max(last[3], current[3]),
            )
            continue

        merged.append(current)

    return merged


def detect_label_boxes(
    rgb: np.ndarray,
    min_y: int,
    max_width: int,
    x_start: int = 0,
    x_end: int | None = None,
) -> list[tuple[int, int, int, int]]:
    if x_end is None:
        x_end = rgb.shape[1]

    region = rgb[:, x_start:x_end]
    brightness = region.mean(axis=2)
    max_channel = region.max(axis=2)
    min_channel = region.min(axis=2)
    dark_mask = (brightness < 130) & ((max_channel - min_channel) < 110)
    dark_mask[:min_y, :] = False

    boxes: list[tuple[int, int, int, int]] = []
    for min_x, min_y_box, max_x, max_y_box, area in connected_components(dark_mask):
        width = max_x - min_x + 1
        height = max_y_box - min_y_box + 1
        if area < 2500 or width < 70 or width > max_width or height < 35 or height > 90:
            continue

        boxes.append((min_x + x_start, min_y_box, max_x + x_start, max_y_box))

    return merge_boxes(boxes)


def build_background_connected_mask(candidate: np.ndarray) -> np.ndarray:
    height, width = candidate.shape
    visited = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(y: int, x: int) -> None:
        if candidate[y, x] and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

    for x in range(width):
        enqueue(0, x)
        enqueue(height - 1, x)
    for y in range(height):
        enqueue(y, 0)
        enqueue(y, width - 1)

    while queue:
        y, x = queue.popleft()
        for next_y, next_x in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if (
                0 <= next_y < height
                and 0 <= next_x < width
                and candidate[next_y, next_x]
                and not visited[next_y, next_x]
            ):
                visited[next_y, next_x] = True
                queue.append((next_y, next_x))

    return visited


def remove_checkerboard_background(image: Image.Image) -> Image.Image:
    rgba = np.array(image.convert("RGBA"))
    rgb = rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    max_channel = rgb.max(axis=2)
    min_channel = rgb.min(axis=2)
    background_candidate = (brightness >= 220) & ((max_channel - min_channel) <= 28)
    connected_background = build_background_connected_mask(background_candidate)
    rgba[:, :, 3] = np.where(connected_background, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba)


def should_preserve_existing_alpha(image: Image.Image) -> bool:
    rgba = np.array(image.convert("RGBA"))
    alpha = rgba[:, :, 3]
    transparent_mask = alpha <= 8
    transparent_ratio = float(transparent_mask.mean())

    if transparent_ratio < 0.01:
        return False

    border_alpha = np.concatenate((alpha[0], alpha[-1], alpha[:, 0], alpha[:, -1]), axis=0)
    border_transparent_ratio = float((border_alpha <= 8).mean())
    return border_transparent_ratio >= 0.5


def remove_border_palette_background(image: Image.Image) -> Image.Image:
    if should_preserve_existing_alpha(image):
        return image.convert("RGBA")

    rgba = np.array(image.convert("RGBA"))
    rgb = rgba[:, :, :3].astype(np.int16)
    border_pixels = np.concatenate((rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]), axis=0)
    quantized_border = ((border_pixels // 8) * 8).astype(np.int16)
    palette: list[np.ndarray] = []

    for color, _ in Counter(map(tuple, quantized_border.tolist())).most_common(18):
        color_array = np.array(color, dtype=np.int16)
        if color_array.mean() < 150 and len(palette) >= 8:
            continue
        palette.append(color_array)
        if len(palette) >= 12:
            break

    if not palette:
        palette.append(np.array([248, 248, 248], dtype=np.int16))

    distances = np.stack([np.abs(rgb - color).sum(axis=2) for color in palette], axis=0)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    background_candidate = (distances.min(axis=0) <= 18) & (saturation <= 28)
    connected_background = build_background_connected_mask(background_candidate)
    rgba[:, :, 3] = np.where(connected_background, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba)


def remove_package_card_background(image: Image.Image) -> Image.Image:
    if should_preserve_existing_alpha(image):
        return image.convert("RGBA")

    rgba = np.array(image.convert("RGBA"))
    rgb = rgba[:, :, :3].astype(np.int16)
    border_pixels = np.concatenate((rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]), axis=0)
    quantized_border = ((border_pixels // 6) * 6).astype(np.int16)
    palette: list[np.ndarray] = []

    for color, _ in Counter(map(tuple, quantized_border.tolist())).most_common(20):
        color_array = np.array(color, dtype=np.int16)
        palette.append(color_array)
        if len(palette) >= 14:
            break

    if not palette:
        return image.convert("RGBA")

    distances = np.stack([np.abs(rgb - color).sum(axis=2) for color in palette], axis=0)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    brightness = rgb.mean(axis=2)
    background_candidate = (
        (distances.min(axis=0) <= 30)
        & (saturation <= 48)
        & (brightness >= 52)
    )
    connected_background = build_background_connected_mask(background_candidate)
    rgba[:, :, 3] = np.where(connected_background, 0, rgba[:, :, 3]).astype(np.uint8)
    return Image.fromarray(rgba)


def remove_border_connected_palette_background_rgba(
    frame_rgba: np.ndarray,
    distance_threshold: int = 24,
    brightness_min: int = 28,
    saturation_max: int = 60,
) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return frame_rgba

    rgb = frame_rgba[:, :, :3].astype(np.int16)
    border_pixels = np.concatenate((rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]), axis=0)
    quantized_border = ((border_pixels // 6) * 6).astype(np.int16)
    palette: list[np.ndarray] = []

    for color, _ in Counter(map(tuple, quantized_border.tolist())).most_common(18):
        palette.append(np.array(color, dtype=np.int16))
        if len(palette) >= 12:
            break

    if not palette:
        return frame_rgba

    distances = np.stack([np.abs(rgb - color).sum(axis=2) for color in palette], axis=0)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    background_candidate = (
        alpha_mask
        & (distances.min(axis=0) <= distance_threshold)
        & (brightness >= brightness_min)
        & (saturation <= saturation_max)
    )
    connected_background = build_background_connected_mask(background_candidate)
    cleaned = frame_rgba.copy()
    cleaned[connected_background, 3] = 0
    return cleaned


def remove_luna_checkerboard_background(image: Image.Image) -> Image.Image:
    rgba = np.array(image.convert("RGBA"))
    rgb = rgba[:, :, :3].astype(np.int16)
    border_pixels = np.concatenate((rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]), axis=0)
    quantized_border = ((border_pixels // 8) * 8).astype(np.int16)
    palette: list[np.ndarray] = []

    for color, _ in Counter(map(tuple, quantized_border.tolist())).most_common(16):
        palette.append(np.array(color, dtype=np.int16))
        if len(palette) >= 10:
            break

    if not palette:
        return image.convert("RGBA")

    distances = np.stack([np.abs(rgb - color).sum(axis=2) for color in palette], axis=0)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    background_candidate = (
        (distances.min(axis=0) <= 26)
        & (brightness >= 132)
        & (saturation <= 48)
    )
    connected_background = build_background_connected_mask(background_candidate)
    rgba[:, :, 3] = np.where(connected_background, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba)


def clear_luna_source_border_scraps_rgba(frame_rgba: np.ndarray) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return frame_rgba

    labels, components = label_connected_components(alpha_mask)
    cleaned = frame_rgba.copy()
    frame_width = alpha_mask.shape[1]

    for component in components:
        if not component.touches_border:
            continue

        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        remove_as_strip = height <= 4 and width >= max(20, int(frame_width * 0.14))
        remove_as_scrap = component.area <= 18
        if remove_as_strip or remove_as_scrap:
            cleaned[labels == component.index, 3] = 0

    return cleaned


def expand_package_source_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    pad_x: int = 18,
    pad_top: int = 18,
    pad_bottom: int = 12,
) -> tuple[tuple[int, int, int, int], float]:
    x_start, y_start, x_end, y_end = source_box
    expanded_x_start = max(0, x_start - pad_x)
    expanded_y_start = max(0, y_start - pad_top)
    expanded_x_end = min(image.size[0], x_end + pad_x)
    expanded_y_end = min(image.size[1], y_end + pad_bottom)
    target_center_x = ((x_start + x_end) / 2.0) - expanded_x_start
    return (expanded_x_start, expanded_y_start, expanded_x_end, expanded_y_end), target_center_x


def select_package_primary_component(
    components: list[MaskComponent],
    target_center_x: float,
) -> MaskComponent:
    def component_score(component: MaskComponent) -> float:
        center_x = (component.min_x + component.max_x) / 2.0
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        distance_penalty = abs(center_x - target_center_x) * 18.0
        border_penalty = 220.0 if component.touches_border else 0.0
        size_bonus = min(width * height, component.area * 1.2)
        return float(component.area) + size_bonus - distance_penalty - border_penalty

    return max(components, key=component_score)


def build_row_boundaries(centers: list[float], min_y: int, max_y: int) -> list[tuple[int, int]]:
    boundaries = [min_y]

    for index in range(len(centers) - 1):
        boundaries.append(int(round((centers[index] + centers[index + 1]) / 2)))

    boundaries.append(max_y)
    bands: list[tuple[int, int]] = []
    for index in range(len(boundaries) - 1):
        top = max(min_y, boundaries[index] - (6 if index > 0 else 0))
        bottom = min(max_y, boundaries[index + 1] + (6 if index < len(boundaries) - 2 else 0))
        bands.append((top, bottom))

    return bands


def build_label_row_groups(
    label_boxes: list[tuple[int, int, int, int]],
    tolerance: int,
) -> list[list[tuple[int, int, int, int]]]:
    row_groups: list[list[tuple[int, int, int, int]]] = []

    for box in sorted(label_boxes, key=lambda entry: (entry[1], entry[0])):
        center_y = (box[1] + box[3]) / 2
        if row_groups and abs(center_y - np.mean([(item[1] + item[3]) / 2 for item in row_groups[-1]])) <= tolerance:
            row_groups[-1].append(box)
        else:
            row_groups.append([box])

    return row_groups


def normalize_row_groups_to_expected_count(
    row_groups: list[list[tuple[int, int, int, int]]],
    expected_count: int,
) -> list[list[tuple[int, int, int, int]]] | None:
    if len(row_groups) < expected_count:
        return None

    normalized = [list(group) for group in row_groups]

    while len(normalized) > expected_count:
        merge_index = 0
        merge_gap: int | None = None
        for index in range(len(normalized) - 1):
            current_bottom = max(box[3] for box in normalized[index])
            next_top = min(box[1] for box in normalized[index + 1])
            gap = max(0, next_top - current_bottom)
            if merge_gap is None or gap < merge_gap:
                merge_gap = gap
                merge_index = index

        normalized[merge_index] = normalized[merge_index] + normalized[merge_index + 1]
        del normalized[merge_index + 1]

    return normalized


def build_exact_row_boxes_from_groups(
    row_groups: list[list[tuple[int, int, int, int]]],
    expected_count: int,
    min_y: int,
    max_y: int,
    top_margin: int = 10,
) -> list[tuple[int, int]] | None:
    normalized = normalize_row_groups_to_expected_count(row_groups, expected_count)
    if normalized is None or len(normalized) != expected_count:
        return None

    row_boxes: list[tuple[int, int]] = []
    for index, group in enumerate(normalized):
        group_top = min(box[1] for box in group)
        top = max(min_y, group_top - top_margin)
        if index + 1 < len(normalized):
            next_top = min(box[1] for box in normalized[index + 1])
            bottom = min(max_y, next_top - top_margin)
        else:
            bottom = max_y
        bottom = max(top + 24, bottom)
        row_boxes.append((top, bottom))

    return row_boxes


def build_uniform_bands_from_foreground(image: Image.Image, row_count: int) -> list[tuple[int, int]]:
    cleaned = remove_border_palette_background(image)
    alpha = cleaned.getchannel("A")
    bbox = alpha.getbbox()

    if bbox is None:
        raise RuntimeError("Image has no readable foreground content.")

    top = max(0, bbox[1] - 20)
    bottom = min(image.size[1] - 1, bbox[3] + 20)
    usable_height = max(row_count, bottom - top + 1)
    row_height = usable_height / row_count
    bands: list[tuple[int, int]] = []

    for index in range(row_count):
        band_top = int(round(top + index * row_height - (6 if index > 0 else 0)))
        band_bottom = int(round(top + (index + 1) * row_height + (6 if index < row_count - 1 else 0)))
        bands.append((max(0, band_top), min(image.size[1], band_bottom)))

    return bands


def build_uniform_bands_with_min_top(
    image: Image.Image,
    row_count: int,
    min_top: int,
    max_bottom: int | None = None,
) -> list[tuple[int, int]]:
    cleaned = remove_border_palette_background(remove_checkerboard_background(image))
    alpha = cleaned.getchannel("A")
    bbox = alpha.getbbox()

    if bbox is None:
        raise RuntimeError("Image has no readable foreground content.")

    top = max(min_top, bbox[1])
    bottom_limit = image.size[1] - 1 if max_bottom is None else min(image.size[1] - 1, max_bottom)
    bottom = min(bottom_limit, bbox[3] + 12)
    usable_height = max(row_count, bottom - top + 1)
    row_height = usable_height / row_count
    bands: list[tuple[int, int]] = []

    for index in range(row_count):
        band_top = int(round(top + index * row_height - (6 if index > 0 else 0)))
        band_bottom = int(round(top + (index + 1) * row_height + (6 if index < row_count - 1 else 0)))
        bands.append((max(top, band_top), min(image.size[1], band_bottom)))

    return bands


def estimate_single_layout_content_x_start(
    label_boxes: list[tuple[int, int, int, int]],
    image_width: int,
    fallback: int = 190,
) -> int:
    left_panel_boxes: list[tuple[int, int, int, int]] = []

    for box in label_boxes:
        width = box[2] - box[0] + 1
        height = box[3] - box[1] + 1
        if (
            box[0] <= int(image_width * 0.28)
            and width <= max(220, int(image_width * 0.22))
            and height >= 28
        ):
            left_panel_boxes.append(box)

    label_right_edge = max((box[2] for box in left_panel_boxes), default=fallback - 24)
    return min(max(fallback, label_right_edge + 24), max(fallback, image_width - 64))


def detect_foreground_row_segments(
    image: Image.Image,
    x_start: int,
    min_row_pixels: int | None = None,
    max_gap: int = 18,
) -> list[tuple[int, int]]:
    cleaned = remove_checkerboard_background(image)
    alpha = np.array(cleaned.getchannel("A")) > 0

    safe_x_start = min(max(0, x_start), max(0, image.size[0] - 32))
    alpha = alpha[:, safe_x_start:]
    if alpha.size == 0:
        return []

    row_pixels = alpha.sum(axis=1)
    threshold = min_row_pixels if min_row_pixels is not None else max(12, int(alpha.shape[1] * 0.008))
    active_rows = row_pixels >= threshold
    segments: list[tuple[int, int]] = []
    segment_start: int | None = None

    for row_index, is_active in enumerate(active_rows):
        if is_active and segment_start is None:
            segment_start = row_index
        elif not is_active and segment_start is not None:
            segments.append((segment_start, row_index - 1))
            segment_start = None

    if segment_start is not None:
        segments.append((segment_start, len(active_rows) - 1))

    merged: list[tuple[int, int]] = []
    for top, bottom in segments:
        if merged and top - merged[-1][1] <= max_gap:
            merged[-1] = (merged[-1][0], bottom)
        else:
            merged.append((top, bottom))

    return [
        (top, bottom)
        for top, bottom in merged
        if (bottom - top + 1) >= 18
    ]


def detect_row_label_edge_for_base(
    image: Image.Image,
    band_top: int,
    band_bottom: int,
    region: str,
    fallback_start: int,
    fallback_end: int,
) -> int:
    rgba = np.array(image.crop((0, band_top, image.size[0], band_bottom)).convert("RGBA"))
    rgb = rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    dark_mask = (rgba[:, :, 3] > 0) & (brightness < 150) & (saturation < 120)
    search_mask = np.zeros_like(dark_mask)
    mid_x = image.size[0] // 2

    if region == "left":
        search_left, search_right = 0, min(image.size[0], fallback_start + 140)
    elif region == "right":
        search_left = max(0, fallback_start - 48)
        search_right = min(image.size[0], fallback_start + 180)
    else:
        search_left, search_right = 0, min(image.size[0], fallback_start + 180)

    search_mask[:, search_left:search_right] = dark_mask[:, search_left:search_right]
    candidate_boxes = [
        (min_x, min_y, max_x, max_y, area)
        for min_x, min_y, max_x, max_y, area in connected_components(search_mask)
        if (
            area >= 1400
            and 68 <= (max_x - min_x + 1) <= 180
            and 24 <= (max_y - min_y + 1) <= 100
            and min_y <= max(24, int((band_bottom - band_top) * 0.28))
        )
    ]

    if not candidate_boxes:
        return fallback_start

    _, _, max_x, _, _ = min(candidate_boxes, key=lambda entry: (entry[0], -entry[4]))
    return min(max(0, int(max_x) + 24), max(0, fallback_end - 8))


def detect_paired_row_split_gap(
    image: Image.Image,
    band_top: int,
    band_bottom: int,
    fallback_mid_x: int,
) -> tuple[int, int]:
    band = remove_checkerboard_background(image.crop((0, band_top, image.size[0], band_bottom)).convert("RGBA"))
    alpha = np.array(band.getchannel("A")) > 0
    x_projection = alpha.sum(axis=0)
    width = image.size[0]
    search_left = max(180, int(width * 0.18))
    search_right = min(width - 120, int(width * 0.82))
    threshold = max(2, int((band_bottom - band_top) * 0.04))
    best_run: tuple[int, int] | None = None
    best_score = float("-inf")
    run_start: int | None = None

    for x in range(search_left, search_right):
        if x_projection[x] <= threshold:
            if run_start is None:
                run_start = x
        elif run_start is not None:
            if x - run_start >= 12:
                run_left = run_start
                run_right = x - 1
                run_width = run_right - run_left + 1
                run_center = (run_left + run_right) / 2.0
                distance_penalty = abs(run_center - fallback_mid_x) * 0.35
                score = run_width - distance_penalty
                if score > best_score:
                    best_score = score
                    best_run = (run_left, run_right)
            run_start = None

    if run_start is not None and search_right - run_start >= 12:
        run_left = run_start
        run_right = search_right - 1
        run_width = run_right - run_left + 1
        run_center = (run_left + run_right) / 2.0
        distance_penalty = abs(run_center - fallback_mid_x) * 0.35
        score = run_width - distance_penalty
        if score > best_score:
            best_score = score
            best_run = (run_left, run_right)

    if best_run is not None:
        return best_run

    split_x = int(np.argmin(x_projection[search_left:search_right])) + search_left
    return max(0, split_x - 6), min(width - 1, split_x + 6)


def reconstruct_row_centers(
    observed_centers: list[float],
    expected_count: int,
    min_y: int,
    max_y: int,
) -> list[float]:
    if not observed_centers:
        return []

    if len(observed_centers) >= expected_count:
        return observed_centers[:expected_count]

    observed = np.array(observed_centers, dtype=np.float64)
    target_positions = np.arange(expected_count, dtype=np.float64)
    best_centers: list[float] | None = None
    best_error = float("inf")

    for positions in combinations(range(expected_count), len(observed_centers)):
        mapped = np.array(positions, dtype=np.float64)

        if len(observed_centers) == 1:
            slope = max((max_y - min_y) / max(expected_count - 1, 1), 24.0)
            intercept = observed[0] - slope * mapped[0]
        else:
            slope, intercept = np.polyfit(mapped, observed, 1)
            if slope < 24.0:
                continue

        predicted = (intercept + slope * target_positions).tolist()

        if predicted[0] < min_y - 32 or predicted[-1] > max_y + 32:
            continue

        aligned = np.array([predicted[position] for position in positions], dtype=np.float64)
        error = float(np.mean(np.abs(aligned - observed)))

        if error < best_error:
            best_error = error
            best_centers = predicted

    if best_centers is not None:
        return best_centers

    return [
        min_y + ((max_y - min_y) * ((index + 0.5) / expected_count))
        for index in range(expected_count)
    ]


def compute_frame_anchor(mask_coords: np.ndarray) -> tuple[float, float]:
    if mask_coords.size == 0:
        return 12.0, 23.0

    y_coords = mask_coords[:, 0].astype(np.float32)
    x_coords = mask_coords[:, 1].astype(np.float32)
    min_y = float(y_coords.min())
    max_y = float(y_coords.max())
    lower_band_start = min_y + (max_y - min_y) * 0.58
    support_coords = mask_coords[y_coords >= lower_band_start]

    if support_coords.shape[0] < max(12, int(mask_coords.shape[0] * 0.08)):
        support_coords = mask_coords

    support_x = support_coords[:, 1].astype(np.float32)
    support_y = support_coords[:, 0].astype(np.float32)
    anchor_x = float(np.median(support_x))
    anchor_y = float(np.quantile(support_y, 0.92))
    return anchor_x, anchor_y


def component_bbox_gap(left: MaskComponent, right: MaskComponent) -> float:
    x_gap = max(0, max(left.min_x, right.min_x) - min(left.max_x, right.max_x))
    y_gap = max(0, max(left.min_y, right.min_y) - min(left.max_y, right.max_y))
    return float(max(x_gap, y_gap))


def filter_frame_mask_components(cell_mask: np.ndarray) -> np.ndarray:
    components = connected_components(cell_mask)

    if len(components) <= 1:
        return cell_mask

    largest_area = max(area for _, _, _, _, area in components)
    keep_mask = np.zeros_like(cell_mask)

    for min_x, min_y, max_x, max_y, area in components:
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        touches_left = min_x <= 1
        touches_right = max_x >= cell_mask.shape[1] - 2
        touches_top = min_y <= 1
        touches_bottom = max_y >= cell_mask.shape[0] - 2
        is_tiny = area < max(22, int(largest_area * 0.06))
        is_edge_scrap = (
            (touches_left or touches_right) and width <= 16 and area < int(largest_area * 0.75)
        ) or (
            touches_top and height <= 12 and area < int(largest_area * 0.5)
        ) or (
            touches_bottom and height <= 10 and area < int(largest_area * 0.45)
        )

        if is_tiny or is_edge_scrap:
            continue

        keep_mask[min_y : max_y + 1, min_x : max_x + 1] |= cell_mask[min_y : max_y + 1, min_x : max_x + 1]

    if keep_mask.any():
        return keep_mask

    return cell_mask


def refine_primary_frame_mask(cell_mask: np.ndarray) -> np.ndarray:
    labels, components = label_connected_components(cell_mask)

    if len(components) <= 1:
        return cell_mask

    main_component = max(
        components,
        key=lambda component: (
            component.area,
            component.max_y,
            component.max_x - component.min_x,
        ),
    )
    keep_indices = {main_component.index}
    main_width = main_component.max_x - main_component.min_x + 1
    main_height = main_component.max_y - main_component.min_y + 1

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
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        bbox_area = max(1, width * height)
        density = component.area / bbox_area
        horizontal_overlap = max(
            0,
            min(main_component.max_x, component.max_x) - max(main_component.min_x, component.min_x) + 1,
        )
        overlaps_body_width = horizontal_overlap >= max(4, int(min(main_width, width) * 0.35))
        looks_like_head_piece = (
            component.max_y < main_component.min_y + max(6, int(main_height * 0.18))
            and gap_y <= max(12, int(main_height * 0.28))
            and area_ratio >= 0.02
            and overlaps_body_width
        )
        close_effect = (
            area_ratio >= 0.05
            and gap_x <= max(10, int(main_width * 0.45))
            and gap_y <= max(14, int(main_height * 0.45))
        )
        dense_medium_component = (
            density >= 0.22
            and area_ratio >= 0.08
            and gap_x <= max(12, int(main_width * 0.6))
            and gap_y <= max(18, int(main_height * 0.55))
        )

        if close_effect or dense_medium_component or looks_like_head_piece:
            keep_indices.add(component.index)

    return np.isin(labels, list(keep_indices))


def build_column_intervals(mask: np.ndarray, threshold: int, merge_gap: int = 6) -> list[tuple[int, int, int]]:
    active = mask.sum(axis=0) >= threshold
    intervals: list[tuple[int, int, int]] = []
    start: int | None = None

    for index, value in enumerate(active):
        if value and start is None:
            start = index
        elif not value and start is not None:
            area = int(mask[:, start:index].sum())
            intervals.append((start, index - 1, area))
            start = None

    if start is not None:
        area = int(mask[:, start : mask.shape[1]].sum())
        intervals.append((start, mask.shape[1] - 1, area))

    merged: list[tuple[int, int, int]] = []

    for left, right, area in intervals:
        if area < 40:
            continue

        if merged and left - merged[-1][1] <= merge_gap:
            prev_left, prev_right, prev_area = merged[-1]
            merged[-1] = (prev_left, right, prev_area + area)
        else:
            merged.append((left, right, area))

    if not merged:
        return []

    largest_area = max(area for _, _, area in merged)
    filtered: list[tuple[int, int, int]] = []

    for left, right, area in merged:
        width = right - left + 1
        touches_edge = left <= 2 or right >= mask.shape[1] - 3
        is_edge_scrap = touches_edge and width <= 18 and area < int(largest_area * 0.35)
        is_tiny = width <= 10 and area < int(largest_area * 0.6)

        if is_edge_scrap or is_tiny:
            continue

        filtered.append((left, right, area))

    return filtered


def trim_edge_intervals(
    intervals: list[tuple[int, int, int]],
    frame_count: int,
    region_width: int,
) -> list[tuple[int, int, int]]:
    trimmed = list(intervals)

    while len(trimmed) > frame_count:
        widths = [right - left + 1 for left, right, _ in trimmed]
        areas = [area for _, _, area in trimmed]
        median_width = float(np.median(widths)) if widths else 0.0
        median_area = float(np.median(areas)) if areas else 0.0
        first_left, first_right, first_area = trimmed[0]
        last_left, last_right, last_area = trimmed[-1]
        first_width = first_right - first_left + 1
        last_width = last_right - last_left + 1

        first_is_scrap = first_left <= 2 and (
            first_width <= max(18, int(median_width * 0.75))
            or first_area <= max(120, int(median_area * 0.55))
        )
        last_is_scrap = last_right >= region_width - 3 and (
            last_width <= max(18, int(median_width * 0.75))
            or last_area <= max(120, int(median_area * 0.55))
        )

        if first_is_scrap and (not last_is_scrap or first_area <= last_area):
            trimmed = trimmed[1:]
            continue

        if last_is_scrap:
            trimmed = trimmed[:-1]
            continue

        break

    return trimmed


def detect_frame_intervals(mask: np.ndarray, frame_count: int) -> list[tuple[int, int]] | None:
    max_column_count = int(mask.sum(axis=0).max())

    if max_column_count <= 0:
        return None

    best: tuple[int, list[tuple[int, int, int]]] | None = None
    best_exact: tuple[int, list[tuple[int, int, int]]] | None = None

    for threshold in range(max_column_count, 3, -2):
        intervals = build_column_intervals(mask, threshold)

        if not intervals:
            continue

        intervals = trim_edge_intervals(intervals, frame_count, mask.shape[1])

        if len(intervals) == frame_count:
            total_width = sum((right - left + 1) for left, right, _ in intervals)
            if best_exact is None or total_width > best_exact[0]:
                best_exact = (total_width, intervals)
            continue

        score = abs(len(intervals) - frame_count)
        if best is None or score < best[0]:
            best = (score, intervals)

    if best_exact is not None:
        return [(left, right) for left, right, _ in best_exact[1]]

    if best is None:
        return None

    left_right = [(left, right) for left, right, _ in best[1]]
    return left_right if len(left_right) == frame_count else None


def frame_intervals_are_reliable(intervals: list[tuple[int, int]], frame_count: int, region_width: int) -> bool:
    if len(intervals) != frame_count:
        return False

    widths = [right - left + 1 for left, right in intervals]
    median_width = float(np.median(widths)) if widths else 0.0

    if median_width <= 0:
        return False

    first_left, first_right = intervals[0]
    last_left, last_right = intervals[-1]
    first_width = first_right - first_left + 1
    last_width = last_right - last_left + 1

    if first_left <= 2 and first_width < median_width * 0.75:
        return False

    if last_right >= region_width - 3 and last_width < median_width * 0.75:
        return False

    if any(width < median_width * 0.55 or width > median_width * 1.85 for width in widths):
        return False

    return True


def compute_active_horizontal_bounds(mask: np.ndarray) -> tuple[int, int] | None:
    components = connected_components(mask)

    if not components:
        return None

    largest_area = max(area for _, _, _, _, area in components)
    significant = [
        (min_x, max_x)
        for min_x, min_y, max_x, max_y, area in components
        if area >= max(24, int(largest_area * 0.06))
        and not (min_y <= 1 and (max_y - min_y + 1) <= 12 and area < int(largest_area * 0.55))
    ]

    if not significant:
        return None

    min_x = min(left for left, _ in significant)
    max_x = max(right for _, right in significant)
    return min_x, max_x + 1


def fit_strip_frames(
    frames: list[ExtractedFrame],
    max_scale: float = 1.0,
    extent_quantile: float = 1.0,
) -> Image.Image:
    left_extents = [frame.anchor_x for frame in frames]
    right_extents = [frame.image.size[0] - frame.anchor_x for frame in frames]
    above_extents = [frame.anchor_y for frame in frames]
    below_extents = [frame.image.size[1] - frame.anchor_y for frame in frames]

    if extent_quantile < 1.0:
        max_left_extent = float(np.quantile(left_extents, extent_quantile))
        max_right_extent = float(np.quantile(right_extents, extent_quantile))
        max_above_extent = float(np.quantile(above_extents, extent_quantile))
        max_below_extent = float(np.quantile(below_extents, extent_quantile))
    else:
        max_left_extent = max(left_extents)
        max_right_extent = max(right_extents)
        max_above_extent = max(above_extents)
        max_below_extent = max(below_extents)

    scale = min(
        (FRAME_SIZE - 4) / max(max_left_extent + max_right_extent, 1.0),
        (FRAME_SIZE - 4) / max(max_above_extent + max_below_extent, 1.0),
        max_scale,
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
        resized = frame.image.resize((width, height), RUNTIME_RESAMPLE) if scale != 1.0 else frame.image
        scaled_anchor_x = frame.anchor_x * scale
        scaled_anchor_y = frame.anchor_y * scale
        paste_x = int(round(index * FRAME_SIZE + cell_anchor_x - scaled_anchor_x))
        paste_y = int(round(cell_anchor_y - scaled_anchor_y))
        paste_x = max(index * FRAME_SIZE, min(index * FRAME_SIZE + FRAME_SIZE - resized.size[0], paste_x))
        paste_y = max(0, min(FRAME_SIZE - resized.size[1], paste_y))
        strip.paste(resized, (paste_x, paste_y), resized)

    return strip


def cleanup_hero_runtime_leg_gap_strip(
    strip: Image.Image,
    gap_start_ratio: float = 0.46,
    slit_half_width: int = 2,
) -> Image.Image:
    cleaned_strip = strip.copy().convert("RGBA")

    for index in range(cleaned_strip.width // FRAME_SIZE):
        frame_box = (index * FRAME_SIZE, 0, (index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame = cleaned_strip.crop(frame_box).convert("RGBA")
        frame_rgba = np.array(frame)
        alpha_mask = frame_rgba[:, :, 3] > 0
        if not alpha_mask.any():
            continue

        coords = np.argwhere(alpha_mask)
        min_y = int(coords[:, 0].min())
        max_y = int(coords[:, 0].max())
        target_x = compute_frame_visual_core_anchor_x(coords, band_start_ratio=0.42, band_end_ratio=0.82)
        gap_start = int(round(min_y + ((max_y - min_y) * gap_start_ratio)))
        gap_rows: list[tuple[int, int, int]] = []

        for y in range(gap_start, min(FRAME_SIZE, max_y + 1)):
            alpha_columns = np.flatnonzero(alpha_mask[y])
            if alpha_columns.size < 2:
                continue
            alpha_splits = np.where(np.diff(alpha_columns) > 1)[0]
            if alpha_splits.size == 0:
                continue

            alpha_runs: list[tuple[int, int]] = []
            alpha_run_start = int(alpha_columns[0])
            for split_index in alpha_splits:
                alpha_runs.append((alpha_run_start, int(alpha_columns[split_index])))
                alpha_run_start = int(alpha_columns[split_index + 1])
            alpha_runs.append((alpha_run_start, int(alpha_columns[-1])))

            selected_gap = select_gap_near_target_x(
                alpha_runs,
                target_x,
                max_gap_width=10,
                max_center_distance=8,
            )
            if selected_gap is not None:
                gap_left, gap_right = selected_gap
                gap_rows.append((y, gap_left, gap_right))

    if gap_rows:
        seed_limit_y = gap_start + max(4, int(round((max_y - min_y) * 0.12)))
        seed_rows = [row for row in gap_rows if row[0] <= seed_limit_y] or gap_rows[:4]
        slit_left = max(0, min(left for _, left, right in seed_rows))
        slit_right = min(FRAME_SIZE, max(right for _, left, right in seed_rows))
    else:
        gap_center = int(round(target_x))
        seed_rows = [(gap_start, gap_center - 1, gap_center + 1)]
        slit_left = max(0, gap_center - slit_half_width)
        slit_right = min(FRAME_SIZE, gap_center + slit_half_width + 1)

    corridor_start_y = max(gap_start, min(y for y, _, _ in seed_rows) - 1)
    corridor_end_y = min(
        FRAME_SIZE,
        max(y for y, _, _ in seed_rows) + max(5, int(round((max_y - min_y) * 0.16))),
    )
    frame_rgba[corridor_start_y:corridor_end_y, slit_left:slit_right, 3] = 0
    cleaned_strip.paste(Image.fromarray(frame_rgba, "RGBA"), (index * FRAME_SIZE, 0))

    return cleaned_strip


def fill_transparent_component_from_neighbors(
    frame_rgba: np.ndarray,
    component_mask: np.ndarray,
) -> np.ndarray:
    if not component_mask.any():
        return frame_rgba

    height, width = component_mask.shape
    ys, xs = np.nonzero(component_mask)
    y_start = max(0, int(ys.min()) - 1)
    y_end = min(height, int(ys.max()) + 2)
    x_start = max(0, int(xs.min()) - 1)
    x_end = min(width, int(xs.max()) + 2)

    local_component = component_mask[y_start:y_end, x_start:x_end]
    padded_component = np.pad(local_component, 1, mode="constant", constant_values=False)
    neighbor_touch_mask = np.zeros_like(local_component, dtype=bool)

    for delta_y in (-1, 0, 1):
        for delta_x in (-1, 0, 1):
            if delta_x == 0 and delta_y == 0:
                continue
            neighbor_touch_mask |= padded_component[
                1 + delta_y : 1 + delta_y + local_component.shape[0],
                1 + delta_x : 1 + delta_x + local_component.shape[1],
            ]

    local_alpha_mask = frame_rgba[y_start:y_end, x_start:x_end, 3] > 0
    boundary_mask = (~local_component) & neighbor_touch_mask & local_alpha_mask
    boundary_pixels = frame_rgba[y_start:y_end, x_start:x_end][boundary_mask]

    if boundary_pixels.size == 0:
        frame_rgba[component_mask, 3] = 255
        return frame_rgba

    fill_rgb = np.median(boundary_pixels[:, :3], axis=0).round().astype(np.uint8)
    frame_rgba[component_mask, :3] = fill_rgb
    frame_rgba[component_mask, 3] = 255
    return frame_rgba


def cleanup_runtime_tiny_components_and_holes_strip(
    strip: Image.Image,
    max_component_area: int = 6,
    max_hole_area: int = 8,
) -> Image.Image:
    cleaned_strip = strip.copy().convert("RGBA")

    for index in range(cleaned_strip.width // FRAME_SIZE):
        frame_box = (index * FRAME_SIZE, 0, (index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame_rgba = np.array(cleaned_strip.crop(frame_box).convert("RGBA"))
        alpha_mask = frame_rgba[:, :, 3] > 0

        if not alpha_mask.any():
            continue

        labels, components = label_connected_components(alpha_mask)
        if components:
            primary = max(components, key=lambda component: component.area)
            for component in components:
                if component.index == primary.index:
                    continue
                if component.area <= max_component_area:
                    frame_rgba[labels == component.index, 3] = 0

        hole_labels, hole_components = label_connected_components(~(frame_rgba[:, :, 3] > 0))
        for component in hole_components:
            if component.touches_border:
                continue
            width = component.max_x - component.min_x + 1
            height = component.max_y - component.min_y + 1
            if component.area <= max_hole_area and width <= 4 and height <= 4:
                frame_rgba = fill_transparent_component_from_neighbors(
                    frame_rgba,
                    hole_labels == component.index,
                )

        cleaned_strip.paste(Image.fromarray(frame_rgba, "RGBA"), (index * FRAME_SIZE, 0))

    return cleaned_strip


def cleanup_runtime_internal_holes_strip(
    strip: Image.Image,
    max_area: int = 96,
    max_width: int = 10,
    max_height: int = 12,
    max_bottom_ratio: float = 0.72,
) -> Image.Image:
    cleaned_strip = strip.copy().convert("RGBA")

    for index in range(cleaned_strip.width // FRAME_SIZE):
        frame_box = (index * FRAME_SIZE, 0, (index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame_rgba = np.array(cleaned_strip.crop(frame_box).convert("RGBA"))
        frame_rgba = cleanup_hero_internal_holes(
            frame_rgba,
            max_area=max_area,
            max_width=max_width,
            max_height=max_height,
            max_bottom_ratio=max_bottom_ratio,
        )
        cleaned_strip.paste(Image.fromarray(frame_rgba, "RGBA"), (index * FRAME_SIZE, 0))

    return cleaned_strip


def cleanup_runtime_side_slivers_strip(
    strip: Image.Image,
    max_width: int = 14,
    max_area: int = 220,
    max_area_ratio: float = 0.28,
) -> Image.Image:
    cleaned_strip = strip.copy().convert("RGBA")

    for index in range(cleaned_strip.width // FRAME_SIZE):
        frame_box = (index * FRAME_SIZE, 0, (index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame_rgba = np.array(cleaned_strip.crop(frame_box).convert("RGBA"))
        alpha_mask = frame_rgba[:, :, 3] > 0
        labels, components = label_connected_components(alpha_mask)
        if len(components) <= 1:
            continue

        primary = max(components, key=lambda component: component.area)
        primary_area = max(1, primary.area)
        for component in components:
            if component.index == primary.index:
                continue
            width = component.max_x - component.min_x + 1
            touches_side = component.min_x <= 1 or component.max_x >= frame_rgba.shape[1] - 2
            if (
                touches_side
                and width <= max_width
                and component.area <= max_area
                and (component.area / primary_area) <= max_area_ratio
            ):
                frame_rgba[labels == component.index, 3] = 0

        cleaned_strip.paste(Image.fromarray(frame_rgba, "RGBA"), (index * FRAME_SIZE, 0))

    return cleaned_strip


def cleanup_runtime_nonprimary_scraps_strip(
    strip: Image.Image,
    max_area: int = 120,
    top_band: int = 20,
    max_width: int = 10,
    max_height: int = 18,
) -> Image.Image:
    cleaned_strip = strip.copy().convert("RGBA")

    for index in range(cleaned_strip.width // FRAME_SIZE):
        frame_box = (index * FRAME_SIZE, 0, (index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame_rgba = np.array(cleaned_strip.crop(frame_box).convert("RGBA"))
        alpha_mask = frame_rgba[:, :, 3] > 0
        labels, components = label_connected_components(alpha_mask)
        if len(components) <= 1:
            continue

        primary = max(components, key=lambda component: component.area)
        for component in components:
            if component.index == primary.index:
                continue
            width = component.max_x - component.min_x + 1
            height = component.max_y - component.min_y + 1
            near_top = component.min_y <= top_band
            if component.area <= max_area and near_top and width <= max_width and height <= max_height:
                frame_rgba[labels == component.index, 3] = 0

        cleaned_strip.paste(Image.fromarray(frame_rgba, "RGBA"), (index * FRAME_SIZE, 0))

    return cleaned_strip


def cleanup_runtime_prune_small_nonprimary_strip(
    strip: Image.Image,
    max_area: int = 120,
) -> Image.Image:
    cleaned_strip = strip.copy().convert("RGBA")

    for index in range(cleaned_strip.width // FRAME_SIZE):
        frame_box = (index * FRAME_SIZE, 0, (index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame_rgba = np.array(cleaned_strip.crop(frame_box).convert("RGBA"))
        alpha_mask = frame_rgba[:, :, 3] > 0
        labels, components = label_connected_components(alpha_mask)
        if len(components) <= 1:
            continue

        primary = max(components, key=lambda component: component.area)
        for component in components:
            if component.index == primary.index:
                continue
            if component.area <= max_area:
                frame_rgba[labels == component.index, 3] = 0

        cleaned_strip.paste(Image.fromarray(frame_rgba, "RGBA"), (index * FRAME_SIZE, 0))

    return cleaned_strip


def apply_runtime_frame_replacements(strip: Image.Image, replacements: dict[int, int]) -> Image.Image:
    if not replacements:
        return strip

    cleaned_strip = strip.copy().convert("RGBA")
    frame_total = cleaned_strip.width // FRAME_SIZE

    for target_index, source_index in replacements.items():
        if target_index < 0 or source_index < 0 or target_index >= frame_total or source_index >= frame_total:
            continue
        source_box = (source_index * FRAME_SIZE, 0, (source_index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame_image = cleaned_strip.crop(source_box).copy()
        cleaned_strip.paste(frame_image, (target_index * FRAME_SIZE, 0))

    return cleaned_strip


def apply_subject_clip_strip_cleanup(subject_id: str, clip_id: str, strip: Image.Image) -> Image.Image:
    cleanup_spec = POST_STRIP_INTERNAL_HOLE_CLEANUP_SPECS.get(subject_id, {}).get(clip_id)
    if cleanup_spec is not None:
        strip = cleanup_runtime_internal_holes_strip(
            strip,
            max_area=int(cleanup_spec.get("max_area", 96)),
            max_width=int(cleanup_spec.get("max_width", 10)),
            max_height=int(cleanup_spec.get("max_height", 12)),
            max_bottom_ratio=float(cleanup_spec.get("max_bottom_ratio", 0.72)),
        )

    side_sliver_spec = POST_STRIP_SIDE_SLIVER_CLEANUP_SPECS.get(subject_id, {}).get(clip_id)
    if side_sliver_spec is not None:
        strip = cleanup_runtime_side_slivers_strip(
            strip,
            max_width=int(side_sliver_spec.get("max_width", 14)),
            max_area=int(side_sliver_spec.get("max_area", 220)),
            max_area_ratio=float(side_sliver_spec.get("max_area_ratio", 0.28)),
        )

    nonprimary_scrap_spec = POST_STRIP_NONPRIMARY_SCRAP_CLEANUP_SPECS.get(subject_id, {}).get(clip_id)
    if nonprimary_scrap_spec is not None:
        strip = cleanup_runtime_nonprimary_scraps_strip(
            strip,
            max_area=int(nonprimary_scrap_spec.get("max_area", 120)),
            top_band=int(nonprimary_scrap_spec.get("top_band", 20)),
            max_width=int(nonprimary_scrap_spec.get("max_width", 10)),
            max_height=int(nonprimary_scrap_spec.get("max_height", 18)),
        )

    prune_small_nonprimary_spec = POST_STRIP_PRUNE_SMALL_NONPRIMARY_SPECS.get(subject_id, {}).get(clip_id)
    if prune_small_nonprimary_spec is not None:
        strip = cleanup_runtime_prune_small_nonprimary_strip(
            strip,
            max_area=int(prune_small_nonprimary_spec.get("max_area", 120)),
        )

    frame_replacements = POST_STRIP_FRAME_REPLACEMENTS.get(subject_id, {}).get(clip_id)
    if frame_replacements is not None:
        strip = apply_runtime_frame_replacements(strip, frame_replacements)

    return strip


def clear_dark_neutral_box(
    frame_rgba: np.ndarray,
    x_start: int,
    y_start: int,
    x_end: int,
    y_end: int,
    brightness_min: int = 0,
    brightness_max: int = 140,
    saturation_max: int = 36,
) -> np.ndarray:
    x_start = max(0, x_start)
    y_start = max(0, y_start)
    x_end = min(frame_rgba.shape[1], x_end)
    y_end = min(frame_rgba.shape[0], y_end)

    if x_start >= x_end or y_start >= y_end:
        return frame_rgba

    region = frame_rgba[y_start:y_end, x_start:x_end]
    rgb = region[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    alpha = region[:, :, 3]
    residue_mask = (
        (alpha > 0)
        & (brightness >= brightness_min)
        & (brightness <= brightness_max)
        & (saturation <= saturation_max)
    )
    region[:, :, 3] = np.where(residue_mask, 0, region[:, :, 3]).astype(np.uint8)
    frame_rgba[y_start:y_end, x_start:x_end] = region
    return frame_rgba


def clear_frame_columns(frame_rgba: np.ndarray, start_x: int) -> np.ndarray:
    start_x = max(0, start_x)
    if start_x < frame_rgba.shape[1]:
        frame_rgba[:, start_x:, 3] = 0
    return frame_rgba


def cleanup_hero_runtime_talk_inner_leg_residue(strip: Image.Image) -> Image.Image:
    cleaned_strip = strip.copy().convert("RGBA")

    for index in range(cleaned_strip.width // FRAME_SIZE):
        frame_box = (index * FRAME_SIZE, 0, (index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame_rgba = np.array(cleaned_strip.crop(frame_box).convert("RGBA"))

        if index in (0, 1):
            frame_rgba = clear_dark_neutral_box(
                frame_rgba,
                x_start=45,
                y_start=35,
                x_end=52,
                y_end=41,
                brightness_min=25,
                brightness_max=120,
                saturation_max=24,
            )
        else:
            frame_rgba = clear_dark_neutral_box(
                frame_rgba,
                x_start=31,
                y_start=50,
                x_end=35,
                y_end=60,
                brightness_min=25,
                brightness_max=160,
                saturation_max=50,
            )
            frame_rgba = clear_dark_neutral_box(
                frame_rgba,
                x_start=45,
                y_start=39,
                x_end=48,
                y_end=44,
                brightness_min=25,
                brightness_max=120,
                saturation_max=28,
            )

        cleaned_strip.paste(Image.fromarray(frame_rgba, "RGBA"), (index * FRAME_SIZE, 0))

    return cleaned_strip


def cleanup_hero_skill_cast_frames(frames: list[ExtractedFrame]) -> list[ExtractedFrame]:
    if not frames:
        return frames

    cleaned_frames: list[ExtractedFrame] = list(frames)
    right_cutoffs = {
        3: 48,
        4: 48,
        5: 38,
        6: 38,
    }

    for index, frame in enumerate(cleaned_frames):
        if index == 7:
            continue

        frame_rgba = np.array(frame.image.convert("RGBA"))
        cutoff = right_cutoffs.get(index)
        if cutoff is not None:
            frame_rgba = clear_frame_columns(frame_rgba, cutoff)

        coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        if coords.size == 0:
            continue

        anchor_x, anchor_y = compute_frame_anchor(coords)
        cleaned_frames[index] = ExtractedFrame(
            image=Image.fromarray(frame_rgba, "RGBA"),
            anchor_x=anchor_x,
            anchor_y=anchor_y,
        )

    if len(cleaned_frames) >= 8:
        cleaned_frames[7] = cleaned_frames[6]

    return cleaned_frames


def cleanup_hero_runtime_skill_cast_tail(strip: Image.Image) -> Image.Image:
    cleaned_strip = strip.copy().convert("RGBA")

    cleanup_boxes = {
        0: ((24, 53, 28, 60),),
        1: ((26, 53, 30, 60), (40, 46, 45, 52)),
        2: ((26, 53, 30, 60), (40, 46, 45, 52)),
        3: ((29, 50, 34, 58),),
        4: ((29, 50, 34, 58),),
        5: ((34, 54, 37, 60),),
        6: ((34, 54, 37, 60),),
        7: ((34, 54, 37, 60),),
    }

    for frame_index in range(cleaned_strip.width // FRAME_SIZE):
        frame_box = (frame_index * FRAME_SIZE, 0, (frame_index + 1) * FRAME_SIZE, FRAME_SIZE)
        if frame_index == 7:
            frame_rgba = np.array(
                cleaned_strip.crop((6 * FRAME_SIZE, 0, 7 * FRAME_SIZE, FRAME_SIZE)).convert("RGBA")
            )
        else:
            frame_rgba = np.array(cleaned_strip.crop(frame_box).convert("RGBA"))

        for x_start, y_start, x_end, y_end in cleanup_boxes.get(frame_index, ()):
            frame_rgba = clear_dark_neutral_box(
                frame_rgba,
                x_start=x_start,
                y_start=y_start,
                x_end=x_end,
                y_end=y_end,
                brightness_min=70 if frame_index >= 3 else 0,
                brightness_max=150,
                saturation_max=42,
            )

        if frame_index in {0, 1, 2}:
            frame_rgba = clear_dark_neutral_box(
                frame_rgba,
                x_start=18,
                y_start=56,
                x_end=54,
                y_end=60,
                brightness_min=70,
                brightness_max=180,
                saturation_max=30,
            )
        elif frame_index in {3, 4}:
            frame_rgba = clear_dark_neutral_box(
                frame_rgba,
                x_start=28,
                y_start=45,
                x_end=49,
                y_end=60,
                brightness_min=70,
                brightness_max=180,
                saturation_max=40,
            )
        else:
            frame_rgba = clear_dark_neutral_box(
                frame_rgba,
                x_start=24,
                y_start=46,
                x_end=48,
                y_end=60,
                brightness_min=70,
                brightness_max=180,
                saturation_max=40,
            )

        cleaned_strip.paste(Image.fromarray(frame_rgba, "RGBA"), (frame_index * FRAME_SIZE, 0))

    return cleaned_strip


def normalize_even_spacing(
    start: float,
    step: float,
    frame_count: int,
    region_width: int,
) -> list[float]:
    if frame_count == 1:
        return [min(max(start, 0.0), float(region_width))]

    max_step = max(18.0, (region_width * 0.96) / frame_count)
    step = min(max(step, 18.0), max_step)
    min_center = step * 0.5
    max_start = max(min_center, region_width - step * (frame_count - 0.5))
    start = min(max(start, min_center), max_start)
    return [start + step * index for index in range(frame_count)]


def estimate_frame_centers(
    components: list[MaskComponent],
    frame_count: int,
    region_width: int,
) -> list[float]:
    if frame_count <= 0:
        raise RuntimeError("Frame count must be positive.")

    if not components:
        step = region_width / frame_count
        return [step * (index + 0.5) for index in range(frame_count)]

    max_area = max(component.area for component in components)
    significant_components = [
        component
        for component in components
        if component.area >= max(20, int(max_area * 0.012))
    ]
    major_components = [
        component
        for component in significant_components
        if not component.touches_border and component.area >= max(220, int(max_area * 0.48))
    ]

    if len(major_components) < 2:
        major_components = [
            component
            for component in significant_components
            if not component.touches_border and component.area >= max(120, int(max_area * 0.18))
        ]

    non_border_components = [component for component in significant_components if not component.touches_border]
    candidate_components = major_components or non_border_components or significant_components
    ordered_centers = sorted(component.center_x for component in candidate_components)
    deduped_centers: list[float] = []
    minimum_gap = max(18.0, region_width / max(frame_count * 2.8, 1))

    for center in ordered_centers:
        if not deduped_centers or center - deduped_centers[-1] >= minimum_gap:
            deduped_centers.append(center)
            continue

        deduped_centers[-1] = (deduped_centers[-1] + center) / 2

    if len(deduped_centers) >= frame_count:
        sampled_step = (deduped_centers[-1] - deduped_centers[0]) / max(frame_count - 1, 1)
        return normalize_even_spacing(deduped_centers[0], sampled_step, frame_count, region_width)

    if len(deduped_centers) >= 2:
        diffs = [
            right - left
            for left, right in zip(deduped_centers, deduped_centers[1:])
            if 14 <= right - left <= region_width / max(frame_count * 0.42, 1)
        ]
        step = float(median(diffs)) if diffs else region_width / frame_count
        start = float(median([center - step * index for index, center in enumerate(deduped_centers)]))
    else:
        step = region_width / frame_count
        start = deduped_centers[0] if deduped_centers else step * 0.5

    return normalize_even_spacing(start, step, frame_count, region_width)


def build_frame_windows(centers: list[float], region_width: int) -> list[tuple[int, int]]:
    if not centers:
        return []

    if len(centers) == 1:
        return [(0, region_width - 1)]

    step = float(median([right - left for left, right in zip(centers, centers[1:])]))
    windows: list[tuple[int, int]] = []

    for index, center in enumerate(centers):
        if index == 0:
            left = int(round(center - step * 0.58))
        else:
            left = int(round((centers[index - 1] + center) / 2 - step * 0.04))

        if index == len(centers) - 1:
            right = int(round(center + step * 0.58))
        else:
            right = int(round((center + centers[index + 1]) / 2 + step * 0.04))

        left = max(0, left)
        right = min(region_width - 1, max(left + 1, right))
        windows.append((left, right))

    return windows


def extract_frames_from_region(
    image: Image.Image,
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    frame_count: int,
    clip_id: str | None = None,
    suppress_presentation_artifacts: bool = False,
    prefer_component_center_windows: bool = False,
) -> list[ExtractedFrame]:
    row_region = remove_border_palette_background(
        remove_checkerboard_background(image.crop((x_start, y_start, x_end, y_end)))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    frames: list[ExtractedFrame] = []
    previous_frame: ExtractedFrame | None = None
    region_width = row_rgba.shape[1]
    row_mask = row_rgba[:, :, 3] > 0
    analysis_source_mask = build_clip_analysis_mask(clip_id, row_rgba) if suppress_presentation_artifacts else row_mask
    if suppress_presentation_artifacts:
        analysis_source_mask = suppress_presentation_frame_components(analysis_source_mask)
        analysis_source_mask = suppress_showcase_outlier_component(analysis_source_mask)
        analysis_source_mask = suppress_row_ground_strip_components(analysis_source_mask)
    analysis_mask = analysis_source_mask.copy()
    if analysis_mask.shape[0] > 24:
        analysis_mask[:12, :] = False
        analysis_mask[-14:, :] = False
    frame_windows: list[tuple[int, int]] | None = None

    if prefer_component_center_windows:
        _, components = label_connected_components(row_mask)
        centers = estimate_frame_centers(components, frame_count, region_width)
        frame_windows = build_frame_windows(centers, region_width)

    if not frame_windows:
        frame_windows = detect_frame_intervals(analysis_mask, frame_count)

    if frame_windows is not None and not frame_intervals_are_reliable(frame_windows, frame_count, region_width):
        frame_windows = None

    if frame_windows is None:
        active_bounds = compute_active_horizontal_bounds(analysis_mask)
        if active_bounds is None:
            active_left = 0
            active_right = region_width
        else:
            active_left, active_right = active_bounds
        frame_windows = []
        for index in range(frame_count):
            left = int(round(active_left + ((active_right - active_left) * index / frame_count)))
            right = int(round(active_left + ((active_right - active_left) * (index + 1) / frame_count))) - 1
            frame_windows.append((left, max(left + 1, right)))

    for cell_left, cell_right_inclusive in frame_windows:
        cell_right = max(cell_left + 1, cell_right_inclusive + 1)
        cell_rgba = row_rgba[:, cell_left:cell_right].copy()
        cell_alpha = cell_rgba[:, :, 3] > 0
        analysis_cell_mask = analysis_source_mask[:, cell_left:cell_right].copy()
        if analysis_cell_mask.shape[0] > 24:
            analysis_cell_mask[:12, :] = False
            analysis_cell_mask[-14:, :] = False
        filtered_mask = filter_frame_mask_components(analysis_cell_mask)
        filtered_mask = refine_primary_frame_mask(filtered_mask)
        coords = np.argwhere(filtered_mask)
        selected_mask = filtered_mask

        if coords.size == 0:
            filtered_mask = filter_frame_mask_components(cell_alpha)
            filtered_mask = refine_primary_frame_mask(filtered_mask)
            coords = np.argwhere(filtered_mask)
            selected_mask = filtered_mask

        if coords.size == 0:
            if previous_frame is not None:
                frames.append(
                    ExtractedFrame(
                        image=previous_frame.image.copy(),
                        anchor_x=previous_frame.anchor_x,
                        anchor_y=previous_frame.anchor_y,
                    )
                )
                continue

            empty = Image.new("RGBA", (24, 24), (0, 0, 0, 0))
            frames.append(ExtractedFrame(image=empty, anchor_x=12.0, anchor_y=23.0))
            continue

        padding = 6
        min_y = max(0, int(coords[:, 0].min()) - padding)
        max_y = min(cell_rgba.shape[0] - 1, int(coords[:, 0].max()) + padding)
        min_x = max(0, int(coords[:, 1].min()) - padding)
        max_x = min(cell_rgba.shape[1] - 1, int(coords[:, 1].max()) + padding)
        crop_rgba = cell_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        crop_mask = selected_mask[min_y : max_y + 1, min_x : max_x + 1]
        crop_rgba[:, :, 3] = np.where(crop_mask, crop_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(crop_mask)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frame_image = Image.fromarray(crop_rgba)
        extracted_frame = ExtractedFrame(image=frame_image, anchor_x=anchor_x, anchor_y=anchor_y)
        frames.append(extracted_frame)
        previous_frame = extracted_frame

    return frames


def extract_frames_from_region_direct_grid(
    image: Image.Image,
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    frame_count: int,
    clip_id: str | None = None,
    suppress_presentation_artifacts: bool = False,
) -> list[ExtractedFrame]:
    row_region = remove_border_palette_background(
        remove_checkerboard_background(image.crop((x_start, y_start, x_end, y_end)))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    region_width = row_rgba.shape[1]
    frames: list[ExtractedFrame] = []
    previous_frame: ExtractedFrame | None = None

    for index in range(frame_count):
        cell_width = region_width / max(frame_count, 1)
        margin = max(10, int(round(cell_width * 0.22)))
        nominal_left = int(round(region_width * index / frame_count))
        nominal_right = int(round(region_width * (index + 1) / frame_count))
        search_left = max(0, nominal_left - margin)
        search_right = min(region_width, max(nominal_right + margin, nominal_left + 1))
        search_rgba = row_rgba[:, search_left:search_right].copy()

        if search_rgba.size == 0:
            continue

        analysis_rgba = search_rgba.copy()
        label_trim_height = min(26, max(12, analysis_rgba.shape[0] // 5))
        analysis_rgba[-label_trim_height:, :, 3] = 0
        analysis_mask = (
            build_clip_analysis_mask(clip_id, analysis_rgba)
            if suppress_presentation_artifacts and clip_id is not None
            else (analysis_rgba[:, :, 3] > 0)
        )
        if suppress_presentation_artifacts:
            analysis_mask = suppress_presentation_frame_components(analysis_mask)
            analysis_mask = suppress_showcase_outlier_component(analysis_mask)
            analysis_mask = suppress_row_ground_strip_components(analysis_mask)

        labels, components = label_connected_components(analysis_mask)
        filtered_components: list[MaskComponent] = []
        for component in components:
            width = component.max_x - component.min_x + 1
            height = component.max_y - component.min_y + 1
            if component.area < 120 or width < 10 or height < 14:
                continue
            filtered_components.append(component)

        selected_mask = analysis_mask
        if filtered_components:
            target_center_x = ((nominal_left + nominal_right) / 2.0) - search_left

            def score_component(component: MaskComponent) -> float:
                width = component.max_x - component.min_x + 1
                height = component.max_y - component.min_y + 1
                bbox_area = max(width * height, 1)
                density = component.area / bbox_area
                distance_penalty = abs(component.center_x - target_center_x) * 16.0
                edge_penalty = 120.0 if component.touches_border else 0.0
                return float(component.area) + density * 180.0 - distance_penalty - edge_penalty

            primary = max(filtered_components, key=score_component)
            keep_indices = {primary.index}
            primary_width = primary.max_x - primary.min_x + 1
            primary_height = primary.max_y - primary.min_y + 1

            for component in filtered_components:
                if component.index == primary.index:
                    continue

                gap_x = max(
                    0,
                    max(primary.min_x - component.max_x, component.min_x - primary.max_x),
                )
                gap_y = max(
                    0,
                    max(primary.min_y - component.max_y, component.min_y - primary.max_y),
                )
                area_ratio = component.area / max(1, primary.area)
                if (
                    area_ratio >= 0.04
                    and gap_x <= max(12, int(primary_width * 0.5))
                    and gap_y <= max(16, int(primary_height * 0.5))
                ):
                    keep_indices.add(component.index)

            selected_mask = np.isin(labels, list(keep_indices))

        if not selected_mask.any():
            selected_mask = analysis_rgba[:, :, 3] > 0

        coords = np.argwhere(selected_mask)
        if coords.size == 0:
            if previous_frame is not None:
                frames.append(
                    ExtractedFrame(
                        image=previous_frame.image.copy(),
                        anchor_x=previous_frame.anchor_x,
                        anchor_y=previous_frame.anchor_y,
                    )
                )
            continue

        min_y = max(0, int(coords[:, 0].min()) - 3)
        max_y = min(search_rgba.shape[0] - 1, int(coords[:, 0].max()) + 3)
        min_x = max(0, int(coords[:, 1].min()) - 3)
        max_x = min(search_rgba.shape[1] - 1, int(coords[:, 1].max()) + 3)
        frame_rgba = search_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        frame_mask = selected_mask[min_y : max_y + 1, min_x : max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        extracted_frame = ExtractedFrame(
            image=Image.fromarray(frame_rgba),
            anchor_x=anchor_x,
            anchor_y=anchor_y,
        )
        frames.append(extracted_frame)
        previous_frame = extracted_frame

    return frames


def extract_frames_from_region_isolated_grid(
    image: Image.Image,
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    frame_count: int,
    clip_id: str | None = None,
    suppress_presentation_artifacts: bool = False,
) -> list[ExtractedFrame]:
    row_region = remove_border_palette_background(
        remove_checkerboard_background(image.crop((x_start, y_start, x_end, y_end)))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    region_height, region_width = row_rgba.shape[:2]
    frames: list[ExtractedFrame] = []
    previous_frame: ExtractedFrame | None = None

    for index in range(frame_count):
        cell_width = region_width / max(frame_count, 1)
        margin = max(8, int(round(cell_width * 0.14)))
        nominal_left = int(round(region_width * index / frame_count))
        nominal_right = int(round(region_width * (index + 1) / frame_count))
        search_left = max(0, nominal_left - margin)
        search_right = min(region_width, max(nominal_right + margin, nominal_left + 1))
        search_rgba = row_rgba[:, search_left:search_right].copy()

        if search_rgba.size == 0:
            continue

        analysis_rgba = search_rgba.copy()
        label_trim_height = min(30, max(14, analysis_rgba.shape[0] // 4))
        analysis_rgba[-label_trim_height:, :, 3] = 0
        analysis_mask = (
            build_clip_analysis_mask(clip_id, analysis_rgba)
            if suppress_presentation_artifacts and clip_id is not None
            else (analysis_rgba[:, :, 3] > 0)
        )
        if suppress_presentation_artifacts:
            analysis_mask = suppress_presentation_frame_components(analysis_mask)
            analysis_mask = suppress_showcase_outlier_component(analysis_mask)
            analysis_mask = suppress_row_ground_strip_components(analysis_mask)

        labels, components = label_connected_components(analysis_mask)
        filtered_components: list[MaskComponent] = []
        minimum_height = max(12, int(round(analysis_rgba.shape[0] * 0.18)))
        minimum_width = max(8, int(round(cell_width * 0.12)))
        minimum_area = max(80, int(round(cell_width * 0.9)))

        for component in components:
            width = component.max_x - component.min_x + 1
            height = component.max_y - component.min_y + 1
            if component.area < minimum_area or width < minimum_width or height < minimum_height:
                continue
            filtered_components.append(component)

        selected_mask = analysis_mask
        if filtered_components:
            target_center_x = ((nominal_left + nominal_right) / 2.0) - search_left

            def score_component(component: MaskComponent) -> float:
                width = component.max_x - component.min_x + 1
                height = component.max_y - component.min_y + 1
                bbox_area = max(width * height, 1)
                density = component.area / bbox_area
                distance_penalty = abs(component.center_x - target_center_x) * 24.0
                border_penalty = 260.0 if component.touches_border else 0.0
                width_penalty = max(0.0, width - (cell_width * 0.95)) * 16.0
                return float(component.area) + (height * 20.0) + (density * 180.0) - distance_penalty - border_penalty - width_penalty

            primary = max(filtered_components, key=score_component)
            non_border_candidates = [component for component in filtered_components if not component.touches_border]
            if primary.touches_border and non_border_candidates:
                safer_primary = max(non_border_candidates, key=score_component)
                if score_component(safer_primary) >= score_component(primary) * 0.72:
                    primary = safer_primary

            keep_indices = {primary.index}
            primary_width = primary.max_x - primary.min_x + 1
            primary_height = primary.max_y - primary.min_y + 1

            for component in filtered_components:
                if component.index == primary.index:
                    continue

                gap_x = max(
                    0,
                    max(primary.min_x - component.max_x, component.min_x - primary.max_x),
                )
                gap_y = max(
                    0,
                    max(primary.min_y - component.max_y, component.min_y - primary.max_y),
                )
                area_ratio = component.area / max(1, primary.area)
                center_distance = abs(component.center_x - primary.center_x)
                if (
                    area_ratio >= 0.025
                    and center_distance <= max(16, int(round(cell_width * 0.34)))
                    and gap_x <= max(14, int(primary_width * 0.65))
                    and gap_y <= max(18, int(primary_height * 0.45))
                ):
                    keep_indices.add(component.index)

            selected_mask = np.isin(labels, list(keep_indices))

        if not selected_mask.any():
            selected_mask = analysis_rgba[:, :, 3] > 0

        coords = np.argwhere(selected_mask)
        if coords.size == 0:
            if previous_frame is not None:
                frames.append(
                    ExtractedFrame(
                        image=previous_frame.image.copy(),
                        anchor_x=previous_frame.anchor_x,
                        anchor_y=previous_frame.anchor_y,
                    )
                )
            continue

        min_y = max(0, int(coords[:, 0].min()) - 4)
        max_y = min(search_rgba.shape[0] - 1, int(coords[:, 0].max()) + 4)
        min_x = max(0, int(coords[:, 1].min()) - 4)
        max_x = min(search_rgba.shape[1] - 1, int(coords[:, 1].max()) + 4)

        frame_rgba = search_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        frame_mask = selected_mask[min_y : max_y + 1, min_x : max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        extracted_frame = ExtractedFrame(
            image=Image.fromarray(frame_rgba),
            anchor_x=anchor_x,
            anchor_y=anchor_y,
        )
        frames.append(extracted_frame)
        previous_frame = extracted_frame

    return frames


def extract_frames_from_manual_spec(
    image: Image.Image,
    spec: ManualClipExtractionSpec,
    x_start: int = 190,
    x_end: int | None = None,
    clip_id: str | None = None,
    suppress_presentation_artifacts: bool = False,
) -> list[ExtractedFrame]:
    if x_end is None:
        x_end = image.size[0]

    row_region = remove_border_palette_background(
        remove_checkerboard_background(image.crop((x_start, spec.y_start, x_end, spec.y_end)))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    row_mask = row_rgba[:, :, 3] > 0
    analysis_mask = build_clip_analysis_mask(clip_id, row_rgba) if suppress_presentation_artifacts else row_mask
    if suppress_presentation_artifacts:
        analysis_mask = suppress_presentation_frame_components(analysis_mask)
        analysis_mask = suppress_showcase_outlier_component(analysis_mask)
        analysis_mask = suppress_row_ground_strip_components(analysis_mask)
    components = [
        (min_x, min_y, max_x, max_y, area)
        for min_x, min_y, max_x, max_y, area in connected_components(analysis_mask)
        if area >= 300 and (max_x - min_x + 1) >= 25 and (max_y - min_y + 1) >= 25
    ]
    components.sort(key=lambda entry: entry[0])

    frames: list[ExtractedFrame] = []

    for frame_source in spec.frames:
        if frame_source.component_index >= len(components):
            raise RuntimeError(
                f"Manual extraction for hero exceeded detected component count in band {spec.y_start}-{spec.y_end}.",
            )

        component_left, component_top, component_right, component_bottom, _ = components[frame_source.component_index]
        component_width = component_right - component_left + 1

        if frame_source.split_total > 1:
            part_left = component_left + int(round(component_width * (frame_source.split_part / frame_source.split_total)))
            part_right = component_left + int(round(component_width * ((frame_source.split_part + 1) / frame_source.split_total))) - 1
            part_left = max(component_left, min(part_left, component_right))
            part_right = max(part_left, min(component_right, part_right))
        else:
            part_left = component_left
            part_right = component_right

        padding = 6
        min_y = max(0, component_top - padding)
        max_y = min(row_rgba.shape[0] - 1, component_bottom + padding)
        min_x = max(0, part_left - padding)
        max_x = min(row_rgba.shape[1] - 1, part_right + padding)
        crop_rgba = row_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        crop_analysis_mask = analysis_mask[min_y : max_y + 1, min_x : max_x + 1]
        crop_mask = crop_rgba[:, :, 3] > 0
        filtered_mask = filter_frame_mask_components(crop_analysis_mask)
        coords = np.argwhere(filtered_mask)

        if coords.size == 0:
            filtered_mask = filter_frame_mask_components(crop_mask)
            coords = np.argwhere(filtered_mask)

        if coords.size == 0:
            continue

        tight_min_y = max(0, int(coords[:, 0].min()) - 2)
        tight_max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        tight_min_x = max(0, int(coords[:, 1].min()) - 2)
        tight_max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = crop_rgba[tight_min_y : tight_max_y + 1, tight_min_x : tight_max_x + 1].copy()
        frame_mask = filtered_mask[tight_min_y : tight_max_y + 1, tight_min_x : tight_max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_mask)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
        final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(final_coords)
        frames.append(
            ExtractedFrame(
                image=Image.fromarray(frame_rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            ),
        )

    return frames


def extract_frames_from_region_manual_spec(
    image: Image.Image,
    spec: RegionManualClipExtractionSpec,
    clip_id: str | None = None,
    suppress_presentation_artifacts: bool = False,
) -> list[ExtractedFrame]:
    row_region = remove_border_palette_background(
        remove_checkerboard_background(image.crop((spec.x_start, spec.y_start, spec.x_end, spec.y_end)))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    analysis_mask = build_manual_analysis_mask(
        clip_id=clip_id,
        rgba=row_rgba,
        use_alpha_analysis=spec.use_alpha_analysis,
        suppress_presentation_artifacts=suppress_presentation_artifacts,
    )
    components = [
        (min_x, min_y, max_x, max_y, area)
        for min_x, min_y, max_x, max_y, area in connected_components(analysis_mask)
        if area >= 80 and (max_x - min_x + 1) >= 10 and (max_y - min_y + 1) >= 6
    ]
    components.sort(key=lambda entry: entry[0])

    frames: list[ExtractedFrame] = []

    for frame_source in spec.frames:
        if frame_source.component_index >= len(components):
            raise RuntimeError(
                f"Manual region extraction exceeded component count for clip {clip_id or 'unknown'} "
                f"in region {spec.x_start}:{spec.x_end},{spec.y_start}:{spec.y_end}.",
            )

        component_left, component_top, component_right, component_bottom, _ = components[frame_source.component_index]
        component_width = component_right - component_left + 1

        if frame_source.split_total > 1:
            part_left = component_left + int(round(component_width * (frame_source.split_part / frame_source.split_total)))
            part_right = component_left + int(round(component_width * ((frame_source.split_part + 1) / frame_source.split_total))) - 1
            part_left = max(component_left, min(part_left, component_right))
            part_right = max(part_left, min(component_right, part_right))
        else:
            part_left = component_left
            part_right = component_right

        padding = 6
        min_y = max(0, component_top - padding)
        max_y = min(row_rgba.shape[0] - 1, component_bottom + padding)
        min_x = max(0, part_left - padding)
        max_x = min(row_rgba.shape[1] - 1, part_right + padding)
        crop_rgba = row_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        crop_mask = crop_rgba[:, :, 3] > 0
        filtered_mask = filter_frame_mask_components(crop_mask)
        filtered_mask = refine_primary_frame_mask(filtered_mask)
        coords = np.argwhere(filtered_mask)

        if coords.size == 0:
            coords = np.argwhere(crop_mask)

        if coords.size == 0:
            continue

        tight_min_y = max(0, int(coords[:, 0].min()) - 2)
        tight_max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        tight_min_x = max(0, int(coords[:, 1].min()) - 2)
        tight_max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = crop_rgba[tight_min_y : tight_max_y + 1, tight_min_x : tight_max_x + 1].copy()
        frame_mask = filtered_mask[tight_min_y : tight_max_y + 1, tight_min_x : tight_max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_mask)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
        final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(final_coords)
        frames.append(
            ExtractedFrame(
                image=Image.fromarray(frame_rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            ),
        )

    return frames


def cleanup_character_frame_artifacts(frame_rgba: np.ndarray, anchor_x: float) -> np.ndarray:
    cleaned = frame_rgba.copy()
    alpha_mask = cleaned[:, :, 3] > 0

    if not alpha_mask.any():
        return cleaned

    cleaned = remove_border_connected_palette_background_rgba(
        cleaned,
        distance_threshold=18,
        brightness_min=168,
        saturation_max=32,
    )
    alpha_mask = cleaned[:, :, 3] > 0

    if not alpha_mask.any():
        return cleaned

    rgb = cleaned[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    height, width = alpha_mask.shape
    bright_neutral_mask = alpha_mask & (brightness >= 165) & (saturation <= 75)
    ground_cleanup_mask = np.zeros_like(alpha_mask)

    for min_x, min_y, max_x, max_y, area in connected_components(bright_neutral_mask):
        component_height = max_y - min_y + 1
        component_width = max_x - min_x + 1
        near_ground = min_y >= int(height * 0.72)
        flat_strip = component_height <= max(10, int(height * 0.16))
        compact_area = area <= 320
        wide_enough = component_width >= 5

        if near_ground and flat_strip and compact_area and wide_enough:
            ground_cleanup_mask[min_y : max_y + 1, min_x : max_x + 1] |= bright_neutral_mask[
                min_y : max_y + 1,
                min_x : max_x + 1,
            ]

    cleaned[ground_cleanup_mask, 3] = 0
    alpha_mask = cleaned[:, :, 3] > 0
    labels, components = label_connected_components(alpha_mask)

    if not components:
        return cleaned

    main_component = max(components, key=lambda component: component.area)
    main_width = main_component.max_x - main_component.min_x + 1
    main_height = main_component.max_y - main_component.min_y + 1
    for component in components:
        if component.index == main_component.index:
            continue

        component_width = component.max_x - component.min_x + 1
        component_height = component.max_y - component.min_y + 1
        is_tiny = component.area <= 6
        is_edge_strip = (
            component_width <= 6
            and component_height >= max(18, int(main_height * 0.6))
            and component.area <= max(48, int(main_component.area * 0.18))
            and (
                component.max_x < main_component.min_x
                or component.min_x > main_component.max_x
                or component.min_x <= 8
                or component.max_x >= width - 9
            )
        )
        is_top_label_scrap = (
            component.min_y <= 4
            and component_height <= max(8, int(main_height * 0.18))
            and component_width >= 4
            and component.area <= max(128, int(main_component.area * 0.3))
        )

        if is_tiny or is_edge_strip or is_top_label_scrap:
            cleaned[labels == component.index, 3] = 0

    alpha_mask = cleaned[:, :, 3] > 0
    hole_labels, hole_components = label_connected_components(~alpha_mask)
    for component in hole_components:
        if component.touches_border:
            continue
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        if component.area <= 48 and width <= 8 and height <= 8:
            cleaned = fill_transparent_component_from_neighbors(
                cleaned,
                hole_labels == component.index,
            )

    return cleaned


def cleanup_package_support_artifacts(frame: ExtractedFrame) -> ExtractedFrame:
    frame_rgba = np.array(frame.image.convert("RGBA"))
    frame_rgba = remove_border_connected_palette_background_rgba(frame_rgba)
    alpha_mask = frame_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return frame

    rgb = frame_rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    neutral_mask = alpha_mask & (saturation <= 34) & (brightness >= 70) & (brightness <= 190)
    labels, components = label_connected_components(neutral_mask)
    height, width = alpha_mask.shape
    total_alpha_area = int(alpha_mask.sum())

    for component in components:
        component_width = component.max_x - component.min_x + 1
        component_height = component.max_y - component.min_y + 1
        area_limit = max(140, int(total_alpha_area * 0.22))
        is_bottom_plate = (
            component.min_y >= int(height * 0.72)
            and component_height <= max(10, int(height * 0.16))
            and component_width >= max(10, int(width * 0.12))
            and component.area <= area_limit
        )
        is_border_panel = (
            component.touches_border
            and component_width <= max(10, int(width * 0.16))
            and component_height >= max(18, int(height * 0.35))
            and component.area <= area_limit
            and (component.min_y <= int(height * 0.25) or component.max_y >= int(height * 0.75))
        )
        if is_bottom_plate or is_border_panel:
            frame_rgba[labels == component.index, 3] = 0

    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    if final_coords.size == 0:
        return frame

    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    frame_rgba = cleanup_package_lower_shadow_and_leg_gaps(frame_rgba)
    frame_rgba = remove_border_connected_palette_background_rgba(frame_rgba)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return trim_extracted_frame_to_alpha(
        ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y),
        padding=2,
    )


def trim_extracted_frame_to_alpha(frame: ExtractedFrame, padding: int = 0) -> ExtractedFrame:
    rgba = np.array(frame.image.convert("RGBA"))
    coords = np.argwhere(rgba[:, :, 3] > 0)

    if coords.size == 0:
        return frame

    min_y = max(0, int(coords[:, 0].min()) - padding)
    max_y = min(rgba.shape[0] - 1, int(coords[:, 0].max()) + padding)
    min_x = max(0, int(coords[:, 1].min()) - padding)
    max_x = min(rgba.shape[1] - 1, int(coords[:, 1].max()) + padding)
    trimmed = rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    return ExtractedFrame(
        image=Image.fromarray(trimmed),
        anchor_x=frame.anchor_x - min_x,
        anchor_y=frame.anchor_y - min_y,
    )


def cleanup_package_lower_shadow_and_leg_gaps(frame_rgba: np.ndarray) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return frame_rgba

    rgb = frame_rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    coords = np.argwhere(alpha_mask)
    min_y = int(coords[:, 0].min())
    max_y = int(coords[:, 0].max())
    # Keep this cleanup strictly in the lower-leg / foot zone.
    # Package extracts can still carry tall transparent padding, so a shallower cutoff
    # will damage shoulder armor and chest highlights.
    lower_start = int(round(min_y + (max_y - min_y) * 0.74))
    lower_band = np.arange(frame_rgba.shape[0])[:, None] >= lower_start
    dark_body_mask = alpha_mask & ((saturation >= 18) | (brightness <= 118))
    neutral_lower_mask = (
        alpha_mask
        & lower_band
        & (saturation <= 26)
        & (brightness >= 92)
        & (brightness <= 190)
    )
    height, width = alpha_mask.shape

    # Open leg gaps when the package card shadow bridges the lower body.
    for y in range(lower_start, height):
        body_columns = np.flatnonzero(dark_body_mask[y])
        if body_columns.size < 2:
            continue

        split_points = np.where(np.diff(body_columns) > 1)[0]
        if split_points.size == 0:
            continue

        runs: list[tuple[int, int]] = []
        run_start = int(body_columns[0])
        for split_index in split_points:
            runs.append((run_start, int(body_columns[split_index])))
            run_start = int(body_columns[split_index + 1])
        runs.append((run_start, int(body_columns[-1])))

        if len(runs) < 2:
            continue

        gap_left = runs[0][1] + 1
        gap_right = runs[-1][0]
        gap_width = gap_right - gap_left

        if gap_width <= 1 or gap_width > 18:
            continue

        gap_mask = neutral_lower_mask[y, gap_left:gap_right]
        if gap_mask.any():
            frame_rgba[y, gap_left:gap_right][gap_mask, 3] = 0

    # Remove neutral lower shadows that sit below the actual leg support.
    row_indices = np.arange(height)
    for x in range(width):
        support_rows = np.flatnonzero(dark_body_mask[:, x])
        if support_rows.size:
            cutoff = int(support_rows.max()) + 1
            remove_mask = neutral_lower_mask[:, x] & (row_indices > cutoff)
        else:
            remove_mask = neutral_lower_mask[:, x]

        if remove_mask.any():
            frame_rgba[remove_mask, x, 3] = 0

    return frame_rgba


def cleanup_package_bottom_shadow_only(frame: ExtractedFrame) -> ExtractedFrame:
    frame_rgba = np.array(frame.image.convert("RGBA"))
    alpha_mask = frame_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return frame

    rgb = frame_rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    labels, components = label_connected_components(alpha_mask)
    height, width = alpha_mask.shape

    for component in components:
        component_width = component.max_x - component.min_x + 1
        component_height = component.max_y - component.min_y + 1
        component_mask = labels == component.index
        component_brightness = float(np.mean(brightness[component_mask])) if component_mask.any() else 0.0
        component_saturation = float(np.mean(saturation[component_mask])) if component_mask.any() else 0.0
        is_bottom_shadow = (
            component.touches_border
            and component.max_y >= height - 2
            and component.min_y >= int(height * 0.82)
            and component_height <= max(7, int(height * 0.12))
            and component_width >= max(10, int(width * 0.18))
            and component_saturation <= 20.0
            and 80.0 <= component_brightness <= 180.0
        )

        if is_bottom_shadow:
            frame_rgba[component_mask, 3] = 0

    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_hero_talk_package_frames(
    package_image: Image.Image,
    source_boxes: tuple[tuple[int, int, int, int], ...],
    target_count: int,
) -> list[ExtractedFrame]:
    if rembg_remove is not None:
        rembg_frames = extract_hero_talk_package_frames_rembg(package_image, target_count)
        if rembg_frames:
            return rembg_frames

    if cv2 is not None:
        recut_frames = extract_hero_talk_package_frames_grabcut(package_image, target_count)
        if recut_frames:
            return recut_frames

    frames: list[ExtractedFrame] = []

    for source_box in source_boxes:
        frame = extract_frame_from_package_source_box(package_image, source_box, expand_source_box=False)
        frame = trim_extracted_frame_to_alpha(frame, padding=2)
        frame = cleanup_package_bottom_shadow_only(frame)
        frame = trim_extracted_frame_to_alpha(frame, padding=2)
        frames.append(frame)

    frames = resample_frames_to_count(frames, target_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_visual_core(frames, band_start_ratio=0.42, band_end_ratio=0.82)
    frames = stabilize_character_clip_feet(frames)
    return frames


def extract_hero_talk_package_frames_rembg(
    package_image: Image.Image,
    target_count: int,
) -> list[ExtractedFrame]:
    if rembg_remove is None:
        return []

    frames: list[ExtractedFrame] = []

    for source_box in HERO_TALK_PACKAGE_RECLIP_SOURCE_BOXES:
        cut = rembg_remove(package_image.crop(source_box)).convert("RGBA")
        rgba = np.array(cut)
        alpha = rgba[:, :, 3]
        black_residue = (
            (rgba[:, :, 0] <= 8)
            & (rgba[:, :, 1] <= 8)
            & (rgba[:, :, 2] <= 8)
            & (alpha <= 16)
        )
        rgba[black_residue, 3] = 0
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            continue

        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        trimmed = rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        trimmed[:, :, 3] = np.where(trimmed[:, :, 3] >= 24, trimmed[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(trimmed[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frames.append(
            ExtractedFrame(
                image=Image.fromarray(trimmed, "RGBA"),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            ),
        )

    if not frames:
        return []

    frames = resample_frames_to_count(frames, target_count)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_visual_core(frames, band_start_ratio=0.42, band_end_ratio=0.82)
    frames = stabilize_character_clip_feet(frames)
    return frames


def extract_hero_talk_package_frames_grabcut(
    package_image: Image.Image,
    target_count: int,
) -> list[ExtractedFrame]:
    if cv2 is None:
        return []

    source_rgb = np.array(package_image.convert("RGB"))
    frames: list[ExtractedFrame] = []

    for source_box in HERO_TALK_PACKAGE_RECLIP_SOURCE_BOXES:
        x_start, y_start, x_end, y_end = source_box
        crop = source_rgb[y_start:y_end, x_start:x_end].copy()
        if crop.size == 0:
            continue

        mask = np.zeros(crop.shape[:2], np.uint8)
        background_model = np.zeros((1, 65), np.float64)
        foreground_model = np.zeros((1, 65), np.float64)
        rect = (4, 4, max(1, crop.shape[1] - 8), max(1, crop.shape[0] - 8))

        cv2.grabCut(
            crop,
            mask,
            rect,
            background_model,
            foreground_model,
            5,
            cv2.GC_INIT_WITH_RECT,
        )

        alpha = np.where((mask == cv2.GC_BGD) | (mask == cv2.GC_PR_BGD), 0, 255).astype(np.uint8)
        rgba = np.dstack([crop, alpha])
        coords = np.argwhere(alpha > 0)

        if coords.size == 0:
            continue

        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        trimmed = rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        frame_coords = np.argwhere(trimmed[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frames.append(
            ExtractedFrame(
                image=Image.fromarray(trimmed, "RGBA"),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            ),
        )

    if not frames:
        return []

    frames = resample_frames_to_count(frames, target_count)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_visual_core(frames, band_start_ratio=0.42, band_end_ratio=0.82)
    frames = stabilize_character_clip_feet(frames)
    return frames


def extract_package_frames_from_source_boxes_rembg(
    package_image: Image.Image,
    source_boxes: tuple[tuple[int, int, int, int], ...],
    target_count: int,
) -> list[ExtractedFrame]:
    if rembg_remove is None:
        return []

    frames: list[ExtractedFrame] = []

    for source_box in source_boxes:
        cut = rembg_remove(package_image.crop(source_box)).convert("RGBA")
        rgba = np.array(cut)
        alpha = rgba[:, :, 3]
        black_residue = (
            (rgba[:, :, 0] <= 8)
            & (rgba[:, :, 1] <= 8)
            & (rgba[:, :, 2] <= 8)
            & (alpha <= 16)
        )
        rgba[black_residue, 3] = 0
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            continue

        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        trimmed = rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        trimmed[:, :, 3] = np.where(trimmed[:, :, 3] >= 24, trimmed[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(trimmed[:, :, 3] > 0)
        if frame_coords.size == 0:
            continue
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frames.append(
            ExtractedFrame(
                image=Image.fromarray(trimmed, "RGBA"),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            ),
        )

    if not frames:
        return []

    frames = resample_frames_to_count(frames, target_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
    frames = stabilize_character_clip_frames(frames)
    return frames


def suppress_presentation_frame_components(alpha_mask: np.ndarray) -> np.ndarray:
    labels, components = label_connected_components(alpha_mask)

    if not components:
        return alpha_mask

    cleaned_mask = alpha_mask.copy()
    region_height, region_width = alpha_mask.shape

    for component in components:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        bbox_area = max(1, width * height)
        density = component.area / bbox_area
        touches_side = component.min_x <= 1 or component.max_x >= region_width - 2
        wide = width >= int(region_width * 0.55)
        flat = height <= max(16, int(region_height * 0.22))
        full_height = height >= int(region_height * 0.68)
        sparse = density <= 0.34

        if wide and sparse and (touches_side or flat or full_height):
            cleaned_mask[labels == component.index] = False

    return cleaned_mask


def suppress_showcase_outlier_component(alpha_mask: np.ndarray) -> np.ndarray:
    labels, components = label_connected_components(alpha_mask)

    if len(components) < 4:
        return alpha_mask

    cleaned_mask = alpha_mask.copy()
    region_height, region_width = alpha_mask.shape
    large_components = [component for component in components if component.area >= 80]

    if len(large_components) < 4:
        return alpha_mask

    largest = max(large_components, key=lambda component: component.area)
    others = [component for component in large_components if component.index != largest.index]

    if len(others) < 3:
        return alpha_mask

    other_areas = np.array([component.area for component in others], dtype=np.float32)
    other_widths = np.array([(component.max_x - component.min_x + 1) for component in others], dtype=np.float32)
    other_heights = np.array([(component.max_y - component.min_y + 1) for component in others], dtype=np.float32)
    largest_width = largest.max_x - largest.min_x + 1
    largest_height = largest.max_y - largest.min_y + 1
    center_x = (largest.min_x + largest.max_x) / 2
    touches_edge = largest.min_x <= 1 or largest.max_x >= region_width - 2
    near_edge = center_x <= region_width * 0.28 or center_x >= region_width * 0.72
    median_other_area = float(np.median(other_areas))
    median_other_width = float(np.median(other_widths))
    dominates_area = largest.area >= max(2400, int(median_other_area * 2.6))
    strongly_dominates_area = largest.area >= max(3200, int(median_other_area * 4.0))
    dominates_width = largest_width >= max(72, int(median_other_width * 1.45))
    not_tall_poster = largest_height <= max(region_height - 6, int(float(np.median(other_heights)) * 2.4))

    if (dominates_area and dominates_width or strongly_dominates_area) and (touches_edge or near_edge) and not_tall_poster:
        cleaned_mask[labels == largest.index] = False

    return cleaned_mask


def suppress_row_ground_strip_components(alpha_mask: np.ndarray) -> np.ndarray:
    labels, components = label_connected_components(alpha_mask)

    if not components:
        return alpha_mask

    cleaned_mask = alpha_mask.copy()
    region_height, region_width = alpha_mask.shape

    for component in components:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        is_wide_lower_strip = (
            width >= int(region_width * 0.55)
            and height <= max(8, int(region_height * 0.1))
            and component.min_y >= int(region_height * 0.42)
        )

        if is_wide_lower_strip:
            cleaned_mask[labels == component.index] = False

    return cleaned_mask


def build_character_analysis_mask(rgba: np.ndarray) -> np.ndarray:
    row_mask = rgba[:, :, 3] > 0

    if not row_mask.any():
        return row_mask

    rgb = rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    candidate = row_mask & ((saturation >= 18) | (brightness <= 186))

    if int(candidate.sum()) < int(row_mask.sum() * 0.18):
        candidate = row_mask & ((saturation >= 12) | (brightness <= 206))

    return candidate


def build_clip_analysis_mask(clip_id: str | None, rgba: np.ndarray) -> np.ndarray:
    return build_character_analysis_mask(rgba)


def build_manual_analysis_mask(
    clip_id: str | None,
    rgba: np.ndarray,
    use_alpha_analysis: bool,
    suppress_presentation_artifacts: bool,
) -> np.ndarray:
    if use_alpha_analysis:
        analysis_mask = rgba[:, :, 3] > 0
    else:
        analysis_mask = build_clip_analysis_mask(clip_id, rgba)

    if suppress_presentation_artifacts:
        analysis_mask = suppress_presentation_frame_components(analysis_mask)
        analysis_mask = suppress_showcase_outlier_component(analysis_mask)
        analysis_mask = suppress_row_ground_strip_components(analysis_mask)

    return analysis_mask


def character_frames_are_plausible(frames: list[ExtractedFrame]) -> bool:
    if len(frames) < 2:
        return False

    alpha_areas: list[int] = []
    bbox_widths: list[int] = []
    bbox_heights: list[int] = []
    solid_frame_count = 0

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            alpha_areas.append(0)
            bbox_widths.append(0)
            bbox_heights.append(0)
            continue

        min_y = int(coords[:, 0].min())
        max_y = int(coords[:, 0].max())
        min_x = int(coords[:, 1].min())
        max_x = int(coords[:, 1].max())
        area = int(coords.shape[0])
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        alpha_areas.append(area)
        bbox_widths.append(width)
        bbox_heights.append(height)

        if area >= 180 and width >= 12 and height >= 18:
            solid_frame_count += 1

    if solid_frame_count < max(2, int(round(len(frames) * 0.55))):
        return False

    median_area = float(np.median(alpha_areas)) if alpha_areas else 0.0
    median_width = float(np.median(bbox_widths)) if bbox_widths else 0.0
    median_height = float(np.median(bbox_heights)) if bbox_heights else 0.0
    minimum_area = min(alpha_areas) if alpha_areas else 0
    minimum_height = min(bbox_heights) if bbox_heights else 0

    if median_area < 220 or median_width < 14 or median_height < 20:
        return False

    if minimum_area < 40 or minimum_height < 6:
        return False

    return True


def extract_component_frames_from_region(
    image: Image.Image,
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    clip_id: str | None = None,
    expected_frame_count: int | None = None,
    cleanup_character_artifacts: bool = False,
    suppress_presentation_artifacts: bool = False,
) -> list[ExtractedFrame]:
    row_region = remove_border_palette_background(
        remove_checkerboard_background(image.crop((x_start, y_start, x_end, y_end)))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    row_mask = row_rgba[:, :, 3] > 0
    analysis_mask = build_clip_analysis_mask(clip_id, row_rgba) if suppress_presentation_artifacts else row_mask
    if suppress_presentation_artifacts:
        analysis_mask = suppress_presentation_frame_components(analysis_mask)
        analysis_mask = suppress_showcase_outlier_component(analysis_mask)
        analysis_mask = suppress_row_ground_strip_components(analysis_mask)
    components = []
    for min_x, min_y, max_x, max_y, area in connected_components(analysis_mask):
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        bbox_area = max(width * height, 1)
        density = area / bbox_area
        touches_left_border = min_x <= 1
        touches_right_border = max_x >= analysis_mask.shape[1] - 2
        looks_like_solid_panel = density >= 0.82 and width >= 18 and height >= 18
        looks_like_edge_bar = (touches_left_border or touches_right_border) and width <= 14

        if area < 300 or width < 25 or height < 25:
            continue

        if looks_like_solid_panel or looks_like_edge_bar:
            continue

        components.append((min_x, min_y, max_x, max_y, area))
    components.sort(key=lambda entry: entry[0])

    if expected_frame_count is not None and len(components) > expected_frame_count:
        working_components = list(components)

        while len(working_components) > expected_frame_count:
            areas = np.array([entry[4] for entry in working_components], dtype=np.float32)
            widths = np.array([(entry[2] - entry[0] + 1) for entry in working_components], dtype=np.float32)
            heights = np.array([(entry[3] - entry[1] + 1) for entry in working_components], dtype=np.float32)
            median_area = float(np.median(areas))
            median_width = float(np.median(widths))
            median_height = float(np.median(heights))

            scored: list[tuple[float, int]] = []
            for index, (min_x, min_y, max_x, max_y, area) in enumerate(working_components):
                width = max_x - min_x + 1
                height = max_y - min_y + 1
                touches_edge = min_x <= 1 or max_x >= analysis_mask.shape[1] - 2
                score = 0.0

                if area < median_area * 0.45:
                    score += 3.0
                if width < median_width * 0.5:
                    score += 2.0
                if height < median_height * 0.6:
                    score += 2.5
                if touches_edge and area < median_area * 0.8:
                    score += 1.5
                if area > median_area * 2.4 and width > median_width * 1.7:
                    score += 1.0

                scored.append((score, index))

            score, remove_index = max(scored, key=lambda entry: entry[0])
            if score <= 0:
                break

            working_components.pop(remove_index)

        components = working_components

    frames: list[ExtractedFrame] = []

    for component_left, component_top, component_right, component_bottom, _ in components:
        padding = 6
        min_y = max(0, component_top - padding)
        max_y = min(row_rgba.shape[0] - 1, component_bottom + padding)
        min_x = max(0, component_left - padding)
        max_x = min(row_rgba.shape[1] - 1, component_right + padding)
        crop_rgba = row_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        crop_mask = crop_rgba[:, :, 3] > 0
        filtered_mask = filter_frame_mask_components(crop_mask)
        coords = np.argwhere(filtered_mask)

        if coords.size == 0:
            coords = np.argwhere(crop_mask)

        if coords.size == 0:
            continue

        tight_min_y = max(0, int(coords[:, 0].min()) - 2)
        tight_max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        tight_min_x = max(0, int(coords[:, 1].min()) - 2)
        tight_max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = crop_rgba[tight_min_y : tight_max_y + 1, tight_min_x : tight_max_x + 1].copy()
        frame_mask = filtered_mask[tight_min_y : tight_max_y + 1, tight_min_x : tight_max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_mask)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)

        if cleanup_character_artifacts:
            frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
            frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
            anchor_x, anchor_y = compute_frame_anchor(frame_coords)

        frames.append(
            ExtractedFrame(
                image=Image.fromarray(frame_rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            ),
        )

    return frames


def postprocess_character_frames(
    frames: list[ExtractedFrame],
    subject_id: str | None = None,
    clip_id: str | None = None,
) -> list[ExtractedFrame]:
    processed_frames: list[ExtractedFrame] = []
    run_artifact_cleanup = (
        True
        if subject_id is None or clip_id is None
        else should_run_character_artifact_cleanup(subject_id, clip_id)
    )

    for frame in frames:
        cleaned_rgba = np.array(frame.image.convert("RGBA"))
        if run_artifact_cleanup:
            cleaned_rgba = cleanup_character_frame_artifacts(cleaned_rgba, frame.anchor_x)
        if should_apply_outline_cleanup_to_clip(subject_id, clip_id):
            cleaned_rgba = cleanup_selected_runtime_edge_residue_frame(subject_id, cleaned_rgba)
        cleaned_rgba = cleanup_hero_internal_holes(
            cleaned_rgba,
            max_area=112,
            max_width=10,
            max_height=14,
            max_bottom_ratio=0.68,
        )
        coords = np.argwhere(cleaned_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(coords)
        processed_frames.append(
            ExtractedFrame(
                image=Image.fromarray(cleaned_rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            ),
        )

    return processed_frames


def normalize_character_frame_scale(frames: list[ExtractedFrame]) -> list[ExtractedFrame]:
    if len(frames) <= 1:
        return frames

    bounds: list[tuple[int, int] | None] = []
    widths: list[int] = []
    heights: list[int] = []

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        coords = np.argwhere(rgba[:, :, 3] > 0)
        if coords.size == 0:
            bounds.append(None)
            continue

        min_y = int(coords[:, 0].min())
        max_y = int(coords[:, 0].max())
        min_x = int(coords[:, 1].min())
        max_x = int(coords[:, 1].max())
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        bounds.append((width, height))
        widths.append(width)
        heights.append(height)

    if len(widths) < 2 or len(heights) < 2:
        return frames

    target_width = float(median(widths))
    target_height = float(median(heights))
    normalized_frames: list[ExtractedFrame] = []

    for frame, bound in zip(frames, bounds):
        if bound is None:
            normalized_frames.append(frame)
            continue

        width, height = bound
        width_scale = target_width / max(width, 1)
        height_scale = target_height / max(height, 1)
        scale = (height_scale * 0.72) + (width_scale * 0.28)
        scale = min(max(scale, 0.82), 1.18)

        if abs(scale - 1.0) < 0.04:
            normalized_frames.append(frame)
            continue

        resized = frame.image.resize(
            (
                max(1, int(round(frame.image.size[0] * scale))),
                max(1, int(round(frame.image.size[1] * scale))),
            ),
            RUNTIME_RESAMPLE,
        )
        normalized_frames.append(
            ExtractedFrame(
                image=resized,
                anchor_x=frame.anchor_x * scale,
                anchor_y=frame.anchor_y * scale,
            ),
        )

    return normalized_frames


def reanchor_frames_to_upper_body(frames: list[ExtractedFrame], upper_body_ratio: float = 0.62) -> list[ExtractedFrame]:
    reanchored_frames: list[ExtractedFrame] = []

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            reanchored_frames.append(frame)
            continue

        y_coords = coords[:, 0].astype(np.float32)
        x_coords = coords[:, 1].astype(np.float32)
        min_y = float(y_coords.min())
        max_y = float(y_coords.max())
        upper_limit = min_y + ((max_y - min_y) * upper_body_ratio)
        upper_coords = coords[y_coords <= upper_limit]

        if upper_coords.shape[0] < max(18, int(coords.shape[0] * 0.22)):
            upper_coords = coords

        upper_anchor_x = float(np.median(upper_coords[:, 1].astype(np.float32)))
        reanchored_frames.append(
            ExtractedFrame(
                image=frame.image,
                anchor_x=upper_anchor_x,
                anchor_y=frame.anchor_y,
            ),
        )

    return reanchored_frames


def compute_frame_visual_core_anchor_x(
    mask_coords: np.ndarray,
    band_start_ratio: float = 0.42,
    band_end_ratio: float = 0.82,
) -> float:
    if mask_coords.size == 0:
        return 12.0

    y_coords = mask_coords[:, 0].astype(np.float32)
    min_y = float(y_coords.min())
    max_y = float(y_coords.max())
    band_start = min_y + ((max_y - min_y) * band_start_ratio)
    band_end = min_y + ((max_y - min_y) * band_end_ratio)
    core_coords = mask_coords[(y_coords >= band_start) & (y_coords <= band_end)]

    if core_coords.shape[0] < max(18, int(mask_coords.shape[0] * 0.12)):
        core_coords = mask_coords

    core_x = core_coords[:, 1].astype(np.float32)

    if core_x.size >= 8:
        low_quantile, high_quantile = np.quantile(core_x, (0.2, 0.8))
        trimmed_core_x = core_x[(core_x >= low_quantile) & (core_x <= high_quantile)]
        if trimmed_core_x.size >= 6:
            core_x = trimmed_core_x

    return float(np.median(core_x))


def reanchor_frames_to_visual_core(
    frames: list[ExtractedFrame],
    band_start_ratio: float = 0.42,
    band_end_ratio: float = 0.82,
) -> list[ExtractedFrame]:
    reanchored_frames: list[ExtractedFrame] = []

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            reanchored_frames.append(frame)
            continue

        reanchored_frames.append(
            ExtractedFrame(
                image=frame.image,
                anchor_x=compute_frame_visual_core_anchor_x(
                    coords,
                    band_start_ratio=band_start_ratio,
                    band_end_ratio=band_end_ratio,
                ),
                anchor_y=float(coords[:, 0].max()),
            ),
        )

    return reanchored_frames


def select_gap_near_target_x(
    runs: list[tuple[int, int]],
    target_x: float,
    max_gap_width: int,
    max_center_distance: int = 10,
) -> tuple[int, int] | None:
    best_gap: tuple[float, int, int] | None = None

    for left_run, right_run in zip(runs, runs[1:]):
        gap_left = left_run[1] + 1
        gap_right = right_run[0]
        gap_width = gap_right - gap_left
        if gap_width <= 0 or gap_width > max_gap_width:
            continue

        gap_center = (gap_left + gap_right) / 2.0
        center_distance = abs(gap_center - target_x)
        if center_distance > max_center_distance:
            continue

        score = center_distance + (gap_width * 0.15)
        if best_gap is None or score < best_gap[0]:
            best_gap = (score, gap_left, gap_right)

    if best_gap is None:
        return None

    return best_gap[1], best_gap[2]


def stabilize_character_clip_feet(frames: list[ExtractedFrame]) -> list[ExtractedFrame]:
    if len(frames) <= 1:
        return frames

    target_anchor_y = float(max(frame.anchor_y for frame in frames))
    return [
        ExtractedFrame(
            image=frame.image,
            anchor_x=frame.anchor_x,
            anchor_y=target_anchor_y,
        )
        for frame in frames
    ]


def stabilize_character_clip_frames(frames: list[ExtractedFrame]) -> list[ExtractedFrame]:
    if len(frames) <= 1:
        return frames

    target_anchor_x = float(np.median([frame.anchor_x for frame in frames]))
    target_anchor_y = float(max(frame.anchor_y for frame in frames))

    return [
        ExtractedFrame(
            image=frame.image,
            anchor_x=target_anchor_x,
            anchor_y=target_anchor_y,
        )
        for frame in frames
    ]


def cleanup_hero_internal_holes(
    frame_rgba: np.ndarray,
    max_area: int = 96,
    max_width: int = 10,
    max_height: int = 12,
    max_bottom_ratio: float = 0.72,
) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return frame_rgba

    coords = np.argwhere(alpha_mask)
    min_y = int(coords[:, 0].min())
    max_y = int(coords[:, 0].max())
    allowed_bottom = int(round(min_y + ((max_y - min_y) * max_bottom_ratio)))
    hole_labels, hole_components = label_connected_components(~alpha_mask)

    for component in hole_components:
        if component.touches_border:
            continue
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        if (
            component.area <= max_area
            and width <= max_width
            and height <= max_height
            and component.max_y <= allowed_bottom
        ):
            frame_rgba = fill_transparent_component_from_neighbors(
                frame_rgba,
                hole_labels == component.index,
            )

    return frame_rgba


def cleanup_hero_lower_leg_gap_fill(
    frame_rgba: np.ndarray,
    gap_start_ratio: float = 0.46,
    max_gap_width: int = 18,
) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return frame_rgba

    rgb = frame_rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    coords = np.argwhere(alpha_mask)
    min_y = int(coords[:, 0].min())
    max_y = int(coords[:, 0].max())
    target_x = compute_frame_visual_core_anchor_x(coords, band_start_ratio=0.42, band_end_ratio=0.82)
    gap_start = int(round(min_y + ((max_y - min_y) * gap_start_ratio)))
    dark_body_mask = alpha_mask & ((saturation >= 18) | (brightness <= 124))
    neutral_gap_mask = (
        alpha_mask
        & (np.arange(frame_rgba.shape[0])[:, None] >= gap_start)
        & (saturation <= 34)
        & (brightness >= 88)
        & (brightness <= 220)
    )
    height = alpha_mask.shape[0]
    alpha_gap_rows: list[tuple[int, int, int]] = []

    for y in range(gap_start, height):
        body_columns = np.flatnonzero(dark_body_mask[y])
        if body_columns.size < 2:
            continue

        split_points = np.where(np.diff(body_columns) > 1)[0]
        if split_points.size == 0:
            continue

        runs: list[tuple[int, int]] = []
        run_start = int(body_columns[0])
        for split_index in split_points:
            runs.append((run_start, int(body_columns[split_index])))
            run_start = int(body_columns[split_index + 1])
        runs.append((run_start, int(body_columns[-1])))

        if len(runs) < 2:
            continue

        selected_gap = select_gap_near_target_x(runs, target_x, max_gap_width=max_gap_width, max_center_distance=10)
        if selected_gap is None:
            continue
        gap_left, gap_right = selected_gap

        gap_mask = neutral_gap_mask[y, gap_left:gap_right]
        if gap_mask.any():
            frame_rgba[y, gap_left:gap_right][gap_mask, 3] = 0

        alpha_columns = np.flatnonzero(alpha_mask[y])
        if alpha_columns.size < 2:
            continue

        alpha_splits = np.where(np.diff(alpha_columns) > 1)[0]
        if alpha_splits.size == 0:
            continue

        alpha_runs: list[tuple[int, int]] = []
        alpha_run_start = int(alpha_columns[0])
        for split_index in alpha_splits:
            alpha_runs.append((alpha_run_start, int(alpha_columns[split_index])))
            alpha_run_start = int(alpha_columns[split_index + 1])
        alpha_runs.append((alpha_run_start, int(alpha_columns[-1])))

        if len(alpha_runs) < 2:
            continue

        selected_alpha_gap = select_gap_near_target_x(
            alpha_runs,
            target_x,
            max_gap_width=max_gap_width,
            max_center_distance=10,
        )
        if selected_alpha_gap is not None:
            alpha_gap_left, alpha_gap_right = selected_alpha_gap
            alpha_gap_rows.append((y, alpha_gap_left, alpha_gap_right))

    if alpha_gap_rows:
        gap_left = int(round(median([left for _, left, _ in alpha_gap_rows])))
        gap_right = int(round(median([right for _, _, right in alpha_gap_rows])))
        gap_mid = (gap_left + gap_right) // 2
        corridor_half_width = max(2, int(round((gap_right - gap_left) * 1.4)))
        corridor_left = max(0, gap_mid - corridor_half_width)
        corridor_right = min(frame_rgba.shape[1], gap_mid + corridor_half_width + 1)
        corridor_start_y = max(gap_start, min(y for y, _, _ in alpha_gap_rows) - 2)
        corridor_end_y = min(
            height,
            max(y for y, _, _ in alpha_gap_rows) + max(2, int(round((max_y - min_y) * 0.08))),
        )

        for y in range(corridor_start_y, corridor_end_y):
            corridor_mask = neutral_gap_mask[y, corridor_left:corridor_right]
            if corridor_mask.any():
                frame_rgba[y, corridor_left:corridor_right][corridor_mask, 3] = 0

    return frame_rgba


def force_hero_leg_gap_corridor(
    frame_rgba: np.ndarray,
    gap_start_ratio: float = 0.46,
    max_gap_width: int = 18,
    slit_half_width: int = 2,
) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return frame_rgba

    coords = np.argwhere(alpha_mask)
    min_y = int(coords[:, 0].min())
    max_y = int(coords[:, 0].max())
    target_x = compute_frame_visual_core_anchor_x(coords, band_start_ratio=0.42, band_end_ratio=0.82)
    gap_start = int(round(min_y + ((max_y - min_y) * gap_start_ratio)))
    alpha_gap_rows: list[tuple[int, int, int]] = []

    for y in range(gap_start, alpha_mask.shape[0]):
        alpha_columns = np.flatnonzero(alpha_mask[y])
        if alpha_columns.size < 2:
            continue
        alpha_splits = np.where(np.diff(alpha_columns) > 1)[0]
        if alpha_splits.size == 0:
            continue

        alpha_runs: list[tuple[int, int]] = []
        alpha_run_start = int(alpha_columns[0])
        for split_index in alpha_splits:
            alpha_runs.append((alpha_run_start, int(alpha_columns[split_index])))
            alpha_run_start = int(alpha_columns[split_index + 1])
        alpha_runs.append((alpha_run_start, int(alpha_columns[-1])))

        if len(alpha_runs) < 2:
            continue

        selected_gap = select_gap_near_target_x(
            alpha_runs,
            target_x,
            max_gap_width=max_gap_width,
            max_center_distance=10,
        )
        if selected_gap is not None:
            gap_left, gap_right = selected_gap
            alpha_gap_rows.append((y, gap_left, gap_right))

    if not alpha_gap_rows:
        return frame_rgba

    seed_limit_y = gap_start + max(6, int(round((max_y - min_y) * 0.16)))
    seed_rows = [row for row in alpha_gap_rows if row[0] <= seed_limit_y] or alpha_gap_rows[:6]
    gap_center = int(round(median([((left + right) / 2.0) for _, left, right in seed_rows])))
    corridor_start_y = max(gap_start, min(y for y, _, _ in seed_rows) - 1)
    corridor_end_y = min(
        alpha_mask.shape[0],
        max(y for y, _, _ in seed_rows) + max(6, int(round((max_y - min_y) * 0.16))),
    )
    slit_left = max(0, gap_center - slit_half_width)
    slit_right = min(frame_rgba.shape[1], gap_center + slit_half_width + 1)
    frame_rgba[corridor_start_y:corridor_end_y, slit_left:slit_right, 3] = 0
    return frame_rgba


def polish_hero_frame(clip_id: str, frame: ExtractedFrame) -> ExtractedFrame:
    frame_rgba = np.array(frame.image.convert("RGBA"))

    if frame_rgba[:, :, 3].max() == 0:
        return frame

    frame_rgba = cleanup_hero_internal_holes(frame_rgba)
    if clip_id == "talk":
        frame_rgba = cleanup_hero_lower_leg_gap_fill(frame_rgba, gap_start_ratio=0.46)
        frame_rgba = force_hero_leg_gap_corridor(
            frame_rgba,
            gap_start_ratio=0.46,
            slit_half_width=3,
        )
    frame_rgba = cleanup_hero_runtime_edge_residue_frame(frame_rgba)
    coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(coords)
    return ExtractedFrame(
        image=Image.fromarray(frame_rgba),
        anchor_x=anchor_x,
        anchor_y=anchor_y,
    )


def polish_hero_clip_frames(clip_id: str, frames: list[ExtractedFrame]) -> list[ExtractedFrame]:
    if not frames:
        return frames

    frames = [polish_hero_frame(clip_id, frame) for frame in frames]
    if clip_id == "skill_cast":
        frames = cleanup_hero_skill_cast_frames(frames)
    frames = repair_runtime_strip_outliers(frames)

    if clip_id in {"walk", "skill_cast", "town_idle", "talk", "attack_basic_02", "attack_basic_03", "dash_or_dodge"}:
        frames = normalize_character_frame_scale(frames)
        frames = reanchor_frames_to_visual_core(frames, band_start_ratio=0.42, band_end_ratio=0.82)
        frames = stabilize_character_clip_feet(frames)
    elif clip_id == "down_or_death":
        frames = normalize_character_frame_scale(frames)
        frames = stabilize_character_clip_feet(frames)
    else:
        frames = stabilize_character_clip_frames(frames)

    return frames


def repair_runtime_strip_outliers(frames: list[ExtractedFrame]) -> list[ExtractedFrame]:
    if len(frames) <= 1:
        return frames

    stats: list[tuple[int, int, int, float, float, int, int, float]] = []

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            stats.append((0, 0, 0, 0.0, 0.0, 0, 0, 0.0))
            continue

        min_y = int(coords[:, 0].min())
        max_y = int(coords[:, 0].max())
        min_x = int(coords[:, 1].min())
        max_x = int(coords[:, 1].max())
        area = int(coords.shape[0])
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        pixels = rgba[coords[:, 0], coords[:, 1], :3].astype(np.float32)
        brightness = float(pixels.mean(axis=1).mean()) if pixels.size else 0.0
        rgb_std = float(pixels.std()) if pixels.size else 0.0
        labels, components = label_connected_components(rgba[:, :, 3] > 0)
        significant_components = [
            component
            for component in components
            if component.area >= max(18, int(area * 0.025))
        ]
        main_component = max(significant_components, key=lambda component: component.area) if significant_components else None
        edge_fragment_count = 0
        fragment_area = 0.0
        for component in significant_components:
            if main_component is not None and component.index == main_component.index:
                continue
            touches_side = component.min_x <= 1 or component.max_x >= rgba.shape[1] - 2
            if touches_side:
                edge_fragment_count += 1
            fragment_area += component.area
        stats.append((
            area,
            width,
            height,
            brightness,
            rgb_std,
            len(significant_components),
            edge_fragment_count,
            fragment_area / max(area, 1),
        ))

    areas = [item[0] for item in stats if item[0] > 0]
    widths = [item[1] for item in stats if item[1] > 0]
    heights = [item[2] for item in stats if item[2] > 0]

    if not areas or not widths or not heights:
        return frames

    median_area = float(np.median(areas))
    median_width = float(np.median(widths))
    median_height = float(np.median(heights))
    bad_indices: set[int] = set()

    for index, (area, width, height, brightness, rgb_std, component_count, edge_fragment_count, fragment_ratio) in enumerate(stats):
        if area == 0:
            bad_indices.add(index)
            continue

        looks_too_small = (
            area < median_area * 0.32
            or width < median_width * 0.38
            or height < median_height * 0.42
        )
        looks_like_panel = (
            width >= max(10, median_width * 1.9)
            or height >= max(14, median_height * 1.9)
        ) and brightness <= 180
        looks_fragmented = (
            component_count >= 4
            or edge_fragment_count >= 2
            or (edge_fragment_count >= 1 and component_count >= 3)
            or fragment_ratio >= 0.28
        )

        if looks_too_small or looks_like_panel or looks_fragmented:
            bad_indices.add(index)

    if not bad_indices:
        return frames

    good_indices = [index for index in range(len(frames)) if index not in bad_indices]

    if not good_indices:
        return frames

    repaired: list[ExtractedFrame] = []
    for index, frame in enumerate(frames):
        if index not in bad_indices:
            repaired.append(frame)
            continue
        replacement_index = min(good_indices, key=lambda candidate: abs(candidate - index))
        replacement = frames[replacement_index]
        repaired.append(
            ExtractedFrame(
                image=replacement.image.copy(),
                anchor_x=replacement.anchor_x,
                anchor_y=replacement.anchor_y,
            )
        )

    return repaired


def expand_frames_to_count(frames: list[ExtractedFrame], target_count: int) -> list[ExtractedFrame]:
    if target_count <= len(frames) or len(frames) == 0:
        return frames

    if len(frames) == 1:
        return [
            ExtractedFrame(
                image=frames[0].image.copy(),
                anchor_x=frames[0].anchor_x,
                anchor_y=frames[0].anchor_y,
            )
            for _ in range(target_count)
        ]

    expanded: list[ExtractedFrame] = []
    for target_index in range(target_count):
        source_index = int(round((target_index / max(target_count - 1, 1)) * (len(frames) - 1)))
        source_frame = frames[source_index]
        expanded.append(
            ExtractedFrame(
                image=source_frame.image.copy(),
                anchor_x=source_frame.anchor_x,
                anchor_y=source_frame.anchor_y,
            ),
        )

    return expanded


def resample_frames_to_count(frames: list[ExtractedFrame], target_count: int) -> list[ExtractedFrame]:
    if len(frames) == 0 or len(frames) == target_count:
        return frames

    if len(frames) > target_count:
        sampled: list[ExtractedFrame] = []
        for target_index in range(target_count):
            source_index = int(round((target_index / max(target_count - 1, 1)) * (len(frames) - 1)))
            source_frame = frames[source_index]
            sampled.append(
                ExtractedFrame(
                    image=source_frame.image.copy(),
                    anchor_x=source_frame.anchor_x,
                    anchor_y=source_frame.anchor_y,
                ),
            )
        return sampled

    return expand_frames_to_count(frames, target_count)


def extract_frame_from_source_box(image: Image.Image, source_box: tuple[int, int, int, int]) -> ExtractedFrame:
    crop_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(source_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    alpha_mask = build_character_analysis_mask(crop_rgba)
    filtered_mask = filter_frame_mask_components(alpha_mask)
    filtered_mask = refine_primary_frame_mask(filtered_mask)
    coords = np.argwhere(filtered_mask)

    if coords.size == 0:
        alpha_mask = crop_rgba[:, :, 3] > 0
        filtered_mask = filter_frame_mask_components(alpha_mask)
        filtered_mask = refine_primary_frame_mask(filtered_mask)
        coords = np.argwhere(filtered_mask)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_alpha = frame_rgba[:, :, 3] > 0
    frame_labels, frame_components = label_connected_components(frame_alpha)
    for component in frame_components:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        is_top_scrap = component.max_y <= max(10, int(frame_rgba.shape[0] * 0.16))
        is_small = component.area <= 180
        is_thin_strip = height <= 4 and width >= max(10, int(frame_rgba.shape[1] * 0.28))
        if is_top_scrap and (is_small or is_thin_strip):
            frame_rgba[frame_labels == component.index, 3] = 0
    frame_mask = frame_rgba[:, :, 3] > 0
    frame_coords = np.argwhere(frame_mask)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_frame_from_source_box_raw_alpha(image: Image.Image, source_box: tuple[int, int, int, int]) -> ExtractedFrame:
    crop_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(source_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    alpha_mask = crop_rgba[:, :, 3] > 0
    filtered_mask = filter_frame_mask_components(alpha_mask)
    filtered_mask = refine_primary_frame_mask(filtered_mask)
    coords = np.argwhere(filtered_mask)

    if coords.size == 0:
        coords = np.argwhere(alpha_mask)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
    if not frame_mask.any():
        frame_mask = frame_rgba[:, :, 3] > 0
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


PRESERVE_FULL_SOURCE_BOX_SUBJECT_CLIPS: dict[str, set[str]] = {
    "dorgan": {"idle", "interact", "attack_basic_02"},
    "helma": {"idle", "dash_or_dodge"},
    "serena": {"victory", "down_or_death"},
    "fin": {"aim", "shoot_loop"},
    "iris": {"attack_basic_01", "attack_basic_03", "victory"},
    "wolf": {"attack_basic_01", "attack_basic_02", "charge", "dash_or_dodge", "victory", "down_or_death"},
    "erin": {"walk", "run", "summon_or_rune", "dash_or_dodge"},
    "nazir": {"idle", "attack_basic_03"},
    "laila": {"run"},
    "hakan": {"walk", "run", "heavy_attack"},
    "seraphin": {"run", "attack_basic_02", "pray_idle", "down_or_death"},
}

PRESERVE_FULL_PACKAGE_BOX_SUBJECT_CLIPS: dict[str, set[str]] = {
    "iris": set(),
    "erin": set(),
    "nazir": set(),
    "seraphin": set(),
}


SKIP_TARGETED_CUSTOM_REPAIR_SUBJECT_CLIPS: dict[str, set[str]] = {
    "dorgan": {"interact"},
    "helma": {"idle", "dash_or_dodge"},
    "serena": {"victory", "down_or_death"},
    "fin": {"aim", "shoot_loop"},
    "iris": {"attack_basic_01", "attack_basic_03", "victory"},
    "wolf": {"attack_basic_01", "attack_basic_02", "charge", "dash_or_dodge", "victory", "down_or_death"},
    "erin": {"walk", "run", "summon_or_rune", "dash_or_dodge"},
    "nazir": {"idle", "attack_basic_03"},
    "laila": {"run"},
    "hakan": {"walk", "run", "heavy_attack"},
    "seraphin": {"run", "attack_basic_02", "pray_idle", "down_or_death"},
}

CENTER_TARGETED_MANUAL_SOURCE_BOX_SUBJECT_CLIPS: dict[str, set[str]] = {
    "helma": {"dash_or_dodge", "idle"},
    "serena": {"victory", "down_or_death"},
    "fin": {"aim", "shoot_loop"},
    "iris": {"attack_basic_01", "attack_basic_03", "victory"},
    "wolf": {"attack_basic_01", "attack_basic_02", "charge", "dash_or_dodge", "victory", "down_or_death"},
    "erin": {"walk", "run", "summon_or_rune", "dash_or_dodge"},
    "nazir": {"idle", "attack_basic_03"},
    "laila": {"run"},
    "hakan": {"walk", "run", "heavy_attack"},
    "seraphin": {"run", "attack_basic_02", "pray_idle", "down_or_death"},
}

MANUAL_SOURCE_BOX_EXTRACT_MODES: dict[str, dict[str, str]] = {
    "serena": {
        "victory": "center",
        "down_or_death": "center",
    },
    "iris": {
        "attack_basic_01": "region_isolated_grid",
        "attack_basic_03": "raw",
        "victory": "alpha_bbox",
    },
    "wolf": {
        "attack_basic_01": "region_isolated_grid",
        "attack_basic_02": "center",
        "charge": "region_isolated_grid",
    },
    "erin": {
        "walk": "raw",
        "run": "raw",
        "summon_or_rune": "region_isolated_grid",
        "dash_or_dodge": "region_isolated_grid",
    },
    "nazir": {
        "idle": "raw",
        "attack_basic_03": "raw",
    },
    "laila": {
        "run": "raw",
    },
    "hakan": {
        "walk": "raw",
        "run": "region_isolated_grid",
        "heavy_attack": "region_isolated_grid",
    },
    "seraphin": {
        "run": "region_isolated_grid",
        "pray_idle": "center",
        "down_or_death": "region_isolated_grid",
    },
}

MANUAL_SOURCE_BOX_EXTRACT_OPTIONS: dict[str, dict[str, dict[str, float | int]]] = {
    "serena": {
        "victory": {"merge_gap": 28},
        "down_or_death": {"merge_gap": 24},
    },
    "iris": {
        "attack_basic_01": {"x_start": 880, "x_end": 1236, "y_start": 273, "y_end": 418, "frame_count": 6},
        "victory": {"merge_gap": 26},
    },
    "wolf": {
        "attack_basic_01": {"x_start": 818, "x_end": 1248, "y_start": 284, "y_end": 379, "frame_count": 7},
        "attack_basic_02": {"merge_gap": 8},
        "charge": {"x_start": 142, "x_end": 585, "y_start": 582, "y_end": 679, "frame_count": 6},
    },
    "erin": {
        "summon_or_rune": {"x_start": 668, "x_end": 1177, "y_start": 583, "y_end": 685, "frame_count": 6},
        "dash_or_dodge": {"x_start": 646, "x_end": 1149, "y_start": 739, "y_end": 839, "frame_count": 5},
    },
    "laila": {
        "run": {"merge_gap": 18},
    },
    "hakan": {
        "run": {"x_start": 209, "x_end": 647, "y_start": 273, "y_end": 370, "frame_count": 6},
        "heavy_attack": {"x_start": 738, "x_end": 1253, "y_start": 550, "y_end": 656, "frame_count": 6},
    },
    "seraphin": {
        "run": {"x_start": 150, "x_end": 618, "y_start": 266, "y_end": 349, "frame_count": 7},
        "pray_idle": {"merge_gap": 8},
        "down_or_death": {"x_start": 167, "x_end": 724, "y_start": 1118, "y_end": 1201, "frame_count": 6},
    },
}


def get_manual_source_box_extract_mode(subject_id: str, clip_id: str) -> str | None:
    return MANUAL_SOURCE_BOX_EXTRACT_MODES.get(subject_id, {}).get(clip_id)


def get_manual_source_box_extract_options(subject_id: str, clip_id: str) -> dict[str, float | int]:
    return MANUAL_SOURCE_BOX_EXTRACT_OPTIONS.get(subject_id, {}).get(clip_id, {})

def should_use_subject_specific_source_box_extraction(subject_id: str, clip_id: str) -> bool:
    return clip_id in PRESERVE_FULL_SOURCE_BOX_SUBJECT_CLIPS.get(subject_id, set())


def should_use_center_targeted_manual_source_box_extraction(subject_id: str, clip_id: str) -> bool:
    return clip_id in CENTER_TARGETED_MANUAL_SOURCE_BOX_SUBJECT_CLIPS.get(subject_id, set())




def should_skip_targeted_custom_repair(subject_id: str, clip_id: str) -> bool:
    return clip_id in SKIP_TARGETED_CUSTOM_REPAIR_SUBJECT_CLIPS.get(subject_id, set())


def should_use_subject_specific_package_box_extraction(subject_id: str, clip_id: str) -> bool:
    return clip_id in PRESERVE_FULL_PACKAGE_BOX_SUBJECT_CLIPS.get(subject_id, set())


def remove_wide_horizontal_strip_components(alpha_mask: np.ndarray) -> np.ndarray:
    labels, components = label_connected_components(alpha_mask)

    if not components:
        return alpha_mask

    cleaned_mask = alpha_mask.copy()
    frame_width = alpha_mask.shape[1]
    frame_height = alpha_mask.shape[0]
    largest_area = max(component.area for component in components)

    for component in components:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        touches_side = component.min_x <= 1 or component.max_x >= frame_width - 2
        horizontal_strip = height <= max(4, int(frame_height * 0.06)) and width >= max(24, int(frame_width * 0.55))
        thin_edge_sliver = touches_side and width <= 12 and height >= max(18, int(frame_height * 0.28))
        sliver_is_small = component.area <= max(48, int(largest_area * 0.12))

        if horizontal_strip or (thin_edge_sliver and sliver_is_small):
            cleaned_mask[labels == component.index] = False

    return cleaned_mask


def extract_preserve_full_subject_frame_from_source_box(
    image: Image.Image,
    clip_id: str,
    source_box: tuple[int, int, int, int],
) -> ExtractedFrame:
    crop_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(source_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    alpha_mask = crop_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    alpha_mask = remove_wide_horizontal_strip_components(alpha_mask)
    filtered_mask = filter_frame_mask_components(alpha_mask)
    filtered_mask = refine_primary_frame_mask(filtered_mask)

    coords = np.argwhere(filtered_mask)
    if coords.size == 0:
        coords = np.argwhere(alpha_mask)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
    if not frame_mask.any():
        frame_mask = frame_rgba[:, :, 3] > 0
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_center_targeted_subject_frame_from_source_box(
    image: Image.Image,
    clip_id: str,
    source_box: tuple[int, int, int, int],
    target_x_ratio: float = 0.5,
    target_y_ratio: float = 0.58,
    merge_gap: int = 22,
) -> ExtractedFrame:
    crop_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(source_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    alpha_mask = crop_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    alpha_mask = remove_wide_horizontal_strip_components(alpha_mask)
    components = connected_components(alpha_mask)
    if not components:
        return extract_frame_from_source_box_raw_alpha(image, source_box)

    target_x = crop_rgba.shape[1] * target_x_ratio
    target_y = crop_rgba.shape[0] * target_y_ratio
    best_component: tuple[int, int, int, int, int] | None = None
    best_score: float | None = None

    for min_x, min_y, max_x, max_y, area in components:
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        if area < 24 or width < 4 or height < 6:
            continue

        center_x = (min_x + max_x) / 2.0
        center_y = (min_y + max_y) / 2.0
        contains_target_x = min_x <= target_x <= max_x
        distance_penalty = abs(center_x - target_x) * 8.0 + abs(center_y - target_y) * 2.0
        score = float(area) - distance_penalty
        if contains_target_x:
            score += 1200.0
        if best_score is None or score > best_score:
            best_score = score
            best_component = (min_x, min_y, max_x, max_y, area)

    if best_component is None:
        return extract_frame_from_source_box_raw_alpha(image, source_box)

    selected_components = [best_component]
    best_min_x, best_min_y, best_max_x, best_max_y, _ = best_component

    for component in components:
        if component == best_component:
            continue

        min_x, min_y, max_x, max_y, area = component
        if area < 18:
            continue

        overlap_y = min(best_max_y, max_y) - max(best_min_y, min_y)
        horizontal_gap = 0
        if max_x < best_min_x:
            horizontal_gap = best_min_x - max_x
        elif min_x > best_max_x:
            horizontal_gap = min_x - best_max_x

        if overlap_y >= -2 and horizontal_gap <= merge_gap:
            selected_components.append(component)

    merged_mask = np.zeros_like(alpha_mask, dtype=bool)
    for min_x, min_y, max_x, max_y, _ in selected_components:
        merged_mask[min_y : max_y + 1, min_x : max_x + 1] |= alpha_mask[min_y : max_y + 1, min_x : max_x + 1]

    filtered_mask = filter_frame_mask_components(merged_mask)
    filtered_mask = refine_primary_frame_mask(filtered_mask)
    coords = np.argwhere(filtered_mask)
    if coords.size == 0:
        coords = np.argwhere(merged_mask)

    if coords.size == 0:
        return extract_frame_from_source_box_raw_alpha(image, source_box)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
    if not frame_mask.any():
        frame_mask = merged_mask[min_y : max_y + 1, min_x : max_x + 1]
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_trimmed_raw_subject_frame_from_source_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    trim_top: int = 0,
    trim_right: int = 0,
    trim_bottom: int = 0,
    trim_left: int = 0,
) -> ExtractedFrame:
    x_start, y_start, x_end, y_end = source_box
    adjusted_box = (
        x_start + trim_left,
        y_start + trim_top,
        x_end - trim_right,
        y_end - trim_bottom,
    )
    safe_box = (
        min(adjusted_box[0], adjusted_box[2] - 1),
        min(adjusted_box[1], adjusted_box[3] - 1),
        max(adjusted_box[0] + 1, adjusted_box[2]),
        max(adjusted_box[1] + 1, adjusted_box[3]),
    )
    return extract_frame_from_source_box_raw_alpha(image, safe_box)


def extract_alpha_bbox_subject_frame_from_source_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
) -> ExtractedFrame:
    crop_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(source_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    alpha_mask = remove_wide_horizontal_strip_components(crop_rgba[:, :, 3] > 0)
    coords = np.argwhere(alpha_mask)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = alpha_mask[min_y : max_y + 1, min_x : max_x + 1]
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_subject_manual_source_box_frames(
    subject_id: str,
    clip_id: str,
    image: Image.Image,
    source_boxes: tuple[tuple[int, int, int, int], ...],
) -> list[ExtractedFrame]:
    extract_mode = get_manual_source_box_extract_mode(subject_id, clip_id)
    extract_options = get_manual_source_box_extract_options(subject_id, clip_id)

    if extract_mode == "raw":
        return [extract_frame_from_source_box_raw_alpha(image, source_box) for source_box in source_boxes]

    if extract_mode == "trimmed_raw":
        return [
            extract_trimmed_raw_subject_frame_from_source_box(
                image=image,
                source_box=source_box,
                trim_top=int(extract_options.get("trim_top", 0)),
                trim_right=int(extract_options.get("trim_right", 0)),
                trim_bottom=int(extract_options.get("trim_bottom", 0)),
                trim_left=int(extract_options.get("trim_left", 0)),
            )
            for source_box in source_boxes
        ]

    if extract_mode == "alpha_bbox":
        return [
            extract_alpha_bbox_subject_frame_from_source_box(
                image=image,
                source_box=source_box,
            )
            for source_box in source_boxes
        ]

    if extract_mode == "center":
        return [
            extract_center_targeted_subject_frame_from_source_box(
                image=image,
                clip_id=clip_id,
                source_box=source_box,
                target_x_ratio=float(extract_options.get("target_x_ratio", 0.5)),
                target_y_ratio=float(extract_options.get("target_y_ratio", 0.58)),
                merge_gap=int(extract_options.get("merge_gap", 22)),
            )
            for source_box in source_boxes
        ]

    if extract_mode == "region_direct_grid":
        return extract_frames_from_region_direct_grid(
            image=image,
            x_start=int(extract_options["x_start"]),
            x_end=int(extract_options["x_end"]),
            y_start=int(extract_options["y_start"]),
            y_end=int(extract_options["y_end"]),
            frame_count=int(extract_options["frame_count"]),
            clip_id=clip_id,
            suppress_presentation_artifacts=True,
        )

    if extract_mode == "region_isolated_grid":
        return extract_frames_from_region_isolated_grid(
            image=image,
            x_start=int(extract_options["x_start"]),
            x_end=int(extract_options["x_end"]),
            y_start=int(extract_options["y_start"]),
            y_end=int(extract_options["y_end"]),
            frame_count=int(extract_options["frame_count"]),
            clip_id=clip_id,
            suppress_presentation_artifacts=True,
        )

    if should_use_subject_specific_source_box_extraction(subject_id, clip_id):
        return [
            extract_preserve_full_subject_frame_from_source_box(
                image=image,
                clip_id=clip_id,
                source_box=source_box,
            )
            for source_box in source_boxes
        ]

    if should_use_center_targeted_manual_source_box_extraction(subject_id, clip_id):
        return [
            extract_center_targeted_subject_frame_from_source_box(
                image=image,
                clip_id=clip_id,
                source_box=source_box,
            )
            for source_box in source_boxes
        ]

    return [extract_frame_from_source_box_raw_alpha(image, source_box) for source_box in source_boxes]


def should_use_exact_original_row_region_extraction(subject_id: str, clip_id: str) -> bool:
    return clip_id in EXACT_ORIGINAL_ROW_REGION_SPECS.get(subject_id, {})


def should_use_exact_original_row_region_grid_mode(subject_id: str, clip_id: str) -> bool:
    return clip_id in EXACT_ORIGINAL_ROW_REGION_GRID_SUBJECT_CLIPS.get(subject_id, set())


def extract_frame_from_rgba_alpha_bbox(frame_rgba: np.ndarray) -> ExtractedFrame:
    alpha_mask = frame_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    alpha_mask = remove_wide_horizontal_strip_components(alpha_mask)
    coords = np.argwhere(alpha_mask)
    if coords.size == 0:
        coords = np.argwhere(frame_rgba[:, :, 3] > 0)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(frame_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(frame_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    cropped = frame_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    cropped[:, :, 3] = np.where(
        alpha_mask[min_y : max_y + 1, min_x : max_x + 1],
        cropped[:, :, 3],
        0,
    ).astype(np.uint8)
    coords = np.argwhere(cropped[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(coords)
    cropped = cleanup_character_frame_artifacts(cropped, anchor_x)
    final_coords = np.argwhere(cropped[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(cropped), anchor_x=anchor_x, anchor_y=anchor_y)


def pick_exact_row_region_centers(column_activity: np.ndarray, target_count: int) -> list[int]:
    if target_count <= 0:
        return []

    width = column_activity.shape[0]
    if width <= 0:
        return []

    smooth_window = max(5, (width // max(6, target_count * 3)) | 1)
    kernel = np.ones(smooth_window, dtype=np.float32) / float(smooth_window)
    smoothed = np.convolve(column_activity.astype(np.float32), kernel, mode="same")
    threshold = max(2.0, float(smoothed.max()) * 0.22)
    min_sep = max(12, width // max(target_count * 2, 2))
    peaks: list[int] = []

    for index in np.argsort(smoothed)[::-1]:
        if smoothed[index] < threshold:
            break
        if all(abs(index - existing) >= min_sep for existing in peaks):
            peaks.append(int(index))
        if len(peaks) >= target_count:
            break

    active = np.flatnonzero(smoothed >= max(1.0, float(smoothed.max()) * 0.08))
    active_start = int(active[0]) if active.size else 0
    active_end = int(active[-1]) if active.size else max(0, width - 1)

    while len(peaks) < target_count:
        if not peaks:
            peaks.append(int(round((active_start + active_end) / 2)))
            continue
        peaks = sorted(peaks)
        gaps = []
        left_gap = peaks[0] - active_start
        gaps.append((left_gap, active_start, peaks[0]))
        for left, right in zip(peaks, peaks[1:]):
            gaps.append((right - left, left, right))
        right_gap = active_end - peaks[-1]
        gaps.append((right_gap, peaks[-1], active_end))
        _, left, right = max(gaps, key=lambda item: item[0])
        candidate = int(round((left + right) / 2))
        if all(abs(candidate - existing) >= max(8, min_sep // 2) for existing in peaks):
            peaks.append(candidate)
        else:
            peaks.append(candidate + len(peaks))

    return sorted(peaks[:target_count])


def extract_frames_from_exact_original_row_region(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    target_count: int,
    subject_id: str,
    clip_id: str,
) -> list[ExtractedFrame]:
    crop_image = remove_border_palette_background(remove_checkerboard_background(image.crop(source_box)))
    crop_rgba = np.array(crop_image.convert("RGBA"))
    alpha_mask = crop_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return []

    alpha_mask = remove_wide_horizontal_strip_components(alpha_mask)
    column_activity = alpha_mask.sum(axis=0)
    use_grid_mode = should_use_exact_original_row_region_grid_mode(subject_id, clip_id)
    if use_grid_mode:
        active = np.flatnonzero(column_activity > 0)
        active_start = int(active[0]) if active.size else 0
        active_end = int(active[-1]) if active.size else max(0, crop_rgba.shape[1] - 1)
        total_width = max(1, active_end - active_start + 1)
        centers = [
            int(round(active_start + ((index + 0.5) * total_width / target_count)))
            for index in range(target_count)
        ]
    else:
        centers = pick_exact_row_region_centers(column_activity, target_count)
    if not centers:
        return []

    smoothed = np.convolve(column_activity.astype(np.float32), np.ones(7, dtype=np.float32) / 7.0, mode="same")
    boundaries = [max(0, int(np.flatnonzero(column_activity > 0)[0]) - 4) if np.any(column_activity > 0) else 0]
    for left, right in zip(centers, centers[1:]):
        if use_grid_mode:
            boundaries.append(int(round((left + right) / 2)))
            continue
        segment = smoothed[left:right + 1]
        if segment.size == 0:
            boundaries.append(int(round((left + right) / 2)))
            continue
        valley = int(np.argmin(segment)) + left
        boundaries.append(valley)
    last_active = int(np.flatnonzero(column_activity > 0)[-1]) if np.any(column_activity > 0) else crop_rgba.shape[1] - 1
    boundaries.append(min(crop_rgba.shape[1], last_active + 5))

    frames: list[ExtractedFrame] = []
    for index in range(target_count):
        x_start = max(0, boundaries[index] - 4)
        x_end = min(crop_rgba.shape[1], boundaries[index + 1] + 4)
        if x_end <= x_start:
            x_end = min(crop_rgba.shape[1], x_start + max(12, crop_rgba.shape[1] // max(target_count, 1)))
        frame_rgba = crop_rgba[:, x_start:x_end].copy()
        frames.append(extract_frame_from_rgba_alpha_bbox(frame_rgba))

    return frames


def extract_frames_from_slot_locked_row_region(
    image: Image.Image,
    spec: SlotLockedRowRegionSpec,
) -> list[ExtractedFrame]:
    row_region = remove_border_palette_background(
        remove_checkerboard_background(image.crop((spec.x_start, spec.y_start, spec.x_end, spec.y_end)))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    frames: list[ExtractedFrame] = []

    for slot_left, slot_right in spec.slots:
        slot_left = max(0, slot_left)
        slot_right = min(row_rgba.shape[1], slot_right)
        if slot_right <= slot_left:
            continue

        slot_rgba = row_rgba[:, slot_left:slot_right].copy()
        alpha_mask = remove_wide_horizontal_strip_components(slot_rgba[:, :, 3] > 0)
        coords = np.argwhere(alpha_mask)
        if coords.size == 0:
            continue

        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(slot_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(slot_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = slot_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        frame_mask = alpha_mask[min_y : max_y + 1, min_x : max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frames.append(
            ExtractedFrame(
                image=Image.fromarray(frame_rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            )
        )

    return frames


def extract_frames_from_slot_locked_row_region_centered(
    image: Image.Image,
    spec: SlotLockedRowRegionSpec,
    target_x_ratio: float = 0.7,
    target_y_ratio: float = 0.58,
    merge_gap: int = 4,
) -> list[ExtractedFrame]:
    row_region = remove_border_palette_background(
        remove_checkerboard_background(image.crop((spec.x_start, spec.y_start, spec.x_end, spec.y_end)))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    frames: list[ExtractedFrame] = []

    for slot_left, slot_right in spec.slots:
        slot_left = max(0, slot_left)
        slot_right = min(row_rgba.shape[1], slot_right)
        if slot_right <= slot_left:
            continue

        slot_rgba = row_rgba[:, slot_left:slot_right].copy()
        alpha_mask = remove_wide_horizontal_strip_components(slot_rgba[:, :, 3] > 0)
        components = connected_components(alpha_mask)
        if not components:
            continue

        target_x = slot_rgba.shape[1] * target_x_ratio
        target_y = slot_rgba.shape[0] * target_y_ratio
        best_component: tuple[int, int, int, int, int] | None = None
        best_score: float | None = None

        for min_x, min_y, max_x, max_y, area in components:
            width = max_x - min_x + 1
            height = max_y - min_y + 1
            if area < 20 or width < 4 or height < 6:
                continue
            center_x = (min_x + max_x) / 2.0
            center_y = (min_y + max_y) / 2.0
            distance_penalty = abs(center_x - target_x) * 8.0 + abs(center_y - target_y) * 2.0
            score = float(area) - distance_penalty
            if best_score is None or score > best_score:
                best_score = score
                best_component = (min_x, min_y, max_x, max_y, area)

        if best_component is None:
            continue

        best_min_x, best_min_y, best_max_x, best_max_y, _ = best_component
        merged_mask = np.zeros_like(alpha_mask, dtype=bool)
        merged_mask[best_min_y : best_max_y + 1, best_min_x : best_max_x + 1] |= alpha_mask[
            best_min_y : best_max_y + 1,
            best_min_x : best_max_x + 1,
        ]

        for min_x, min_y, max_x, max_y, area in components:
            if (min_x, min_y, max_x, max_y, area) == best_component or area < 18:
                continue
            overlap_y = min(best_max_y, max_y) - max(best_min_y, min_y)
            horizontal_gap = 0
            if max_x < best_min_x:
                horizontal_gap = best_min_x - max_x
            elif min_x > best_max_x:
                horizontal_gap = min_x - best_max_x
            if overlap_y >= -2 and horizontal_gap <= merge_gap:
                merged_mask[min_y : max_y + 1, min_x : max_x + 1] |= alpha_mask[min_y : max_y + 1, min_x : max_x + 1]

        coords = np.argwhere(merged_mask)
        if coords.size == 0:
            continue

        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(slot_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(slot_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = slot_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        frame_mask = merged_mask[min_y : max_y + 1, min_x : max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frames.append(
            ExtractedFrame(
                image=Image.fromarray(frame_rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            )
        )

    return frames


def extract_preserve_full_subject_frame_from_package_source_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
) -> ExtractedFrame:
    exact_pad_x = 6
    exact_pad_top = 6
    exact_pad_bottom = 6
    x_start, y_start, x_end, y_end = source_box
    working_source_box = (
        max(0, x_start - exact_pad_x),
        max(0, y_start - exact_pad_top),
        min(image.size[0], x_end + exact_pad_x),
        min(image.size[1], y_end + exact_pad_bottom),
    )
    crop_image = remove_checkerboard_background(
        remove_package_card_background(image.crop(working_source_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    crop_rgba = remove_border_connected_palette_background_rgba(crop_rgba)
    analysis_mask = build_character_analysis_mask(crop_rgba)
    analysis_mask = suppress_presentation_frame_components(analysis_mask)
    analysis_mask = suppress_showcase_outlier_component(analysis_mask)
    analysis_mask = suppress_row_ground_strip_components(analysis_mask)
    analysis_mask = remove_wide_horizontal_strip_components(analysis_mask)
    filtered_mask = filter_frame_mask_components(analysis_mask)
    filtered_mask = refine_primary_frame_mask(filtered_mask)
    coords = np.argwhere(filtered_mask)

    if coords.size == 0:
        alpha_mask = remove_wide_horizontal_strip_components(crop_rgba[:, :, 3] > 0)
        filtered_mask = filter_frame_mask_components(alpha_mask)
        filtered_mask = refine_primary_frame_mask(filtered_mask)
        coords = np.argwhere(filtered_mask)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
    if not frame_mask.any():
        frame_mask = frame_rgba[:, :, 3] > 0
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_subject_package_manual_frames(
    subject_id: str,
    clip_id: str,
    image: Image.Image,
    source_boxes: tuple[tuple[int, int, int, int], ...],
) -> list[ExtractedFrame]:
    if should_use_subject_specific_package_box_extraction(subject_id, clip_id):
        return [
            extract_preserve_full_subject_frame_from_package_source_box(
                image=image,
                source_box=source_box,
            )
            for source_box in source_boxes
        ]
    return [
        extract_frame_from_package_source_box(
            image,
            source_box,
            expand_source_box=False,
        )
        for source_box in source_boxes
    ]


def extract_luna_frame_from_source_box(image: Image.Image, source_box: tuple[int, int, int, int]) -> ExtractedFrame:
    crop_image = remove_luna_checkerboard_background(image.crop(source_box))
    crop_rgba = np.array(crop_image.convert("RGBA"))
    crop_rgba = clear_luna_source_border_scraps_rgba(crop_rgba)
    alpha_mask = crop_rgba[:, :, 3] > 0
    coords = np.argwhere(alpha_mask)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_luna_primary_component_frame_from_source_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    preferred_center_ratio: float = 0.62,
) -> ExtractedFrame:
    crop_image = remove_luna_checkerboard_background(image.crop(source_box))
    crop_rgba = np.array(crop_image.convert("RGBA"))
    crop_rgba = clear_luna_source_border_scraps_rgba(crop_rgba)
    alpha_mask = crop_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    labels, components = label_connected_components(alpha_mask)

    if not components:
        return extract_luna_frame_from_source_box(image, source_box)

    preferred_center_x = (crop_rgba.shape[1] - 1) * preferred_center_ratio
    best_component = max(
        components,
        key=lambda component: (
            component.area * 1.0
            - abs(component.center_x - preferred_center_x) * 4.8
        ),
    )

    component_mask = labels == best_component.index
    coords = np.argwhere(component_mask)

    if coords.size == 0:
        return extract_luna_frame_from_source_box(image, source_box)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_rgba[:, :, 3] = np.where(
        component_mask[min_y : max_y + 1, min_x : max_x + 1],
        frame_rgba[:, :, 3],
        0,
    ).astype(np.uint8)
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_luna_frames_for_clip(
    image: Image.Image,
    clip_id: str,
    source_boxes: tuple[tuple[int, int, int, int], ...],
) -> list[ExtractedFrame]:
    if clip_id == "dash_or_dodge":
        return [
            extract_luna_primary_component_frame_from_source_box(
                image,
                source_box,
                preferred_center_ratio=0.68,
            )
            for source_box in source_boxes
        ]

    return [extract_luna_frame_from_source_box(image, source_box) for source_box in source_boxes]


def prepare_luna_manual_source_frames(
    clip_id: str,
    frames: list[ExtractedFrame],
    target_count: int,
) -> list[ExtractedFrame]:
    frames = resample_frames_to_count(frames, target_count)
    frames = normalize_character_frame_scale(frames)

    if clip_id == "dash_or_dodge":
        frames = reanchor_frames_to_visual_core(frames, band_start_ratio=0.32, band_end_ratio=0.9)
        frames = stabilize_character_clip_feet(frames)
        return frames

    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
    frames = stabilize_character_clip_frames(frames)
    return frames


def get_luna_manual_strip_extent_quantile(clip_id: str) -> float:
    if clip_id == "dash_or_dodge":
        return 1.0
    return 0.8


def has_targeted_custom_clip_repair(subject_id: str, clip_id: str) -> bool:
    return clip_id in TARGETED_CUSTOM_CLIP_REPAIR_SPECS.get(subject_id, {})


def resolve_targeted_custom_clip_source_box(
    subject_id: str,
    clip_id: str,
    spec: CustomClipRepairSpec,
    image: Image.Image,
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    region_manual_spec: RegionManualClipExtractionSpec | None = None,
) -> tuple[int, int, int, int]:
    if spec.source_kind == "approved_box":
        source_box = APPROVED_MASTER_CLIP_SOURCE_BOXES.get(subject_id, {}).get(clip_id)
        if source_box is not None:
            return source_box
    if spec.source_kind == "legacy_box":
        source_box = LEGACY_REFRESH_CLIP_SOURCE_BOXES.get(subject_id, {}).get(clip_id)
        if source_box is not None:
            return source_box
    if spec.source_kind == "region_manual" and region_manual_spec is not None:
        return (
            region_manual_spec.x_start,
            region_manual_spec.y_start,
            region_manual_spec.x_end,
            region_manual_spec.y_end,
        )
    return (
        max(0, x_start),
        max(0, y_start),
        min(image.size[0], x_end),
        min(image.size[1], y_end),
    )


def extract_targeted_custom_frame_from_search_rgba(
    search_rgba: np.ndarray,
    target_center_x: float,
    spec: CustomClipRepairSpec,
) -> ExtractedFrame:
    alpha_mask = search_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    labels, components = label_connected_components(alpha_mask)
    valid_components: list[MaskComponent] = []
    search_height, search_width = alpha_mask.shape

    for component in components:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        center_y = (component.min_y + component.max_y) / 2.0
        if component.area < spec.min_component_area or width < 4 or height < 8:
            continue
        if (
            center_y >= search_height * 0.72
            and width <= 22
            and height <= 22
            and component.area <= 180
        ):
            continue
        valid_components.append(component)

    if not valid_components:
        valid_components = components

    if not valid_components:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    target_center_y = search_height * 0.58

    def component_score(component: MaskComponent) -> float:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        bbox_area = max(width * height, 1)
        density = component.area / bbox_area
        distance_penalty = abs(component.center_x - target_center_x) * 10.0
        vertical_penalty = abs(((component.min_y + component.max_y) / 2.0) - target_center_y) * 2.5
        border_penalty = 140.0 if component.touches_border and component.area < 420 else 0.0
        return float(component.area) + (height * 10.0) + density * 140.0 - distance_penalty - vertical_penalty - border_penalty

    primary = max(valid_components, key=component_score)
    keep_indices = {primary.index}

    if spec.merge_neighbor_components:
        primary_width = primary.max_x - primary.min_x + 1
        primary_height = primary.max_y - primary.min_y + 1
        for component in valid_components:
            if component.index == primary.index:
                continue
            gap_x = max(0, max(primary.min_x - component.max_x, component.min_x - primary.max_x))
            gap_y = max(0, max(primary.min_y - component.max_y, component.min_y - primary.max_y))
            area_ratio = component.area / max(1, primary.area)
            if (
                area_ratio >= spec.merge_area_ratio
                and gap_x <= max(spec.max_merge_gap_x, int(primary_width * 0.72))
                and gap_y <= max(spec.max_merge_gap_y, int(primary_height * 0.6))
            ):
                keep_indices.add(component.index)

    selected_mask = np.isin(labels, list(keep_indices))
    coords = np.argwhere(selected_mask)
    if coords.size == 0:
        coords = np.argwhere(alpha_mask)
        selected_mask = alpha_mask

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(search_height - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(search_width - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = search_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = selected_mask[min_y : max_y + 1, min_x : max_x + 1]
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)

    if spec.fill_internal_holes:
        frame_rgba = cleanup_hero_internal_holes(
            frame_rgba,
            max_area=180,
            max_width=18,
            max_height=20,
            max_bottom_ratio=0.96,
        )

    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    if frame_coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def detect_targeted_custom_component_centers(
    row_rgba: np.ndarray,
    target_count: int,
    spec: CustomClipRepairSpec,
) -> list[float]:
    alpha_mask = row_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return []

    labels, components = label_connected_components(alpha_mask)
    row_height, row_width = alpha_mask.shape
    candidate_components: list[tuple[MaskComponent, float]] = []

    for component in components:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        center_y = (component.min_y + component.max_y) / 2.0
        if component.area < max(spec.min_component_area, 48):
            continue
        if height < max(14, int(row_height * 0.28)):
            continue
        if width < 6:
            continue
        if center_y >= row_height * 0.74 and width <= 24 and height <= 24 and component.area <= 220:
            continue
        bbox_area = max(width * height, 1)
        density = component.area / bbox_area
        width_penalty = 180.0 if width >= max(42, row_width / max(target_count * 1.25, 1.0)) else 0.0
        high_penalty = 120.0 if center_y <= row_height * 0.18 else 0.0
        score = float(component.area) + (height * 18.0) + density * 240.0 - width_penalty - high_penalty
        candidate_components.append((component, score))

    if not candidate_components:
        return []

    candidate_components = sorted(candidate_components, key=lambda entry: entry[0].center_x)
    merge_threshold = max(10.0, row_width / max(target_count * 7.0, 1.0))
    grouped_centers: list[tuple[float, float]] = []
    current_group: list[tuple[MaskComponent, float]] = [candidate_components[0]]

    for component, score in candidate_components[1:]:
        if component.center_x - current_group[-1][0].center_x <= merge_threshold:
            current_group.append((component, score))
            continue
        group_centers = [entry[0].center_x for entry in current_group]
        group_scores = [entry[1] for entry in current_group]
        grouped_centers.append((float(sum(group_centers) / len(group_centers)), max(group_scores)))
        current_group = [(component, score)]

    if current_group:
        group_centers = [entry[0].center_x for entry in current_group]
        group_scores = [entry[1] for entry in current_group]
        grouped_centers.append((float(sum(group_centers) / len(group_centers)), max(group_scores)))

    if len(grouped_centers) <= target_count:
        return [center for center, _ in grouped_centers]

    best_window: tuple[float, list[float]] | None = None
    for start in range(0, len(grouped_centers) - target_count + 1):
        window = grouped_centers[start : start + target_count]
        centers = [entry[0] for entry in window]
        scores = [entry[1] for entry in window]
        gaps = [centers[index + 1] - centers[index] for index in range(len(centers) - 1)]
        if not gaps:
            return centers
        window_score = (
            float(np.mean(scores))
            - (float(np.std(gaps)) * 18.0)
            - abs(float(np.median(gaps)) - (row_width / max(target_count, 1))) * 0.18
        )
        if best_window is None or window_score > best_window[0]:
            best_window = (window_score, centers)

    return best_window[1] if best_window is not None else [center for center, _ in grouped_centers[:target_count]]


def prepare_targeted_custom_frames(
    frames: list[ExtractedFrame],
    clip_id: str,
    target_count: int,
    spec: CustomClipRepairSpec,
) -> list[ExtractedFrame]:
    frames = resample_frames_to_count(frames, target_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = normalize_character_frame_scale(frames)

    if spec.anchor_mode == "visual_core":
        frames = reanchor_frames_to_visual_core(
            frames,
            band_start_ratio=spec.visual_core_start_ratio,
            band_end_ratio=spec.visual_core_end_ratio,
        )
        frames = stabilize_character_clip_feet(frames)
        return frames

    if spec.anchor_mode == "feet":
        frames = reanchor_frames_to_visual_core(
            frames,
            band_start_ratio=0.4,
            band_end_ratio=0.82,
        )
        frames = stabilize_character_clip_feet(frames)
        return frames

    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=spec.upper_body_ratio)
    frames = stabilize_character_clip_frames(frames)
    return frames


def extract_targeted_custom_clip_frames(
    image: Image.Image,
    subject_id: str,
    clip_id: str,
    target_count: int,
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    region_manual_spec: RegionManualClipExtractionSpec | None = None,
    approved_master_image: Image.Image | None = None,
) -> list[ExtractedFrame]:
    spec = TARGETED_CUSTOM_CLIP_REPAIR_SPECS.get(subject_id, {}).get(clip_id)
    if spec is None:
        return []

    source_image = approved_master_image if spec.source_kind == "approved_box" and approved_master_image is not None else image
    source_box = resolve_targeted_custom_clip_source_box(
        subject_id=subject_id,
        clip_id=clip_id,
        spec=spec,
        image=source_image,
        x_start=x_start,
        x_end=x_end,
        y_start=y_start,
        y_end=y_end,
        region_manual_spec=region_manual_spec,
    )
    row_region = remove_border_palette_background(
        remove_checkerboard_background(source_image.crop(source_box))
    )
    row_rgba = np.array(row_region.convert("RGBA"))
    if row_rgba.size == 0 or not np.any(row_rgba[:, :, 3] > 0):
        return []

    region_width = row_rgba.shape[1]
    frames: list[ExtractedFrame] = []
    if spec.center_detection_mode == "components":
        centers = detect_targeted_custom_component_centers(row_rgba, target_count, spec)
        if len(centers) >= 2:
            gaps = [centers[index + 1] - centers[index] for index in range(len(centers) - 1)]
            step = float(np.median(gaps)) if gaps else max(48.0, region_width / max(target_count, 1))
            boundaries = [max(0.0, centers[0] - (step * 0.48))]
            for index in range(len(centers) - 1):
                boundaries.append((centers[index] + centers[index + 1]) / 2.0)
            boundaries.append(min(float(region_width), centers[-1] + (step * 0.48)))
            for index, center in enumerate(centers):
                search_left = int(round(max(0.0, boundaries[index] - 4.0)))
                search_right = int(round(min(float(region_width), boundaries[index + 1] + 4.0)))
                search_rgba = row_rgba[:, search_left:search_right].copy()
                if search_rgba.size == 0:
                    continue
                frames.append(
                    extract_targeted_custom_frame_from_search_rgba(
                        search_rgba=search_rgba,
                        target_center_x=float(center - search_left),
                        spec=spec,
                    )
                )

    if not frames:
        for index in range(target_count):
            cell_width = region_width / max(target_count, 1)
            margin = max(12, int(round(cell_width * spec.search_margin_ratio)))
            nominal_left = int(round(region_width * index / target_count))
            nominal_right = int(round(region_width * (index + 1) / target_count))
            search_left = max(0, nominal_left - margin)
            search_right = min(region_width, max(nominal_right + margin, nominal_left + 1))
            search_rgba = row_rgba[:, search_left:search_right].copy()
            if search_rgba.size == 0:
                continue
            target_center_x = ((nominal_left + nominal_right) / 2.0) - search_left
            frames.append(
                extract_targeted_custom_frame_from_search_rgba(
                    search_rgba=search_rgba,
                    target_center_x=target_center_x,
                    spec=spec,
                )
            )

    if not frames:
        return []

    return prepare_targeted_custom_frames(frames, clip_id, target_count, spec)


def extract_frame_from_source_box_targeted_raw_alpha(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    preferred_center_x: float,
) -> ExtractedFrame:
    crop_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(source_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    analysis_mask = build_character_analysis_mask(crop_rgba)
    analysis_mask = suppress_presentation_frame_components(analysis_mask)
    analysis_mask = suppress_showcase_outlier_component(analysis_mask)
    analysis_mask = suppress_row_ground_strip_components(analysis_mask)
    filtered_mask = filter_frame_mask_components(analysis_mask)
    filtered_mask = refine_primary_frame_mask(filtered_mask)

    if not filtered_mask.any():
        filtered_mask = crop_rgba[:, :, 3] > 0

    component_labels, components = label_connected_components(filtered_mask)
    if components:
        crop_height = crop_rgba.shape[0]

        def component_score(component: MaskComponent) -> float:
            center_x = (component.min_x + component.max_x) / 2.0
            center_y = (component.min_y + component.max_y) / 2.0
            width = component.max_x - component.min_x + 1
            height = component.max_y - component.min_y + 1
            distance_penalty = abs(center_x - preferred_center_x) * 8.0
            vertical_penalty = abs(center_y - (crop_height * 0.56)) * 3.0
            border_penalty = 0.0
            if component.touches_border and component.area < 520:
                border_penalty += 140.0
            if width <= 6 or height <= 10:
                border_penalty += 220.0
            size_bonus = min(width * height, component.area * 1.3)
            return (
                float(component.area)
                + size_bonus
                + (height * 14.0)
                - distance_penalty
                - vertical_penalty
                - border_penalty
            )

        primary = max(components, key=component_score)
        filtered_mask = component_labels == primary.index

    coords = np.argwhere(filtered_mask)
    if coords.size == 0:
        coords = np.argwhere(crop_rgba[:, :, 3] > 0)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
    if not frame_mask.any():
        frame_mask = frame_rgba[:, :, 3] > 0
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    post_mask = frame_rgba[:, :, 3] > 0
    post_labels, post_components = label_connected_components(post_mask)
    if post_components:
        crop_preferred_center_x = max(0.0, preferred_center_x - min_x)

        def post_component_score(component: MaskComponent) -> float:
            center_x = (component.min_x + component.max_x) / 2.0
            width = component.max_x - component.min_x + 1
            height = component.max_y - component.min_y + 1
            distance_penalty = abs(center_x - crop_preferred_center_x) * 10.0
            border_penalty = 0.0
            if component.touches_border and component.area < 520:
                border_penalty += 160.0
            if width <= 6 or height <= 10:
                border_penalty += 240.0
            return float(component.area) + (width * height * 0.65) - distance_penalty - border_penalty

        primary_component = max(post_components, key=post_component_score)
        primary_mask = post_labels == primary_component.index
        frame_rgba[:, :, 3] = np.where(primary_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_frame_from_package_source_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    expand_source_box: bool = True,
) -> ExtractedFrame:
    if expand_source_box:
        working_source_box, target_center_x = expand_package_source_box(image, source_box)
    else:
        exact_pad_x = 6
        exact_pad_top = 6
        exact_pad_bottom = 6
        x_start, y_start, x_end, y_end = source_box
        working_source_box = (
            max(0, x_start - exact_pad_x),
            max(0, y_start - exact_pad_top),
            min(image.size[0], x_end + exact_pad_x),
            min(image.size[1], y_end + exact_pad_bottom),
        )
        target_center_x = ((x_start + x_end) / 2.0) - working_source_box[0]
    if expand_source_box:
        crop_image = remove_checkerboard_background(
            remove_package_card_background(image.crop(working_source_box))
        )
        crop_rgba = np.array(crop_image.convert("RGBA"))
        analysis_mask = build_character_analysis_mask(crop_rgba)
    else:
        crop_image = remove_checkerboard_background(
            remove_package_card_background(image.crop(working_source_box))
        )
        crop_rgba = np.array(crop_image.convert("RGBA"))
        crop_rgba = remove_border_connected_palette_background_rgba(crop_rgba)
        analysis_mask = build_character_analysis_mask(crop_rgba)
        analysis_mask = suppress_presentation_frame_components(analysis_mask)
        analysis_mask = suppress_showcase_outlier_component(analysis_mask)
        analysis_mask = suppress_row_ground_strip_components(analysis_mask)
    filtered_mask = filter_frame_mask_components(analysis_mask)
    filtered_mask = refine_primary_frame_mask(filtered_mask)
    coords = np.argwhere(filtered_mask)

    if coords.size == 0:
        alpha_mask = crop_rgba[:, :, 3] > 0
        filtered_mask = filter_frame_mask_components(alpha_mask)
        filtered_mask = refine_primary_frame_mask(filtered_mask)
        coords = np.argwhere(filtered_mask)

    if coords.size == 0:
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    if not expand_source_box:
        component_labels, components = label_connected_components(filtered_mask)
        if components:
            crop_height = crop_rgba.shape[0]

            def component_score(component: MaskComponent) -> float:
                center_x = (component.min_x + component.max_x) / 2.0
                center_y = (component.min_y + component.max_y) / 2.0
                width = component.max_x - component.min_x + 1
                height = component.max_y - component.min_y + 1
                distance_penalty = abs(center_x - target_center_x) * 18.0
                top_penalty = max(0.0, (crop_height * 0.46) - center_y) * 5.0
                border_penalty = 0.0
                if component.touches_border and center_y < crop_height * 0.55:
                    border_penalty += 180.0
                if component.min_y <= 2:
                    border_penalty += 160.0
                return (
                    float(component.area)
                    + (width * height * 0.35)
                    + (height * 14.0)
                    - distance_penalty
                    - top_penalty
                    - border_penalty
                )

            primary = max(components, key=component_score)
            filtered_mask = component_labels == primary.index
            coords = np.argwhere(filtered_mask)

        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_rgba = remove_border_connected_palette_background_rgba(frame_rgba)
        frame_labels, frame_components = label_connected_components(frame_rgba[:, :, 3] > 0)
        if frame_components:
            frame_target_center_x = frame_rgba.shape[1] / 2.0
            frame_target_center_y = frame_rgba.shape[0] * 0.62

            def frame_component_score(component: MaskComponent) -> float:
                center_x = (component.min_x + component.max_x) / 2.0
                center_y = (component.min_y + component.max_y) / 2.0
                width = component.max_x - component.min_x + 1
                height = component.max_y - component.min_y + 1
                distance_penalty = abs(center_x - frame_target_center_x) * 18.0
                vertical_penalty = abs(center_y - frame_target_center_y) * 8.0
                edge_penalty = 120.0 if component.touches_border and width <= frame_rgba.shape[1] * 0.45 else 0.0
                return float(component.area) + (height * 10.0) - distance_penalty - vertical_penalty - edge_penalty

            primary = max(frame_components, key=frame_component_score)
            keep_mask = frame_labels == primary.index
            frame_rgba[:, :, 3] = np.where(keep_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
        final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(final_coords)
        return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)

    component_labels, components = label_connected_components(filtered_mask)
    if components:
        primary = select_package_primary_component(components, target_center_x)
        focused_mask = component_labels == primary.index
        primary_center_x = (primary.min_x + primary.max_x) / 2.0
        primary_center_y = (primary.min_y + primary.max_y) / 2.0
        for component in components:
            if component.index == primary.index:
                continue
            center_x = (component.min_x + component.max_x) / 2.0
            center_y = (component.min_y + component.max_y) / 2.0
            close_x = abs(center_x - primary_center_x) <= max(18, int(crop_rgba.shape[1] * 0.16))
            close_y = abs(center_y - primary_center_y) <= max(20, int(crop_rgba.shape[0] * 0.2))
            large_enough = component.area >= max(32, int(primary.area * 0.08))
            if close_x and close_y and large_enough:
                focused_mask |= component_labels == component.index
        filtered_mask = focused_mask
        coords = np.argwhere(filtered_mask)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
    if not frame_mask.any():
        frame_mask = frame_rgba[:, :, 3] > 0
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_rgba = remove_border_connected_palette_background_rgba(frame_rgba)
    if expand_source_box:
        frame_image = remove_package_card_background(Image.fromarray(frame_rgba))
        frame_rgba = np.array(frame_image.convert("RGBA"))
    frame_labels, frame_components = label_connected_components(frame_rgba[:, :, 3] > 0)
    for component in frame_components:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        is_tall_border_strip = (
            component.touches_border
            and width <= max(10, int(frame_rgba.shape[1] * 0.22))
            and height >= max(18, int(frame_rgba.shape[0] * 0.45))
        )
        if is_tall_border_strip:
            frame_rgba[frame_labels == component.index, 3] = 0
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    frame_rgba = remove_border_connected_palette_background_rgba(frame_rgba)
    if expand_source_box:
        frame_image = remove_package_card_background(Image.fromarray(frame_rgba))
        frame_rgba = np.array(frame_image.convert("RGBA"))
    component_labels, components = label_connected_components(frame_rgba[:, :, 3] > 0)
    if components:
        trimmed_target_center_x = min(max(0.0, target_center_x - min_x), float(frame_rgba.shape[1] - 1))
        primary = select_package_primary_component(components, trimmed_target_center_x)
        primary_center_x = (primary.min_x + primary.max_x) / 2
        primary_center_y = (primary.min_y + primary.max_y) / 2
        for component in components:
            if component.index == primary.index:
                continue
            center_x = (component.min_x + component.max_x) / 2
            center_y = (component.min_y + component.max_y) / 2
            close_x = abs(center_x - primary_center_x) <= max(16, int(frame_rgba.shape[1] * 0.24))
            close_y = abs(center_y - primary_center_y) <= max(18, int(frame_rgba.shape[0] * 0.3))
            large_enough = component.area >= max(28, int(primary.area * 0.1))
            if not (close_x and close_y and large_enough):
                frame_rgba[component_labels == component.index, 3] = 0
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_frames_from_row_intervals(
    image: Image.Image,
    row_box: tuple[int, int, int, int],
    intervals: tuple[tuple[int, int], ...],
    target_count: int,
) -> list[ExtractedFrame]:
    row_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(row_box))
    )
    row_rgba = np.array(row_image.convert("RGBA"))
    frames: list[ExtractedFrame] = []

    for left, right in intervals:
        cell_left = max(0, left - 2)
        cell_right = min(row_rgba.shape[1], right + 3)
        cell_rgba = row_rgba[:, cell_left:cell_right].copy()
        analysis_mask = build_character_analysis_mask(cell_rgba)
        filtered_mask = filter_frame_mask_components(analysis_mask)
        filtered_mask = refine_primary_frame_mask(filtered_mask)
        coords = np.argwhere(filtered_mask)

        if coords.size == 0:
            alpha_mask = cell_rgba[:, :, 3] > 0
            filtered_mask = filter_frame_mask_components(alpha_mask)
            filtered_mask = refine_primary_frame_mask(filtered_mask)
            coords = np.argwhere(filtered_mask)

        if coords.size == 0:
            continue

        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(cell_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(cell_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = cell_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        frame_mask = filtered_mask[min_y : max_y + 1, min_x : max_x + 1]
        if not frame_mask.any():
            frame_mask = frame_rgba[:, :, 3] > 0
        frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
        final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(final_coords)
        frames.append(
            ExtractedFrame(
                image=Image.fromarray(frame_rgba),
                anchor_x=anchor_x,
                anchor_y=anchor_y,
            )
        )

    frames = resample_frames_to_count(frames, target_count)
    frames = repair_runtime_strip_outliers(frames)
    return stabilize_character_clip_frames(frames)


def apply_hero_manual_clip_overrides(clip_id: str, frames: list[ExtractedFrame]) -> list[ExtractedFrame]:
    if not frames:
        return frames

    adjusted = list(frames)

    def copy_frame(target_index: int, source_index: int) -> None:
        if 0 <= target_index < len(adjusted) and 0 <= source_index < len(adjusted):
            adjusted[target_index] = adjusted[source_index]

    if clip_id in {"attack_basic_02", "charge"}:
        copy_frame(3, 2)
        copy_frame(4, min(len(adjusted) - 1, 5))
    elif clip_id == "run":
        copy_frame(1, 0)
        copy_frame(2, min(len(adjusted) - 1, 3))
    elif clip_id == "skill_cast":
        copy_frame(4, 3)
        copy_frame(5, min(len(adjusted) - 1, 6))
    elif clip_id == "attack_basic_03":
        copy_frame(5, 4)
        copy_frame(6, 4)
    elif clip_id == "victory":
        copy_frame(6, 5)
        copy_frame(7, 5)

    return adjusted


def extract_hero_manual_subject(
    subject: SubjectSpec,
    image: Image.Image,
    package_image: Image.Image | None = None,
) -> dict:
    clip_specs = {clip_spec.id: clip_spec for (clip_spec,) in subject.rows}
    clips: list[dict] = []

    for (clip_spec,) in subject.rows:
        if package_image is not None and clip_spec.id in HERO_PACKAGE_OVERRIDE_CLIP_IDS:
            source_boxes = HERO_PACKAGE_MANUAL_SOURCE_BOXES.get(clip_spec.id)
            if source_boxes is not None:
                if clip_spec.id == "talk":
                    frames = extract_hero_talk_package_frames(
                        package_image=package_image,
                        source_boxes=source_boxes,
                        target_count=clip_spec.frame_count,
                    )
                else:
                    frames = [
                        extract_frame_from_package_source_box(
                            package_image,
                            source_box,
                            expand_source_box=False,
                        )
                        for source_box in source_boxes
                    ]
                    frames = resample_frames_to_count(frames, clip_spec.frame_count)
                    frames = repair_runtime_strip_outliers(frames)
                    frames = normalize_character_frame_scale(frames)
                    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
                    frames = stabilize_character_clip_frames(frames)
                frames = polish_hero_clip_frames(clip_spec.id, frames)
                strip = fit_strip_frames(frames, max_scale=1.26)
                strip = cleanup_runtime_bright_residue_strip(strip)
                if clip_spec.id == "talk":
                    strip = cleanup_hero_runtime_leg_gap_strip(strip, gap_start_ratio=0.46, slit_half_width=2)
                    strip = cleanup_hero_runtime_talk_inner_leg_residue(strip)
                    strip = cleanup_runtime_tiny_components_and_holes_strip(
                        strip,
                        max_component_area=2,
                        max_hole_area=0,
                    )
                if clip_spec.id in {"attack_basic_02", "skill_cast", "town_idle"}:
                    strip = cleanup_runtime_tiny_components_and_holes_strip(
                        strip,
                        max_component_area=12,
                        max_hole_area=0,
                    )
                if clip_spec.id == "skill_cast":
                    strip = cleanup_hero_runtime_skill_cast_tail(strip)
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue

        effective_clip_id = HERO_PROXY_SOURCE_CLIPS.get(clip_spec.id, clip_spec.id)
        source_boxes = HERO_MANUAL_BOX_CLIP_SOURCES.get(effective_clip_id)
        row_interval_spec = HERO_ROW_INTERVAL_CLIP_SPECS.get(effective_clip_id)
        if effective_clip_id in HERO_EXACT_BOX_CLIP_IDS and source_boxes is not None:
            frames = [extract_frame_from_source_box_raw_alpha(image, source_box) for source_box in source_boxes]
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = stabilize_character_clip_frames(frames)
        elif effective_clip_id in HERO_FILTERED_BOX_CLIP_IDS and source_boxes is not None:
            frames = [extract_frame_from_source_box(image, source_box) for source_box in source_boxes]
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = stabilize_character_clip_frames(frames)
        elif row_interval_spec is not None:
            row_box, intervals = row_interval_spec
            frames = extract_frames_from_row_intervals(
                image=image,
                row_box=row_box,
                intervals=intervals,
                target_count=clip_spec.frame_count,
            )
        else:
            source_boxes = HERO_MANUAL_BOX_CLIP_SOURCES[effective_clip_id]
            frames = [extract_frame_from_source_box_raw_alpha(image, source_box) for source_box in source_boxes]
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = stabilize_character_clip_frames(frames)
        frames = apply_hero_manual_clip_overrides(clip_spec.id, frames)
        frames = polish_hero_clip_frames(clip_spec.id, frames)
        strip = fit_strip_frames(
            frames,
            max_scale=get_subject_clip_fit_max_scale(
                subject.id,
                clip_spec.id,
                1.34 if clip_spec.id == "down_or_death" else 1.18,
            ),
        )
        strip = cleanup_runtime_bright_residue_strip(strip)
        strip = finalize_hero_runtime_strip(clip_spec.id, strip)
        if clip_spec.id in {"run", "attack_basic_01", "hit_react"}:
            strip = cleanup_runtime_tiny_components_and_holes_strip(strip, max_component_area=6, max_hole_area=8)
        clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": "character",
        "clips": clips,
    }


def load_package_panel_image(subject_id: str) -> Image.Image | None:
    package_file_name = PACKAGE_PANEL_SOURCE_FILES.get(subject_id)
    if package_file_name is None:
        return None

    source_path = PACKAGE_SOURCE_DIR / package_file_name
    if not source_path.exists():
        return None

    return Image.open(source_path).convert("RGBA")


def load_hero_legacy_master_image() -> Image.Image | None:
    if not HERO_LEGACY_MASTER_SHEET_PATH.exists():
        return None

    return Image.open(HERO_LEGACY_MASTER_SHEET_PATH).convert("RGBA")


def load_subject_legacy_refresh_image(subject_id: str) -> Image.Image | None:
    file_name = LEGACY_SOURCE_REFRESH_FILES.get(subject_id)
    if file_name is None:
        return None

    source_path = LEGACY_SOURCE_REFRESH_DIR / file_name
    if not source_path.exists():
        return None

    return Image.open(source_path).convert("RGBA")


def cleanup_runtime_bright_residue_strip(
    strip: Image.Image,
    max_component_area: int = 12,
    brightness_min: int = 238,
    saturation_max: int = 12,
) -> Image.Image:
    frame_count = strip.width // FRAME_SIZE
    if frame_count <= 0:
        return strip

    cleaned_strip = Image.new("RGBA", strip.size, (0, 0, 0, 0))

    for frame_index in range(frame_count):
        frame = np.array(strip.crop((frame_index * FRAME_SIZE, 0, (frame_index + 1) * FRAME_SIZE, FRAME_SIZE)).convert("RGBA"))
        alpha_mask = frame[:, :, 3] > 0
        labels, components = label_connected_components(alpha_mask)

        if components:
            main_component = max(components, key=lambda component: component.area)
            rgb = frame[:, :, :3].astype(np.int16)

            for component in components:
                if component.index == main_component.index or component.area > max_component_area:
                    continue

                component_mask = labels == component.index
                component_pixels = rgb[component_mask]
                if component_pixels.size == 0:
                    continue

                brightness = float(component_pixels.mean(axis=1).mean())
                saturation = float((component_pixels.max(axis=1) - component_pixels.min(axis=1)).mean())
                if brightness >= brightness_min and saturation <= saturation_max:
                    frame[component_mask, 3] = 0

        frame = cleanup_runtime_white_edge_specks_frame(frame)
        cleaned_strip.alpha_composite(Image.fromarray(frame), (frame_index * FRAME_SIZE, 0))

    return cleaned_strip


def cleanup_runtime_white_edge_specks_frame(
    frame_rgba: np.ndarray,
    max_component_area: int = 2,
    brightness_min: int = 242,
    saturation_max: int = 18,
    min_transparent_neighbors: int = 4,
) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return frame_rgba

    rgb = frame_rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    padded = np.pad(alpha_mask, 1, constant_values=False)
    opaque_neighbors = np.zeros(alpha_mask.shape, dtype=np.int16)

    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            neighbor_mask = padded[1 + dy : 1 + dy + alpha_mask.shape[0], 1 + dx : 1 + dx + alpha_mask.shape[1]]
            opaque_neighbors += neighbor_mask.astype(np.int16)

    transparent_neighbors = 8 - opaque_neighbors
    candidate_mask = (
        alpha_mask
        & (brightness >= brightness_min)
        & (saturation <= saturation_max)
        & (transparent_neighbors >= min_transparent_neighbors)
    )
    labels, components = label_connected_components(candidate_mask)
    cleaned = frame_rgba.copy()

    for component in components:
        if component.area > max_component_area:
            continue

        component_mask = labels == component.index
        if not component_mask.any():
            continue

        support = int(opaque_neighbors[component_mask].max())
        if support <= 4:
            cleaned[component_mask, 3] = 0

    return cleaned


def cleanup_hero_runtime_edge_residue_frame(
    frame_rgba: np.ndarray,
    max_component_area: int = 4,
    brightness_min: int = 182,
    saturation_max: int = 78,
    min_transparent_neighbors: int = 2,
) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return frame_rgba

    rgb = frame_rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    padded = np.pad(alpha_mask, 1, constant_values=False)
    opaque_neighbors = np.zeros(alpha_mask.shape, dtype=np.int16)

    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            neighbor_mask = padded[1 + dy : 1 + dy + alpha_mask.shape[0], 1 + dx : 1 + dx + alpha_mask.shape[1]]
            opaque_neighbors += neighbor_mask.astype(np.int16)

    transparent_neighbors = 8 - opaque_neighbors
    candidate_mask = (
        alpha_mask
        & (brightness >= brightness_min)
        & (saturation <= saturation_max)
        & (transparent_neighbors >= min_transparent_neighbors)
    )
    labels, components = label_connected_components(candidate_mask)
    cleaned = frame_rgba.copy()

    for component in components:
        if component.area > max_component_area:
            continue

        component_mask = labels == component.index
        if not component_mask.any():
            continue

        support = int(opaque_neighbors[component_mask].max())
        if support <= 5:
            cleaned[component_mask, 3] = 0

    return cleaned


def compute_frame_boundary_neighbor_stats(
    frame_rgba: np.ndarray,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    alpha_mask = frame_rgba[:, :, 3] > 0
    rgb = frame_rgba[:, :, :3].astype(np.float32)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    padded_alpha = np.pad(alpha_mask, 1, constant_values=False)
    padded_brightness = np.pad(brightness, 1, constant_values=0.0)
    padded_saturation = np.pad(saturation, 1, constant_values=0.0)
    opaque_neighbors = np.zeros(alpha_mask.shape, dtype=np.int16)
    brightness_sum = np.zeros(alpha_mask.shape, dtype=np.float32)
    saturation_sum = np.zeros(alpha_mask.shape, dtype=np.float32)

    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            neighbor_mask = padded_alpha[1 + dy : 1 + dy + alpha_mask.shape[0], 1 + dx : 1 + dx + alpha_mask.shape[1]]
            neighbor_brightness = padded_brightness[
                1 + dy : 1 + dy + alpha_mask.shape[0],
                1 + dx : 1 + dx + alpha_mask.shape[1],
            ]
            neighbor_saturation = padded_saturation[
                1 + dy : 1 + dy + alpha_mask.shape[0],
                1 + dx : 1 + dx + alpha_mask.shape[1],
            ]
            opaque_neighbors += neighbor_mask.astype(np.int16)
            brightness_sum += neighbor_brightness * neighbor_mask.astype(np.float32)
            saturation_sum += neighbor_saturation * neighbor_mask.astype(np.float32)

    transparent_neighbors = 8 - opaque_neighbors
    interior_brightness = np.where(
        opaque_neighbors > 0,
        brightness_sum / np.maximum(opaque_neighbors.astype(np.float32), 1.0),
        brightness,
    )
    interior_saturation = np.where(
        opaque_neighbors > 0,
        saturation_sum / np.maximum(opaque_neighbors.astype(np.float32), 1.0),
        saturation,
    )
    return alpha_mask, brightness, saturation, opaque_neighbors, transparent_neighbors, interior_brightness, interior_saturation


def cleanup_character_edge_fringe_frame(
    frame_rgba: np.ndarray,
    brightness_min: int = 182,
    saturation_max: int = 82,
    brightness_delta: int = 22,
    min_transparent_neighbors: int = 1,
    max_opaque_neighbors: int = 6,
) -> np.ndarray:
    (
        alpha_mask,
        brightness,
        saturation,
        opaque_neighbors,
        transparent_neighbors,
        interior_brightness,
        interior_saturation,
    ) = compute_frame_boundary_neighbor_stats(frame_rgba)
    if not alpha_mask.any():
        return frame_rgba

    boundary_mask = alpha_mask & (transparent_neighbors >= min_transparent_neighbors)
    candidate_mask = (
        boundary_mask
        & (brightness >= brightness_min)
        & (saturation <= saturation_max)
        & ((brightness - interior_brightness) >= brightness_delta)
        & (opaque_neighbors <= max_opaque_neighbors)
    )
    cleaned = frame_rgba.copy()
    cleaned[candidate_mask, 3] = 0
    return cleanup_runtime_white_edge_specks_frame(cleaned)


def darken_hero_runtime_outline_frame(
    frame_rgba: np.ndarray,
    brightness_floor: int = 46,
) -> np.ndarray:
    alpha_mask = frame_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return frame_rgba

    padded = np.pad(alpha_mask, 1, constant_values=False)
    opaque_neighbors = np.zeros(alpha_mask.shape, dtype=np.int16)

    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            neighbor_mask = padded[1 + dy : 1 + dy + alpha_mask.shape[0], 1 + dx : 1 + dx + alpha_mask.shape[1]]
            opaque_neighbors += neighbor_mask.astype(np.int16)

    transparent_neighbors = 8 - opaque_neighbors
    rgb = frame_rgba[:, :, :3].astype(np.float32)
    brightness = rgb.mean(axis=2)
    boundary_mask = (
        alpha_mask
        & (transparent_neighbors >= 1)
        & (opaque_neighbors >= 2)
        & (brightness >= brightness_floor)
    )

    if not boundary_mask.any():
        return frame_rgba

    result = frame_rgba.copy()
    stronger_mask = boundary_mask & (brightness >= 170)
    neutral_mask = boundary_mask & (brightness >= 120) & ~stronger_mask
    regular_mask = boundary_mask & ~stronger_mask & ~neutral_mask

    shaded = rgb.copy()
    shaded[stronger_mask] = np.clip((shaded[stronger_mask] * 0.66) - 10.0, 0.0, 255.0)
    shaded[neutral_mask] = np.clip((shaded[neutral_mask] * 0.74) - 8.0, 0.0, 255.0)
    shaded[regular_mask] = np.clip((shaded[regular_mask] * 0.84) - 4.0, 0.0, 255.0)
    result[:, :, :3] = shaded.astype(np.uint8)
    return result


def cleanup_selected_runtime_edge_residue_frame(subject_id: str, frame_rgba: np.ndarray) -> np.ndarray:
    profile = EDGE_FRINGE_CLEANUP_PROFILES.get(subject_id)
    if profile is None:
        if subject_id in AGGRESSIVE_OUTLINE_SUBJECT_IDS:
            return cleanup_hero_runtime_edge_residue_frame(
                frame_rgba,
                max_component_area=8,
                brightness_min=168,
                saturation_max=96,
                min_transparent_neighbors=1,
            )
        return cleanup_hero_runtime_edge_residue_frame(frame_rgba)

    return cleanup_character_edge_fringe_frame(
        frame_rgba,
        brightness_min=int(profile.get("brightness_min", 182)),
        saturation_max=int(profile.get("saturation_max", 82)),
        brightness_delta=int(profile.get("brightness_delta", 22)),
        min_transparent_neighbors=int(profile.get("min_transparent_neighbors", 1)),
        max_opaque_neighbors=int(profile.get("max_opaque_neighbors", 6)),
    )


def darken_selected_runtime_outline_frame(subject_id: str, frame_rgba: np.ndarray) -> np.ndarray:
    profile = OUTLINE_SHADE_PROFILES.get(subject_id)
    if profile is None:
        if subject_id in AGGRESSIVE_OUTLINE_SUBJECT_IDS:
            return darken_hero_runtime_outline_frame(frame_rgba, brightness_floor=30)
        return darken_hero_runtime_outline_frame(frame_rgba)

    alpha_mask = frame_rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return frame_rgba

    padded = np.pad(alpha_mask, 1, constant_values=False)
    opaque_neighbors = np.zeros(alpha_mask.shape, dtype=np.int16)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            neighbor_mask = padded[1 + dy : 1 + dy + alpha_mask.shape[0], 1 + dx : 1 + dx + alpha_mask.shape[1]]
            opaque_neighbors += neighbor_mask.astype(np.int16)

    transparent_neighbors = 8 - opaque_neighbors
    rgb = frame_rgba[:, :, :3].astype(np.float32)
    brightness = rgb.mean(axis=2)
    boundary_mask = (
        alpha_mask
        & (transparent_neighbors >= 1)
        & (opaque_neighbors >= 2)
        & (brightness >= float(profile.get("brightness_floor", 46)))
    )
    if not boundary_mask.any():
        return frame_rgba

    stronger_mask = boundary_mask & (brightness >= 170)
    neutral_mask = boundary_mask & (brightness >= 120) & ~stronger_mask
    regular_mask = boundary_mask & ~stronger_mask & ~neutral_mask

    shaded = rgb.copy()
    shaded[stronger_mask] = np.clip(
        (shaded[stronger_mask] * float(profile.get("strong_factor", 0.66)))
        + float(profile.get("strong_offset", -10.0)),
        0.0,
        255.0,
    )
    shaded[neutral_mask] = np.clip(
        (shaded[neutral_mask] * float(profile.get("mid_factor", 0.74)))
        + float(profile.get("mid_offset", -8.0)),
        0.0,
        255.0,
    )
    shaded[regular_mask] = np.clip(
        (shaded[regular_mask] * float(profile.get("base_factor", 0.84)))
        + float(profile.get("base_offset", -4.0)),
        0.0,
        255.0,
    )
    result = frame_rgba.copy()
    result[:, :, :3] = shaded.astype(np.uint8)
    return result


def should_apply_outline_cleanup_to_clip(subject_id: str, clip_id: str | None = None) -> bool:
    if subject_id not in OUTLINE_CLEANUP_SUBJECT_IDS:
        return False
    if clip_id is None:
        return True
    return clip_id not in OUTLINE_CLEANUP_SKIP_CLIPS.get(subject_id, set())


def finalize_hero_runtime_strip(clip_id: str, strip: Image.Image) -> Image.Image:
    frame_count = strip.width // FRAME_SIZE
    if frame_count <= 0:
        return strip

    cleaned_strip = Image.new("RGBA", strip.size, (0, 0, 0, 0))
    for frame_index in range(frame_count):
        frame = np.array(strip.crop((frame_index * FRAME_SIZE, 0, (frame_index + 1) * FRAME_SIZE, FRAME_SIZE)).convert("RGBA"))
        frame = cleanup_hero_runtime_edge_residue_frame(frame)
        frame = darken_hero_runtime_outline_frame(frame)
        cleaned_strip.alpha_composite(Image.fromarray(frame), (frame_index * FRAME_SIZE, 0))

    return cleaned_strip


def finalize_selected_runtime_strip(strip: Image.Image) -> Image.Image:
    frame_count = strip.width // FRAME_SIZE
    if frame_count <= 0:
        return strip

    cleaned_strip = Image.new("RGBA", strip.size, (0, 0, 0, 0))
    for frame_index in range(frame_count):
        frame = np.array(strip.crop((frame_index * FRAME_SIZE, 0, (frame_index + 1) * FRAME_SIZE, FRAME_SIZE)).convert("RGBA"))
        frame = cleanup_hero_runtime_edge_residue_frame(frame)
        frame = darken_hero_runtime_outline_frame(frame)
        cleaned_strip.alpha_composite(Image.fromarray(frame), (frame_index * FRAME_SIZE, 0))

    return cleaned_strip


def finalize_selected_runtime_strip_for_subject(subject_id: str, strip: Image.Image) -> Image.Image:
    frame_count = strip.width // FRAME_SIZE
    if frame_count <= 0:
        return strip

    cleaned_strip = Image.new("RGBA", strip.size, (0, 0, 0, 0))
    for frame_index in range(frame_count):
        frame = np.array(strip.crop((frame_index * FRAME_SIZE, 0, (frame_index + 1) * FRAME_SIZE, FRAME_SIZE)).convert("RGBA"))
        frame = cleanup_selected_runtime_edge_residue_frame(subject_id, frame)
        frame = darken_selected_runtime_outline_frame(subject_id, frame)
        cleaned_strip.alpha_composite(Image.fromarray(frame), (frame_index * FRAME_SIZE, 0))

    return cleaned_strip


def scale_runtime_strip_frames(strip: Image.Image, scale: float) -> Image.Image:
    if abs(scale - 1.0) < 0.02:
        return strip

    frame_count = strip.width // FRAME_SIZE
    if frame_count <= 0:
        return strip

    scaled_strip = Image.new("RGBA", strip.size, (0, 0, 0, 0))
    for frame_index in range(frame_count):
        frame_box = (frame_index * FRAME_SIZE, 0, (frame_index + 1) * FRAME_SIZE, FRAME_SIZE)
        frame = strip.crop(frame_box).convert("RGBA")
        frame_rgba = np.array(frame)
        coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        if coords.size == 0:
            continue

        anchor_x, anchor_y = compute_frame_anchor(coords)
        resized = frame.resize(
            (
                max(1, int(round(frame.size[0] * scale))),
                max(1, int(round(frame.size[1] * scale))),
            ),
            RUNTIME_RESAMPLE,
        )
        scaled_anchor_x = anchor_x * scale
        scaled_anchor_y = anchor_y * scale
        paste_x = int(round((frame_index * FRAME_SIZE) + anchor_x - scaled_anchor_x))
        paste_y = int(round(anchor_y - scaled_anchor_y))
        paste_x = max(frame_index * FRAME_SIZE, min(frame_index * FRAME_SIZE + FRAME_SIZE - resized.size[0], paste_x))
        paste_y = max(0, min(FRAME_SIZE - resized.size[1], paste_y))
        cell_canvas = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
        local_x = paste_x - (frame_index * FRAME_SIZE)
        cell_canvas.alpha_composite(resized, (local_x, paste_y))
        scaled_strip.alpha_composite(cell_canvas, (frame_index * FRAME_SIZE, 0))

    return scaled_strip


def finalize_runtime_strip_for_subject(subject_id: str, clip_id: str, strip: Image.Image) -> Image.Image:
    if subject_id == "hero":
        cleaned_strip = finalize_hero_runtime_strip(clip_id, strip)
    elif should_apply_outline_cleanup_to_clip(subject_id, clip_id):
        cleaned_strip = finalize_selected_runtime_strip_for_subject(subject_id, strip)
    else:
        cleaned_strip = strip

    post_scale = get_subject_clip_post_fit_scale(subject_id, clip_id)
    if abs(post_scale - 1.0) >= 0.02:
        cleaned_strip = scale_runtime_strip_frames(cleaned_strip, post_scale)
    return cleaned_strip


def extract_hero_from_legacy_master_sheet(subject: SubjectSpec, image: Image.Image) -> dict:
    label_boxes = detect_label_boxes(np.array(image)[:, :, :3], min_y=60, max_width=200, x_end=220)
    label_boxes = [box for box in label_boxes if box[1] >= 100]

    if len(label_boxes) < len(subject.rows):
        raise RuntimeError("Hero legacy master sheet row labels could not be resolved.")

    clips: list[dict] = []
    x_start = 190
    x_end = image.size[0] - 10

    for (clip_spec,), label_box in zip(subject.rows, label_boxes):
        row_top = max(0, label_box[1] - 8)
        row_bottom = min(image.size[1], label_box[3] + 10)
        component_frames = extract_component_frames_from_region(
            image=image,
            x_start=x_start,
            x_end=x_end,
            y_start=row_top,
            y_end=row_bottom,
            clip_id=clip_spec.id,
            expected_frame_count=clip_spec.frame_count,
            cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
            suppress_presentation_artifacts=True,
        )

        if len(component_frames) >= 2 and character_frames_are_plausible(component_frames):
            frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
        else:
            frames = extract_frames_from_region(
                image=image,
                x_start=x_start,
                x_end=x_end,
                y_start=row_top,
                y_end=row_bottom,
                frame_count=clip_spec.frame_count,
                clip_id=clip_spec.id,
                suppress_presentation_artifacts=True,
            )
            frames = postprocess_character_frames(frames, subject.id, clip_spec.id)
            frames = resample_frames_to_count(frames, clip_spec.frame_count)

        frames = repair_runtime_strip_outliers(frames)
        frames = stabilize_character_clip_frames(frames)
        strip = fit_strip_frames(
            frames,
            max_scale=get_subject_clip_fit_max_scale(
                subject.id,
                clip_spec.id,
                1.34 if clip_spec.id == "down_or_death" else 1.26,
            ),
        )
        strip = cleanup_runtime_bright_residue_strip(strip)
        strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
        strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
        clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": "character",
        "clips": clips,
    }


def extract_hero_package_subject(subject: SubjectSpec, image: Image.Image) -> dict:
    clips: list[dict] = []

    for (clip_spec,) in subject.rows:
        source_boxes = HERO_PACKAGE_MANUAL_SOURCE_BOXES.get(clip_spec.id)
        if source_boxes is None:
            continue

        frames = [extract_frame_from_source_box_raw_alpha(image, source_box) for source_box in source_boxes]
        frames = resample_frames_to_count(frames, clip_spec.frame_count)
        frames = repair_runtime_strip_outliers(frames)
        frames = stabilize_character_clip_frames(frames)
        strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
        strip = cleanup_runtime_bright_residue_strip(strip)
        strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
        clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": "character",
        "clips": clips,
    }


def find_dense_row_segments(active_rows: np.ndarray, min_length: int = 8) -> list[tuple[int, int]]:
    segments: list[tuple[int, int]] = []
    start: int | None = None

    for index, is_active in enumerate(active_rows):
        if is_active and start is None:
            start = index
        elif not is_active and start is not None:
            if index - start >= min_length:
                segments.append((start, index - 1))
            start = None

    if start is not None and active_rows.shape[0] - start >= min_length:
        segments.append((start, active_rows.shape[0] - 1))

    return segments


def should_use_numbered_row_source_box_extraction(subject_id: str, clip_id: str) -> bool:
    if (
        clip_id in MANUAL_SOURCE_BOX_CLIP_SPECS.get(subject_id, {})
        and not (
            subject_id in FORCE_LEGACY_REFRESH_SUBJECT_IDS
            and MANUAL_SOURCE_BOX_IMAGE_OVERRIDES.get(subject_id, {}).get(clip_id) != "approved_master"
        )
    ):
        return False
    if clip_id in PACKAGE_PANEL_MANUAL_SOURCE_BOXES.get(subject_id, {}):
        return False
    if subject_id in NUMBERED_ROW_SOURCE_BOX_SUBJECT_IDS:
        return True
    return clip_id in NUMBERED_ROW_SOURCE_BOX_SUBJECT_CLIPS.get(subject_id, set())


def merge_close_numeric_centers(centers: list[float], merge_threshold: float = 14.0) -> list[float]:
    if not centers:
        return []

    centers = sorted(centers)
    groups: list[list[float]] = [[centers[0]]]

    for center in centers[1:]:
        if center - groups[-1][-1] <= merge_threshold:
            groups[-1].append(center)
        else:
            groups.append([center])

    return [float(sum(group) / len(group)) for group in groups]


def should_use_approved_master_box_extraction(subject_id: str, clip_id: str) -> bool:
    if subject_id not in FORCE_APPROVED_MASTER_SOURCE_SUBJECT_IDS:
        return False
    if (
        clip_id in MANUAL_SOURCE_BOX_CLIP_SPECS.get(subject_id, {})
        and not (
            subject_id in FORCE_LEGACY_REFRESH_SUBJECT_IDS
            and MANUAL_SOURCE_BOX_IMAGE_OVERRIDES.get(subject_id, {}).get(clip_id) != "approved_master"
        )
    ):
        return False
    if clip_id in PACKAGE_PANEL_MANUAL_SOURCE_BOXES.get(subject_id, {}):
        return False
    return clip_id in APPROVED_MASTER_CLIP_SOURCE_BOXES.get(subject_id, {})


def get_subject_clip_fit_max_scale(subject_id: str, clip_id: str, default: float = 1.0) -> float:
    override = FIT_STRIP_MAX_SCALE_OVERRIDES.get(subject_id, {}).get(clip_id)
    if override is None:
        return default
    return float(override)


def get_subject_clip_post_fit_scale(subject_id: str, clip_id: str) -> float:
    override = POST_FIT_STRIP_SCALE_OVERRIDES.get(subject_id, {}).get(clip_id)
    if override is not None:
        return float(override)
    if clip_id in FRAME_MARGIN_POST_SCALE_SUBJECT_CLIPS.get(subject_id, set()):
        return 0.92
    return 1.0


def should_use_approved_master_for_manual_source_boxes(subject_id: str, clip_id: str) -> bool:
    return MANUAL_SOURCE_BOX_IMAGE_OVERRIDES.get(subject_id, {}).get(clip_id) == "approved_master"


def should_defer_manual_source_boxes_to_legacy_targeting(subject_id: str, clip_id: str) -> bool:
    return (subject_id == "sera" and clip_id == "walk") or subject_id == "luna"


def should_use_full_height_legacy_refresh_source_box_extraction(subject_id: str, clip_id: str) -> bool:
    return clip_id in FULL_HEIGHT_LEGACY_REFRESH_SOURCE_BOX_SUBJECT_CLIPS.get(subject_id, set())


def repair_non_character_frame_outliers(frames: list[ExtractedFrame]) -> list[ExtractedFrame]:
    if len(frames) < 2:
        return frames

    bad_indices: set[int] = set()

    for index, frame in enumerate(frames):
        rgba = np.array(frame.image.convert("RGBA"))
        alpha_mask = rgba[:, :, 3] > 0
        coords = np.argwhere(alpha_mask)

        if coords.size == 0:
            bad_indices.add(index)
            continue

        min_y = int(coords[:, 0].min())
        max_y = int(coords[:, 0].max())
        min_x = int(coords[:, 1].min())
        max_x = int(coords[:, 1].max())
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        area = int(alpha_mask.sum())
        _, components = label_connected_components(alpha_mask)
        largest_area = max((component.area for component in components), default=0)
        dominant_ratio = largest_area / max(area, 1)
        too_short = height <= 16
        too_small = area <= 220
        too_wide = width >= max(56, int(height * 1.7))
        fragmented = len(components) >= 3 and dominant_ratio < 0.78

        if too_short or too_small or too_wide or fragmented:
            bad_indices.add(index)

    if not bad_indices:
        return frames

    good_indices = [index for index in range(len(frames)) if index not in bad_indices]
    if not good_indices:
        return frames

    repaired: list[ExtractedFrame] = []
    for index, frame in enumerate(frames):
        if index not in bad_indices:
            repaired.append(frame)
            continue
        replacement_index = min(good_indices, key=lambda candidate: abs(candidate - index))
        replacement = frames[replacement_index]
        repaired.append(
            ExtractedFrame(
                image=replacement.image.copy(),
                anchor_x=replacement.anchor_x,
                anchor_y=replacement.anchor_y,
            )
        )

    return repaired


def extract_frames_from_approved_master_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    target_count: int,
) -> list[ExtractedFrame]:
    crop_rgba = np.array(remove_checkerboard_background(image.crop(source_box)).convert("RGBA"))
    analysis_mask = build_character_analysis_mask(crop_rgba)
    analysis_mask = suppress_presentation_frame_components(analysis_mask)
    analysis_mask = suppress_showcase_outlier_component(analysis_mask)
    analysis_mask = suppress_row_ground_strip_components(analysis_mask)

    if not analysis_mask.any():
        return []

    row_activity = analysis_mask.sum(axis=1)
    active_rows = row_activity > 0
    if not active_rows.any():
        return []

    row_threshold = max(8, int(np.percentile(row_activity[row_activity > 0], 40)))
    row_segments = find_dense_row_segments(row_activity >= row_threshold, min_length=max(10, crop_rgba.shape[0] // 6))
    if not row_segments:
        row_segments = find_dense_row_segments(active_rows, min_length=max(10, crop_rgba.shape[0] // 7))
    if not row_segments:
        return []

    def row_segment_score(segment: tuple[int, int]) -> float:
        start, end = segment
        height = end - start + 1
        activity_score = float(row_activity[start : end + 1].sum())
        top_penalty = 220.0 if start <= crop_rgba.shape[0] * 0.14 else 0.0
        return activity_score + (height * 24.0) - top_penalty

    band_top, band_bottom = max(row_segments, key=row_segment_score)
    band_top = max(0, band_top - 6)
    band_bottom = min(crop_rgba.shape[0], band_bottom + 8)
    peak_bottom = min(crop_rgba.shape[0], band_top + max(24, int((band_bottom - band_top) * 0.6)))
    peak_band = analysis_mask[band_top:peak_bottom, :]
    column_activity = peak_band.sum(axis=0).astype(np.float32)

    if not np.any(column_activity > 0):
        column_activity = analysis_mask[band_top:band_bottom, :].sum(axis=0).astype(np.float32)

    kernel_size = max(9, min(21, (crop_rgba.shape[1] // max(target_count * 3, 1)) * 2 + 1))
    smooth_kernel = np.ones(kernel_size, dtype=np.float32) / float(kernel_size)
    smoothed = np.convolve(column_activity, smooth_kernel, mode="same")
    positive_columns = smoothed[smoothed > 0]
    if positive_columns.size == 0:
        return []

    peak_threshold = float(np.percentile(positive_columns, 60))
    min_distance = max(24, int(crop_rgba.shape[1] / max(target_count * 1.8, 8)))
    raw_peaks: list[tuple[int, float]] = []
    for index in range(min_distance, len(smoothed) - min_distance):
        if smoothed[index] < peak_threshold:
            continue
        local = smoothed[index - min_distance : index + min_distance + 1]
        if smoothed[index] == local.max():
            raw_peaks.append((index, float(smoothed[index])))

    chosen_peaks: list[tuple[int, float]] = []
    for index, value in sorted(raw_peaks, key=lambda item: item[1], reverse=True):
        if all(abs(index - existing_index) > min_distance for existing_index, _ in chosen_peaks):
            chosen_peaks.append((index, value))

    centers = sorted(index for index, _ in chosen_peaks)
    if not centers:
        return []

    if len(centers) > target_count:
        sample_indices = [
            int(round((target_index / max(target_count - 1, 1)) * (len(centers) - 1)))
            for target_index in range(target_count)
        ]
        centers = [centers[index] for index in sample_indices]

    gaps = [centers[index + 1] - centers[index] for index in range(len(centers) - 1)]
    step = float(np.median(gaps)) if gaps else max(48.0, crop_rgba.shape[1] / max(target_count, 1))
    boundaries = [max(0.0, centers[0] - (step * 0.48))]
    for index in range(len(centers) - 1):
        boundaries.append((centers[index] + centers[index + 1]) / 2.0)
    boundaries.append(min(float(crop_rgba.shape[1]), centers[-1] + (step * 0.48)))

    frames: list[ExtractedFrame] = []
    for index, center in enumerate(centers):
        local_left = int(round(max(0.0, boundaries[index] - 2.0)))
        local_right = int(round(min(float(crop_rgba.shape[1]), boundaries[index + 1] + 2.0)))
        absolute_source_box = (
            source_box[0] + local_left,
            source_box[1] + band_top,
            source_box[0] + local_right,
            source_box[1] + band_bottom,
        )
        frames.append(
            extract_frame_from_source_box_targeted_raw_alpha(
                image=image,
                source_box=absolute_source_box,
                preferred_center_x=float(center - local_left),
            )
        )

    frames = repair_non_character_frame_outliers(frames)
    frames = resample_frames_to_count(frames, target_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = repair_non_character_frame_outliers(frames)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
    frames = stabilize_character_clip_frames(frames)
    return frames


def extract_frames_from_full_height_source_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    target_count: int,
) -> list[ExtractedFrame]:
    crop_rgba = np.array(remove_checkerboard_background(image.crop(source_box)).convert("RGBA"))
    analysis_mask = build_character_analysis_mask(crop_rgba)
    analysis_mask = suppress_presentation_frame_components(analysis_mask)
    analysis_mask = suppress_showcase_outlier_component(analysis_mask)
    analysis_mask = suppress_row_ground_strip_components(analysis_mask)

    if not analysis_mask.any():
        return []

    row_activity = analysis_mask.sum(axis=1)
    active_rows = row_activity > 0
    if not active_rows.any():
        return []

    row_threshold = max(8, int(np.percentile(row_activity[row_activity > 0], 40)))
    row_segments = find_dense_row_segments(row_activity >= row_threshold, min_length=max(10, crop_rgba.shape[0] // 6))
    if not row_segments:
        row_segments = find_dense_row_segments(active_rows, min_length=max(10, crop_rgba.shape[0] // 7))
    if not row_segments:
        return []

    def row_segment_score(segment: tuple[int, int]) -> float:
        start, end = segment
        height = end - start + 1
        activity_score = float(row_activity[start : end + 1].sum())
        top_penalty = 220.0 if start <= crop_rgba.shape[0] * 0.14 else 0.0
        return activity_score + (height * 24.0) - top_penalty

    band_top, band_bottom = max(row_segments, key=row_segment_score)
    band_top = max(0, band_top - 6)
    band_bottom = min(crop_rgba.shape[0], band_bottom + 8)
    peak_bottom = min(crop_rgba.shape[0], band_top + max(24, int((band_bottom - band_top) * 0.6)))
    peak_band = analysis_mask[band_top:peak_bottom, :]
    column_activity = peak_band.sum(axis=0).astype(np.float32)

    if not np.any(column_activity > 0):
        column_activity = analysis_mask[band_top:band_bottom, :].sum(axis=0).astype(np.float32)

    kernel_size = max(9, min(21, (crop_rgba.shape[1] // max(target_count * 3, 1)) * 2 + 1))
    smooth_kernel = np.ones(kernel_size, dtype=np.float32) / float(kernel_size)
    smoothed = np.convolve(column_activity, smooth_kernel, mode="same")
    positive_columns = smoothed[smoothed > 0]
    if positive_columns.size == 0:
        return []

    peak_threshold = float(np.percentile(positive_columns, 60))
    min_distance = max(24, int(crop_rgba.shape[1] / max(target_count * 1.8, 8)))
    raw_peaks: list[tuple[int, float]] = []
    for index in range(min_distance, len(smoothed) - min_distance):
        if smoothed[index] < peak_threshold:
            continue
        local = smoothed[index - min_distance : index + min_distance + 1]
        if smoothed[index] == local.max():
            raw_peaks.append((index, float(smoothed[index])))

    chosen_peaks: list[tuple[int, float]] = []
    for index, value in sorted(raw_peaks, key=lambda item: item[1], reverse=True):
        if all(abs(index - existing_index) > min_distance for existing_index, _ in chosen_peaks):
            chosen_peaks.append((index, value))

    centers = [float(index) for index, _ in sorted(chosen_peaks, key=lambda item: item[0])]
    if not centers:
        return []

    if len(centers) > target_count:
        sample_indices = [
            int(round((target_index / max(target_count - 1, 1)) * (len(centers) - 1)))
            for target_index in range(target_count)
        ]
        centers = [centers[index] for index in sample_indices]

    if len(centers) < target_count:
        if len(centers) == 1:
            inferred_step = max(48.0, crop_rgba.shape[1] / max(target_count, 1))
        else:
            inferred_step = float(np.median([centers[index + 1] - centers[index] for index in range(len(centers) - 1)]))

        expanded_centers = [float(center) for center in centers]
        safety = 0
        while len(expanded_centers) < target_count and safety < target_count * 3:
            left_candidate = expanded_centers[0] - inferred_step
            right_candidate = expanded_centers[-1] + inferred_step
            left_margin = expanded_centers[0]
            right_margin = crop_rgba.shape[1] - expanded_centers[-1]

            if right_margin >= left_margin and right_candidate <= crop_rgba.shape[1] - 4:
                expanded_centers.append(right_candidate)
            elif left_candidate >= 4:
                expanded_centers.insert(0, left_candidate)
            elif right_candidate <= crop_rgba.shape[1] + (inferred_step * 0.35):
                expanded_centers.append(min(float(crop_rgba.shape[1] - 4), right_candidate))
            else:
                break
            safety += 1

        centers = expanded_centers
        if len(centers) < target_count:
            start = centers[0]
            end = centers[-1] if len(centers) > 1 else centers[0] + (inferred_step * max(target_count - 1, 1))
            centers = np.linspace(start, end, target_count).tolist()

    centers = centers[:target_count]
    gaps = [centers[index + 1] - centers[index] for index in range(len(centers) - 1)]
    step = float(np.median(gaps)) if gaps else max(48.0, crop_rgba.shape[1] / max(target_count, 1))
    boundaries = [max(0.0, centers[0] - (step * 0.48))]
    for index in range(len(centers) - 1):
        boundaries.append((centers[index] + centers[index + 1]) / 2.0)
    boundaries.append(min(float(crop_rgba.shape[1]), centers[-1] + (step * 0.48)))

    frames: list[ExtractedFrame] = []
    for index, center in enumerate(centers):
        local_left = int(round(max(0.0, boundaries[index] - 2.0)))
        local_right = int(round(min(float(crop_rgba.shape[1]), boundaries[index + 1] + 2.0)))
        absolute_source_box = (
            source_box[0] + local_left,
            source_box[1],
            source_box[0] + local_right,
            source_box[3],
        )
        frames.append(
            extract_frame_from_source_box_targeted_raw_alpha(
                image=image,
                source_box=absolute_source_box,
                preferred_center_x=float(center - local_left),
            )
        )

    frames = resample_frames_to_count(frames, target_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
    frames = stabilize_character_clip_frames(frames)
    return frames


def extract_frames_from_numbered_row_region(
    image: Image.Image,
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    target_count: int,
) -> list[ExtractedFrame]:
    region = remove_checkerboard_background(image.crop((x_start, y_start, x_end, y_end))).convert("RGBA")
    rgba = np.array(region)
    alpha_mask = rgba[:, :, 3] > 0
    if not alpha_mask.any():
        return []

    height, width = alpha_mask.shape
    lower_band_top = int(round(height * 0.62))
    lower_band = alpha_mask[lower_band_top:, :]
    _, components = label_connected_components(lower_band)
    numeric_boxes: list[tuple[int, int, int, int]] = []

    for component in components:
        component_width = component.max_x - component.min_x + 1
        component_height = component.max_y - component.min_y + 1
        if 12 <= component.area <= 160 and component_width <= 18 and 8 <= component_height <= 18:
            numeric_boxes.append(
                (
                    component.min_x,
                    component.max_x,
                    component.min_y + lower_band_top,
                    component.max_y + lower_band_top,
                )
            )

    if not numeric_boxes:
        return []

    numeric_centers = [((box[0] + box[1]) / 2.0) for box in numeric_boxes]
    merged_centers = merge_close_numeric_centers(numeric_centers)
    if len(merged_centers) < 2:
        return []

    top_of_numbers = min(box[2] for box in numeric_boxes)
    frame_bottom = max(y_start + 40, y_start + top_of_numbers - 4)
    gaps = [merged_centers[index + 1] - merged_centers[index] for index in range(len(merged_centers) - 1)]
    median_gap = float(np.median(gaps)) if gaps else 72.0
    half_width = max(26, int(round(median_gap * 0.42)))

    source_boxes = [
        (
            int(round(x_start + center - half_width)),
            y_start,
            int(round(x_start + center + half_width)),
            frame_bottom,
        )
        for center in merged_centers
    ]

    frames = [extract_frame_from_source_box_raw_alpha(image, source_box) for source_box in source_boxes]
    frames = resample_frames_to_count(frames, target_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
    frames = stabilize_character_clip_frames(frames)
    return frames


def detect_package_panel_content_band(
    image: Image.Image,
    panel_box: PackagePanelBox,
) -> tuple[int, int]:
    inset = 4
    x_start = max(0, panel_box.x_start + inset)
    x_end = min(image.size[0], panel_box.x_end - inset)
    y_start = max(0, panel_box.y_start + inset)
    y_end = min(image.size[1], panel_box.y_end - inset)

    if x_end <= x_start or y_end <= y_start:
        return panel_box.y_start, panel_box.y_end

    panel_crop = remove_checkerboard_background(
        remove_package_card_background(image.crop((x_start, y_start, x_end, y_end)))
    )
    panel_rgba = np.array(panel_crop.convert("RGBA"))
    analysis_mask = build_character_analysis_mask(panel_rgba)
    analysis_mask = suppress_presentation_frame_components(analysis_mask)
    analysis_mask = suppress_showcase_outlier_component(analysis_mask)
    analysis_mask = suppress_row_ground_strip_components(analysis_mask)

    if not analysis_mask.any():
        return panel_box.y_start, panel_box.y_end

    row_activity = analysis_mask.sum(axis=1)
    activity_threshold = max(8, int(panel_rgba.shape[1] * 0.025))
    segments = find_dense_row_segments(row_activity >= activity_threshold, min_length=max(8, panel_rgba.shape[0] // 10))

    if not segments:
        return panel_box.y_start, panel_box.y_end

    def score_segment(segment: tuple[int, int]) -> float:
        start, end = segment
        height = end - start + 1
        activity_score = float(row_activity[start : end + 1].sum())
        edge_penalty = 0.0
        if start <= 6:
            edge_penalty += 160.0
        if end >= panel_rgba.shape[0] - 7:
            edge_penalty += 120.0
        return activity_score + (height * 18.0) - edge_penalty

    best_start, best_end = max(segments, key=score_segment)
    band_top = max(panel_box.y_start, y_start + best_start - 4)
    band_bottom = min(panel_box.y_end, y_start + best_end + 4)

    if band_bottom - band_top < 36:
        return panel_box.y_start, panel_box.y_end

    return band_top, band_bottom


def build_package_panel_slot_source_boxes(
    image: Image.Image,
    panel_box: PackagePanelBox,
    frame_count: int,
    clip_id: str | None = None,
) -> tuple[tuple[int, int, int, int], ...]:
    panel_width = panel_box.x_end - panel_box.x_start
    panel_height = panel_box.y_end - panel_box.y_start
    inset_x = max(6, int(round(panel_width * 0.015)))
    slot_left = max(0, panel_box.x_start + inset_x)
    slot_right = min(image.size[0], panel_box.x_end - inset_x)
    attack_like_clip_ids = {
        "attack_basic_01",
        "attack_basic_02",
        "attack_basic_03",
        "heavy_attack",
        "charge",
        "skill_cast",
        "cast_start",
        "cast_loop",
        "cast_release",
        "summon_or_rune",
        "dash_or_dodge",
        "hit_react",
        "buff_cast",
        "heal_cast",
    }
    low_trim_clip_ids = {
        "down_or_death",
        "victory",
        "town_idle",
        "talk",
        "interact",
        "pray_idle",
        "taunt_or_command",
    }
    if clip_id in attack_like_clip_ids:
        top_trim = max(24, int(round(panel_height * 0.32)))
    elif clip_id in low_trim_clip_ids:
        top_trim = max(18, int(round(panel_height * 0.22)))
    else:
        top_trim = max(20, int(round(panel_height * 0.28)))
    bottom_trim = max(6, int(round(panel_height * 0.05)))
    band_top = max(0, panel_box.y_start + top_trim)
    band_bottom = min(image.size[1], panel_box.y_end - bottom_trim)

    if slot_right <= slot_left or band_bottom <= band_top:
        return ()

    band_crop = np.array(image.crop((slot_left, band_top, slot_right, band_bottom)).convert("RGBA"))
    band_rgb = band_crop[:, :, :3].astype(np.float32)
    gray = band_rgb.mean(axis=2)
    horizontal_energy = np.pad(np.abs(np.diff(gray, axis=1)).sum(axis=0), (0, 1))
    vertical_energy = np.pad(np.abs(np.diff(gray, axis=0)).sum(axis=0), (0, 0), constant_values=0)[: gray.shape[1]]
    energy = horizontal_energy + vertical_energy
    smooth_energy = np.convolve(energy, np.ones(11, dtype=np.float32) / 11.0, mode="same")

    min_gap = max(18, int(round((slot_right - slot_left) / max(frame_count * 1.5, 1))))
    peak_values = smooth_energy.copy()
    local_centers: list[int] = []
    for _ in range(frame_count):
        peak_index = int(np.argmax(peak_values))
        if peak_values[peak_index] <= 0:
            break
        local_centers.append(peak_index)
        mute_left = max(0, peak_index - min_gap)
        mute_right = min(peak_values.shape[0], peak_index + min_gap + 1)
        peak_values[mute_left:mute_right] = -1

    local_centers = sorted(local_centers)
    if len(local_centers) != frame_count:
        slot_width = (slot_right - slot_left) / max(frame_count, 1)
        local_centers = [int(round((index + 0.5) * slot_width)) for index in range(frame_count)]

    slot_width = (slot_right - slot_left) / max(frame_count, 1)
    max_center_offset = max(10, int(round(slot_width * 0.18)))
    clamped_centers: list[int] = []
    for index, local_center in enumerate(local_centers):
        nominal_center = int(round((index + 0.5) * slot_width))
        clamped_centers.append(
            int(
                min(
                    max(local_center, nominal_center - max_center_offset),
                    nominal_center + max_center_offset,
                )
            )
        )
    local_centers = clamped_centers

    half_width = max(22, int(round(slot_width * 0.32)))
    source_boxes: list[tuple[int, int, int, int]] = []
    for local_center in local_centers:
        center_x = slot_left + local_center
        source_boxes.append(
            (
                center_x - half_width,
                band_top,
                center_x + half_width,
                band_bottom,
            )
        )
    clamped_boxes: list[tuple[int, int, int, int]] = []
    for raw_x_start, raw_y_start, raw_x_end, raw_y_end in source_boxes:
        clamped_boxes.append(
            (
                max(0, raw_x_start),
                max(0, raw_y_start),
                min(image.size[0], raw_x_end),
                min(image.size[1], raw_y_end),
            )
        )
    return tuple(clamped_boxes)


def extract_frames_from_package_panel_slots(
    image: Image.Image,
    panel_box: PackagePanelBox,
    frame_count: int,
    clip_id: str | None = None,
) -> list[ExtractedFrame]:
    source_boxes = build_package_panel_slot_source_boxes(image, panel_box, frame_count, clip_id=clip_id)
    if not source_boxes:
        return []

    rembg_frames = extract_package_frames_from_source_boxes_rembg(
        image,
        source_boxes,
        frame_count,
    )
    if len(rembg_frames) >= max(2, frame_count // 2):
        return rembg_frames

    def score_frame(frame: ExtractedFrame) -> float:
        frame_rgba = np.array(frame.image.convert("RGBA"))
        alpha_mask = frame_rgba[:, :, 3] > 0
        coords = np.argwhere(alpha_mask)
        if coords.size == 0:
            return -1e9
        left_edge = float(alpha_mask[:, :2].sum())
        right_edge = float(alpha_mask[:, -2:].sum())
        top_edge = float(alpha_mask[:4, :].sum())
        min_y = int(coords[:, 0].min())
        max_y = int(coords[:, 0].max())
        min_x = int(coords[:, 1].min())
        max_x = int(coords[:, 1].max())
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        area = int(coords.shape[0])
        touch_penalty = 0.0
        if min_x <= 1:
            touch_penalty += 220.0
        if max_x >= frame_rgba.shape[1] - 2:
            touch_penalty += 220.0
        if min_y <= 1:
            touch_penalty += 180.0
        return float(area) + (height * 10.0) + (width * 2.0) - (left_edge * 3.0) - (right_edge * 3.0) - (top_edge * 4.0) - touch_penalty

    frames: list[ExtractedFrame] = []
    for source_box in source_boxes:
        x_start, y_start, x_end, y_end = source_box
        shift_x = max(8, int(round((x_end - x_start) * 0.16)))
        candidates = [
            source_box,
            (x_start + shift_x, y_start, x_end + shift_x, y_end),
            (x_start - shift_x, y_start, x_end - shift_x, y_end),
        ]
        extracted_candidates: list[ExtractedFrame] = []
        for candidate_box in candidates:
            adjusted_box = (
                max(0, candidate_box[0]),
                max(0, candidate_box[1]),
                min(image.size[0], candidate_box[2]),
                min(image.size[1], candidate_box[3]),
            )
            extracted_candidates.append(
                extract_frame_from_package_source_box(
                    image,
                    adjusted_box,
                    expand_source_box=False,
                )
            )
        frames.append(max(extracted_candidates, key=score_frame))
    nonempty_frames = [frame for frame in frames if frame.image.getbbox() is not None]
    if len(nonempty_frames) < max(2, frame_count // 2):
        return []

    frames = resample_frames_to_count(frames, frame_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
    frames = stabilize_character_clip_frames(frames)
    return frames


def extract_frames_from_package_panel(
    image: Image.Image,
    subject_id: str,
    clip_id: str,
    panel_box: PackagePanelBox,
    frame_count: int,
) -> list[ExtractedFrame]:
    if subject_id != "hero":
        slot_frames = extract_frames_from_package_panel_slots(
            image=image,
            panel_box=panel_box,
            frame_count=frame_count,
            clip_id=clip_id,
        )
        if slot_frames:
            return slot_frames

    inset_left = 8
    inset_right = 8
    inset_top = 18
    inset_bottom = 8
    x_start = max(panel_box.x_start + inset_left, 0)
    x_end = min(panel_box.x_end - inset_right, image.size[0])
    y_start = max(panel_box.y_start + inset_top, 0)
    y_end = min(panel_box.y_end - inset_bottom, image.size[1])
    panel_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop((x_start, y_start, x_end, y_end)))
    )
    local_x_start = 0
    local_y_start = 0
    local_x_end = panel_image.size[0]
    local_y_end = panel_image.size[1]

    prefer_direct_grid = subject_id != "hero"

    if prefer_direct_grid:
        frames = extract_frames_from_region(
            image=panel_image,
            x_start=local_x_start,
            x_end=local_x_end,
            y_start=local_y_start,
            y_end=local_y_end,
            frame_count=frame_count,
            clip_id=clip_id,
            suppress_presentation_artifacts=True,
        )
        frames = postprocess_character_frames(frames, subject_id, clip_id)
        component_frames = extract_component_frames_from_region(
            image=panel_image,
            x_start=local_x_start,
            x_end=local_x_end,
            y_start=local_y_start,
            y_end=local_y_end,
            clip_id=clip_id,
            expected_frame_count=frame_count,
            cleanup_character_artifacts=True,
            suppress_presentation_artifacts=True,
        )
        if len(component_frames) >= 2 and character_frames_are_plausible(component_frames):
            direct_nonempty = sum(1 for frame in frames if frame.image.getbbox() is not None)
            component_nonempty = sum(1 for frame in component_frames if frame.image.getbbox() is not None)
            if component_nonempty > direct_nonempty + 1:
                frames = resample_frames_to_count(component_frames, frame_count)
    else:
        component_frames = extract_component_frames_from_region(
            image=panel_image,
            x_start=local_x_start,
            x_end=local_x_end,
            y_start=local_y_start,
            y_end=local_y_end,
            clip_id=clip_id,
            expected_frame_count=frame_count,
            cleanup_character_artifacts=True,
            suppress_presentation_artifacts=True,
        )

        if len(component_frames) >= 2 and character_frames_are_plausible(component_frames):
            frames = resample_frames_to_count(component_frames, frame_count)
        else:
            frames = extract_frames_from_region(
                image=panel_image,
                x_start=local_x_start,
                x_end=local_x_end,
                y_start=local_y_start,
                y_end=local_y_end,
                frame_count=frame_count,
                clip_id=clip_id,
                suppress_presentation_artifacts=True,
            )
            frames = postprocess_character_frames(frames, subject_id, clip_id)
    frames = resample_frames_to_count(frames, frame_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = stabilize_character_clip_frames(frames)
    return frames


def extract_package_panel_subject(
    subject: SubjectSpec,
    image: Image.Image,
    panel_boxes: dict[str, PackagePanelBox],
) -> dict:
    clips: list[dict] = []

    for (clip_spec,) in subject.rows:
        package_rembg_source_boxes = PACKAGE_PANEL_REMBG_SOURCE_BOXES.get(subject.id, {}).get(clip_spec.id)
        package_manual_source_boxes = PACKAGE_PANEL_MANUAL_SOURCE_BOXES.get(subject.id, {}).get(clip_spec.id)

        if package_rembg_source_boxes is not None:
            frames = extract_package_frames_from_source_boxes_rembg(
                image,
                package_rembg_source_boxes,
                clip_spec.frame_count,
            )
            if not frames:
                frames = [
                    extract_frame_from_package_source_box(
                        image,
                        source_box,
                        expand_source_box=False,
                    )
                    for source_box in package_rembg_source_boxes
                ]
                frames = resample_frames_to_count(frames, clip_spec.frame_count)
                frames = repair_runtime_strip_outliers(frames)
                frames = normalize_character_frame_scale(frames)
                frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
                frames = stabilize_character_clip_frames(frames)
        elif package_manual_source_boxes is not None:
            frames = extract_subject_package_manual_frames(
                subject_id=subject.id,
                clip_id=clip_spec.id,
                image=image,
                source_boxes=package_manual_source_boxes,
            )
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = normalize_character_frame_scale(frames)
            frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
            frames = stabilize_character_clip_frames(frames)
        else:
            panel_box = panel_boxes.get(clip_spec.id)
            if panel_box is None:
                continue

            derived_source_boxes = build_package_panel_even_source_boxes(
                panel_box,
                clip_spec.frame_count,
            )
            frames = [
                extract_frame_from_package_source_box(
                    image,
                    source_box,
                    expand_source_box=False,
                )
                for source_box in derived_source_boxes
            ]
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = normalize_character_frame_scale(frames)
            frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
            frames = stabilize_character_clip_frames(frames)

            plausible_frame_count = sum(1 for frame in frames if frame.image.getbbox() is not None)
            if plausible_frame_count < max(2, clip_spec.frame_count // 2):
                source_clip_id = panel_box.source_clip_id or clip_spec.id
                frames = extract_frames_from_package_panel(
                    image=image,
                    subject_id=subject.id,
                    clip_id=source_clip_id,
                    panel_box=panel_box,
                    frame_count=clip_spec.frame_count,
                )
        strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
        strip = cleanup_runtime_bright_residue_strip(strip)
        strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
        clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": "character",
        "clips": clips,
    }


def extract_single_layout_subject(subject: SubjectSpec, image: Image.Image) -> dict:
    if subject.id == "hero":
        hero_legacy_image = load_hero_legacy_master_image()
        if hero_legacy_image is not None:
            try:
                return extract_hero_from_legacy_master_sheet(subject, hero_legacy_image)
            except RuntimeError:
                pass

    package_panel_image = None
    if subject.id not in FORCE_LEGACY_REFRESH_SUBJECT_IDS:
        package_panel_image = load_package_panel_image(subject.id)
    if (
        package_panel_image is not None
        and subject.id in PACKAGE_PANEL_BOXES
        and subject.id in PACKAGE_PANEL_FULL_SUBJECT_IDS
        and subject.id != "hero"
    ):
        return extract_package_panel_subject(subject, package_panel_image, PACKAGE_PANEL_BOXES[subject.id])

    if subject.id == "hero":
        return extract_hero_manual_subject(subject, image, package_panel_image)

    manual_specs = MANUAL_CLIP_EXTRACTION_SPECS.get(subject.id, {})
    region_manual_specs = REGION_MANUAL_CLIP_EXTRACTION_SPECS.get(subject.id, {})
    manual_source_box_specs = MANUAL_SOURCE_BOX_CLIP_SPECS.get(subject.id, {})
    approved_master_image: Image.Image | None = None
    label_boxes = detect_label_boxes(np.array(image)[:, :, :3], min_y=105, max_width=180, x_end=190)
    label_boxes = [box for box in label_boxes if box[1] >= 100]
    row_groups = build_label_row_groups(label_boxes, tolerance=28)
    expected_row_count = sum(row[0].row_span for row in subject.rows)
    paired_row_count = max(1, (len(subject.rows) + 1) // 2)
    looks_auto_paired = (
        image.size[0] >= 1000
        and len(row_groups) < expected_row_count
        and len(row_groups) >= max(2, paired_row_count - 1)
        and len(row_groups) <= paired_row_count + 1
    )
    if (
        image.size[0] >= 1000
        and subject.id not in AUTO_PAIRED_SINGLE_LAYOUT_SKIP_SUBJECT_IDS
        and (subject.id in AUTO_PAIRED_SINGLE_LAYOUT_IDS or looks_auto_paired)
    ):
        return extract_auto_paired_single_layout_subject(
            subject,
            image,
            label_boxes=label_boxes,
            row_groups=row_groups,
            manual_specs=manual_specs,
            region_manual_specs=region_manual_specs,
            manual_source_box_specs=manual_source_box_specs,
        )

    label_right_edge = max((box[2] for box in label_boxes), default=166)
    content_x_start = min(max(190, label_right_edge + 24), max(190, image.size[0] - 64))
    content_segments = detect_foreground_row_segments(image, content_x_start)

    cleaned = remove_checkerboard_background(image)
    foreground_bbox = cleaned.getchannel("A").getbbox()
    min_y = max(100, foreground_bbox[1] if foreground_bbox is not None else 100)
    max_y = min(image.size[1] - 12, foreground_bbox[3] if foreground_bbox is not None else image.size[1] - 12)
    label_center_offset = 0.0
    if label_boxes:
        label_heights = [box[3] - box[1] + 1 for box in label_boxes]
        label_center_offset = max(26.0, float(np.median(label_heights)) * 0.8)

    exact_row_boxes = build_exact_row_boxes_from_groups(
        row_groups,
        expected_count=expected_row_count,
        min_y=min_y,
        max_y=max_y,
        top_margin=18 if subject.id in FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS else 10,
    )

    if subject.id in FORCE_UNIFORM_SINGLE_ROW_BAND_SUBJECT_IDS:
        bands = build_uniform_bands_with_min_top(
            image,
            expected_row_count,
            min_top=max(124, min_y + 8),
            max_bottom=max_y,
        )
    elif exact_row_boxes is not None:
        bands = exact_row_boxes
    elif len(label_boxes) == expected_row_count:
        centers = [((box[1] + box[3]) / 2) + label_center_offset for box in label_boxes]
        bands = build_row_boundaries(centers, min_y=min_y, max_y=max_y)
    elif len(label_boxes) >= max(2, expected_row_count - 2):
        observed_centers = [((box[1] + box[3]) / 2) + label_center_offset for box in label_boxes]
        centers = reconstruct_row_centers(observed_centers, expected_row_count, min_y=min_y, max_y=max_y)
        bands = build_row_boundaries(centers, min_y=min_y, max_y=max_y)
    elif len(content_segments) >= max(2, expected_row_count // 2):
        observed_centers = [((top + bottom) / 2) for top, bottom in content_segments]
        centers = reconstruct_row_centers(observed_centers, expected_row_count, min_y=min_y, max_y=max_y)
        bands = build_row_boundaries(centers, min_y=min_y, max_y=max_y)
    else:
        bands = build_uniform_bands_with_min_top(
            image,
            expected_row_count,
            min_top=max(128, min_y + 32),
            max_bottom=max_y,
        )

    clips: list[dict] = []

    band_index = 0
    for (clip_spec,) in subject.rows:
        band_top = bands[band_index][0]
        band_bottom = bands[band_index + clip_spec.row_span - 1][1]
        clip_x_start = detect_row_label_edge_for_base(
            image=image,
            band_top=band_top,
            band_bottom=band_bottom,
            region="full",
            fallback_start=190,
            fallback_end=image.size[0] - 18,
        )
        if (
            subject.id in FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS
            and not should_use_approved_master_box_extraction(subject.id, clip_spec.id)
            and not should_use_numbered_row_source_box_extraction(subject.id, clip_spec.id)
        ):
            clip_x_start = min(clip_x_start, content_x_start)
        clip_x_end = image.size[0] - 18
        region_manual_spec = region_manual_specs.get(clip_spec.id)
        manual_spec = manual_specs.get(clip_spec.id)
        manual_source_boxes = manual_source_box_specs.get(clip_spec.id)
        package_manual_source_boxes = None
        package_rembg_source_boxes = None
        package_panel_override = False
        package_panel_box = None
        if package_panel_image is not None:
            package_manual_source_boxes = PACKAGE_PANEL_MANUAL_SOURCE_BOXES.get(subject.id, {}).get(clip_spec.id)
            package_rembg_source_boxes = PACKAGE_PANEL_REMBG_SOURCE_BOXES.get(subject.id, {}).get(clip_spec.id)
            package_panel_override = clip_spec.id in PACKAGE_PANEL_CLIP_OVERRIDES.get(subject.id, set())
            package_panel_box = PACKAGE_PANEL_BOXES.get(subject.id, {}).get(clip_spec.id)

        exact_original_row_region = EXACT_ORIGINAL_ROW_REGION_SPECS.get(subject.id, {}).get(clip_spec.id)
        slot_locked_row_region = SLOT_LOCKED_ROW_REGION_SPECS.get(subject.id, {}).get(clip_spec.id)
        if slot_locked_row_region is not None:
            band_index += clip_spec.row_span
            center_options = SLOT_LOCKED_ROW_REGION_CENTER_OPTIONS.get(subject.id, {}).get(clip_spec.id)
            if center_options is not None:
                frames = extract_frames_from_slot_locked_row_region_centered(
                    image=image,
                    spec=slot_locked_row_region,
                    target_x_ratio=float(center_options.get("target_x_ratio", 0.7)),
                    target_y_ratio=float(center_options.get("target_y_ratio", 0.58)),
                    merge_gap=int(center_options.get("merge_gap", 4)),
                )
            else:
                frames = extract_frames_from_slot_locked_row_region(
                    image=image,
                    spec=slot_locked_row_region,
                )
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = normalize_character_frame_scale(frames)
            frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
            frames = stabilize_character_clip_frames(frames)
            curated_direct_options = DIRECT_CURATED_SLOT_LOCKED_STRIP_OPTIONS.get(subject.id, {}).get(clip_spec.id)
            if curated_direct_options is not None:
                strip = fit_strip_frames(
                    frames,
                    max_scale=float(curated_direct_options.get("max_scale", 1.0)),
                )
                frame_replacements = curated_direct_options.get("frame_replacements")
                if isinstance(frame_replacements, dict) and frame_replacements:
                    strip = apply_runtime_frame_replacements(
                        strip,
                        {int(index): int(source_index) for index, source_index in frame_replacements.items()},
                    )
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue

            strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
            strip = cleanup_runtime_bright_residue_strip(strip)
            strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
            strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
            clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
            continue

        if exact_original_row_region is not None:
            band_index += clip_spec.row_span
            source_frame_count = EXACT_ORIGINAL_ROW_REGION_SOURCE_COUNTS.get(subject.id, {}).get(
                clip_spec.id,
                clip_spec.frame_count,
            )
            frames = extract_frames_from_exact_original_row_region(
                image=image,
                source_box=exact_original_row_region,
                target_count=source_frame_count,
                subject_id=subject.id,
                clip_id=clip_spec.id,
            )
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = normalize_character_frame_scale(frames)
            frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
            frames = stabilize_character_clip_frames(frames)
            strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
            strip = cleanup_runtime_bright_residue_strip(strip)
            strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
            strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
            clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
            continue

        custom_repair_spec = TARGETED_CUSTOM_CLIP_REPAIR_SPECS.get(subject.id, {}).get(clip_spec.id)
        if custom_repair_spec is not None and not should_skip_targeted_custom_repair(subject.id, clip_spec.id):
            if custom_repair_spec.source_kind == "approved_box" and approved_master_image is None:
                approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
            band_index += clip_spec.row_span
            frames = extract_targeted_custom_clip_frames(
                image=image,
                subject_id=subject.id,
                clip_id=clip_spec.id,
                target_count=clip_spec.frame_count,
                x_start=clip_x_start,
                x_end=clip_x_end,
                y_start=band_top,
                y_end=band_bottom,
                region_manual_spec=region_manual_spec,
                approved_master_image=approved_master_image,
            )
            if frames:
                strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
                strip = cleanup_runtime_bright_residue_strip(strip)
                strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue

        if manual_source_boxes is not None and not should_defer_manual_source_boxes_to_legacy_targeting(
            subject.id, clip_spec.id
        ):
            band_index += clip_spec.row_span
            manual_source_image = image
            if should_use_approved_master_for_manual_source_boxes(subject.id, clip_spec.id):
                if approved_master_image is None:
                    approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
                manual_source_image = approved_master_image
            frames = extract_subject_manual_source_box_frames(
                subject_id=subject.id,
                clip_id=clip_spec.id,
                image=manual_source_image,
                source_boxes=manual_source_boxes,
            )
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = normalize_character_frame_scale(frames)
            frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
            frames = stabilize_character_clip_frames(frames)
            strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
            strip = cleanup_runtime_bright_residue_strip(strip)
            strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
            strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
            clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
            continue

        if subject.id in FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS:
            band_index += clip_spec.row_span
            component_frames = extract_component_frames_from_region(
                image=image,
                x_start=clip_x_start,
                x_end=clip_x_end,
                y_start=band_top,
                y_end=band_bottom,
                clip_id=clip_spec.id,
                expected_frame_count=None,
                cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                suppress_presentation_artifacts=True,
            )
            if len(component_frames) >= 2 and character_frames_are_plausible(component_frames):
                frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
            else:
                frames = extract_frames_from_region(
                    image=image,
                    x_start=clip_x_start,
                    x_end=clip_x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                    clip_id=clip_spec.id,
                    prefer_component_center_windows=True,
                    suppress_presentation_artifacts=True,
                )
                if not frames:
                    frames = extract_frames_from_region_isolated_grid(
                        image=image,
                        x_start=clip_x_start,
                        x_end=clip_x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
                if not frames:
                    frames = extract_frames_from_region_direct_grid(
                        image=image,
                        x_start=clip_x_start,
                        x_end=clip_x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
            frames = postprocess_character_frames(frames, subject.id, clip_spec.id)
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = normalize_character_frame_scale(frames)
            frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
            frames = stabilize_character_clip_frames(frames)
            strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
            strip = cleanup_runtime_bright_residue_strip(strip)
            strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
            strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
            clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
            continue

        if subject.id in FORCE_LEGACY_REFRESH_SUBJECT_IDS:
            band_index += clip_spec.row_span
            legacy_manual_source_boxes = manual_source_box_specs.get(clip_spec.id)
            if legacy_manual_source_boxes is not None:
                if subject.id == "luna":
                    frames = extract_luna_frames_for_clip(image, clip_spec.id, legacy_manual_source_boxes)
                    frames = prepare_luna_manual_source_frames(clip_spec.id, frames, clip_spec.frame_count)
                else:
                    frames = [
                        extract_frame_from_source_box_targeted_raw_alpha(
                            image,
                            source_box,
                            ((source_box[2] - source_box[0]) / 2.0),
                        )
                        for source_box in legacy_manual_source_boxes
                    ]
                    frames = resample_frames_to_count(frames, clip_spec.frame_count)
                    frames = repair_runtime_strip_outliers(frames)
                    frames = normalize_character_frame_scale(frames)
                    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
                    frames = stabilize_character_clip_frames(frames)
                strip_fit_extent_quantile = (
                    get_luna_manual_strip_extent_quantile(clip_spec.id)
                    if subject.id == "luna"
                    else 1.0
                )
                strip = fit_strip_frames(
                    frames,
                    max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id),
                    extent_quantile=strip_fit_extent_quantile,
                )
                strip = cleanup_runtime_bright_residue_strip(strip)
                strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue
            legacy_refresh_source_box = LEGACY_REFRESH_CLIP_SOURCE_BOXES.get(subject.id, {}).get(clip_spec.id)
            if legacy_refresh_source_box is None:
                legacy_refresh_source_box = (
                    max(140, content_x_start - 42),
                    max(min_y, band_top - 18),
                    image.size[0] - 18,
                    min(max_y, band_bottom + 18),
                )
            if should_use_full_height_legacy_refresh_source_box_extraction(subject.id, clip_spec.id):
                frames = extract_frames_from_full_height_source_box(
                    image=image,
                    source_box=legacy_refresh_source_box,
                    target_count=clip_spec.frame_count,
                )
            else:
                frames = extract_frames_from_approved_master_box(
                    image=image,
                    source_box=legacy_refresh_source_box,
                    target_count=clip_spec.frame_count,
                )
            if frames:
                strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
                strip = cleanup_runtime_bright_residue_strip(strip)
                strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue
        if package_rembg_source_boxes is not None:
            band_index += clip_spec.row_span
            frames = extract_package_frames_from_source_boxes_rembg(
                package_panel_image,
                package_rembg_source_boxes,
                clip_spec.frame_count,
            )
            if not frames:
                frames = [
                    extract_frame_from_package_source_box(
                        package_panel_image,
                        source_box,
                        expand_source_box=False,
                    )
                    for source_box in package_rembg_source_boxes
                ]
                frames = resample_frames_to_count(frames, clip_spec.frame_count)
                frames = repair_runtime_strip_outliers(frames)
                frames = normalize_character_frame_scale(frames)
                frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
                frames = stabilize_character_clip_frames(frames)
        elif package_manual_source_boxes is not None:
            band_index += clip_spec.row_span
            frames = extract_subject_package_manual_frames(
                subject_id=subject.id,
                clip_id=clip_spec.id,
                image=package_panel_image,
                source_boxes=package_manual_source_boxes,
            )
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = normalize_character_frame_scale(frames)
            frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
            frames = stabilize_character_clip_frames(frames)
        elif package_panel_override and package_panel_image is not None and package_panel_box is not None:
            band_index += clip_spec.row_span
            source_clip_id = package_panel_box.source_clip_id or clip_spec.id
            frames = extract_frames_from_package_panel(
                image=package_panel_image,
                subject_id=subject.id,
                clip_id=source_clip_id,
                panel_box=package_panel_box,
                frame_count=clip_spec.frame_count,
            )
            if not frames:
                frames = extract_frames_from_region_isolated_grid(
                    image=image,
                    x_start=clip_x_start,
                    x_end=clip_x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                    clip_id=clip_spec.id,
                    suppress_presentation_artifacts=True,
                )
            if not frames:
                frames = extract_frames_from_region_direct_grid(
                    image=image,
                    x_start=clip_x_start,
                    x_end=clip_x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                    clip_id=clip_spec.id,
                    suppress_presentation_artifacts=True,
                )
            strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
            strip = cleanup_runtime_bright_residue_strip(strip)
            strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
            strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
            clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
            continue
        elif manual_source_boxes is not None:
            band_index += clip_spec.row_span
            if subject.id == "luna":
                frames = extract_luna_frames_for_clip(image, clip_spec.id, manual_source_boxes)
                frames = prepare_luna_manual_source_frames(clip_spec.id, frames, clip_spec.frame_count)
                strip = fit_strip_frames(
                    frames,
                    max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id),
                    extent_quantile=get_luna_manual_strip_extent_quantile(clip_spec.id),
                )
                strip = cleanup_runtime_bright_residue_strip(strip)
                strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue
            manual_source_image = image
            if should_use_approved_master_for_manual_source_boxes(subject.id, clip_spec.id):
                if approved_master_image is None:
                    approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
                manual_source_image = approved_master_image
            frames = extract_subject_manual_source_box_frames(
                subject_id=subject.id,
                clip_id=clip_spec.id,
                image=manual_source_image,
                source_boxes=manual_source_boxes,
            )
        elif region_manual_spec is not None:
            band_index += clip_spec.row_span
            if len(region_manual_spec.frames) == 0:
                if subject.id in {"nazir", "seraphin"} and not region_manual_spec.use_alpha_analysis:
                    frames = extract_frames_from_region_direct_grid(
                        image=image,
                        x_start=region_manual_spec.x_start,
                        x_end=region_manual_spec.x_end,
                        y_start=region_manual_spec.y_start,
                        y_end=region_manual_spec.y_end,
                        frame_count=region_manual_spec.source_frame_count or clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
                else:
                    frames = extract_frames_from_region(
                        image=image,
                        x_start=region_manual_spec.x_start,
                        x_end=region_manual_spec.x_end,
                        y_start=region_manual_spec.y_start,
                        y_end=region_manual_spec.y_end,
                        frame_count=region_manual_spec.source_frame_count or clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
            else:
                try:
                    frames = extract_frames_from_region_manual_spec(
                        image=image,
                        spec=region_manual_spec,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
                except RuntimeError:
                    component_frames = extract_component_frames_from_region(
                        image=image,
                        x_start=region_manual_spec.x_start,
                        x_end=region_manual_spec.x_end,
                        y_start=region_manual_spec.y_start,
                        y_end=region_manual_spec.y_end,
                        clip_id=clip_spec.id,
                        expected_frame_count=clip_spec.frame_count,
                        cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                        suppress_presentation_artifacts=True,
                    )
                    if (
                        should_use_component_extraction(subject.id, clip_spec.id)
                        and len(component_frames) >= 2
                        and character_frames_are_plausible(component_frames)
                    ):
                        frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
                    else:
                        frames = extract_frames_from_region(
                            image=image,
                            x_start=region_manual_spec.x_start,
                            x_end=region_manual_spec.x_end,
                            y_start=region_manual_spec.y_start,
                            y_end=region_manual_spec.y_end,
                            frame_count=clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
        elif manual_spec is not None:
            band_index += clip_spec.row_span
            try:
                frames = extract_frames_from_manual_spec(
                    image,
                    manual_spec,
                    x_start=clip_x_start,
                    x_end=clip_x_end,
                    clip_id=clip_spec.id,
                    suppress_presentation_artifacts=True,
                )
            except RuntimeError:
                component_frames = extract_component_frames_from_region(
                    image=image,
                    x_start=clip_x_start,
                    x_end=clip_x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    clip_id=clip_spec.id,
                    expected_frame_count=clip_spec.frame_count,
                    cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                    suppress_presentation_artifacts=True,
                )
                if (
                    should_use_component_extraction(subject.id, clip_spec.id)
                    and len(component_frames) >= 2
                    and character_frames_are_plausible(component_frames)
                ):
                    frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
                else:
                    frames = extract_frames_from_region(
                        image=image,
                        x_start=clip_x_start,
                        x_end=clip_x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
        else:
            band_index += clip_spec.row_span
            component_frames = extract_component_frames_from_region(
                image=image,
                x_start=clip_x_start,
                x_end=clip_x_end,
                y_start=band_top,
                y_end=band_bottom,
                clip_id=clip_spec.id,
                expected_frame_count=clip_spec.frame_count,
                cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                suppress_presentation_artifacts=True,
            )

            if (
                should_use_component_extraction(subject.id, clip_spec.id)
                and len(component_frames) >= 2
                and character_frames_are_plausible(component_frames)
            ):
                frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
            else:
                frames = extract_frames_from_region(
                    image=image,
                    x_start=clip_x_start,
                    x_end=clip_x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                    clip_id=clip_spec.id,
                    suppress_presentation_artifacts=True,
                )
        if not frames:
            frames = extract_frames_from_region_isolated_grid(
                image=image,
                x_start=clip_x_start,
                x_end=clip_x_end,
                y_start=band_top,
                y_end=band_bottom,
                frame_count=clip_spec.frame_count,
                clip_id=clip_spec.id,
                suppress_presentation_artifacts=True,
            )
        if not frames:
            frames = extract_frames_from_region_direct_grid(
                image=image,
                x_start=clip_x_start,
                x_end=clip_x_end,
                y_start=band_top,
                y_end=band_bottom,
                frame_count=clip_spec.frame_count,
                clip_id=clip_spec.id,
                suppress_presentation_artifacts=True,
            )
        frames = postprocess_character_frames(frames, subject.id, clip_spec.id)
        frames = resample_frames_to_count(frames, clip_spec.frame_count)
        frames = repair_runtime_strip_outliers(frames)
        frames = stabilize_character_clip_frames(frames)
        strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
        strip = cleanup_runtime_bright_residue_strip(strip)
        strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
        strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
        clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": "character",
        "clips": clips,
    }


def extract_auto_paired_single_layout_subject(
    subject: SubjectSpec,
    image: Image.Image,
    label_boxes: list[tuple[int, int, int, int]] | None = None,
    row_groups: list[list[tuple[int, int, int, int]]] | None = None,
    manual_specs: dict[str, ManualClipExtractionSpec] | None = None,
    region_manual_specs: dict[str, RegionManualClipExtractionSpec] | None = None,
    manual_source_box_specs: dict[str, tuple[tuple[int, int, int, int], ...]] | None = None,
) -> dict:
    manual_specs = manual_specs or {}
    region_manual_specs = region_manual_specs or {}
    manual_source_box_specs = manual_source_box_specs or {}
    clip_specs = [row[0] for row in subject.rows]
    paired_rows: list[tuple[tuple[ClipSpec, str], ...]] = []
    if subject.id in AUTO_PAIRED_TRAILING_FULL_ROW_SUBJECT_IDS and len(clip_specs) >= 2:
        pair_limit = len(clip_specs) - 2
        index = 0
        while index < pair_limit:
            paired_rows.append(((clip_specs[index], "left"), (clip_specs[index + 1], "right")))
            index += 2
        paired_rows.append(((clip_specs[-2], "full"),))
        paired_rows.append(((clip_specs[-1], "full"),))
    else:
        index = 0
        while index < len(clip_specs):
            remaining = len(clip_specs) - index
            if remaining == 1:
                paired_rows.append(((clip_specs[index], "full"),))
                index += 1
            else:
                paired_rows.append(((clip_specs[index], "left"), (clip_specs[index + 1], "right")))
                index += 2

    if label_boxes is None:
        label_boxes = detect_label_boxes(np.array(image)[:, :, :3], min_y=100, max_width=240)
    cleaned = remove_checkerboard_background(image)
    foreground_bbox = cleaned.getchannel("A").getbbox()
    min_y = max(110, foreground_bbox[1] if foreground_bbox is not None else 110)
    max_y = min(image.size[1] - 12, foreground_bbox[3] if foreground_bbox is not None else image.size[1] - 12)

    if row_groups is None:
        row_groups = build_label_row_groups(label_boxes, tolerance=28)

    exact_row_boxes = build_exact_row_boxes_from_groups(
        row_groups,
        expected_count=len(paired_rows),
        min_y=min_y,
        max_y=max_y,
        top_margin=10,
    )
    if exact_row_boxes is not None:
        bands = exact_row_boxes
    elif len(row_groups) >= max(2, len(paired_rows) - 2):
        observed_centers = [
            float(np.mean([(entry[1] + entry[3]) / 2 for entry in group])) + 30.0
            for group in row_groups
        ]
        centers = reconstruct_row_centers(observed_centers, len(paired_rows), min_y=min_y, max_y=max_y)
        bands = build_row_boundaries(centers, min_y=min_y, max_y=max_y)
    else:
        bands = build_uniform_bands_with_min_top(
            image,
            len(paired_rows),
            min_top=max(128, min_y + 18),
            max_bottom=max_y,
        )

    mid_x = image.size[0] // 2
    package_panel_image = load_package_panel_image(subject.id)
    approved_master_image: Image.Image | None = None
    clips: list[dict] = []

    for row_entries, (band_top, band_bottom) in zip(paired_rows, bands):
        split_left, split_right = detect_paired_row_split_gap(image, band_top, band_bottom, fallback_mid_x=mid_x)
        for clip_spec, region in row_entries:
            if region == "left":
                x_start = 18
                x_end = max(1, split_left - 8)
            elif region == "right":
                x_start = min(image.size[0] - 18, split_right + 8)
                x_end = image.size[0] - 18
            else:
                x_start = 18
                x_end = image.size[0] - 18

            x_start = detect_row_label_edge_for_base(
                image=image,
                band_top=band_top,
                band_bottom=band_bottom,
                region=region,
                fallback_start=x_start,
                fallback_end=x_end,
            )
            if subject.id in FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS and region == "left":
                x_start = min(x_start, estimate_single_layout_content_x_start(label_boxes, image.size[0]))
            region_manual_spec = region_manual_specs.get(clip_spec.id)
            manual_spec = manual_specs.get(clip_spec.id)
            manual_source_boxes = manual_source_box_specs.get(clip_spec.id)
            package_manual_source_boxes = None
            package_rembg_source_boxes = None
            package_panel_override = False
            package_panel_box = None
            if package_panel_image is not None:
                package_manual_source_boxes = PACKAGE_PANEL_MANUAL_SOURCE_BOXES.get(subject.id, {}).get(clip_spec.id)
                package_rembg_source_boxes = PACKAGE_PANEL_REMBG_SOURCE_BOXES.get(subject.id, {}).get(clip_spec.id)
                package_panel_override = clip_spec.id in PACKAGE_PANEL_CLIP_OVERRIDES.get(subject.id, set())
                package_panel_box = PACKAGE_PANEL_BOXES.get(subject.id, {}).get(clip_spec.id)

            exact_original_row_region = EXACT_ORIGINAL_ROW_REGION_SPECS.get(subject.id, {}).get(clip_spec.id)
            if exact_original_row_region is not None:
                frames = extract_frames_from_exact_original_row_region(
                    image=image,
                    source_box=exact_original_row_region,
                    target_count=clip_spec.frame_count,
                    subject_id=subject.id,
                    clip_id=clip_spec.id,
                )
                frames = resample_frames_to_count(frames, clip_spec.frame_count)
                frames = repair_runtime_strip_outliers(frames)
                frames = normalize_character_frame_scale(frames)
                frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
                frames = stabilize_character_clip_frames(frames)
                strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
                strip = cleanup_runtime_bright_residue_strip(strip)
                strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue

            custom_repair_spec = TARGETED_CUSTOM_CLIP_REPAIR_SPECS.get(subject.id, {}).get(clip_spec.id)
            if custom_repair_spec is not None and not should_skip_targeted_custom_repair(subject.id, clip_spec.id):
                if custom_repair_spec.source_kind == "approved_box" and approved_master_image is None:
                    approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
                frames = extract_targeted_custom_clip_frames(
                    image=image,
                    subject_id=subject.id,
                    clip_id=clip_spec.id,
                    target_count=clip_spec.frame_count,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    region_manual_spec=region_manual_spec,
                    approved_master_image=approved_master_image,
                )
                if frames:
                    strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
                    strip = cleanup_runtime_bright_residue_strip(strip)
                    strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                    strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                    clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                    continue

            if manual_source_boxes is not None:
                frames = extract_subject_manual_source_box_frames(
                    subject_id=subject.id,
                    clip_id=clip_spec.id,
                    image=image,
                    source_boxes=manual_source_boxes,
                )
            elif should_use_approved_master_box_extraction(subject.id, clip_spec.id):
                if approved_master_image is None:
                    approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
                approved_source_box = APPROVED_MASTER_CLIP_SOURCE_BOXES[subject.id][clip_spec.id]
                frames = extract_frames_from_approved_master_box(
                    image=approved_master_image,
                    source_box=approved_source_box,
                    target_count=clip_spec.frame_count,
                )
                if not frames:
                    frames = extract_frames_from_region(
                        image=approved_master_image,
                        x_start=approved_source_box[0],
                        x_end=approved_source_box[2],
                        y_start=approved_source_box[1],
                        y_end=approved_source_box[3],
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
            elif should_use_numbered_row_source_box_extraction(subject.id, clip_spec.id):
                frames = extract_frames_from_numbered_row_region(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    target_count=clip_spec.frame_count,
                )
                if not frames:
                    frames = extract_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
            elif (
                subject.id in FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS
                and not should_use_approved_master_box_extraction(subject.id, clip_spec.id)
                and not should_use_numbered_row_source_box_extraction(subject.id, clip_spec.id)
            ):
                component_frames = extract_component_frames_from_region(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    clip_id=clip_spec.id,
                    expected_frame_count=None,
                    cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                    suppress_presentation_artifacts=True,
                )
                if len(component_frames) >= 2 and character_frames_are_plausible(component_frames):
                    frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
                else:
                    frames = extract_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        prefer_component_center_windows=True,
                        suppress_presentation_artifacts=True,
                    )
                    if not frames:
                        frames = extract_frames_from_region_isolated_grid(
                            image=image,
                            x_start=x_start,
                            x_end=x_end,
                            y_start=band_top,
                            y_end=band_bottom,
                            frame_count=clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
                    if not frames:
                        frames = extract_frames_from_region_direct_grid(
                            image=image,
                            x_start=x_start,
                            x_end=x_end,
                            y_start=band_top,
                            y_end=band_bottom,
                            frame_count=clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
            elif package_rembg_source_boxes is not None:
                frames = extract_package_frames_from_source_boxes_rembg(
                    package_panel_image,
                    package_rembg_source_boxes,
                    clip_spec.frame_count,
                )
                if not frames:
                    frames = [
                        extract_frame_from_package_source_box(
                            package_panel_image,
                            source_box,
                            expand_source_box=False,
                        )
                        for source_box in package_rembg_source_boxes
                    ]
                    frames = resample_frames_to_count(frames, clip_spec.frame_count)
                frames = repair_runtime_strip_outliers(frames)
                frames = normalize_character_frame_scale(frames)
                frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
                frames = stabilize_character_clip_frames(frames)
            elif package_manual_source_boxes is not None:
                frames = extract_subject_package_manual_frames(
                    subject_id=subject.id,
                    clip_id=clip_spec.id,
                    image=package_panel_image,
                    source_boxes=package_manual_source_boxes,
                )
                frames = resample_frames_to_count(frames, clip_spec.frame_count)
                frames = repair_runtime_strip_outliers(frames)
                frames = normalize_character_frame_scale(frames)
                frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
                frames = stabilize_character_clip_frames(frames)
            elif package_panel_override and package_panel_image is not None and package_panel_box is not None:
                source_clip_id = package_panel_box.source_clip_id or clip_spec.id
                frames = extract_frames_from_package_panel(
                    image=package_panel_image,
                    subject_id=subject.id,
                    clip_id=source_clip_id,
                    panel_box=package_panel_box,
                    frame_count=clip_spec.frame_count,
                )
                if not frames:
                    frames = extract_frames_from_region_isolated_grid(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        prefer_component_center_windows=True,
                        suppress_presentation_artifacts=True,
                    )
                if not frames:
                    frames = extract_frames_from_region_isolated_grid(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
                if not frames:
                    frames = extract_frames_from_region_direct_grid(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
                strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
                strip = cleanup_runtime_bright_residue_strip(strip)
                strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue
            elif manual_source_boxes is not None:
                manual_source_image = image
                if should_use_approved_master_for_manual_source_boxes(subject.id, clip_spec.id):
                    if approved_master_image is None:
                        approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
                    manual_source_image = approved_master_image
                frames = extract_subject_manual_source_box_frames(
                    subject_id=subject.id,
                    clip_id=clip_spec.id,
                    image=manual_source_image,
                    source_boxes=manual_source_boxes,
                )
            elif region_manual_spec is not None:
                if len(region_manual_spec.frames) == 0:
                    if subject.id in {"nazir", "seraphin"} and not region_manual_spec.use_alpha_analysis:
                        frames = extract_frames_from_region_direct_grid(
                            image=image,
                            x_start=region_manual_spec.x_start,
                            x_end=region_manual_spec.x_end,
                            y_start=region_manual_spec.y_start,
                            y_end=region_manual_spec.y_end,
                            frame_count=region_manual_spec.source_frame_count or clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
                    else:
                        frames = extract_frames_from_region(
                            image=image,
                            x_start=region_manual_spec.x_start,
                            x_end=region_manual_spec.x_end,
                            y_start=region_manual_spec.y_start,
                            y_end=region_manual_spec.y_end,
                            frame_count=region_manual_spec.source_frame_count or clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
                else:
                    try:
                        frames = extract_frames_from_region_manual_spec(
                            image=image,
                            spec=region_manual_spec,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
                    except RuntimeError:
                        component_frames = extract_component_frames_from_region(
                            image=image,
                            x_start=region_manual_spec.x_start,
                            x_end=region_manual_spec.x_end,
                            y_start=region_manual_spec.y_start,
                            y_end=region_manual_spec.y_end,
                            clip_id=clip_spec.id,
                            expected_frame_count=clip_spec.frame_count,
                            cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                            suppress_presentation_artifacts=True,
                        )
                        if (
                            should_use_component_extraction(subject.id, clip_spec.id)
                            and len(component_frames) >= 2
                            and character_frames_are_plausible(component_frames)
                        ):
                            frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
                        else:
                            frames = extract_frames_from_region(
                                image=image,
                                x_start=region_manual_spec.x_start,
                                x_end=region_manual_spec.x_end,
                                y_start=region_manual_spec.y_start,
                                y_end=region_manual_spec.y_end,
                                frame_count=clip_spec.frame_count,
                                clip_id=clip_spec.id,
                                suppress_presentation_artifacts=True,
                            )
            elif manual_spec is not None:
                try:
                    frames = extract_frames_from_manual_spec(
                        image,
                        manual_spec,
                        x_start=x_start,
                        x_end=x_end,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
                except RuntimeError:
                    component_frames = extract_component_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        clip_id=clip_spec.id,
                        expected_frame_count=clip_spec.frame_count,
                        cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                        suppress_presentation_artifacts=True,
                    )
                    if (
                        should_use_component_extraction(subject.id, clip_spec.id)
                        and len(component_frames) >= 2
                        and character_frames_are_plausible(component_frames)
                    ):
                        frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
                    else:
                        frames = extract_frames_from_region(
                            image=image,
                            x_start=x_start,
                            x_end=x_end,
                            y_start=band_top,
                            y_end=band_bottom,
                            frame_count=clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
            else:
                component_frames = extract_component_frames_from_region(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    clip_id=clip_spec.id,
                    expected_frame_count=clip_spec.frame_count,
                    cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                    suppress_presentation_artifacts=True,
                )

                if (
                    should_use_component_extraction(subject.id, clip_spec.id)
                    and len(component_frames) >= 2
                    and character_frames_are_plausible(component_frames)
                ):
                    frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
                else:
                    frames = extract_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
            if not frames:
                frames = extract_frames_from_region_isolated_grid(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                    clip_id=clip_spec.id,
                    suppress_presentation_artifacts=True,
                )
            if not frames:
                frames = extract_frames_from_region_direct_grid(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                    clip_id=clip_spec.id,
                    suppress_presentation_artifacts=True,
                )
            frames = postprocess_character_frames(frames, subject.id, clip_spec.id)
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = stabilize_character_clip_frames(frames)
            strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
            strip = cleanup_runtime_bright_residue_strip(strip)
            strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
            strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
            clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": "character",
        "clips": clips,
    }


def extract_paired_layout_subject(subject: SubjectSpec, image: Image.Image) -> dict:
    manual_source_box_specs = MANUAL_SOURCE_BOX_CLIP_SPECS.get(subject.id, {})
    approved_master_image: Image.Image | None = None
    label_boxes = detect_label_boxes(np.array(image)[:, :, :3], min_y=100, max_width=220)
    cleaned = remove_checkerboard_background(image)
    foreground_bbox = cleaned.getchannel("A").getbbox()
    min_y = max(110, foreground_bbox[1] if foreground_bbox is not None else 110)
    max_y = min(image.size[1] - 12, foreground_bbox[3] if foreground_bbox is not None else image.size[1] - 12)

    row_groups = build_label_row_groups(label_boxes, tolerance=42)
    exact_row_boxes = build_exact_row_boxes_from_groups(
        row_groups,
        expected_count=len(subject.rows),
        min_y=min_y,
        max_y=max_y,
        top_margin=10,
    )

    if exact_row_boxes is not None:
        bands = exact_row_boxes
    elif len(row_groups) >= max(2, len(subject.rows) - 2):
        observed_centers = [
            float(np.mean([(entry[1] + entry[3]) / 2 for entry in group]))
            for group in row_groups
        ]
        centers = reconstruct_row_centers(observed_centers, len(subject.rows), min_y=min_y, max_y=max_y)
        bands = build_row_boundaries(centers, min_y=min_y, max_y=max_y)
    else:
        bands = build_uniform_bands_from_foreground(image, len(subject.rows))

    clips: list[dict] = []
    mid_x = image.size[0] // 2

    for row_specs, (band_top, band_bottom) in zip(subject.rows, bands):
        for clip_spec in row_specs:
            if clip_spec.region == "left":
                x_start = 18
                x_end = max(1, mid_x - 18)
            elif clip_spec.region == "right":
                x_start = max(0, mid_x + 18)
                x_end = image.size[0] - 18
            else:
                x_start = 18
                x_end = image.size[0] - 18

            x_start = detect_row_label_edge_for_base(
                image=image,
                band_top=band_top,
                band_bottom=band_bottom,
                region=clip_spec.region,
                fallback_start=x_start,
                fallback_end=x_end,
            )
            if subject.id in FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS and clip_spec.region == "left":
                x_start = min(x_start, estimate_single_layout_content_x_start(label_boxes, image.size[0]))

            manual_source_boxes = manual_source_box_specs.get(clip_spec.id)
            exact_original_row_region = EXACT_ORIGINAL_ROW_REGION_SPECS.get(subject.id, {}).get(clip_spec.id)
            if exact_original_row_region is not None:
                frames = extract_frames_from_exact_original_row_region(
                    image=image,
                    source_box=exact_original_row_region,
                    target_count=clip_spec.frame_count,
                    subject_id=subject.id,
                    clip_id=clip_spec.id,
                )
                frames = resample_frames_to_count(frames, clip_spec.frame_count)
                frames = repair_runtime_strip_outliers(frames)
                frames = normalize_character_frame_scale(frames)
                frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
                frames = stabilize_character_clip_frames(frames)
                strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
                strip = cleanup_runtime_bright_residue_strip(strip)
                strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                continue

            custom_repair_spec = TARGETED_CUSTOM_CLIP_REPAIR_SPECS.get(subject.id, {}).get(clip_spec.id)
            if custom_repair_spec is not None and not should_skip_targeted_custom_repair(subject.id, clip_spec.id):
                if custom_repair_spec.source_kind == "approved_box" and approved_master_image is None:
                    approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
                frames = extract_targeted_custom_clip_frames(
                    image=image,
                    subject_id=subject.id,
                    clip_id=clip_spec.id,
                    target_count=clip_spec.frame_count,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    approved_master_image=approved_master_image,
                )
                if frames:
                    strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
                    strip = cleanup_runtime_bright_residue_strip(strip)
                    strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
                    strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
                    clips.append(write_runtime_strip(subject.id, clip_spec, strip, frame_count_override=len(frames)))
                    continue
            if (
                subject.id in FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS
                and not should_use_approved_master_box_extraction(subject.id, clip_spec.id)
                and not should_use_numbered_row_source_box_extraction(subject.id, clip_spec.id)
            ):
                component_frames = extract_component_frames_from_region(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    clip_id=clip_spec.id,
                    expected_frame_count=None,
                    cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                    suppress_presentation_artifacts=True,
                )
                if len(component_frames) >= 2 and character_frames_are_plausible(component_frames):
                    frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
                else:
                    frames = extract_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        prefer_component_center_windows=True,
                        suppress_presentation_artifacts=True,
                    )
                    if not frames:
                        frames = extract_frames_from_region_isolated_grid(
                            image=image,
                            x_start=x_start,
                            x_end=x_end,
                            y_start=band_top,
                            y_end=band_bottom,
                            frame_count=clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
                    if not frames:
                        frames = extract_frames_from_region_direct_grid(
                            image=image,
                            x_start=x_start,
                            x_end=x_end,
                            y_start=band_top,
                            y_end=band_bottom,
                            frame_count=clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=True,
                        )
            elif should_use_approved_master_box_extraction(subject.id, clip_spec.id):
                if approved_master_image is None:
                    approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
                approved_source_box = APPROVED_MASTER_CLIP_SOURCE_BOXES[subject.id][clip_spec.id]
                frames = extract_frames_from_approved_master_box(
                    image=approved_master_image,
                    source_box=approved_source_box,
                    target_count=clip_spec.frame_count,
                )
                if not frames:
                    frames = extract_frames_from_region(
                        image=approved_master_image,
                        x_start=approved_source_box[0],
                        x_end=approved_source_box[2],
                        y_start=approved_source_box[1],
                        y_end=approved_source_box[3],
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
            elif should_use_numbered_row_source_box_extraction(subject.id, clip_spec.id):
                frames = extract_frames_from_numbered_row_region(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    target_count=clip_spec.frame_count,
                )
                if not frames:
                    frames = extract_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
            elif manual_source_boxes is not None:
                manual_source_image = image
                if should_use_approved_master_for_manual_source_boxes(subject.id, clip_spec.id):
                    if approved_master_image is None:
                        approved_master_image = Image.open(SOURCE_DIR / subject.sheet_name).convert("RGBA")
                    manual_source_image = approved_master_image
                frames = extract_subject_manual_source_box_frames(
                    subject_id=subject.id,
                    clip_id=clip_spec.id,
                    image=manual_source_image,
                    source_boxes=manual_source_boxes,
                )
            else:
                component_frames = extract_component_frames_from_region(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    clip_id=clip_spec.id,
                    expected_frame_count=clip_spec.frame_count,
                    cleanup_character_artifacts=should_run_character_artifact_cleanup(subject.id, clip_spec.id),
                    suppress_presentation_artifacts=True,
                )

                if (
                    should_use_component_extraction(subject.id, clip_spec.id)
                    and len(component_frames) >= 2
                    and character_frames_are_plausible(component_frames)
                ):
                    frames = resample_frames_to_count(component_frames, clip_spec.frame_count)
                else:
                    frames = extract_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=True,
                    )
            if not frames:
                frames = extract_frames_from_region_isolated_grid(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                    clip_id=clip_spec.id,
                    suppress_presentation_artifacts=True,
                )
            if not frames:
                frames = extract_frames_from_region_direct_grid(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                    clip_id=clip_spec.id,
                    suppress_presentation_artifacts=True,
                )
            frames = postprocess_character_frames(frames, subject.id, clip_spec.id)
            frames = resample_frames_to_count(frames, clip_spec.frame_count)
            frames = repair_runtime_strip_outliers(frames)
            frames = stabilize_character_clip_frames(frames)
            strip = fit_strip_frames(frames, max_scale=get_subject_clip_fit_max_scale(subject.id, clip_spec.id))
            strip = cleanup_runtime_bright_residue_strip(strip)
            strip = finalize_runtime_strip_for_subject(subject.id, clip_spec.id, strip)
            strip = apply_subject_clip_strip_cleanup(subject.id, clip_spec.id, strip)
            clips.append(write_runtime_strip(subject.id, clip_spec, strip))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": "character",
        "clips": clips,
    }


def write_runtime_strip(
    subject_id: str,
    clip_spec: ClipSpec,
    strip: Image.Image,
    frame_count_override: int | None = None,
) -> dict:
    target_dir = PUBLIC_CHARACTER_DIR / subject_id
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / f"{clip_spec.id}.png"
    strip.save(target_path)
    return {
        "id": clip_spec.id,
        "path": target_path.relative_to(ROOT / "public").as_posix(),
        "frameWidth": FRAME_SIZE,
        "frameHeight": FRAME_SIZE,
        "frameCount": frame_count_override if frame_count_override is not None else clip_spec.frame_count,
        "fps": clip_spec.fps,
    }


def write_direct_curated_slot_locked_override(subject_id: str, clip_id: str) -> None:
    subject = next((item for item in SUBJECT_SPECS if item.id == subject_id), None)
    if subject is None:
        return

    clip_spec = next((clip for row in subject.rows for clip in row if clip.id == clip_id), None)
    if clip_spec is None:
        return

    slot_locked_row_region = SLOT_LOCKED_ROW_REGION_SPECS.get(subject_id, {}).get(clip_id)
    curated_direct_options = DIRECT_CURATED_SLOT_LOCKED_STRIP_OPTIONS.get(subject_id, {}).get(clip_id)
    if slot_locked_row_region is None or curated_direct_options is None:
        return

    image = load_subject_image(subject)
    center_options = SLOT_LOCKED_ROW_REGION_CENTER_OPTIONS.get(subject_id, {}).get(clip_id)
    if center_options is not None:
        frames = extract_frames_from_slot_locked_row_region_centered(
            image=image,
            spec=slot_locked_row_region,
            target_x_ratio=float(center_options.get("target_x_ratio", 0.7)),
            target_y_ratio=float(center_options.get("target_y_ratio", 0.58)),
            merge_gap=int(center_options.get("merge_gap", 4)),
        )
    else:
        frames = extract_frames_from_slot_locked_row_region(
            image=image,
            spec=slot_locked_row_region,
        )

    frames = resample_frames_to_count(frames, clip_spec.frame_count)
    frames = repair_runtime_strip_outliers(frames)
    frames = normalize_character_frame_scale(frames)
    frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=0.58)
    frames = stabilize_character_clip_frames(frames)
    strip = fit_strip_frames(frames, max_scale=float(curated_direct_options.get("max_scale", 1.0)))
    frame_replacements = curated_direct_options.get("frame_replacements")
    if isinstance(frame_replacements, dict) and frame_replacements:
        strip = apply_runtime_frame_replacements(
            strip,
            {int(index): int(source_index) for index, source_index in frame_replacements.items()},
        )
    strip = cleanup_runtime_bright_residue_strip(strip)
    strip = finalize_runtime_strip_for_subject(subject_id, clip_id, strip)
    strip = apply_subject_clip_strip_cleanup(subject_id, clip_id, strip)
    write_runtime_strip(subject_id, clip_spec, strip, frame_count_override=len(frames))


def extract_owned_components_exactly_from_source_box(
    image: Image.Image,
    source_box: tuple[int, int, int, int],
    target_x_ratio: float = 0.58,
    target_y_ratio: float = 0.60,
    merge_gap: int = 14,
) -> ExtractedFrame:
    crop_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(source_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    alpha_mask = crop_rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0)

    alpha_mask = remove_wide_horizontal_strip_components(alpha_mask)
    labels, components = label_connected_components(alpha_mask)
    if not components:
        return extract_frame_from_source_box_raw_alpha(image, source_box)

    target_x = crop_rgba.shape[1] * float(target_x_ratio)
    target_y = crop_rgba.shape[0] * float(target_y_ratio)
    best_component: MaskComponent | None = None
    best_score: float | None = None

    for component in components:
        width = component.max_x - component.min_x + 1
        height = component.max_y - component.min_y + 1
        if component.area < 24 or width < 4 or height < 6:
            continue

        center_x = (component.min_x + component.max_x) / 2.0
        center_y = (component.min_y + component.max_y) / 2.0
        contains_target_x = component.min_x <= target_x <= component.max_x
        contains_target_y = component.min_y <= target_y <= component.max_y
        distance_penalty = abs(center_x - target_x) * 10.0 + abs(center_y - target_y) * 2.5
        score = float(component.area) - distance_penalty
        if contains_target_x:
            score += 1200.0
        if contains_target_y:
            score += 400.0
        if best_score is None or score > best_score:
            best_score = score
            best_component = component

    if best_component is None:
        return extract_frame_from_source_box_raw_alpha(image, source_box)

    selected_component_ids = {best_component.index}
    for component in components:
        if component.index == best_component.index or component.area < 16:
            continue

        gap = component_bbox_gap(best_component, component)
        overlap_y = min(best_component.max_y, component.max_y) - max(best_component.min_y, component.min_y)
        overlap_x = min(best_component.max_x, component.max_x) - max(best_component.min_x, component.min_x)
        if gap <= merge_gap and (overlap_y >= -6 or overlap_x >= -6):
            selected_component_ids.add(component.index)

    merged_mask = np.isin(labels, list(selected_component_ids))
    coords = np.argwhere(merged_mask)
    if coords.size == 0:
        return extract_frame_from_source_box_raw_alpha(image, source_box)

    min_y = max(0, int(coords[:, 0].min()) - 2)
    max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
    min_x = max(0, int(coords[:, 1].min()) - 2)
    max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
    frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
    frame_mask = merged_mask[min_y : max_y + 1, min_x : max_x + 1]
    frame_rgba[:, :, 3] = np.where(frame_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
    frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(frame_coords)
    frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
    final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
    anchor_x, anchor_y = compute_frame_anchor(final_coords)
    return ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y)


def extract_frames_from_row_x_ownership(
    image: Image.Image,
    row_box: tuple[int, int, int, int],
    frame_centers: tuple[int, ...],
) -> list[ExtractedFrame]:
    crop_image = remove_border_palette_background(
        remove_checkerboard_background(image.crop(row_box))
    )
    crop_rgba = np.array(crop_image.convert("RGBA"))
    alpha_mask = crop_rgba[:, :, 3] > 0

    if not alpha_mask.any() or not frame_centers:
        return []

    x_coords = np.arange(crop_rgba.shape[1], dtype=np.int32)
    centers = np.array(frame_centers, dtype=np.int32)
    owner_by_x = np.argmin(np.abs(x_coords[:, None] - centers[None, :]), axis=1)
    owner_map = np.repeat(owner_by_x[None, :], crop_rgba.shape[0], axis=0)

    frames: list[ExtractedFrame] = []
    for frame_index in range(len(frame_centers)):
        frame_mask = alpha_mask & (owner_map == frame_index)
        if not frame_mask.any():
            frames.append(ExtractedFrame(image=Image.new("RGBA", (1, 1), (0, 0, 0, 0)), anchor_x=0.0, anchor_y=0.0))
            continue

        coords = np.argwhere(frame_mask)
        min_y = max(0, int(coords[:, 0].min()) - 2)
        max_y = min(crop_rgba.shape[0] - 1, int(coords[:, 0].max()) + 2)
        min_x = max(0, int(coords[:, 1].min()) - 2)
        max_x = min(crop_rgba.shape[1] - 1, int(coords[:, 1].max()) + 2)
        frame_rgba = crop_rgba[min_y : max_y + 1, min_x : max_x + 1].copy()
        local_mask = frame_mask[min_y : max_y + 1, min_x : max_x + 1]
        frame_rgba[:, :, 3] = np.where(local_mask, frame_rgba[:, :, 3], 0).astype(np.uint8)
        frame_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(frame_coords)
        frame_rgba = cleanup_character_frame_artifacts(frame_rgba, anchor_x)
        final_coords = np.argwhere(frame_rgba[:, :, 3] > 0)
        anchor_x, anchor_y = compute_frame_anchor(final_coords)
        frames.append(ExtractedFrame(image=Image.fromarray(frame_rgba), anchor_x=anchor_x, anchor_y=anchor_y))

    return frames


def remove_runtime_edge_sliver_components_strip(
    strip: Image.Image,
    side: str,
    max_width: int,
    max_area_ratio: float,
) -> Image.Image:
    frame_count = max(1, strip.width // FRAME_SIZE)
    cleaned_strip = Image.new("RGBA", strip.size, (0, 0, 0, 0))

    for frame_index in range(frame_count):
        frame = strip.crop((frame_index * FRAME_SIZE, 0, (frame_index + 1) * FRAME_SIZE, FRAME_SIZE)).convert("RGBA")
        frame_rgba = np.array(frame)
        alpha_mask = frame_rgba[:, :, 3] > 0
        labels, components = label_connected_components(alpha_mask)
        if components:
            largest_area = max(component.area for component in components)
            for component in components:
                width = component.max_x - component.min_x + 1
                if side == "left":
                    touches_edge = component.min_x <= 1
                else:
                    touches_edge = component.max_x >= frame_rgba.shape[1] - 2
                if not touches_edge:
                    continue
                if width <= max_width and component.area <= max(28, int(largest_area * max_area_ratio)):
                    frame_rgba[labels == component.index, 3] = 0

        cleaned_strip.alpha_composite(Image.fromarray(frame_rgba), (frame_index * FRAME_SIZE, 0))

    return cleaned_strip


def write_explicit_fullsheet_frame_sequence_override(subject_id: str, clip_id: str) -> None:
    subject = next((item for item in SUBJECT_SPECS if item.id == subject_id), None)
    if subject is None:
        return

    clip_spec = next((clip for row in subject.rows for clip in row if clip.id == clip_id), None)
    if clip_spec is None:
        return

    spec = EXPLICIT_FULLSHEET_FRAME_SEQUENCE_SPECS.get(subject_id, {}).get(clip_id)
    if spec is None:
        return

    frame_order = spec.get("frame_order")
    if not isinstance(frame_order, tuple) or not frame_order:
        return

    image = load_subject_image(subject)
    extract_mode = str(spec.get("extract_mode", "raw"))
    source_frames: list[ExtractedFrame] = []
    if extract_mode == "row_x_ownership":
        row_box = spec.get("row_box")
        frame_centers = spec.get("frame_centers")
        if not isinstance(row_box, tuple) or not isinstance(frame_centers, tuple) or not frame_centers:
            return
        source_frames = extract_frames_from_row_x_ownership(
            image,
            tuple(int(value) for value in row_box),
            tuple(int(value) for value in frame_centers),
        )
    else:
        source_boxes = spec.get("source_boxes")
        if not isinstance(source_boxes, tuple) or not source_boxes:
            return
        package_image = load_package_panel_image(subject_id) if extract_mode == "package_raw" else None
        if extract_mode == "package_raw" and package_image is None:
            return
        for source_box in source_boxes:
            normalized_box = tuple(int(value) for value in source_box)
            if extract_mode == "package_raw":
                source_frames.append(
                    extract_frame_from_package_source_box(
                        package_image,
                        normalized_box,
                        expand_source_box=False,
                    )
                )
            elif extract_mode == "owned_components":
                source_frames.append(
                    extract_owned_components_exactly_from_source_box(
                        image,
                        normalized_box,
                        target_x_ratio=float(spec.get("target_x_ratio", 0.58)),
                        target_y_ratio=float(spec.get("target_y_ratio", 0.60)),
                        merge_gap=int(spec.get("merge_gap", 14)),
                    )
                )
            else:
                source_frames.append(extract_frame_from_source_box_raw_alpha(image, normalized_box))
    if not source_frames:
        return

    frames = [source_frames[int(index)] for index in frame_order if 0 <= int(index) < len(source_frames)]
    if not frames:
        return

    frames = normalize_character_frame_scale(frames)
    anchor_mode = str(spec.get("anchor_mode", "upper_body"))
    if anchor_mode == "visual_core":
        frames = reanchor_frames_to_visual_core(frames, band_start_ratio=0.42, band_end_ratio=0.82)
    else:
        frames = reanchor_frames_to_upper_body(frames, upper_body_ratio=float(spec.get("upper_body_ratio", 0.58)))
    frames = stabilize_character_clip_frames(frames)
    strip = fit_strip_frames(frames, max_scale=float(spec.get("max_scale", 1.0)))
    edge_side = spec.get("post_edge_sliver_side")
    if isinstance(edge_side, str) and edge_side in {"left", "right"}:
        strip = remove_runtime_edge_sliver_components_strip(
            strip,
            edge_side,
            int(spec.get("post_edge_sliver_max_width", 14)),
            float(spec.get("post_edge_sliver_max_area_ratio", 0.30)),
        )
    strip = cleanup_runtime_bright_residue_strip(strip)
    strip = finalize_runtime_strip_for_subject(subject_id, clip_id, strip)
    write_runtime_strip(subject_id, clip_spec, strip, frame_count_override=len(frames))


def load_subject_image(subject: SubjectSpec) -> Image.Image:
    if subject.id not in FORCE_APPROVED_MASTER_SOURCE_SUBJECT_IDS:
        legacy_image = load_subject_legacy_refresh_image(subject.id)
        if legacy_image is not None:
            return legacy_image

    source_path = SOURCE_DIR / subject.sheet_name
    if not source_path.exists():
        raise FileNotFoundError(f"Missing source master sheet: {source_path}")
    return Image.open(source_path).convert("RGBA")


def merge_manifest(subject_payloads: list[dict]) -> None:
    manifest = {
        "version": 1,
        "generatedAt": "2026-04-05",
        "note": "Runtime animation clips generated from approved character, enemy, npc, and VFX source sheets.",
        "subjects": [],
    }

    if MANIFEST_PATH.exists():
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        if not isinstance(manifest, dict):
            manifest = {
                "version": 1,
                "generatedAt": "2026-04-05",
                "note": "Runtime animation clips generated from approved character, enemy, npc, and VFX source sheets.",
                "subjects": [],
            }

    incoming_subject_keys = {f"{subject['category']}:{subject['id']}" for subject in subject_payloads}
    existing_subjects = [
        subject
        for subject in manifest.get("subjects", [])
        if f"{subject.get('category')}:{subject.get('id')}" not in incoming_subject_keys
    ]

    manifest["version"] = 1
    manifest["generatedAt"] = "2026-04-05"
    manifest["note"] = "Runtime animation clips generated from approved character, enemy, npc, and VFX source sheets."
    manifest["subjects"] = existing_subjects + subject_payloads
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--subject",
        action="append",
        dest="subjects",
        default=[],
        help="Generate only the requested subject id. Repeat to generate multiple subjects.",
    )
    args = parser.parse_args()
    target_subject_ids = set(args.subjects)

    PUBLIC_CHARACTER_DIR.mkdir(parents=True, exist_ok=True)
    subjects_payload: list[dict] = []

    for subject in SUBJECT_SPECS:
        if target_subject_ids and subject.id not in target_subject_ids:
            continue

        image = load_subject_image(subject)
        if subject.layout == "single":
            payload = extract_single_layout_subject(subject, image)
        else:
            payload = extract_paired_layout_subject(subject, image)

        subjects_payload.append(payload)
        print(f"generated runtime clips: {subject.id} ({len(payload['clips'])} clips)")

    for subject_id, clip_ids in FINAL_DIRECT_CURATED_SLOT_LOCKED_OVERRIDES.items():
        if target_subject_ids and subject_id not in target_subject_ids:
            continue

        for clip_id in clip_ids:
            write_direct_curated_slot_locked_override(subject_id, clip_id)

    for subject_id, clip_ids in FINAL_EXPLICIT_FULLSHEET_FRAME_SEQUENCE_OVERRIDES.items():
        if target_subject_ids and subject_id not in target_subject_ids:
            continue

        for clip_id in clip_ids:
            write_explicit_fullsheet_frame_sequence_override(subject_id, clip_id)

    merge_manifest(subjects_payload)
    print(f"updated manifest: {MANIFEST_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

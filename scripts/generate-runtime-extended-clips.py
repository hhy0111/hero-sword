from __future__ import annotations

from dataclasses import dataclass
from importlib.machinery import SourceFileLoader
import json
from pathlib import Path
from typing import Literal

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
BASE = SourceFileLoader(
    "base_runtime_character_generator",
    str(ROOT / "scripts" / "generate-runtime-character-clips.py"),
).load_module()
MANIFEST_PATH = ROOT / "public" / "assets" / "runtime" / "animation-manifest.json"

Category = Literal["character", "enemy"]
Layout = Literal["uniform_single", "uniform_paired"]
Region = Literal["left", "right", "full"]
SliceMode = Literal["auto", "uniform_cells"]


@dataclass(frozen=True)
class ClipSpec:
    id: str
    frame_count: int
    fps: int
    region: Region = "full"


@dataclass(frozen=True)
class SubjectSpec:
    id: str
    name: str
    category: Category
    frame_size: int
    sheet_name: str
    source_dir: Path
    layout: Layout
    rows: tuple[tuple[ClipSpec, ...], ...]
    row_centers: tuple[float, ...] | None = None
    row_group_indices: tuple[int, ...] | None = None
    left_bounds: tuple[int, int] | None = None
    right_bounds: tuple[int, int] | None = None
    full_bounds: tuple[int, int] | None = None
    disabled_reason: str | None = None
    slice_mode: SliceMode = "auto"


CHARACTER_SOURCE_DIR = ROOT / "assets" / "source" / "character-animation-master-sheets" / "approved"
ENEMY_SOURCE_DIR = ROOT / "assets" / "source" / "enemy-animation-master-sheets" / "approved"


CHARACTER_BATCH_02: tuple[SubjectSpec, ...] = (
    SubjectSpec(
        id="iris",
        name="Iris",
        category="character",
        frame_size=64,
        sheet_name="13-iris.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(172.0, 319.5, 471.0, 611.0, 750.5, 884.5, 1026.8, 1169.0),
        left_bounds=(148, 628),
        right_bounds=(690, 1382),
        full_bounds=(148, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 8, "left"), ClipSpec("walk", 8, 9, "right")),
            (ClipSpec("run", 8, 11, "left"), ClipSpec("attack_basic_01", 6, 11, "right")),
            (ClipSpec("attack_basic_02", 6, 11, "left"), ClipSpec("attack_basic_03", 7, 11, "right")),
            (ClipSpec("charge", 6, 11, "left"), ClipSpec("skill_cast", 8, 10, "right")),
            (ClipSpec("hit_react", 4, 12, "left"), ClipSpec("guard_or_block", 4, 8, "right")),
            (ClipSpec("dash_or_dodge", 6, 13, "left"), ClipSpec("town_idle", 6, 6, "right")),
            (ClipSpec("interact", 6, 8, "left"), ClipSpec("victory", 8, 10, "right")),
            (ClipSpec("down_or_death", 6, 8, "full"),),
        ),
    ),
    SubjectSpec(
        id="wolf",
        name="Wolf",
        category="character",
        frame_size=64,
        sheet_name="14-volf.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(171.5, 331.5, 473.0, 631.5, 777.5, 928.0, 1125.8),
        left_bounds=(148, 628),
        right_bounds=(690, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 7, "left"), ClipSpec("walk", 8, 8, "right")),
            (ClipSpec("run", 8, 10, "left"), ClipSpec("attack_basic_01", 8, 10, "right")),
            (ClipSpec("attack_basic_02", 8, 10, "left"), ClipSpec("heavy_attack", 10, 9, "right")),
            (ClipSpec("charge", 6, 10, "left"), ClipSpec("taunt_or_command", 6, 8, "right")),
            (ClipSpec("hit_react", 4, 12, "left"), ClipSpec("dash_or_dodge", 5, 12, "right")),
            (ClipSpec("town_idle", 6, 6, "left"), ClipSpec("interact", 6, 8, "right")),
            (ClipSpec("victory", 8, 9, "left"), ClipSpec("down_or_death", 6, 8, "right")),
        ),
    ),
    SubjectSpec(
        id="erin",
        name="Erin",
        category="character",
        frame_size=64,
        sheet_name="15-erin.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(158.0, 313.5, 466.0, 621.0, 776.5, 928.0, 1090.5, 1244.0),
        left_bounds=(148, 628),
        right_bounds=(690, 1382),
        full_bounds=(148, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 8, "left"), ClipSpec("walk", 8, 9, "right")),
            (ClipSpec("run", 8, 10, "left"), ClipSpec("attack_basic_01", 5, 11, "right")),
            (ClipSpec("attack_basic_02", 5, 11, "left"), ClipSpec("cast_start", 4, 10, "right")),
            (ClipSpec("cast_loop", 4, 8, "left"), ClipSpec("summon_or_rune", 8, 10, "right")),
            (ClipSpec("hit_react", 4, 12, "left"), ClipSpec("dash_or_dodge", 6, 13, "right")),
            (ClipSpec("town_idle", 6, 6, "left"), ClipSpec("interact", 6, 8, "right")),
            (ClipSpec("victory", 8, 10, "full"),),
            (ClipSpec("down_or_death", 6, 8, "full"),),
        ),
    ),
    SubjectSpec(
        id="nazir",
        name="Nazir",
        category="character",
        frame_size=64,
        sheet_name="16-nazir.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(164.0, 306.0, 448.0, 585.5, 717.5, 856.0, 1004.5, 1133.0, 1238.5),
        row_group_indices=(0, 1, 2, 3, 4, 5, 6, 8),
        left_bounds=(148, 628),
        right_bounds=(690, 1382),
        full_bounds=(148, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 8, "left"), ClipSpec("walk", 8, 10, "right")),
            (ClipSpec("run", 8, 14, "left"), ClipSpec("attack_basic_01", 6, 13, "right")),
            (ClipSpec("attack_basic_02", 6, 13, "left"), ClipSpec("attack_basic_03", 7, 13, "right")),
            (ClipSpec("charge", 6, 13, "left"), ClipSpec("skill_cast", 7, 12, "right")),
            (ClipSpec("stealth_entry", 6, 12, "left"), ClipSpec("hit_react", 4, 12, "right")),
            (ClipSpec("dash_or_dodge", 6, 15, "left"), ClipSpec("town_idle", 6, 6, "right")),
            (ClipSpec("talk", 4, 8, "left"), ClipSpec("victory", 8, 10, "right")),
            (ClipSpec("down_or_death", 6, 8, "full"),),
        ),
    ),
    SubjectSpec(
        id="laila",
        name="Laila",
        category="character",
        frame_size=64,
        sheet_name="17-laila.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(173.5, 322.5, 460.0, 600.5, 730.5, 868.5, 1003.5, 1141.0),
        left_bounds=(148, 628),
        right_bounds=(690, 1382),
        full_bounds=(148, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 8, "left"), ClipSpec("walk", 8, 9, "right")),
            (ClipSpec("run", 8, 10, "left"), ClipSpec("attack_basic_01", 5, 11, "right")),
            (ClipSpec("attack_basic_02", 5, 11, "left"), ClipSpec("cast_start", 4, 10, "right")),
            (ClipSpec("cast_release", 6, 12, "left"), ClipSpec("summon_or_rune", 8, 10, "right")),
            (ClipSpec("hit_react", 4, 12, "left"), ClipSpec("dash_or_dodge", 6, 13, "right")),
            (ClipSpec("town_idle", 6, 6, "left"), ClipSpec("interact", 6, 8, "right")),
            (ClipSpec("victory", 8, 10, "full"),),
            (ClipSpec("down_or_death", 6, 8, "full"),),
        ),
    ),
    SubjectSpec(
        id="hakan",
        name="Hakan",
        category="character",
        frame_size=64,
        sheet_name="18-hakan.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(176.5, 319.5, 461.5, 606.0, 743.5, 874.5, 1007.0, 1147.0),
        left_bounds=(148, 628),
        right_bounds=(690, 1382),
        full_bounds=(148, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 7, "left"), ClipSpec("walk", 8, 9, "right")),
            (ClipSpec("run", 8, 12, "left"), ClipSpec("attack_basic_01", 7, 11, "right")),
            (ClipSpec("attack_basic_02", 7, 11, "left"), ClipSpec("heavy_attack", 9, 10, "right")),
            (ClipSpec("charge", 6, 13, "left"), ClipSpec("skill_cast", 8, 10, "right")),
            (ClipSpec("hit_react", 4, 12, "left"), ClipSpec("guard_or_block", 4, 8, "right")),
            (ClipSpec("dash_or_dodge", 5, 12, "left"), ClipSpec("town_idle", 6, 6, "right")),
            (ClipSpec("taunt_or_command", 6, 8, "left"), ClipSpec("victory", 8, 9, "right")),
            (ClipSpec("down_or_death", 6, 8, "full"),),
        ),
    ),
    SubjectSpec(
        id="seraphin",
        name="Seraphine",
        category="character",
        frame_size=64,
        sheet_name="19-seraphine.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(169.0, 308.5, 448.0, 588.0, 723.0, 858.5, 1007.0, 1157.0),
        left_bounds=(148, 628),
        right_bounds=(690, 1382),
        full_bounds=(148, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 7, "left"), ClipSpec("walk", 8, 8, "right")),
            (ClipSpec("run", 8, 10, "left"), ClipSpec("attack_basic_01", 7, 10, "right")),
            (ClipSpec("attack_basic_02", 7, 10, "left"), ClipSpec("heavy_attack", 9, 9, "right")),
            (ClipSpec("skill_cast", 8, 10, "left"), ClipSpec("heal_cast", 8, 10, "right")),
            (ClipSpec("hit_react", 4, 12, "left"), ClipSpec("guard_or_block", 4, 8, "right")),
            (ClipSpec("dash_or_dodge", 5, 12, "left"), ClipSpec("pray_idle", 6, 6, "right")),
            (ClipSpec("town_idle", 6, 6, "left"), ClipSpec("victory", 8, 9, "right")),
            (ClipSpec("down_or_death", 6, 8, "full"),),
        ),
    ),
    SubjectSpec(
        id="micaela",
        name="Micaela",
        category="character",
        frame_size=64,
        sheet_name="20-michaela.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(173.0, 323.5, 466.0, 613.0, 750.0, 890.5, 1034.0, 1177.0),
        left_bounds=(148, 628),
        right_bounds=(690, 1382),
        full_bounds=(148, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 8, "left"), ClipSpec("walk", 8, 9, "right")),
            (ClipSpec("run", 8, 10, "left"), ClipSpec("attack_basic_01", 5, 11, "right")),
            (ClipSpec("attack_basic_02", 5, 11, "left"), ClipSpec("cast_start", 4, 10, "right")),
            (ClipSpec("heal_cast", 8, 10, "left"), ClipSpec("buff_cast", 6, 10, "right")),
            (ClipSpec("pray_idle", 6, 6, "left"), ClipSpec("hit_react", 4, 12, "right")),
            (ClipSpec("dash_or_dodge", 6, 13, "left"), ClipSpec("town_idle", 6, 6, "right")),
            (ClipSpec("victory", 8, 9, "full"),),
            (ClipSpec("down_or_death", 6, 8, "full"),),
        ),
    ),
    SubjectSpec(
        id="lucian",
        name="Lucian",
        category="character",
        frame_size=64,
        sheet_name="21-lucian.png",
        source_dir=CHARACTER_SOURCE_DIR,
        layout="uniform_paired",
        row_centers=(174.5, 324.5, 459.0, 602.5, 733.5, 870.5, 1009.5, 1137.5, 1240.5),
        row_group_indices=(0, 1, 2, 3, 4, 5, 6, 7),
        left_bounds=(148, 628),
        right_bounds=(728, 1382),
        full_bounds=(148, 1382),
        slice_mode="uniform_cells",
        rows=(
            (ClipSpec("idle", 6, 8, "left"), ClipSpec("walk", 8, 10, "right")),
            (ClipSpec("run", 8, 14, "left"), ClipSpec("attack_basic_01", 6, 13, "right")),
            (ClipSpec("attack_basic_02", 6, 13, "left"), ClipSpec("attack_basic_03", 7, 13, "right")),
            (ClipSpec("charge", 6, 13, "left"), ClipSpec("skill_cast", 7, 12, "right")),
            (ClipSpec("stealth_entry", 6, 12, "left"), ClipSpec("hit_react", 4, 12, "right")),
            (ClipSpec("dash_or_dodge", 6, 15, "left"), ClipSpec("town_idle", 6, 6, "right")),
            (ClipSpec("interact", 6, 8, "left"), ClipSpec("victory", 8, 10, "right")),
            (ClipSpec("down_or_death", 6, 8, "full"),),
        ),
    ),
)

PRUNED_RUNTIME_SUBJECTS: tuple[str, ...] = ()


ENEMY_BATCH_01: tuple[SubjectSpec, ...] = (
    SubjectSpec(
        id="thorn_wolf",
        name="Thorn Wolf",
        category="enemy",
        frame_size=48,
        sheet_name="22-thorn-wolf.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 12),),
            (ClipSpec("attack_basic_01", 6, 12),),
            (ClipSpec("attack_basic_02", 7, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="corrupted_wild_boar",
        name="Corrupted Wild Boar",
        category="enemy",
        frame_size=48,
        sheet_name="23-corrupted-wild-boar.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 13),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("charge_start", 4, 10),),
            (ClipSpec("charge_impact", 6, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="grassland_raider_vanguard",
        name="Grassland Raider Vanguard",
        category="enemy",
        frame_size=48,
        sheet_name="24-grassland-raider-vanguard.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 11),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("attack_basic_02", 6, 11),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="blackhorn_chieftain",
        name="Blackhorn Chieftain",
        category="enemy",
        frame_size=96,
        sheet_name="25-blackhorn-chieftain.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("heavy_attack", 9, 10),),
            (ClipSpec("horn_sweep", 8, 9),),
            (ClipSpec("charge_start", 5, 9),),
            (ClipSpec("charge_impact", 6, 12),),
            (ClipSpec("taunt_or_command", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="morgan",
        name="Morgan",
        category="enemy",
        frame_size=96,
        sheet_name="26-morgan.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("heavy_attack", 10, 9),),
            (ClipSpec("slam_burst", 8, 10),),
            (ClipSpec("charge_start", 5, 9),),
            (ClipSpec("charge_impact", 6, 11),),
            (ClipSpec("roar_or_enrage", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="ash_mine_worker",
        name="Ash-Mine Worker",
        category="enemy",
        frame_size=48,
        sheet_name="27-ash-mine-worker.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("attack_basic_02", 6, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="slag_automaton",
        name="Slag Automaton",
        category="enemy",
        frame_size=48,
        sheet_name="28-slag-automaton.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("attack_basic_01", 6, 10),),
            (ClipSpec("heavy_attack", 8, 9),),
            (ClipSpec("burst_release", 6, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
)


ENEMY_BATCH_02: tuple[SubjectSpec, ...] = (
    SubjectSpec(
        id="ember_heavy_trooper",
        name="Ember Heavy Trooper",
        category="enemy",
        frame_size=48,
        sheet_name="29-ember-heavy-trooper.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 7, 10),),
            (ClipSpec("heavy_attack", 8, 9),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="bares",
        name="Bares",
        category="enemy",
        frame_size=96,
        sheet_name="30-bares.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("heavy_attack", 10, 9),),
            (ClipSpec("crusher_slam", 8, 10),),
            (ClipSpec("burst_release", 7, 10),),
            (ClipSpec("taunt_or_command", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="dravorn",
        name="Dravorn",
        category="enemy",
        frame_size=96,
        sheet_name="31-dravorn.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("heavy_attack", 9, 9),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_release", 8, 10),),
            (ClipSpec("charge_burst", 6, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="mist_raider",
        name="Mist Raider",
        category="enemy",
        frame_size=48,
        sheet_name="32-mist-raider.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 12),),
            (ClipSpec("attack_basic_01", 6, 12),),
            (ClipSpec("attack_basic_02", 6, 12),),
            (ClipSpec("evade_step", 5, 13),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="coastal_horror",
        name="Coastal Horror",
        category="enemy",
        frame_size=48,
        sheet_name="33-coastal-horror.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 11),),
            (ClipSpec("attack_basic_01", 6, 12),),
            (ClipSpec("attack_basic_02", 7, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="corrupted_sanctuary_guardian",
        name="Corrupted Sanctuary Guardian",
        category="enemy",
        frame_size=48,
        sheet_name="34-corrupted-sanctuary-guardian.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_release", 6, 12),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="elrent",
        name="Elrent",
        category="enemy",
        frame_size=96,
        sheet_name="35-elrent.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("cast_release", 8, 10),),
            (ClipSpec("tidal_burst", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="nereph",
        name="Nereph",
        category="enemy",
        frame_size=96,
        sheet_name="36-nereph.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("heavy_attack", 9, 10),),
            (ClipSpec("tidal_sweep", 8, 10),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_release", 8, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="frost_hound",
        name="Frost Hound",
        category="enemy",
        frame_size=48,
        sheet_name="37-frost-hound.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 13),),
            (ClipSpec("attack_basic_01", 6, 12),),
            (ClipSpec("attack_basic_02", 7, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="frozen_legion_trooper",
        name="Frozen Legion Trooper",
        category="enemy",
        frame_size=48,
        sheet_name="38-frozen-legion-trooper.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("attack_basic_02", 6, 11),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="barrow_wraith",
        name="Barrow Wraith",
        category="enemy",
        frame_size=48,
        sheet_name="39-barrow-wraith.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("float", 8, 8),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("cast_release", 6, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="hrod",
        name="Hrod",
        category="enemy",
        frame_size=96,
        sheet_name="40-hrod.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("heavy_attack", 10, 9),),
            (ClipSpec("stomp_burst", 8, 9),),
            (ClipSpec("charge_step", 6, 10),),
            (ClipSpec("roar_or_enrage", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="valtern",
        name="Valtern",
        category="enemy",
        frame_size=96,
        sheet_name="41-valtern.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("heavy_attack", 8, 10),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("cast_release", 8, 10),),
            (ClipSpec("taunt_or_command", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="sand_tracker_beast",
        name="Sand Tracker Beast",
        category="enemy",
        frame_size=48,
        sheet_name="42-sand-tracker-beast.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 13),),
            (ClipSpec("attack_basic_01", 6, 12),),
            (ClipSpec("charge_start", 4, 10),),
            (ClipSpec("charge_impact", 6, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="ruin_automaton",
        name="Ruin Automaton",
        category="enemy",
        frame_size=48,
        sheet_name="43-ruin-automaton.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("aim", 4, 8),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_release", 6, 10),),
            (ClipSpec("heavy_attack", 7, 9),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="mirage_raider",
        name="Mirage Raider",
        category="enemy",
        frame_size=48,
        sheet_name="44-mirage-raider.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 9),),
            (ClipSpec("run", 8, 12),),
            (ClipSpec("attack_basic_01", 6, 12),),
            (ClipSpec("attack_basic_02", 6, 12),),
            (ClipSpec("stealth_step", 6, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="setra",
        name="Setra",
        category="enemy",
        frame_size=96,
        sheet_name="45-setra.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 11),),
            (ClipSpec("heavy_attack", 8, 10),),
            (ClipSpec("leap_strike", 8, 10),),
            (ClipSpec("charge_start", 5, 10),),
            (ClipSpec("charge_impact", 6, 12),),
            (ClipSpec("roar_or_command", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="kazer",
        name="Kazer",
        category="enemy",
        frame_size=96,
        sheet_name="46-kazer.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("heavy_attack", 8, 9),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("cast_release", 8, 10),),
            (ClipSpec("judgment_burst", 7, 10),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="fallen_holy_knight",
        name="Fallen Holy Knight",
        category="enemy",
        frame_size=48,
        sheet_name="47-fallen-holy-knight.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("heavy_attack", 7, 10),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="black_moon_inquisitor",
        name="Black Moon Inquisitor",
        category="enemy",
        frame_size=48,
        sheet_name="48-black-moon-inquisitor.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 8),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("cast_release", 6, 12),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="black_moon_vanguard",
        name="Black Moon Vanguard",
        category="enemy",
        frame_size=48,
        sheet_name="49-black-moon-vanguard.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("attack_basic_01", 6, 11),),
            (ClipSpec("attack_basic_02", 6, 11),),
            (ClipSpec("guard_or_block", 4, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="cardinal_serdin",
        name="Cardinal Serdin",
        category="enemy",
        frame_size=96,
        sheet_name="50-cardinal-serdin.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("heavy_attack", 8, 9),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("cast_release", 8, 10),),
            (ClipSpec("judgment_wave", 7, 10),),
            (ClipSpec("taunt_or_command", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
    SubjectSpec(
        id="varkan",
        name="Varkan",
        category="enemy",
        frame_size=96,
        sheet_name="51-varkan.png",
        source_dir=ENEMY_SOURCE_DIR,
        layout="uniform_single",
        rows=(
            (ClipSpec("idle", 6, 7),),
            (ClipSpec("walk", 8, 8),),
            (ClipSpec("run", 8, 10),),
            (ClipSpec("heavy_attack", 9, 10),),
            (ClipSpec("cast_start", 4, 10),),
            (ClipSpec("cast_loop", 4, 8),),
            (ClipSpec("cast_release", 8, 10),),
            (ClipSpec("charge_burst", 7, 11),),
            (ClipSpec("taunt_or_command", 6, 8),),
            (ClipSpec("hit_react", 4, 12),),
            (ClipSpec("down_or_death", 6, 8),),
        ),
    ),
)


MANUAL_SOURCE_BOX_CLIPS: dict[tuple[str, str], tuple[tuple[int, int, int, int], ...]] = {
    (
        "nazir",
        "idle",
    ): (
        (52, 124, 132, 242),
        (140, 124, 220, 242),
        (228, 124, 308, 242),
        (316, 124, 396, 242),
        (404, 124, 486, 242),
        (492, 124, 572, 242),
    ),
    (
        "nazir",
        "walk",
    ): (
        (688, 172, 749, 242),
        (742, 172, 909, 242),
        (900, 172, 1067, 242),
        (1058, 172, 1149, 241),
    ),
    (
        "nazir",
        "run",
    ): (
        (144, 300, 197, 387),
        (190, 301, 281, 387),
        (273, 300, 364, 387),
        (356, 300, 446, 387),
        (439, 300, 528, 387),
        (521, 296, 610, 387),
    ),
    (
        "nazir",
        "attack_basic_01",
    ): (
        (688, 305, 725, 387),
        (722, 303, 891, 387),
        (888, 305, 975, 387),
        (968, 303, 1056, 387),
        (1048, 303, 1149, 387),
    ),
    (
        "nazir",
        "attack_basic_02",
    ): (
        (146, 453, 227, 523),
        (226, 453, 324, 523),
        (322, 453, 410, 523),
        (414, 453, 549, 523),
        (580, 483, 628, 523),
    ),
    (
        "seraphin",
        "idle",
    ): (
        (114, 126, 178, 246),
        (190, 126, 254, 246),
        (266, 126, 332, 246),
        (344, 126, 412, 246),
        (424, 126, 492, 246),
        (504, 126, 572, 246),
    ),
}

SUBJECT_PROXY_CLIP_IDS: dict[tuple[str, str], str] = {
    ("nazir", "walk"): "run",
    ("nazir", "attack_basic_01"): "attack_basic_02",
    ("nazir", "charge"): "attack_basic_02",
    ("nazir", "town_idle"): "idle",
}

SUBJECT_MANUAL_FRAME_OVERRIDES: dict[tuple[str, str], dict[int, int]] = {
    ("nazir", "idle"): {
        0: 2,
        1: 3,
    },
    ("nazir", "town_idle"): {
        0: 2,
        1: 3,
    },
}


def load_image(subject: SubjectSpec) -> Image.Image:
    source_path = subject.source_dir / subject.sheet_name
    if not source_path.exists():
        raise FileNotFoundError(f"Missing source master sheet: {source_path}")
    return Image.open(source_path).convert("RGBA")


def build_uniform_bands(image: Image.Image, row_count: int) -> list[tuple[int, int]]:
    bands = BASE.build_uniform_bands_from_foreground(image, row_count)

    if not bands:
        return bands

    top_offset = 96
    if bands[0][0] < top_offset:
        adjusted: list[tuple[int, int]] = []
        total_height = max(1, image.size[1] - top_offset)
        row_height = total_height / row_count

        for index in range(row_count):
            band_top = int(round(top_offset + index * row_height - (6 if index > 0 else 0)))
            band_bottom = int(round(top_offset + (index + 1) * row_height + (6 if index < row_count - 1 else 0)))
            adjusted.append((max(top_offset, band_top), min(image.size[1], band_bottom)))

        return adjusted

    return bands


def build_subject_bands(subject: SubjectSpec, image: Image.Image) -> list[tuple[int, int]]:
    if subject.row_centers is None:
        return build_uniform_bands(image, len(subject.rows))

    margin = 60
    min_y = max(100, int(round(subject.row_centers[0] - margin)))
    max_y = min(image.size[1] - 12, int(round(subject.row_centers[-1] + margin)))
    bands = BASE.build_row_boundaries(list(subject.row_centers), min_y=min_y, max_y=max_y)

    if subject.row_group_indices is None:
        return bands

    return [bands[index] for index in subject.row_group_indices]


def filter_cell_mask_components(cell_mask: np.ndarray) -> np.ndarray:
    components = BASE.connected_components(cell_mask)

    if len(components) <= 1:
        return cell_mask

    largest_area = max(area for _, _, _, _, area in components)
    keep_mask = np.zeros_like(cell_mask)

    for min_x, min_y, max_x, max_y, area in components:
        width = max_x - min_x + 1
        height = max_y - min_y + 1
        touches_left_border = min_x <= 1
        touches_right_border = max_x >= cell_mask.shape[1] - 2
        touches_top_border = min_y <= 1
        touches_bottom_border = max_y >= cell_mask.shape[0] - 2
        is_tiny = area < max(24, int(largest_area * 0.08))
        looks_like_label_scrap = (
            touches_left_border and max_x < int(cell_mask.shape[1] * 0.22) and area < int(largest_area * 0.7)
        ) or (
            touches_right_border
            and min_x > int(cell_mask.shape[1] * 0.78)
            and area < int(largest_area * 0.7)
        )
        looks_like_edge_bar = (
            (touches_left_border or touches_right_border) and width <= 14 and area < int(largest_area * 0.8)
        ) or (
            touches_top_border and height <= 12 and area < int(largest_area * 0.55)
        ) or (
            touches_bottom_border and height <= 10 and area < int(largest_area * 0.45)
        )

        if is_tiny or looks_like_label_scrap or looks_like_edge_bar:
            continue

        keep_mask[min_y : max_y + 1, min_x : max_x + 1] |= cell_mask[min_y : max_y + 1, min_x : max_x + 1]

    if keep_mask.any():
        return keep_mask

    return cell_mask


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


def detect_bottom_index_centers(rgba: np.ndarray, frame_count: int) -> list[float] | None:
    alpha_mask = rgba[:, :, 3] > 0

    if not alpha_mask.any():
        return None

    rgb = rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    region_height, region_width = alpha_mask.shape
    bottom_band = np.zeros_like(alpha_mask)
    bottom_band[max(0, region_height - 28) : region_height, :] = True
    candidate_mask = alpha_mask & bottom_band & (brightness < 180) & (saturation < 130)
    components: list[tuple[int, int]] = []

    for min_x, min_y, max_x, max_y, area in BASE.connected_components(candidate_mask):
        width = max_x - min_x + 1
        height = max_y - min_y + 1

        if width <= 18 and height <= 16 and area <= 130:
            components.append((min_x, max_x))

    if not components:
        return None

    components.sort(key=lambda item: item[0])
    groups: list[list[tuple[int, int]]] = []

    for component in components:
        if groups and component[0] - groups[-1][-1][1] <= 8:
            groups[-1].append(component)
        else:
            groups.append([component])

    centers = [
        (min(item[0] for item in group) + max(item[1] for item in group)) / 2
        for group in groups
    ]

    if len(centers) == frame_count:
        return centers

    if len(centers) == frame_count - 1 and len(centers) >= 2:
        gaps = [centers[index + 1] - centers[index] for index in range(len(centers) - 1)]
        median_gap = float(np.median(gaps))
        left_margin = centers[0]
        right_margin = region_width - centers[-1]

        if right_margin > left_margin:
            centers.append(centers[-1] + median_gap)
        else:
            centers.insert(0, centers[0] - median_gap)

        return centers

    return None


def build_frame_intervals_from_centers(
    centers: list[float],
    region_width: int,
) -> list[tuple[int, int]]:
    if len(centers) < 2:
        return []

    boundaries = [int(round((centers[index] + centers[index + 1]) / 2)) for index in range(len(centers) - 1)]
    first_gap = centers[1] - centers[0]
    last_gap = centers[-1] - centers[-2]
    left_edge = max(0, int(round(centers[0] - (first_gap / 2))))
    right_edge = min(region_width, int(round(centers[-1] + (last_gap / 2))))
    intervals: list[tuple[int, int]] = []
    current_left = left_edge

    for boundary in boundaries:
        intervals.append((current_left, max(current_left + 1, boundary)))
        current_left = boundary

    intervals.append((current_left, max(current_left + 1, right_edge)))
    return intervals


def extract_uniform_frames(
    image: Image.Image,
    x_start: int,
    x_end: int,
    y_start: int,
    y_end: int,
    frame_count: int,
) -> list[BASE.ExtractedFrame]:
    region = BASE.remove_border_palette_background(
        BASE.remove_checkerboard_background(image.crop((x_start, y_start, x_end, y_end)))
    )
    rgba = np.array(region.convert("RGBA"))
    frames: list[BASE.ExtractedFrame] = []
    previous_frame: BASE.ExtractedFrame | None = None
    region_width = rgba.shape[1]
    region_mask = rgba[:, :, 3] > 0
    analysis_region_mask = region_mask.copy()
    if analysis_region_mask.shape[0] > 24:
        analysis_region_mask[:12, :] = False
        analysis_region_mask[-14:, :] = False
    active_bounds = BASE.compute_active_horizontal_bounds(analysis_region_mask)

    if active_bounds is None:
        active_left = 0
        active_right = region_width
    else:
        active_left, active_right = active_bounds

    index_centers = detect_bottom_index_centers(rgba[:, active_left:active_right], frame_count)

    if index_centers is not None:
        frame_intervals = [
            (active_left + interval_left, active_left + interval_right)
            for interval_left, interval_right in build_frame_intervals_from_centers(
                index_centers,
                active_right - active_left,
            )
        ]
    else:
        interval_mask = analysis_region_mask[:, active_left:active_right]
        detected_intervals = detect_frame_intervals(interval_mask, frame_count)

        if detected_intervals is not None:
            frame_intervals = [
                (active_left + interval_left, active_left + interval_right + 1)
                for interval_left, interval_right in detected_intervals
            ]
        else:
            frame_intervals = []
            for index in range(frame_count):
                cell_left = int(round(active_left + ((active_right - active_left) * index / frame_count)))
                cell_right = int(round(active_left + ((active_right - active_left) * (index + 1) / frame_count)))
                frame_intervals.append((cell_left, max(cell_left + 1, cell_right)))

    for cell_left, cell_right in frame_intervals:
        cell_rgba = rgba[:, cell_left:cell_right].copy()
        cell_alpha = cell_rgba[:, :, 3] > 0
        analysis_cell_mask = cell_alpha.copy()
        if analysis_cell_mask.shape[0] > 24:
            analysis_cell_mask[:12, :] = False
            analysis_cell_mask[-14:, :] = False
        cell_mask = filter_cell_mask_components(analysis_cell_mask)
        cell_mask = BASE.refine_primary_frame_mask(cell_mask)
        coords = np.argwhere(cell_mask)
        selected_mask = cell_mask

        if coords.size == 0:
            cell_mask = filter_cell_mask_components(cell_alpha)
            cell_mask = BASE.refine_primary_frame_mask(cell_mask)
            coords = np.argwhere(cell_mask)
            selected_mask = cell_mask

        if coords.size == 0:
            if previous_frame is not None:
                frames.append(
                    BASE.ExtractedFrame(
                        image=previous_frame.image.copy(),
                        anchor_x=previous_frame.anchor_x,
                        anchor_y=previous_frame.anchor_y,
                    )
                )
                continue

            empty = Image.new("RGBA", (24, 24), (0, 0, 0, 0))
            frames.append(BASE.ExtractedFrame(image=empty, anchor_x=12.0, anchor_y=23.0))
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
        anchor_x, anchor_y = BASE.compute_frame_anchor(frame_coords)
        extracted_frame = BASE.ExtractedFrame(
            image=Image.fromarray(crop_rgba),
            anchor_x=anchor_x,
            anchor_y=anchor_y,
        )
        frames.append(extracted_frame)
        previous_frame = extracted_frame

    return frames


def detect_row_label_edge(
    image: Image.Image,
    band_top: int,
    band_bottom: int,
    region: Region,
    fallback_start: int,
) -> int:
    rgba = np.array(image.crop((0, band_top, image.size[0], band_bottom)).convert("RGBA"))
    rgb = rgba[:, :, :3].astype(np.int16)
    brightness = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    dark_mask = (rgba[:, :, 3] > 0) & (brightness < 150) & (saturation < 110)
    search_mask = np.zeros_like(dark_mask)
    mid_x = image.size[0] // 2

    if region == "left":
        search_left, search_right = 0, min(image.size[0], fallback_start + 120)
    elif region == "right":
        search_left = max(0, mid_x - 20)
        search_right = min(image.size[0], fallback_start + 40)
    else:
        search_left, search_right = 0, min(image.size[0], fallback_start + 120)

    search_mask[:, search_left:search_right] = dark_mask[:, search_left:search_right]
    candidate_boxes = [
        (min_x, min_y, max_x, max_y, area)
        for min_x, min_y, max_x, max_y, area in BASE.connected_components(search_mask)
        if (
            area >= 1200
            and 70 <= (max_x - min_x + 1) <= 240
            and 24 <= (max_y - min_y + 1) <= 88
            and min_y <= max(24, int((band_bottom - band_top) * 0.22))
        )
    ]

    if not candidate_boxes:
        return fallback_start

    _, _, max_x, _, _ = max(candidate_boxes, key=lambda entry: (entry[4], entry[2]))
    return max(0, int(max_x) + 28)


def fit_frames(frames: list[BASE.ExtractedFrame], frame_size: int) -> Image.Image:
    max_left_extent = max(frame.anchor_x for frame in frames)
    max_right_extent = max(frame.image.size[0] - frame.anchor_x for frame in frames)
    max_above_extent = max(frame.anchor_y for frame in frames)
    max_below_extent = max(frame.image.size[1] - frame.anchor_y for frame in frames)
    scale = min(
        (frame_size - 4) / max(max_left_extent + max_right_extent, 1.0),
        (frame_size - 4) / max(max_above_extent + max_below_extent, 1.0),
        1.0,
    )
    scaled_left_extent = max_left_extent * scale
    scaled_right_extent = max_right_extent * scale
    scaled_below_extent = max_below_extent * scale
    cell_anchor_x = ((frame_size - (scaled_left_extent + scaled_right_extent)) / 2) + scaled_left_extent
    cell_anchor_y = frame_size - 2 - scaled_below_extent
    strip = Image.new("RGBA", (frame_size * len(frames), frame_size), (0, 0, 0, 0))

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
        paste_x = int(round(index * frame_size + cell_anchor_x - scaled_anchor_x))
        paste_y = int(round(cell_anchor_y - scaled_anchor_y))
        paste_x = max(index * frame_size, min(index * frame_size + frame_size - resized.size[0], paste_x))
        paste_y = max(0, min(frame_size - resized.size[1], paste_y))
        strip.paste(resized, (paste_x, paste_y), resized)

    return strip


def extract_frames_from_source_boxes(
    image: Image.Image,
    source_boxes: tuple[tuple[int, int, int, int], ...],
    frame_count: int,
    category: Category,
) -> list[BASE.ExtractedFrame]:
    frames = [BASE.extract_frame_from_source_box(image, source_box) for source_box in source_boxes]
    frames = BASE.resample_frames_to_count(frames, frame_count)
    if category == "character":
        frames = BASE.postprocess_character_frames(frames)
        frames = repair_character_frame_outliers(frames)
        frames = BASE.stabilize_character_clip_frames(frames)
    return frames


def repair_character_frame_outliers(frames: list[BASE.ExtractedFrame]) -> list[BASE.ExtractedFrame]:
    if len(frames) <= 1:
        return frames

    stats: list[tuple[int, int, int, float, float]] = []

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            stats.append((0, 0, 0, 0.0, 0.0))
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
        stats.append((area, width, height, brightness, rgb_std))

    areas = [item[0] for item in stats if item[0] > 0]
    widths = [item[1] for item in stats if item[1] > 0]
    heights = [item[2] for item in stats if item[2] > 0]

    if not areas or not widths or not heights:
        return frames

    median_area = float(np.median(areas))
    median_width = float(np.median(widths))
    median_height = float(np.median(heights))
    bad_indices: set[int] = set()

    for index, (area, width, height, brightness, rgb_std) in enumerate(stats):
        if area == 0:
            bad_indices.add(index)
            continue

        looks_too_small = (
            area < median_area * 0.32
            or width < median_width * 0.38
            or height < median_height * 0.42
        )
        looks_like_panel = (
            width >= max(10, median_width * 0.6)
            and height >= max(18, median_height * 0.55)
            and brightness <= 70
            and rgb_std <= 18
        )

        if looks_too_small or looks_like_panel:
            bad_indices.add(index)

    if not bad_indices:
        return frames

    good_indices = [index for index in range(len(frames)) if index not in bad_indices]

    if not good_indices:
        return frames

    repaired: list[BASE.ExtractedFrame] = []

    for index, frame in enumerate(frames):
        if index not in bad_indices:
            repaired.append(frame)
            continue

        replacement_index = min(good_indices, key=lambda candidate: abs(candidate - index))
        replacement = frames[replacement_index]
        repaired.append(
            BASE.ExtractedFrame(
                image=replacement.image.copy(),
                anchor_x=replacement.anchor_x,
                anchor_y=replacement.anchor_y,
            )
        )

    return repaired


def score_frames_quality(
    frames: list[BASE.ExtractedFrame],
    category: Category,
) -> float:
    if not frames:
        return -1_000_000.0

    alpha_areas: list[int] = []
    bbox_widths: list[int] = []
    bbox_heights: list[int] = []
    non_empty = 0

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            alpha_areas.append(0)
            bbox_widths.append(0)
            bbox_heights.append(0)
            continue

        non_empty += 1
        min_y = int(coords[:, 0].min())
        max_y = int(coords[:, 0].max())
        min_x = int(coords[:, 1].min())
        max_x = int(coords[:, 1].max())
        alpha_areas.append(int(coords.shape[0]))
        bbox_widths.append(max_x - min_x + 1)
        bbox_heights.append(max_y - min_y + 1)

    if non_empty == 0:
        return -1_000_000.0

    median_area = float(np.median(alpha_areas))
    median_width = float(np.median(bbox_widths))
    median_height = float(np.median(bbox_heights))
    area_std = float(np.std(alpha_areas)) if len(alpha_areas) > 1 else 0.0
    width_std = float(np.std(bbox_widths)) if len(bbox_widths) > 1 else 0.0
    height_std = float(np.std(bbox_heights)) if len(bbox_heights) > 1 else 0.0
    empty_penalty = (len(frames) - non_empty) * 500.0
    size_penalty = area_std * 0.55 + width_std * 9.0 + height_std * 9.0

    if category == "character":
        return (median_area * 2.0) + (median_width * 28.0) + (median_height * 20.0) - size_penalty - empty_penalty

    return (median_area * 1.8) + (median_width * 24.0) + (median_height * 18.0) - size_penalty - empty_penalty


def choose_better_frames(
    primary_frames: list[BASE.ExtractedFrame] | None,
    secondary_frames: list[BASE.ExtractedFrame] | None,
    category: Category,
) -> list[BASE.ExtractedFrame] | None:
    primary_ok = (
        primary_frames is not None and frames_are_plausible_for_subject(primary_frames, category)
    )
    secondary_ok = (
        secondary_frames is not None and frames_are_plausible_for_subject(secondary_frames, category)
    )

    if primary_ok and secondary_ok:
        primary_score = score_frames_quality(primary_frames, category)
        secondary_score = score_frames_quality(secondary_frames, category)
        return primary_frames if primary_score >= secondary_score else secondary_frames

    if primary_ok:
        return primary_frames

    if secondary_ok:
        return secondary_frames

    return primary_frames or secondary_frames


def frames_are_plausible_for_subject(
    frames: list[BASE.ExtractedFrame],
    category: Category,
) -> bool:
    if category == "character":
        return BASE.character_frames_are_plausible(frames)

    if len(frames) < 2:
        return False

    alpha_areas: list[int] = []
    bbox_widths: list[int] = []
    bbox_heights: list[int] = []

    for frame in frames:
        rgba = np.array(frame.image.convert("RGBA"))
        coords = np.argwhere(rgba[:, :, 3] > 0)

        if coords.size == 0:
            continue

        min_y = int(coords[:, 0].min())
        max_y = int(coords[:, 0].max())
        min_x = int(coords[:, 1].min())
        max_x = int(coords[:, 1].max())
        alpha_areas.append(int(coords.shape[0]))
        bbox_widths.append(max_x - min_x + 1)
        bbox_heights.append(max_y - min_y + 1)

    if len(alpha_areas) < max(2, len(frames) // 2):
        return False

    return (
        float(np.median(alpha_areas)) >= 90
        and float(np.median(bbox_widths)) >= 10
        and float(np.median(bbox_heights)) >= 12
    )


def get_region_bounds(subject: SubjectSpec, region: Region) -> tuple[int, int]:
    image = load_image(subject)
    if region == "left":
        return 0, max(1, image.size[0] // 2)
    if region == "right":
        return max(0, image.size[0] // 2), image.size[0]
    return 0, image.size[0]


def build_subject_payload(subject: SubjectSpec) -> dict:
    image = load_image(subject)
    bands = build_subject_bands(subject, image)
    clips: list[dict] = []

    for row_specs, (band_top, band_bottom) in zip(subject.rows, bands):
        for clip_spec in row_specs:
            effective_clip_id = SUBJECT_PROXY_CLIP_IDS.get((subject.id, clip_spec.id), clip_spec.id)
            manual_source_boxes = MANUAL_SOURCE_BOX_CLIPS.get((subject.id, effective_clip_id))
            if manual_source_boxes is not None:
                frames = extract_frames_from_source_boxes(
                    image=image,
                    source_boxes=manual_source_boxes,
                    frame_count=clip_spec.frame_count,
                    category=subject.category,
                )
                frame_overrides = SUBJECT_MANUAL_FRAME_OVERRIDES.get((subject.id, clip_spec.id), {})
                if frame_overrides:
                    adjusted_frames = list(frames)
                    for target_index, source_index in frame_overrides.items():
                        if 0 <= target_index < len(adjusted_frames) and 0 <= source_index < len(adjusted_frames):
                            adjusted_frames[target_index] = adjusted_frames[source_index]
                    frames = adjusted_frames
                strip = fit_frames(frames, subject.frame_size)
                clips.append(write_strip(subject, clip_spec, strip, frame_count_override=len(frames)))
                continue

            region_manual_spec = BASE.REGION_MANUAL_CLIP_EXTRACTION_SPECS.get(subject.id, {}).get(clip_spec.id)
            if clip_spec.region == "left":
                if subject.left_bounds is not None:
                    x_start, x_end = subject.left_bounds
                elif subject.category == "enemy":
                    x_start, x_end = 110, max(1, (image.size[0] // 2) - 12)
                else:
                    x_start, x_end = 0, max(1, image.size[0] // 2)
            elif clip_spec.region == "right":
                if subject.right_bounds is not None:
                    x_start, x_end = subject.right_bounds
                elif subject.category == "enemy":
                    x_start, x_end = max(0, (image.size[0] // 2) + 28), max(1, image.size[0] - 20)
                else:
                    x_start, x_end = max(0, image.size[0] // 2), image.size[0]
            else:
                if subject.full_bounds is not None:
                    x_start, x_end = subject.full_bounds
                elif subject.category == "enemy":
                    x_start, x_end = 110, max(1, image.size[0] - 20)
                else:
                    x_start, x_end = 0, image.size[0]

            effective_uniform_mode = subject.slice_mode == "uniform_cells" or subject.category == "enemy"

            if effective_uniform_mode:
                x_start = detect_row_label_edge(image, band_top, band_bottom, clip_spec.region, x_start)
                x_start = min(x_start, max(0, x_end - 8))

            suppress_presentation_artifacts = True
            uniform_candidate_frames: list[BASE.ExtractedFrame] | None = None
            if effective_uniform_mode:
                uniform_candidate_frames = extract_uniform_frames(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    frame_count=clip_spec.frame_count,
                )
                if subject.category == "character":
                    uniform_candidate_frames = BASE.postprocess_character_frames(uniform_candidate_frames)

            if region_manual_spec is not None:
                try:
                    frames = BASE.extract_frames_from_region_manual_spec(
                        image=image,
                        clip_id=clip_spec.id,
                        spec=region_manual_spec,
                        suppress_presentation_artifacts=suppress_presentation_artifacts,
                    )
                except RuntimeError:
                    component_frames = BASE.extract_component_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        clip_id=clip_spec.id,
                        expected_frame_count=clip_spec.frame_count,
                        cleanup_character_artifacts=subject.category == "character",
                        suppress_presentation_artifacts=suppress_presentation_artifacts,
                    )

                    if len(component_frames) >= 2 and frames_are_plausible_for_subject(component_frames, subject.category):
                        frames = BASE.resample_frames_to_count(component_frames, clip_spec.frame_count)
                    elif uniform_candidate_frames is not None and frames_are_plausible_for_subject(uniform_candidate_frames, subject.category):
                        frames = uniform_candidate_frames
                    else:
                        frames = BASE.extract_frames_from_region(
                            image=image,
                            x_start=x_start,
                            x_end=x_end,
                            y_start=band_top,
                            y_end=band_bottom,
                            frame_count=clip_spec.frame_count,
                            clip_id=clip_spec.id,
                            suppress_presentation_artifacts=suppress_presentation_artifacts,
                        )
            elif uniform_candidate_frames is not None:
                component_frames = BASE.extract_component_frames_from_region(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    clip_id=clip_spec.id,
                    expected_frame_count=clip_spec.frame_count,
                    cleanup_character_artifacts=subject.category == "character",
                    suppress_presentation_artifacts=suppress_presentation_artifacts,
                )
                if len(component_frames) >= 2:
                    component_frames = BASE.resample_frames_to_count(component_frames, clip_spec.frame_count)
                chosen_frames = choose_better_frames(
                    uniform_candidate_frames,
                    component_frames,
                    subject.category,
                )
                if chosen_frames is not None:
                    frames = chosen_frames
                else:
                    frames = uniform_candidate_frames
            else:
                component_frames = BASE.extract_component_frames_from_region(
                    image=image,
                    x_start=x_start,
                    x_end=x_end,
                    y_start=band_top,
                    y_end=band_bottom,
                    clip_id=clip_spec.id,
                    expected_frame_count=clip_spec.frame_count,
                    cleanup_character_artifacts=subject.category == "character",
                    suppress_presentation_artifacts=suppress_presentation_artifacts,
                )

                if len(component_frames) >= 2:
                    component_frames = BASE.resample_frames_to_count(component_frames, clip_spec.frame_count)
                chosen_frames = choose_better_frames(
                    component_frames,
                    uniform_candidate_frames,
                    subject.category,
                )
                if chosen_frames is not None:
                    frames = chosen_frames
                else:
                    frames = BASE.extract_frames_from_region(
                        image=image,
                        x_start=x_start,
                        x_end=x_end,
                        y_start=band_top,
                        y_end=band_bottom,
                        frame_count=clip_spec.frame_count,
                        clip_id=clip_spec.id,
                        suppress_presentation_artifacts=suppress_presentation_artifacts,
                    )
            if subject.category == "character":
                frames = BASE.postprocess_character_frames(frames)
                frames = repair_character_frame_outliers(frames)
                frames = BASE.resample_frames_to_count(frames, clip_spec.frame_count)
                frames = BASE.stabilize_character_clip_frames(frames)
            strip = fit_frames(frames, subject.frame_size)
            clips.append(write_strip(subject, clip_spec, strip, frame_count_override=len(frames)))

    return {
        "id": subject.id,
        "name": subject.name,
        "category": subject.category,
        "clips": clips,
    }


def write_strip(
    subject: SubjectSpec,
    clip_spec: ClipSpec,
    strip: Image.Image,
    frame_count_override: int | None = None,
) -> dict:
    category_dir_name = "characters" if subject.category == "character" else "enemies"
    target_dir = ROOT / "public" / "assets" / "runtime" / category_dir_name / subject.id
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / f"{clip_spec.id}.png"
    strip.save(target_path)
    return {
        "id": clip_spec.id,
        "path": target_path.relative_to(ROOT / "public").as_posix(),
        "frameWidth": subject.frame_size,
        "frameHeight": subject.frame_size,
        "frameCount": frame_count_override if frame_count_override is not None else clip_spec.frame_count,
        "fps": clip_spec.fps,
    }


def merge_manifest(subject_payloads: list[dict]) -> None:
    pruned_subject_keys = set(PRUNED_RUNTIME_SUBJECTS)

    if MANIFEST_PATH.exists():
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    else:
        manifest = {"version": 1, "generatedAt": "2026-04-05", "subjects": []}

    existing_subjects = [
        subject
        for subject in manifest.get("subjects", [])
        if f"{subject.get('category')}:{subject.get('id')}"
        not in {f"{entry['category']}:{entry['id']}" for entry in subject_payloads}
        and f"{subject.get('category')}:{subject.get('id')}" not in pruned_subject_keys
    ]
    manifest["version"] = 1
    manifest["generatedAt"] = "2026-04-05"
    manifest["note"] = "Runtime animation clips generated from approved character, enemy, npc, and VFX source sheets."
    manifest["subjects"] = existing_subjects + subject_payloads
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main() -> None:
    for subject_key in PRUNED_RUNTIME_SUBJECTS:
        category, subject_id = subject_key.split(":", 1)
        category_dir_name = "characters" if category == "character" else "enemies"
        target_dir = ROOT / "public" / "assets" / "runtime" / category_dir_name / subject_id
        if target_dir.exists():
            for entry in target_dir.iterdir():
                entry.unlink()
            target_dir.rmdir()

    payloads: list[dict] = []

    for subject in (*CHARACTER_BATCH_02, *ENEMY_BATCH_01, *ENEMY_BATCH_02):
        if subject.disabled_reason is not None:
            print(f"skipped runtime clips: {subject.category}:{subject.id} ({subject.disabled_reason})")
            continue
        payload = build_subject_payload(subject)
        payloads.append(payload)
        print(f"generated runtime clips: {subject.category}:{subject.id} ({len(payload['clips'])} clips)")

    merge_manifest(payloads)
    print(f"updated manifest: {MANIFEST_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

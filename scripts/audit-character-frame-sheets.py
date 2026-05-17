from __future__ import annotations

from dataclasses import dataclass
from importlib.machinery import SourceFileLoader
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "source" / "character-animation-master-sheets" / "approved"
OUTPUT_PATH = ROOT / "output" / "qa" / "character-frame-sheet-audit.json"

BASE = SourceFileLoader(
    "base_runtime_character_generator_audit",
    str(ROOT / "scripts" / "generate-runtime-character-clips.py"),
).load_module()
EXTENDED = SourceFileLoader(
    "extended_runtime_character_generator_audit",
    str(ROOT / "scripts" / "generate-runtime-extended-clips.py"),
).load_module()


@dataclass(frozen=True)
class AuditSubject:
    id: str
    sheet_name: str
    expected_row_count: int


def collect_character_subjects() -> dict[str, AuditSubject]:
    subjects: dict[str, AuditSubject] = {}

    for subject in BASE.SUBJECT_SPECS:
        subjects[subject.sheet_name] = AuditSubject(
            id=subject.id,
            sheet_name=subject.sheet_name,
            expected_row_count=len(subject.rows),
        )

    for subject in EXTENDED.CHARACTER_BATCH_02:
        subjects[subject.sheet_name] = AuditSubject(
            id=subject.id,
            sheet_name=subject.sheet_name,
            expected_row_count=len(subject.rows),
        )

    return subjects


def compute_blur_score(image: Image.Image) -> float:
    gray = np.array(image.convert("L"), dtype=np.float32)
    center = gray[1:-1, 1:-1]
    laplacian = np.abs(
        gray[:-2, 1:-1] + gray[2:, 1:-1] + gray[1:-1, :-2] + gray[1:-1, 2:] - (4 * center)
    )
    return float(laplacian.mean())


def detect_row_group_count(image: Image.Image) -> tuple[int, int]:
    boxes = BASE.detect_label_boxes(np.array(image)[:, :, :3], min_y=100, max_width=220)
    groups: list[list[tuple[int, int, int, int]]] = []

    for box in sorted(boxes, key=lambda entry: (entry[1], entry[0])):
        center_y = (box[1] + box[3]) / 2
        if groups and abs(center_y - np.mean([(item[1] + item[3]) / 2 for item in groups[-1]])) <= 24:
            groups[-1].append(box)
        else:
            groups.append([box])

    return len(groups), len(boxes)


def classify_issue(blur_score: float, row_groups: int, expected_row_count: int) -> str:
    if blur_score < 20:
        return "blocked_blur"
    if row_groups == 0:
        return "blocked_no_detectable_rows"
    if abs(row_groups - expected_row_count) >= 2:
        return "blocked_row_structure"
    if row_groups != expected_row_count:
        return "warning_row_structure"
    return "ok"


def main() -> None:
    subjects = collect_character_subjects()
    results: list[dict[str, object]] = []

    for source_path in sorted(SOURCE_DIR.glob("*.png")):
        subject = subjects.get(source_path.name)
        if subject is None:
            continue

        image = Image.open(source_path).convert("RGBA")
        blur_score = compute_blur_score(image)
        row_groups, label_box_count = detect_row_group_count(image)
        issue = classify_issue(blur_score, row_groups, subject.expected_row_count)

        results.append(
            {
                "subjectId": subject.id,
                "sheetName": source_path.name,
                "expectedRowCount": subject.expected_row_count,
                "detectedRowGroups": row_groups,
                "detectedLabelBoxes": label_box_count,
                "blurScore": round(blur_score, 2),
                "issue": issue,
            }
        )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps({"generatedAt": "2026-04-05", "results": results}, indent=2), encoding="utf-8")
    print(f"wrote audit: {OUTPUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

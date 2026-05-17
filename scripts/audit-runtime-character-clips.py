from __future__ import annotations

import argparse
import json
from collections import deque
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "public" / "assets" / "runtime" / "animation-manifest.json"
OUTPUT_DIR = ROOT / "output" / "qa"
OUTPUT_JSON = OUTPUT_DIR / "runtime-character-quality-report.json"
OUTPUT_MD = OUTPUT_DIR / "runtime-character-quality-report.md"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Audit runtime character strips for fragmentation and transparency issues.")
    parser.add_argument("--subject", dest="subject_ids", action="append", help="Only audit one or more subject ids.")
    return parser.parse_args()


def load_manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def connected_components(mask: np.ndarray) -> list[dict[str, int | bool]]:
    height, width = mask.shape
    visited = np.zeros((height, width), dtype=bool)
    components: list[dict[str, int | bool]] = []

    for start_y in range(height):
        for start_x in range(width):
            if not mask[start_y, start_x] or visited[start_y, start_x]:
                continue

            queue = deque([(start_y, start_x)])
            visited[start_y, start_x] = True
            min_x = max_x = start_x
            min_y = max_y = start_y
            area = 0
            touches_border = False

            while queue:
                y, x = queue.popleft()
                area += 1
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                if x == 0 or x == width - 1 or y == 0 or y == height - 1:
                    touches_border = True

                for next_y, next_x in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if (
                        0 <= next_y < height
                        and 0 <= next_x < width
                        and mask[next_y, next_x]
                        and not visited[next_y, next_x]
                    ):
                        visited[next_y, next_x] = True
                        queue.append((next_y, next_x))

            components.append(
                {
                    "min_x": min_x,
                    "min_y": min_y,
                    "max_x": max_x,
                    "max_y": max_y,
                    "area": area,
                    "touches_border": touches_border,
                }
            )

    return components


def measure_holes(alpha_mask: np.ndarray) -> tuple[int, int, int]:
    height, width = alpha_mask.shape
    background = ~alpha_mask
    visited = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        for y in (0, height - 1):
            if background[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))

    for y in range(height):
        for x in (0, width - 1):
            if background[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))

    while queue:
        y, x = queue.popleft()
        for next_y, next_x in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if (
                0 <= next_y < height
                and 0 <= next_x < width
                and background[next_y, next_x]
                and not visited[next_y, next_x]
            ):
                visited[next_y, next_x] = True
                queue.append((next_y, next_x))

    hole_count = 0
    hole_pixels = 0
    largest_hole_area = 0
    for start_y in range(height):
        for start_x in range(width):
            if not background[start_y, start_x] or visited[start_y, start_x]:
                continue

            hole_count += 1
            visited[start_y, start_x] = True
            queue = deque([(start_y, start_x)])
            area = 0

            while queue:
                y, x = queue.popleft()
                area += 1
                hole_pixels += 1
                for next_y, next_x in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if (
                        0 <= next_y < height
                        and 0 <= next_x < width
                        and background[next_y, next_x]
                        and not visited[next_y, next_x]
                    ):
                        visited[next_y, next_x] = True
                        queue.append((next_y, next_x))

            largest_hole_area = max(largest_hole_area, area)

    return hole_count, hole_pixels, largest_hole_area


def analyze_frame(frame_rgba: np.ndarray, frame_index: int) -> dict:
    alpha_mask = frame_rgba[:, :, 3] > 0
    alpha_pixels = int(alpha_mask.sum())
    frame_height, frame_width = alpha_mask.shape
    linear_scale = max(1.0, min(frame_width, frame_height) / 64.0)
    area_scale = linear_scale * linear_scale
    flags: list[str] = []

    if alpha_pixels == 0:
        return {
            "frameIndex": frame_index,
            "status": "fail",
            "alphaPixels": 0,
            "flags": ["empty"],
        }

    coords = np.argwhere(alpha_mask)
    min_y = int(coords[:, 0].min())
    max_y = int(coords[:, 0].max())
    min_x = int(coords[:, 1].min())
    max_x = int(coords[:, 1].max())
    bbox_width = max_x - min_x + 1
    bbox_height = max_y - min_y + 1

    components = connected_components(alpha_mask)
    largest_area = max(int(component["area"]) for component in components)
    large_components = [
        component for component in components if int(component["area"]) >= max(int(round(20 * area_scale)), int(alpha_pixels * 0.03))
    ]
    largest_ratio = largest_area / max(1, alpha_pixels)
    hole_count, hole_pixels, largest_hole_area = measure_holes(alpha_mask)

    top_scrap = any(
        int(component["min_y"]) <= max(1, int(round(linear_scale)))
        and int(component["max_y"]) - int(component["min_y"]) + 1 <= max(8, int(round(8 * linear_scale)))
        and int(component["max_x"]) - int(component["min_x"]) + 1 >= max(10, int(round(10 * linear_scale)))
        and int(component["area"]) <= max(int(round(96 * area_scale)), int(alpha_pixels * 0.12))
        for component in components
    )

    if alpha_pixels < int(round(160 * area_scale)):
        flags.append("sparse_alpha")

    if len(large_components) >= 3 or (len(large_components) >= 2 and largest_ratio < 0.72):
        flags.append("fragmented")
    elif len(large_components) == 2 and largest_ratio < 0.86:
        flags.append("multi_part")

    if largest_hole_area >= int(round(28 * area_scale)) and hole_pixels >= int(round(80 * area_scale)):
        flags.append("internal_holes")
    elif largest_hole_area >= int(round(14 * area_scale)) and hole_pixels >= int(round(36 * area_scale)):
        flags.append("minor_holes")

    if top_scrap:
        flags.append("top_scrap")

    edge_margin = max(1, int(round(linear_scale)))
    if (min_x <= edge_margin or max_x >= frame_width - 1 - edge_margin) and len(large_components) >= 2:
        flags.append("edge_bleed")

    if bbox_height < int(round(28 * linear_scale)) or bbox_width < int(round(18 * linear_scale)):
        flags.append("undersized")

    if "empty" in flags or "fragmented" in flags or "internal_holes" in flags:
        status = "fail"
    elif flags:
        status = "caution"
    else:
        status = "pass"

    return {
        "frameIndex": frame_index,
        "status": status,
        "alphaPixels": alpha_pixels,
        "bbox": {
            "minX": min_x,
            "minY": min_y,
            "maxX": max_x,
            "maxY": max_y,
            "width": bbox_width,
            "height": bbox_height,
        },
        "componentCount": len(components),
        "largeComponentCount": len(large_components),
        "largestComponentRatio": round(largest_ratio, 4),
        "holeCount": hole_count,
        "holePixels": hole_pixels,
        "largestHoleArea": largest_hole_area,
        "flags": flags,
    }


def analyze_clip(subject_id: str, clip: dict) -> dict:
    strip_path = ROOT / "public" / clip["path"]
    if not strip_path.exists():
        return {
            "clipId": clip["id"],
            "status": "fail",
            "flags": ["missing_strip"],
            "path": clip["path"],
        }

    image = Image.open(strip_path).convert("RGBA")
    frame_width = int(clip["frameWidth"])
    frame_height = int(clip["frameHeight"])
    expected_frame_count = int(clip["frameCount"])
    actual_frame_count = image.size[0] // frame_width if frame_width > 0 else 0
    frames_to_check = min(expected_frame_count, actual_frame_count)
    frame_results: list[dict] = []

    for frame_index in range(frames_to_check):
        left = frame_index * frame_width
        cell = np.array(image.crop((left, 0, left + frame_width, frame_height)).convert("RGBA"))
        frame_results.append(analyze_frame(cell, frame_index))

    flags: list[str] = []
    if actual_frame_count != expected_frame_count:
        flags.append("frame_count_mismatch")

    pass_count = sum(1 for frame in frame_results if frame["status"] == "pass")
    caution_count = sum(1 for frame in frame_results if frame["status"] == "caution")
    fail_count = sum(1 for frame in frame_results if frame["status"] == "fail")

    populated = [frame for frame in frame_results if frame.get("alphaPixels", 0) > 0 and "bbox" in frame]
    if populated:
        bottom_positions = [frame["bbox"]["maxY"] for frame in populated]
        widths = [frame["bbox"]["width"] for frame in populated]
        heights = [frame["bbox"]["height"] for frame in populated]
        centers = [
            (frame["bbox"]["minX"] + frame["bbox"]["maxX"]) / 2
            for frame in populated
        ]
        bottom_jitter = max(bottom_positions) - min(bottom_positions)
        width_jitter = max(widths) - min(widths)
        height_jitter = max(heights) - min(heights)
        center_jitter = round(max(centers) - min(centers), 2)
    else:
        bottom_jitter = 0
        width_jitter = 0
        height_jitter = 0
        center_jitter = 0.0

    linear_scale = max(1.0, min(frame_width, frame_height) / 64.0)
    if bottom_jitter >= int(round(10 * linear_scale)):
        flags.append("anchor_jitter")
    if width_jitter >= int(round(18 * linear_scale)) or height_jitter >= int(round(18 * linear_scale)):
        flags.append("scale_jitter")
    if center_jitter >= int(round(14 * linear_scale)):
        flags.append("center_jitter")

    if fail_count > 0 or "frame_count_mismatch" in flags:
        status = "fail"
    elif caution_count > 0 or flags:
        status = "caution"
    else:
        status = "pass"

    score = 100
    score -= fail_count * 15
    score -= caution_count * 4
    score -= len(flags) * 5
    score = max(0, score)

    return {
        "subjectId": subject_id,
        "clipId": clip["id"],
        "path": clip["path"],
        "status": status,
        "score": score,
        "frameWidth": frame_width,
        "frameHeight": frame_height,
        "expectedFrameCount": expected_frame_count,
        "actualFrameCount": actual_frame_count,
        "passFrameCount": pass_count,
        "cautionFrameCount": caution_count,
        "failFrameCount": fail_count,
        "clipFlags": flags,
        "stability": {
            "bottomJitter": bottom_jitter,
            "widthJitter": width_jitter,
            "heightJitter": height_jitter,
            "centerJitter": center_jitter,
        },
        "frames": frame_results,
    }


def analyze_subject(subject: dict) -> dict:
    clip_results = [analyze_clip(subject["id"], clip) for clip in subject["clips"]]
    pass_count = sum(1 for clip in clip_results if clip["status"] == "pass")
    caution_count = sum(1 for clip in clip_results if clip["status"] == "caution")
    fail_count = sum(1 for clip in clip_results if clip["status"] == "fail")
    completion = round((pass_count / max(1, len(clip_results))) * 100, 1)

    if fail_count:
        status = "fail"
    elif caution_count:
        status = "caution"
    else:
        status = "pass"

    return {
        "subjectId": subject["id"],
        "name": subject["name"],
        "status": status,
        "completionPercent": completion,
        "clipCount": len(clip_results),
        "passClipCount": pass_count,
        "cautionClipCount": caution_count,
        "failClipCount": fail_count,
        "clips": clip_results,
    }


def write_markdown(report: dict) -> None:
    lines = [
        "# Runtime Character Quality Report",
        "",
        f"- generated_at: {report['generatedAt']}",
        f"- subject_count: {report['subjectCount']}",
        f"- pass_subject_count: {report['passSubjectCount']}",
        f"- caution_subject_count: {report['cautionSubjectCount']}",
        f"- fail_subject_count: {report['failSubjectCount']}",
        "",
    ]

    for subject in report["subjects"]:
        lines.append(f"## {subject['name']} ({subject['subjectId']})")
        lines.append("")
        lines.append(
            f"- status: {subject['status']} | completion: {subject['completionPercent']}% | clips: {subject['passClipCount']} pass / {subject['cautionClipCount']} caution / {subject['failClipCount']} fail"
        )
        failing_clips = [clip for clip in subject["clips"] if clip["status"] != "pass"]
        if not failing_clips:
            lines.append("- issues: none")
            lines.append("")
            continue

        lines.append("- issues:")
        for clip in failing_clips:
            clip_flags = ", ".join(clip["clipFlags"]) if clip["clipFlags"] else "frame-level issues only"
            lines.append(
                f"  - {clip['clipId']}: {clip['status']} | score {clip['score']} | clip_flags={clip_flags}"
            )
            frame_issues = [frame for frame in clip["frames"] if frame["status"] != "pass"]
            for frame in frame_issues[:4]:
                lines.append(
                    f"    - frame {frame['frameIndex']}: {frame['status']} | flags={', '.join(frame['flags'])}"
                )
        lines.append("")

    OUTPUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    manifest = load_manifest()
    all_subjects = [subject for subject in manifest["subjects"] if subject["category"] == "character"]

    if args.subject_ids:
        selected = set(args.subject_ids)
        subjects = [subject for subject in all_subjects if subject["id"] in selected]
    else:
        subjects = all_subjects

    subject_results = [analyze_subject(subject) for subject in subjects]
    pass_subject_count = sum(1 for subject in subject_results if subject["status"] == "pass")
    caution_subject_count = sum(1 for subject in subject_results if subject["status"] == "caution")
    fail_subject_count = sum(1 for subject in subject_results if subject["status"] == "fail")

    report = {
        "generatedAt": datetime.now().astimezone().isoformat(),
        "subjectCount": len(subject_results),
        "passSubjectCount": pass_subject_count,
        "cautionSubjectCount": caution_subject_count,
        "failSubjectCount": fail_subject_count,
        "subjects": subject_results,
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(report)
    print(f"Wrote runtime character quality report to {OUTPUT_JSON}")


if __name__ == "__main__":
    main()

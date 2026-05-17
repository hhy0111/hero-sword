from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "public" / "assets" / "runtime" / "animation-manifest.json"
OUTPUT_ROOT = ROOT / "output" / "qa" / "character-frame-review"
SCALE = 6


def make_checker_frame(frame: Image.Image, frame_width: int, frame_height: int) -> Image.Image:
    bg = Image.new("RGBA", (frame_width, frame_height), (0, 0, 0, 0))
    pixels = bg.load()
    for y in range(frame_height):
        for x in range(frame_width):
            color = 235 if ((x // 4) + (y // 4)) % 2 == 0 else 195
            pixels[x, y] = (color, color, color, 255)
    bg.alpha_composite(frame)
    return bg


def export_subject(subject: dict) -> None:
    subject_dir = OUTPUT_ROOT / subject["id"]
    subject_dir.mkdir(parents=True, exist_ok=True)

    for clip in subject["clips"]:
        strip_path = ROOT / "public" / clip["path"]
        if not strip_path.exists():
            continue

        frame_width = int(clip.get("frameWidth", 64))
        frame_height = int(clip.get("frameHeight", 64))
        if frame_width <= 0 or frame_height <= 0:
            continue

        strip = Image.open(strip_path).convert("RGBA")
        frame_count = int(clip.get("frameCount", strip.width // frame_width))
        clip_dir = subject_dir / clip["id"]
        clip_dir.mkdir(parents=True, exist_ok=True)
        contact_sheet = Image.new(
            "RGBA",
            (frame_count * frame_width * SCALE, frame_height * SCALE),
            (0, 0, 0, 0),
        )

        for index in range(frame_count):
            frame = strip.crop((index * frame_width, 0, (index + 1) * frame_width, frame_height))
            checker = make_checker_frame(frame, frame_width, frame_height)
            checker.save(clip_dir / f"{index + 1:02d}.png")

            zoomed = checker.resize((frame_width * SCALE, frame_height * SCALE), Image.NEAREST)
            ImageDraw.Draw(zoomed).text((4, 4), f"{clip['id']} {index + 1}", fill=(255, 0, 0, 255))
            contact_sheet.alpha_composite(zoomed, (index * frame_width * SCALE, 0))

        contact_sheet.save(subject_dir / f"{clip['id']}-all-frames.png")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--subject", action="append", dest="subjects", default=[])
    args = parser.parse_args()

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    subjects = [subject for subject in manifest.get("subjects", []) if subject.get("category") == "character"]

    if args.subjects:
        target_ids = set(args.subjects)
        subjects = [subject for subject in subjects if subject["id"] in target_ids]

    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    for subject in subjects:
        export_subject(subject)

    exported = ", ".join(subject["id"] for subject in subjects) if subjects else "(none)"
    print(f"Exported frame review sheets to {OUTPUT_ROOT} for: {exported}")


if __name__ == "__main__":
    main()

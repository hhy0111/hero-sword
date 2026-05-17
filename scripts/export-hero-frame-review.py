from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
HERO_DIR = ROOT / "public" / "assets" / "runtime" / "characters" / "hero"
OUTPUT_DIR = ROOT / "output" / "qa" / "hero-frame-review"
FRAME_SIZE = 64
SCALE = 6

HERO_ACTIONS = (
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
)


def make_checker_frame(frame: Image.Image) -> Image.Image:
    bg = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    pixels = bg.load()
    for y in range(FRAME_SIZE):
        for x in range(FRAME_SIZE):
            color = 235 if ((x // 4) + (y // 4)) % 2 == 0 else 195
            pixels[x, y] = (color, color, color, 255)
    bg.alpha_composite(frame)
    return bg


def export_action(action: str) -> None:
    strip_path = HERO_DIR / f"{action}.png"
    if not strip_path.exists():
        return

    strip = Image.open(strip_path).convert("RGBA")
    frame_count = strip.width // FRAME_SIZE
    action_dir = OUTPUT_DIR / action
    action_dir.mkdir(parents=True, exist_ok=True)

    contact_sheet = Image.new("RGBA", (frame_count * FRAME_SIZE * SCALE, FRAME_SIZE * SCALE), (0, 0, 0, 0))

    for index in range(frame_count):
        frame = strip.crop((index * FRAME_SIZE, 0, (index + 1) * FRAME_SIZE, FRAME_SIZE))
        checker = make_checker_frame(frame)
        checker.save(action_dir / f"{index + 1:02d}.png")

        zoomed = checker.resize((FRAME_SIZE * SCALE, FRAME_SIZE * SCALE), Image.NEAREST)
        ImageDraw.Draw(zoomed).text((4, 4), f"{action} {index + 1}", fill=(255, 0, 0, 255))
        contact_sheet.alpha_composite(zoomed, (index * FRAME_SIZE * SCALE, 0))

    contact_sheet.save(OUTPUT_DIR / f"{action}-all-frames.png")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for action in HERO_ACTIONS:
        export_action(action)
    print(f"Exported hero frame review sheets to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

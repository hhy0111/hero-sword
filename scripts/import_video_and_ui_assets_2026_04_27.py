from __future__ import annotations

from collections import deque
from pathlib import Path
import shutil

from PIL import Image, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "image"
VIDEO_DIR = ROOT / "video"
SCREEN_DIR = ROOT / "public" / "assets" / "ui" / "screens"
HOUSING_DIR = ROOT / "public" / "assets" / "ui" / "housing"
PALACE_NPC_DIR = ROOT / "public" / "assets" / "world" / "palace" / "npcs"
CUTSCENE_DIR = ROOT / "public" / "assets" / "cutscenes"


def ensure_dirs() -> None:
    SCREEN_DIR.mkdir(parents=True, exist_ok=True)
    HOUSING_DIR.mkdir(parents=True, exist_ok=True)
    PALACE_NPC_DIR.mkdir(parents=True, exist_ok=True)
    CUTSCENE_DIR.mkdir(parents=True, exist_ok=True)


def is_near_white(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    if a < 10:
        return True
    return r > 238 and g > 235 and b > 230


def remove_white_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
      queue.append((x, 0))
      queue.append((x, height - 1))
    for y in range(height):
      queue.append((0, y))
      queue.append((width - 1, y))

    while queue:
      x, y = queue.popleft()
      if not (0 <= x < width and 0 <= y < height) or visited[y][x]:
        continue
      visited[y][x] = True
      if not is_near_white(pixels[x, y]):
        continue

      pixels[x, y] = (pixels[x, y][0], pixels[x, y][1], pixels[x, y][2], 0)
      queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return rgba


def trim_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    bbox = rgba.getchannel("A").getbbox()
    if not bbox:
        return rgba
    return rgba.crop(bbox)


def save(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path)


def export_screen_assets() -> None:
    ui = remove_white_background(Image.open(IMAGE_DIR / "01-ui.png"))
    item_02 = Image.open(IMAGE_DIR / "02-item-02.png").convert("RGBA")
    item_03 = Image.open(IMAGE_DIR / "03-item-03.png").convert("RGBA")
    item_04 = remove_white_background(Image.open(IMAGE_DIR / "04-item-04.png"))
    item_05 = remove_white_background(Image.open(IMAGE_DIR / "05-item-05.png"))

    save(trim_alpha(ui.crop((2, 10, 525, 1464))), SCREEN_DIR / "equipment_frame.png")
    save(trim_alpha(item_02.crop((4, 248, 379, 748))), SCREEN_DIR / "equipment_portrait_panel.png")
    save(trim_alpha(item_04.crop((26, 351, 334, 1147))), SCREEN_DIR / "equipment_weapon_panel.png")
    save(trim_alpha(item_04.crop((353, 353, 673, 1147))), SCREEN_DIR / "equipment_armor_panel.png")
    save(trim_alpha(item_05.crop((90, 30, 929, 1025))), SCREEN_DIR / "equipment_detail_panel.png")
    save(item_03, SCREEN_DIR / "gacha_backdrop.png")
    save(trim_alpha(item_02.crop((660, 388, 1023, 734))), SCREEN_DIR / "gacha_feature_panel.png")
    save(trim_alpha(item_02.crop((383, 353, 645, 739))), SCREEN_DIR / "gacha_confirm_panel.png")
    save(trim_alpha(item_04.crop((680, 323, 1005, 1165))), SCREEN_DIR / "gacha_banner_panel.png")


def make_room_stage_from_backdrop(image: Image.Image) -> Image.Image:
    crop = image.crop((180, 860, 760, 1185)).convert("RGBA").resize((240, 128), Image.Resampling.LANCZOS)
    crop = ImageEnhance.Brightness(crop).enhance(0.82)
    overlay = Image.new("RGBA", crop.size, (16, 20, 14, 40))
    crop.alpha_composite(overlay)
    return crop


def export_housing_assets() -> None:
    backdrop = Image.open(IMAGE_DIR / "07-item-07.png").convert("RGBA")
    save(backdrop, HOUSING_DIR / "backdrop.png")
    save(make_room_stage_from_backdrop(backdrop), HOUSING_DIR / "room_stage.png")

    prepared = remove_white_background(Image.open(IMAGE_DIR / "06-item-06.png"))
    furniture_boxes = {
      "knight_banner": (81, 136, 360, 670),
      "hero_sword_rack": (450, 159, 817, 664),
      "training_dummy": (881, 185, 1170, 664),
      "wood_crate": (58, 747, 391, 1118),
      "small_plant": (470, 740, 785, 1106),
      "lumen_lamp": (913, 734, 1151, 1117),
    }
    for name, box in furniture_boxes.items():
      save(trim_alpha(prepared.crop(box)), HOUSING_DIR / f"{name}.png")


def export_palace_king() -> None:
    save(trim_alpha(Image.open(IMAGE_DIR / "08-item-08.png").convert("RGBA")), PALACE_NPC_DIR / "king.png")


def export_cutscene_videos() -> None:
    for name in [
      "video_01_opening_lumen_fall.mp4",
      "after_stage_01_10.mp4",
      "after_stage_02_10.mp4",
      "after_stage_03_10.mp4",
      "after_stage_04_09_or_04_10.mp4",
      "after_stage_05_10.mp4",
      "after_stage_06_09.mp4",
      "after_stage_06_10.mp4",
    ]:
      shutil.copy2(VIDEO_DIR / name, CUTSCENE_DIR / name)


def main() -> None:
    ensure_dirs()
    export_screen_assets()
    export_housing_assets()
    export_palace_king()
    export_cutscene_videos()


if __name__ == "__main__":
    main()

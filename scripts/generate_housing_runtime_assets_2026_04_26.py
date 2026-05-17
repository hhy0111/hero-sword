from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "assets" / "ui" / "housing"


def rgba(hex_color: str, alpha: int = 255) -> tuple[int, int, int, int]:
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16),
        int(hex_color[2:4], 16),
        int(hex_color[4:6], 16),
        alpha,
    )


def ensure_dir() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)


def save(image: Image.Image, name: str) -> None:
    image.save(OUT_DIR / name)


def draw_frame(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], outer: str, inner: str) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(box, radius=14, fill=rgba(inner), outline=rgba(outer), width=3)
    draw.rounded_rectangle((x0 + 6, y0 + 6, x1 - 6, y1 - 6), radius=10, outline=rgba("#e5cd8b", 140), width=2)


def create_backdrop() -> None:
    image = Image.new("RGBA", (360, 640), rgba("#162418"))
    draw = ImageDraw.Draw(image)

    for y in range(640):
        blend = y / 639
        color = (
            int(22 + 20 * blend),
            int(36 + 18 * blend),
            int(24 + 8 * blend),
            255,
        )
        draw.line((0, y, 360, y), fill=color)

    for y in range(0, 640, 32):
        draw.rectangle((0, y, 360, y + 15), fill=rgba("#204228", 70))

    for x in range(12, 360, 28):
        draw.rectangle((x, 0, x + 6, 640), fill=rgba("#a78558", 120))
        draw.rectangle((x + 2, 0, x + 4, 640), fill=rgba("#ddb878", 80))

    draw.rounded_rectangle((28, 92, 332, 564), radius=24, fill=rgba("#0e1710", 120), outline=rgba("#e5cd8b", 60), width=2)
    draw.rounded_rectangle((44, 142, 316, 300), radius=18, fill=rgba("#1f2f20", 120), outline=rgba("#7c6a4d", 60), width=2)

    rug = Image.new("RGBA", (360, 640), (0, 0, 0, 0))
    rug_draw = ImageDraw.Draw(rug)
    rug_draw.rounded_rectangle((92, 330, 268, 566), radius=24, fill=rgba("#264534", 180), outline=rgba("#e8d19a", 120), width=3)
    rug_draw.rounded_rectangle((108, 346, 252, 550), radius=18, outline=rgba("#d6bf84", 90), width=2)
    rug = rug.filter(ImageFilter.GaussianBlur(0.4))
    image.alpha_composite(rug)

    vignette = Image.new("RGBA", (360, 640), (0, 0, 0, 0))
    vignette_draw = ImageDraw.Draw(vignette)
    vignette_draw.ellipse((-80, -40, 440, 700), fill=rgba("#000000", 0))
    vignette_draw.rectangle((0, 0, 360, 640), fill=rgba("#000000", 60))
    vignette = vignette.filter(ImageFilter.GaussianBlur(32))
    image.alpha_composite(vignette)

    save(image, "backdrop.png")


def create_room_stage() -> None:
    image = Image.new("RGBA", (240, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw_frame(draw, (4, 4, 236, 124), "#c9ad74", "#222721")
    draw.rectangle((14, 16, 226, 72), fill=rgba("#3b2e20"))
    draw.rectangle((14, 72, 226, 116), fill=rgba("#5d4630"))
    draw.rectangle((14, 48, 226, 52), fill=rgba("#8d6c43", 180))
    draw.rectangle((40, 86, 200, 110), fill=rgba("#2a4a38"))
    draw.rectangle((54, 92, 186, 104), outline=rgba("#e4cb8c", 120), width=2)
    for x in range(34, 226, 28):
        draw.line((x, 16, x, 72), fill=rgba("#6f573a", 120), width=2)
    for x in (44, 196):
        draw.rectangle((x, 20, x + 12, 62), fill=rgba("#20301f"))
        draw.ellipse((x - 3, 16, x + 15, 34), fill=rgba("#d3c17b", 110))
    save(image, "room_stage.png")


def create_shadow(image: Image.Image, box: tuple[int, int, int, int], blur: float = 4) -> None:
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse(box, fill=rgba("#000000", 90))
    image.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(blur)))


def create_wood_crate() -> None:
    image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    create_shadow(image, (18, 66, 78, 84))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((22, 34, 74, 72), radius=8, fill=rgba("#9a6e3f"), outline=rgba("#f0d79b", 150), width=2)
    draw.rounded_rectangle((28, 24, 64, 44), radius=7, fill=rgba("#b3834e"), outline=rgba("#f1deab", 120), width=2)
    for x0, y0, x1, y1 in ((28, 42, 68, 48), (28, 56, 68, 62), (34, 28, 58, 34)):
        draw.rounded_rectangle((x0, y0, x1, y1), radius=3, fill=rgba("#6d4928"))
    save(image, "wood_crate.png")


def create_training_dummy() -> None:
    image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    create_shadow(image, (22, 70, 74, 84))
    draw = ImageDraw.Draw(image)
    draw.rectangle((46, 30, 50, 74), fill=rgba("#744a2a"))
    draw.rectangle((36, 72, 60, 76), fill=rgba("#744a2a"))
    draw.line((46, 58, 26, 44), fill=rgba("#744a2a"), width=4)
    draw.line((50, 58, 70, 44), fill=rgba("#744a2a"), width=4)
    draw.ellipse((31, 18, 65, 52), fill=rgba("#d7bd78"), outline=rgba("#f3e1ad", 140), width=2)
    draw.line((38, 24, 58, 46), fill=rgba("#a77b45"), width=3)
    draw.line((58, 24, 38, 46), fill=rgba("#a77b45"), width=3)
    save(image, "training_dummy.png")


def create_small_plant() -> None:
    image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    create_shadow(image, (26, 70, 70, 84))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((36, 56, 60, 74), radius=6, fill=rgba("#9b6a45"), outline=rgba("#efcf93", 120), width=2)
    for points, color in [
        ([(48, 18), (34, 46), (48, 42), (62, 46)], "#87c36d"),
        ([(36, 28), (24, 54), (42, 48), (54, 58)], "#5ea35a"),
        ([(60, 28), (42, 56), (60, 50), (72, 58)], "#6eb868"),
    ]:
        draw.polygon(points, fill=rgba(color), outline=rgba("#d7f0c6", 90))
    draw.line((48, 56, 48, 32), fill=rgba("#4a7b3c"), width=3)
    save(image, "small_plant.png")


def create_knight_banner() -> None:
    image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    create_shadow(image, (24, 66, 72, 82))
    draw = ImageDraw.Draw(image)
    draw.rectangle((22, 18, 26, 74), fill=rgba("#6c5032"))
    draw.rectangle((22, 18, 66, 24), fill=rgba("#d6bf84"))
    draw.polygon([(28, 24), (64, 24), (64, 58), (46, 74), (28, 58)], fill=rgba("#274b6f"), outline=rgba("#f0d7a2", 140))
    draw.polygon([(46, 34), (52, 46), (66, 48), (54, 54), (58, 68), (46, 60), (34, 68), (38, 54), (26, 48), (40, 46)], fill=rgba("#f0d784"))
    save(image, "knight_banner.png")


def create_sword_rack() -> None:
    image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    create_shadow(image, (18, 68, 78, 84))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((18, 44, 78, 72), radius=8, fill=rgba("#4b3527"), outline=rgba("#c7aa71", 140), width=2)
    for x in (32, 48, 64):
        draw.rectangle((x - 2, 20, x + 2, 56), fill=rgba("#cfd7e4"))
        draw.polygon([(x - 5, 23), (x, 14), (x + 5, 23)], fill=rgba("#edf3fb"))
        draw.rectangle((x - 7, 54, x + 7, 58), fill=rgba("#b28852"))
        draw.rectangle((x - 2, 58, x + 2, 66), fill=rgba("#704726"))
    save(image, "hero_sword_rack.png")


def create_lumen_lamp() -> None:
    image = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    glow = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((28, 12, 68, 54), fill=rgba("#f5d76b", 130))
    glow = glow.filter(ImageFilter.GaussianBlur(8))
    image.alpha_composite(glow)
    create_shadow(image, (24, 70, 72, 84))
    draw = ImageDraw.Draw(image)
    draw.rectangle((44, 26, 52, 74), fill=rgba("#7a5a38"))
    draw.rounded_rectangle((36, 24, 60, 42), radius=7, fill=rgba("#3a342f"), outline=rgba("#f2da96", 140), width=2)
    draw.ellipse((40, 28, 56, 40), fill=rgba("#ffefb8"))
    draw.rectangle((38, 74, 58, 78), fill=rgba("#7a5a38"))
    save(image, "lumen_lamp.png")


def main() -> None:
    ensure_dir()
    create_backdrop()
    create_room_stage()
    create_wood_crate()
    create_training_dummy()
    create_small_plant()
    create_knight_banner()
    create_sword_rack()
    create_lumen_lamp()


if __name__ == "__main__":
    main()

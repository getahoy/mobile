import math
import urllib.request
from io import BytesIO
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont

SOURCE_URL = "https://github.com/google/fonts/raw/main/ofl/"
FONTS_DIR = Path("assets/fonts")
LICENCES_DIR = FONTS_DIR / "ofl"
IMAGES_DIR = Path("assets/images")

FRAUNCES = "fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf"
FRAUNCES_ITALIC = "fraunces/Fraunces-Italic%5BSOFT,WONK,opsz,wght%5D.ttf"
INTER = "inter/Inter%5Bopsz,wght%5D.ttf"
GEIST_MONO = "geistmono/GeistMono%5Bwght%5D.ttf"

FRAUNCES_AXES = {"opsz": 72, "SOFT": 100, "WONK": 1}
INTER_TEXT_OPTICAL_SIZE = 14

INSTANCES = [
    ("FrauncesAhoy-Light", FRAUNCES, {**FRAUNCES_AXES, "wght": 300}, "Regular"),
    ("FrauncesAhoy-LightItalic", FRAUNCES_ITALIC, {**FRAUNCES_AXES, "wght": 300}, "Italic"),
    ("FrauncesAhoy-Regular", FRAUNCES, {**FRAUNCES_AXES, "wght": 400}, "Regular"),
    ("FrauncesAhoy-Italic", FRAUNCES_ITALIC, {**FRAUNCES_AXES, "wght": 400}, "Italic"),
    ("Inter-Regular", INTER, {"opsz": INTER_TEXT_OPTICAL_SIZE, "wght": 400}, "Regular"),
    ("Inter-Medium", INTER, {"opsz": INTER_TEXT_OPTICAL_SIZE, "wght": 500}, "Regular"),
    ("GeistMono-Medium", GEIST_MONO, {"wght": 500}, "Regular"),
]

LICENCES = {
    "fraunces": "fraunces/OFL.txt",
    "inter": "inter/OFL.txt",
    "geistMono": "geistmono/OFL.txt",
}

WORDMARK = "ahoy"
WORDMARK_FONT = "FrauncesAhoy-Regular"
WORDMARK_SIZE = 52
WORDMARK_LINE_HEIGHT = 64
WORDMARK_TRACKING_EM = -0.02
WORDMARK_PADDING_EM = 0.1
WORDMARK_INKS = {"": (0x17, 0x16, 0x14, 0xFF), "Dark": (0xF2, 0xEF, 0xE8, 0xFF)}
SCALES = {"": 1, "@2x": 2, "@3x": 3}

PENNANT_POINTS = [(2, 1.5), (24, 1.5), (16.5, 10), (24, 18.5), (2, 18.5)]
PENNANT_VIEWBOX = (26, 20)
PENNANT_SIZE = (30, 22)
PENNANT_STROKE = 2
PENNANT_INK = (0, 0, 0, 0xFF)

downloads: dict[str, bytes] = {}


def download(path: str) -> bytes:
    if path not in downloads:
        with urllib.request.urlopen(SOURCE_URL + path) as response:
            downloads[path] = response.read()
    return downloads[path]


# iOS finds a bundled font by PostScript name and Android by file name, so both
# are set to the same string and every file is its own family.
def rename(font: TTFont, postscript_name: str, style: str) -> None:
    names = font["name"]
    for name_id in (1, 2, 3, 4, 6, 16, 17, 21, 22, 25):
        names.removeNames(nameID=name_id)
    full_name = f"{postscript_name} {style}"
    for name_id, text in ((1, postscript_name), (2, style), (3, postscript_name),
                          (4, full_name), (6, postscript_name)):
        names.setName(text, name_id, 3, 1, 0x409)
        names.setName(text, name_id, 1, 0, 0)


def build_instance(postscript_name: str, source: str, axes: dict, style: str) -> None:
    variable = TTFont(BytesIO(download(source)))
    static = instantiateVariableFont(variable, axes)
    rename(static, postscript_name, style)
    static.save(FONTS_DIR / f"{postscript_name}.ttf")


def render_wordmark(ink: tuple, scale: int) -> Image.Image:
    size = WORDMARK_SIZE * scale
    font = ImageFont.truetype(str(FONTS_DIR / f"{WORDMARK_FONT}.ttf"), size)
    tracking = WORDMARK_TRACKING_EM * size
    padding = WORDMARK_PADDING_EM * size
    starts = [padding + font.getlength(WORDMARK[:index]) + index * tracking
              for index in range(len(WORDMARK))]
    width = math.ceil(starts[-1] + font.getlength(WORDMARK[-1]) + padding)
    height = WORDMARK_LINE_HEIGHT * scale
    ascent, descent = font.getmetrics()
    top = (height - ascent - descent) / 2
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    for start, letter in zip(starts, WORDMARK):
        draw.text((start, top), letter, font=font, fill=ink)
    return image


def render_pennant(scale: int) -> Image.Image:
    width, height = (side * scale for side in PENNANT_SIZE)
    zoom = min(width / PENNANT_VIEWBOX[0], height / PENNANT_VIEWBOX[1])
    offset_x = (width - PENNANT_VIEWBOX[0] * zoom) / 2
    offset_y = (height - PENNANT_VIEWBOX[1] * zoom) / 2
    points = [(offset_x + x * zoom, offset_y + y * zoom) for x, y in PENNANT_POINTS]
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.polygon(points, fill=PENNANT_INK)
    stroke = round(PENNANT_STROKE * zoom)
    draw.line([*points, points[0]], fill=PENNANT_INK, width=stroke, joint="curve")
    for x, y in points:
        radius = stroke / 2
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=PENNANT_INK)
    return image


def main() -> None:
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    LICENCES_DIR.mkdir(parents=True, exist_ok=True)
    for instance in INSTANCES:
        build_instance(*instance)
    for name, source in LICENCES.items():
        (LICENCES_DIR / f"{name}.txt").write_bytes(download(source))
    for theme, ink in WORDMARK_INKS.items():
        for suffix, scale in SCALES.items():
            image = render_wordmark(ink, scale)
            image.save(IMAGES_DIR / f"splashWordmark{theme}{suffix}.png")
            print(f"splashWordmark{theme}{suffix}.png {image.width}x{image.height}")
    for suffix, scale in SCALES.items():
        render_pennant(scale).save(IMAGES_DIR / f"pennant{suffix}.png")


if __name__ == "__main__":
    main()

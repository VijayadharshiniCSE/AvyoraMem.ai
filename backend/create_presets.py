from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path

presets_dir = Path("static/presets")
presets_dir.mkdir(parents=True, exist_ok=True)

configs = [
    ("julian_cyber.jpg", (190, 148, 121), (30, 32, 45)),
    ("elena_gala.jpg", (244, 216, 205), (44, 26, 29)),
    ("kenzo_minimalist.jpg", (201, 167, 136), (28, 31, 38)),
    ("maya_resort.jpg", (140, 88, 62), (46, 36, 31))
]

for filename, skin_rgb, bg_rgb in configs:
    img = Image.new("RGB", (600, 800), color=bg_rgb)
    draw = ImageDraw.Draw(img)
    # Studio glow
    glow_color = (min(255, int(bg_rgb[0] * 1.5)), min(255, int(bg_rgb[1] * 1.5)), min(255, int(bg_rgb[2] * 1.5)))
    draw.ellipse([100, 80, 500, 650], fill=glow_color)
    # Shoulders
    shoulder_color = (int(skin_rgb[0] * 0.85), int(skin_rgb[1] * 0.85), int(skin_rgb[2] * 0.85))
    draw.polygon([(180, 700), (300, 510), (420, 700), (520, 800), (80, 800)], fill=shoulder_color)
    # Neck
    draw.rectangle([260, 480, 340, 560], fill=shoulder_color)
    # Face morphology
    draw.ellipse([190, 200, 410, 510], fill=skin_rgb)
    # Cheek and forehead highlights
    highlight = (min(255, int(skin_rgb[0] * 1.12)), min(255, int(skin_rgb[1] * 1.12)), min(255, int(skin_rgb[2] * 1.12)))
    draw.ellipse([260, 220, 340, 300], fill=highlight)
    draw.ellipse([220, 340, 270, 390], fill=highlight)
    draw.ellipse([330, 340, 380, 390], fill=highlight)
    
    # Gaussian blur for soft organic lighting
    img = img.filter(ImageFilter.GaussianBlur(radius=6))
    img.save(presets_dir / filename, quality=95)

print("Presets successfully generated!")

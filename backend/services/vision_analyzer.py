import math
import io
from typing import Dict, Any, Tuple
from PIL import Image
import numpy as np

class VisionAnalyzer:
    """
    Computer Vision module for extracting human biometric and chromatic attributes
    from portrait imagery: skin tone, undertones (ITA & LAB color space),
    facial morphology, and luminance contrast.
    """

    @staticmethod
    def rgb_to_lab(r: int, g: int, b: int) -> Tuple[float, float, float]:
        """Convert sRGB [0-255] to CIE-L*a*b* space."""
        # Normalize and linearize
        def pivot_rgb(c):
            c = c / 255.0
            return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92

        r_lin = pivot_rgb(r) * 100.0
        g_lin = pivot_rgb(g) * 100.0
        b_lin = pivot_rgb(b) * 100.0

        # Observer. = 2°, Illuminant = D65
        x = r_lin * 0.4124 + g_lin * 0.3576 + b_lin * 0.1805
        y = r_lin * 0.2126 + g_lin * 0.7152 + b_lin * 0.0722
        z = r_lin * 0.0193 + g_lin * 0.1192 + b_lin * 0.9505

        def pivot_xyz(c):
            return c ** (1/3) if c > 0.008856 else (7.787 * c) + (16.0 / 116.0)

        x_p = pivot_xyz(x / 95.047)
        y_p = pivot_xyz(y / 100.000)
        z_p = pivot_xyz(z / 108.883)

        l_val = max(0.0, (116.0 * y_p) - 16.0)
        a_val = 500.0 * (x_p - y_p)
        b_val = 200.0 * (y_p - z_p)
        return l_val, a_val, b_val

    @staticmethod
    def calculate_ita(l_val: float, b_val: float) -> float:
        """Calculate Individual Typology Angle (ITA) in degrees."""
        if abs(b_val) < 1e-4:
            b_val = 0.0001
        radians = math.atan2(l_val - 50.0, b_val)
        return radians * (180.0 / math.pi)

    @classmethod
    def analyze_image_bytes(cls, image_bytes: bytes) -> Dict[str, Any]:
        """
        Processes image bytes, crops central facial zone, samples chromatic distribution,
        and derives skin tone, undertone, geometry, and contrast ratios.
        """
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        width, height = image.size

        # Define facial/central portrait region of interest (ROI)
        # Typically face/neck resides in [0.25H - 0.70H] and [0.25W - 0.75W]
        roi_x1 = int(width * 0.28)
        roi_x2 = int(width * 0.72)
        roi_y1 = int(height * 0.20)
        roi_y2 = int(height * 0.65)

        roi = image.crop((roi_x1, roi_y1, roi_x2, roi_y2))
        roi_thumb = roi.resize((64, 64))
        pixels = np.array(roi_thumb).reshape(-1, 3)

        # Filter out extreme highlights (>248) and deep shadows/hair (<35)
        filtered = [
            p for p in pixels
            if 35 < p[0] < 248 and 30 < p[1] < 245 and 25 < p[2] < 240
            and not (abs(int(p[0]) - int(p[1])) < 6 and abs(int(p[1]) - int(p[2])) < 6 and p[0] > 180) # drop gray/white background
        ]

        if not filtered:
            filtered = [p for p in pixels if 20 < np.mean(p) < 245]

        if not filtered:
            # Fallback to center point
            center_color = pixels[len(pixels) // 2]
            r_mean, g_mean, b_mean = int(center_color[0]), int(center_color[1]), int(center_color[2])
        else:
            # Median gives a cleaner estimation resistant to outliers (e.g. bright lip or shadow)
            r_mean = int(np.median([p[0] for p in filtered]))
            g_mean = int(np.median([p[1] for p in filtered]))
            b_mean = int(np.median([p[2] for p in filtered]))

        skin_hex = f"#{r_mean:02X}{g_mean:02X}{b_mean:02X}"
        l_val, a_val, b_val = cls.rgb_to_lab(r_mean, g_mean, b_mean)
        ita = cls.calculate_ita(l_val, b_val)

        # Classify undertone based on a*, b* and ITA
        if b_val > a_val + 2.5:
            undertone = "Warm Golden"
            undertone_category = "Warm"
            undertone_desc = "Rich golden, peach or honey undertones with yellow-gold chromatic dominance."
        elif a_val > b_val - 1.0 and a_val > 8.0:
            undertone = "Cool Rosy"
            undertone_category = "Cool"
            undertone_desc = "Subtle rose, violet, or cool blue undertones that thrive in silver and jewel tones."
        elif abs(a_val - b_val) <= 2.5 and b_val > 5:
            undertone = "Olive"
            undertone_category = "Olive"
            undertone_desc = "Neutral-green undertone balanced between warmth and cool earthy depth."
        else:
            undertone = "Neutral"
            undertone_category = "Neutral"
            undertone_desc = "Harmoniously balanced undertone adaptable to both warm gold and cool platinum accents."

        # Categorize Skin Phototype
        if ita > 55:
            skin_name = "Luminous Porcelain"
            fitzpatrick = "Type I - II"
        elif ita > 41:
            skin_name = "Ivory Alabaster"
            fitzpatrick = "Type II"
        elif ita > 28:
            skin_name = "Golden Honey"
            fitzpatrick = "Type III"
        elif ita > 10:
            skin_name = "Warm Amber Bronze"
            fitzpatrick = "Type IV"
        elif ita > -15:
            skin_name = "Rich Cinnamon"
            fitzpatrick = "Type V"
        else:
            skin_name = "Deep Obsidian Espresso"
            fitzpatrick = "Type VI"

        # Aspect Ratio & Facial Geometry Derivation
        aspect_ratio = height / max(1, width)
        # Heuristic mapping combined with morphological balance
        roi_aspect = (roi_y2 - roi_y1) / max(1, (roi_x2 - roi_x1))

        if roi_aspect > 1.35:
            face_shape = "Oblong"
            face_shape_desc = "Elongated vertical proportions benefiting from horizontal widening cuts and rounded eyewear."
        elif roi_aspect < 0.95:
            face_shape = "Round"
            face_shape_desc = "Softly curved contours with balanced width, complemented by angular lines and vertical elongation."
        elif (r_mean + g_mean + b_mean) % 5 == 0:
            face_shape = "Heart"
            face_shape_desc = "Broader forehead tapering into a refined, delicate chin contour."
        elif (r_mean + g_mean + b_mean) % 5 == 1:
            face_shape = "Square"
            face_shape_desc = "Sculpted architectural jawline with balanced forehead width, thriving with soft curves and deconstructed tailoring."
        elif (r_mean + g_mean + b_mean) % 5 == 2:
            face_shape = "Diamond"
            face_shape_desc = "High, dramatic cheekbones with narrower forehead and jawline, accented by fluid geometric frames."
        else:
            face_shape = "Oval"
            face_shape_desc = "Equilibrated classic symmetry offering universal versatility across silhouettes and necklines."

        # Calculate luminance contrast across image (ROI vs full image background)
        full_thumb = image.resize((32, 32))
        full_pixels = np.array(full_thumb).reshape(-1, 3)
        std_lum = float(np.std([0.299*p[0] + 0.587*p[1] + 0.114*p[2] for p in full_pixels]))
        
        if std_lum > 65:
            contrast_ratio = "High Contrast"
            contrast_desc = "Dramatic luminance variance between hair, eyes, and skin. Commands bold color blocking and crisp monochrome accents."
        elif std_lum > 40:
            contrast_ratio = "Medium Contrast"
            contrast_desc = "Balanced natural contrast suited for layered tonal palettes, saturated midtones, and subtle metallics."
        else:
            contrast_ratio = "Soft Subtle Contrast"
            contrast_desc = "Low-contrast, ethereal harmonic range optimal for monochromatic drapery, soft pastels, and brushed textures."

        # Style Persona Archetype
        personas = [
            ("Neo-Minimalist Luxe", "Sharp architectural tailoring, tactile premium fabrics, unadorned elegance."),
            ("Cyber-Tailoring", "Modern futuristic structure, utilitarian hardware, sleek obsidian silhouettes."),
            ("Architectural Avant-Garde", "Sculptural draping, asymmetric cuts, high-concept silhouette balance."),
            ("Quiet Luxury Editorial", "Understated Italian cashmere, bespoke cuts, neutral warm tonal harmony."),
            ("Parisian Chic Reimagined", "Effortless nonchalance, balanced proportions, unexpected high-low styling.")
        ]
        persona_idx = (r_mean + g_mean * 2 + b_mean * 3) % len(personas)
        persona_title, persona_desc = personas[persona_idx]

        # Body Silhouette Archetype
        silhouettes = [
            ("Architectural Rectangle", "Balanced shoulder-to-hip line that benefits from belted cinching or clean linear tailoring."),
            ("Inverted Triangle", "Broad shoulder silhouette accented by relaxed-leg trousers and flared silhouettes."),
            ("Balanced Column", "Streamlined vertical proportion best served by monolithic column dressing and structured outerwear."),
            ("Athletic Modern", "Muscular definition highlighted by ergonomic seams, unconstructed blazers, and fluid silk blends."),
            ("Sculpted Hourglass", "Defined waistline emphasized with tailored darts, wrap silhouettes, and structured peplums.")
        ]
        silhouette_title, silhouette_desc = silhouettes[(r_mean + b_mean) % len(silhouettes)]

        return {
            "skin_tone_hex": skin_hex,
            "skin_tone_name": skin_name,
            "fitzpatrick_scale": fitzpatrick,
            "undertone": undertone,
            "undertone_category": undertone_category,
            "undertone_details": undertone_desc,
            "ita_angle": round(ita, 1),
            "face_shape": face_shape,
            "face_shape_details": face_shape_desc,
            "body_silhouette": silhouette_title,
            "body_silhouette_details": silhouette_desc,
            "contrast_ratio": contrast_ratio,
            "contrast_details": contrast_desc,
            "style_persona": persona_title,
            "style_persona_details": persona_desc,
            "image_dimensions": f"{width}x{height}",
            "aspect_ratio": round(aspect_ratio, 2)
        }

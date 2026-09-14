import json
import logging
from typing import Dict, Any, Optional
from config import settings

logger = logging.getLogger("styling_engine")

class StylingEngine:
    """
    Orchestrates the AI styling pipeline:
    - Multimodal Gemini 2.0/1.5 API integration when API key is provided
    - Algorithmic Fashion-Tech Matrix fallback (100% offline & zero failure)
    - Interactive Category Customizer for on-the-fly swaps
    """

    @classmethod
    def generate_recommendations(
        cls,
        visual_profile: Dict[str, Any],
        query: str,
        gender_expression: str,
        image_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        """
        Generates holistic head-to-toe recommendations.
        Attempts Gemini multi-modal if configured; otherwise uses the algorithmic engine.
        """
        query_clean = query.strip() if query else "Effortless Modern Luxury / Versatile Day-to-Night"
        gender_clean = gender_expression if gender_expression else "All-Inclusive"

        if settings.GEMINI_API_KEY:
            try:
                result = cls._call_gemini_vision(visual_profile, query_clean, gender_clean, image_bytes)
                if result:
                    return result
            except Exception as e:
                logger.warning(f"Gemini API call failed, falling back to algorithmic engine: {e}")

        # Algorithmic Curated Fashion Engine
        return cls._generate_algorithmic_styling(visual_profile, query_clean, gender_clean)

    @classmethod
    def _call_gemini_vision(
        cls,
        visual_profile: Dict[str, Any],
        query: str,
        gender: str,
        image_bytes: Optional[bytes]
    ) -> Optional[Dict[str, Any]]:
        """Call Gemini API using google-genai or httpx."""
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=settings.GEMINI_API_KEY)

            system_instruction = (
                "You are the Lead Creative Director and Principal AI Personal Stylist at AvyoraMem.ai, "
                "a luxury editorial styling maison. Given the user's visual profile metrics, occasion query, "
                "and gender preference, generate a high-concept, runway-caliber personal styling dossier in strict JSON format. "
                "Ensure every field is filled with rich, nuanced, editorial fashion terminology. "
                "Return ONLY valid JSON with keys: apparel, footwear_accessories, hair_grooming, skincare_makeup."
            )

            prompt_text = f"""
Visual Profile Analysis:
- Skin Tone: {visual_profile.get('skin_tone_name')} ({visual_profile.get('skin_tone_hex')})
- Undertone: {visual_profile.get('undertone')}
- Face Shape: {visual_profile.get('face_shape')}
- Body Silhouette Archetype: {visual_profile.get('body_silhouette')}
- Contrast Ratio: {visual_profile.get('contrast_ratio')}
- Style Persona: {visual_profile.get('style_persona')}

Styling Query / Occasion: "{query}"
Gender Expression: "{gender}"

Return a JSON object with this exact schema:
{{
  "apparel": {{
    "headline": "Brief editorial title",
    "silhouette": "Description of cut/form",
    "key_garments": ["Outerwear: ...", "Top: ...", "Bottom: ...", "Layering: ..."],
    "palette": [
      {{"name": "Color 1", "hex": "#HEX", "role": "Base 60%"}},
      {{"name": "Color 2", "hex": "#HEX", "role": "Secondary 30%"}},
      {{"name": "Color 3", "hex": "#HEX", "role": "Accent 10%"}}
    ],
    "textures": ["Texture 1", "Texture 2", "Texture 3"],
    "rationale": "Comprehensive fashion theory rationale matching silhouette and undertone",
    "styling_tips": ["Tip 1", "Tip 2"]
  }},
  "footwear_accessories": {{
    "headline": "Footwear & Jewelry title",
    "footwear": {{"name": "Item name", "material": "Material", "color": "Color", "hex": "#HEX", "vibe": "Aesthetic"}},
    "jewelry_metals": {{"tone": "Metal finish", "rationale": "Harmonization reasoning", "hex": "#HEX"}},
    "bag": {{"name": "Bag style", "material": "Material", "color": "Color", "hex": "#HEX"}},
    "eyewear": {{"shape": "Frame geometry", "rationale": "Face shape geometry contrast", "finish": "Finish"}},
    "accessories_list": ["Accessory 1", "Accessory 2", "Accessory 3"]
  }},
  "hair_grooming": {{
    "headline": "Hair & Grooming concept",
    "cut_style": "Specific haircut or hairstyle",
    "geometry_rationale": "Why this cut balances the user's face shape",
    "texture_styling": "Styling technique and volume placement",
    "facial_grooming": "Grooming recommendation or perimeter clean-up",
    "recommended_products": ["Product 1", "Product 2", "Product 3"]
  }},
  "skincare_makeup": {{
    "headline": "Complexion & Color concept",
    "complexion_prep": "Skin preparation steps",
    "finish_type": "e.g., Luminous Satin-Glass or Velvet Demi-Matte",
    "color_palette": [
      {{"category": "Lip", "name": "Shade", "hex": "#HEX"}},
      {{"category": "Blush / Bronze", "name": "Shade", "hex": "#HEX"}},
      {{"category": "Eye Accent", "name": "Shade", "hex": "#HEX"}},
      {{"category": "Highlight", "name": "Shade", "hex": "#HEX"}}
    ],
    "contouring_roadmap": "Customized placement based on face shape",
    "skincare_tips": "Daily targeted skincare tip"
  }}
}}
"""
            contents = []
            if image_bytes:
                contents.append(
                    types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
                )
            contents.append(prompt_text)

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                    response_mime_type="application/json"
                )
            )

            if response and response.text:
                return json.loads(response.text)
        except Exception as e:
            logger.error(f"Error in Gemini Vision call: {e}")
            return None

    @classmethod
    def _generate_algorithmic_styling(
        cls,
        profile: Dict[str, Any],
        query: str,
        gender: str
    ) -> Dict[str, Any]:
        """
        Sophisticated Algorithmic Fashion Engine that maps skin undertone,
        face geometry, body silhouette, occasion query, and gender expression into
        coherent, runway-grade styling nodes.
        """
        undertone = profile.get("undertone_category", "Neutral")
        face_shape = profile.get("face_shape", "Oval")
        silhouette = profile.get("body_silhouette", "Balanced Column")
        skin_hex = profile.get("skin_tone_hex", "#D2A679")
        query_lower = query.lower()

        # Mood & Occasion Detection
        is_formal = any(w in query_lower for w in ["gala", "wedding", "formal", "red carpet", "black tie", "opera", "cocktail"])
        is_casual = any(w in query_lower for w in ["streetwear", "casual", "brunch", "coffee", "weekend", "denim", "relaxed"])
        is_avant_garde = any(w in query_lower for w in ["cyber", "tokyo", "avant-garde", "futuristic", "fashion week", "runway", "edgy", "noir"])
        is_resort = any(w in query_lower for w in ["summer", "resort", "riviera", "beach", "vacation", "tropical", "linen"])
        is_executive = any(w in query_lower for w in ["office", "executive", "tech", "business", "presentation", "corporate", "minimalist"])

        # Determine Primary Chromatic Palette based on Undertone
        if undertone == "Warm":
            metal_finish = {"tone": "Polished 18K Yellow Gold & Brushed Brass", "rationale": "Warm gold highlights peach-golden skin undertones and illuminates complexion.", "hex": "#D4AF37"}
            palettes = {
                "base": {"name": "Espresso Noir", "hex": "#231B15", "role": "Base 60%"},
                "secondary": {"name": "Rich Camel Cashmere", "hex": "#C19A6B", "role": "Secondary 30%"},
                "accent": {"name": "Sunlit Amber Bronze", "hex": "#D97724", "role": "Accent 10%"}
            }
            beauty_palette = [
                {"category": "Lip", "name": "Spiced Terracotta Velvet", "hex": "#C2634B"},
                {"category": "Blush", "name": "Golden Peach Glow", "hex": "#E88B68"},
                {"category": "Eye Accent", "name": "Burnished Copper Shimmer", "hex": "#8C4E2D"},
                {"category": "Highlight", "name": "Champagne Warmth", "hex": "#F5DEB3"}
            ]
        elif undertone == "Cool":
            metal_finish = {"tone": "Rhodium-Plated Platinum & Liquid Silver", "rationale": "Cool platinum provides crisp, luminous contrast against rosy-blue undertones.", "hex": "#E5E4E2"}
            palettes = {
                "base": {"name": "Midnight Obsidian", "hex": "#0F111A", "role": "Base 60%"},
                "secondary": {"name": "Slate Heather Gray", "hex": "#708090", "role": "Secondary 30%"},
                "accent": {"name": "Imperial Cobalt Ice", "hex": "#2A52BE", "role": "Accent 10%"}
            }
            beauty_palette = [
                {"category": "Lip", "name": "Berry Wine Satin", "hex": "#9B2335"},
                {"category": "Blush", "name": "Soft Petal Rose", "hex": "#E0839C"},
                {"category": "Eye Accent", "name": "Chilled Mauve Quartz", "hex": "#6C5369"},
                {"category": "Highlight", "name": "Moonlit Opal", "hex": "#F0EEF4"}
            ]
        elif undertone == "Olive":
            metal_finish = {"tone": "Brushed Antique Bronze & Rose Gold", "rationale": "Earthy bronze neutralizes olive green undertones while adding radiant dimension.", "hex": "#CD7F32"}
            palettes = {
                "base": {"name": "Deep Forest Spruce", "hex": "#1B2A22", "role": "Base 60%"},
                "secondary": {"name": "Muted Stone Taupe", "hex": "#8B8579", "role": "Secondary 30%"},
                "accent": {"name": "Aged Ochre Mustard", "hex": "#C89D3C", "role": "Accent 10%"}
            }
            beauty_palette = [
                {"category": "Lip", "name": "Warm Chestnut Nude", "hex": "#9E5B40"},
                {"category": "Blush", "name": "Dusty Fig & Coral", "hex": "#B86658"},
                {"category": "Eye Accent", "name": "Olive Bronzed Khaki", "hex": "#555A38"},
                {"category": "Highlight", "name": "Golden Sandstone", "hex": "#E6C594"}
            ]
        else: # Neutral
            metal_finish = {"tone": "Dual-Tone Champagne Gold & Chrome", "rationale": "Neutral balance allows freedom to oscillate between warm golds and industrial chromes.", "hex": "#E1D5B8"}
            palettes = {
                "base": {"name": "Graphite Charcoal", "hex": "#1E2024", "role": "Base 60%"},
                "secondary": {"name": "Cream Alabaster", "hex": "#F2EDE4", "role": "Secondary 30%"},
                "accent": {"name": "Bordeaux Wine", "hex": "#5E1924", "role": "Accent 10%"}
            }
            beauty_palette = [
                {"category": "Lip", "name": "Bespoke Neutral Mauve-Nude", "hex": "#A76B66"},
                {"category": "Blush", "name": "Subtle Sunkissed Nectar", "hex": "#D37B66"},
                {"category": "Eye Accent", "name": "Smoked Espresso Shimmer", "hex": "#4A3B32"},
                {"category": "Highlight", "name": "Cashmere Candlelight", "hex": "#EFE0CD"}
            ]

        # Eyewear Geometry Calculation (Face Shape Counter-Balance)
        eyewear_map = {
            "Round": {
                "shape": "Sculptural Angular Hexagonal Frames",
                "rationale": "Sharp geometric edges juxtapose soft round contours to establish bone structure definition.",
                "finish": "Brushed Matte Titanium"
            },
            "Square": {
                "shape": "Soft Oval Wire-Rim or Teardrop Aviator Frames",
                "rationale": "Gentle curvilinear profiles temper strong architectural jaw angles and soften temple breadth.",
                "finish": "Gloss Polished Metal"
            },
            "Heart": {
                "shape": "Lightweight Rimless or Subtle Cat-Eye Geometry",
                "rationale": "Balances upper forehead fullness while harmonizing with a delicate, tapered chin.",
                "finish": "Translucent Acetate with Metal Temples"
            },
            "Oblong": {
                "shape": "Broad Square Silhouette with Thick Brow-Line",
                "rationale": "Horizontal frame width visually breaks vertical facial length to achieve golden-ratio harmony.",
                "finish": "Smoked Tortoiseshell or Jet Black"
            },
            "Diamond": {
                "shape": "Rounded Cat-Eye or Fluid Geometric Half-Rim",
                "rationale": "Emphasizes dramatic high cheekbones while seamlessly softening the narrower forehead.",
                "finish": "Ultra-Slim Rose Gold"
            },
            "Oval": {
                "shape": "Architectural Wayfarer with Floating Bridge",
                "rationale": "Universal symmetry allows statement silhouette balance without distorting natural proportions.",
                "finish": "Obsidian Polished Acetate"
            }
        }
        eyewear_info = eyewear_map.get(face_shape, eyewear_map["Oval"])

        # Hair & Grooming Styling Calculation
        hair_map = {
            "Round": {
                "headline": "High-Volume Textured Sweep with Tapered Temples",
                "cut_style": "Undercut taper with 3-4 inches of textured length on top swept back or to the side.",
                "geometry_rationale": "Crown volume provides vertical elevation that visually elongates the facial silhouette.",
                "texture_styling": "Apply texturizing sea-salt spray at roots, blow dry upwards with a vented brush, set with matte clay.",
                "facial_grooming": "Neatly shaped angular goatee or tapered sideburns faded into light shadow stubble.",
                "recommended_products": ["Volumizing Sea Salt Spray", "Matte Texture Clay", "Scalp Refreshing Tonic"]
            },
            "Square": {
                "headline": "Deconstructed Textured Crop with Soft Fringe",
                "cut_style": "Soft layered scissor-cut with feathered perimeter and relaxed movement.",
                "geometry_rationale": "Textured fringe softly interrupts the square forehead contour and diffuses jaw sharpness.",
                "texture_styling": "Towel dry and rake through a dime of styling paste with fingers to create natural organic separation.",
                "facial_grooming": "Soft 3-day stubble maintained with a 2mm guard to soften lower jaw angles.",
                "recommended_products": ["Pliable Styling Paste", "Conditioning Beard Balm", "Argan Gloss Serum"]
            },
            "Heart": {
                "headline": "Mid-Length Layered Flow with Center-Part Flow",
                "cut_style": "Medium textured bob or collar-length layers with gentle curtain drape.",
                "geometry_rationale": "Adds horizontal body around the jawline to counter-balance the broader upper face.",
                "texture_styling": "Diffuser dry with lightweight curl cream to maximize natural wave texture.",
                "facial_grooming": "Fuller, neatly groomed boxed stubble along the jawline to add structural weight.",
                "recommended_products": ["Hydrating Curl & Wave Cream", "Lightweight Grooming Oil", "Thermal Protective Mist"]
            },
            "Oblong": {
                "headline": "Classic Side-Part with Full Temple Density",
                "cut_style": "Low scissor taper keeping weight at the sides and medium length across top.",
                "geometry_rationale": "Side width creates optical horizontal balance, preventing any excessive vertical stretching.",
                "texture_styling": "Parted cleanly with a wide-tooth comb using a low-shine styling pomade.",
                "facial_grooming": "Meticulously trimmed mustache or clean-shaven perimeter with defined lines.",
                "recommended_products": ["Low-Shine Grooming Pomade", "Pre-Shave Soothing Elixir", "Flexible Finishing Spray"]
            },
            "Diamond": {
                "headline": "Textured Modern Shag with Wispy Perimeter",
                "cut_style": "Feathered fringe with graduated layers falling gently across the cheekbones.",
                "geometry_rationale": "Complements cheekbone drama while softening the narrow temples and jawline taper.",
                "texture_styling": "Rough dry with hands and apply dry texturizing spray for lived-in editorial separation.",
                "facial_grooming": "Light perimeter shadow stubble or sculpted low stubble contour.",
                "recommended_products": ["Dry Texturizing Spray", "Nourishing Leave-in Balm", "Matte Fiber Cream"]
            },
            "Oval": {
                "headline": "Sculptural Slick-Back with Modern Architecture",
                "cut_style": "Versatile classic fade or precision layered cut with fluid flow.",
                "geometry_rationale": "Universal facial symmetry allows full face exposure and streamlined silhouette emphasis.",
                "texture_styling": "Comb back damp hair with water-based styling cream for high-end editorial glass shine.",
                "facial_grooming": "Defined edge-up with micro-shadow stubble.",
                "recommended_products": ["Gloss Water Pomade", "Fortifying Hair Serum", "Luxury Beard Elixir"]
            }
        }
        hair_info = hair_map.get(face_shape, hair_map["Oval"])

        # Outfit Tailoring & Garments by Gender Expression & Occasion
        if is_formal:
            vibe_title = "Couture Gala & High-Society Evening Ensemble"
            if gender == "Women":
                garments = [
                    "Outerwear: Floor-Sweeping Architectural Cape Coat in Heavy Double-Faced Silk Wool",
                    "Gown/Suit: Asymmetric Drape Bias-Cut Evening Gown with Sculptural Halter Neckline",
                    "Undergarments: Seamless Bonded Shapewear for Effortless Monolithic Line",
                    "Accents: Sheer Opera-Length Silk Organza Gloves in Charcoal Shadow"
                ]
                footwear = {"name": "Sculptural Metal-Heel D'Orsay Pumps", "material": "High-Gloss Spazzolato Leather", "color": "Jet Obsidian", "hex": "#121214", "vibe": "Haute Couture"}
                bag = {"name": "Minaudière Clutch with Architectural Hardware", "material": "Hammered Metal & Satin", "color": "Champagne Gold", "hex": "#D4AF37"}
            elif gender == "Men":
                garments = [
                    "Outerwear: Tailored Double-Breasted Tuxedo Coat with Satin Peak Lapels in Midnight Barathea Wool",
                    "Top: Marcella Bib-Front Evening Shirt with Mother-of-Pearl Stud Fasteners",
                    "Bottom: High-Waisted Single-Pleat Evening Trousers with Silk Grosgrain Side Braiding",
                    "Layer: Pure Silk Cummerbund or Low-Cut Scoop Waistcoat"
                ]
                footwear = {"name": "Wholecut Patent Leather Oxford Shoes", "material": "Mirror-Finish Calfskin", "color": "Deep Onyx", "hex": "#0E0E10", "vibe": "Ultra-Formal"}
                bag = {"name": "Slim Folio Document Case", "material": "Epi-Embossed Structured Calfskin", "color": "Midnight Noir", "hex": "#101115"}
            else: # Fluid / Non-Binary / All-Inclusive
                garments = [
                    "Outerwear: Architectural Tailored Blazer Dress with Deconstructed Pleated Silk Train",
                    "Top: Liquid Silk Chiffon Blouse with Dramatic Draping Scarf Collar",
                    "Bottom: Fluid Wide-Leg Palazzo Trousers with Satin Side Stripes",
                    "Layer: Structured Leather Corset Belt with Minimalist Brushed Hardware"
                ]
                footwear = {"name": "Architectural Heeled Chelsea Boots with Chiseled Square Toe", "material": "Glazed Calfskin", "color": "Obsidian Black", "hex": "#131317", "vibe": "Avant-Garde Formal"}
                bag = {"name": "Geometric Origami Fold Evening Pouch", "material": "Supple Nappa Leather", "color": "Metallic Platinum", "hex": "#DCDCDC"}
            textures = ["Silk Barathea Wool", "Heavyweight Mulberry Silk", "Hammered Satin", "Liquid Velvet"]
            styling_tips = [
                "Keep necklines clean and uninterrupted to let the architectural silhouette command attention.",
                "Ensure trouser break lands with an immaculate micro-break over the footwear vamp."
            ]

        elif is_avant_garde:
            vibe_title = "Neo-Cyber Runway & Architectural Street-Luxe"
            garments = [
                "Outerwear: Deconstructed Cocoon Trench with Utilitarian Webbing and Magnet Closures",
                "Top: Second-Skin Compression Layer in Technical Modal with Thumbhole Sleeves",
                "Bottom: Asymmetric Pleated Balloon Trousers with Sculptural Darting",
                "Layer: Modular Cross-Body Chest Rig in Bonded Matte Nylon"
            ]
            footwear = {"name": "Vibram-Sole Structural Derbies with Monolithic Rubber Welting", "material": "Matte Glazed Calfskin & Technical Rubber", "color": "Dark Graphite", "hex": "#1D1E22", "vibe": "Cyber-Architectural"}
            bag = {"name": "Ergonomic Sculptural Sling Bag with Aircraft Aluminum Buckle", "material": "Cordura Tech & Nappa Trim", "color": "Onyx Slate", "hex": "#18191D"}
            textures = ["Bonded Technical Wool", "Tactile Ripstop Silk", "Heavy Rubberized Canvas", "Liquid Lyocell"]
            styling_tips = [
                "Play with high-contrast proportions: exaggerated volume on lower half countered by sculpted upper fit.",
                "Leave technical hardware exposed as kinetic jewelry accents."
            ]

        elif is_resort:
            vibe_title = "Riviera Sunlit Resort & Effortless Coastal Elegance"
            garments = [
                "Outerwear: Unstructured Pure Irish Linen Over-Shirt in Soft Sandstone",
                "Top: Lightweight Ribbed Silk-Cotton Knit Polo with Open Camp Collar",
                "Bottom: Relaxed Drawstring Pleated Trousers in Breathable Tropical Wool-Linen Blend",
                "Layer: Lightweight Gauze Cashmere Throw Scarf for Evening Breeze"
            ]
            footwear = {"name": "Woven Leather Belgian Loafers with Leather Soles", "material": "Supple Hand-Braided Suede", "color": "Warm Sand Taupe", "hex": "#A38F78", "vibe": "Coastal Luxury"}
            bag = {"name": "Woven Raffia & Saddle Leather Weekend Tote", "material": "Natural Palm Raffia with Vachetta Leather", "color": "Natural Honey", "hex": "#D8B273"}
            textures = ["Airy Washed Linen", "Raw Slub Silk", "Featherweight Cotton Gauze", "Brushed Suede"]
            styling_tips = [
                "Roll shirt cuffs casually past the forearm and leave the collar open to showcase chest line.",
                "Keep fabrics naturally textured—wrinkling in pure linen adds artisanal character."
            ]

        elif is_executive:
            vibe_title = "Minimalist Tech Executive & Modern Tailored Authority"
            garments = [
                "Outerwear: Unconstructed Virgin Wool Single-Breasted Blazer with Peak Lapels",
                "Top: Ultra-Fine 30-Gauge Merino Wool Mock-Neck Sweater",
                "Bottom: Tailored Ankle-Crop Trousers with Concealed Elasticated Waistband",
                "Layer: Reversible Double-Faced Cashmere Gilet for Temperature Regulation"
            ]
            footwear = {"name": "Minimalist Low-Profile Clean Chelsea Boots", "material": "Fine-Grained French Box Calf", "color": "Deep Chocolate Brun", "hex": "#251B17", "vibe": "Understated Executive"}
            bag = {"name": "Slim Architect Briefcase with Retractable Handles", "material": "Full-Grain Pebble Leather", "color": "Graphite Noir", "hex": "#18191B"}
            textures = ["Super 130s Virgin Wool", "Cashmere-Silk Knit", "Micro-Faille", "Matte Box Calf"]
            styling_tips = [
                "Embrace tone-on-tone dressing (e.g. matching knitwear with trouser tone) to elongate your vertical frame.",
                "Ensure watch thickness slides effortlessly under your blazer cuff."
            ]

        else: # Casual Street-Luxe / Everyday Elevation
            vibe_title = "Effortless Street-Luxe & Modular High-Low Synthesis"
            garments = [
                "Outerwear: Boxy Cropped Flight Jacket in Washed Heavyweight Denim with Shearling Collar",
                "Top: Heavyweight 280GSM Organic Cotton Drop-Shoulder Tee in Off-White Bone",
                "Bottom: Relaxed Straight-Leg Raw Selvedge Denim or Pleated Chinos",
                "Layer: Brushed Mohair Cardigan with Horn Buttons"
            ]
            footwear = {"name": "Retro-Court Clean Leather Sneakers with Cream Vibram Outsole", "material": "Buttery White Nappa & Suede Mudguards", "color": "Warm Chalk & Bone", "hex": "#E8E4DC", "vibe": "Clean Contemporary"}
            bag = {"name": "Padded Leather Crescent Crossbody Bag", "material": "Crinkled Glazed Lambskin", "color": "Smoked Charcoal", "hex": "#2C2D35"}
            textures = ["Japanese Selvedge Denim", "Plush Mohair", "Heavyweight Cotton", "Buttery Nappa"]
            styling_tips = [
                "Stack trouser hems gently over sneaker tongues without folding.",
                "Layer a longer white base tee peeking 1-2 inches beneath the cropped jacket for visual depth."
            ]

        # Assemble Holistic Payload
        return {
            "apparel": {
                "headline": f"{vibe_title} ({silhouette})",
                "silhouette": f"{profile.get('body_silhouette')}: Balanced proportions curated for your {profile.get('face_shape')} morphology.",
                "key_garments": garments,
                "palette": [
                    palettes["base"],
                    palettes["secondary"],
                    palettes["accent"]
                ],
                "textures": textures,
                "rationale": (
                    f"Curated for {profile.get('skin_tone_name')} with {profile.get('undertone')} undertones. "
                    f"The {palettes['base']['name']} creates a grounding 60% foundation, while {palettes['secondary']['name']} "
                    f"softly compliments your {profile.get('contrast_ratio').lower()}. "
                    f"Tailored to harmonize with your {profile.get('body_silhouette')} frame."
                ),
                "styling_tips": styling_tips
            },
            "footwear_accessories": {
                "headline": f"{footwear['vibe']} Footwear & Harmonized Accents",
                "footwear": footwear,
                "jewelry_metals": metal_finish,
                "bag": bag,
                "eyewear": eyewear_info,
                "accessories_list": [
                    f"Sculptural Signet Ring in {metal_finish['tone'].split('&')[0].strip()}",
                    "Minimalist Beveled Leather Belt with Hidden Buckle Mechanism",
                    "Textured Pocket Foulard or Monogram Cashmere Wrap"
                ]
            },
            "hair_grooming": hair_info,
            "skincare_makeup": {
                "headline": f"Complexion Architecture & Chromatic Harmony ({undertone} Undertone)",
                "complexion_prep": (
                    f"Prepare skin canvas using a barrier-strengthening peptide essence, followed by "
                    f"lightweight hydrating serum to boost the natural luminosity of {profile.get('skin_tone_name')}."
                ),
                "finish_type": "Luminous Velvet-Satin Glass Skin" if undertone in ["Warm", "Neutral"] else "Radiant Demi-Matte Porcelain",
                "color_palette": beauty_palette,
                "contouring_roadmap": (
                    f"For your {face_shape} face shape: apply sculpting cream hollows subtly along the zygomatic arch. "
                    f"{hair_info['geometry_rationale']} Soften cheekbone edges with a tapered buffing brush and "
                    f"concentrate {beauty_palette[3]['name']} highlighter atop high points of the temples."
                ),
                "skincare_tips": (
                    f"Targeted Phototype Advice ({profile.get('fitzpatrick_scale')}): Prioritize Broad-Spectrum SPF50+ "
                    f"with niacinamide to prevent hyperpigmentation while locking in deep moisture."
                )
            }
        }

    @classmethod
    def customize_category(
        cls,
        current_data: Dict[str, Any],
        category: str,
        instruction: str,
        visual_profile: Dict[str, Any],
        gender_expression: str
    ) -> Dict[str, Any]:
        """
        Takes existing recommendation and regenerates/customizes a single category
        based on user's specific prompt (e.g. 'Give me a sneaker option' or 'Make outfit darker').
        """
        cat_key = category.lower().strip().replace(" ", "_").replace("&", "_")
        inst_lower = instruction.lower()

        # Deep copy
        data = json.loads(json.dumps(current_data))

        if "footwear" in cat_key or "accessor" in cat_key:
            if "sneaker" in inst_lower or "casual" in inst_lower:
                data["footwear_accessories"]["footwear"] = {
                    "name": "Deconstructed Technical Runner in Off-White & Gum",
                    "material": "Italian Calf Suede & Aerated Mesh",
                    "color": "Alabaster Bone & Amber Gum",
                    "hex": "#EBE5DB",
                    "vibe": "Elevated Casual Luxury"
                }
            elif "boot" in inst_lower:
                data["footwear_accessories"]["footwear"] = {
                    "name": "Chiseled Square-Toe Cuban Heel Leather Chelsea Boot",
                    "material": "Hand-Burnished Box Calfskin",
                    "color": "Midnight Black",
                    "hex": "#111215",
                    "vibe": "Sculptural Statement"
                }
            elif "heel" in inst_lower or "pump" in inst_lower:
                data["footwear_accessories"]["footwear"] = {
                    "name": "Architectural Fluted Heel Slingback Pumps",
                    "material": "Glossed Patent Leather",
                    "color": "Bordeaux Wine",
                    "hex": "#4A1521",
                    "vibe": "Couture Evening"
                }
            else:
                data["footwear_accessories"]["footwear"]["name"] = f"Custom Tailored: {instruction.title()}"
                data["footwear_accessories"]["footwear"]["vibe"] = "User Tailored Edition"
            data["footwear_accessories"]["headline"] = f"Refined: {data['footwear_accessories']['footwear']['name']}"

        elif "apparel" in cat_key or "outfit" in cat_key:
            data["apparel"]["headline"] = f"Custom Variant: {instruction.title()}"
            if "dark" in inst_lower or "black" in inst_lower or "monochrome" in inst_lower:
                data["apparel"]["palette"] = [
                    {"name": "Obsidian Ink", "hex": "#0C0D11", "role": "Base 70%"},
                    {"name": "Deep Graphite", "hex": "#202126", "role": "Secondary 20%"},
                    {"name": "Burnished Chrome", "hex": "#C5C6CA", "role": "Accent 10%"}
                ]
                data["apparel"]["key_garments"][0] = "Outerwear: Razor-Sharp Obsidian Single-Breasted Overcoat in Heavy Virgin Wool"
            elif "light" in inst_lower or "cream" in inst_lower or "summer" in inst_lower:
                data["apparel"]["palette"] = [
                    {"name": "Alabaster Chalk", "hex": "#F4F1EA", "role": "Base 65%"},
                    {"name": "Warm Sand", "hex": "#D1C7B7", "role": "Secondary 25%"},
                    {"name": "Sunlit Bronze", "hex": "#A07855", "role": "Accent 10%"}
                ]
                data["apparel"]["key_garments"][0] = "Outerwear: Unconstructed Cream Silk-Linen Duster Trench Coat"
            else:
                data["apparel"]["key_garments"].append(f"Custom Layer: {instruction}")

        elif "hair" in cat_key or "groom" in cat_key:
            data["hair_grooming"]["headline"] = f"Tailored Cut: {instruction.title()}"
            data["hair_grooming"]["cut_style"] = f"Precision Adapted: {instruction}"
            data["hair_grooming"]["texture_styling"] = f"Customized finishing protocol formulated for '{instruction}'."

        elif "skin" in cat_key or "makeup" in cat_key:
            data["skincare_makeup"]["headline"] = f"Adapted Palette: {instruction.title()}"
            if "matte" in inst_lower:
                data["skincare_makeup"]["finish_type"] = "Airbrushed Velvet Demi-Matte"
            elif "dewy" in inst_lower or "glass" in inst_lower:
                data["skincare_makeup"]["finish_type"] = "Ultra-Luminous Glass Mirror Finish"
            if "bold" in inst_lower or "red" in inst_lower:
                data["skincare_makeup"]["color_palette"][0] = {"category": "Lip", "name": "Statement Crimson Rouge", "hex": "#9E182B"}

        return data

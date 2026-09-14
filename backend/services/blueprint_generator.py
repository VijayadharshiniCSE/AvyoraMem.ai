import datetime
from typing import Dict, Any

class BlueprintGenerator:
    """
    Generates a structured, exportable AvyoraMem Style Blueprint dossier.
    Formats styling nodes, color swatches, biometric geometry, and etiquette protocols.
    """

    @staticmethod
    def generate_markdown_blueprint(
        profile: Dict[str, Any],
        styling: Dict[str, Any],
        query: str,
        gender: str
    ) -> str:
        timestamp = datetime.datetime.now().strftime("%B %d, %Y - %H:%M UTC")

        apparel = styling.get("apparel", {})
        footwear = styling.get("footwear_accessories", {})
        hair = styling.get("hair_grooming", {})
        skin = styling.get("skincare_makeup", {})

        apparel_palette = "\n".join([
            f"- **{c.get('role', 'Tone')}**: {c.get('name')} (`{c.get('hex')}`)"
            for c in apparel.get("palette", [])
        ])

        beauty_palette = "\n".join([
            f"- **{c.get('category', 'Accent')}**: {c.get('name')} (`{c.get('hex')}`)"
            for c in skin.get("color_palette", [])
        ])

        garments = "\n".join([f"- {g}" for g in apparel.get("key_garments", [])])
        styling_tips = "\n".join([f"- {t}" for t in apparel.get("styling_tips", [])])
        products = ", ".join(hair.get("recommended_products", []))
        acc_list = ", ".join(footwear.get("accessories_list", []))

        doc = f"""# AVYORAMEM.AI | HAUTE PERSONAL STYLING DOSSIER
**Client Visual Blueprint & Curated Head-to-Toe Aesthetic Architecture**
*Generated: {timestamp}*

---

## 1. CLIENT BIOMETRIC & CHROMATIC PROFILE
- **Skin Tone Classification**: {profile.get('skin_tone_name')} (`{profile.get('skin_tone_hex')}`)
- **Fitzpatrick Phototype**: {profile.get('fitzpatrick_scale', 'N/A')}
- **Chromatic Undertone**: {profile.get('undertone')}
  > {profile.get('undertone_details')}
- **Facial Morphology**: {profile.get('face_shape')}
  > {profile.get('face_shape_details')}
- **Silhouette Archetype**: {profile.get('body_silhouette')}
  > {profile.get('body_silhouette_details')}
- **Luminance Contrast**: {profile.get('contrast_ratio')}
- **Editorial Style Persona**: {profile.get('style_persona')}
- **Occasion / Vibe Context**: "{query}" | **Gender Expression**: {gender}

---

## 2. APPAREL & OUTFIT ARCHITECTURE
### {apparel.get('headline')}
**Silhouette Concept**: {apparel.get('silhouette')}

#### Curated Garments & Layering:
{garments}

#### 60-30-10 Color Harmonization:
{apparel_palette}

#### Tactile Fabric Textures:
{", ".join(apparel.get('textures', []))}

#### Editorial Rationale:
{apparel.get('rationale')}

#### Master Stylist Tips:
{styling_tips}

---

## 3. FOOTWEAR & ARTISANAL ACCENTS
### {footwear.get('headline')}
- **Footwear**: {footwear.get('footwear', {}).get('name')} ({footwear.get('footwear', {}).get('material')}) in {footwear.get('footwear', {}).get('color')} (`{footwear.get('footwear', {}).get('hex')}`)
- **Jewelry & Metals**: {footwear.get('jewelry_metals', {}).get('tone')}
  > *Rationale*: {footwear.get('jewelry_metals', {}).get('rationale')}
- **Structural Carry / Bag**: {footwear.get('bag', {}).get('name')} ({footwear.get('bag', {}).get('material')})
- **Eyewear Geometry**: {footwear.get('eyewear', {}).get('shape')} ({footwear.get('eyewear', {}).get('finish')})
  > *Face Balance*: {footwear.get('eyewear', {}).get('rationale')}
- **Curated Accents**: {acc_list}

---

## 4. HAIRSTYLING & GROOMING GEOMETRY
### {hair.get('headline')}
- **Cut & Silhouette**: {hair.get('cut_style')}
- **Geometric Balance**: {hair.get('geometry_rationale')}
- **Styling & Volume Protocol**: {hair.get('texture_styling')}
- **Facial Grooming**: {hair.get('facial_grooming')}
- **Formulation Kit**: {products}

---

## 5. COMPLEXION & BEAUTY PALETTE
### {skin.get('headline')}
- **Finish Formulation**: {skin.get('finish_type')}
- **Canvas Preparation**: {skin.get('complexion_prep')}
- **Harmonized Makeup Palette**:
{beauty_palette}
- **Facial Sculpting & Highlighting Roadmap**:
  {skin.get('contouring_roadmap')}
- **Targeted Skincare Directive**:
  {skin.get('skincare_tips')}

---
*AVYORAMEM.AI — Automated High-Fashion Intelligence System. All rights reserved.*
"""
        return doc

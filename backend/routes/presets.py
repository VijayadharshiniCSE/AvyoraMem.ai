from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import Dict, Any, List
from services.blueprint_generator import BlueprintGenerator

router = APIRouter()

class ExportBlueprintRequest(BaseModel):
    visual_profile: Dict[str, Any]
    styling: Dict[str, Any]
    query: str
    gender: str

@router.get("/presets")
async def get_presets():
    """
    Returns curated fashion-forward persona presets for immediate 1-click evaluation.
    """
    return {
        "presets": [
            {
                "id": "womens_outfit",
                "name": "Women's Haute Neutral",
                "gender": "Women",
                "query": "Architectural Neutral Tweed Cropped Blazer & Wide-Leg Trousers",
                "tagline": "Refined Oatmeal Monochrome, Pleated Silhouettes & Tonal Accessories",
                "avatar_color": "#D4C5B3",
                "skin_sample_hex": "#E8D8C8",
                "face_shape": "Oval",
                "accent_color": "#D4AF37",
                "image_url": "/images/sessions/womens_outfit.png",
                "session_type": "Womens Outfit Session"
            },
            {
                "id": "mens_outfit",
                "name": "Men's Safari Linen",
                "gender": "Men",
                "query": "Relaxed Sand Linen Camp Shirt, Cognac Leather & Fedora",
                "tagline": "Understated Safari Utilitarianism, Suede Loafers & Rich Patina",
                "avatar_color": "#C4B299",
                "skin_sample_hex": "#D2BBA0",
                "face_shape": "Square",
                "accent_color": "#A0522D",
                "image_url": "/images/sessions/mens_outfit.png",
                "session_type": "Mens Outfit Session"
            },
            {
                "id": "makeup_session",
                "name": "Haute Magenta Glam",
                "gender": "Women",
                "query": "Velvet Sculpted Fuchsia Lip & Draped Cheekbone Contour",
                "tagline": "Radiant Dewy Complexion, Smokey Halo & Bold Editorial Lip",
                "avatar_color": "#D81B60",
                "skin_sample_hex": "#FADBD8",
                "face_shape": "Heart",
                "accent_color": "#E91E63",
                "image_url": "/images/sessions/makeup_session.png",
                "session_type": "Makeup Session"
            },
            {
                "id": "footwear_session",
                "name": "Parisian Pop Footwear",
                "gender": "All-Inclusive",
                "query": "Scarlet Architectural Leather Mules & Chartreuse Tailoring",
                "tagline": "Playful Low-Block Slip-On Mules & Complementary Handbag",
                "avatar_color": "#E53935",
                "skin_sample_hex": "#F5CBA7",
                "face_shape": "Round",
                "accent_color": "#43A047",
                "image_url": "/images/sessions/footwear_session.png",
                "session_type": "Footwear Session"
            },
            {
                "id": "eyemakeup_coolers",
                "name": "Vintage Coolers & Eyes",
                "gender": "All-Inclusive",
                "query": "Ivory Butterfly Coolers & Amber Cut-Crease Eye Makeup",
                "tagline": "60s Oversized Acetate Frames & Sculpted Winged Shadow",
                "avatar_color": "#FAF0E6",
                "skin_sample_hex": "#EDBB99",
                "face_shape": "Diamond",
                "accent_color": "#D4AF37",
                "image_url": "/images/sessions/eyemakeup_coolers.png",
                "session_type": "Eye Makeup & Coolers Suggestion"
            },
            {
                "id": "julian_cyber",
                "name": "Julian Vance",
                "gender": "Non-Binary / Fluid",
                "query": "Neo-Cyber Tokyo Runway & Noir Nightlife",
                "tagline": "Sharp Avant-Garde & High-Tech Obsidian Silhouettes",
                "avatar_color": "#20222B",
                "skin_sample_hex": "#BE9479",
                "face_shape": "Diamond",
                "accent_color": "#00F0FF"
            },
            {
                "id": "elena_gala",
                "name": "Elena Rostova",
                "gender": "Women",
                "query": "Milanese Black-Tie Silk Gala & Opera Opening",
                "tagline": "Architectural Draping & Old-World Monolithic Glamour",
                "avatar_color": "#2C1A1D",
                "skin_sample_hex": "#F4D8CD",
                "face_shape": "Oval",
                "accent_color": "#D4AF37"
            },
            {
                "id": "kenzo_minimalist",
                "name": "Kenzo Takahashi",
                "gender": "Men",
                "query": "Minimalist Tech Executive & Architectural Tailoring",
                "tagline": "Understated Luxury Cashmere & Clean Linear Cuts",
                "avatar_color": "#1C1F26",
                "skin_sample_hex": "#C9A788",
                "face_shape": "Square",
                "accent_color": "#708090"
            },
            {
                "id": "maya_resort",
                "name": "Maya Al-Mansoor",
                "gender": "Women",
                "query": "Mediterranean Riviera Sunlit Yacht & Twilight Cocktail",
                "tagline": "Airy Washed Linens & Sunkissed Terracotta Elegance",
                "avatar_color": "#2E241F",
                "skin_sample_hex": "#8C583E",
                "face_shape": "Heart",
                "accent_color": "#E67E22"
            }
        ],
        "quick_queries": [
            "Paris Fashion Week Haute Couture Gala",
            "Neo-Cyber Tokyo Runway & Noir Nightlife",
            "Minimalist Tech Executive & Boardroom Keynote",
            "Mediterranean Riviera Resort & Linen Sunset Cocktail",
            "Berlin Underground Techno & Deconstructed Streetwear",
            "Autumn Cotswolds Countryside Tweed & Cashmere Layering"
        ]
    }

@router.post("/export-blueprint")
async def export_blueprint(payload: ExportBlueprintRequest):
    """
    Exports full AvyoraMem styling blueprint as formatted markdown text.
    """
    try:
        md = BlueprintGenerator.generate_markdown_blueprint(
            profile=payload.visual_profile,
            styling=payload.styling,
            query=payload.query,
            gender=payload.gender
        )
        return PlainTextResponse(content=md, media_type="text/markdown")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blueprint export error: {str(e)}")

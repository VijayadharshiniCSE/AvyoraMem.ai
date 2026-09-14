from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from pathlib import Path
from services.vision_analyzer import VisionAnalyzer
from services.styling_engine import StylingEngine
from config import settings

router = APIRouter()

@router.post("/analyze")
async def analyze_styling(
    file: Optional[UploadFile] = File(None),
    preset_id: Optional[str] = Form(None),
    query: Optional[str] = Form("Paris Fashion Week Gala & Modern Elegance"),
    gender: Optional[str] = Form("All-Inclusive")
):
    """
    Accepts multipart form-data image upload (or preset ID), extracts biometric and chromatic
    attributes with computer vision, and synthesizes an all-in-one head-to-toe styling dossier.
    """
    image_bytes = None

    if file:
        ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
        if ext and ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported format '.{ext}'. Supported formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
        image_bytes = await file.read()
        if len(image_bytes) > settings.MAX_IMAGE_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image size exceeds maximum 15MB limit.")
    elif preset_id:
        # Load preset image from static presets or sessions if available
        preset_file = settings.PRESETS_DIR / f"{preset_id}.jpg"
        if not preset_file.exists():
            preset_file = settings.STATIC_DIR / "sessions" / f"{preset_id}.png"
        if preset_file.exists():
            image_bytes = preset_file.read_bytes()

    # Fallback to standard high-resolution baseline sample if no file or preset image
    if not image_bytes:
        # Create a clean RGB swatch synthetic image or fallback
        from PIL import Image
        import io
        img = Image.new("RGB", (600, 800), color=(198, 150, 118))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        image_bytes = buf.getvalue()

    try:
        # Step 1: Computer Vision Extraction
        visual_profile = VisionAnalyzer.analyze_image_bytes(image_bytes)

        # Step 2: Styling Engine Synthesis
        styling = StylingEngine.generate_recommendations(
            visual_profile=visual_profile,
            query=query,
            gender_expression=gender,
            image_bytes=image_bytes
        )

        return {
            "success": True,
            "visual_profile": visual_profile,
            "styling": styling,
            "query": query,
            "gender": gender
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")

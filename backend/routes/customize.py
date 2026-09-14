from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.styling_engine import StylingEngine

router = APIRouter()

class CustomizationRequest(BaseModel):
    current_styling: Dict[str, Any]
    category: str # "apparel", "footwear_accessories", "hair_grooming", "skincare_makeup"
    instruction: str # e.g. "Suggest leather sneakers instead"
    visual_profile: Dict[str, Any]
    gender_expression: Optional[str] = "All-Inclusive"

@router.post("/customize")
async def customize_category(payload: CustomizationRequest):
    """
    Swaps or customizes a specific category in real-time according to user instructions.
    """
    try:
        updated_styling = StylingEngine.customize_category(
            current_data=payload.current_styling,
            category=payload.category,
            instruction=payload.instruction,
            visual_profile=payload.visual_profile,
            gender_expression=payload.gender_expression
        )
        return {
            "success": True,
            "category": payload.category,
            "instruction": payload.instruction,
            "updated_styling": updated_styling
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Customization error: {str(e)}")

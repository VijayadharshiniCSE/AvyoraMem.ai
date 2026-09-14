import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import settings
from routes.analyze import router as analyze_router
from routes.customize import router as customize_router
from routes.presets import router as presets_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="All-in-One Gender-Inclusive AI Personal Styling and Beauty Ecosystem"
)

# Enable CORS for frontend Vite dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analyze_router, prefix=settings.API_PREFIX, tags=["Analysis Engine"])
app.include_router(customize_router, prefix=settings.API_PREFIX, tags=["Customization"])
app.include_router(presets_router, prefix=settings.API_PREFIX, tags=["Presets & Export"])

# Serve static directory
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "gemini_active": bool(settings.GEMINI_API_KEY),
        "model": settings.GEMINI_MODEL if settings.GEMINI_API_KEY else "algorithmic-fashion-matrix"
    }

# Check if built frontend exists (Unified Render/production deployment)
from pathlib import Path
from fastapi.responses import FileResponse

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")

    # SPA catch-all for direct URL refreshes
    @app.exception_handler(404)
    async def not_found_spa_handler(request, exc):
        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"detail": "Not Found"}
else:
    @app.get("/")
    async def root():
        return {
            "status": "online",
            "service": settings.APP_NAME,
            "version": settings.VERSION,
            "docs_url": "/docs",
            "vision_ai_ready": True,
            "gemini_enabled": bool(settings.GEMINI_API_KEY)
        }

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=False)

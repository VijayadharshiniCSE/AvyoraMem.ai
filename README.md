# AvyoraMem.ai ✨
### Haute AI Personal Styling & Chromatic Beauty Intelligence Maison

AvyoraMem.ai is an editorial-grade, gender-inclusive AI personal styling maison. By combining computer vision, facial geometry analysis, and chromatic undertone extraction with high-concept fashion heuristics, AvyoraMem synthesizes bespoke head-to-toe styling dossiers tailored to each individual's unique biometrics and style aspirations.

---

## ✨ Key Features

- **📸 Multi-Modal Biometric Ingestion & Instant Webcam Selfie**
  - Instant live webcam portrait capture or high-res image drag-and-drop.
  - Computer vision extracts skin tone HEX, ITA (Individual Typology Angle), Fitzpatrick scale, chromatic undertone, facial geometry, and body tailoring archetypes.
  - 5 pre-configured 1-click visual sessions (*Women's Couture Capsule*, *Men's Safari Heritage*, *Runway Chroma Makeup*, *Parisian Pop Footwear*, *Vintage Coolers*).

- **👗 "Styled On You" Virtual Try-On & Outfit Simulation**
  - Visual fitting room showing the user wearing the complete head-to-toe ensemble.
  - **3 Switchable Look Variations**:
    1. *Signature Haute Capsule* (Structured primary silhouette)
    2. *Contemporary Riviera Drapery* (Relaxed fluid luxury)
    3. *Gala & Evening Architecture* (High-contrast tailored evening wear)
  - **Interactive Garment Hotspots**: Tap or hover on figure pins (Outerwear, Trousers, Footwear, Metals) to inspect fabrics, finishes, and swatches.
  - **Before / After Toggle**: Instant comparison between raw input portrait and the virtual try-on simulation.

- **📥 High-Resolution Final Outfit Image Exporter (PNG)**
  - 1-click export of a magazine-grade **1200 × 1600 px** editorial lookbook card.
  - Complete with framed user portrait, itemized garment breakdown, 60-30-10 chromatic palette swatches with HEX codes, biometric harmony badge, and lead stylist directives to save before dressing.

- **✨ Twinkling Stardust Cursor Movement Trail**
  - Fluid 60fps canvas-based particle trail emitting luxury gold (`#D4AF37`) and diamond white (`#FFFFFF`) star glints on pointer movement.
  - Lightweight, non-intrusive, automatically throttled during idle periods, and disabled on touch devices.

- **🎨 4-Pillar Couture Harmonization Matrix**
  1. *Apparel & Silhouette*: Tailored cuts, fabric textures, and 60-30-10 color balance.
  2. *Footwear, Leather & Metals*: Footwear foundation, metal harmonization (gold/silver/rose), eyewear geometry, and bags.
  3. *Hair Geometry & Facial Grooming*: Architectural cut guidance and texture treatments.
  4. *Skincare & Chromatic Makeup*: Complexion preparation, finish types, and contouring roadmaps.

- **🌐 10-Language Internationalization (i18n)**
  - English, Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Malayalam (മലയാളം), French (Français), Spanish (Español), Japanese (日本語), and Arabic (العربية with full RTL layout).

- **🌓 Obsidian Luxury Dark & Light Themes**
  - Bespoke obsidian palette (`#06070a`) with champagne gold gradients, glassmorphism panels, and high-contrast editorial typography.

---

## 🏛️ Architecture & Tech Stack

```
AvyoraMem.ai/
├── frontend/                   # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/      # VirtualTryOnSection, LookbookGrid, CategoryCard, etc.
│   │   │   ├── HeroIngestion   # Selfie webcam & file upload zone
│   │   │   ├── TwinkleCursor   # 60fps luxury star particle canvas overlay
│   │   │   ├── Navbar, Footer, LoadingAnimation
│   │   ├── services/
│   │   │   ├── api.ts          # Axios API client
│   │   │   └── outfitImageExporter.ts # 1200x1600 Canvas PNG lookbook exporter
│   │   ├── context/            # Theme & Language state
│   │   ├── i18n/               # 10-language translations
│   │   └── types/              # TypeScript interfaces
├── backend/                    # FastAPI + Python
│   ├── routes/                 # /api/analyze, /api/customize, /api/presets
│   ├── services/
│   │   ├── vision_analyzer.py  # OpenCV / PIL biometric & chromatic extraction
│   │   ├── styling_engine.py   # Algorithmic fashion matrix + Gemini Multimodal
│   │   └── blueprint_generator.py # Markdown styling dossier compiler
│   └── static/                 # Presets & session assets
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Copy .env.example to .env to add a Google Gemini API Key
cp .env.example .env

# Start FastAPI server (runs on http://127.0.0.1:8000)
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 🧪 Production Build

```bash
cd frontend
npm run build
```

The compiled bundle will be output to `frontend/dist/`.

---

## 📜 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check & model status |
| `GET` | `/api/presets` | Retrieve curated avatars & quick occasion queries |
| `POST` | `/api/analyze` | Biometric analysis & head-to-toe styling synthesis |
| `POST` | `/api/customize` | Interactive on-the-fly category swap & refinement |
| `POST` | `/api/export-blueprint` | Compile markdown styling dossier for export |

---

## 💎 License

Created for confidential editorial AI styling by AvyoraMem.ai. All rights reserved.

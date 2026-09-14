import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Download, 
  RotateCcw, 
  Dices, 
  Check, 
  Shirt, 
  Footprints, 
  Gem, 
  Sun, 
  Moon, 
  Sliders, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Camera,
  Heart,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomMakeoverState, export4KMakeoverPoster } from '../../services/glamour4kExporter';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface GlamourStudioGameProps {
  isOpen: boolean;
  onClose: () => void;
  userImageUrl?: string | null;
  gender?: string;
  initialQuery?: string;
}

// Curated Cosmetics
const LIP_SHADES = [
  { id: 'ruby', name: 'Velvet Ruby', hex: '#9E1B32', vibe: 'Bold Classic' },
  { id: 'cashmere', name: 'Rose Cashmere', hex: '#C47A7A', vibe: 'Romantic Nude' },
  { id: 'coral', name: 'Sunset Coral', hex: '#E06D53', vibe: 'Warm Radiance' },
  { id: 'merlot', name: 'Merlot Noir', hex: '#501524', vibe: 'High Drama' },
  { id: 'goldnude', name: 'Champagne Nude', hex: '#C99A6E', vibe: 'Quiet Luxury' },
  { id: 'fuchsia', name: 'Fuchsia Chroma', hex: '#D62286', vibe: 'Runway Pop' },
];

const BLUSH_SHADES = [
  { id: 'peachy', name: 'Peachy Radiance', hex: '#E8927C' },
  { id: 'terracotta', name: 'Sun-Kissed Terracotta', hex: '#C26343' },
  { id: 'petal', name: 'Petal Rosé', hex: '#D87D8E' },
  { id: 'bronze', name: 'Bronze Draping', hex: '#A75A38' },
];

const EYESHADOW_SHADES = [
  { id: 'champagne', name: 'Champagne Glint', hex: '#E5C38B' },
  { id: 'smokey', name: 'Smokey Onyx', hex: '#2C2F38' },
  { id: 'amber', name: 'Amber Bronze', hex: '#B87333' },
  { id: 'emerald', name: 'Emerald Velvet', hex: '#1B4D3E' },
];

// Curated Wardrobe Tops
const WARDROBE_TOPS = [
  { id: 'tweed_blazer', name: 'Architectural Tweed Cropped Blazer', category: 'Blazer & Outerwear' },
  { id: 'silk_shirt', name: 'Fluid Silk Camp Shirt & Draped Lapel', category: 'Silk Top' },
  { id: 'velvet_tux', name: 'Sculpted Velvet Evening Tuxedo', category: 'Evening Tailoring' },
  { id: 'cashmere_knit', name: 'Ribbed Minimalist Cashmere Knit', category: 'Knitwear' },
  { id: 'satin_corset', name: 'Asymmetrical Satin Slip Corset', category: 'Haute Top' },
];

// Curated Wardrobe Bottoms
const WARDROBE_BOTTOMS = [
  { id: 'wide_trousers', name: 'High-Waisted Wide-Leg Trousers', category: 'Tailored Trouser' },
  { id: 'satin_skirt', name: 'Satin Bias-Cut Fluid Midi Skirt', category: 'Silk Skirt' },
  { id: 'column_pants', name: 'Architectural Column Cigarette Pants', category: 'Pants' },
  { id: 'flared_culottes', name: 'High-Waisted Pleated Culottes', category: 'Culottes' },
];

// Curated Footwear
const FOOTWEAR_COLLECTION = [
  { id: 'scarlet_mules', name: 'Scarlet Architectural Pointed Mules', material: 'Italian Patent Leather', defaultColor: '#8A1422', colorName: 'Scarlet Noir' },
  { id: 'strappy_sandals', name: 'Minimalist Strappy Stiletto Sandals', material: 'Metallic Nappa', defaultColor: '#D4AF37', colorName: 'Champagne Gold' },
  { id: 'lug_loafers', name: 'Chunky Lug-Sole Polished Loafers', material: 'Polished Box Calf', defaultColor: '#1A1C23', colorName: 'Obsidian Noir' },
  { id: 'suede_boots', name: 'Sculpted Draped Ankle Boots', material: 'Velvet Calf Suede', defaultColor: '#8C6D53', colorName: 'Cognac Espresso' },
];

// Curated Accessories
const JEWELRY_OPTIONS = [
  { id: 'gold_chain', name: 'Chunky Herringbone Chain', tone: '18k Warm Gold' },
  { id: 'diamond_choker', name: 'Tennis Solitaire Choker', tone: 'Platinum Diamond' },
  { id: 'pearl_drops', name: 'Baroque Freshwater Pearl Drops', tone: 'Lustrous Ivory' },
];

const EYEWEAR_OPTIONS = [
  { id: 'butterfly', name: 'Vintage Butterfly Cat-Eye Coolers' },
  { id: 'aviator', name: 'Wire-Rim Architectural Aviators' },
  { id: 'rectangle', name: 'Minimalist 90s Rectangular Shades' },
  { id: 'none', name: 'No Eyewear (Bare Eye Makeup)' },
];

const BAG_OPTIONS = [
  { id: 'minaudiere', name: 'Sculptural Brass Minaudière Clutch', color: 'Gold' },
  { id: 'crossbody', name: 'Quilted Chain Structured Crossbody', color: 'Noir' },
  { id: 'tote', name: 'Architectural Box Leather Carry', color: 'Cognac' },
];

// Color Swatches for Garment Customization
const FABRIC_SWATCHES = [
  { name: 'Obsidian Noir', hex: '#11141C' },
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Ivory Cream', hex: '#F5F2EB' },
  { name: 'Emerald Jewel', hex: '#0E4A35' },
  { name: 'Scarlet Crimson', hex: '#8A1422' },
  { name: 'Midnight Navy', hex: '#152238' },
];

export const GlamourStudioGame: React.FC<GlamourStudioGameProps> = ({
  isOpen,
  onClose,
  userImageUrl,
  gender = 'Women',
  initialQuery = 'Night Out & Gala',
}) => {
  const { t } = useThemeLanguage();

  // Active Game Drawer Tab
  const [activeTab, setActiveTab] = useState<'makeup' | 'tops' | 'bottoms' | 'shoes' | 'accessories'>('makeup');
  const [lightingMode, setLightingMode] = useState<'studio' | 'golden' | 'midnight'>('studio');

  // Makeup State
  const [selectedLip, setSelectedLip] = useState(LIP_SHADES[0]);
  const [lipFinish, setLipFinish] = useState<'matte' | 'gloss' | 'satin'>('gloss');
  const [lipIntensity, setLipIntensity] = useState<number>(85);
  const [selectedBlush, setSelectedBlush] = useState(BLUSH_SHADES[0]);
  const [blushIntensity, setBlushIntensity] = useState<number>(65);
  const [selectedEyeshadow, setSelectedEyeshadow] = useState(EYESHADOW_SHADES[0]);
  const [skinGlow, setSkinGlow] = useState<'glass' | 'velvet' | 'bronze'>('glass');

  // Wardrobe State
  const [selectedTop, setSelectedTop] = useState(WARDROBE_TOPS[0]);
  const [topColor, setTopColor] = useState(FABRIC_SWATCHES[0]);
  const [selectedBottom, setSelectedBottom] = useState(WARDROBE_BOTTOMS[0]);
  const [bottomColor, setBottomColor] = useState(FABRIC_SWATCHES[0]);

  // Footwear & Accessories State
  const [selectedFootwear, setSelectedFootwear] = useState(FOOTWEAR_COLLECTION[0]);
  const [selectedJewelry, setSelectedJewelry] = useState(JEWELRY_OPTIONS[0]);
  const [selectedEyewear, setSelectedEyewear] = useState(EYEWEAR_OPTIONS[0]);
  const [selectedBag, setSelectedBag] = useState(BAG_OPTIONS[0]);

  // Download state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastScore, setLastScore] = useState<number>(92);

  const fallbackSessionImage = gender === 'Men' ? '/images/sessions/mens_outfit.png' : '/images/sessions/womens_outfit.png';
  const displayImage = userImageUrl || fallbackSessionImage;

  // Dynamic Style Harmony & Glamour Score Algorithm
  const calculateHarmonyScore = (): number => {
    let score = 70;

    // Bonus for matching or complementary colors
    if (topColor.name === bottomColor.name) score += 8; // Tonal ensemble
    if (topColor.hex === '#11141C' || topColor.hex === '#F5F2EB') score += 5; // Neutral base versatility
    if (selectedLip.id === 'ruby' && (topColor.name === 'Obsidian Noir' || topColor.name === 'Ivory Cream')) score += 8;
    if (selectedLip.id === 'goldnude' && (topColor.name === 'Champagne Gold' || skinGlow === 'bronze')) score += 7;
    if (selectedJewelry.tone.includes('Gold') && (topColor.name === 'Champagne Gold' || topColor.name === 'Emerald Jewel')) score += 6;
    if (lipIntensity >= 60 && lipIntensity <= 90) score += 4; // Optimal blend
    if (blushIntensity >= 50 && blushIntensity <= 80) score += 4;

    return Math.min(score, 99);
  };

  const harmonyScore = calculateHarmonyScore();

  // Trigger celebration confetti when reaching 95+
  useEffect(() => {
    if (harmonyScore >= 95 && lastScore < 95) {
      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FFF6D6', '#FFFFFF'],
        });
      } catch (e) {
        // ignore
      }
    }
    setLastScore(harmonyScore);
  }, [harmonyScore, lastScore]);

  // AI Surprise Me (Randomizer)
  const handleRandomize = () => {
    setSelectedLip(LIP_SHADES[Math.floor(Math.random() * LIP_SHADES.length)]);
    setLipFinish(['matte', 'gloss', 'satin'][Math.floor(Math.random() * 3)] as any);
    setSelectedBlush(BLUSH_SHADES[Math.floor(Math.random() * BLUSH_SHADES.length)]);
    setSelectedEyeshadow(EYESHADOW_SHADES[Math.floor(Math.random() * EYESHADOW_SHADES.length)]);
    setSelectedTop(WARDROBE_TOPS[Math.floor(Math.random() * WARDROBE_TOPS.length)]);
    setTopColor(FABRIC_SWATCHES[Math.floor(Math.random() * FABRIC_SWATCHES.length)]);
    setSelectedBottom(WARDROBE_BOTTOMS[Math.floor(Math.random() * WARDROBE_BOTTOMS.length)]);
    setBottomColor(FABRIC_SWATCHES[Math.floor(Math.random() * FABRIC_SWATCHES.length)]);
    setSelectedFootwear(FOOTWEAR_COLLECTION[Math.floor(Math.random() * FOOTWEAR_COLLECTION.length)]);
    setSelectedJewelry(JEWELRY_OPTIONS[Math.floor(Math.random() * JEWELRY_OPTIONS.length)]);
    setLightingMode(['studio', 'golden', 'midnight'][Math.floor(Math.random() * 3)] as any);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#E5E4E2', '#FFFFFF'],
      });
    } catch (e) {}
  };

  // Reset to Baseline
  const handleReset = () => {
    setSelectedLip(LIP_SHADES[0]);
    setLipFinish('gloss');
    setLipIntensity(85);
    setSelectedBlush(BLUSH_SHADES[0]);
    setBlushIntensity(65);
    setSelectedEyeshadow(EYESHADOW_SHADES[0]);
    setSkinGlow('glass');
    setSelectedTop(WARDROBE_TOPS[0]);
    setTopColor(FABRIC_SWATCHES[0]);
    setSelectedBottom(WARDROBE_BOTTOMS[0]);
    setBottomColor(FABRIC_SWATCHES[0]);
    setSelectedFootwear(FOOTWEAR_COLLECTION[0]);
    setSelectedJewelry(JEWELRY_OPTIONS[0]);
    setLightingMode('studio');
  };

  // 4K Export Handler
  const handleDownload4K = async () => {
    setIsExporting(true);
    try {
      const makeoverState: CustomMakeoverState = {
        lipColor: selectedLip.hex,
        lipName: selectedLip.name,
        lipFinish,
        lipIntensity,
        blushColor: selectedBlush.hex,
        blushName: selectedBlush.name,
        blushIntensity,
        eyeshadowColor: selectedEyeshadow.hex,
        eyeshadowName: selectedEyeshadow.name,
        skinGlow,
        outfitTop: {
          id: selectedTop.id,
          name: selectedTop.name,
          category: selectedTop.category,
          color: topColor.hex,
          colorName: topColor.name,
        },
        outfitBottom: {
          id: selectedBottom.id,
          name: selectedBottom.name,
          category: selectedBottom.category,
          color: bottomColor.hex,
          colorName: bottomColor.name,
        },
        footwear: {
          id: selectedFootwear.id,
          name: selectedFootwear.name,
          material: selectedFootwear.material,
          color: selectedFootwear.defaultColor,
          colorName: selectedFootwear.colorName,
        },
        accessories: {
          jewelry: {
            id: selectedJewelry.id,
            name: selectedJewelry.name,
            tone: selectedJewelry.tone,
          },
          eyewear: {
            id: selectedEyewear.id,
            name: selectedEyewear.name,
          },
          bag: {
            id: selectedBag.id,
            name: selectedBag.name,
            color: selectedBag.color,
          },
        },
        harmonyScore,
        lightingMode,
      };

      await export4KMakeoverPoster({
        userImageUrl: displayImage,
        state: makeoverState,
        occasion: initialQuery,
      });
    } catch (err) {
      console.error('4K export error:', err);
      alert('Could not export 4K makeover poster.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-7xl h-[94vh] rounded-3xl bg-obsidian-950 border border-gold-500/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Game Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-obsidian-900/90">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                  4K Glamour Studio &amp; Fitting Game
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-[10px] font-mono text-gold-300 uppercase">
                  Before Stepping Out
                </span>
              </div>
              <p className="text-xs text-platinum-400">
                Manually apply custom makeup, equip garments, and test your head-to-toe look.
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-gold-400 border border-gold-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              title="AI Stylist Surprise Roll"
            >
              <Dices className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-platinum-300 border border-white/10 text-xs transition-colors"
              title="Reset to Baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={handleDownload4K}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs shadow-lg shadow-gold-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
            >
              {isExporting ? (
                <span>Rendering 4K...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 4K Poster</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-platinum-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Workspace Split (Left: 4K Avatar Runway | Right: Interactive Customizer Drawer) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: 4K Live Avatar Stage (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-white/10 relative bg-gradient-to-b from-obsidian-900/60 to-obsidian-950 overflow-y-auto">
            {/* Top Lighting Controls & Harmony Score Badge */}
            <div className="w-full flex items-center justify-between gap-2 mb-3">
              {/* Lighting Mode Selector */}
              <div className="flex items-center bg-obsidian-850 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
                <button
                  onClick={() => setLightingMode('studio')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lightingMode === 'studio' ? 'bg-gold-500 text-obsidian-950 font-bold shadow' : 'text-platinum-400 hover:text-white'
                  }`}
                >
                  4K Studio
                </button>
                <button
                  onClick={() => setLightingMode('golden')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    lightingMode === 'golden' ? 'bg-gold-500 text-obsidian-950 font-bold shadow' : 'text-platinum-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  Golden
                </button>
                <button
                  onClick={() => setLightingMode('midnight')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    lightingMode === 'midnight' ? 'bg-gold-500 text-obsidian-950 font-bold shadow' : 'text-platinum-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  Midnight
                </button>
              </div>

              {/* Dynamic Harmony Score Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-300 font-mono text-xs shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span className="font-bold">{harmonyScore}/100</span>
                <span className="hidden sm:inline text-[10px] text-platinum-400">Harmony</span>
              </div>
            </div>

            {/* 4K Central Runway Canvas Box */}
            <div className="relative w-full max-w-sm h-[380px] sm:h-[450px] rounded-3xl overflow-hidden border-2 border-gold-500/50 shadow-2xl bg-black group flex items-center justify-center">
              {/* Base User Portrait */}
              <img
                src={displayImage}
                alt="4K Avatar Makeover Canvas"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Real-time Dynamic Cosmetics & Lighting Filter Layers */}
              {/* 1. Lip Tint Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(circle at 50% 60%, ${selectedLip.hex}${Math.round((lipIntensity / 100) * 85).toString(16).padStart(2, '0')} 0%, transparent 25%)`,
                  mixBlendMode: lipFinish === 'gloss' ? 'color' : 'multiply',
                }}
              />

              {/* 2. Cheek Blush Tint Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(circle at 35% 52%, ${selectedBlush.hex}${Math.round((blushIntensity / 100) * 60).toString(16).padStart(2, '0')} 0%, transparent 22%), radial-gradient(circle at 65% 52%, ${selectedBlush.hex}${Math.round((blushIntensity / 100) * 60).toString(16).padStart(2, '0')} 0%, transparent 22%)`,
                  mixBlendMode: 'soft-light',
                }}
              />

              {/* 3. Skin Radiance Glow Filter */}
              <div
                className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
                  skinGlow === 'glass'
                    ? 'backdrop-brightness-105 backdrop-contrast-105'
                    : skinGlow === 'bronze'
                    ? 'bg-amber-500/10 mix-blend-color-burn'
                    : 'backdrop-contrast-95'
                }`}
              />

              {/* 4. Ambient Lighting Filter */}
              {lightingMode === 'golden' && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-amber-600/20 via-yellow-500/10 to-transparent mix-blend-screen" />
              )}
              {lightingMode === 'midnight' && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-900/20 via-purple-900/15 to-black/40 mix-blend-multiply" />
              )}

              {/* Dynamic Bottom Floating Outfit Tag */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: topColor.hex }} />
                    <span className="text-[11px] font-bold text-white truncate block">
                      {selectedTop.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-platinum-400 truncate">
                    {selectedLip.name} ({lipFinish}) • {selectedFootwear.name}
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-gold-500/20 text-[10px] font-mono text-gold-300 flex-shrink-0">
                  Fitted ✓
                </span>
              </div>
            </div>

            {/* Step-Out Progress Checklist Bar */}
            <div className="w-full mt-3 p-3 rounded-2xl bg-obsidian-850 border border-white/5 space-y-1.5">
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block">
                Before You Step Out Checklist
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Lip &amp; Blush Blended
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Silhouette Equipped
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Footwear Paired
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Jewelry Harmonized
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Drawer Game (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-obsidian-900/40 overflow-y-auto">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 overflow-x-auto">
              <button
                onClick={() => setActiveTab('makeup')}
                className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'makeup' ? 'border-gold-500 text-gold-400' : 'border-transparent text-platinum-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>💄 Makeup Studio</span>
              </button>

              <button
                onClick={() => setActiveTab('tops')}
                className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'tops' ? 'border-gold-500 text-gold-400' : 'border-transparent text-platinum-400 hover:text-white'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>👗 Tops &amp; Blazers</span>
              </button>

              <button
                onClick={() => setActiveTab('bottoms')}
                className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'bottoms' ? 'border-gold-500 text-gold-400' : 'border-transparent text-platinum-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>👖 Bottoms &amp; Skirts</span>
              </button>

              <button
                onClick={() => setActiveTab('shoes')}
                className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'shoes' ? 'border-gold-500 text-gold-400' : 'border-transparent text-platinum-400 hover:text-white'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>👠 Footwear</span>
              </button>

              <button
                onClick={() => setActiveTab('accessories')}
                className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'accessories' ? 'border-gold-500 text-gold-400' : 'border-transparent text-platinum-400 hover:text-white'
                }`}
              >
                <Gem className="w-3.5 h-3.5" />
                <span>💍 Accessories</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* TAB 1: MAKEUP STUDIO */}
              {activeTab === 'makeup' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* 1. Lipstick Bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                        <span>1. Couture Lip Color</span>
                        <span className="text-white font-sans text-xs">({selectedLip.name})</span>
                      </label>
                      {/* Finish Toggles */}
                      <div className="flex items-center bg-obsidian-850 p-1 rounded-lg border border-white/10 text-[10px] font-mono">
                        {(['matte', 'gloss', 'satin'] as const).map((finish) => (
                          <button
                            key={finish}
                            onClick={() => setLipFinish(finish)}
                            className={`px-2 py-0.5 rounded capitalize ${
                              lipFinish === finish ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-platinum-400'
                            }`}
                          >
                            {finish}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lip Swatch Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {LIP_SHADES.map((shade) => {
                        const isSelected = selectedLip.id === shade.id;
                        return (
                          <button
                            key={shade.id}
                            onClick={() => setSelectedLip(shade)}
                            className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                              isSelected
                                ? 'border-gold-500 bg-gold-500/20 ring-2 ring-gold-500/40 scale-105'
                                : 'border-white/10 bg-obsidian-850 hover:border-gold-500/30'
                            }`}
                          >
                            <span
                              className="w-8 h-8 rounded-full border border-white/20 shadow-md"
                              style={{ backgroundColor: shade.hex }}
                            />
                            <span className="text-[10px] font-bold text-white truncate max-w-full">
                              {shade.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Lip Intensity Slider */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[10px] font-mono text-platinum-400">Pigment Intensity:</span>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={lipIntensity}
                        onChange={(e) => setLipIntensity(Number(e.target.value))}
                        className="flex-1 accent-gold-500 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-gold-400 w-8 text-right">{lipIntensity}%</span>
                    </div>
                  </div>

                  {/* 2. Blush & Cheekbone Draping */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-gold-400">
                        2. Blush &amp; Cheekbone Radiance ({selectedBlush.name})
                      </label>
                      <span className="text-[10px] text-platinum-400 font-mono">{blushIntensity}% Blend</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BLUSH_SHADES.map((shade) => {
                        const isSelected = selectedBlush.id === shade.id;
                        return (
                          <button
                            key={shade.id}
                            onClick={() => setSelectedBlush(shade)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                              isSelected
                                ? 'border-gold-500 bg-gold-500/20 ring-2 ring-gold-500/40'
                                : 'border-white/10 bg-obsidian-850 hover:border-gold-500/30'
                            }`}
                          >
                            <span
                              className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0"
                              style={{ backgroundColor: shade.hex }}
                            />
                            <span className="text-xs font-medium text-white truncate">{shade.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Blush slider */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[10px] font-mono text-platinum-400">Soft Blend Opacity:</span>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={blushIntensity}
                        onChange={(e) => setBlushIntensity(Number(e.target.value))}
                        className="flex-1 accent-gold-500 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-gold-400 w-8 text-right">{blushIntensity}%</span>
                    </div>
                  </div>

                  {/* 3. Eye Shadow & Skin Finish */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                        3. Eyeshadow Palette
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {EYESHADOW_SHADES.map((eye) => (
                          <button
                            key={eye.id}
                            onClick={() => setSelectedEyeshadow(eye)}
                            className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                              selectedEyeshadow.id === eye.id
                                ? 'border-gold-500 bg-gold-500/20'
                                : 'border-white/10 bg-obsidian-850'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md flex-shrink-0" style={{ backgroundColor: eye.hex }} />
                            <span className="text-[11px] text-white truncate">{eye.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                        4. 4K Skin Finish Filter
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'glass', label: 'Dewy Glass' },
                          { id: 'velvet', label: 'Velvet Matte' },
                          { id: 'bronze', label: 'Sun Bronze' },
                        ].map((g) => (
                          <button
                            key={g.id}
                            onClick={() => setSkinGlow(g.id as any)}
                            className={`p-2.5 rounded-xl border text-center transition-all text-xs font-medium ${
                              skinGlow === g.id
                                ? 'border-gold-500 bg-gold-500/20 text-white font-bold'
                                : 'border-white/10 bg-obsidian-850 text-platinum-400'
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TOPS & BLAZERS */}
              {activeTab === 'tops' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                      Select Upper Garment Architecture
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {WARDROBE_TOPS.map((top) => {
                        const isSelected = selectedTop.id === top.id;
                        return (
                          <button
                            key={top.id}
                            onClick={() => setSelectedTop(top)}
                            className={`p-3.5 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? 'border-gold-500 bg-gold-500/15 shadow-md shadow-gold-500/10'
                                : 'border-white/10 bg-obsidian-850 hover:border-gold-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white">{top.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                            </div>
                            <span className="text-[10px] text-gold-400 font-mono">{top.category}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recolor Upper Garment */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                      Custom Fabric Color ({topColor.name})
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {FABRIC_SWATCHES.map((swatch) => (
                        <button
                          key={swatch.name}
                          onClick={() => setTopColor(swatch)}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            topColor.name === swatch.name
                              ? 'border-gold-500 bg-gold-500/20 ring-2 ring-gold-500/40'
                              : 'border-white/10 bg-obsidian-850'
                          }`}
                        >
                          <span
                            className="w-7 h-7 rounded-lg border border-white/20 shadow-sm"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="text-[10px] text-white truncate max-w-full font-medium">
                            {swatch.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BOTTOMS & SKIRTS */}
              {activeTab === 'bottoms' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                      Select Lower Garment Silhouette
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {WARDROBE_BOTTOMS.map((bot) => {
                        const isSelected = selectedBottom.id === bot.id;
                        return (
                          <button
                            key={bot.id}
                            onClick={() => setSelectedBottom(bot)}
                            className={`p-3.5 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? 'border-gold-500 bg-gold-500/15 shadow-md shadow-gold-500/10'
                                : 'border-white/10 bg-obsidian-850 hover:border-gold-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white">{bot.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                            </div>
                            <span className="text-[10px] text-gold-400 font-mono">{bot.category}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recolor Lower Garment */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                      Custom Fabric Color ({bottomColor.name})
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {FABRIC_SWATCHES.map((swatch) => (
                        <button
                          key={swatch.name}
                          onClick={() => setBottomColor(swatch)}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            bottomColor.name === swatch.name
                              ? 'border-gold-500 bg-gold-500/20 ring-2 ring-gold-500/40'
                              : 'border-white/10 bg-obsidian-850'
                          }`}
                        >
                          <span
                            className="w-7 h-7 rounded-lg border border-white/20 shadow-sm"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="text-[10px] text-white truncate max-w-full font-medium">
                            {swatch.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FOOTWEAR */}
              {activeTab === 'shoes' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                    Choose Footwear Foundation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FOOTWEAR_COLLECTION.map((shoe) => {
                      const isSelected = selectedFootwear.id === shoe.id;
                      return (
                        <button
                          key={shoe.id}
                          onClick={() => setSelectedFootwear(shoe)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-gold-500 bg-gold-500/15 shadow-md shadow-gold-500/10'
                              : 'border-white/10 bg-obsidian-850 hover:border-gold-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-white">{shoe.name}</span>
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shadow"
                              style={{ backgroundColor: shoe.defaultColor }}
                            />
                          </div>
                          <p className="text-[11px] text-platinum-300">{shoe.material}</p>
                          <span className="text-[10px] text-gold-400 font-mono mt-1 block">
                            Tone: {shoe.colorName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: ACCESSORIES & JEWELRY */}
              {activeTab === 'accessories' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Jewelry */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                      1. Statement Jewelry &amp; Metals
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {JEWELRY_OPTIONS.map((jewel) => (
                        <button
                          key={jewel.id}
                          onClick={() => setSelectedJewelry(jewel)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedJewelry.id === jewel.id
                              ? 'border-gold-500 bg-gold-500/15 text-white'
                              : 'border-white/10 bg-obsidian-850 text-platinum-300'
                          }`}
                        >
                          <span className="text-xs font-bold block">{jewel.name}</span>
                          <span className="text-[10px] text-gold-400 font-mono">{jewel.tone}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Eyewear */}
                  <div className="space-y-2.5 pt-3 border-t border-white/10">
                    <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                      2. Luxury Eyewear
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {EYEWEAR_OPTIONS.map((eye) => (
                        <button
                          key={eye.id}
                          onClick={() => setSelectedEyewear(eye)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedEyewear.id === eye.id
                              ? 'border-gold-500 bg-gold-500/15 text-white'
                              : 'border-white/10 bg-obsidian-850 text-platinum-300'
                          }`}
                        >
                          <span className="text-xs font-semibold">{eye.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bags */}
                  <div className="space-y-2.5 pt-3 border-t border-white/10">
                    <label className="text-xs font-mono uppercase tracking-wider text-gold-400 block">
                      3. Handbag &amp; Carry
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {BAG_OPTIONS.map((bag) => (
                        <button
                          key={bag.id}
                          onClick={() => setSelectedBag(bag)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedBag.id === bag.id
                              ? 'border-gold-500 bg-gold-500/15 text-white'
                              : 'border-white/10 bg-obsidian-850 text-platinum-300'
                          }`}
                        >
                          <span className="text-xs font-semibold block">{bag.name}</span>
                          <span className="text-[10px] text-platinum-400 font-mono">Finish: {bag.color}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Summary Bar */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-obsidian-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  Styling Score: {harmonyScore}/100 • {harmonyScore >= 95 ? '👑 Runway Royalty' : harmonyScore >= 85 ? '✨ Chic Editorial' : '✦ Street Luxe'}
                </span>
                <p className="text-[11px] text-platinum-400">
                  Ready before going out. Tap Download to save your 4K poster.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-obsidian-800 text-platinum-300 text-xs hover:text-white"
                >
                  Close Studio
                </button>
                <button
                  onClick={handleDownload4K}
                  disabled={isExporting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-obsidian-950 font-bold text-xs shadow-lg shadow-gold-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Exporting 4K...' : 'Save 4K Look'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

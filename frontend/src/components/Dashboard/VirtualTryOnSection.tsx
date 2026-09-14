import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Eye, 
  Shirt, 
  Layers, 
  Footprints, 
  Gem, 
  Sliders, 
  Check, 
  RotateCcw,
  Maximize2,
  Share2,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VisualProfile, StylingResult } from '../../types/styling';
import { generateAndDownloadOutfitImage } from '../../services/outfitImageExporter';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface VirtualTryOnSectionProps {
  profile: VisualProfile;
  styling: StylingResult;
  query: string;
  gender: string;
  userImageUrl?: string | null;
  onCustomizeCategory?: (categoryKey: string, categoryTitle: string) => void;
}

interface LookVariation {
  id: string;
  title: string;
  tag: string;
  description: string;
  paletteBonus: string;
  vibe: string;
}

export const VirtualTryOnSection: React.FC<VirtualTryOnSectionProps> = ({
  profile,
  styling,
  query,
  gender,
  userImageUrl,
  onCustomizeCategory,
}) => {
  const { t } = useThemeLanguage();
  const [selectedLookId, setSelectedLookId] = useState<string>('signature');
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const fallbackSessionImage = gender === 'Men' ? '/images/sessions/mens_outfit.png' : '/images/sessions/womens_outfit.png';
  const displayImage = userImageUrl || fallbackSessionImage;

  // 3 Curated Look Suggestions adapted to their query & gender
  const LOOK_VARIATIONS: LookVariation[] = [
    {
      id: 'signature',
      title: 'Signature Haute Capsule',
      tag: 'Couture Balance',
      description: styling.apparel.silhouette,
      paletteBonus: '60% Base / 30% Secondary Harmony',
      vibe: 'Runway-Caliber & Tailored',
    },
    {
      id: 'contemporary',
      title: 'Contemporary Riviera Drapery',
      tag: 'Fluid Minimalist',
      description: 'Relaxed structure with soft unstructured shoulder line, breathable natural weave, and fluid movement.',
      paletteBonus: 'Tonal Monochromatic Softening',
      vibe: 'Modern Leisure & Casual Luxury',
    },
    {
      id: 'evening',
      title: 'Gala & Evening Architecture',
      tag: 'High-Contrast Luxe',
      description: 'Sharp peak lapels with lustrous micro-faille contrast, sculpting the torso with regal presence.',
      paletteBonus: 'Jewel Accents & Metallic Trim',
      vibe: 'Black-Tie & High Occasion',
    },
  ];

  const currentLook = LOOK_VARIATIONS.find((l) => l.id === selectedLookId) || LOOK_VARIATIONS[0];

  // Garment Pins on the figure
  const PINS = [
    {
      id: 'upper',
      label: 'Apparel & Cut',
      title: styling.apparel.headline,
      detail: styling.apparel.key_garments[0] || 'Structured Outerwear & Silhouette',
      icon: Shirt,
      categoryKey: 'apparel',
      categoryName: 'Apparel & Silhouette',
      top: '32%',
      left: '42%',
    },
    {
      id: 'jewelry',
      label: 'Jewelry & Metals',
      title: `${styling.footwear_accessories.jewelry_metals.tone} Finish`,
      detail: styling.footwear_accessories.jewelry_metals.rationale,
      icon: Gem,
      categoryKey: 'footwear_accessories',
      categoryName: 'Footwear & Accessories',
      top: '22%',
      left: '58%',
    },
    {
      id: 'lower',
      label: 'Trouser / Drape',
      title: 'Harmonized Bottom',
      detail: styling.apparel.key_garments[1] || 'Pleated Tailored Trousers with Ankle Break',
      icon: Layers,
      categoryKey: 'apparel',
      categoryName: 'Apparel & Silhouette',
      top: '64%',
      left: '48%',
    },
    {
      id: 'footwear',
      label: 'Footwear Matrix',
      title: styling.footwear_accessories.footwear.name,
      detail: `${styling.footwear_accessories.footwear.material} in ${styling.footwear_accessories.footwear.color}`,
      icon: Footprints,
      categoryKey: 'footwear_accessories',
      categoryName: 'Footwear & Accessories',
      top: '88%',
      left: '52%',
    },
  ];

  const handleDownloadOutfit = async () => {
    setIsExporting(true);
    try {
      await generateAndDownloadOutfitImage({
        profile,
        styling,
        query,
        gender,
        userImageUrl: displayImage,
        lookTitle: currentLook.title,
      });

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

      // Celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#D4AF37', '#FFF6D6', '#FFFFFF'],
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Could not export outfit image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/25 bg-gradient-to-b from-obsidian-900/90 via-obsidian-900/60 to-obsidian-950 relative overflow-hidden shadow-2xl">
      {/* Subtle background luxury glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-[10px] font-mono tracking-widest text-gold-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI Virtual Try-On Simulation
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-platinum-400">
              Biometric Fitted
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Styled On You <span className="gold-gradient-text">&amp; Curated Head-to-Toe</span>
          </h2>
          <p className="text-xs sm:text-sm text-platinum-400 mt-1 max-w-xl">
            See your personalized outfit worn with biometric color chemistry, tailored silhouette, and coordinated accessories.
          </p>
        </div>

        {/* Master Download CTA */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleDownloadOutfit}
            disabled={isExporting}
            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:brightness-110 text-obsidian-950 font-bold text-xs sm:text-sm transition-all shadow-xl shadow-gold-500/20 active:scale-[0.98] disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin" />
                <span>Rendering High-Res Lookbook...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4 text-obsidian-950 stroke-[3]" />
                <span>Outfit Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Final Outfit Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Look Variations Selector Tabs */}
      <div className="pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            3 Curated Outfit Variations
          </span>
          <span className="text-xs text-platinum-400 font-sans hidden sm:inline">
            Click to preview different silhouettes on you
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {LOOK_VARIATIONS.map((look) => {
            const isSelected = selectedLookId === look.id;
            return (
              <button
                key={look.id}
                onClick={() => setSelectedLookId(look.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/10'
                    : 'border-white/10 bg-obsidian-850/50 hover:border-gold-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-bold text-white group-hover:text-gold-300">
                    {look.title}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-gold-300">
                    {look.tag}
                  </span>
                </div>
                <p className="text-[11px] text-platinum-400 line-clamp-2 leading-relaxed">
                  {look.description}
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-platinum-400 font-mono">
                  <span className="text-gold-400/80">{look.vibe}</span>
                  {isSelected && <span className="text-gold-400 font-bold">Active Fitted ✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Centerpiece Try-On Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-center">
        {/* Left Interactive Figure Stage (7 cols) */}
        <div className="lg:col-span-6 relative flex flex-col items-center">
          {/* Top Toggle Switch: Original vs Styled */}
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-mono text-platinum-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-gold-400" />
              Interactive Try-On Canvas
            </span>
            <div className="flex items-center bg-obsidian-850 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setShowOriginal(false)}
                className={`px-3 py-1 rounded-lg transition-all text-xs font-medium ${
                  !showOriginal ? 'bg-gold-500 text-obsidian-950 font-semibold shadow' : 'text-platinum-400 hover:text-white'
                }`}
              >
                Virtual Try-On
              </button>
              <button
                type="button"
                onClick={() => setShowOriginal(true)}
                className={`px-3 py-1 rounded-lg transition-all text-xs font-medium ${
                  showOriginal ? 'bg-gold-500 text-obsidian-950 font-semibold shadow' : 'text-platinum-400 hover:text-white'
                }`}
              >
                Original Photo
              </button>
            </div>
          </div>

          {/* Portrait Container */}
          <div className="relative w-full max-w-md h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-gold-500/40 shadow-2xl bg-obsidian-950 group">
            {/* Base Image */}
            <img
              src={displayImage}
              alt="User Virtual Try-On Portrait"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Styling Vignette & Harmonization Filter Overlay */}
            {!showOriginal && (
              <>
                <div 
                  className="absolute inset-0 pointer-events-none mix-blend-color opacity-25"
                  style={{ backgroundColor: styling.apparel.palette[0]?.hex || '#D4AF37' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-transparent to-black/20 pointer-events-none" />

                {/* Hotspot Garment Pins on the figure */}
                {PINS.map((pin) => {
                  const isActive = activePin === pin.id;
                  const Icon = pin.icon;
                  return (
                    <div
                      key={pin.id}
                      style={{ top: pin.top, left: pin.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      <button
                        type="button"
                        onClick={() => setActivePin(isActive ? null : pin.id)}
                        onMouseEnter={() => setActivePin(pin.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md cursor-pointer ${
                          isActive
                            ? 'bg-gold-500 text-obsidian-950 scale-125 ring-4 ring-gold-500/40'
                            : 'bg-black/75 text-gold-300 border border-gold-500/50 hover:scale-110 hover:bg-gold-500 hover:text-obsidian-950'
                        }`}
                        title={pin.title}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>

                      {/* Floating Tooltip Callout */}
                      {isActive && (
                        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-60 p-3 rounded-xl bg-obsidian-900/95 border border-gold-500/50 shadow-2xl backdrop-blur-xl z-30 animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10">
                            <span className="text-[9px] font-mono text-gold-400 uppercase tracking-wider">
                              {pin.label}
                            </span>
                            {onCustomizeCategory && (
                              <button
                                onClick={() => onCustomizeCategory(pin.categoryKey, pin.categoryName)}
                                className="text-[9px] font-mono text-gold-400 underline hover:text-white"
                              >
                                Swap
                              </button>
                            )}
                          </div>
                          <p className="text-xs font-bold text-white">{pin.title}</p>
                          <p className="text-[10px] text-platinum-300 mt-0.5 leading-snug">{pin.detail}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-gold-400 uppercase tracking-widest block">
                      Worn & Harmonized
                    </span>
                    <p className="text-xs font-bold text-white truncate max-w-[240px]">
                      {styling.apparel.headline}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-gold-500/20 border border-gold-500/40 text-gold-300">
                    60-30-10 Match
                  </span>
                </div>
              </>
            )}

            {showOriginal && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/80 border border-white/20 text-xs font-mono text-white">
                Original Input Portrait
              </div>
            )}
          </div>
          <p className="text-[11px] text-platinum-400 mt-2 font-mono text-center">
            Tap glowing pins to inspect garments or click "Download Final Outfit Image" below
          </p>
        </div>

        {/* Right Details & Harmonization Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Head-to-Toe Itemized Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-850/70 border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                Fitted Wardrobe Elements
              </span>
              <span className="text-xs text-platinum-400 font-mono">
                {currentLook.title}
              </span>
            </div>

            {/* 1. Apparel */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shirt className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Apparel & Silhouette</span>
                  <span className="text-[10px] text-platinum-400 font-mono">Primary Layer</span>
                </div>
                <p className="text-xs text-platinum-300 font-medium">{styling.apparel.headline}</p>
                <p className="text-[11px] text-platinum-400 mt-0.5 line-clamp-2">{styling.apparel.silhouette}</p>
              </div>
            </div>

            {/* 2. Footwear */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Footprints className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Footwear & Leather</span>
                  <span className="text-[10px] text-platinum-400 font-mono">Foundation</span>
                </div>
                <p className="text-xs text-platinum-300 font-medium">
                  {styling.footwear_accessories.footwear.name} ({styling.footwear_accessories.footwear.color})
                </p>
                <p className="text-[11px] text-platinum-400 mt-0.5">{styling.footwear_accessories.footwear.vibe}</p>
              </div>
            </div>

            {/* 3. Jewelry Metals */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gem className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Jewelry & Metal Tone</span>
                  <span className="text-[10px] text-gold-400 font-mono">Harmonized Metal</span>
                </div>
                <p className="text-xs text-platinum-300 font-medium">
                  {styling.footwear_accessories.jewelry_metals.tone}
                </p>
                <p className="text-[11px] text-platinum-400 mt-0.5 line-clamp-2">
                  {styling.footwear_accessories.jewelry_metals.rationale}
                </p>
              </div>
            </div>
          </div>

          {/* Color Chemistry (60-30-10) Bar */}
          <div className="p-4 rounded-2xl bg-obsidian-850/70 border border-white/10 space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 block">
              Chromatic Harmony Ratios
            </span>
            <div className="grid grid-cols-3 gap-2">
              {styling.apparel.palette.slice(0, 3).map((swatch, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                  <div
                    className="w-full h-6 rounded-md border border-white/10 shadow-sm"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-[11px] font-bold text-white block truncate">{swatch.name}</span>
                  <div className="flex items-center justify-between text-[10px] font-mono text-platinum-400">
                    <span>{swatch.hex}</span>
                    <span className="text-gold-400">{idx === 0 ? '60%' : idx === 1 ? '30%' : '10%'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Download & Share Action Card */}
          <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Save Before Dressing
              </span>
              <p className="text-[11px] text-platinum-300">
                Get the full 1200x1600 magazine-grade lookbook PNG on your device.
              </p>
            </div>
            <button
              onClick={handleDownloadOutfit}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Save Image'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

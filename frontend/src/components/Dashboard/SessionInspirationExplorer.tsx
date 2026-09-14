import React, { useState, useMemo } from 'react';
import { 
  Shirt, 
  Sparkles, 
  Footprints, 
  SlidersHorizontal, 
  Download, 
  Eye, 
  Check, 
  Search, 
  Users, 
  Layers, 
  X,
  ExternalLink,
  Crown
} from 'lucide-react';
import { SAMPLE_MODELS_DATA, SampleModelItem } from '../../data/sampleModelsData';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface SessionInspirationExplorerProps {
  userImageUrl?: string | null;
  currentGender?: string;
  onSelectLookForTryOn?: (look: SampleModelItem) => void;
  onOpenGame?: () => void;
}

export const SessionInspirationExplorer: React.FC<SessionInspirationExplorerProps> = ({
  userImageUrl,
  currentGender = 'All-Inclusive',
  onSelectLookForTryOn,
  onOpenGame,
}) => {
  const { t } = useThemeLanguage();

  // Active Session Category (Outfit | Makeup | Footwear)
  const [activeSession, setActiveSession] = useState<'outfit' | 'makeup' | 'footwear'>('outfit');

  // Filter States
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Lightbox Preview Item
  const [lightboxItem, setLightboxItem] = useState<SampleModelItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter logic
  const filteredModels = useMemo(() => {
    return SAMPLE_MODELS_DATA.filter((item) => {
      // 1. Session Category filter
      if (item.category !== activeSession) return false;

      // 2. Gender filter
      if (selectedGender !== 'All') {
        if (selectedGender === 'Women' && item.gender !== 'Women' && item.gender !== 'All-Inclusive') return false;
        if (selectedGender === 'Men' && item.gender !== 'Men' && item.gender !== 'All-Inclusive') return false;
        if (selectedGender === 'All-Inclusive' && item.gender !== 'All-Inclusive') return false;
      }

      // 3. Occasion filter
      if (selectedOccasion !== 'All' && item.occasion !== selectedOccasion) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.materials.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [activeSession, selectedGender, selectedOccasion, searchQuery]);

  // Counts for sidebar badges
  const outfitCount = SAMPLE_MODELS_DATA.filter((m) => m.category === 'outfit').length;
  const makeupCount = SAMPLE_MODELS_DATA.filter((m) => m.category === 'makeup').length;
  const footwearCount = SAMPLE_MODELS_DATA.filter((m) => m.category === 'footwear').length;

  const handleApplyLook = (item: SampleModelItem) => {
    if (onSelectLookForTryOn) {
      onSelectLookForTryOn(item);
    }
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Instant Download of Look Card
  const handleDownloadReference = (item: SampleModelItem) => {
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.target = '_blank';
    link.download = `AvyoraMem_${item.id}_${item.category}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8 border border-gold-500/25 bg-gradient-to-b from-obsidian-900/90 via-obsidian-900/60 to-obsidian-950 relative overflow-hidden shadow-2xl space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-[10px] font-mono tracking-widest text-gold-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Open-Source Editorial Model Gallery
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-platinum-400">
              36+ High-Fashion Samples
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Style Inspiration <span className="gold-gradient-text">&amp; Curated Sample Models</span>
          </h2>
          <p className="text-xs sm:text-sm text-platinum-400 mt-1 max-w-2xl leading-relaxed">
            Explore 10+ open-source sample models for outfits, makeup, and footwear across all genders. Select any look to try it on your uploaded portrait.
          </p>
        </div>

        {/* 4K Game Launcher Quick Button */}
        {onOpenGame && (
          <button
            onClick={onOpenGame}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-gold-500/20 via-pink-500/15 to-gold-500/20 hover:from-gold-500/30 hover:to-gold-500/30 border border-gold-500/40 text-gold-300 hover:text-white text-xs font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span>🎮 4K Makeover Game</span>
          </button>
        )}
      </div>

      {/* Two-Column Master Layout (Left Sidebar & Right Sample Models Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================== LEFT SIDEBAR (4 cols) ==================== */}
        <aside className="lg:col-span-4 space-y-5 bg-obsidian-850/60 p-4 sm:p-5 rounded-2xl border border-white/10">
          {/* User's Active Portrait Preview */}
          {userImageUrl && (
            <div className="p-3 rounded-2xl bg-obsidian-900 border border-gold-500/30 flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gold-500/50 flex-shrink-0 bg-black">
                <img
                  src={userImageUrl}
                  alt="Your Active Portrait"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">
                  Your Uploaded Portrait
                </span>
                <p className="text-xs font-bold text-white truncate">Active Biometric Fit</p>
                <p className="text-[10px] text-platinum-400 mt-0.5">Ready for 1-click try-on</p>
              </div>
            </div>
          )}

          {/* 1. Core Session Switcher (Outfit | Makeup | Footwear) */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              1. Choose Session Category
            </span>

            <div className="space-y-2">
              {/* Outfit Session Tab */}
              <button
                type="button"
                onClick={() => setActiveSession('outfit')}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  activeSession === 'outfit'
                    ? 'border-gold-500 bg-gold-500/15 ring-2 ring-gold-500/30 shadow-lg'
                    : 'border-white/10 bg-obsidian-900/60 hover:border-gold-500/40 text-platinum-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    activeSession === 'outfit' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'bg-white/5 text-gold-400'
                  }`}>
                    <Shirt className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-gold-300 block">
                      Outfit &amp; Silhouette
                    </span>
                    <span className="text-[10px] text-platinum-400">Blazers, trench, suits &amp; draping</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-gold-300">
                  {outfitCount}+ Models
                </span>
              </button>

              {/* Makeup Session Tab */}
              <button
                type="button"
                onClick={() => setActiveSession('makeup')}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  activeSession === 'makeup'
                    ? 'border-gold-500 bg-gold-500/15 ring-2 ring-gold-500/30 shadow-lg'
                    : 'border-white/10 bg-obsidian-900/60 hover:border-gold-500/40 text-platinum-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    activeSession === 'makeup' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'bg-white/5 text-gold-400'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-gold-300 block">
                      Makeup &amp; Beauty
                    </span>
                    <span className="text-[10px] text-platinum-400">Velvet lips, contour &amp; dewy glow</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-gold-300">
                  {makeupCount}+ Models
                </span>
              </button>

              {/* Footwear Session Tab */}
              <button
                type="button"
                onClick={() => setActiveSession('footwear')}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  activeSession === 'footwear'
                    ? 'border-gold-500 bg-gold-500/15 ring-2 ring-gold-500/30 shadow-lg'
                    : 'border-white/10 bg-obsidian-900/60 hover:border-gold-500/40 text-platinum-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    activeSession === 'footwear' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'bg-white/5 text-gold-400'
                  }`}>
                    <Footprints className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-gold-300 block">
                      Footwear &amp; Leather
                    </span>
                    <span className="text-[10px] text-platinum-400">Mules, stilettos, loafers &amp; boots</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-gold-300">
                  {footwearCount}+ Models
                </span>
              </button>
            </div>
          </div>

          {/* 2. Gender Expression Filter */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            <label className="text-[11px] font-mono uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              2. Gender Requirements
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'All', label: 'All Genders' },
                { id: 'Women', label: 'Women' },
                { id: 'Men', label: 'Men' },
                { id: 'All-Inclusive', label: 'Fluid / Non-Binary' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGender(g.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                    selectedGender === g.id
                      ? 'border-gold-500 bg-gold-500/20 text-white font-bold'
                      : 'border-white/10 bg-obsidian-900/60 text-platinum-400 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Occasion Filter */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            <label className="text-[11px] font-mono uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              3. Filter by Occasion
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'All',
                'Gala & Evening',
                'Daytime Elegance',
                'Smart Casual',
                'Runway Editorial',
                'Resort & Travel',
              ].map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setSelectedOccasion(occ)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                    selectedOccasion === occ
                      ? 'border-gold-500 bg-gold-500/20 text-gold-300 font-bold'
                      : 'border-white/10 bg-obsidian-900 text-platinum-400 hover:text-white'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ==================== RIGHT MAIN SHOWCASE (8 cols) ==================== */}
        <main className="lg:col-span-8 space-y-5">
          {/* Top Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-obsidian-850/60 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-platinum-300">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping" />
              <span>
                Showing <strong className="text-white">{filteredModels.length}</strong> Sample Models for{' '}
                <span className="text-gold-400 capitalize">{activeSession}</span>
              </span>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-platinum-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search style, fabric, cut..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-obsidian-900 border border-white/15 text-xs text-white placeholder:text-platinum-400 outline-none focus:border-gold-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-platinum-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Grid of Sample Model Cards (Responsive 1 or 2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {filteredModels.map((item) => {
              const isRecentlyApplied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl p-3.5 sm:p-4 bg-obsidian-850/80 border border-white/10 hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/10 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Model Image Frame */}
                  <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-obsidian-950 mb-3 border border-white/10 shadow-inner">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/20 text-[9px] font-mono uppercase text-gold-300">
                        {item.gender}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/20 text-[9px] font-mono uppercase text-platinum-300">
                        {item.occasion}
                      </span>
                    </div>

                    {/* Quick Lightbox Action Icon */}
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/70 hover:bg-gold-500 hover:text-obsidian-950 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      title="Inspect Full Image & Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Color Swatch Bar on bottom of image */}
                    <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-platinum-400">Palette:</span>
                      <div className="flex items-center gap-1.5">
                        {item.palette.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                            style={{ backgroundColor: c.hex }}
                            title={`${c.name} (${c.hex})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 mb-3">
                    <h3 className="font-serif text-sm font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-platinum-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-platinum-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyLook(item)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isRecentlyApplied
                          ? 'bg-emerald-500 text-obsidian-950 shadow-md'
                          : 'bg-gold-500 hover:bg-gold-400 text-obsidian-950 hover:brightness-110 shadow-md shadow-gold-500/10 active:scale-95'
                      }`}
                    >
                      {isRecentlyApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Fitted on Avatar!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Try On This Look</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="p-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-750 text-platinum-300 hover:text-white border border-white/10 transition-colors"
                      title="Inspect Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadReference(item)}
                      className="p-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-750 text-platinum-300 hover:text-white border border-white/10 transition-colors"
                      title="Download Image Reference"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredModels.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-obsidian-850/40 border border-white/10 space-y-2">
              <p className="text-sm font-semibold text-white">No models matched your criteria.</p>
              <p className="text-xs text-platinum-400">Try clearing the search query or selecting "All Genders".</p>
              <button
                onClick={() => {
                  setSelectedGender('All');
                  setSelectedOccasion('All');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-1.5 rounded-xl bg-gold-500/20 text-gold-300 text-xs font-mono"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox / Detail Inspector Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-obsidian-950 border border-gold-500/40 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">
                  Editorial Model Blueprint Specification
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                  {lightboxItem.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="w-8 h-8 rounded-xl bg-obsidian-850 text-platinum-400 hover:text-white flex items-center justify-center border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Image */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-black border border-white/10">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-gold-400 uppercase">Silhouette &amp; Cut</span>
                <p className="text-white font-medium">{lightboxItem.silhouetteOrCut}</p>
              </div>

              <div className="p-3 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-gold-400 uppercase">Materials &amp; Weave</span>
                <p className="text-white font-medium">{lightboxItem.materials}</p>
              </div>
            </div>

            {/* Key Tailoring Features */}
            <div className="p-3 rounded-xl bg-obsidian-900 border border-white/5 space-y-1.5">
              <span className="text-[10px] font-mono text-gold-400 uppercase">Key Tailoring Notes</span>
              <ul className="space-y-1 text-xs text-platinum-300">
                {lightboxItem.keyDetails.map((k, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDownloadReference(lightboxItem)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-obsidian-850 text-platinum-300 hover:text-white border border-white/10 text-xs font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Look Image</span>
              </button>

              <button
                onClick={() => {
                  handleApplyLook(lightboxItem);
                  setLightboxItem(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 text-xs font-bold shadow-md shadow-gold-500/10"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Equip &amp; Try On Look</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

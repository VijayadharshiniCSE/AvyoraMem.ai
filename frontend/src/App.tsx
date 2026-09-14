import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  FileDown, 
  Sliders, 
  AlertCircle, 
  ArrowLeft, 
  Share2, 
  Check,
  Download
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroIngestion } from './components/HeroIngestion';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ProfileSummary } from './components/Dashboard/ProfileSummary';
import { LookbookGrid } from './components/Dashboard/LookbookGrid';
import { SwapModal } from './components/Dashboard/SwapModal';
import { BlueprintModal } from './components/Dashboard/BlueprintModal';
import { VirtualTryOnSection } from './components/Dashboard/VirtualTryOnSection';
import { TwinkleCursor } from './components/TwinkleCursor';
import { Footer } from './components/Footer';
import { api } from './services/api';
import { generateAndDownloadOutfitImage } from './services/outfitImageExporter';
import { AnalysisResponse, PresetModel } from './types/styling';
import { useThemeLanguage } from './context/ThemeLanguageContext';

export function App() {
  const { t } = useThemeLanguage();
  const [presets, setPresets] = useState<PresetModel[]>([]);
  const [quickQueries, setQuickQueries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [isExportingOutfit, setIsExportingOutfit] = useState<boolean>(false);

  // Modal states
  const [swapModalOpen, setSwapModalOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<{ key: string; title: string }>({ key: '', title: '' });
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  const [blueprintModalOpen, setBlueprintModalOpen] = useState<boolean>(false);
  const [markdownBlueprint, setMarkdownBlueprint] = useState<string>('');
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  // Load presets on mount
  useEffect(() => {
    async function loadPresets() {
      try {
        const data = await api.getPresets();
        setPresets(data.presets || []);
        setQuickQueries(data.quick_queries || []);
      } catch (err) {
        console.warn('Could not fetch preset avatars:', err);
      }
    }
    loadPresets();
  }, []);

  // Main Submit Handler
  const handleAnalyze = async (
    file: File | null,
    presetId?: string,
    query?: string,
    gender?: string,
    previewUrl?: string | null
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Retain user's portrait image for Virtual Try-On
    if (previewUrl) {
      setUserImageUrl(previewUrl);
    } else if (file) {
      setUserImageUrl(URL.createObjectURL(file));
    } else if (presetId) {
      const presetImg = presets.find((p) => p.id === presetId)?.image_url ||
        (gender === 'Men' ? '/images/sessions/mens_outfit.png' : '/images/sessions/womens_outfit.png');
      setUserImageUrl(presetImg);
    }

    try {
      const response = await api.analyzeStyling(file, presetId, query, gender);
      setAnalysisResult(response);

      // Pre-generate markdown blueprint for fast export
      const md = await api.exportBlueprint(
        response.visual_profile,
        response.styling,
        response.query,
        response.gender
      );
      setMarkdownBlueprint(md);

      // Subtle celebration confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E5E4E2', '#FFFFFF'],
        });
      } catch (e) {
        // ignore if blocked
      }

      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.response?.data?.detail || 'Styling synthesis failed. Please try again with another image or preset.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Open Swap Modal for specific category
  const handleOpenSwap = (categoryKey: string, categoryTitle: string) => {
    setActiveCategory({ key: categoryKey, title: categoryTitle });
    setSwapModalOpen(true);
  };

  // Perform Swap / Refinement
  const handleConfirmSwap = async (categoryKey: string, instruction: string) => {
    if (!analysisResult) return;
    setIsCustomizing(true);
    try {
      const res = await api.customizeCategory(
        analysisResult.styling,
        categoryKey,
        instruction,
        analysisResult.visual_profile,
        analysisResult.gender
      );

      // Update state live
      const updatedResult = {
        ...analysisResult,
        styling: res.updated_styling,
      };
      setAnalysisResult(updatedResult);

      // Refresh markdown blueprint
      const md = await api.exportBlueprint(
        updatedResult.visual_profile,
        updatedResult.styling,
        updatedResult.query,
        updatedResult.gender
      );
      setMarkdownBlueprint(md);

      setSwapModalOpen(false);
    } catch (err: any) {
      console.error('Swap error:', err);
      alert('Customization error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsCustomizing(false);
    }
  };

  // Reset to Hero
  const handleReset = () => {
    setAnalysisResult(null);
    setUserImageUrl(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick share link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  // Top-level quick download outfit image
  const handleDownloadOutfitImage = async () => {
    if (!analysisResult) return;
    setIsExportingOutfit(true);
    try {
      await generateAndDownloadOutfitImage({
        profile: analysisResult.visual_profile,
        styling: analysisResult.styling,
        query: analysisResult.query,
        gender: analysisResult.gender,
        userImageUrl: userImageUrl,
        lookTitle: 'Signature Haute Capsule',
      });
    } catch (err) {
      console.error('Download outfit error:', err);
      alert('Could not export outfit image. Please try again.');
    } finally {
      setIsExportingOutfit(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-500 selection:text-obsidian-950 transition-colors">
      <TwinkleCursor />
      <Navbar
        hasResults={!!analysisResult}
        onReset={handleReset}
        onOpenBlueprint={() => setBlueprintModalOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white ml-2 text-xs uppercase font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* State 1: Multi-Step Scanning Loader */}
        {isLoading && <LoadingAnimation />}

        {/* State 2: Simplified Visual Hero Screen */}
        {!isLoading && !analysisResult && (
          <HeroIngestion
            presets={presets}
            quickQueries={quickQueries}
            onSubmit={handleAnalyze}
            isLoading={isLoading}
          />
        )}

        {/* State 3: Main Stylist Dashboard (Results Workspace) */}
        {!isLoading && analysisResult && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Back/Breadcrumb Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/5">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-mono text-platinum-400 hover:text-gold-400 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>{t('new_profile')}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-750 border border-white/10 text-xs text-platinum-300 hover:text-white transition-colors"
                >
                  {shareSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t('copied')}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{t('share_blueprint')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadOutfitImage}
                  disabled={isExportingOutfit}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:brightness-110 text-obsidian-950 font-bold text-xs transition-all shadow-md shadow-gold-500/15 active:scale-95 disabled:opacity-60"
                  title="Download 1200x1600 High-Res Final Outfit Lookbook Image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExportingOutfit ? 'Exporting...' : 'Save Outfit Image'}</span>
                </button>

                <button
                  onClick={() => setBlueprintModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-750 border border-white/10 text-platinum-200 hover:text-white font-medium text-xs transition-all"
                >
                  <FileDown className="w-3.5 h-3.5 text-gold-400" />
                  <span>{t('download_blueprint')}</span>
                </button>
              </div>
            </div>

            {/* Virtual Try-On & Outfit Simulation Showcase ("Styled On You") */}
            <VirtualTryOnSection
              profile={analysisResult.visual_profile}
              styling={analysisResult.styling}
              query={analysisResult.query}
              gender={analysisResult.gender}
              userImageUrl={userImageUrl}
              onCustomizeCategory={handleOpenSwap}
            />

            {/* Left/Top Profile Summary Card */}
            <ProfileSummary
              profile={analysisResult.visual_profile}
              query={analysisResult.query}
              gender={analysisResult.gender}
            />

            {/* Lookbook Grid (4 Core Styling Pillars with Visual Imagery) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-gold-500 dark:text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Couture Harmonization Matrix
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Curated Head-to-Toe Lookbook
                  </h3>
                </div>
                <span className="text-xs text-platinum-400 hidden sm:inline font-mono">
                  {t('swap_refine')}
                </span>
              </div>

              <LookbookGrid
                styling={analysisResult.styling}
                gender={analysisResult.gender}
                onCustomizeCategory={handleOpenSwap}
              />
            </div>

            {/* Master Action Bar */}
            <div className="glass-panel rounded-2xl p-6 border border-gold-500/20 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif text-lg font-bold text-white">
                  {t('style_blueprint')} &amp; Virtual Try-On Dossier
                </h4>
                <p className="text-xs text-platinum-400">
                  Includes full color chemistry, silhouette rationale, and downloadable high-res outfit cards before dressing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleOpenSwap('apparel', 'Apparel & Silhouette')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-platinum-200 hover:text-white border border-white/10 text-xs font-medium transition-all"
                >
                  <Sliders className="w-3.5 h-3.5 text-gold-400" />
                  <span>{t('swap_refine')}</span>
                </button>

                <button
                  onClick={handleDownloadOutfitImage}
                  disabled={isExportingOutfit}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:brightness-110 text-obsidian-950 text-xs font-bold transition-all shadow-lg shadow-gold-500/15 active:scale-95 disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingOutfit ? 'Exporting...' : 'Save Final Outfit Image'}</span>
                </button>

                <button
                  onClick={() => setBlueprintModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-platinum-200 hover:text-white border border-white/10 text-xs font-medium transition-all"
                >
                  <FileDown className="w-4 h-4 text-gold-400" />
                  <span>{t('download_blueprint')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Category Swap Modal */}
      <SwapModal
        isOpen={swapModalOpen}
        categoryKey={activeCategory.key}
        categoryTitle={activeCategory.title}
        onClose={() => setSwapModalOpen(false)}
        onConfirmSwap={handleConfirmSwap}
        isCustomizing={isCustomizing}
      />

      {/* AvyoraMem Style Blueprint Modal (Printable/Exportable) */}
      {analysisResult && (
        <BlueprintModal
          isOpen={blueprintModalOpen}
          onClose={() => setBlueprintModalOpen(false)}
          profile={analysisResult.visual_profile}
          styling={analysisResult.styling}
          query={analysisResult.query}
          gender={analysisResult.gender}
          markdownContent={markdownBlueprint}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;

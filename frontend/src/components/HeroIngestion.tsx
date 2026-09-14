import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Sparkles, 
  X, 
  Check, 
  ArrowRight, 
  Sliders, 
  Wand2,
  Users,
  Image as ImageIcon,
  Layers,
  Shirt,
  Footprints,
  Eye,
  Crown
} from 'lucide-react';
import { PresetModel } from '../types/styling';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface HeroIngestionProps {
  presets: PresetModel[];
  quickQueries: string[];
  onSubmit: (file: File | null, presetId?: string, query?: string, gender?: string, previewUrl?: string | null) => void;
  isLoading: boolean;
  onOpenGame?: () => void;
}

interface VisualSessionNeed {
  id: string;
  titleKey: string;
  subKey: string;
  imageUrl: string;
  defaultGender: string;
  defaultQuery: string;
  icon: any;
  badge: string;
}

const VISUAL_SESSIONS: VisualSessionNeed[] = [
  {
    id: 'womens_outfit',
    titleKey: 'session_women',
    subKey: 'session_women_sub',
    imageUrl: '/images/sessions/womens_outfit.png',
    defaultGender: 'Women',
    defaultQuery: 'Tailored Cropped Tweed Blazer & Wide-Leg Trousers',
    icon: Shirt,
    badge: 'Couture Capsule',
  },
  {
    id: 'mens_outfit',
    titleKey: 'session_men',
    subKey: 'session_men_sub',
    imageUrl: '/images/sessions/mens_outfit.png',
    defaultGender: 'Men',
    defaultQuery: 'Relaxed Sand Linen Camp Shirt, Cognac Leather & Fedora',
    icon: Layers,
    badge: 'Safari Heritage',
  },
  {
    id: 'makeup_session',
    titleKey: 'session_makeup',
    subKey: 'session_makeup_sub',
    imageUrl: '/images/sessions/makeup_session.png',
    defaultGender: 'Women',
    defaultQuery: 'Velvet Sculpted Fuchsia Lip & Draped Cheekbone Contour',
    icon: Sparkles,
    badge: 'Runway Chroma',
  },
  {
    id: 'footwear_session',
    titleKey: 'session_footwear',
    subKey: 'session_footwear_sub',
    imageUrl: '/images/sessions/footwear_session.png',
    defaultGender: 'All-Inclusive',
    defaultQuery: 'Scarlet Architectural Leather Mules & Chartreuse Tailoring',
    icon: Footprints,
    badge: 'Parisian Pop',
  },
  {
    id: 'eyemakeup_coolers',
    titleKey: 'session_eyewear',
    subKey: 'session_eyewear_sub',
    imageUrl: '/images/sessions/eyemakeup_coolers.png',
    defaultGender: 'All-Inclusive',
    defaultQuery: 'Ivory Butterfly Coolers & Amber Cut-Crease Eye Makeup',
    icon: Eye,
    badge: 'Vintage Shades',
  },
];

export const HeroIngestion: React.FC<HeroIngestionProps> = ({
  presets,
  quickQueries,
  onSubmit,
  isLoading,
  onOpenGame,
}) => {
  const { t } = useThemeLanguage();

  const [activeSessionTab, setActiveSessionTab] = useState<string>('womens_outfit');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('womens_outfit');
  const [gender, setGender] = useState<string>('Women');
  const [query, setQuery] = useState<string>('Architectural Neutral Tweed Cropped Blazer & Wide-Leg Trousers');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [showCustomUpload, setShowCustomUpload] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedPresetId('');
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowCustomUpload(true);
    setActiveSessionTab('custom');
  };

  // Select one of the 5 visual sessions
  const handleSelectVisualSession = (session: VisualSessionNeed) => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedPresetId(session.id);
    setActiveSessionTab(session.id);
    setGender(session.defaultGender);
    setQuery(session.defaultQuery);
    setShowCustomUpload(false);
    stopCamera();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedPresetId('womens_outfit');
    setActiveSessionTab('womens_outfit');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    stopCamera();
  };

  // Webcam Selfie Capture
  const startCamera = async () => {
    try {
      setShowCustomUpload(true);
      setActiveSessionTab('custom');
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied:", err);
      alert("Camera access was not granted. Please upload a photo or pick a session above.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "webcam_portrait.jpg", { type: "image/jpeg" });
          handleFileSelected(file);
          stopCamera();
        }
      }, "image/jpeg", 0.95);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (selectedFile) {
      onSubmit(selectedFile, undefined, query, gender, previewUrl);
    } else if (selectedPresetId) {
      const matchedSession = VISUAL_SESSIONS.find((s) => s.id === selectedPresetId);
      const sessionImg = matchedSession ? matchedSession.imageUrl : undefined;
      onSubmit(null, selectedPresetId, query, gender, sessionImg);
    }
  };

  const genderOptions = [
    { label: 'All-Inclusive', text: t('all_inclusive'), sub: t('all_inclusive_sub') },
    { label: 'Women', text: t('women'), sub: t('women_sub') },
    { label: 'Men', text: t('men'), sub: t('men_sub') },
    { label: 'Non-Binary / Fluid', text: t('non_binary'), sub: t('non_binary_sub') },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-12">
      {/* Editorial Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-gold-500/30 text-xs font-mono tracking-wider text-gold-500 dark:text-gold-400">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{t('choose_session')}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          Haute AI Personal Styling <br className="hidden sm:inline" />
          <span className="gold-gradient-text">&amp; Chromatic Beauty Intelligence</span>
        </h1>
        <p className="text-sm sm:text-base text-platinum-400 max-w-2xl mx-auto font-sans leading-relaxed">
          {t('choose_session_sub')}
        </p>

        {/* 4K Gamified Fitting & Makeover Studio Quick Banner */}
        {onOpenGame && (
          <div className="pt-2 max-w-xl mx-auto">
            <button
              type="button"
              onClick={onOpenGame}
              className="w-full group p-3.5 rounded-2xl bg-gradient-to-r from-gold-500/15 via-pink-500/10 to-gold-500/15 hover:from-gold-500/25 hover:to-gold-500/25 border border-gold-500/40 hover:border-gold-400 shadow-xl shadow-gold-500/10 flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 text-left">
                <span className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-500/40 flex items-center justify-center text-lg shadow-inner group-hover:rotate-12 transition-transform">
                  🎮
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                      Play 4K Virtual Fitting &amp; Makeover Game
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-gold-500/30 text-gold-200">
                      NEW
                    </span>
                  </div>
                  <p className="text-[11px] text-platinum-300">
                    Apply custom lipstick, blush &amp; equip outfits on your avatar before stepping out.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-gold-400 group-hover:translate-x-1 transition-transform pr-1">
                Enter Studio →
              </span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Visual Session Need-Based Cards (Simplified & Image-Driven) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-500 dark:text-gold-400 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              {t('choose_session')}
            </span>
            <span className="text-xs text-platinum-400 font-mono">1-Click Visual Sessions</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {VISUAL_SESSIONS.map((session) => {
              const isSelected = activeSessionTab === session.id && !selectedFile;
              const Icon = session.icon;
              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectVisualSession(session)}
                  className={`group relative rounded-2xl p-3 sm:p-4 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden h-64 sm:h-72 ${
                    isSelected
                      ? 'border-gold-500 ring-2 ring-gold-500/30 bg-gold-500/10 shadow-xl shadow-gold-500/10'
                      : 'border-white/10 dark:border-white/10 glass-card hover:border-gold-500/40 hover:-translate-y-1'
                  }`}
                >
                  {/* Visual Image Preview */}
                  <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden mb-2 bg-obsidian-900 border border-white/10 shadow-inner">
                    <img
                      src={session.imageUrl}
                      alt={t(session.titleKey)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/20 text-[9px] font-mono uppercase text-gold-300">
                      {session.badge}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                      <h3 className="font-serif text-sm font-bold text-white truncate group-hover:text-gold-300">
                        {t(session.titleKey)}
                      </h3>
                    </div>
                    <p className="text-[11px] text-platinum-400 line-clamp-2 leading-tight">
                      {t(session.subKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Upload Toggle Bar */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowCustomUpload(!showCustomUpload)}
            className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
              showCustomUpload || selectedFile
                ? 'border-gold-500 bg-gold-500/20 text-gold-300'
                : 'border-white/10 glass-card text-platinum-300 hover:border-gold-500/30'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-gold-400" />
            <span>{t('session_custom')}</span>
          </button>
        </div>

        {/* Custom Upload & Camera Zone (Collapsible / Expandable) */}
        {(showCustomUpload || selectedFile) && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  {t('session_custom')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearSelection();
                  setShowCustomUpload(false);
                }}
                className="text-xs text-platinum-400 hover:text-white"
              >
                {t('clear_selection')}
              </button>
            </div>

            {/* Drag and Drop Zone or Live Webcam */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !previewUrl && !cameraActive && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${
                isDragOver
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-white/15 hover:border-gold-500/40 bg-obsidian-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelected(e.target.files[0]);
                  }
                }}
              />

              {previewUrl ? (
                <div className="relative group w-40 h-40 rounded-2xl overflow-hidden border border-gold-500/40 shadow-xl">
                  <img src={previewUrl} alt="Uploaded portrait" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-obsidian-950/80 text-white hover:text-red-400 flex items-center justify-center"
                    title={t('clear_selection')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : cameraActive ? (
                <div className="space-y-4">
                  <div className="relative w-64 h-48 rounded-2xl overflow-hidden border border-gold-500/40 shadow-2xl bg-black">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        captureSnapshot();
                      }}
                      className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      {t('take_snapshot')}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stopCamera();
                      }}
                      className="px-4 py-2 rounded-xl bg-obsidian-800 text-platinum-300 text-xs hover:text-white"
                    >
                      {t('stop_webcam')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t('drag_drop_title')}</p>
                    <p className="text-xs text-platinum-400 mt-1">{t('drag_drop_sub')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold-500/30 text-xs text-platinum-300 hover:text-gold-300"
                  >
                    <Camera className="w-3.5 h-3.5 text-gold-400" />
                    {t('use_webcam')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tailoring & Occasion Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Gender Expression */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-gold-500 dark:text-gold-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('gender_expression')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {genderOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setGender(opt.label)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    gender === opt.label
                      ? 'border-gold-500 bg-gold-500/15 text-white shadow-sm'
                      : 'border-white/10 bg-obsidian-900/50 text-platinum-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{opt.text}</span>
                    {gender === opt.label && <Check className="w-3.5 h-3.5 text-gold-400" />}
                  </div>
                  <span className="text-[10px] text-platinum-400 block truncate">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Occasion / Vibe */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-gold-500 dark:text-gold-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              {t('occasion_vibe')}
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Paris Fashion Week Gala, Summer Riviera Resort..."
              className="w-full px-4 py-2.5 rounded-xl bg-obsidian-900/80 border border-white/15 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs sm:text-sm text-white placeholder:text-platinum-400 outline-none transition-all"
            />
            {/* Curated Vibe Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickQueries.slice(0, 4).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuery(q)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                    query === q
                      ? 'border-gold-500/60 bg-gold-500/20 text-gold-200'
                      : 'border-white/10 bg-obsidian-850/60 hover:border-gold-500/30 text-platinum-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={isLoading || (!selectedFile && !selectedPresetId)}
            className={`w-full max-w-xl mx-auto py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xl ${
              isLoading || (!selectedFile && !selectedPresetId)
                ? 'bg-obsidian-800 text-platinum-400 border border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-950 hover:brightness-110 shadow-gold-500/25 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isLoading ? t('generating_btn') : t('generate_btn')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </section>
  );
};

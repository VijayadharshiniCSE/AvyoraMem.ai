import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  RefreshCw, 
  FileText, 
  Eye, 
  Sun, 
  Moon, 
  Globe, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { LanguageCode } from '../i18n/translations';

interface NavbarProps {
  hasResults: boolean;
  onReset: () => void;
  onOpenBlueprint: () => void;
  onOpenGame?: () => void;
  isAiReady?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasResults,
  onReset,
  onOpenBlueprint,
  onOpenGame,
  isAiReady = true,
}) => {
  const { theme, toggleTheme, language, setLanguage, t, logoUrl, languages } = useThemeLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 dark:border-white/5 px-4 lg:px-8 py-3 transition-all backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Crest */}
        <div 
          onClick={onReset} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-gold-500/40 shadow-lg shadow-gold-500/10 group-hover:border-gold-400 transition-all flex-shrink-0 bg-obsidian-900">
            <img 
              src={logoUrl} 
              alt="AvyoraMem.ai Logo" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gold-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl tracking-wider font-bold bg-gradient-to-r from-[#F7E7CE] via-[#E284B3] to-[#4DEEEA] bg-clip-text text-transparent group-hover:brightness-125 transition-all">
                AvyoraMem<span className="text-cyan-400 dark:text-cyan-300">.ai</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-gold-500/15 to-cyan-500/15 text-gold-500 dark:text-gold-300 border border-gold-500/30">
                {t('haute_maison')}
              </span>
            </div>
            <p className="text-[11px] text-platinum-400 font-sans tracking-wide truncate max-w-[260px] sm:max-w-md">
              {t('brand_sub')}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Vision Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-850/80 border border-white/10 text-xs font-mono text-platinum-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Eye className="w-3 h-3 text-gold-400" />
              {t('vision_active')}
            </span>
          </div>

          {/* Multilingual Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 dark:border-white/10 hover:border-gold-500/40 bg-obsidian-900/60 dark:bg-obsidian-900/60 text-xs font-medium transition-all text-platinum-300 hover:text-gold-400"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-mono">{currentLangObj.flag}</span>
              <span className="hidden md:inline font-sans text-xs">{currentLangObj.native}</span>
              <ChevronDown className={`w-3 h-3 text-platinum-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-white/15 dark:border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                <div className="px-3 py-1.5 border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-gold-400">
                  Select Language / भाषा / மொழி
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {languages.map(lang => {
                    const isSelected = lang.code === language;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                          isSelected 
                            ? 'bg-gold-500/20 text-gold-300 font-semibold' 
                            : 'text-platinum-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <div>
                            <span className="block font-medium">{lang.native}</span>
                            <span className="block text-[10px] text-platinum-400">{lang.label}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4K Game Studio Launcher Button */}
          {onOpenGame && (
            <button
              onClick={onOpenGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold-500/20 via-pink-500/15 to-gold-500/20 hover:from-gold-500/30 hover:to-gold-500/30 border border-gold-500/40 text-gold-300 hover:text-white text-xs font-semibold shadow-md shadow-gold-500/10 hover:scale-105 active:scale-95 transition-all"
              title="Launch 4K Virtual Fitting & Makeover Studio Game"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span className="font-mono font-bold tracking-tight">🎮 4K Game</span>
            </button>
          )}

          {/* Theme Switcher Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-white/10 dark:border-white/10 hover:border-gold-500/40 bg-obsidian-900/60 dark:bg-obsidian-900/60 text-platinum-300 hover:text-gold-400 transition-all"
            title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-violet-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Results Action Buttons */}
          {hasResults && (
            <>
              <button
                onClick={onOpenBlueprint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 text-gold-400 dark:text-gold-300 border border-gold-500/30 text-xs font-semibold transition-all shadow-sm shadow-gold-500/10"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('style_blueprint')}</span>
              </button>

              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-platinum-300 hover:text-white border border-white/10 text-xs font-medium transition-all"
                title="Start New Consultation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('new_profile')}</span>
              </button>
            </>
          )}

          <a
            href="#portfolio-info"
            onClick={(e) => {
              e.preventDefault();
              alert("AvyoraMem.ai — Elite Full-Stack AI & Computer Vision Styling Ecosystem featuring Pillow Biometric Extraction, Multimodal Heuristics, 10-Language Internationalization, and Luxury Adaptive Theme.");
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-platinum-400 hover:text-gold-400 text-xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{t('portfolio')}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

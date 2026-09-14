import React from 'react';
import { Sparkles, Cpu, Layers } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const Footer: React.FC = () => {
  const { t } = useThemeLanguage();

  return (
    <footer className="w-full border-t border-white/10 dark:border-white/5 py-12 px-4 lg:px-8 mt-20 relative bg-obsidian-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-1.5">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-serif text-lg font-bold text-white tracking-wider">
              AvyoraMem<span className="text-gold-500 dark:text-gold-400">.ai</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 dark:text-gold-400 border border-gold-500/20">
              v1.0 Production
            </span>
          </div>
          <p className="text-xs text-platinum-400 max-w-md">
            {t('footer_desc')}
          </p>
        </div>

        {/* Tech Stack Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-platinum-400">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-obsidian-850 border border-white/5">
            <Cpu className="w-3.5 h-3.5 text-gold-400" />
            FastAPI + Pillow CV
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-obsidian-850 border border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Gemini Multimodal
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-obsidian-850 border border-white/5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            React + Tailwind + Motion
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/10 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-platinum-400">
        <p>&copy; {new Date().getFullYear()} AvyoraMem.ai Haute Maison. Engineered for Portfolio &amp; Technical Showcase.</p>
        <p className="font-mono text-gold-500 dark:text-gold-400/80">Zero-Dependency Algorithmic Fallback Guaranteed</p>
      </div>
    </footer>
  );
};

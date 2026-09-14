import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Copy, 
  Check, 
  LucideIcon,
  Image as ImageIcon
} from 'lucide-react';
import { ColorSwatch } from '../../types/styling';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface CategoryCardProps {
  id: string;
  title: string;
  subtitle: string;
  categoryKey: string;
  icon: LucideIcon;
  badgeText: string;
  onCustomize: (categoryKey: string, categoryTitle: string) => void;
  colorSwatches?: ColorSwatch[];
  referenceImage?: string;
  children: React.ReactNode;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  subtitle,
  categoryKey,
  icon: Icon,
  badgeText,
  onCustomize,
  colorSwatches,
  referenceImage,
  children,
}) => {
  const { t } = useThemeLanguage();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 dark:border-white/5 flex flex-col justify-between space-y-6 hover:border-gold-500/40 transition-all group">
      <div className="space-y-5">
        {/* Header with Icon, Badge, and Swap/Regenerate CTA */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-obsidian-900 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:border-gold-500/60 transition-colors flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-gold-300 transition-colors">
                  {title}
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 dark:text-gold-400 border border-gold-500/20">
                  {badgeText}
                </span>
              </div>
              <p className="text-xs text-platinum-400 line-clamp-1">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {referenceImage && (
              <button
                type="button"
                onClick={() => setShowImagePreview(!showImagePreview)}
                className={`p-1.5 rounded-lg border text-xs transition-all ${
                  showImagePreview 
                    ? 'border-gold-500 bg-gold-500/20 text-gold-300' 
                    : 'border-white/10 bg-obsidian-850/60 text-platinum-400 hover:text-gold-300'
                }`}
                title={t('reference_look')}
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onCustomize(categoryKey, title)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-850 hover:bg-gold-500/15 text-platinum-300 hover:text-gold-300 border border-white/10 hover:border-gold-500/30 text-xs font-medium transition-all shadow-sm flex-shrink-0"
              title="Request a customized swap or adjustment"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('swap_refine')}</span>
            </button>
          </div>
        </div>

        {/* Visual Showcase Look (Collapsible / Toggleable) */}
        {referenceImage && showImagePreview && (
          <div className="relative rounded-xl overflow-hidden border border-gold-500/30 shadow-lg bg-obsidian-950 p-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-1.5 px-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400">
                {t('reference_look')}
              </span>
              <button 
                onClick={() => setShowImagePreview(false)}
                className="text-[10px] text-platinum-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-44 rounded-lg overflow-hidden border border-white/10">
              <img 
                src={referenceImage} 
                alt={title} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}

        {/* Color Palette Swatches (if available) */}
        {colorSwatches && colorSwatches.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-platinum-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              {t('harmonized_palette')}
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {colorSwatches.map((swatch, idx) => {
                const isCopied = copiedHex === swatch.hex;
                return (
                  <div
                    key={idx}
                    onClick={() => handleCopyHex(swatch.hex)}
                    className="p-2 rounded-xl bg-obsidian-900/80 border border-white/5 hover:border-gold-500/40 cursor-pointer transition-all flex flex-col gap-1.5 group/swatch relative"
                  >
                    <div
                      className="w-full h-7 rounded-lg border border-white/10 shadow-sm relative overflow-hidden"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/swatch:opacity-100 flex items-center justify-center transition-opacity">
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Copy className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-white truncate">
                        {swatch.name}
                      </p>
                      <span className="text-[9px] font-mono text-gold-400 block truncate">
                        {isCopied ? t('copied') : swatch.role || swatch.category || swatch.hex}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <div className="space-y-3.5 text-xs text-platinum-300">
          {children}
        </div>
      </div>
    </div>
  );
};

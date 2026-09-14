import React, { useState } from 'react';
import { 
  Palette, 
  Smile, 
  Layers, 
  Contrast, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldCheck
} from 'lucide-react';
import { VisualProfile } from '../../types/styling';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface ProfileSummaryProps {
  profile: VisualProfile;
  query: string;
  gender: string;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  profile,
  query,
  gender,
}) => {
  const { t } = useThemeLanguage();
  const [copiedHex, setCopiedHex] = useState(false);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-white/10 dark:border-white/5 space-y-6">
      {/* Top Title & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 dark:border-white/5">
        <div>
          <span className="text-[11px] font-mono text-gold-500 dark:text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('visual_profile')}
          </span>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide">
            {t('visual_profile')} &amp; Biometric Dossier
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 dark:text-gold-300 text-xs font-mono">
            {gender}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-obsidian-850 border border-white/10 text-platinum-300 text-xs font-sans truncate max-w-xs">
            "{query}"
          </span>
        </div>
      </div>

      {/* Grid of Extracted Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Skin Tone & Chromatic Undertone Card */}
        <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-platinum-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-gold-400" />
              {t('undertone_category')}
            </span>
            <span className="text-[10px] font-mono text-gold-400">ITA {profile.ita_angle.toFixed(1)}°</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl border border-white/20 shadow-md relative group cursor-pointer flex-shrink-0"
              style={{ backgroundColor: profile.skin_tone_hex }}
              onClick={() => copyToClipboard(profile.skin_tone_hex)}
              title="Click to copy HEX code"
            >
              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                {copiedHex ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{profile.skin_tone_name}</span>
                <span className="text-[10px] font-mono text-gold-400">({profile.skin_tone_hex})</span>
              </div>
              <p className="text-[11px] text-platinum-400 mt-0.5">{profile.undertone} undertone</p>
            </div>
          </div>
          <p className="text-[10px] text-platinum-400 italic">{profile.undertone_details}</p>
        </div>

        {/* 2. Facial Geometry Card */}
        <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-3">
          <span className="text-[10px] font-mono uppercase text-platinum-400 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-gold-400" />
            {t('face_geometry')}
          </span>
          <p className="text-sm font-bold text-white">{profile.face_shape}</p>
          <p className="text-[11px] text-platinum-300 leading-relaxed">{profile.face_shape_details}</p>
        </div>

        {/* 3. Body Silhouette / Tailoring Archetype Card */}
        <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-3">
          <span className="text-[10px] font-mono uppercase text-platinum-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gold-400" />
            {t('body_silhouette')}
          </span>
          <p className="text-sm font-bold text-white">{profile.body_silhouette}</p>
          <p className="text-[11px] text-platinum-300 leading-relaxed">{profile.body_silhouette_details}</p>
        </div>

        {/* 4. Style Persona & Contrast Card */}
        <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-platinum-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              {t('persona_badge')}
            </span>
            <span className="text-[10px] font-mono text-platinum-400 flex items-center gap-1">
              <Contrast className="w-3 h-3" />
              {profile.contrast_ratio}
            </span>
          </div>
          <p className="text-sm font-bold text-white">{profile.style_persona}</p>
          <p className="text-[11px] text-platinum-300 leading-relaxed">{profile.style_persona_details}</p>
        </div>
      </div>
    </div>
  );
};

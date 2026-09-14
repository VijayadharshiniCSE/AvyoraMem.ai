import React from 'react';
import { 
  Shirt, 
  Footprints, 
  Scissors, 
  Sparkles, 
  Briefcase, 
  Gem, 
  Glasses
} from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { StylingResult } from '../../types/styling';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface LookbookGridProps {
  styling: StylingResult;
  gender?: string;
  onCustomizeCategory: (categoryKey: string, categoryTitle: string) => void;
}

export const LookbookGrid: React.FC<LookbookGridProps> = ({
  styling,
  gender,
  onCustomizeCategory,
}) => {
  const { t } = useThemeLanguage();
  const { apparel, footwear_accessories: footwear, hair_grooming: hair, skincare_makeup: skin } = styling;

  const apparelImage = gender === 'Men' ? '/images/sessions/mens_outfit.png' : '/images/sessions/womens_outfit.png';
  const footwearImage = '/images/sessions/footwear_session.png';
  const eyewearImage = '/images/sessions/eyemakeup_coolers.png';
  const makeupImage = '/images/sessions/makeup_session.png';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      {/* 1. Apparel & Outfit Pillar */}
      <CategoryCard
        id="apparel"
        categoryKey="apparel"
        title={t('pillar_apparel')}
        subtitle={apparel.headline}
        icon={Shirt}
        badgeText={t('badge_silhouette')}
        onCustomize={onCustomizeCategory}
        colorSwatches={apparel.palette}
        referenceImage={apparelImage}
      >
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 block mb-1">
              Curated Silhouette & Form
            </span>
            <p className="text-xs text-white leading-relaxed font-medium">
              {apparel.silhouette}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 block mb-1.5">
              Garments & Layering Matrix
            </span>
            <ul className="space-y-1.5">
              {apparel.key_garments.map((garment, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-platinum-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1 flex-shrink-0" />
                  <span>{garment}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase text-platinum-400 block mb-1">
              Tactile Textures & Weaves
            </span>
            <div className="flex flex-wrap gap-1.5">
              {apparel.textures.map((tex, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-platinum-200"
                >
                  {tex}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-gold-400 dark:text-gold-300 uppercase tracking-wider block">
              {t('stylist_rationale')}
            </span>
            <p className="text-[11px] text-platinum-400 leading-relaxed italic">
              "{apparel.rationale}"
            </p>
          </div>
        </div>
      </CategoryCard>

      {/* 2. Footwear & Accessories Pillar */}
      <CategoryCard
        id="footwear_accessories"
        categoryKey="footwear_accessories"
        title={t('pillar_footwear')}
        subtitle={footwear.headline}
        icon={Footprints}
        badgeText={t('badge_complementary')}
        onCustomize={onCustomizeCategory}
        referenceImage={footwearImage}
        colorSwatches={[
          { name: footwear.footwear.name, hex: footwear.footwear.hex, role: 'Footwear' },
          { name: footwear.jewelry_metals.tone, hex: footwear.jewelry_metals.hex, role: 'Metals' },
          { name: footwear.bag.name, hex: footwear.bag.hex, role: 'Carry' },
        ]}
      >
        <div className="space-y-3.5">
          {/* Footwear Primary */}
          <div className="p-3 rounded-xl bg-obsidian-900/60 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5" />
                {t('statement_footwear')}
              </span>
              <span className="text-[10px] font-mono text-platinum-400">
                {footwear.footwear.vibe}
              </span>
            </div>
            <p className="text-xs font-semibold text-white">{footwear.footwear.name}</p>
            <p className="text-[11px] text-platinum-400">{footwear.footwear.material} &bull; {footwear.footwear.color}</p>
          </div>

          {/* Jewelry & Carry Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-obsidian-900/40 border border-white/5">
              <span className="text-[10px] font-mono uppercase text-platinum-400 flex items-center gap-1.5 mb-1">
                <Gem className="w-3 h-3 text-gold-400" />
                {t('jewelry_metals')}
              </span>
              <p className="text-[11px] font-medium text-white">{footwear.jewelry_metals.tone}</p>
              <p className="text-[10px] text-platinum-400 mt-0.5 line-clamp-2">{footwear.jewelry_metals.rationale}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-obsidian-900/40 border border-white/5">
              <span className="text-[10px] font-mono uppercase text-platinum-400 flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3 h-3 text-gold-400" />
                {t('structural_bag')}
              </span>
              <p className="text-[11px] font-medium text-white">{footwear.bag.name}</p>
              <p className="text-[10px] text-platinum-400 mt-0.5">{footwear.bag.material}</p>
            </div>
          </div>

          {/* Eyewear */}
          <div className="p-2.5 rounded-xl bg-obsidian-900/40 border border-white/5">
            <span className="text-[10px] font-mono uppercase text-platinum-400 flex items-center gap-1.5 mb-1">
              <Glasses className="w-3 h-3 text-gold-400" />
              {t('eyewear_harmony')}
            </span>
            <p className="text-[11px] font-medium text-white">{footwear.eyewear.shape}</p>
            <p className="text-[10px] text-platinum-400 mt-0.5">{footwear.eyewear.rationale}</p>
          </div>

          {/* Additional Accents */}
          <div>
            <span className="text-[10px] font-mono uppercase text-platinum-400 block mb-1">
              {t('finishing_accents')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {footwear.accessories_list.map((acc, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-platinum-300 border border-white/10"
                >
                  {acc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CategoryCard>

      {/* 3. Hairstyling & Grooming Pillar */}
      <CategoryCard
        id="hair_grooming"
        categoryKey="hair_grooming"
        title={t('pillar_hair')}
        subtitle={hair.headline}
        icon={Scissors}
        badgeText={t('badge_morphology')}
        onCustomize={onCustomizeCategory}
        referenceImage={eyewearImage}
      >
        <div className="space-y-3.5">
          <div className="p-3 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 block">
              {t('cut_volume')}
            </span>
            <p className="text-xs font-semibold text-white">
              {hair.cut_style}
            </p>
            <p className="text-[11px] text-platinum-400 leading-relaxed pt-1">
              {hair.geometry_rationale}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 block mb-1">
              {t('technique_protocol')}
            </span>
            <p className="text-[11px] text-platinum-300 leading-relaxed">
              {hair.texture_styling}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 block mb-1">
              {t('facial_grooming')}
            </span>
            <p className="text-[11px] text-platinum-300 leading-relaxed">
              {hair.facial_grooming}
            </p>
          </div>

          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase text-platinum-400 block mb-1.5">
              {t('curated_formulations')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hair.recommended_products.map((prod, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-gold-500/10 text-gold-400 dark:text-gold-300 border border-gold-500/20 text-[10px]"
                >
                  {prod}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CategoryCard>

      {/* 4. Skincare & Makeup Palette Pillar */}
      <CategoryCard
        id="skincare_makeup"
        categoryKey="skincare_makeup"
        title={t('pillar_makeup')}
        subtitle={skin.headline}
        icon={Sparkles}
        badgeText={t('badge_undertone')}
        onCustomize={onCustomizeCategory}
        referenceImage={makeupImage}
        colorSwatches={skin.color_palette}
      >
        <div className="space-y-3.5">
          <div className="p-3 rounded-xl bg-obsidian-900/60 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 block">
                {t('finish_formulation')}
              </span>
              <p className="text-xs font-semibold text-white">
                {skin.finish_type}
              </p>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              Radiant Finish
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 block mb-1">
              {t('canvas_prep')}
            </span>
            <p className="text-[11px] text-platinum-300 leading-relaxed">
              {skin.complexion_prep}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-gold-500 dark:text-gold-400 block mb-1">
              {t('contouring_guide')}
            </span>
            <p className="text-[11px] text-platinum-300 leading-relaxed">
              {skin.contouring_roadmap}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-gold-400 dark:text-gold-300 block">
              {t('daily_care')}
            </span>
            <p className="text-[11px] text-platinum-400 italic leading-relaxed">
              "{skin.skincare_tips}"
            </p>
          </div>
        </div>
      </CategoryCard>
    </div>
  );
};

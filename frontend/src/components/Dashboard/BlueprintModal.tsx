import React, { useState } from 'react';
import { X, Download, Printer, Copy, Check, FileText, Sparkles } from 'lucide-react';
import { VisualProfile, StylingResult } from '../../types/styling';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: VisualProfile;
  styling: StylingResult;
  query: string;
  gender: string;
  markdownContent: string;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  isOpen,
  onClose,
  profile,
  styling,
  query,
  gender,
  markdownContent,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AvyoraMem_Style_Blueprint_${profile.skin_tone_name.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl border border-gold-500/30 shadow-2xl shadow-gold-500/10 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block">
                Official Haute Dossier
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                AvyoraMem Style Blueprint
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 text-platinum-300 text-xs border border-white/10 transition-colors"
              title="Copy markdown text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/15 hover:bg-gold-500/25 text-gold-300 text-xs border border-gold-500/30 transition-colors"
              title="Download Markdown Blueprint"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download .md</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 text-xs font-semibold shadow transition-colors"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 text-platinum-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-sm font-sans bg-obsidian-900/50 printable-blueprint">
          {/* Header Watermark */}
          <div className="border-b border-gold-500/30 pb-6 text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              <span>AVYORAMEM.AI &bull; HAUTE PERSONAL STYLING DOSSIER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Curated Head-to-Toe Aesthetic Architecture
            </h1>
            <p className="text-xs text-platinum-400 font-mono">
              Occasion Context: "{query}" &bull; Gender Expression: {gender}
            </p>
          </div>

          {/* Section 1: Biometric Vector */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gold-400 border-l-2 border-gold-400 pl-3">
              1. Biometric & Chromatic Profile
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-obsidian-850/60 border border-white/5">
                <span className="text-[10px] text-platinum-400 uppercase block">Skin Tone</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: profile.skin_tone_hex }} />
                  <span className="text-xs font-semibold text-white">{profile.skin_tone_name}</span>
                </div>
                <span className="text-[10px] text-platinum-400 font-mono">{profile.skin_tone_hex}</span>
              </div>

              <div className="p-3 rounded-xl bg-obsidian-850/60 border border-white/5">
                <span className="text-[10px] text-platinum-400 uppercase block">Undertone</span>
                <span className="text-xs font-semibold text-white block mt-1">{profile.undertone}</span>
                <span className="text-[10px] text-platinum-400">{profile.fitzpatrick_scale}</span>
              </div>

              <div className="p-3 rounded-xl bg-obsidian-850/60 border border-white/5">
                <span className="text-[10px] text-platinum-400 uppercase block">Face Morphology</span>
                <span className="text-xs font-semibold text-white block mt-1">{profile.face_shape}</span>
                <span className="text-[10px] text-platinum-400">{profile.body_silhouette}</span>
              </div>

              <div className="p-3 rounded-xl bg-obsidian-850/60 border border-white/5">
                <span className="text-[10px] text-platinum-400 uppercase block">Style Persona</span>
                <span className="text-xs font-semibold text-gold-300 block mt-1">{profile.style_persona}</span>
                <span className="text-[10px] text-platinum-400">{profile.contrast_ratio}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Apparel */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gold-400 border-l-2 border-gold-400 pl-3">
              2. Apparel & Silhouette Architecture
            </h2>
            <div className="p-4 rounded-xl bg-obsidian-850/60 border border-white/5 space-y-2">
              <h3 className="text-sm font-bold text-white">{styling.apparel.headline}</h3>
              <p className="text-xs text-platinum-300"><strong>Form:</strong> {styling.apparel.silhouette}</p>
              <div className="pt-2">
                <span className="text-[10px] font-mono text-platinum-400 uppercase block mb-1">Key Layers:</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-platinum-300">
                  {styling.apparel.key_garments.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-platinum-400 italic pt-2">"{styling.apparel.rationale}"</p>
            </div>
          </div>

          {/* Section 3: Footwear & Accessories */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gold-400 border-l-2 border-gold-400 pl-3">
              3. Footwear & Artisanal Accents
            </h2>
            <div className="p-4 rounded-xl bg-obsidian-850/60 border border-white/5 space-y-2 text-xs text-platinum-300">
              <p><strong>Footwear:</strong> {styling.footwear_accessories.footwear.name} ({styling.footwear_accessories.footwear.material}) in {styling.footwear_accessories.footwear.color}</p>
              <p><strong>Metals & Finish:</strong> {styling.footwear_accessories.jewelry_metals.tone} — {styling.footwear_accessories.jewelry_metals.rationale}</p>
              <p><strong>Carry / Bag:</strong> {styling.footwear_accessories.bag.name} ({styling.footwear_accessories.bag.material})</p>
              <p><strong>Eyewear Frame:</strong> {styling.footwear_accessories.eyewear.shape} — {styling.footwear_accessories.eyewear.rationale}</p>
            </div>
          </div>

          {/* Section 4: Hair & Grooming */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gold-400 border-l-2 border-gold-400 pl-3">
              4. Hairstyling & Geometric Grooming
            </h2>
            <div className="p-4 rounded-xl bg-obsidian-850/60 border border-white/5 space-y-2 text-xs text-platinum-300">
              <p><strong>Cut & Silhouette:</strong> {styling.hair_grooming.cut_style}</p>
              <p><strong>Geometry Rationale:</strong> {styling.hair_grooming.geometry_rationale}</p>
              <p><strong>Styling Protocol:</strong> {styling.hair_grooming.texture_styling}</p>
              <p><strong>Grooming Formulations:</strong> {styling.hair_grooming.recommended_products.join(', ')}</p>
            </div>
          </div>

          {/* Section 5: Complexion & Beauty */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gold-400 border-l-2 border-gold-400 pl-3">
              5. Complexion Architecture & Makeup Chromatics
            </h2>
            <div className="p-4 rounded-xl bg-obsidian-850/60 border border-white/5 space-y-2 text-xs text-platinum-300">
              <p><strong>Finish Formulation:</strong> {styling.skincare_makeup.finish_type}</p>
              <p><strong>Canvas Prep:</strong> {styling.skincare_makeup.complexion_prep}</p>
              <p><strong>Contouring Roadmap:</strong> {styling.skincare_makeup.contouring_roadmap}</p>
              <p><strong>Targeted Phototype Care:</strong> {styling.skincare_makeup.skincare_tips}</p>
            </div>
          </div>

          {/* Footer Sign-off */}
          <div className="pt-6 border-t border-white/10 text-center text-xs text-platinum-400 font-mono">
            AVYORAMEM.AI &bull; Automated High-Fashion Intelligence System &bull; Confidential
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Sparkles, Wand2, Loader2, ArrowRight } from 'lucide-react';

interface SwapModalProps {
  isOpen: boolean;
  categoryKey: string;
  categoryTitle: string;
  onClose: () => void;
  onConfirmSwap: (categoryKey: string, instruction: string) => Promise<void>;
  isCustomizing: boolean;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  categoryKey,
  categoryTitle,
  onClose,
  onConfirmSwap,
  isCustomizing,
}) => {
  const [instruction, setInstruction] = useState('');

  if (!isOpen) return null;

  // Category specific quick suggestions
  const suggestionMap: Record<string, string[]> = {
    apparel: [
      "All-black obsidian monochrome silhouette",
      "More relaxed and casual linen layering",
      "Sharper structured architectural overcoat",
      "Lighter cream and neutral sand palette"
    ],
    footwear_accessories: [
      "Switch to minimal white Italian leather sneakers",
      "Swap to chiseled square-toe Cuban heel boots",
      "Sculptural architectural heels for evening gala",
      "Swap jewelry metals to brushed rose gold"
    ],
    hair_grooming: [
      "Low skin taper with textured fringe crop",
      "Longer layered flowing curtain drape",
      "Precision slicked-back high-shine look",
      "Clean-shaven razor edge perimeter"
    ],
    skincare_makeup: [
      "Ultra-luminous glass mirror dewy finish",
      "Airbrushed velvet demi-matte finish",
      "Bold crimson statement lip",
      "Subtle sunkissed peach minimal makeup"
    ]
  };

  const suggestions = suggestionMap[categoryKey] || [
    "Make it more avant-garde",
    "Adapt for warmer weather",
    "Elevate to higher formality"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    await onConfirmSwap(categoryKey, instruction);
    setInstruction('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg glass-panel rounded-2xl p-6 lg:p-7 border border-gold-500/30 shadow-2xl shadow-gold-500/10 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Dynamic Category Refinement
            </span>
            <h3 className="text-xl font-serif font-bold text-white mt-0.5">
              Customize {categoryTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 text-platinum-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-platinum-300 block">
              What specific adjustment or swap would you like?
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., 'Switch footwear to minimalist sneakers', 'Make outfit darker and more minimalist'..."
              className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/15 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-sm text-white placeholder:text-platinum-400 outline-none resize-none transition-all"
            />
          </div>

          {/* Quick suggestions */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-platinum-400 flex items-center gap-1.5">
              <Wand2 className="w-3 h-3 text-gold-400" />
              Suggested Refinements:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInstruction(sug)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-obsidian-850 hover:bg-gold-500/15 text-platinum-300 hover:text-gold-200 border border-white/10 hover:border-gold-500/30 transition-all text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-platinum-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCustomizing || !instruction.trim()}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-all ${
                isCustomizing || !instruction.trim()
                  ? 'bg-obsidian-800 text-platinum-400 border border-white/5 cursor-not-allowed'
                  : 'bg-gold-500 text-obsidian-950 hover:bg-gold-400 font-semibold shadow-lg shadow-gold-500/15'
              }`}
            >
              {isCustomizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Customizing...</span>
                </>
              ) : (
                <>
                  <span>Apply Refinement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

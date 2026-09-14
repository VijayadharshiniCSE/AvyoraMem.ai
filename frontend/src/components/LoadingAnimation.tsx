import React, { useState, useEffect } from 'react';
import { Sparkles, Scan, Palette, Scissors, ShieldCheck } from 'lucide-react';

export const LoadingAnimation: React.FC = () => {
  const steps = [
    {
      title: "Calibrating Biometric Color Space",
      desc: "Sampling facial region & computing CIE-L*a*b* coordinates...",
      icon: Scan,
    },
    {
      title: "Analyzing Skin Undertones & ITA",
      desc: "Determining individual typology angle & chromatic temperature...",
      icon: Palette,
    },
    {
      title: "Evaluating Morphology & Silhouette",
      desc: "Deriving facial geometry, proportion archetype & contrast ratio...",
      icon: Scissors,
    },
    {
      title: "Architecting Apparel & Footwear",
      desc: "Curating 60-30-10 palette balance, fabrics, and tailoring lines...",
      icon: Sparkles,
    },
    {
      title: "Synthesizing Complexion & Beauty Dossier",
      desc: "Formulating contouring roadmap & undertone-matched beauty palette...",
      icon: ShieldCheck,
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 750);
    return () => clearInterval(interval);
  }, [steps.length]);

  const progress = Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100));

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center space-y-8">
      {/* Central Scanning Hologram Orb */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Outer pulsating rings */}
        <div className="absolute inset-0 rounded-full border border-gold-500/20 animate-ping opacity-25" />
        <div className="absolute -inset-4 rounded-full border border-gold-500/15 animate-pulse" />
        <div className="absolute -inset-8 rounded-full border border-white/5" />

        {/* Center Glowing Core */}
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-obsidian-800 via-obsidian-900 to-obsidian-950 border border-gold-500/40 flex flex-col items-center justify-center shadow-2xl shadow-gold-500/10 overflow-hidden">
          {/* Scanning laser beam line */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent animate-bounce" />
          
          <Sparkles className="w-8 h-8 text-gold-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-[10px] font-mono text-gold-300 tracking-wider mt-1">{progress}%</span>
        </div>
      </div>

      {/* Dynamic Step Text */}
      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
        </div>

        <h3 className="text-xl font-serif font-bold text-white tracking-wide transition-all">
          {steps[currentStepIndex].title}
        </h3>

        <p className="text-xs text-platinum-400 font-sans leading-relaxed min-h-[32px]">
          {steps[currentStepIndex].desc}
        </p>
      </div>

      {/* High-Precision Progress Bar */}
      <div className="w-full max-w-xs space-y-2">
        <div className="w-full h-1.5 rounded-full bg-obsidian-850 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-platinum-400">
          <span>CHROMATIC SCAN</span>
          <span>HAUTE SYNTHESIS</span>
        </div>
      </div>
    </div>
  );
};

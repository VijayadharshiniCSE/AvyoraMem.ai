export interface CustomMakeoverState {
  lipColor: string;
  lipName: string;
  lipFinish: 'matte' | 'gloss' | 'satin';
  lipIntensity: number;
  blushColor: string;
  blushName: string;
  blushIntensity: number;
  eyeshadowColor: string;
  eyeshadowName: string;
  skinGlow: 'glass' | 'velvet' | 'bronze';
  outfitTop: { id: string; name: string; category: string; color: string; colorName: string };
  outfitBottom: { id: string; name: string; category: string; color: string; colorName: string };
  footwear: { id: string; name: string; material: string; color: string; colorName: string };
  accessories: {
    jewelry: { id: string; name: string; tone: string };
    eyewear: { id: string; name: string };
    bag: { id: string; name: string; color: string };
  };
  harmonyScore: number;
  lightingMode: 'studio' | 'golden' | 'midnight';
}

interface Export4KOptions {
  userImageUrl: string;
  state: CustomMakeoverState;
  userName?: string;
  occasion?: string;
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fallback = new Image();
      fallback.onload = () => resolve(fallback);
      fallback.onerror = (e) => reject(e);
      fallback.src = src;
    };
    img.src = src;
  });
};

export async function export4KMakeoverPoster({
  userImageUrl,
  state,
  userName = 'Haute Persona',
  occasion = 'Before Stepping Out',
}: Export4KOptions): Promise<void> {
  const width = 1600;
  const height = 2000;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // 1. Luxury Background depending on lighting mode
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (state.lightingMode === 'golden') {
    bgGrad.addColorStop(0, '#0d0a06');
    bgGrad.addColorStop(0.5, '#17120a');
    bgGrad.addColorStop(1, '#080604');
  } else if (state.lightingMode === 'midnight') {
    bgGrad.addColorStop(0, '#06070e');
    bgGrad.addColorStop(0.5, '#0b0f1a');
    bgGrad.addColorStop(1, '#05060a');
  } else {
    bgGrad.addColorStop(0, '#06070a');
    bgGrad.addColorStop(0.5, '#0e111a');
    bgGrad.addColorStop(1, '#050608');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Atmospheric Radiance Glow
  const ambientGlow = ctx.createRadialGradient(width * 0.3, height * 0.25, 20, width * 0.3, height * 0.25, 800);
  ambientGlow.addColorStop(0, state.lightingMode === 'golden' ? 'rgba(230, 160, 50, 0.12)' : 'rgba(212, 175, 55, 0.1)');
  ambientGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = ambientGlow;
  ctx.fillRect(0, 0, width, height);

  // 2. Editorial Borders & Corner Brackets
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(58, 58, width - 116, height - 116);

  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 30);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 30, y);
    ctx.stroke();
  };
  drawCorner(48, 48, 1, 1);
  drawCorner(width - 48, 48, -1, 1);
  drawCorner(48, height - 48, 1, -1);
  drawCorner(width - 48, height - 48, -1, -1);

  // 3. Editorial Header
  ctx.fillStyle = '#D4AF37';
  ctx.font = '700 15px monospace';
  ctx.letterSpacing = '6px';
  ctx.fillText('A V Y O R A M E M . A I   •   4 K   U L T R A - R E A L I S T I C   M A K E O V E R', 84, 110);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('Custom Fitting & Beauty Dossier', 84, 170);

  ctx.fillStyle = '#A4A8B5';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`OCCASION: "${occasion.toUpperCase()}"   •   LIGHTING: ${state.lightingMode.toUpperCase()} GLAMOUR`, 84, 205);

  // Style Harmony Score Badge (Top-Right)
  ctx.save();
  ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(width - 420, 95, 336, 95, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 12px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('STYLE HARMONY SCORE', width - 396, 130);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${state.harmonyScore}/100`, width - 396, 172);

  ctx.fillStyle = '#E6CA7E';
  ctx.font = 'bold 12px monospace';
  const tier = state.harmonyScore >= 95 ? '👑 RUNWAY ROYALTY' : state.harmonyScore >= 85 ? '✨ CHIC EDITORIAL' : '✦ READY TO STEP OUT';
  ctx.fillText(tier, width - 260, 172);
  ctx.restore();

  // Header dividing rule
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(84, 235);
  ctx.lineTo(width - 84, 235);
  ctx.stroke();

  // 4. Center-Left 4K Portrait Canvas (W: 720, H: 980)
  const portraitX = 84;
  const portraitY = 265;
  const portraitW = 720;
  const portraitH = 980;

  ctx.fillStyle = '#0a0d14';
  ctx.beginPath();
  ctx.roundRect(portraitX, portraitY, portraitW, portraitH, 20);
  ctx.fill();

  try {
    const userImg = await loadImage(userImageUrl);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(portraitX, portraitY, portraitW, portraitH, 20);
    ctx.clip();

    const hRatio = portraitW / userImg.width;
    const vRatio = portraitH / userImg.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (portraitW - userImg.width * ratio) / 2;
    const centerShiftY = (portraitH - userImg.height * ratio) / 2;

    ctx.drawImage(
      userImg,
      0,
      0,
      userImg.width,
      userImg.height,
      portraitX + centerShiftX,
      portraitY + centerShiftY,
      userImg.width * ratio,
      userImg.height * ratio
    );

    // 4K Lighting Atmosphere
    if (state.lightingMode === 'golden') {
      const goldFilter = ctx.createLinearGradient(portraitX, portraitY, portraitX + portraitW, portraitY + portraitH);
      goldFilter.addColorStop(0, 'rgba(255, 180, 50, 0.12)');
      goldFilter.addColorStop(1, 'rgba(180, 90, 0, 0.1)');
      ctx.fillStyle = goldFilter;
      ctx.fillRect(portraitX, portraitY, portraitW, portraitH);
    } else if (state.lightingMode === 'midnight') {
      const midnightFilter = ctx.createLinearGradient(portraitX, portraitY, portraitX, portraitY + portraitH);
      midnightFilter.addColorStop(0, 'rgba(50, 80, 180, 0.12)');
      midnightFilter.addColorStop(1, 'rgba(20, 20, 50, 0.15)');
      ctx.fillStyle = midnightFilter;
      ctx.fillRect(portraitX, portraitY, portraitW, portraitH);
    }

    // Custom Cosmetic Tint Overlay (Live Makeup simulation)
    const lipGrad = ctx.createRadialGradient(
      portraitX + portraitW * 0.5,
      portraitY + portraitH * 0.58,
      10,
      portraitX + portraitW * 0.5,
      portraitY + portraitH * 0.58,
      80
    );
    lipGrad.addColorStop(0, `${state.lipColor}55`);
    lipGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lipGrad;
    ctx.fillRect(portraitX, portraitY, portraitW, portraitH);

    // Soft Cheek Blush Glow
    const blushLeft = ctx.createRadialGradient(
      portraitX + portraitW * 0.36,
      portraitY + portraitH * 0.52,
      5,
      portraitX + portraitW * 0.36,
      portraitY + portraitH * 0.52,
      60
    );
    blushLeft.addColorStop(0, `${state.blushColor}44`);
    blushLeft.addColorStop(1, 'transparent');
    ctx.fillStyle = blushLeft;
    ctx.fillRect(portraitX, portraitY, portraitW, portraitH);

    const blushRight = ctx.createRadialGradient(
      portraitX + portraitW * 0.64,
      portraitY + portraitH * 0.52,
      5,
      portraitX + portraitW * 0.64,
      portraitY + portraitH * 0.52,
      60
    );
    blushRight.addColorStop(0, `${state.blushColor}44`);
    blushRight.addColorStop(1, 'transparent');
    ctx.fillStyle = blushRight;
    ctx.fillRect(portraitX, portraitY, portraitW, portraitH);

    // Luxury bottom vignette
    const vignette = ctx.createLinearGradient(portraitX, portraitY + portraitH - 220, portraitX, portraitY + portraitH);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(6, 7, 10, 0.95)');
    ctx.fillStyle = vignette;
    ctx.fillRect(portraitX, portraitY, portraitW, portraitH);

    ctx.restore();
  } catch (err) {
    console.warn('Could not draw 4K image:', err);
  }

  // Portrait Border Frame
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(portraitX, portraitY, portraitW, portraitH, 20);
  ctx.stroke();

  // Overlay Badge on Bottom of Portrait
  ctx.save();
  ctx.fillStyle = 'rgba(10, 13, 20, 0.88)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(portraitX + 28, portraitY + portraitH - 95, portraitW - 56, 70, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 12px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('✦ 4K ULTRA-REALISTIC FITTED LOOK', portraitX + 48, portraitY + portraitH - 65);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${state.outfitTop.name} • ${state.lipName} Lip (${state.lipFinish.toUpperCase()})`, portraitX + 48, portraitY + portraitH - 40);
  ctx.restore();

  // 5. Right Column: Custom Specifications (X: 840, W: 676)
  const rightX = 840;
  let curY = 265;

  const drawSpecCard = (title: string, h: number) => {
    ctx.fillStyle = 'rgba(15, 18, 26, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX, curY, 676, h, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 12px monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText(title.toUpperCase(), rightX + 24, curY + 30);
  };

  // 1. Applied Custom Makeup Specs
  drawSpecCard('1. Bespoke Cosmetic & Beauty Direction', 290);

  // Lip swatch preview
  ctx.fillStyle = state.lipColor;
  ctx.beginPath();
  ctx.roundRect(rightX + 24, curY + 48, 48, 48, 12);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Lip Shade: ${state.lipName} (${state.lipColor})`, rightX + 86, curY + 70);
  ctx.fillStyle = '#A4A8B5';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Finish: ${state.lipFinish.toUpperCase()}   •   Intensity: ${state.lipIntensity}%`, rightX + 86, curY + 92);

  // Blush swatch
  ctx.fillStyle = state.blushColor;
  ctx.beginPath();
  ctx.roundRect(rightX + 24, curY + 115, 48, 48, 12);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Cheek Draping: ${state.blushName}`, rightX + 86, curY + 137);
  ctx.fillStyle = '#A4A8B5';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Blush Intensity: ${state.blushIntensity}%   •   Harmonized with undertone`, rightX + 86, curY + 159);

  // Eyeshadow & Skin Radiance
  ctx.fillStyle = state.eyeshadowColor;
  ctx.beginPath();
  ctx.roundRect(rightX + 24, curY + 180, 48, 48, 12);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Eye Shadow: ${state.eyeshadowName}`, rightX + 86, curY + 202);
  ctx.fillStyle = '#A4A8B5';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Skin Glow Filter: ${state.skinGlow.toUpperCase()} RADIANCE`, rightX + 86, curY + 224);

  curY += 315;

  // 2. Equipped Outfit & Silhouette
  drawSpecCard('2. Manually Equipped Wardrobe Silhouette', 270);

  // Top/Blazer
  ctx.fillStyle = state.outfitTop.color;
  ctx.beginPath();
  ctx.roundRect(rightX + 24, curY + 50, 44, 44, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Upper: ${state.outfitTop.name}`, rightX + 80, curY + 70);
  ctx.fillStyle = '#D4AF37';
  ctx.font = '12px monospace';
  ctx.fillText(`Color: ${state.outfitTop.colorName} (${state.outfitTop.color})`, rightX + 80, curY + 88);

  // Bottom/Trouser
  ctx.fillStyle = state.outfitBottom.color;
  ctx.beginPath();
  ctx.roundRect(rightX + 24, curY + 110, 44, 44, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Lower: ${state.outfitBottom.name}`, rightX + 80, curY + 130);
  ctx.fillStyle = '#D4AF37';
  ctx.font = '12px monospace';
  ctx.fillText(`Color: ${state.outfitBottom.colorName} (${state.outfitBottom.color})`, rightX + 80, curY + 148);

  // Footwear
  ctx.fillStyle = state.footwear.color;
  ctx.beginPath();
  ctx.roundRect(rightX + 24, curY + 170, 44, 44, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Footwear: ${state.footwear.name}`, rightX + 80, curY + 190);
  ctx.fillStyle = '#D4AF37';
  ctx.font = '12px monospace';
  ctx.fillText(`${state.footwear.material} in ${state.footwear.colorName}`, rightX + 80, curY + 208);

  curY += 295;

  // 3. Equipped Accessories Vault
  drawSpecCard('3. Paired Accessories & High-Jewelry', 210);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`• Jewelry Metal: ${state.accessories.jewelry.name} (${state.accessories.jewelry.tone} Finish)`, rightX + 24, curY + 65);
  ctx.fillText(`• Luxury Eyewear: ${state.accessories.eyewear.name}`, rightX + 24, curY + 95);
  ctx.fillText(`• Carry Bag: ${state.accessories.bag.name} (${state.accessories.bag.color})`, rightX + 24, curY + 125);

  ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
  ctx.beginPath();
  ctx.roundRect(rightX + 24, curY + 145, 628, 45, 8);
  ctx.fill();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('STEP-OUT STATUS: 100% PREPARED • COUTURIST CERTIFIED', rightX + 38, curY + 172);

  // 6. Bottom Banner & Watermark
  const bottomY = 1880;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.font = 'bold 12px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('AVYORAMEM.AI • 4K VIRTUAL FITTING STUDIO • READY BEFORE STEPPING OUT', 84, bottomY);

  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.fillStyle = '#71717A';
  ctx.font = '12px monospace';
  ctx.fillText(`STAMP: ${timestamp.toUpperCase()}`, width - 260, bottomY);

  // Convert to Blob & Download
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('4K canvas export failed'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const sanitizedOccasion = occasion.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20) || 'Glamour';
      link.download = `AvyoraMem_4K_${sanitizedOccasion}_Makeover.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      resolve();
    }, 'image/png', 0.98);
  });
}

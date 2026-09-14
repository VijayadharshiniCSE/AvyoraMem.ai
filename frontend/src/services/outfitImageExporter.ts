import { VisualProfile, StylingResult } from '../types/styling';

interface ExportOutfitOptions {
  profile: VisualProfile;
  styling: StylingResult;
  query: string;
  gender: string;
  userImageUrl?: string | null;
  lookTitle?: string;
}

// Helper to load an image safely onto canvas
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback: try without crossOrigin or reject
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = (e) => reject(e);
      fallbackImg.src = src;
    };
    img.src = src;
  });
};

export async function generateAndDownloadOutfitImage({
  profile,
  styling,
  query,
  gender,
  userImageUrl,
  lookTitle = 'Signature Haute Silhouette',
}: ExportOutfitOptions): Promise<void> {
  const width = 1200;
  const height = 1600;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // 1. Background Luxury Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#06070a');
  bgGrad.addColorStop(0.5, '#0c0e14');
  bgGrad.addColorStop(1, '#06070a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle radial gold ambient glows
  const radialGlow = ctx.createRadialGradient(width * 0.2, height * 0.15, 10, width * 0.2, height * 0.15, 600);
  radialGlow.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  const radialGlow2 = ctx.createRadialGradient(width * 0.8, height * 0.85, 10, width * 0.8, height * 0.85, 700);
  radialGlow2.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
  radialGlow2.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow2;
  ctx.fillRect(0, 0, width, height);

  // 2. Editorial Outer Border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, width - 88, height - 88);

  // Corner Accent Marks
  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 24);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 24, y);
    ctx.stroke();
  };
  drawCorner(36, 36, 1, 1);
  drawCorner(width - 36, 36, -1, 1);
  drawCorner(36, height - 36, 1, -1);
  drawCorner(width - 36, height - 36, -1, -1);

  // 3. Header Section
  ctx.fillStyle = '#D4AF37';
  ctx.font = '700 13px monospace';
  ctx.letterSpacing = '5px';
  ctx.fillText('A V Y O R A M E M . A I   •   V I R T U A L   T R Y - O N', 64, 84);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Plus Jakarta Sans", -apple-system, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('Haute Couture Outfit Dossier', 64, 130);

  // Occasion & Metadata
  ctx.fillStyle = '#A4A8B5';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  const cleanQuery = query.length > 55 ? query.substring(0, 52) + '...' : query;
  ctx.fillText(`OCCASION: "${cleanQuery}"   |   GENDER: ${gender.toUpperCase()}   |   LOOK: ${lookTitle.toUpperCase()}`, 64, 160);

  // Verified Harmony Badge in top right
  ctx.save();
  ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width - 340, 76, 276, 52, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 11px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('98.8% BIOMETRIC HARMONY', width - 322, 100);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Skin & Silhouette Synchronized', width - 322, 118);
  ctx.restore();

  // Horizontal divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(64, 184);
  ctx.lineTo(width - 64, 184);
  ctx.stroke();

  // 4. Center-Left: User Portrait / Virtual Try-On Canvas (600 x 780)
  const portraitX = 64;
  const portraitY = 210;
  const portraitW = 540;
  const portraitH = 740;

  // Portrait frame background
  ctx.fillStyle = '#0f121a';
  ctx.beginPath();
  ctx.roundRect(portraitX, portraitY, portraitW, portraitH, 16);
  ctx.fill();

  // Try to load user image
  let imgLoaded = false;
  const targetImageSrc = userImageUrl || (gender === 'Men' ? '/images/sessions/mens_outfit.png' : '/images/sessions/womens_outfit.png');

  try {
    const userImg = await loadImage(targetImageSrc);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(portraitX, portraitY, portraitW, portraitH, 16);
    ctx.clip();

    // Scale to cover
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

    // Vignette overlay for luxury magazine editorial look
    const vignette = ctx.createLinearGradient(portraitX, portraitY + portraitH - 180, portraitX, portraitY + portraitH);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(6, 7, 10, 0.9)');
    ctx.fillStyle = vignette;
    ctx.fillRect(portraitX, portraitY, portraitW, portraitH);

    ctx.restore();
    imgLoaded = true;
  } catch (err) {
    console.warn('Could not draw portrait image to canvas:', err);
  }

  // Portrait border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(portraitX, portraitY, portraitW, portraitH, 16);
  ctx.stroke();

  // Styled-on Badge Overlay on bottom of photo
  ctx.save();
  ctx.fillStyle = 'rgba(12, 15, 23, 0.85)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.beginPath();
  ctx.roundRect(portraitX + 20, portraitY + portraitH - 85, portraitW - 40, 65, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 11px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('✦ VIRTUAL TRY-ON SIMULATION', portraitX + 36, portraitY + portraitH - 58);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(styling.apparel.headline || 'Curated Haute Ensemble', portraitX + 36, portraitY + portraitH - 36);
  ctx.restore();

  // 5. Right Column: Curated Wardrobe & Garment Specs (X = 640, W = 496)
  const colX = 636;
  let curY = 214;

  // Header for Look Specs
  ctx.fillStyle = '#D4AF37';
  ctx.font = '700 12px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('CURATED ENSEMBLE SPECIFICATIONS', colX, curY);
  curY += 28;

  // Box 1: Apparel & Silhouette Matrix
  const drawCard = (x: number, y: number, w: number, h: number, title: string, subtitle: string) => {
    ctx.fillStyle = 'rgba(17, 20, 28, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 10px monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText(title.toUpperCase(), x + 18, y + 24);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(subtitle, x + 18, y + 46);
  };

  // 1. Apparel
  drawCard(colX, curY, 500, 165, '1. Silhouette & Apparel Architecture', styling.apparel.silhouette.substring(0, 48));
  ctx.fillStyle = '#D6D8DE';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  styling.apparel.key_garments.slice(0, 3).forEach((garment, i) => {
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('•', colX + 20, curY + 76 + i * 22);
    ctx.fillStyle = '#CBD5E1';
    const cleanG = garment.length > 55 ? garment.substring(0, 52) + '...' : garment;
    ctx.fillText(cleanG, colX + 34, curY + 76 + i * 22);
  });
  curY += 180;

  // 2. Footwear & Accessories
  drawCard(colX, curY, 500, 145, '2. Footwear, Leather & Metals', styling.footwear_accessories.footwear.name);
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Footwear: ${styling.footwear_accessories.footwear.material} • ${styling.footwear_accessories.footwear.color}`, colX + 20, curY + 76);
  ctx.fillText(`Jewelry Tone: ${styling.footwear_accessories.jewelry_metals.tone} Finish`, colX + 20, curY + 98);
  ctx.fillText(`Bag & Eyewear: ${styling.footwear_accessories.bag.name} • ${styling.footwear_accessories.eyewear.shape}`, colX + 20, curY + 120);
  curY += 160;

  // 3. Hair & Chromatic Grooming
  drawCard(colX, curY, 500, 135, '3. Hair Geometry & Chromatic Grooming', styling.hair_grooming.headline);
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Cut / Styling: ${styling.hair_grooming.cut_style.substring(0, 52)}`, colX + 20, curY + 76);
  ctx.fillText(`Complexion Prep: ${styling.skincare_makeup.complexion_prep.substring(0, 50)}`, colX + 20, curY + 98);
  ctx.fillText(`Finish: ${styling.skincare_makeup.finish_type}`, colX + 20, curY + 120);
  curY += 150;

  // 4. Stylist Rationale Quote Box
  ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.beginPath();
  ctx.roundRect(colX, curY, 500, 85, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 10px monospace';
  ctx.fillText('LEAD STYLIST DIRECTIVE:', colX + 18, curY + 24);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'italic 12px "Plus Jakarta Sans", serif';
  const cleanRationale = `"${styling.apparel.rationale.substring(0, 120)}..."`;
  ctx.fillText(cleanRationale, colX + 18, curY + 48);

  // 6. Bottom Grid: Biometrics & Chromatic Palette (Y = 980 to 1480)
  const bottomY = 980;

  // Left Bottom: Biometrics (X = 64, W = 540)
  ctx.fillStyle = 'rgba(17, 20, 28, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(64, bottomY, 540, 260, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 11px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('INDIVIDUAL BIOMETRIC SYNTHESIS', 86, bottomY + 34);

  // Skin tone badge
  ctx.fillStyle = profile.skin_tone_hex || '#C69676';
  ctx.beginPath();
  ctx.roundRect(86, bottomY + 54, 48, 48, 10);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${profile.skin_tone_name} (${profile.skin_tone_hex})`, 146, bottomY + 76);
  ctx.fillStyle = '#A4A8B5';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${profile.undertone} Undertone • ITA Angle: ${profile.ita_angle.toFixed(1)}°`, 146, bottomY + 95);

  // 4 metrics grid
  const metrics = [
    { label: 'FACE GEOMETRY', val: profile.face_shape },
    { label: 'TAILORING ARCHETYPE', val: profile.body_silhouette },
    { label: 'CONTRAST RATIO', val: profile.contrast_ratio },
    { label: 'STYLE PERSONA', val: profile.style_persona },
  ];

  metrics.forEach((m, idx) => {
    const mx = 86 + (idx % 2) * 250;
    const my = bottomY + 130 + Math.floor(idx / 2) * 56;

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 9px monospace';
    ctx.letterSpacing = '1px';
    ctx.fillText(m.label, mx, my);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(m.val, mx, my + 20);
  });

  // Right Bottom: Chromatic Palette 60-30-10 (X = 636, W = 500)
  ctx.fillStyle = 'rgba(17, 20, 28, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(colX, bottomY, 500, 260, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 11px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('CHROMATIC HARMONY RATIO (60 • 30 • 10)', colX + 22, bottomY + 34);

  // Draw 3 Palette Swatches
  const palette = styling.apparel.palette || [];
  palette.slice(0, 3).forEach((swatch, idx) => {
    const swX = colX + 22 + idx * 154;
    const swY = bottomY + 54;

    // Color swatch rectangle
    ctx.fillStyle = swatch.hex;
    ctx.beginPath();
    ctx.roundRect(swX, swY, 140, 80, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Swatch text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(swatch.name, swX, swY + 104);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(swatch.hex.toUpperCase(), swX, swY + 122);

    ctx.fillStyle = '#A4A8B5';
    ctx.font = '10px monospace';
    ctx.fillText(swatch.role || (idx === 0 ? '60% Dominant' : idx === 1 ? '30% Secondary' : '10% Accent'), swX, swY + 138);
  });

  // Color harmony tip
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.roundRect(colX + 22, bottomY + 205, 456, 40, 8);
  ctx.fill();

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Balanced for your unique chromatic undertone to enhance facial radiance.', colX + 34, bottomY + 230);

  // 7. Footer Stamp
  ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.font = 'bold 10px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('AVYORAMEM.AI • DESIGNED TO WEAR WITH CONFIDENCE • HAUTE EDITORIAL ARCHIVE', 64, height - 58);

  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.fillStyle = '#71717A';
  ctx.font = '10px monospace';
  ctx.fillText(`GENERATED: ${timestamp.toUpperCase()}`, width - 240, height - 58);

  // 8. Convert to Blob & Download
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas image rendering failed'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const sanitizedOccasion = query.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20) || 'Lookbook';
      link.download = `AvyoraMem_${sanitizedOccasion}_Outfit.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      resolve();
    }, 'image/png', 0.98);
  });
}

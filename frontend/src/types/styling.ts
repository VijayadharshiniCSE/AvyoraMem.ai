export interface ColorSwatch {
  name: string;
  hex: string;
  role?: string;
  category?: string;
}

export interface VisualProfile {
  skin_tone_hex: string;
  skin_tone_name: string;
  fitzpatrick_scale: string;
  undertone: string;
  undertone_category: 'Warm' | 'Cool' | 'Neutral' | 'Olive' | string;
  undertone_details: string;
  ita_angle: number;
  face_shape: string;
  face_shape_details: string;
  body_silhouette: string;
  body_silhouette_details: string;
  contrast_ratio: string;
  contrast_details: string;
  style_persona: string;
  style_persona_details: string;
  image_dimensions?: string;
  aspect_ratio?: number;
}

export interface ApparelCategory {
  headline: string;
  silhouette: string;
  key_garments: string[];
  palette: ColorSwatch[];
  textures: string[];
  rationale: string;
  styling_tips: string[];
}

export interface FootwearAccessoriesCategory {
  headline: string;
  footwear: {
    name: string;
    material: string;
    color: string;
    hex: string;
    vibe: string;
  };
  jewelry_metals: {
    tone: string;
    rationale: string;
    hex: string;
  };
  bag: {
    name: string;
    material: string;
    color: string;
    hex: string;
  };
  eyewear: {
    shape: string;
    rationale: string;
    finish: string;
  };
  accessories_list: string[];
}

export interface HairGroomingCategory {
  headline: string;
  cut_style: string;
  geometry_rationale: string;
  texture_styling: string;
  facial_grooming: string;
  recommended_products: string[];
}

export interface SkincareMakeupCategory {
  headline: string;
  complexion_prep: string;
  finish_type: string;
  color_palette: ColorSwatch[];
  contouring_roadmap: string;
  skincare_tips: string;
}

export interface StylingResult {
  apparel: ApparelCategory;
  footwear_accessories: FootwearAccessoriesCategory;
  hair_grooming: HairGroomingCategory;
  skincare_makeup: SkincareMakeupCategory;
}

export interface PresetModel {
  id: string;
  name: string;
  gender: string;
  query: string;
  tagline: string;
  avatar_color: string;
  skin_sample_hex: string;
  face_shape: string;
  accent_color: string;
  image_url?: string;
  session_type?: string;
}

export interface PresetsResponse {
  presets: PresetModel[];
  quick_queries: string[];
}

export interface AnalysisResponse {
  success: boolean;
  visual_profile: VisualProfile;
  styling: StylingResult;
  query: string;
  gender: string;
}

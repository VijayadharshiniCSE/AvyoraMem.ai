import axios from 'axios';
import { AnalysisResponse, PresetsResponse, StylingResult, VisualProfile } from '../types/styling';

const API_BASE = '/api';

export const api = {
  // Check backend and AI model health
  async getHealth() {
    const res = await axios.get('/health');
    return res.data;
  },

  // Fetch preset models and quick queries
  async getPresets(): Promise<PresetsResponse> {
    const res = await axios.get(`${API_BASE}/presets`);
    return res.data;
  },

  // Primary analysis endpoint
  async analyzeStyling(
    file: File | null,
    presetId?: string,
    query?: string,
    gender?: string
  ): Promise<AnalysisResponse> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (presetId) {
      formData.append('preset_id', presetId);
    }
    if (query) {
      formData.append('query', query);
    }
    if (gender) {
      formData.append('gender', gender);
    }

    const res = await axios.post(`${API_BASE}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Interactive Category Swapper
  async customizeCategory(
    currentStyling: StylingResult,
    category: string,
    instruction: string,
    visualProfile: VisualProfile,
    genderExpression: string
  ): Promise<{ success: boolean; category: string; updated_styling: StylingResult }> {
    const res = await axios.post(`${API_BASE}/customize`, {
      current_styling: currentStyling,
      category,
      instruction,
      visual_profile: visualProfile,
      gender_expression: genderExpression,
    });
    return res.data;
  },

  // Export full markdown styling blueprint
  async exportBlueprint(
    visualProfile: VisualProfile,
    styling: StylingResult,
    query: string,
    gender: string
  ): Promise<string> {
    const res = await axios.post(
      `${API_BASE}/export-blueprint`,
      {
        visual_profile: visualProfile,
        styling,
        query,
        gender,
      },
      {
        responseType: 'text',
      }
    );
    return res.data;
  },
};

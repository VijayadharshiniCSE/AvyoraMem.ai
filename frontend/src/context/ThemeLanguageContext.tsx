import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, TRANSLATIONS, SUPPORTED_LANGUAGES, LanguageOption } from '../i18n/translations';

type Theme = 'dark' | 'light';

interface ThemeLanguageContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  logoUrl: string;
  languages: LanguageOption[];
  isRtl: boolean;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme initialization from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('avyora_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default luxury obsidian
  });

  // Language initialization from localStorage or English
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('avyora_lang') as LanguageCode;
    if (saved && TRANSLATIONS[saved]) return saved;
    return 'en';
  });

  // Update HTML class & color-scheme when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('avyora_theme', theme);
  }, [theme]);

  // Update HTML lang and dir attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('avyora_lang', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const logoUrl = theme === 'dark' ? '/images/logo_dark.jpg' : '/images/logo_light.jpg';
  const isRtl = language === 'ar';

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        logoUrl,
        languages: SUPPORTED_LANGUAGES,
        isRtl,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = (): ThemeLanguageContextType => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};

"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/languages';
import type { TranslationPreferences } from '@/lib/types';

interface LanguageState {
  primaryLanguage: string;
  secondaryLanguage?: string;
  showTransliteration: boolean;
  setLanguages: (primary: string, secondary?: string) => void;
  toggleTransliteration: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      primaryLanguage: DEFAULT_LANGUAGE,
      showTransliteration: false,
      setLanguages: (primary, secondary) => 
        set({ primaryLanguage: primary, secondaryLanguage: secondary }),
      toggleTransliteration: () => 
        set((state) => ({ showTransliteration: !state.showTransliteration })),
    }),
    {
      name: 'quran-language-preferences',
    }
  )
);

export function useLanguage() {
  const store = useLanguageStore();
  const primaryLanguage = SUPPORTED_LANGUAGES.find(
    (lang) => lang.id === store.primaryLanguage
  );
  const secondaryLanguage = store.secondaryLanguage
    ? SUPPORTED_LANGUAGES.find((lang) => lang.id === store.secondaryLanguage)
    : undefined;

  return {
    primaryLanguage,
    secondaryLanguage,
    showTransliteration: store.showTransliteration,
    setLanguages: store.setLanguages,
    toggleTransliteration: store.toggleTransliteration,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
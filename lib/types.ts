export interface Surah {
  surahName: string;
  surahNameArabic: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
}

export interface Ayah {
  surahName: string;
  ayahNo: number;
  english: string;
  arabic1: string;
  audio: {
    [key: string]: {
      reciter: string;
      url: string;
    };
  };
}

export interface Reciter {
  id: string;
  name: string;
}

export interface ReadingPlanDay {
  name: string;
  surah: Array<{
    [key: string]: [number, number];
  }>;
}

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export interface TranslationPreferences {
  primaryLanguage: string;
  secondaryLanguage?: string;
  showTransliteration: boolean;
}
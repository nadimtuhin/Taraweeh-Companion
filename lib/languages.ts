import { Language } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  {
    id: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
  },
  {
    id: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    direction: 'rtl',
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: 'ltr',
  },
  {
    id: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    direction: 'ltr',
  },
  {
    id: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    direction: 'ltr',
  },
];

export const DEFAULT_LANGUAGE = 'en';
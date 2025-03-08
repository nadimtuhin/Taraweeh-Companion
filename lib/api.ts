import { Surah, Ayah, Reciter } from './types';

const API_BASE_URL = 'https://quranapi.pages.dev/api';

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchWithRetry<T>(
  url: string,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new APIError(`HTTP error! status: ${response.status}`, response.status);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Failed to fetch after multiple retries');
}

export const QuranAPI = {
  getSurahs: () => {
    return fetchWithRetry<Surah[]>(`${API_BASE_URL}/surah.json`);
  },

  getAyah: (surahNumber: number, ayahNumber: number) => {
    return fetchWithRetry<Ayah>(
      `${API_BASE_URL}/${surahNumber}/${ayahNumber}.json`
    );
  },

  getSurah: async (surahNumber: number) => {
    return fetchWithRetry<{
      surahName: string;
      totalAyah: number;
      english: string[];
    }>(`${API_BASE_URL}/${surahNumber}.json`);
  },

  getReciters: () => {
    return fetchWithRetry<{ [key: string]: string }>(
      `${API_BASE_URL}/reciters.json`
    );
  },

  getAudioUrl: (surahNumber: number) => {
    return fetchWithRetry<{
      [key: string]: {
        reciter: string;
        url: string;
        originalUrl: string;
      };
    }>(`${API_BASE_URL}/audio/${surahNumber}.json`);
  },
};
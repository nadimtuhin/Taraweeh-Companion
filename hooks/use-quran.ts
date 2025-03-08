import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QuranAPI } from '@/lib/api';
import { ReadingPlanDay } from '@/lib/types';

const readingPlan: ReadingPlanDay[] = [
  {"name": "day 1", "surah": [{"1": [1, 7]}, {"2": [1, 203]}]},
  {"name": "day 2", "surah": [{"2": [204, 286]}, {"3": [1, 91]}]},
  // ... rest of the reading plan
];

export function useReadingPlan() {
  return useQuery({
    queryKey: ['readingPlan'],
    queryFn: () => Promise.resolve(readingPlan),
    staleTime: Infinity,
  });
}

export function useSurahs() {
  return useQuery({
    queryKey: ['surahs'],
    queryFn: () => QuranAPI.getSurahs(),
    staleTime: Infinity,
  });
}

export function useAyah(surahNumber: number, ayahNumber: number) {
  return useQuery({
    queryKey: ['ayah', surahNumber, ayahNumber],
    queryFn: () => QuranAPI.getAyah(surahNumber, ayahNumber),
    staleTime: Infinity,
  });
}

export function useSurah(surahNumber: number) {
  return useQuery({
    queryKey: ['surah', surahNumber],
    queryFn: () => QuranAPI.getSurah(surahNumber),
    staleTime: Infinity,
  });
}

export function useReciters() {
  return useQuery({
    queryKey: ['reciters'],
    queryFn: () => QuranAPI.getReciters(),
    staleTime: Infinity,
  });
}

export function useAudioUrl(surahNumber: number) {
  return useQuery({
    queryKey: ['audio', surahNumber],
    queryFn: () => QuranAPI.getAudioUrl(surahNumber),
    staleTime: Infinity,
  });
}

export function usePrefetchAyahs(surahNumber: number, startAyah: number, endAyah: number) {
  const queryClient = useQueryClient();

  return () => {
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      queryClient.prefetchQuery({
        queryKey: ['ayah', surahNumber, ayah],
        queryFn: () => QuranAPI.getAyah(surahNumber, ayah),
        staleTime: Infinity,
      });
    }
  };
}
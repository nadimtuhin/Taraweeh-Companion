"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  BookmarkCheck,
  Languages,
  Loader2,
  Eye,
  EyeOff,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAyah } from "@/hooks/use-quran";
import dayPlanData from "@/docs/27.json";
import { AudioPlayer } from "@/components/verse-display/audio-player";
import { VerseContent } from "@/components/verse-display/verse-content";
import { TafsirSection } from "@/components/verse-display/tafsir-section";

// Disable static generation for this page
export const dynamic = "force-dynamic";

// Type definitions for the day plan data
interface SurahEntry {
  number: number;
  name: string;
  verses: number[];
}

interface DayEntry {
  name: string;
  surah: SurahEntry[];
}

function VerseDisplayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get the day from URL query parameters
  const dayParam = searchParams.get("day");
  const surahParam = searchParams.get("surah");
  const ayatParam = searchParams.get("ayat");

  const initialDay = dayParam ? parseInt(dayParam) : 1;
  const initialSurah = surahParam ? parseInt(surahParam) : 1;

  // Handle ayat parameter which could be a single number or a range like "1-5"
  let initialAyah = 1;
  if (ayatParam) {
    // If it's a range, get the first number
    if (ayatParam.includes("-")) {
      initialAyah = parseInt(ayatParam.split("-")[0]);
    } else {
      initialAyah = parseInt(ayatParam);
    }
  }

  const [currentDay, setCurrentDay] = useState<number>(initialDay);
  const [currentSurah, setCurrentSurah] = useState<number>(initialSurah);
  const [currentAyah, setCurrentAyah] = useState<number>(initialAyah);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedReciter, setSelectedReciter] = useState("mishary");
  const [showTranslation, setShowTranslation] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [autoNext, setAutoNext] = useState(false);
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to calculate the next ayah
  const getNextAyahDetails = useCallback(() => {
    // Find the current day entry
    const dayEntry = dayPlanData.find((entry) =>
      entry.name.includes(`day ${currentDay}`)
    ) as DayEntry | undefined;

    if (!dayEntry) return { surah: currentSurah, ayah: currentAyah };

    // Find the current surah in the day's reading plan
    const currentSurahIndex = dayEntry.surah.findIndex(
      (surah) => surah.number === currentSurah
    );

    if (currentSurahIndex === -1) return { surah: currentSurah, ayah: currentAyah };

    const currentSurahEntry = dayEntry.surah[currentSurahIndex];
    const [startVerse, endVerse] = currentSurahEntry.verses;

    // If we're not at the last verse of the current surah
    if (currentAyah < endVerse) {
      return { surah: currentSurah, ayah: currentAyah + 1 };
    }
    // If we're at the last verse but there are more surahs in this day
    else if (currentSurahIndex < dayEntry.surah.length - 1) {
      const nextSurahEntry = dayEntry.surah[currentSurahIndex + 1];
      return { surah: nextSurahEntry.number, ayah: nextSurahEntry.verses[0] };
    }
    // If we're at the last verse of the last surah in this day
    else if (currentDay < 27) {
      // For now, we'll just return the current position since fetching across days is more complex
      return { surah: currentSurah, ayah: currentAyah };
    }
    
    return { surah: currentSurah, ayah: currentAyah };
  }, [currentAyah, currentDay, currentSurah]);

  // Calculate the next ayah details for preloading
  const nextAyahDetails = getNextAyahDetails();

  // Fetch the Ayah data using the hook
  const {
    data: ayahData,
    isLoading,
    isError,
  } = useAyah(currentSurah, currentAyah);

  // Prefetch the next Ayah data
  const {
    data: nextAyahData,
  } = useAyah(nextAyahDetails.surah, nextAyahDetails.ayah);

  // Find the first Ayah for the selected day
  useEffect(() => {
    // Only use plan data to set position if surah and ayat are not specified in URL
    if (!surahParam && !ayatParam) {
      const findAyahForDay = () => {
        // Find the day entry in the plan data
        const dayEntry = dayPlanData.find((entry) =>
          entry.name.includes(`day ${currentDay}`)
        ) as DayEntry | undefined;

        if (dayEntry && dayEntry.surah.length > 0) {
          // Get the first surah and its first verse
          const firstSurah = dayEntry.surah[0];
          setCurrentSurah(firstSurah.number);
          setCurrentAyah(firstSurah.verses[0]);
        }
      };

      findAyahForDay();
    }
  }, [currentDay, surahParam, ayatParam]);

  // Function to update the URL query parameters
  const updateUrlParams = (surah: number, ayah: number, day: number) => {
    const params = new URLSearchParams();
    params.set("surah", surah.toString());
    params.set("ayat", ayah.toString());
    params.set("day", day.toString());

    // Update URL without triggering a page reload
    router.push(`/verse-display?${params.toString()}`, { scroll: false });
  };

  // Update URL when surah or ayah changes
  useEffect(() => {
    if (ayahData) {
      updateUrlParams(currentSurah, currentAyah, currentDay);
    }
  }, [currentSurah, currentAyah, currentDay, ayahData]);

  // Function to navigate to the next Ayah
  const goToNextAyah = useCallback(() => {
    // Find the current day entry
    const dayEntry = dayPlanData.find((entry) =>
      entry.name.includes(`day ${currentDay}`)
    ) as DayEntry | undefined;

    if (!dayEntry) return;

    // Find the current surah in the day's reading plan
    const currentSurahIndex = dayEntry.surah.findIndex(
      (surah) => surah.number === currentSurah
    );

    if (currentSurahIndex === -1) return;

    const currentSurahEntry = dayEntry.surah[currentSurahIndex];
    const [startVerse, endVerse] = currentSurahEntry.verses;

    // If we're not at the last verse of the current surah
    if (currentAyah < endVerse) {
      setCurrentAyah(currentAyah + 1);
    }
    // If we're at the last verse but there are more surahs in this day
    else if (currentSurahIndex < dayEntry.surah.length - 1) {
      const nextSurahEntry = dayEntry.surah[currentSurahIndex + 1];
      setCurrentSurah(nextSurahEntry.number);
      setCurrentAyah(nextSurahEntry.verses[0]);
    }
    // If we're at the last verse of the last surah in this day
    else if (currentDay < 27) {
      // Assuming 27 is the max day
      // Move to the next day
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);
      // The useEffect will handle setting the first surah and verse of the next day
    }
  }, [currentAyah, currentDay, currentSurah, dayPlanData]);

  // Function to navigate to the previous Ayah
  const goToPreviousAyah = useCallback(() => {
    // If we're not at the first verse
    if (currentAyah > 1) {
      setCurrentAyah(currentAyah - 1);
    }
    // If we're at the first verse of a surah (not the first surah of the day)
    else {
      // Find the current day entry
      const dayEntry = dayPlanData.find((entry) =>
        entry.name.includes(`day ${currentDay}`)
      ) as DayEntry | undefined;

      if (!dayEntry) return;

      // Find the current surah in the day's reading plan
      const currentSurahIndex = dayEntry.surah.findIndex(
        (surah) => surah.number === currentSurah
      );

      // If we're not at the first surah of the day
      if (currentSurahIndex > 0) {
        const previousSurahEntry = dayEntry.surah[currentSurahIndex - 1];
        setCurrentSurah(previousSurahEntry.number);
        setCurrentAyah(previousSurahEntry.verses[1]); // Set to the last verse of the previous surah
      }
      // If we're at the first verse of the first surah of the day
      else if (currentDay > 1) {
        // Move to the previous day
        const previousDay = currentDay - 1;
        setCurrentDay(previousDay);
        // The useEffect will handle setting the surah and verse, but we need to manually
        // navigate to the last verse of the last surah of the previous day
        const previousDayEntry = dayPlanData.find((entry) =>
          entry.name.includes(`day ${previousDay}`)
        ) as DayEntry | undefined;

        if (previousDayEntry) {
          const lastSurahEntry =
            previousDayEntry.surah[previousDayEntry.surah.length - 1];
          setCurrentSurah(lastSurahEntry.number);
          setCurrentAyah(lastSurahEntry.verses[1]);
        }
      }
    }
  }, [currentAyah, currentDay, currentSurah, dayPlanData]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          goToPreviousAyah();
          break;
        case "ArrowDown":
        case "ArrowRight":
          goToNextAyah();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextAyah, goToPreviousAyah]);

  // Handle auto-next functionality
  useEffect(() => {
    if (autoNext && ayahData) {
      // Clear any existing timer
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
      }

      // Set a new timer for auto-next (15 seconds)
      autoNextTimerRef.current = setTimeout(() => {
        goToNextAyah();
      }, 15000); // 15 seconds
    }

    return () => {
      // Clean up timer on unmount or when autoNext changes
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
      }
    };
  }, [autoNext, ayahData, goToNextAyah]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/day-selection")}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Day Selection
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <BookmarkPlus className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowTranslation(!showTranslation)}
                  title={showTranslation ? "Hide Translation" : "Show Translation"}
                >
                  {showTranslation ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-[140px]">
                  <Languages className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="urdu">Urdu</SelectItem>
                  <SelectItem value="bangla">Bangla</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading verse...</span>
          </div>
        ) : isError ? (
          <Card className="p-6 mb-6 text-center">
            <p className="text-destructive">
              Failed to load verse. Please try again.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.refresh()}
            >
              Retry
            </Button>
          </Card>
        ) : ayahData ? (
          <>
            <Card className="p-6 mb-6">
              <VerseContent
                surahName={ayahData.surahName}
                ayahNo={ayahData.ayahNo}
                day={currentDay}
                arabic={ayahData.arabic1}
                translation={ayahData.english}
                selectedReciter={selectedReciter}
                setSelectedReciter={setSelectedReciter}
                showTranslation={showTranslation}
                showArabic={showArabic}
              />

              {/* Audio Player */}
              <AudioPlayer
                audioUrl={
                  ayahData.audio && ayahData.audio["1"]
                    ? ayahData.audio["1"].url
                    : null
                }
              />
            </Card>

            <TafsirSection
              ayahNo={ayahData.ayahNo}
              surahName={ayahData.surahName}
              hasAudio={!!(ayahData.audio && ayahData.audio["1"])}
            />

            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-arabic" 
                      checked={showArabic} 
                      onCheckedChange={(checked) => setShowArabic(checked as boolean)}
                    />
                    <label
                      htmlFor="show-arabic"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show Arabic
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-translation" 
                      checked={showTranslation} 
                      onCheckedChange={(checked) => setShowTranslation(checked as boolean)}
                    />
                    <label
                      htmlFor="show-translation"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show Translation
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auto-next" 
                      checked={autoNext} 
                      onCheckedChange={(checked) => setAutoNext(checked as boolean)}
                    />
                    <label
                      htmlFor="auto-next"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Auto Next (15s)
                    </label>
                  </div>                </div>
                <div className="text-sm text-muted-foreground">
                  Use arrow keys (←→↑↓) to navigate
                </div>
              </div>
              <div className="flex justify-between">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={goToPreviousAyah}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Verse
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={goToNextAyah}
              >
                Next Verse
                <ChevronRight className="w-4 h-4" />
              </Button>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default function VerseDisplay() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      }
    >
      <VerseDisplayContent />
    </Suspense>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  PauseCircle,
  Minus,
  Plus,
  Languages,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useAyah } from "@/hooks/use-quran";
import dayPlanData from "@/docs/27.json";

// Example reciters data
const reciters = [
  { id: "mishary", name: "Mishary Rashid Alafasy", available_offline: true },
  { id: "sudais", name: "Abdur-Rahman As-Sudais", available_offline: false },
  { id: "ghamdi", name: "Saad Al-Ghamdi", available_offline: false },
  {
    id: "minshawi",
    name: "Mohamed Siddiq El-Minshawi",
    available_offline: true,
  },
];

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

export default function VerseDisplay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get the day from URL query parameters
  const dayParam = searchParams.get("day");
  const initialDay = dayParam ? parseInt(dayParam) : 1;

  const [currentDay, setCurrentDay] = useState<number>(initialDay);
  const [currentSurah, setCurrentSurah] = useState<number>(1);
  const [currentAyah, setCurrentAyah] = useState<number>(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [fontSize, setFontSize] = useState(24);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isLooping, setIsLooping] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(reciters[0].id);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch the Ayah data using the hook
  const {
    data: ayahData,
    isLoading,
    isError,
  } = useAyah(currentSurah, currentAyah);

  // Find the first Ayah for the selected day
  useEffect(() => {
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
  }, [currentDay]);

  // Audio event listeners
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("loadedmetadata", () => {});
          audioRef.current.removeEventListener("timeupdate", () => {});
        }
      };
    }
  }, []);

  // Function to navigate to the next Ayah
  const goToNextAyah = () => {
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
  };

  // Function to navigate to the previous Ayah
  const goToPreviousAyah = () => {
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
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        currentTime + 5
      );
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 5);
    }
  };

  const handleDownload = async () => {
    const selectedReciterData = reciters.find((r) => r.id === selectedReciter);
    if (!selectedReciterData?.available_offline) {
      toast({
        title: "Download not available",
        description: "This recitation is not available for offline listening.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download started",
      description: "The recitation will be available offline once downloaded.",
    });
    // Implement actual download logic here
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFontSize(Math.min(40, fontSize + 2))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedReciter}
                    onValueChange={setSelectedReciter}
                  >
                    <SelectTrigger className="w-[200px]">
                      <Volume2 className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reciters.map((reciter) => (
                        <SelectItem key={reciter.id} value={reciter.id}>
                          {reciter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownload}
                    title="Download for offline listening"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-semibold">
                    {ayahData.surahName} - Verse {ayahData.ayahNo}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Day {currentDay}
                  </p>
                </div>
                <div
                  className="text-center"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <p className="font-arabic leading-loose">
                    {ayahData.arabic1}
                  </p>
                </div>
                <div className="text-lg">
                  <p className="text-foreground">{ayahData.english}</p>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsLooping(!isLooping)}
                      className={isLooping ? "text-primary" : ""}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                    <Select
                      value={playbackRate.toString()}
                      onValueChange={(value) =>
                        handlePlaybackRateChange(parseFloat(value))
                      }
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.75">0.75x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="1.25">1.25x</SelectItem>
                        <SelectItem value="1.5">1.5x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={skipBackward}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-12 w-12"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <PauseCircle className="h-8 w-8" />
                      ) : (
                        <PlayCircle className="h-8 w-8" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon" onClick={skipForward}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                      value={[volume]}
                      max={100}
                      className="w-[100px]"
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Collapsible
              open={isTafsirOpen}
              onOpenChange={setIsTafsirOpen}
              className="mb-6"
            >
              <Card className="p-6">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex w-full justify-between items-center"
                  >
                    <span className="text-lg font-medium">
                      Tafsir Explanation
                    </span>
                    {isTafsirOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <ScrollArea className="h-[200px] rounded-md">
                    <p className="text-muted-foreground leading-relaxed">
                      {ayahData.audio && ayahData.audio["1"]
                        ? `This is verse ${ayahData.ayahNo} of Surah ${ayahData.surahName}.`
                        : "Tafsir information not available for this verse."}
                    </p>
                  </ScrollArea>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <div className="flex justify-between mt-8">
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
          </>
        ) : null}
      </main>

      <audio
        ref={audioRef}
        src={
          ayahData?.audio && ayahData.audio["1"] ? ayahData.audio["1"].url : ""
        }
        loop={isLooping}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  BookMarked,
  Settings,
  PlayCircle,
  PauseCircle,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { format, isToday, parseISO, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import readingPlan from "@/docs/27.json";

// Define types for the reading plan data
type Surah = {
  number: number;
  name: string;
  verses: number[];
};

type ReadingDay = {
  name: string;
  surah: Surah[];
};

export default function Home() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30); // Example progress
  const [lastReadingDay, setLastReadingDay] = useState<Date | null>(null);
  const [currentDayNumber, setCurrentDayNumber] = useState(1);
  const [readingContent, setReadingContent] = useState<{
    day: string;
    surahs: { name: string; number: number; verses: string }[];
  }>({
    day: "day 1",
    surahs: [{ name: "Al-Fatiha", number: 1, verses: "1-7" }],
  });

  // Fetch last reading day and current reading day from localStorage on component mount
  useEffect(() => {
    const storedLastReading = localStorage.getItem("lastReadingDay");
    const storedDayNumber = localStorage.getItem("currentReadingDay");

    if (storedLastReading) {
      setLastReadingDay(parseISO(storedLastReading));
    } else {
      // Default to today if no reading history exists
      setLastReadingDay(new Date());
      localStorage.setItem("lastReadingDay", new Date().toISOString());
    }

    // Set the current day in the reading plan (1-27)
    if (storedDayNumber) {
      const dayNum = parseInt(storedDayNumber, 10);
      setCurrentDayNumber(dayNum);
      updateReadingContent(dayNum);
    } else {
      // Default to day 1 if no day is stored
      localStorage.setItem("currentReadingDay", "1");
      updateReadingContent(1);
    }
  }, []);

  // Update reading content based on the current day in the reading plan
  const updateReadingContent = (dayNum: number) => {
    // Find the reading day data from the plan (1-indexed)
    // Handle potential issues with the readingPlan data
    if (!readingPlan || dayNum < 1 || dayNum > readingPlan.length) {
      console.error("Invalid reading plan data or day number");
      return;
    }

    // Get the reading data for the current day (array is 0-indexed)
    const dayIndex = dayNum - 1;
    const dayData = readingPlan[dayIndex];

    if (!dayData) {
      console.error("No data found for day", dayNum);
      return;
    }

    // Format the surah data for display
    const formattedSurahs = dayData.surah.map((surah) => ({
      name: surah.name,
      number: surah.number,
      verses: `${surah.verses[0]}-${surah.verses[1]}`,
    }));

    setReadingContent({
      day: dayData.name,
      surahs: formattedSurahs,
    });
  };

  const resumeReading = () => {
    setIsPlaying(!isPlaying);
    // Additional logic to actually resume reading could go here
  };

  // Function to handle starting today's reading if user is behind
  const startTodaysReading = () => {
    setLastReadingDay(new Date());
    localStorage.setItem("lastReadingDay", new Date().toISOString());

    // Move to the next day in the reading plan if not already at the end
    if (currentDayNumber < readingPlan.length) {
      const nextDay = currentDayNumber + 1;
      setCurrentDayNumber(nextDay);
      localStorage.setItem("currentReadingDay", nextDay.toString());
      updateReadingContent(nextDay);
    }
  };

  // Calculate days elapsed since last reading
  const calculateDaysElapsed = () => {
    if (!lastReadingDay) return 0;
    return Math.max(0, differenceInDays(new Date(), lastReadingDay));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => router.push("/day-selection")}
                >
                  <Calendar className="w-4 h-4" />
                  Day Selection
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => router.push("/bookmarks")}
                >
                  <BookMarked className="w-4 h-4" />
                  Bookmarks
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Today's Reading Card */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold mb-2">
                  {lastReadingDay && isToday(lastReadingDay)
                    ? "Today's Reading"
                    : "Continue Your Reading"}
                </h2>
                {lastReadingDay && !isToday(lastReadingDay) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={startTodaysReading}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Start Today
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground">
                {lastReadingDay
                  ? format(lastReadingDay, "MMMM d, yyyy")
                  : format(new Date(), "MMMM d, yyyy")}
                {lastReadingDay && !isToday(lastReadingDay) && (
                  <span className="ml-2 text-sm text-amber-600">
                    ({calculateDaysElapsed()}{" "}
                    {calculateDaysElapsed() === 1 ? "day" : "days"} behind)
                  </span>
                )}
              </p>
              <p className="text-sm font-medium mt-1">
                {readingContent.day} of 27
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={resumeReading}>
              {isPlaying ? (
                <PauseCircle className="h-6 w-6" />
              ) : (
                <PlayCircle className="h-6 w-6" />
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {readingContent.surahs.map((surah, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium mb-1">Surah {surah.name}</h3>
                <p className="text-muted-foreground">Verses {surah.verses}</p>
              </div>
            ))}

            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round((currentDayNumber / 27) * 100)}%</span>
              </div>
              <Progress value={(currentDayNumber / 27) * 100} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Daily Quote */}
        <Card className="p-6 bg-primary/5">
          <h3 className="text-lg font-medium mb-3">Daily Inspiration</h3>
          <blockquote className="text-muted-foreground italic">
            "Indeed, with hardship comes ease."
            <footer className="text-sm mt-2 not-italic">
              — Surah Ash-Sharh [94:6]
            </footer>
          </blockquote>
        </Card>
      </main>
    </div>
  );
}

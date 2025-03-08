"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import readingPlanData from "@/docs/27.json";

// Type definitions
interface SurahEntry {
  number: number;
  name: string;
  verses: number[];
}

interface RawDayEntry {
  name: string;
  surah: SurahEntry[];
}

interface SurahInfo {
  number: string;
  verses: string;
}

interface TransformedDayEntry {
  day: number;
  date: Date;
  surahInfo: SurahInfo[];
  completed: boolean;
  summary: string;
}

// Transform reading plan data to the format needed by the UI
const transformReadingPlan = (completedDays: number[]): TransformedDayEntry[] => {
  return readingPlanData.map((day, index) => {
    // Extract day number from the name
    // More robust parsing - handle potential format issues
    const dayMatch = day.name.match(/\d+/);
    const dayNumber = dayMatch ? parseInt(dayMatch[0]) : index + 1;

    // Format surah information
    const surahInfo: SurahInfo[] = day.surah.map((surahEntry) => {
      return {
        number: surahEntry.number.toString(),
        verses: `${surahEntry.verses[0]}-${surahEntry.verses[1] || surahEntry.verses[0]}`,
      };
    });

    // Create a summary of what's being read
    const summary = surahInfo
      .map((s) => `Surah ${s.number}: Verses ${s.verses}`)
      .join(", ");

    return {
      day: dayNumber,
      date: addDays(startOfToday(), index),
      surahInfo,
      completed: completedDays.includes(dayNumber),
      summary,
    };
  });
};

export default function DaySelection() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [readingPlan, setReadingPlan] = useState<TransformedDayEntry[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const itemsPerPage = 9;

  useEffect(() => {
    // Load completed days from localStorage
    const savedCompletedDays = localStorage.getItem('completedDays');
    const parsedCompletedDays = savedCompletedDays ? JSON.parse(savedCompletedDays) : [];
    setCompletedDays(parsedCompletedDays);
    setReadingPlan(transformReadingPlan(parsedCompletedDays));
  }, []);

  const markDayCompleted = (dayNumber: number) => {
    const updatedCompletedDays = [...completedDays];
    
    if (!updatedCompletedDays.includes(dayNumber)) {
      updatedCompletedDays.push(dayNumber);
      setCompletedDays(updatedCompletedDays);
      localStorage.setItem('completedDays', JSON.stringify(updatedCompletedDays));
      setReadingPlan(transformReadingPlan(updatedCompletedDays));
    }
  };

  const totalPages = Math.ceil(readingPlan.length / itemsPerPage);

  const currentItems = readingPlan.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-semibold">27-Day Reading Plan</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentItems.map((day) => (
            <Card
              key={day.day}
              className={`p-6 transition-all hover:shadow-lg ${
                day.completed ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Day {day.day}</h3>
                  <p className="text-muted-foreground">
                    {format(day.date, "MMMM d, yyyy")}
                  </p>
                </div>
                {day.completed && (
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Reading Plan</h4>
                  <ScrollArea className="h-16 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {day.summary}
                    </p>
                  </ScrollArea>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1 flex items-center justify-center gap-2"
                    variant={day.completed ? "secondary" : "default"}
                    onClick={() => router.push(`/verse-display?day=${day.day}`)}
                  >
                    {day.completed ? "Review Reading" : "Start Reading"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  {!day.completed && (
                    <Button 
                      variant="outline" 
                      onClick={() => markDayCompleted(day.day)}
                      className="flex items-center justify-center"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

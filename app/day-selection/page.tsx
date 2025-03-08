"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Example reading plan data
const readingPlan = Array.from({ length: 27 }, (_, i) => ({
  day: i + 1,
  date: addDays(startOfToday(), i),
  surah: "Al-Baqarah",
  verses: `${i * 5 + 1}-${i * 5 + 5}`,
  completed: i < 5, // Example: first 5 days completed
  summary: "This section discusses the qualities of the believers and the importance of faith.",
}));

export default function DaySelection() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
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
                  <h4 className="font-medium">Surah {day.surah}</h4>
                  <p className="text-sm text-muted-foreground">
                    Verses {day.verses}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {day.summary}
                </p>

                <Button
                  className="w-full mt-4 flex items-center justify-center gap-2"
                  variant={day.completed ? "secondary" : "default"}
                  onClick={() => router.push("/verse-display")}
                >
                  {day.completed ? "Review Reading" : "Start Reading"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
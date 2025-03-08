"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { ReciterSelection } from "./audio-player";

interface VerseContentProps {
  surahName: string;
  ayahNo: number;
  day: number;
  arabic: string;
  translation: string;
  selectedReciter: string;
  setSelectedReciter: (id: string) => void;
}

export function VerseContent({
  surahName,
  ayahNo,
  day,
  arabic,
  translation,
  selectedReciter,
  setSelectedReciter,
}: VerseContentProps) {
  const [fontSize, setFontSize] = useState(24);

  return (
    <>
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
        <ReciterSelection 
          selectedReciter={selectedReciter}
          setSelectedReciter={setSelectedReciter}
        />
      </div>

      <div className="space-y-6">
        <div className="text-center mb-2">
          <h2 className="text-xl font-semibold">
            {surahName} - Verse {ayahNo}
          </h2>
          <p className="text-sm text-muted-foreground">Day {day}</p>
        </div>
        <div className="text-center" style={{ fontSize: `${fontSize}px` }}>
          <p className="font-arabic leading-loose">{arabic}</p>
        </div>
        <div className="text-lg">
          <p className="text-foreground">{translation}</p>
        </div>
      </div>
    </>
  );
}

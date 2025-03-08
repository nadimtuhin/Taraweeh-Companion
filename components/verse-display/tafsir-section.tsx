"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TafsirSectionProps {
  ayahNo: number;
  surahName: string;
  hasAudio: boolean;
}

export function TafsirSection({ ayahNo, surahName, hasAudio }: TafsirSectionProps) {
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);

  return (
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
              {hasAudio
                ? `This is verse ${ayahNo} of Surah ${surahName}.`
                : "Tafsir information not available for this verse."}
            </p>
          </ScrollArea>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

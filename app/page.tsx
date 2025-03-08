"use client";

import { useState } from "react";
import { Calendar, BookMarked, Settings, PlayCircle, PauseCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30); // Example progress

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
              <h2 className="text-2xl font-semibold mb-2">Today's Reading</h2>
              <p className="text-muted-foreground">{format(new Date(), "MMMM d, yyyy")}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <PauseCircle className="h-6 w-6" />
              ) : (
                <PlayCircle className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Surah Al-Baqarah</h3>
              <p className="text-muted-foreground">Verses 1-5</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Progress</span>
                <span>{progress}%</span>
              </div>
              {/* <Progress value={progress} className="h-2" /> */}
            </div>
          </div>
        </Card>

        {/* Daily Quote */}
        <Card className="p-6 bg-primary/5">
          <h3 className="text-lg font-medium mb-3">Daily Inspiration</h3>
          <blockquote className="text-muted-foreground italic">
            "Indeed, with hardship comes ease." 
            <footer className="text-sm mt-2 not-italic">— Surah Ash-Sharh [94:6]</footer>
          </blockquote>
        </Card>
      </main>
    </div>
  );
}
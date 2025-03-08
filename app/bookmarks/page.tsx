"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ChevronLeft,
  Trash2,
  Share2,
  BookmarkCheck,
  Trophy,
  Calendar,
  Flame,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Example bookmark data
const bookmarks = [
  {
    id: 1,
    surah: "Al-Baqarah",
    verseNumber: "255",
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
    dateAdded: new Date(2024, 2, 15),
  },
  {
    id: 2,
    surah: "Al-Fatiha",
    verseNumber: "1-7",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    dateAdded: new Date(2024, 2, 16),
  },
];

// Example progress data
const progressData = {
  totalDays: 27,
  completedDays: 5,
  currentStreak: 5,
  longestStreak: 7,
  milestones: [
    {
      id: 1,
      title: "First Week Complete",
      description: "Completed 7 days of consistent reading",
      achieved: false,
      progress: 71,
    },
    {
      id: 2,
      title: "Early Bird",
      description: "Read Quran for 5 consecutive days",
      achieved: true,
      progress: 100,
    },
  ],
};

export default function BookmarksProgress() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bookmarks");
  const [bookmarksList, setBookmarksList] = useState(bookmarks);

  const deleteBookmark = (id: number) => {
    setBookmarksList(bookmarksList.filter((bookmark) => bookmark.id !== id));
    toast({
      title: "Bookmark deleted",
      description: "Your bookmark has been removed successfully.",
    });
  };

  const shareBookmark = async (bookmark: typeof bookmarks[0]) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bookmark.surah} (${bookmark.verseNumber})`,
          text: `${bookmark.translation}\n\n${bookmark.arabicText}`,
        });
        toast({
          title: "Shared successfully",
          description: "The verse has been shared.",
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support direct sharing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-semibold">My Reading Journey</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Tabs defaultValue="bookmarks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks" className="space-y-4">
            <ScrollArea className="h-[600px] pr-4">
              {bookmarksList.map((bookmark) => (
                <Card key={bookmark.id} className="p-6 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Surah {bookmark.surah}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Verse {bookmark.verseNumber}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => shareBookmark(bookmark)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this bookmark? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBookmark(bookmark.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xl font-arabic text-center leading-loose">
                      {bookmark.arabicText}
                    </p>
                    <p className="text-muted-foreground">
                      {bookmark.translation}
                    </p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Added {format(bookmark.dateAdded, "MMM d, yyyy")}</span>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => router.push("/verse-display")}
                      >
                        View Full
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="progress" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Days Completed</p>
                    <p className="text-2xl font-semibold">
                      {progressData.completedDays}/{progressData.totalDays}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-semibold">
                      {progressData.currentStreak} days
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                    <p className="text-2xl font-semibold">
                      {progressData.longestStreak} days
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Overall Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Reading Plan Progress</span>
                  <span>
                    {Math.round((progressData.completedDays / progressData.totalDays) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(progressData.completedDays / progressData.totalDays) * 100}
                  className="h-2"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Milestones</h3>
              {progressData.milestones.map((milestone) => (
                <Card key={milestone.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-full p-2 ${
                        milestone.achieved
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {milestone.progress}%
                        </span>
                      </div>
                      <Progress value={milestone.progress} className="h-1" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
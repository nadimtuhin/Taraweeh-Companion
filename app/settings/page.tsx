"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ChevronLeft,
  Moon,
  Sun,
  Languages,
  Volume2,
  Clock,
  FastForward,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Example data
const reciters = [
  { id: "mishary", name: "Mishary Rashid Alafasy" },
  { id: "sudais", name: "Abdur-Rahman As-Sudais" },
  { id: "ghamdi", name: "Saad Al-Ghamdi" },
  { id: "minshawi", name: "Mohamed Siddiq El-Minshawi" },
];

const languages = [
  { id: "en", name: "English" },
  { id: "ur", name: "Urdu" },
  { id: "bn", name: "Bengali" },
  { id: "ar", name: "Arabic" },
];

const playbackSpeeds = [
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "1x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" },
];

export default function Settings() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // State for settings
  const [fontSize, setFontSize] = useState(18);
  const [selectedReciter, setSelectedReciter] = useState("mishary");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  const handleReminderToggle = (enabled: boolean) => {
    setRemindersEnabled(enabled);
    if (enabled) {
      // Request notification permission
      if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            toast({
              title: "Reminders enabled",
              description: `You'll receive daily reminders at ${reminderTime}`,
            });
          } else {
            toast({
              title: "Permission denied",
              description: "Please enable notifications to receive reminders",
              variant: "destructive",
            });
            setRemindersEnabled(false);
          }
        });
      }
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
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Appearance */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                <Label>Font Size</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    max={32}
                    min={12}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{fontSize}px</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Language */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Language & Audio</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Translation Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full">
                    <Languages className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.id} value={language.id}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Preferred Reciter</Label>
                <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                  <SelectTrigger className="w-full">
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
              </div>

              <div className="space-y-3">
                <Label>Playback Speed</Label>
                <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                  <SelectTrigger className="w-full">
                    <FastForward className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {playbackSpeeds.map((speed) => (
                      <SelectItem key={speed.value} value={speed.value.toString()}>
                        {speed.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Daily Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily reading reminders
                  </p>
                </div>
                <Switch
                  checked={remindersEnabled}
                  onCheckedChange={handleReminderToggle}
                />
              </div>

              <div className="space-y-3">
                <Label>Reminder Time</Label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
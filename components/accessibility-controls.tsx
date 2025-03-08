"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Type, ZoomIn, Weight as LineHeight, PanelLeftClose } from "lucide-react";

interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  highContrast: boolean;
  reducedMotion: boolean;
  dyslexicFont: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  highContrast: false,
  reducedMotion: false,
  dyslexicFont: false,
};

export function AccessibilityControls() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      // Apply settings to document root
      document.documentElement.style.setProperty('--base-font-size', `${newSettings.fontSize}px`);
      document.documentElement.style.setProperty('--base-line-height', `${newSettings.lineHeight}`);
      document.documentElement.style.setProperty('--letter-spacing', `${newSettings.letterSpacing}px`);
      document.documentElement.classList.toggle('high-contrast', newSettings.highContrast);
      document.documentElement.classList.toggle('reduce-motion', newSettings.reducedMotion);
      document.documentElement.classList.toggle('dyslexic-font', newSettings.dyslexicFont);
      return newSettings;
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          aria-label="Accessibility Settings"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[320px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Accessibility Settings</SheetTitle>
          <SheetDescription>
            Customize your reading experience to make it more comfortable and accessible.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <Label>Text Size</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Adjust the size of all text
                </p>
              </div>
              <span className="text-sm">{settings.fontSize}px</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              min={12}
              max={32}
              step={1}
              onValueChange={([value]) => updateSetting("fontSize", value)}
              aria-label="Text Size"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <LineHeight className="h-4 w-4" />
                  <Label>Line Height</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Adjust the spacing between lines
                </p>
              </div>
              <span className="text-sm">{settings.lineHeight}x</span>
            </div>
            <Slider
              value={[settings.lineHeight * 10]}
              min={10}
              max={25}
              step={1}
              onValueChange={([value]) => updateSetting("lineHeight", value / 10)}
              aria-label="Line Height"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PanelLeftClose className="h-4 w-4" />
                  <Label>Letter Spacing</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Adjust the spacing between letters
                </p>
              </div>
              <span className="text-sm">{settings.letterSpacing}px</span>
            </div>
            <Slider
              value={[settings.letterSpacing]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={([value]) => updateSetting("letterSpacing", value)}
              aria-label="Letter Spacing"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>High Contrast</Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better readability
                </p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                aria-label="High Contrast Mode"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                aria-label="Reduced Motion"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Dyslexic-friendly Font</Label>
                <p className="text-sm text-muted-foreground">
                  Use OpenDyslexic font for better readability
                </p>
              </div>
              <Switch
                checked={settings.dyslexicFont}
                onCheckedChange={(checked) => updateSetting("dyslexicFont", checked)}
                aria-label="Dyslexic-friendly Font"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
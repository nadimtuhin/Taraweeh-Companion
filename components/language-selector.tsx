"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function LanguageSelector() {
  const {
    primaryLanguage,
    secondaryLanguage,
    showTransliteration,
    setLanguages,
    toggleTransliteration,
    supportedLanguages,
  } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Primary Language</DropdownMenuLabel>
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.id}
            onClick={() => setLanguages(language.id, secondaryLanguage?.id)}
          >
            <span className="flex-1">{language.name}</span>
            {primaryLanguage?.id === language.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Secondary Language (Optional)</DropdownMenuLabel>
        {supportedLanguages
          .filter((lang) => lang.id !== primaryLanguage?.id)
          .map((language) => (
            <DropdownMenuItem
              key={language.id}
              onClick={() => setLanguages(primaryLanguage?.id || 'en', language.id)}
            >
              <span className="flex-1">{language.name}</span>
              {secondaryLanguage?.id === language.id && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="transliteration"
              checked={showTransliteration}
              onCheckedChange={toggleTransliteration}
            />
            <Label htmlFor="transliteration">Show Transliteration</Label>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
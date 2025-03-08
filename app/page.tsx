import { Suspense } from "react";
import { Calendar, BookMarked, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import QuranReaderClientComponent from "@/components/QuranReaderClientComponent";
import Link from "next/link";
export default function Home() {
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
                  asChild
                >
                  <Link href="/day-selection">
                    <Calendar className="w-4 h-4" />
                    Day Selection
                  </Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="ghost" className="flex items-center gap-2" asChild>
                  <Link href="/bookmarks">
                    <BookMarked className="w-4 h-4" />
                    Bookmarks
                  </Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="ghost" className="flex items-center gap-2" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading reading plan...</div>}>
          <QuranReaderClientComponent />
        </Suspense>
      </main>
    </div>
  );
}

"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { AppSidebar } from "./AppSidebar"
import { AnimatedMenuIcon } from "../custom/AnimatedMenuIcon"

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-end px-4">
        <div className="flex items-center gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost">
                {isSheetOpen ? "CLOSE" : "MENU"}
                <AnimatedMenuIcon isOpen={isSheetOpen} className="ml-2" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="p-0" srTitle="Navigation Menu">
              <AppSidebar onNavigate={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

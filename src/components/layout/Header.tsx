
"use client"

import Link from "next/link"
import { Car, MessageSquare, HomeIcon, User, Menu, Users, Star, LogIn, Settings, LogOut, Sparkles } from "lucide-react" // Kept Sparkles for now, can be removed if AI Reply is definitely gone
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" // SheetClose removed as it's usually handled by onNavigate or explicit close
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import React, { useEffect, useState, useRef } from "react" // Added useRef
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppSidebar } from "./AppSidebar"


const tabItems = [
  { id: "home", label: "Home", icon: HomeIcon, href: "/#home" },
  { id: "about-us", label: "About Us", icon: Users, href: "/#about-us" },
  { id: "vehicles", label: "Vehicles", icon: Car, href: "/#vehicles" },
  { id: "testimonials", label: "Testimonials", icon: Star, href: "/#testimonials" },
  { id: "contact", label: "Contact Us", icon: MessageSquare, href: "/#contact" },
  // { id: "ai-reply", label: "AI Reply", icon: Sparkles, href: "/#ai-reply" }, // Example of commented out item
];

export function Header() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const { user, login, logout } = useAuth();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observedElementsRef = useRef<Set<Element>>(new Set());


  const handleLogin = () => {
    login({ name: "Demo User", email: "demo@example.com", avatarUrl: "https://placehold.co/100x100.png?text=DU" });
    setIsMobileSheetOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileSheetOpen(false);
  }

  useEffect(() => {
    const handleHashChange = () => {
      // Only update activeTab if not a programmatic scroll, to avoid conflict
      if (!isProgrammaticScroll.current) {
        const hash = window.location.hash.replace("#", "");
        const currentTab = tabItems.find(item => item.id === hash);
        if (currentTab) {
          setActiveTab(currentTab.id);
        } else if (hash === "" && window.location.pathname === "/") {
          setActiveTab("home");
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange, false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        const intersectingEntries = entries
          .filter(entry => entry.isIntersecting && tabItems.some(item => item.id === entry.target.id))
          .map(entry => ({
            id: entry.target.id,
            top: entry.boundingClientRect.top,
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
          }))
          .sort((a, b) => a.top - b.top);

        if (intersectingEntries.length > 0) {
            // Find the entry that is most visible or best candidate
            // For simplicity, pick the first one (highest on screen) that is sufficiently visible
            const bestCandidate = intersectingEntries.find(e => e.intersectionRatio > 0); // ensure it's actually visible
            if (bestCandidate) {
                 setActiveTab(bestCandidate.id);
            }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.01, 0.5] } // Adjust rootMargin to be slightly more generous at bottom. Multiple thresholds can help.
    );
    
    const currentObservedElements = new Set<Element>();
    tabItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
        currentObservedElements.add(element);
      }
    });
    observedElementsRef.current = currentObservedElements;


    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
      observedElementsRef.current.forEach(element => {
        if (element) observer.unobserve(element);
      });
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []); // Keep dependencies minimal for setup/teardown

  const handleTabChange = (value: string) => {
    setActiveTab(value); // Optimistically update UI
    isProgrammaticScroll.current = true;
    
    router.push(`/#${value}`);
    setIsMobileSheetOpen(false);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
      // After scroll, re-evaluate hash just in case
      const currentHash = window.location.hash.replace("#", "");
      if (currentHash === value) {
         setActiveTab(value); // Confirm active tab
      }
    }, 800); // Adjust delay as needed (e.g., scroll duration + buffer)
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo and Mobile Trigger */}
        <div className="flex items-center gap-4">
           <div className="md:hidden">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0" srTitle="Navigation Menu">
                <AppSidebar onNavigate={() => setIsMobileSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/#home" className="flex items-center gap-2" onClick={() => handleTabChange('home')}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M18.5 7.5V2.75C18.5 2.61193 18.3881 2.5 18.25 2.5H5.75C5.61193 2.5 5.5 2.61193 5.5 2.75V7.5H2.75C2.61193 7.5 2.5 7.61193 2.5 7.75V11.25C2.5 11.3881 2.61193 11.5 2.75 11.5H3.55023C3.70082 12.2027 4.00169 12.8548 4.42261 13.4226L2.75 18.5312C2.67157 18.7857 2.80227 19.0434 3.05681 19.1218C3.31135 19.2003 3.56903 19.0696 3.64746 18.8151L5.53696 13.0712C6.63305 13.7478 7.95524 14.1667 9.375 14.2405V21.25C9.375 21.3881 9.48693 21.5 9.625 21.5H14.375C14.5131 21.5 14.625 21.3881 14.625 21.25V14.2405C16.0448 14.1667 17.367 13.7478 18.463 13.0712L20.3525 18.8151C20.431 19.0696 20.6886 19.2003 20.9432 19.1218C21.1977 19.0434 21.3284 18.7857 21.25 18.5312L19.5774 13.4226C19.9983 12.8548 20.2992 12.2027 20.4498 11.5H21.25C21.3881 11.5 21.5 11.3881 21.5 11.25V7.75C21.5 7.61193 21.3881 7.5 21.25 7.5H18.5ZM6.5 3.5H17.5V7.5H6.5V3.5ZM4.47581 11.5C4.55874 10.836 4.7926 10.2135 5.15366 9.66667H18.8463C19.2074 10.2135 19.4413 10.836 19.5242 11.5H4.47581Z" fill="currentColor"/>
            </svg>
            <span className="text-xl font-bold text-primary">Khan Motor</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-grow justify-center">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
            <TabsList className="bg-transparent p-0">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors rounded-md mx-1 flex items-center gap-1.5",
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
                    "data-[state=inactive]:text-foreground/70 data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} variant="outline">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}


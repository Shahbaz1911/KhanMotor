
"use client"

import Link from "next/link"
import { Car, MessageSquare, HomeIcon, User, Settings, LogOut, LogIn, Users, Star, CalendarClock, Plus } from "lucide-react" 
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from "next/navigation"
import React, { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppSidebar } from "./AppSidebar"
import { Separator } from "@/components/ui/separator"


const tabItems = [
  { id: "home", label: "Home", icon: HomeIcon, href: "/#home" },
  { id: "about-us", label: "About Us", icon: Users, href: "/#about-us" },
  { id: "vehicles", label: "Vehicles", icon: Car, href: "/#vehicles" },
  { id: "testimonials", label: "Testimonials", icon: Star, href: "/#testimonials" },
  { id: "book-appointment", label: "Book Drive", icon: CalendarClock, href: "/book-appointment"},
  { id: "contact", label: "Contact Us", icon: MessageSquare, href: "/#contact" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
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
    const determineActiveTab = () => {
      const currentPath = pathname;
      const currentHash = window.location.hash.replace("#", "");

      let newActiveTab = "home"; // Default

      if (currentPath !== "/") {
        // If on a sub-page, try to match its path
        const pathTab = tabItems.find(item => item.href === currentPath);
        if (pathTab) {
          newActiveTab = pathTab.id;
        }
      } else if (currentHash) {
        // If on homepage and there's a hash, use the hash
        const hashTab = tabItems.find(item => item.id === currentHash);
        if (hashTab) {
          newActiveTab = hashTab.id;
        }
      }
      // Otherwise, it defaults to 'home' if on "/" with no hash

      setActiveTab(newActiveTab);
    };

    determineActiveTab(); // Initial check

    const handleHashChange = () => {
      if (!isProgrammaticScroll.current) {
        determineActiveTab();
      }
    };

    window.addEventListener("hashchange", handleHashChange, false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current || pathname !== "/") return; // Only observe on homepage

        const intersectingEntries = entries
          .filter(entry => entry.isIntersecting && tabItems.some(item => item.id === entry.target.id && item.href.startsWith("/#")))
          .map(entry => ({
            id: entry.target.id,
            top: entry.boundingClientRect.top,
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
          }))
          .sort((a, b) => a.top - b.top);

        if (intersectingEntries.length > 0) {
            const bestCandidate = intersectingEntries.find(e => e.intersectionRatio > 0); 
            if (bestCandidate) {
                 setActiveTab(bestCandidate.id);
            }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.01, 0.5] } 
    );
    
    observedElementsRef.current.forEach(element => {
      if (element) observer.unobserve(element);
    });
    observedElementsRef.current.clear();

    if (pathname === "/") { // Only observe homepage sections
      tabItems.forEach(item => {
        if (item.href.startsWith("/#")) {
          const element = document.getElementById(item.id);
          if (element) {
            observer.observe(element);
            observedElementsRef.current.add(element);
          }
        }
      });
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
      observedElementsRef.current.forEach(element => {
        if (element) observer.unobserve(element);
      });
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pathname]); // Re-run when pathname changes

  const handleTabChange = (value: string) => {
    const targetTab = tabItems.find(item => item.id === value);
    if (!targetTab) return;

    setActiveTab(value); 
    setIsMobileSheetOpen(false);

    if (targetTab.href.startsWith("/#")) {
      isProgrammaticScroll.current = true;
      router.push(targetTab.href);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
        const currentHash = window.location.hash.replace("#", "");
        if (currentHash === value) {
           setActiveTab(value);
        }
      }, 800); 
    } else {
      router.push(targetTab.href);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Link (now empty, no visible logo/text) */}
        <Link href="/#home" className="flex items-center gap-2" onClick={() => handleTabChange('home')}>
          {/* SVG and text removed */}
        </Link>

        {/* Desktop Nav Tabs */}
        <div className="hidden md:flex flex-grow justify-center">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
            <TabsList className="bg-transparent p-0">
              {tabItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TabsTrigger
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
                  {index < tabItems.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-5 self-center" 
                    />
                  )}
                </React.Fragment>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Right-aligned items */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth & Theme */}
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

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-muted-foreground text-base font-black" 
                >
                  <Plus />
                  MENU
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0" srTitle="Navigation Menu">
                <AppSidebar onNavigate={() => setIsMobileSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

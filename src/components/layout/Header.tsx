
"use client"

import Link from "next/link"
import { Car, MessageSquare, HomeIcon } from "lucide-react" // Removed Sparkles
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const tabItems = [
  { id: "home", label: "Home", icon: HomeIcon, href: "/#home" },
  { id: "vehicles", label: "Vehicles", icon: Car, href: "/#vehicles" },
  { id: "contact", label: "Contact Us", icon: MessageSquare, href: "/#contact" },
  // { id: "ai-reply", label: "AI Reply", icon: Sparkles, href: "/#ai-reply" }, // Removed AI Reply item
];

export function Header() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const currentTab = tabItems.find(item => item.id === hash);
      if (currentTab) {
        setActiveTab(currentTab.id);
      } else if (hash === "" && window.location.pathname === "/") {
         setActiveTab("home");
      }
    };

    handleHashChange(); 
    window.addEventListener("hashchange", handleHashChange, false);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (tabItems.some(item => item.id === sectionId)) {
                 const currentHash = window.location.hash.replace("#", "");
                 if (currentHash !== sectionId) {
                    setActiveTab(sectionId);
                 }
            }
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 } 
    );

    tabItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
      tabItems.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/#${value}`);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/#home" className="flex items-center gap-2" onClick={() => handleTabChange('home')}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M18.5 7.5V2.75C18.5 2.61193 18.3881 2.5 18.25 2.5H5.75C5.61193 2.5 5.5 2.61193 5.5 2.75V7.5H2.75C2.61193 7.5 2.5 7.61193 2.5 7.75V11.25C2.5 11.3881 2.61193 11.5 2.75 11.5H3.55023C3.70082 12.2027 4.00169 12.8548 4.42261 13.4226L2.75 18.5312C2.67157 18.7857 2.80227 19.0434 3.05681 19.1218C3.31135 19.2003 3.56903 19.0696 3.64746 18.8151L5.53696 13.0712C6.63305 13.7478 7.95524 14.1667 9.375 14.2405V21.25C9.375 21.3881 9.48693 21.5 9.625 21.5H14.375C14.5131 21.5 14.625 21.3881 14.625 21.25V14.2405C16.0448 14.1667 17.367 13.7478 18.463 13.0712L20.3525 18.8151C20.431 19.0696 20.6886 19.2003 20.9432 19.1218C21.1977 19.0434 21.3284 18.7857 21.25 18.5312L19.5774 13.4226C19.9983 12.8548 20.2992 12.2027 20.4498 11.5H21.25C21.3881 11.5 21.5 11.3881 21.5 11.25V7.75C21.5 7.61193 21.3881 7.5 21.25 7.5H18.5ZM6.5 3.5H17.5V7.5H6.5V3.5ZM4.47581 11.5C4.55874 10.836 4.7926 10.2135 5.15366 9.66667H18.8463C19.2074 10.2135 19.4413 10.836 19.5242 11.5H4.47581Z" fill="currentColor"/>
          </svg>
          <span className="text-xl font-bold text-primary">Khan Motor</span>
        </Link>

        <div className="hidden md:flex items-center">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-4">
                <div className="mb-6 flex items-center gap-2">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M18.5 7.5V2.75C18.5 2.61193 18.3881 2.5 18.25 2.5H5.75C5.61193 2.5 5.5 2.61193 5.5 2.75V7.5H2.75C2.61193 7.5 2.5 7.61193 2.5 7.75V11.25C2.5 11.3881 2.61193 11.5 2.75 11.5H3.55023C3.70082 12.2027 4.00169 12.8548 4.42261 13.4226L2.75 18.5312C2.67157 18.7857 2.80227 19.0434 3.05681 19.1218C3.31135 19.2003 3.56903 19.0696 3.64746 18.8151L5.53696 13.0712C6.63305 13.7478 7.95524 14.1667 9.375 14.2405V21.25C9.375 21.3881 9.48693 21.5 9.625 21.5H14.375C14.5131 21.5 14.625 21.3881 14.625 21.25V14.2405C16.0448 14.1667 17.367 13.7478 18.463 13.0712L20.3525 18.8151C20.431 19.0696 20.6886 19.2003 20.9432 19.1218C21.1977 19.0434 21.3284 18.7857 21.25 18.5312L19.5774 13.4226C19.9983 12.8548 20.2992 12.2027 20.4498 11.5H21.25C21.3881 11.5 21.5 11.3881 21.5 11.25V7.75C21.5 7.61193 21.3881 7.5 21.25 7.5H18.5ZM6.5 3.5H17.5V7.5H6.5V3.5ZM4.47581 11.5C4.55874 10.836 4.7926 10.2135 5.15366 9.66667H18.8463C19.2074 10.2135 19.4413 10.836 19.5242 11.5H4.47581Z" fill="currentColor"/>
                  </svg>
                  <span className="text-lg font-bold text-primary">Khan Motor</span>
                </div>
                <nav className="flex flex-col space-y-1">
                   {tabItems.map((item) => (
                    <SheetClose asChild key={item.id}>
                        <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        onClick={() => handleTabChange(item.id)}
                        className={cn(
                            "flex items-center gap-2 w-full justify-start text-base py-3 px-3",
                             activeTab === item.id ? "" : "text-foreground/70"
                        )}
                        >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                        </Button>
                    </SheetClose>
                   ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}


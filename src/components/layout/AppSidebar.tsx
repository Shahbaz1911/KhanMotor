
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HomeIcon, Car, MessageSquare, User, Settings, LogOut, LogIn, Users, Star, ChevronRight } from "lucide-react"; 
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void; // Callback for when a navigation item is clicked
}

const mainNavItems = [
  { id: "home", label: "Home", icon: HomeIcon, href: "/#home" },
  { id: "about-us", label: "About Us", icon: Users, href: "/#about-us" },
  { id: "vehicles", label: "Vehicles", icon: Car, href: "/#vehicles" },
  { id: "testimonials", label: "Testimonials", icon: Star, href: "/#testimonials" },
  { id: "contact", label: "Contact Us", icon: MessageSquare, href: "/#contact" },
];


export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const { user, login, logout } = useAuth();

  const handleLogin = () => {
    login({ name: "Demo User", email: "demo@example.com", avatarUrl: "https://placehold.co/100x100.png?text=DU" });
    if (onNavigate) onNavigate();
  };

  const handleLogout = () => {
    logout();
     if (onNavigate) onNavigate();
  }

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className={cn("flex h-full flex-col border-r bg-background md:hidden", className)}> {/* Added md:hidden */}
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/#home" className="flex items-center gap-2" onClick={handleLinkClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
             <path d="M18.5 7.5V2.75C18.5 2.61193 18.3881 2.5 18.25 2.5H5.75C5.61193 2.5 5.5 2.61193 5.5 2.75V7.5H2.75C2.61193 7.5 2.5 7.61193 2.5 7.75V11.25C2.5 11.3881 2.61193 11.5 2.75 11.5H3.55023C3.70082 12.2027 4.00169 12.8548 4.42261 13.4226L2.75 18.5312C2.67157 18.7857 2.80227 19.0434 3.05681 19.1218C3.31135 19.2003 3.56903 19.0696 3.64746 18.8151L5.53696 13.0712C6.63305 13.7478 7.95524 14.1667 9.375 14.2405V21.25C9.375 21.3881 9.48693 21.5 9.625 21.5H14.375C14.5131 21.5 14.625 21.3881 14.625 21.25V14.2405C16.0448 14.1667 17.367 13.7478 18.463 13.0712L20.3525 18.8151C20.431 19.0696 20.6886 19.2003 20.9432 19.1218C21.1977 19.0434 21.3284 18.7857 21.25 18.5312L19.5774 13.4226C19.9983 12.8548 20.2992 12.2027 20.4498 11.5H21.25C21.3881 11.5 21.5 11.3881 21.5 11.25V7.75C21.5 7.61193 21.3881 7.5 21.25 7.5H18.5ZM6.5 3.5H17.5V7.5H6.5V3.5ZM4.47581 11.5C4.55874 10.836 4.7926 10.2135 5.15366 9.66667H18.8463C19.2074 10.2135 19.4413 10.836 19.5242 11.5H4.47581Z" fill="currentColor"/>
          </svg>
          <span className="text-lg font-bold text-primary">Khan Motor</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-between items-center gap-2 text-base"
              asChild
            >
              <Link href={item.href} onClick={handleLinkClick} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* Sidebar Footer: Auth & Theme Toggle */}
      <div className="mt-auto border-t p-4 space-y-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-auto w-full items-center justify-start gap-3 p-2 text-left">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" sideOffset={10} align="start"> {/* Adjusted sideOffset and align */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLinkClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLinkClick}>
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
          <Button onClick={handleLogin} variant="outline" className="w-full">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        )}
        <div className="flex justify-start"> {/* Ensure ThemeToggle is aligned to start */}
            <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

    

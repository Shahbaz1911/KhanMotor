
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, ChevronLeft, X } from "lucide-react"; 
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void; 
}

const mainNavItems = [
  { id: "home", label: "Home", href: "/#home" }, 
  { id: "about-us", label: "About Us", href: "/#about-us" },
  { id: "vehicles", label: "Vehicles", href: "/#vehicles" },
  { id: "testimonials", label: "Testimonials", href: "/#testimonials" },
  { id: "book-appointment", label: "Book Drive", href: "/book-appointment" },
  { id: "contact", label: "Contact Us", href: "/#contact" },
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
    <div className={cn("flex h-full flex-col border-r bg-background md:hidden", className)}>
      <div className="flex h-16 items-center justify-start border-b px-4">
        <Button
          variant="ghost"
          className="w-full justify-start items-center gap-2 text-4xl font-black font-kajiro"
          onClick={handleLinkClick}
        >
          CLOSE
          <X className="h-12 w-12" strokeWidth={9} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start items-center gap-2 text-4xl font-black font-kajiro"
              asChild
            >
              <Link href={item.href} onClick={handleLinkClick}>
                <ChevronLeft className="h-8 w-8" strokeWidth={4} />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>

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
            <DropdownMenuContent className="w-56 mb-2" sideOffset={10} align="start"> 
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
          <Button onClick={handleLogin} variant="outline" className="w-full font-kajiro">
            Login
          </Button>
        )}
        <div className="flex justify-start"> 
            <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

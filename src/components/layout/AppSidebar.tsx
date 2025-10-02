
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, MoveRight, Instagram, Facebook } from "lucide-react"; 
import { cn } from "@/lib/utils";
import placeholderImages from '@/lib/placeholder-images.json';
import Image from "next/image";

interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void; 
}

const mainNavItems = [
  { id: "home", label: "Home", href: "/#home" }, 
  { id: "about-us", label: "About Us", href: "/#about-us" },
  { id: "vehicles", label: "Vehicles", href: "/vehicles" },
  { id: "testimonials", label: "Review", href: "/#testimonials" },
  { id: "book-appointment", label: "Book Drive", href: "/book-appointment" },
  { id: "contact", label: "Contact Us", href: "/#contact" },
];

const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
];


export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const { user, login, logout } = useAuth();

  const handleLogin = () => {
    login({ name: "Demo User", email: "demo@example.com", avatarUrl: placeholderImages.userAvatar.url });
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
    <div className={cn("h-full flex flex-col", className)}>
       <div className="p-4 md:p-8 border-b border-gray-200 dark:border-white/10 flex justify-start">
         <Link href="/#home" onClick={handleLinkClick}>
            <Image
                src="https://armanautoxperts-in.vercel.app/armanautoxperts/arman.png"
                alt="Arman Autoxperts Logo"
                width={150}
                height={150}
                className="w-32 h-auto"
            />
         </Link>
      </div>
      <div className="flex-grow flex justify-start">
        <nav className="flex flex-col gap-2 p-4 md:p-8 w-full">
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              variant="sidebar"
              className="w-full justify-start text-3xl md:text-4xl font-black text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white relative group py-4"
              asChild
            >
              <Link href={item.href} onClick={handleLinkClick}>
                <span className="group-hover:translate-x-4 transition-transform duration-300">{item.label}</span>
                <MoveRight className="absolute right-0 h-8 w-8 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 p-4 space-y-4">
        <div className="flex items-center justify-start gap-2 px-2"> 
            <ThemeToggle />
            {socialLinks.map((social) => (
                <Button key={social.label} variant="outline" size="icon" asChild>
                    <a
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <social.icon className="h-[1.2rem] w-[1.2rem]" />
                    </a>
                </Button>
            ))}
        </div>
        {user ? (
          <div className="flex justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-auto items-center justify-start gap-3 p-2 text-left text-black dark:text-white w-full">
                  <Avatar className="h-10 w-10 border-2 border-black/20 dark:border-white/20">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-black">{user.name}</p>
                    <p className="text-xs text-black/70 dark:text-white/70">{user.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" side="top" sideOffset={10} align="start"> 
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none">{user.name}</p>
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
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground px-2 text-start">
            Copyright © {new Date().getFullYear()} ArmanAutoXperts | All rights reserved
        </p>
      </div>
    </div>
  );
}

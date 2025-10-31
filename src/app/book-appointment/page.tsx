
"use client";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AnimatedMenuIcon } from "@/components/custom/AnimatedMenuIcon";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Image from "next/image";
import { GalleryThumbnails } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function BookAppointmentPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanwhite.png");

  useEffect(() => {
    setLogoSrc(theme === 'dark' 
      ? "https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack-2.png" 
      : "https://armanautoxperts-in.vercel.app/armanautoxperts/whitelogomotorkhan.png");
  }, [theme]);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const showAnim = gsap.from(headerRef.current, { 
        yPercent: -100,
        paused: true,
        duration: 0.2
      }).progress(1);

      ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
          self.direction === -1 ? showAnim.play() : showAnim.reverse()
        }
      });
      
      // Card fade-in animation
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });

    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={pageRef} className="bg-background">
        <header ref={headerRef} className="fixed top-0 w-full z-50">
          <div className="relative flex justify-between items-center px-4 pt-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground text-sm">
                  MENU
                  <AnimatedMenuIcon isOpen={isSheetOpen} className="ml-2 h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-full bg-white dark:bg-black/80 dark:backdrop-blur-lg border-t dark:border-white/10 p-0" srTitle="Navigation Menu">
                <AppSidebar onNavigate={() => setIsSheetOpen(false)} />
                 <Button 
                    variant="ghost" 
                    onClick={() => setIsSheetOpen(false)} 
                    className="absolute top-4 right-4 text-black dark:text-white hover:bg-black/10 hover:text-black dark:hover:bg-white/10 dark:hover:text-white text-sm"
                    aria-label="Close menu"
                  >
                    CLOSE
                    <AnimatedMenuIcon isOpen={true} className="ml-2 h-4 w-4" />
                 </Button>
              </SheetContent>
            </Sheet>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/">
                <Image 
                    src={logoSrc}
                    alt="Motor Khan Logo"
                    width={150}
                    height={150}
                    className="w-16 md:w-20 h-auto"
                />
              </Link>
            </div>
          
            <Button variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground text-sm" onClick={() => router.push('/gallery')}>
                <GalleryThumbnails className="mr-2 h-4 w-4" />
                GALLERY
            </Button>
          </div>
        </header>
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center min-h-screen justify-center mt-16">
        <Card ref={cardRef} className="w-full max-w-3xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl uppercase">Schedule Your Test Drive</CardTitle>
            <CardDescription>
              choose your preferred date and time. we&apos;re excited to get you behind the wheel!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

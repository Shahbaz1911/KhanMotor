"use client";

import Head from "next/head";
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
  const [logoSrc, setLogoSrc] = useState("https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png");

  useEffect(() => {
    setLogoSrc(theme === 'dark' 
      ? "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png" 
      : "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png");
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
      {/* ✅ SEO META TAGS */}
      <Head>
        <title>Book Appointment – Motor Khan | Car Repair & Test Drive in Rithala, Rohini Delhi</title>
        <meta
          name="description"
          content="Book your car repair or restoration appointment at Motor Khan – Rithala, Rohini, Delhi. Schedule test drives, denting painting, restoration, or regular maintenance with expert car mechanics near Vijay Vihar and Budh Vihar."
        />
        <meta
          name="keywords"
          content="car repair appointment Delhi, car service booking Rohini, schedule test drive Rithala, car restoration Vijay Vihar, car denting painting Budh Vihar, auto repair booking Delhi, car mechanic near me, Motor Khan car workshop, book car service Rohini, car maintenance Delhi"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Book Appointment – Motor Khan | Rithala, Rohini Delhi" />
        <meta
          property="og:description"
          content="Schedule your car repair, test drive, or restoration service with Motor Khan – your trusted auto workshop in Rithala and Rohini, Delhi."
        />
        <meta property="og:image" content="https://delhi.motorkhan.com/images/og/motor-khan-rithala-rohini-delhi.jpg" />
        <meta property="og:url" content="https://delhi.motorkhan.com/appointment" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book Appointment – Motor Khan | Car Service in Delhi" />
        <meta
          name="twitter:description"
          content="Book a car service, denting painting, or test drive at Motor Khan – trusted car repair shop in Rohini, Rithala, Delhi."
        />
        <meta name="twitter:image" content="https://delhi.motorkhan.com/images/og/motor-khan-rithala-rohini-delhi.jpg" />
        <link rel="canonical" href="https://delhi.motorkhan.com/appointment" />
      </Head>

      <header ref={headerRef} className="fixed top-0 w-full z-50">
        <div className="relative flex justify-between items-center px-4 pt-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-foreground text-sm">
                MENU
                <AnimatedMenuIcon isOpen={isSheetOpen} className="ml-2 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-full bg-white dark:bg-black/80 dark:backdrop-blur-lg border-t dark:border-white/10 p-0" srTitle="Navigation Menu">
              <AppSidebar onNavigate={() => setIsSheetOpen(false)} />
              <Button 
                variant="ghost" 
                onClick={() => setIsSheetOpen(false)} 
                className="absolute top-4 right-4 text-black dark:text-white hover:bg-transparent text-sm"
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

          <Button variant="ghost" className="text-foreground text-sm" onClick={() => router.push('/gallery')}>
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
              Choose your preferred date and time. We&apos;re excited to get you behind the wheel!
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

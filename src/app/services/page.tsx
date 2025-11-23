
"use client";

import React, { useEffect, useRef, useState } from "react";
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
import Head from "next/head";
import { ServicesSection } from "@/components/custom/ServicesSection";

export default function ServicesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(
    "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png"
  );

  useEffect(() => {
    setLogoSrc(
      theme === "dark"
        ? "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png"
        : "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png"
    );
  }, [theme]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const showAnim = gsap
        .from(headerRef.current, {
          yPercent: -100,
          paused: true,
          duration: 0.2,
        })
        .progress(1);

      ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
          self.direction === -1 ? showAnim.play() : showAnim.reverse();
        },
      });

      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Our Services | Motor Khan | Car Repair, Painting & Sales in Delhi</title>
        <meta
          name="description"
          content="Discover the comprehensive auto services at Motor Khan in Rohini, Delhi. From expert car denting and painting to certified used car sales, we have you covered."
        />
        <meta
          name="keywords"
          content="car repair near me, rithala car repair, car shop, car service delhi, car denting painting, used car sales rohini, auto repair shop"
        />
      </Head>
      <div ref={pageRef} className="bg-background">
        <header ref={headerRef} className="fixed top-0 w-full z-50">
          <div className="relative flex justify-between items-center px-4 pt-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-foreground text-sm">
                  MENU
                  <AnimatedMenuIcon isOpen={isSheetOpen} className="ml-2 h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-full bg-white dark:bg-black/80 dark:backdrop-blur-lg border-t dark:border-white/10 p-0"
                srTitle="Navigation Menu"
              >
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

            <Button
              variant="ghost"
              className="text-foreground text-sm"
              onClick={() => router.push("/gallery")}
            >
              <GalleryThumbnails className="mr-2 h-4 w-4" />
              GALLERY
            </Button>
          </div>
        </header>

        <main className="py-16 md:py-24 mt-16">
            <div className="container mx-auto px-4 text-center mb-12">
                <h1 className="text-4xl lg:text-5xl font-black uppercase">Our Services</h1>
                <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto lowercase">
                    At Motor Khan, we offer a comprehensive suite of automotive services designed to meet all your needs. From routine maintenance to complete restorations, our expert team in Delhi is equipped with the skills and technology to deliver unparalleled results. We are your one-stop destination for car repair, denting, painting, and premium used car sales.
                </p>
            </div>
          <div ref={titleRef} className="container mx-auto px-4">
            <ServicesSection />
          </div>
        </main>
      </div>
    </>
  );
}

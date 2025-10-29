
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Quote, CalendarClock, GalleryThumbnails } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/ContactForm";
import { HeroSpotlightBanner } from "@/components/custom/HeroSpotlightBanner";
import { WhyChooseUs } from "@/components/custom/WhyChooseUs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AnimatedMenuIcon } from "@/components/custom/AnimatedMenuIcon";
import { cn } from "@/lib/utils";
import { Preloader } from "@/components/custom/Preloader";
import placeholderImages from '@/lib/placeholder-images.json';
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TestimonialMarquee } from "@/components/custom/TestimonialMarquee";
import { ServicesSection } from "@/components/custom/ServicesSection";
import { AchievementsSection } from "@/components/custom/AchievementsSection";
import { HappyCustomerGallery } from "@/components/custom/HappyCustomerGallery";
import { CallToAction } from "@/components/custom/CallToAction";
import { TextMarquee } from "@/components/custom/TextMarquee";
import Link from "next/link";
import { useTheme } from "next-themes";


export default function ConsolidatedPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  const [logoSrc, setLogoSrc] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLogoSrc(theme === 'dark' ? "https://armanautoxperts-in.vercel.app/armanautoxperts/motokhanblack.png" : "https://armanautoxperts-in.vercel.app/armanautoxperts/motokhanwhite.png");
  }, [theme]);


  const aboutText1 = "Driven by a passion for excellence since 1995, Arman Autoxperts offers a curated collection of the world's most prestigious vehicles, handpicked for quality and performance.";
  const aboutText2 = "Our mission is to provide a personalized and transparent journey for discerning automotive enthusiasts.";


  // GSAP Animation Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const headerControlsRef = useRef<HTMLDivElement>(null);
  const headerLogoRef = useRef<HTMLDivElement>(null);
  
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const aboutImageRef = useRef<HTMLDivElement>(null);

  // GSAP Animation useEffect
  useEffect(() => {
    if (!isLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
       // Header controls fade out on scroll
      gsap.to(headerControlsRef.current, {
        autoAlpha: 0,
        scrollTrigger: {
          trigger: pageRef.current,
          start: 'top top',
          end: '+=150',
          scrub: true,
        },
      });

      // Header logo fade in
      gsap.fromTo(headerLogoRef.current, 
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );

      // About Us Animation
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      });
      
      aboutTl
        .from(aboutContentRef.current?.querySelectorAll(".gsap-reveal"), {
          opacity: 0,
          y: 50,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(aboutImageRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.6");


    }, pageRef);

    return () => ctx.revert();
  }, [isLoaded]);


  return (
    <>
      <Preloader onLoaded={() => setIsLoaded(true)} />
      <div ref={pageRef} className={cn("flex flex-col relative bg-background", !isLoaded && "opacity-0 invisible")}>
        <div ref={headerControlsRef} className="fixed top-4 w-full px-4 z-50 flex justify-between items-center">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white text-sm">
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

            <div ref={headerLogoRef} className="absolute left-1/2 -translate-x-1/2">
              <Link href="/">
                {mounted && logoSrc && (
                  <Image 
                      src={logoSrc}
                      alt="Arman Autoxperts Logo"
                      width={150}
                      height={150}
                      className="w-28 h-auto"
                  />
                )}
              </Link>
            </div>
          
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white text-sm" onClick={() => router.push('/gallery')}>
                <GalleryThumbnails className="mr-2 h-4 w-4" />
                GALLERY
            </Button>
        </div>

        {/* Section 1: Home */}
        <section id="home" className="relative w-full h-screen overflow-hidden">
           <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://media-alpha-green.vercel.app/video/car.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <HeroSpotlightBanner isLoaded={isLoaded} />
        </section>

        {/* These sections are part of the "Home" experience but don't have direct nav links */}
        <AchievementsSection />
        
        {/* Section 2: About Us */}
        <section ref={aboutSectionRef} id="about-us" className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div ref={aboutContentRef}>
              <h2 className="gsap-reveal mb-6 scroll-m-20 text-4xl tracking-tight lg:text-5xl font-black uppercase">
                About Us
              </h2>
              <div className="gsap-reveal">
                <TextGenerateEffect words={aboutText1.toLowerCase()} className="mb-4" />
              </div>
              <div className="gsap-reveal">
                <TextGenerateEffect words={aboutText2.toLowerCase()} className="mb-6" />
              </div>

              <Button 
                variant="outline" 
                size="lg" 
                className="group gsap-reveal bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive" 
                onClick={() => router.push('/contact')}
              >
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div ref={aboutImageRef} className="relative h-80 md:h-[450px] w-full overflow-hidden rounded-lg shadow-xl">
              <Image
                src={placeholderImages.about.url}
                alt="Arman Autoxperts Dealership Interior"
                fill
                className="rounded-lg object-cover"
                data-ai-hint={placeholderImages.about.aiHint}
              />
            </div>
          </div>
        </section>
        
        <TextMarquee />
        <ServicesSection />

        <WhyChooseUs />
        
        {/* Section 4: Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 overflow-hidden">
           <div className="container mx-auto px-4 mb-12">
            <h2 className="scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl font-black uppercase">
              What Our Clients Say
            </h2>
           </div>
           <TestimonialMarquee />
        </section>

        <HappyCustomerGallery />

        <CallToAction />

        {/* Section 6: Contact Us */}
        <section id="contact" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center justify-center">
          <ContactForm />
        </section>

      </div>
    </>
  );
}


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
import { ServicesSection } from "@/components/custom/ServicesSection";
import { AchievementsSection } from "@/components/custom/AchievementsSection";
import { HappyCustomerGallery } from "@/components/custom/HappyCustomerGallery";
import { CallToAction } from "@/components/custom/CallToAction";
import { TextMarquee } from "@/components/custom/TextMarquee";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/shadcn-carousel";
import Autoplay from "embla-carousel-autoplay";
import CircularText from "@/components/custom/CircularText";
import ScrollReveal from "@/components/custom/ScrollReveal";
import GoogleGeminiEffectDemo from "@/components/custom/GoogleGeminiEffectDemo";
import { TestimonialParallax } from "@/components/custom/TestimonialParallax";


export default function ConsolidatedPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  const [logoSrc, setLogoSrc] = useState("https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack-2.png");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // The logo is now static, so we don't need to update it based on theme
  }, []);


  const aboutText1 = "since 1995, motor khan has been your trusted car workshop for premium used cars and expert auto repair. as a leading car dealership in rithala, delhi, we specialize in certified pre-owned vehicles, ensuring quality and reliability. we are the mechanic near you that you can trust for everything from a simple oil change service to complex transmission repair.";
  const aboutText2 = "we aim to make buying a car or servicing your current one a transparent and personal experience. whether you need brake repair, car detailing, or are looking to sell your car, our team is here to provide affordable car repair and exceptional service.";


  // GSAP Animation Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const headerControlsRef = useRef<HTMLDivElement>(null);
  const headerLogoRef = useRef<HTMLDivElement>(null);
  
  
  const aboutCarouselImages = [
      placeholderImages.about,
      (placeholderImages as any).about2,
      (placeholderImages as any).about3
  ].map(img => ({
    title: img.aiHint,
    button: "Learn More",
    src: img.url,
    aiHint: img.aiHint
  }));


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
                {mounted && (
                  <Image 
                      src="https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack-2.png"
                      alt="Motor Khan Logo"
                      width={150}
                      height={150}
                      className="w-16 md:w-28 h-auto"
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
        <section id="about-us" className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6 scroll-m-20 text-4xl tracking-tight lg:text-5xl font-black uppercase">
                Your Trusted Auto Repair Shop & Car Dealership
              </h2>
              <p className="text-lg text-muted-foreground my-5">
                {aboutText1}
              </p>
              <p className="text-lg text-muted-foreground my-5">
                {aboutText2}
              </p>

              <Button 
                variant="outline" 
                size="lg" 
                className="group bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive" 
                onClick={() => router.push('/contact')}
              >
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="relative h-80 md:h-[450px] w-full overflow-hidden rounded-lg shadow-xl">
               <Carousel 
                className="w-full h-full"
                plugins={[
                    Autoplay({
                      delay: 2000,
                      stopOnInteraction: false,
                      stopOnMouseEnter: true,
                    }),
                  ]}
               >
                <CarouselContent>
                  {aboutCarouselImages.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="w-full h-80 md:h-[450px] relative">
                         <Image 
                            src={img.src} 
                            alt={img.title} 
                            fill
                            className="object-cover"
                            data-ai-hint={img.aiHint}
                         />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>
        
        <TextMarquee />
        <ServicesSection />

        <CallToAction />

        <WhyChooseUs />
        
        {/* Section 4: Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 bg-background">
          <TestimonialParallax />
        </section>

        <HappyCustomerGallery />
        
        <GoogleGeminiEffectDemo />

        {/* Section 6: Contact Us */}
        <section id="contact" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center justify-center">
          <ContactForm />
        </section>

      </div>
    </>
  );
}

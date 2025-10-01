
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


export default function ConsolidatedPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aboutText1 = "At Khan Motor, we are driven by a passion for excellence and a commitment to providing an unparalleled automotive experience. Established in 2010, we have curated a collection of the world's most prestigious vehicles, handpicked for their quality, performance, and timeless appeal.";
  const aboutText2 = "Our mission is to connect discerning enthusiasts with extraordinary automobiles. We believe that purchasing a luxury vehicle should be as exceptional as owning one. Our knowledgeable team offers personalized service, expert advice, and a transparent process, ensuring your journey with us is memorable from start to finish.";


  // GSAP Animation Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const headerControlsRef = useRef<HTMLDivElement>(null);
  
  const aboutSectionRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

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

      // About Us Animation
      gsap.from(aboutSectionRef.current, {
          scrollTrigger: {
              trigger: aboutSectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
      });

      // CTA Animation
      gsap.from(ctaSectionRef.current, {
          scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
          },
          opacity: 0,
          scale: 0.95,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
      });
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
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white text-base">
                  MENU
                  <AnimatedMenuIcon isOpen={isSheetOpen} className="ml-3 h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-full bg-black/80 backdrop-blur-lg border-t border-white/10 p-0" srTitle="Navigation Menu">
                <AppSidebar onNavigate={() => setIsSheetOpen(false)} />
                 <Button 
                    variant="ghost" 
                    onClick={() => setIsSheetOpen(false)} 
                    className="absolute top-4 right-4 text-white hover:bg-white/10 hover:text-white text-base"
                    aria-label="Close menu"
                  >
                    CLOSE
                    <AnimatedMenuIcon isOpen={true} className="ml-3 h-5 w-5" />
                 </Button>
              </SheetContent>
            </Sheet>
          
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white text-base" onClick={() => router.push('/vehicles')}>
                <GalleryThumbnails className="mr-3 h-5 w-5" />
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
        <WhyChooseUs />
        <ServicesSection />
        
        {/* Section 2: About Us */}
        <section ref={aboutSectionRef} id="about-us" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div >
              <h2 className="mb-6 scroll-m-20 text-4xl tracking-tight lg:text-5xl text-white font-black">
                About Khan Motor
              </h2>
              <TextGenerateEffect words={aboutText1} className="mb-4" />
              <TextGenerateEffect words={aboutText2} className="mb-6" />

              <Button size="lg" className="group" onClick={() => router.push('/#contact')}>
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="relative h-80 md:h-[450px] w-full overflow-hidden rounded-lg shadow-xl">
              <Image
                src={placeholderImages.about.url}
                alt="Khan Motor Dealership Interior"
                fill
                className="rounded-lg object-cover"
                data-ai-hint={placeholderImages.about.aiHint}
              />
            </div>
          </div>
        </section>
        
        {/* Section 4: Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 overflow-hidden">
           <div className="container mx-auto px-4 mb-12">
            <h2 className="scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl text-white font-black">
              What Our Clients Say
            </h2>
           </div>
           <TestimonialMarquee />
        </section>

        {/* Section 5: Book Drive CTA (This section promotes booking, not the booking page itself) */}
        <section ref={ctaSectionRef} id="book-drive-cta" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden shadow-xl border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 backdrop-blur-md text-white">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <CalendarClock className="h-16 w-16 text-white mb-6" />
                  <h2 className="mb-4 scroll-m-20 text-3xl tracking-tight lg:text-4xl text-white font-black">
                    Ready for an Unforgettable Drive?
                  </h2>
                  <p className="mb-8 text-lg text-gray-300">
                    Experience the thrill and luxury of your dream car. Schedule a personalized test drive today and let our experts guide you through every feature.
                  </p>
                  <Button size="lg" className="group text-lg px-8 py-6" onClick={() => router.push('/book-appointment')}>
                    Book Your Test Drive
                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                <div className="relative h-64 md:h-full min-h-[300px] order-first md:order-last">
                  <Image
                    src={placeholderImages.cta.url}
                    alt="Luxury car steering wheel view"
                    fill
                    className="md:rounded-r-lg object-cover"
                    data-ai-hint={placeholderImages.cta.aiHint}
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/50 md:via-transparent"></div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 6: Contact Us */}
        <section id="contact" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center justify-center">
          <ContactForm />
        </section>

      </div>
    </>
  );
}

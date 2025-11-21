
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
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { LinkPreview } from "@/components/ui/link-preview";
import { ExpertiseSection } from "@/components/custom/ExpertiseSection";
import { LocationMap } from "@/components/custom/LocationMap";
import { FaqSection } from "@/components/custom/FaqSection";
import { ServicesSection } from "@/components/custom/ServicesSection";
import IphoneDemo from "@/components/custom/IphoneDemo";


export default function ConsolidatedPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [heroInView, setHeroInView] = useState(true);

  // GSAP Animation Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  
  
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

  const [logoSrc, setLogoSrc] = useState("https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set logo based on theme and hero section visibility
  useEffect(() => {
    if (mounted) {
      const isDark = theme === 'dark';
      if (heroInView && !isDark) {
        setLogoSrc("https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png");
      } else if (isDark) {
        setLogoSrc("https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png");
      } else {
        setLogoSrc("https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png");
      }
    }
  }, [theme, mounted, heroInView]);

  // GSAP Animation useEffect
  useEffect(() => {
    if (!isLoaded) return;
    
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

        // Trigger for hero section visibility
        ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom top",
          onToggle: ({ isActive }) => setHeroInView(isActive),
        });

    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    }
  }, [isLoaded]);

  return (
    <>
      <AnimatePresence>
        {!isLoaded && <Preloader onLoaded={() => setIsLoaded(true)} />}
      </AnimatePresence>
      <motion.div 
        ref={pageRef} 
        className={cn("flex flex-col relative bg-background")}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <header ref={headerRef} className="fixed top-0 w-full z-50">
           <div className="relative flex justify-between items-center px-4 pt-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className={cn(
                  "text-sm hover:bg-transparent",
                  mounted && heroInView && theme === 'light' ? "text-white" : "text-foreground"
                )}>
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
                {mounted && (
                  <Image 
                      src={logoSrc}
                      alt="Motor Khan Logo"
                      width={150}
                      height={150}
                      className="w-16 md:w-20 h-auto"
                      priority
                  />
                )}
              </Link>
            </div>
          
            <Button variant="ghost" className={cn(
                "text-sm hover:bg-transparent uppercase",
                mounted && heroInView && theme === 'light' ? "text-white" : "text-foreground"
              )} onClick={() => router.push('/gallery')}>
                <GalleryThumbnails className="mr-2 h-4 w-4" />
                Gallery
            </Button>
          </div>
        </header>

        {/* Section 1: Home */}
        <section ref={heroSectionRef} id="home" className="relative w-full h-screen overflow-hidden">
           <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://delhi.motorkhan.com/videos/motor-khan-rithala-rohini-delhi.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <HeroSpotlightBanner isLoaded={isLoaded} />
        </section>

        {/* Short About Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-4xl tracking-tight lg:text-5xl font-black uppercase">
                A Legacy of Automotive Passion
              </h2>
              <p className="mt-4 text-lg text-muted-foreground lowercase">
                Since 1995, Motor Khan has been the trusted name in Delhi for exceptional car care and sales. We combine decades of experience with a passion for perfection, ensuring every vehicle that leaves our workshop is a testament to our commitment to quality.
              </p>
              <div className="mt-8 flex justify-center">
                  <Link href="/about">
                      <CircularText
                          text="EXPLORE✧OUR✧STORY✧"
                          onHover="speedUp"
                          spinDuration={20}
                          className="text-sm text-foreground"
                      />
                  </Link>
              </div>
            </motion.div>
          </div>
        </section>


        {/* These sections are part of the "Home" experience but don't have direct nav links */}
        <AchievementsSection />
        
        <TextMarquee />
        
        <ExpertiseSection />

        <CallToAction />

        <section id="why-choose-us" className="py-16 md:py-24 bg-background overflow-x-hidden">
          <div className="container mx-auto px-4">
              <motion.div
                  className="mb-16 text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.7 }}
                  variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              >
                  <motion.h2
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                      className="text-4xl tracking-tight lg:text-5xl font-black uppercase"
                  >
                      The Motor Khan Advantage
                  </motion.h2>
                  <motion.p
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } } }}
                      className="text-lg text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto lowercase"
                  >
                      experience the difference at our auto service center, where every detail is crafted for your satisfaction.
                  </motion.p>
              </motion.div>
              <WhyChooseUs />
          </div>
        </section>
        
        {/* Section 4: Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 bg-background">
          <TestimonialParallax />
        </section>

        <HappyCustomerGallery />

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
             <IphoneDemo />
          </div>
        </section>
        
        <GoogleGeminiEffectDemo />

        <LocationMap />

        {/* Section 5: FAQ */}
        <FaqSection />

        {/* Section 6: Contact Us */}
        <section id="contact" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center justify-center">
          <ContactForm />
        </section>

      </motion.div>
    </>
  );
}

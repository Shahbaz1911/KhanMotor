
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
import { motion } from "framer-motion";
import Head from "next/head";
import { LinkPreview } from "@/components/ui/link-preview";


export default function ConsolidatedPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  const [logoSrc, setLogoSrc] = useState("https://armanautoxperts-in.vercel.app/armanautoxperts/motokhanblack-2.png");
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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Car Restoration & Detailing",
    "provider": {
      "@type": "AutoRepair",
      "name": "Motor Khan",
      "url": "https://motorkhan.com"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Delhi, India"
    },
    "description": "MotorKhan offers expert car restoration, detailing, polishing, and interior care services in Delhi."
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "MotorKhan",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150"
    },
    "review": [
      {
        "@type": "Review",
        "author": "Sarah L.",
        "reviewBody": "Motor Khan provided an unparalleled buying experience. Their attention to detail and customer service is top-notch. I found my dream car!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      },
      {
        "@type": "Review",
        "author": "John B.",
        "reviewBody": "The team at Motor Khan made my first luxury car purchase seamless and enjoyable. Highly knowledgeable and no pressure.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does Motor Khan offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We specialize in car restoration, detailing, denting and painting, car repair, servicing, and buying/selling certified pre-owned cars."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Motor Khan located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MotorKhan is located at Shop No 12, Vijay Vihar Phase I, Block B, Near Rice Mill, Rithala, Rohini, Delhi, 110085."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer financing options?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we work with multiple partners to provide flexible financing options for your vehicle purchase."
        }
      }
    ]
  };


  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
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
          <motion.div 
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="mb-6 scroll-m-20 text-4xl tracking-tight lg:text-5xl font-black uppercase">
                Your Trusted Auto Repair Shop & Car Dealership
              </h2>
              <div className="text-lg text-muted-foreground my-5 space-y-4">
                  <span>
                    Since 1995, Motor Khan has been your trusted car workshop for premium used cars and expert auto repair. As a leading car dealership in Rithala, Delhi, we specialize in <span><LinkPreview url="/gallery" className="font-bold text-primary" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/gallerypage.png">certified pre-owned vehicles</LinkPreview></span>, ensuring quality and reliability. We are the <span><LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/contactpage.png">mechanic near you</LinkPreview></span> that you can trust for everything from a simple oil change service to complex transmission repair.
                  </span>
                  <span>
                    We aim to make buying a car or servicing your current one a transparent and personal experience. Whether you need brake repair, car detailing, or are looking to <span><LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://armanautoxperts-in.vercel.app/armanautoxperts/contactpage.png">sell your car</LinkPreview></span>, our team is here to provide affordable car repair and exceptional service.
                  </span>
              </div>

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
          </motion.div>
        </section>
        
        <section className="container mx-auto px-4 py-16 md:py-24">
          <ScrollReveal>
              At Motor Khan, we don't just sell and service cars—we build relationships. Our passion for automotive excellence is matched only by our commitment to customer satisfaction.
          </ScrollReveal>
          <ScrollReveal>
              For over two decades, we've been the go-to destination in Rithala for those who demand quality, transparency, and a personal touch.
          </ScrollReveal>
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

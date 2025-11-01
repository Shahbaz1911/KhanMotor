
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, GalleryThumbnails } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AnimatedMenuIcon } from "@/components/custom/AnimatedMenuIcon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { LinkPreview } from "@/components/ui/link-preview";
import ScrollReveal from "@/components/custom/ScrollReveal";

export default function AboutPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { theme } = useTheme();

  const [logoSrc, setLogoSrc] = useState("https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png");

  // GSAP Animation Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    setLogoSrc(theme === 'dark' 
      ? "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png" 
      : "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png");
  }, [theme]);

  // GSAP Animation useEffect
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

    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    }
  }, []);

  return (
    <div ref={pageRef} className="bg-background">
      <header ref={headerRef} className="fixed top-0 w-full z-50">
           <div className="relative flex justify-between items-center px-4 pt-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-foreground text-sm hover:bg-transparent">
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
                    priority
                />
              </Link>
            </div>
          
            <Button variant="ghost" className="text-foreground text-sm hover:bg-transparent" onClick={() => router.push('/gallery')}>
                <GalleryThumbnails className="mr-2 h-4 w-4" />
                GALLERY
            </Button>
          </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24 mt-16">
        <section ref={aboutSectionRef} id="about-us">
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
                    Since 1995, Motor Khan has been your trusted car workshop for premium used cars and expert auto repair. As a leading car dealership in Rithala, Delhi, we specialize in <span><LinkPreview url="/gallery" className="font-bold text-primary" isStatic imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-gallery.png">certified pre-owned vehicles</LinkPreview></span>, ensuring quality and reliability. We are the <span><LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-contact.png">mechanic near you</LinkPreview></span> that you can trust for everything from a simple oil change service to complex transmission repair.
                  </span>
                  <span>
                    We aim to make buying a car or servicing your current one a transparent and personal experience. Whether you need brake repair, car detailing, or are looking to <span><LinkPreview url="/contact" className="font-bold text-primary" isStatic imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-contact.png">sell your car</LinkPreview></span>, our team is here to provide affordable car repair and exceptional service.
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
               <video
                src="https://delhi.motorkhan.com/videos/motor-khan-rithala-rohini-delhi-about.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
               />
            </div>
          </motion.div>
        </section>
        
        <section className="py-16 md:py-24">
          <ScrollReveal>
              At Motor Khan, we don't just sell and service cars—we build relationships. Our passion for automotive excellence is matched only by our commitment to customer satisfaction.
          </ScrollReveal>
          <ScrollReveal>
              For over two decades, we've been the go-to destination in Rithala for those who demand quality, transparency, and a personal touch.
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
}

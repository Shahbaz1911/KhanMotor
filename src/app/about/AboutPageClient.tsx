
"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, GalleryThumbnails } from "lucide-react";
import { useRouter } from "next/navigation";
import { LinkPreview } from "@/components/ui/link-preview";
import ScrollReveal from "@/components/custom/ScrollReveal";
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AnimatedMenuIcon } from '@/components/custom/AnimatedMenuIcon';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const AboutContent = () => {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto py-16 md:py-24">
            <h2 className="mb-6 text-4xl tracking-tight lg:text-5xl font-black uppercase text-foreground">
                Your Trusted Auto Repair Shop & Car Dealership
            </h2>
            <div className="text-lg text-muted-foreground my-5 space-y-4">
                <span>
                  Since 1995, Motor Khan has been your trusted car workshop for premium used cars and expert auto repair.
                  As a leading car dealership in Rithala, Delhi, we specialize in{" "}
                  <LinkPreview
                    url="/gallery"
                    className="font-bold text-primary"
                    isStatic
                    imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-gallery.png"
                  >
                    certified pre-owned vehicles
                  </LinkPreview>
                  , ensuring quality and reliability.
                </span>
                <span>
                  Whether you need brake repair, denting, car painting, or{" "}
                  <LinkPreview
                    url="/contact"
                    className="font-bold text-primary"
                    isStatic
                    imageSrc="https://delhi.motorkhan.com/images/motor-khan-rithala-rohini-delhi-contact.png"
                  >
                    want to sell your car
                  </LinkPreview>
                  , our expert team ensures affordable and reliable service across Rohini, Rithala, Vijay Vihar, and Budh Vihar.
                </span>
            </div>

            <Button
                variant="outline"
                size="lg"
                className="group bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
                onClick={() => router.push("/contact")}
            >
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <section className="py-16 md:py-24">
              <ScrollReveal>
                At Motor Khan, we don’t just sell and service cars — we build relationships. Our passion for automotive
                excellence drives us to deliver the best car repair and restoration services in Delhi NCR.
              </ScrollReveal>
              <ScrollReveal>
                Visit us in Rohini or Rithala to experience top-tier craftsmanship, transparent pricing, and trusted service.
              </ScrollReveal>
            </section>
        </div>
    );
};

export function AboutPageClient() {
    const router = useRouter();
    const pageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { theme } = useTheme();
    const [logoSrc, setLogoSrc] = useState("https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png");

    useEffect(() => {
        setLogoSrc(theme === 'dark' 
        ? "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-darktheme.png" 
        : "https://delhi.motorkhan.com/images/logo/motor-khan-rithala-rohini-delhi-lighttheme.png");
    }, [theme]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        const resetEvent = new Event('resetSection');
        window.dispatchEvent(resetEvent);
        
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
        };

    }, []);

    return (
        <div ref={pageRef} className="min-h-screen bg-background">
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
            <ScrollExpandMedia
                mediaType="video"
                mediaSrc="https://delhi.motorkhan.com/videos/motor-khan-rithala-rohini-delhi-about.mp4"
                title="About Motor Khan"
                date="Since 1995"
                scrollToExpand="Scroll to Explore"
                textBlend
            >
                <AboutContent />
            </ScrollExpandMedia>
        </div>
    );
}

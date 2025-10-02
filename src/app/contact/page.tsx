
"use client";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowRight, GalleryThumbnails } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AnimatedMenuIcon } from "@/components/custom/AnimatedMenuIcon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
];

const contactDetails = [
    { icon: MapPin, text: '123 Luxury Drive, Prestige City, 12345', href: 'https://maps.google.com' },
    { icon: Phone, text: '(123) 456-7890', href: 'tel:1234567890' },
    { icon: Mail, text: 'contact@khanmotor.com', href: 'mailto:contact@khanmotor.com' },
]

export default function ContactPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerControlsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header fade in
       gsap.fromTo(headerControlsRef.current, 
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
      
      // Header fade out on scroll
      ScrollTrigger.create({
        trigger: pageRef.current,
        start: "top top",
        onUpdate: (self) => {
          if (self.scroll() > 100) { 
            gsap.to(headerControlsRef.current, { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.out" });
          } else {
            gsap.to(headerControlsRef.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.in" });
          }
        },
      });

    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    }
  }, []);


  return (
    <div ref={pageRef} className="bg-background">
        <div ref={headerControlsRef} className="fixed top-4 w-full px-4 z-50 flex justify-between items-center">
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
                  <Image 
                      src="https://armanautoxperts-in.vercel.app/armanautoxperts/arman.png"
                      alt="Arman Autoxperts Logo"
                      width={150}
                      height={150}
                      className="w-28 h-auto"
                  />
              </div>
            
              <Button variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground text-sm" onClick={() => router.push('/gallery')}>
                  <GalleryThumbnails className="mr-2 h-4 w-4" />
                  GALLERY
              </Button>
          </div>
        <div className="container mx-auto px-4 py-16 md:py-24 min-h-screen flex items-center justify-center mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="flex flex-col justify-center"
            >
              <h1 className="text-4xl lg:text-5xl font-black mb-4">Connect With Us</h1>
              <p className="text-lg text-muted-foreground mb-8">
                We&apos;re here to help with all your automotive needs. Reach out today and let us know how we can assist you.
              </p>
              <div className="space-y-6">
                  {contactDetails.map((item, index) => (
                      <Link key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-lg">
                          <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                             <item.icon className="h-6 w-6" />
                          </div>
                          <span className="group-hover:underline">{item.text}</span>
                      </Link>
                  ))}
              </div>

               <Button onClick={() => router.push('/#contact')} size="lg" className="group mt-8">
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Follow Our Journey</h3>
                 <div className="flex gap-4">
                    {socialLinks.map((social) => (
                        <Button key={social.label} variant="outline" size="icon" asChild>
                            <a
                            href={social.href}
                            aria-label={social.label}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-12 w-12"
                            >
                            <social.icon className="h-6 w-6" />
                            </a>
                        </Button>
                    ))}
                </div>
              </div>
            </motion.div>

            <motion.div
                 initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            >
                 <ContactForm />
            </motion.div>
          </div>
        </div>
    </div>
  );
}

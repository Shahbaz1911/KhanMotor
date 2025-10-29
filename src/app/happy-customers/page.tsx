
"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AnimatedMenuIcon } from "@/components/custom/AnimatedMenuIcon";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Image from "next/image";
import { ArrowLeft, GalleryThumbnails, Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";

interface GalleryItem {
  id: string;
  caption: string;
  imageUrl: string;
  customerName?: string;
  rating?: number;
  aiHint?: string;
}

export default function HappyCustomersPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  const [logoSrc, setLogoSrc] = useState("https://armanautoxperts-in.vercel.app/armanautoxperts/motokhanwhite.png");

  useEffect(() => {
    setLogoSrc(theme === 'dark' 
      ? "https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack-2.png" 
      : "https://armanautoxperts-in.vercel.app/armanautoxperts/motokhanwhite.png");
  }, [theme]);

  useEffect(() => {
    if (!firestore) return;
    setLoading(true);

    const galleryCollection = collection(firestore, "gallery");
    const q = query(galleryCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q,
        (snapshot) => {
            const galleryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
            setGalleryItems(galleryData);
            setLoading(false);
            setTimeout(() => ScrollTrigger.refresh(), 100);
        },
        (error) => {
            const permissionError = new FirestorePermissionError({
                path: galleryCollection.path,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, [firestore]);


  useEffect(() => {
    if (loading) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header fade-in on load
      gsap.fromTo(headerRef.current, 
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );

      // Header fade out on scroll, reappear only at top
      ScrollTrigger.create({
        trigger: pageRef.current,
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          if (self.scroll() > 100) {
            gsap.to(headerRef.current, { autoAlpha: 0, y: -20, duration: 0.3, ease: 'power2.out' });
          } else {
            gsap.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.in' });
          }
        },
      });

      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: 0.2,
      });

      gsap.from(gridRef.current?.children || [], {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.4
      });

    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    }
  }, [loading]);

  return (
    <>
        <div ref={pageRef} className="bg-background">
          <div ref={headerRef} className="fixed top-4 w-full px-4 z-50">
            <div className="relative flex justify-between items-center">
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
                <Link href="/">
                  <Image 
                      src={logoSrc}
                      alt="Arman Autoxperts Logo"
                      width={150}
                      height={150}
                      className="w-28 h-auto"
                  />
                </Link>
              </div>
            
              <Button variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground text-sm" onClick={() => router.push('/gallery')}>
                  <GalleryThumbnails className="mr-2 h-4 w-4" />
                  VEHICLES
              </Button>
            </div>
          </div>
          <div className="container mx-auto px-4 py-16 md:py-24 mt-16">
            <div className="text-center">
                <Button variant="outline" onClick={() => router.push('/#customer-gallery')} className="mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
                <h1 ref={titleRef} className="mb-12 scroll-m-20 text-4xl tracking-tight lg:text-5xl font-black uppercase">
                    Our Happy Customers
                </h1>
            </div>
            
            {loading || !firestore ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.length > 0 ? galleryItems.map((item, index) => (
                        <Card key={item.id} className={cn(
                          "group relative block overflow-hidden rounded-lg shadow-lg border-0 transition-transform duration-300 ease-in-out hover:z-10 hover:scale-105",
                          index % 2 === 0 ? "hover:-rotate-2" : "hover:rotate-2"
                        )}>
                            <CardContent className="p-0">
                                <div className="h-[400px] w-full">
                                <Image
                                    src={item.imageUrl}
                                    alt={`Customer photo: ${item.caption}`}
                                    fill
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    data-ai-hint={item.aiHint || 'customer car'}
                                />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <div className="relative z-10 text-white">
                                    <p className="mt-2 text-md font-semibold lowercase">
                                        {item.caption}
                                    </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-card">
                            <div className="mb-4 text-5xl">📸</div>
                            <h3 className="text-2xl font-semibold uppercase">No Photos Yet</h3>
                            <p className="text-muted-foreground lowercase">
                                our customer gallery is waiting for its first star. check back soon!
                            </p>
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
    </>
  );
}

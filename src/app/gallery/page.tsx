
"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VehicleShowcaseCard } from "@/components/vehicles/VehicleShowcaseCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AnimatedMenuIcon } from "@/components/custom/AnimatedMenuIcon";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Image from "next/image";
import { GalleryThumbnails, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { Vehicle } from "@/types";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function GalleryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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

    const vehiclesCollection = collection(firestore, "vehicles");
    const unsubscribe = onSnapshot(vehiclesCollection, 
        (snapshot) => {
            const vehiclesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
            setVehicles(vehiclesData);
            setLoading(false);
            // Using a timeout to ensure DOM is updated before refreshing ScrollTrigger
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        }, 
        (error) => {
            console.error("Error fetching vehicles:", error);
            const permissionError = new FirestorePermissionError({
                path: vehiclesCollection.path,
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
      // Header show/hide on scroll
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

      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: 0.4,
      });

      // The animations for the cards are now inside the VehicleShowcaseCard component
      // We just need to make sure ScrollTrigger is aware of the layout changes.
      ScrollTrigger.refresh();

    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    }
  }, [loading]);

  return (
    <>
        <div ref={pageRef}>
          <div ref={headerRef} className="fixed top-0 w-full px-4 pt-4 z-50">
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
                        alt="Motor Khan Logo"
                        width={150}
                        height={150}
                        className="w-16 md:w-24 h-auto"
                    />
                  </Link>
                </div>
              
                <Button variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground text-sm" onClick={() => router.push('/gallery')}>
                    <GalleryThumbnails className="mr-2 h-4 w-4" />
                    GALLERY
                </Button>
              </div>
          </div>
          <div className="container mx-auto px-4 py-16 md:py-24 mt-16">
            <h1 ref={titleRef} className="mb-12 scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl font-black uppercase">
              Used Cars for Sale
            </h1>
            
            {loading || !firestore ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="flex flex-col gap-16 md:gap-24">
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                      <VehicleShowcaseCard 
                        key={vehicle.id} 
                        vehicle={vehicle} 
                        align={index % 2 === 0 ? 'left' : 'right'} 
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-card">
                      <div className="mb-4 text-5xl">🚗</div>
                      <h3 className="text-2xl font-semibold uppercase">No Cars for Sale</h3>
                      <p className="text-muted-foreground lowercase">
                        our car dealership is always updating our car marketplace. check back soon to find certified pre-owned cars!
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

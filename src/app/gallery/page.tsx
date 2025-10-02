"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import { vehicles as allVehicles } from "@/lib/vehiclesData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VehicleShowcaseCard } from "@/components/vehicles/VehicleShowcaseCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AnimatedMenuIcon } from "@/components/custom/AnimatedMenuIcon";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Image from "next/image";
import { GalleryThumbnails } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const headerControlsRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header fade in
       gsap.fromTo(headerControlsRef.current, 
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
      
      // Header fade out on scroll
      gsap.to(headerControlsRef.current, {
        autoAlpha: 0,
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top top",
          end: "+=150",
          scrub: true,
        },
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
  }, []);

  const displayedVehicles = useMemo(() => {
    return allVehicles;
  }, []);

  return (
    <>
        <div ref={pageRef}>
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
          <div className="container mx-auto px-4 py-16 md:py-24 mt-16">
            <h1 ref={titleRef} className="mb-12 scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl font-black">
              Our Vehicle Collection
            </h1>

            <div className="flex flex-col gap-16 md:gap-24">
              {displayedVehicles.length > 0 ? (
                displayedVehicles.map((vehicle, index) => (
                  <VehicleShowcaseCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    align={index % 2 === 0 ? 'left' : 'right'} 
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-card">
                  <div className="mb-4 text-5xl">🚗</div>
                  <h3 className="text-2xl font-semibold">No Vehicles Found</h3>
                  <p className="text-muted-foreground">
                    There are currently no vehicles in our collection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
}

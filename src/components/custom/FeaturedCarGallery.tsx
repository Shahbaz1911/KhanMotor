
"use client";

import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { vehicles } from "@/lib/vehiclesData";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function FeaturedCarGallery() {
  const router = useRouter();
  const featuredVehicles = vehicles.slice(0, 3);
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(c => c !== null) as HTMLDivElement[];
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=1500",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        }
      });

      tl.from(cards, {
        y: (i) => (cards.length - 1 - i) * -10, // stack them visually
        scale: (i) => 1 - (cards.length - 1 - i) * 0.05,
        opacity: (i) => 1 - (cards.length - 1 - i) * 0.2,
        stagger: 0.2,
        ease: "power1.inOut"
      });
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section ref={sectionRef} id="featured-gallery" className="py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
            <h2 className="mb-4 scroll-m-20 text-4xl tracking-tight lg:text-5xl text-white font-black">
                Featured Luxury Cars
            </h2>
            <p className="text-lg text-gray-300 md:text-xl">
                Explore a curated selection of our most prestigious vehicles.
            </p>
        </div>

        <div ref={triggerRef} className="relative h-screen">
          {featuredVehicles.length > 0 ? (
            <div className="absolute inset-0 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 container mx-auto px-4 items-center">
              {featuredVehicles.map((vehicle, i) => (
                <div key={vehicle.id} ref={el => cardsRef.current[i] = el} className="w-full h-full">
                    <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No featured vehicles available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
        
        <div className="text-center -mt-16 relative z-10">
            <Button size="lg" className="group" onClick={() => router.push('/vehicles')}>
                View All Vehicles
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
        </div>
    </section>
  );
}

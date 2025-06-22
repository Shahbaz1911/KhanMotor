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
  const featuredVehicles = vehicles.slice(0, 3); // Display first 3 vehicles as featured
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.from(titleRef.current, { opacity: 0, y: 50, duration: 0.5 })
        .from(textRef.current, { opacity: 0, y: 50, duration: 0.5 }, "-=0.3")
        .from(buttonRef.current, { opacity: 0, y: 20, duration: 0.4 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);


  return (
    <section ref={sectionRef} id="featured-gallery" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 ref={titleRef} className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-kajiro md:font-headline text-primary">
            Featured Luxury Cars
          </h2>
          <p ref={textRef} className="text-lg text-muted-foreground md:text-xl">
            Explore a curated selection of our most prestigious vehicles.
          </p>
        </div>
        {featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No featured vehicles available at the moment. Please check back later.</p>
          </div>
        )}
        <div ref={buttonRef} className="mt-12 text-center">
          <Button size="lg" className="group" onClick={() => router.push('/#vehicles')}>
            View All Vehicles
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}


"use client";

import Image from "next/image";
import type { Vehicle } from "@/types";
import { Button } from "../ui/button";
import { ArrowRight, CheckCircle, Car, Gauge, Fuel, Cog } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";


interface VehicleShowcaseCardProps {
  vehicle: Vehicle;
  align: 'left' | 'right';
}

export function VehicleShowcaseCard({ vehicle, align }: VehicleShowcaseCardProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      const imageX = align === 'left' ? -50 : 50;
      const contentX = align === 'left' ? 50 : -50;
      
      tl.from(imageRef.current, { 
          opacity: 0, 
          x: imageX, 
          duration: 0.8, 
          ease: "power3.out" 
      })
      .from(contentRef.current?.querySelectorAll(".gsap-reveal"), { 
          opacity: 0, 
          x: contentX, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power3.out" 
      }, "-=0.6");

    }, sectionRef);

    return () => ctx.revert();
  }, [align]);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
      <div 
        ref={imageRef} 
        className={cn(
          "relative h-80 w-full overflow-hidden rounded-lg shadow-xl md:h-[450px]",
          align === 'right' && "md:order-last"
        )}
      >
        <Image
          src={vehicle.imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          fill
          className="rounded-lg object-cover"
          data-ai-hint={vehicle.aiHint}
        />
      </div>

      <div ref={contentRef}>
        <p className="gsap-reveal text-sm font-semibold uppercase tracking-widest text-muted-foreground">{vehicle.year} • {vehicle.color}</p>
        <h3 className="gsap-reveal mt-2 text-3xl font-black tracking-tight md:text-4xl">
          {vehicle.make} {vehicle.model}
        </h3>
         <p className="gsap-reveal text-lg font-bold text-primary">{vehicle.variant}</p>
        <p className="gsap-reveal mt-4 text-md text-muted-foreground">
          {vehicle.description}
        </p>

        <div className="gsap-reveal mt-6 grid grid-cols-2 gap-4 text-sm">
            {typeof vehicle.mileage === 'number' && (
              <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <span>{vehicle.mileage.toLocaleString()} km</span>
              </div>
            )}
            {vehicle.fuelType && (
              <div className="flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <span className="capitalize">{vehicle.fuelType}</span>
              </div>
            )}
            {vehicle.transmission && (
              <div className="flex items-center gap-2">
                  <Cog className="h-5 w-5 text-muted-foreground" />
                  <span className="capitalize">{vehicle.transmission}</span>
              </div>
            )}
            {vehicle.ownership && (
              <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <span className="capitalize">{vehicle.ownership} Owner</span>
              </div>
            )}
        </div>

        <div className="gsap-reveal mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <p className="text-3xl font-bold">
            ₹{vehicle.price.toLocaleString()}
            {vehicle.priceType === 'negotiable' && <span className="text-sm font-normal text-muted-foreground"> (Negotiable)</span>}
          </p>
          <Button size="lg" className="group mt-4 sm:mt-0" onClick={() => router.push('/book-appointment')}>
            Book Test Drive
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}


"use client";

import Image from "next/image";
import type { Vehicle } from "@/types";
import { Button } from "../ui/button";
import { ArrowRight, Car, Gauge, Fuel, Cog, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/shadcn-carousel";


interface VehicleShowcaseCardProps {
  vehicle: Vehicle;
  align: 'left' | 'right';
}

export function VehicleShowcaseCard({ vehicle, align }: VehicleShowcaseCardProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
        gsap.from(sectionRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 60,
            filter: 'blur(8px)',
            duration: 1,
            ease: 'power3.out',
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
      <div 
        className={cn(
          "relative w-full overflow-hidden rounded-lg shadow-xl",
          align === 'right' && "md:order-last"
        )}
      >
        <Carousel className="w-full group">
            <CarouselContent>
                {vehicle.imageUrls?.length > 0 ? (
                    vehicle.imageUrls.map((url, index) => (
                        <CarouselItem key={index}>
                             <div className="relative h-80 w-full md:h-[450px]">
                                <Image
                                    src={url}
                                    alt={`${vehicle.make} ${vehicle.model} image ${index + 1}`}
                                    fill
                                    className="rounded-lg object-cover"
                                    data-ai-hint={vehicle.aiHint}
                                />
                            </div>
                        </CarouselItem>
                    ))
                ) : (
                    <CarouselItem>
                        <div className="relative h-80 w-full md:h-[450px]">
                            <Image
                                src="https://picsum.photos/seed/placeholder/1080/810"
                                alt="Placeholder image"
                                fill
                                className="rounded-lg object-cover"
                            />
                        </div>
                     </CarouselItem>
                )}
            </CarouselContent>
           {vehicle.imageUrls && vehicle.imageUrls.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white border-none hover:bg-black/75">
                  <ArrowLeft className="h-6 w-6" />
                </CarouselPrevious>
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white border-none hover:bg-black/75">
                  <ArrowRight className="h-6 w-6" />
                </CarouselNext>
              </>
            )}
        </Carousel>
         {vehicle.status && (
             <Badge 
                variant={vehicle.status === 'available' ? 'secondary' : 'destructive'} 
                className={cn(
                    "absolute top-4 right-4 z-10 capitalize",
                    vehicle.status === 'available' && "bg-green-600/90 text-white border-green-700"
                )}
            >
                {vehicle.status}
            </Badge>
        )}
      </div>

      <div>
        <p className="gsap-reveal text-sm font-semibold uppercase tracking-widest text-muted-foreground font-cairo">{vehicle.year} • {vehicle.color}</p>
        <h3 className="gsap-reveal mt-2 text-3xl font-black tracking-tight md:text-4xl uppercase">
          {vehicle.make} {vehicle.model}
        </h3>
         <p className="gsap-reveal text-lg font-bold text-primary">{vehicle.variant}</p>
        <p className="gsap-reveal mt-4 text-md text-muted-foreground lowercase">
          {vehicle.description}
        </p>

        <div className="gsap-reveal mt-6 grid grid-cols-2 gap-4 text-sm font-cairo">
            {vehicle.mileage !== undefined && (
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
          <p className="text-3xl font-bold font-cairo">
            ₹{vehicle.price.toLocaleString()}
            {vehicle.priceType === 'negotiable' && <span className="text-sm font-normal text-muted-foreground lowercase"> (negotiable)</span>}
          </p>
          <Button size="lg" className="group mt-4 sm:mt-0" onClick={() => router.push('/book-appointment')} disabled={vehicle.status === 'sold'}>
            {vehicle.status === 'sold' ? 'Sold Out' : 'Book Test Drive'}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

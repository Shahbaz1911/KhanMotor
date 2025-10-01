
"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { vehicles as allVehicles } from "@/lib/vehiclesData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VehicleShowcaseCard } from "@/components/vehicles/VehicleShowcaseCard";

export default function VehiclesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.6,
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
    <div ref={pageRef} className="container mx-auto px-4 py-16 md:py-24">
      <h1 ref={titleRef} className="mb-12 scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl text-white font-black">
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
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-black/30 text-white">
            <div className="mb-4 text-5xl">🚗</div>
            <h3 className="text-2xl font-semibold">No Vehicles Found</h3>
            <p className="text-muted-foreground">
              There are currently no vehicles in our collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

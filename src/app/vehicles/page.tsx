
"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VehicleShowcaseCard } from "@/components/vehicles/VehicleShowcaseCard";
import type { Vehicle } from "@/types";
import { initializeFirebase } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function VehiclesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { firestore } = initializeFirebase();

  useEffect(() => {
    if (!firestore) return;

    const vehiclesCollection = collection(firestore, "vehicles");
    const unsubscribe = onSnapshot(vehiclesCollection, (snapshot) => {
      const vehiclesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
      setVehicles(vehiclesData);
      setLoading(false);
      ScrollTrigger.refresh();
    }, (error) => {
      console.error("Error fetching vehicles:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);


  useEffect(() => {
    if (loading) return;

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
  }, [loading]);


  return (
    <div ref={pageRef} className="container mx-auto px-4 py-16 md:py-24">
      <h1 ref={titleRef} className="mb-12 scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl font-black">
        Our Vehicle Collection
      </h1>

        {loading ? (
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
                <h3 className="text-2xl font-semibold">No Vehicles Found</h3>
                <p className="text-muted-foreground">
                  There are currently no vehicles in our collection. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

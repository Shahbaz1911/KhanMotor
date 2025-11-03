
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useRef } from 'react';
import { LayoutTextFlip } from "../ui/layout-text-flip";

export function HeroSpotlightBanner({ isLoaded }: { isLoaded: boolean }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden text-white">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-4">
            <LayoutTextFlip
              text={["Professional", "Car"]}
              words={["Dealer", "Denting", "Painting", "Restoration", "Repair", "Sales"]}
            />
        </div>
        
        <Button 
          size="lg" 
          variant="outline"
          className="group bg-transparent hover:bg-white hover:text-black border-2 border-white text-lg text-white px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 font-black mt-10"
          onClick={() => router.push('/about')}
        >
          DISCOVER
        </Button>
      </div>
    </section>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from "next/image";

export function HeroSpotlightBanner({ isLoaded }: { isLoaded: boolean }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden text-white">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="mb-10 scroll-m-20 text-4xl tracking-tight sm:text-6xl md:text-7xl text-white drop-shadow-lg font-black uppercase" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
            Complete Car Restoration
        </h1>
        <Button 
          size="lg" 
          variant="outline"
          className="group bg-transparent hover:bg-white hover:text-black border-2 border-white text-lg text-white px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 font-black"
          onClick={() => router.push('/#featured-gallery')}
        >
          DISCOVER
        </Button>
      </div>
    </section>
  );
}

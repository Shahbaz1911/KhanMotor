
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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Only run animation if isLoaded is true
    if (isLoaded && headingRef.current && buttonRef.current) { 
      const staticWords = headingRef.current.querySelectorAll(".static-word-inner");
      const animatedWords = headingRef.current.querySelectorAll(".animated-word");
      
      gsap.set(staticWords, { y: "110%" });
      gsap.set(animatedWords, { y: "110%", opacity: 0 });
      gsap.set(buttonRef.current, { opacity: 0, y: 20 });
      
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.5 });

      tl.to(
          staticWords,
          {
              y: "0%",
              stagger: 0.05,
              duration: 0.8,
          }
      ).to(
          buttonRef.current,
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.7" // Start button animation slightly after text starts
      );

      // Separate timeline for the repeating word animation
      const wordTl = gsap.timeline({ repeat: -1, delay: 1 }); // Start after initial hero animation
      animatedWords.forEach((word) => {
        wordTl
          .to(word, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" })
          .to(word, { yPercent: -110, opacity: 0, duration: 0.6, ease: "power3.in", delay: 1.5 });
      });
    }
  }, [isLoaded]);

  return (
    <section ref={sectionRef} className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden text-white">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 ref={headingRef} className="mb-10 scroll-m-20 text-4xl tracking-tight sm:text-6xl md:text-7xl text-white drop-shadow-lg font-black uppercase" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
            <span className="inline-block overflow-hidden pb-2">
              <span className="static-word-inner inline-block will-change-transform">
                Complete&nbsp;
              </span>
            </span>
            <span className="inline-block overflow-hidden pb-2">
               <span className="static-word-inner inline-block will-change-transform">
                Car&nbsp;
              </span>
            </span>
            <div className="relative inline-block overflow-hidden pb-2 h-16 md:h-24">
                 <span className="animated-word absolute inset-0 will-change-transform">Restoration</span>
                 <span className="animated-word absolute inset-0 will-change-transform">Repair</span>
                 <span className="animated-word absolute inset-0 will-change-transform">Sales</span>
            </div>
        </h1>
        <Button 
          ref={buttonRef}
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

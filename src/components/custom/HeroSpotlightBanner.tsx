
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export function HeroSpotlightBanner({ isLoaded }: { isLoaded: boolean }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const headingText = "Experience Automotive Excellence";

  useEffect(() => {
    // Only run animation if isLoaded is true
    if (isLoaded && headingRef.current && buttonRef.current) {
      const innerWords = headingRef.current.querySelectorAll(".word-inner");
      
      gsap.set(innerWords, { y: "110%" });
      gsap.set(buttonRef.current, { opacity: 0, y: 20 });
      
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });

      tl.to(
          innerWords,
          {
              y: "0%",
              stagger: 0.05,
              duration: 0.8,
          }
      )
      .to(
          buttonRef.current,
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
      );
    }
  }, [isLoaded]);

  return (
    <section ref={sectionRef} className="relative z-10 w-full h-[70vh] min-h-[500px] md:h-screen flex items-center justify-center overflow-hidden text-white">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 ref={headingRef} className="mb-10 scroll-m-20 text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-lg font-black">
          {headingText.split(" ").map((word, index) => (
            <span key={index} className="inline-block overflow-hidden pb-2">
              <span className="word-inner inline-block will-change-transform">
                {word}&nbsp;
              </span>
            </span>
          ))}
        </h1>
        <Button 
          ref={buttonRef}
          size="lg" 
          className="group bg-white text-black hover:bg-white/90 border-2 border-white text-lg px-8 py-6 rounded-md transition-transform transform hover:scale-105 font-black"
          onClick={() => router.push('/#featured-gallery')}
        >
          Explore Our Collection
          <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
}

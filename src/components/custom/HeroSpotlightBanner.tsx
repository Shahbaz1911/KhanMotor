
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export function HeroSpotlightBanner() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const headingText = "Experience Automotive Excellence";

  useEffect(() => {
    if (videoContainerRef.current && headingRef.current && buttonRef.current) {
      const innerWords = headingRef.current.querySelectorAll(".word-inner");
      
      gsap.set(videoContainerRef.current, { autoAlpha: 1 });
      gsap.set(innerWords, { y: "110%" });
      gsap.set(buttonRef.current, { opacity: 0, y: 20 });
      
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(
          videoContainerRef.current,
          { 
              clipPath: "inset(0% 0% 0% 0% round 0%)", 
              duration: 1.5,
              delay: 0.3
          }
      )
      .to(
          innerWords,
          {
              y: "0%",
              stagger: 0.05,
              duration: 0.8,
          },
          "-=1.2"
      )
      .to(
          buttonRef.current,
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[70vh] min-h-[500px] md:h-screen flex items-center justify-center overflow-hidden text-white">
      <div 
        ref={videoContainerRef} 
        className="absolute inset-0 invisible" 
        style={{ clipPath: 'inset(45% 45% 45% 45% round 50%)' }}
      >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="https://media-alpha-green.vercel.app/video/car.mp4"
            data-ai-hint="dynamic car driving"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 ref={headingRef} className="font-kajiro mb-10 scroll-m-20 text-6xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl text-white drop-shadow-lg mix-blend-screen md:mix-blend-normal">
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
          className="group bg-transparent text-white hover:bg-white/20 border-2 border-white text-lg px-8 py-6 rounded-md transition-transform transform hover:scale-105"
          onClick={() => router.push('/#featured-gallery')}
        >
          Explore Our Collection
          <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
}

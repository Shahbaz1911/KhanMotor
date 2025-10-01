
"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import placeholderImages from "@/lib/placeholder-images.json";

export function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (textRef.current) {
        const textWidth = textRef.current.offsetWidth;
        // Start from off-screen right and move to off-screen left
        gsap.fromTo(
          textRef.current,
          { x: "100vw" },
          {
            x: `-${textWidth}px`,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true, // Directly link animation to scroll
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="call-to-action" 
      className="relative py-24 md:py-32 bg-black text-white overflow-hidden"
    >
      <Image 
        src={placeholderImages.cta.url}
        alt="Luxury car interior"
        fill
        className="object-cover opacity-20"
        data-ai-hint={placeholderImages.cta.aiHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>

      <div className="relative container mx-auto px-4 z-10">
        <div ref={textRef} className="whitespace-nowrap">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase">
            Are you ready to experience luxury?
          </h2>
        </div>
        <div className="mt-12 text-center">
          <Button
            size="lg"
            variant="outline"
            className="group bg-transparent hover:bg-destructive hover:text-destructive-foreground border-2 border-destructive text-lg text-white px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 font-black"
            onClick={() => router.push('/book-appointment')}
          >
            Book a Test Drive
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

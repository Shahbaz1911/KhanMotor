
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSpotlightBanner() {
  const router = useRouter();

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] md:h-screen flex items-center justify-center overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="https://media-alpha-green.vercel.app/video/car.mp4"
        data-ai-hint="dynamic car driving"
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 z-1"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="mb-10 scroll-m-20 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl text-white drop-shadow-lg">
          Experience Automotive Excellence
        </h1>
        {/* Paragraph text removed as per request */}
        <Button 
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

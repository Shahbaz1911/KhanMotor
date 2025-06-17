
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSpotlightBanner() {
  const router = useRouter();

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] md:h-screen flex items-center justify-center overflow-hidden bg-primary text-primary-foreground">
      {/* Spotlight Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-background/20 opacity-80"></div>
        <div 
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            animation: 'spotlight-animation 15s infinite ease-in-out alternate'
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl text-primary-foreground drop-shadow-lg">
          Experience Automotive Excellence
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-lg text-primary-foreground/80 md:text-xl lg:text-2xl drop-shadow-md">
          Discover a curated collection of the world&apos;s most prestigious vehicles, handpicked for their quality, performance, and timeless appeal.
        </p>
        <Button 
          size="lg" 
          className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 rounded-md shadow-lg transition-transform transform hover:scale-105"
          onClick={() => router.push('/#featured-gallery')}
        >
          Explore Our Collection
          <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Placeholder for potential subtle background image or pattern */}
      {/* <Image src="https://placehold.co/1920x1080.png" alt="Luxury car background" layout="fill" objectFit="cover" className="opacity-10 absolute inset-0 z-0" data-ai-hint="abstract car lines" /> */}

      <style jsx global>{`
        @keyframes spotlight-animation {
          0% { transform: translate(-10%, -10%) scale(1); }
          50% { transform: translate(10%, 10%) scale(1.3); }
          100% { transform: translate(-10%, -10%) scale(1); }
        }
      `}</style>
    </section>
  );
}


"use client";

import Image from "next/image";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const brands = [
  { name: "Audi", logoUrl: "https://logo.clearbit.com/audi.com" },
  { name: "BMW", logoUrl: "https://logo.clearbit.com/bmw.com" },
  { name: "Mercedes-Benz", logoUrl: "https://logo.clearbit.com/mercedes-benz.com" },
  { name: "Porsche", logoUrl: "https://logo.clearbit.com/porsche.com" },
  { name: "Tesla", logoUrl: "https://logo.clearbit.com/tesla.com" },
  { name: "Ferrari", logoUrl: "https://logo.clearbit.com/ferrari.com" },
  { name: "Lamborghini", logoUrl: "https://logo.clearbit.com/lamborghini.com" },
  { name: "Rolls-Royce", logoUrl: "https://logo.clearbit.com/rolls-roycemotorcars.com" },
];

export function MarqueeBrandScroller() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const duplicatedBrands = [...brands, ...brands, ...brands];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="brand-scroller" className="bg-black/20 backdrop-blur-sm py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 scroll-m-20 text-3xl tracking-tight lg:text-4xl text-white font-black">
            Our Trusted Automotive Partners
          </h2>
          <p className="text-md text-gray-300 md:text-lg">
            Collaborating with the best in the automotive industry.
          </p>
        </div>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]">
          <div ref={marqueeRef} className="flex whitespace-nowrap">
            {duplicatedBrands.map((brand, index) => (
              <div key={index} className="flex-shrink-0 w-48 h-24 mx-8 flex items-center justify-center">
                <Image
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  width={120}
                  height={60}
                  className="object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Star } from 'lucide-react';

const marqueeTexts = ["Car Restoration", "Classic Car Restoration", "Auto Repair", "Vehicle Servicing", "Auto Service Center", "Mobile Mechanic", "Auto Body Shop", "Collision Repair", "Brake Repair", "Transmission Repair", "Oil Change Service", "Tire Replacement", "Car Detailing", "Air Conditioning Repair"];

export function TextMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const repeatedTexts = Array(5).fill(marqueeTexts).flat();

  useEffect(() => {
    const marqueeEl = marqueeRef.current;
    if (!marqueeEl) return;

    // Calculate total width of one set of texts
    const singleSetWidth = marqueeEl.scrollWidth / 5;

    const animation = gsap.to(marqueeEl, {
      x: `-${singleSetWidth}px`,
      ease: "none",
      duration: 25, // Slower duration for a more elegant effect
      repeat: -1,
    });
    
    return () => {
      animation.kill();
    }
  }, []);

  return (
    <section className="bg-white dark:bg-black overflow-hidden">
      <div className="w-full h-px bg-border" />
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-12 md:py-16">
        <div ref={marqueeRef} className="flex w-max items-center">
          {repeatedTexts.map((text, i) => (
            <React.Fragment key={i}>
              <div className="mx-8">
                <h2 className="text-6xl md:text-8xl font-black text-black/80 dark:text-white/80 whitespace-nowrap uppercase">
                  {text}
                </h2>
              </div>
              {i < repeatedTexts.length - 1 && (
                <Star className="h-8 w-8 text-destructive flex-shrink-0" fill="currentColor" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-border" />
    </section>
  );
}

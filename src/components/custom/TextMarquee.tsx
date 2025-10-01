"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const marqueeTexts = ["Excellence", "Performance", "Luxury"];

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
      duration: 20, // Slower duration for a more elegant effect
      repeat: -1,
    });
    
    return () => {
      animation.kill();
    }
  }, []);

  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div ref={marqueeRef} className="flex w-max">
          {repeatedTexts.map((text, i) => (
            <div key={i} className="mx-8">
              <h2 className="text-6xl md:text-8xl font-black text-foreground/80 whitespace-nowrap">
                {text}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

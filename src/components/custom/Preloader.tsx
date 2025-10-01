
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onLoaded: () => void;
}

export function Preloader({ onLoaded }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimationComplete(true);
      }
    });

    tl.to(counter, {
        value: 100,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counter.value)}`;
          }
        },
      })
      .to(contentRef.current, {
        opacity: 0,
        duration: 0.5,
      }, "-=0.5");

  }, []);

  useEffect(() => {
    if (isAnimationComplete) {
      const revealTl = gsap.timeline({
        onComplete: () => {
            if (preloaderRef.current) preloaderRef.current.style.display = 'none';
            onLoaded();
        }
      });
      revealTl.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut'
      });
    }
  }, [isAnimationComplete, onLoaded]);

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black">
        <div ref={contentRef} className="flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl md:text-5xl font-black text-center mb-4">
                Khan Motor
            </h1>
            <div className="flex items-end">
                <span ref={counterRef} className="text-6xl md:text-8xl font-black tabular-nums">0</span>
                <span className="text-2xl md:text-3xl font-black mb-2 ml-1">%</span>
            </div>
        </div>
    </div>
  );
}

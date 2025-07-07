
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onLoaded: () => void;
}

export function Preloader({ onLoaded }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.5, // Small delay before starting
      onComplete: () => {
        if (preloaderRef.current && topCurtainRef.current && bottomCurtainRef.current) {
          const revealTl = gsap.timeline({
            onComplete: () => {
              if (preloaderRef.current) preloaderRef.current.style.display = 'none';
              onLoaded();
            }
          });
          
          revealTl.to([topCurtainRef.current, bottomCurtainRef.current], {
            y: (i) => (i === 0 ? '-100%' : '100%'),
            duration: 1.2,
            ease: 'power4.inOut'
          });
        }
      }
    });

    if (lineRef.current && lineContainerRef.current) {
        tl.to(lineRef.current, {
            scaleX: 1,
            duration: 2.5, // Loading duration
            ease: 'power2.out'
        })
        .to(lineContainerRef.current, {
            opacity: 0,
            duration: 0.3
        });
    }

  }, [onLoaded]);

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <div ref={topCurtainRef} className="absolute top-0 left-0 h-1/2 w-full bg-black"></div>
      <div ref={bottomCurtainRef} className="absolute bottom-0 left-0 h-1/2 w-full bg-black"></div>
      <div ref={lineContainerRef} className="absolute h-px w-[80vw] max-w-sm overflow-hidden bg-gray-800">
        <div 
          ref={lineRef} 
          className="h-full origin-left-right scale-x-0 bg-white"
        ></div>
      </div>
    </div>
  );
}

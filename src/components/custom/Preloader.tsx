
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onLoaded: () => void;
}

// A high-quality, landscape image for the preloader
const preloaderImageUrl = "https://images.unsplash.com/photo-1541348263662-e15a63608ae6?q=80&w=1920&auto=format&fit=crop";

export function Preloader({ onLoaded }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const animationStartedRef = useRef(false);

  useEffect(() => {
    const startAnimation = () => {
      if (animationStartedRef.current) return;
      animationStartedRef.current = true;

      const tl = gsap.timeline({
        delay: 0.5,
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
              duration: 2.5,
              ease: 'power2.out'
          })
          .to(lineContainerRef.current, {
              opacity: 0,
              duration: 0.3
          });
      }
    };

    const img = new Image();
    img.src = preloaderImageUrl;
    if (img.complete) {
      startAnimation();
    } else {
      img.onload = startAnimation;
      img.onerror = startAnimation; // Start animation even if image fails to load
    }
    
  }, [onLoaded]);

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black">
      <div 
        ref={topCurtainRef} 
        className="absolute top-0 left-0 h-1/2 w-full"
        style={{
          backgroundImage: `url(${preloaderImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      ></div>
      <div 
        ref={bottomCurtainRef} 
        className="absolute bottom-0 left-0 h-1/2 w-full"
        style={{
          backgroundImage: `url(${preloaderImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      ></div>
      
      <div ref={lineContainerRef} className="absolute h-px w-[80vw] max-w-sm overflow-hidden bg-gray-800">
        <div 
          ref={lineRef} 
          className="h-full origin-left-right scale-x-0 bg-white"
        ></div>
      </div>
    </div>
  );
}

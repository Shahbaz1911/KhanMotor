
'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onLoaded: () => void;
}

export function Preloader({ onLoaded }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const preloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (preloaderRef.current) {
            gsap.to(preloaderRef.current, {
              opacity: 0,
              duration: 1,
              ease: 'power3.inOut',
              onComplete: () => {
                if(preloaderRef.current) preloaderRef.current.style.display = 'none';
                onLoaded();
              },
            });
          }
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
    >
      <div className="relative h-32 w-32">
        <svg className="h-full w-full animate-spin" style={{ animationDuration: '2s' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none" />
            <path d="M14.2 14.2 L 21.3 21.3" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d="M14.2 85.8 L 21.3 78.7" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d="M85.8 14.2 L 78.7 21.3" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d="M85.8 85.8 L 78.7 78.7" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d="M50 10 L 50 20" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d="M50 90 L 50 80" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d="M10 50 L 20 50" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d="M90 50 L 80 50" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mt-8 text-3xl font-black tabular-nums text-white">{progress}%</p>
    </div>
  );
}

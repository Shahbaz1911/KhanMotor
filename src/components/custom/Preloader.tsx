'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface PreloaderProps {
  onLoaded: () => void;
}

export function Preloader({ onLoaded }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimationComplete(true);
      },
    });

    // Needle sweep from -90 to 90 degrees (0 to 180 on dial)
    tl.to(needleRef.current, {
        rotation: 180,
        duration: 1.5,
        ease: 'power3.inOut',
      })
      // Logo glow at peak
      .to(logoRef.current, {
        animation: 'logo-glow 0.5s ease-in-out',
        duration: 0.5,
        repeat: 1,
        yoyo: true,
      }, '-=0.25')
      // Needle sweep from 90 back to -90 degrees
      .to(needleRef.current, {
        rotation: 0,
        duration: 1.2,
        ease: 'power3.inOut',
      }, '+=0.5');

  }, []);

  useEffect(() => {
    if (isAnimationComplete) {
      const revealTl = gsap.timeline({
        onComplete: () => {
          if (preloaderRef.current) preloaderRef.current.style.display = 'none';
          onLoaded();
        },
      });
      revealTl.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      });
    }
  }, [isAnimationComplete, onLoaded]);

  const SpeedMark = ({ value, rotation }: { value: number, rotation: number }) => (
    <div
      className="absolute w-full h-full text-center"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span className="inline-block text-white text-xs -translate-y-2" style={{ transform: `rotate(${-rotation}deg) ` }}>
        {value}
      </span>
    </div>
  );

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black">
      <div className="relative w-64 h-32 flex items-end justify-center">
        {/* Speedometer Dial */}
        <div className="absolute bottom-0 w-full h-[128px] border-[10px] border-b-0 border-destructive rounded-t-full"></div>
        <div className="absolute bottom-0 w-[calc(100%-40px)] h-[108px] border-[10px] border-b-0 border-black rounded-t-full"></div>
        
        {/* Speed Markings */}
        <div className="absolute bottom-0 w-[calc(100%-40px)] h-[108px]">
          <SpeedMark value={0} rotation={-80} />
          <SpeedMark value={50} rotation={-40} />
          <SpeedMark value={100} rotation={0} />
          <SpeedMark value={150} rotation={40} />
        </div>

        {/* Logo in the center */}
        <div ref={logoRef} className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <Image
                src="https://armanautoxperts-in.vercel.app/armanautoxperts/arman.png"
                alt="Arman Autoxperts Logo"
                width={100}
                height={100}
                className="w-20 h-auto"
                priority
            />
        </div>

        {/* Needle */}
        <div
          className="absolute bottom-0 w-32 h-32 origin-bottom-left"
          style={{ transform: 'translateX(8px)' }}
        >
          <div
            ref={needleRef}
            className="absolute bottom-1/2 left-0 w-1/2 h-0.5 bg-destructive origin-right"
            style={{ transform: 'rotate(-90deg)' }}
          >
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-destructive rounded-full"></div>
          </div>
        </div>

         {/* Center pin */}
        <div className="absolute w-4 h-4 bg-white rounded-full z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
}

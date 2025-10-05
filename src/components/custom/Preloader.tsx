
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface PreloaderProps {
  onLoaded: () => void;
}

const TickMark = ({ rotation, large }: { rotation: number, large?: boolean }) => {
  const [animationStyle, setAnimationStyle] = useState({});

  useEffect(() => {
    setAnimationStyle({
      animationDuration: `${Math.random() * 0.5 + 0.5}s`,
      animationDelay: `${Math.random() * 0.5}s`,
    });
  }, []);

  return (
    <div
      className="absolute w-full h-full"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div 
        className={`absolute left-1/2 -translate-x-1/2 bg-white/50 animate-tick`} 
        style={{
          width: '1px',
          height: large ? '6px' : '3px',
          animationDirection: 'alternate',
          animationIterationCount: 'infinite',
          ...animationStyle
        }}
      ></div>
    </div>
  );
};


export function Preloader({ onLoaded }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const speedNumberRef = useRef<HTMLSpanElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const { theme, systemTheme } = useTheme();

  const [logoSrc, setLogoSrc] = useState("https://armanautoxperts-in.vercel.app/armanautoxperts/arman.png");

  useEffect(() => {
    // Determine the effective theme, considering system preference
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setLogoSrc(currentTheme === 'light' 
      ? "https://armanautoxperts-in.vercel.app/armanautoxperts/blacklogo.png" 
      : "https://armanautoxperts-in.vercel.app/armanautoxperts/arman.png");
  }, [theme, systemTheme]);

  useEffect(() => {
    const speedCounter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimationComplete(true);
      },
    });

    // Animate speed number and needle simultaneously
    tl.to(speedCounter, {
      val: 350,
      duration: 1.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        if(speedNumberRef.current) {
            speedNumberRef.current.textContent = Math.round(speedCounter.val).toString();
        }
      },
    })
    .to(needleRef.current, {
        rotation: 270, // -135 (start) + 270 = 135 deg (end)
        duration: 1.5,
        ease: 'power3.inOut',
      }, 0) // Start at the same time as the number counter
      // Logo glow at peak
      .to(logoRef.current, {
        animation: 'logo-glow 0.5s ease-in-out',
        duration: 0.5,
        repeat: 1,
        yoyo: true,
      }, '-=0.25')
      // Hold for a moment
      .to({}, {duration: 0.5});


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
      <span className="inline-block text-white text-[10px] -translate-y-1.5" style={{ transform: `rotate(${-rotation}deg) ` }}>
        {value}
      </span>
    </div>
  );
  
  const totalMarks = 70;
  const totalDegrees = 270;
  const degreeStep = totalDegrees / totalMarks;
  const startAngle = -135;


  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Logo above the speedometer */}
      <div ref={logoRef} className="mb-8">
           <Image
              src={logoSrc}
              alt="Arman Autoxperts Logo"
              width={200}
              height={200}
              className="w-48 h-auto"
              priority
          />
      </div>

      <div className="relative w-64 h-32 flex items-end justify-center">
        {/* Speedometer Dial - more layers for realism */}
        <div className="absolute bottom-0 w-full h-[128px] border-[8px] border-b-0 border-destructive/50 rounded-t-full"></div>
        <div className="absolute bottom-0 w-[calc(100%-16px)] h-[120px] border-[1px] border-b-0 border-white/20 rounded-t-full"></div>
        <div className="absolute bottom-0 w-[calc(100%-32px)] h-[112px] border-[8px] border-b-0 border-black rounded-t-full"></div>
        
        {/* Speed Markings */}
        <div className="absolute bottom-0 w-[calc(100%-48px)] h-[104px]">
          {Array.from({length: totalMarks + 1}).map((_, i) => (
             <TickMark key={i} rotation={startAngle + (i * degreeStep)} large={i % 10 === 0} />
          ))}
          <SpeedMark value={0} rotation={-120} />
          <SpeedMark value={50} rotation={-81.4} />
          <SpeedMark value={100} rotation={-42.8} />
          <SpeedMark value={150} rotation={-4.2} />
          <SpeedMark value={200} rotation={34.4} />
          <SpeedMark value={250} rotation={73} />
          <SpeedMark value={300} rotation={111.6} />
          <SpeedMark value={350} rotation={150.2} />
        </div>

        {/* Needle - redesigned for realism */}
        <div
          className="absolute bottom-0 w-32 h-32 origin-bottom-left"
          style={{ transform: 'translateX(6px)' }}
        >
          <div
            ref={needleRef}
            className="absolute bottom-1/2 left-0 w-[45%] h-px bg-destructive origin-right"
            style={{ transform: 'rotate(-135deg)' }}
          >
              <div className="absolute -top-1 right-0 w-2 h-2 bg-destructive rounded-full border border-black"></div>
          </div>
        </div>

         {/* Center pin */}
        <div className="absolute w-4 h-4 bg-zinc-800 rounded-full z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-zinc-600"></div>
      </div>
       <div className="mt-4 text-center text-white">
            <span ref={speedNumberRef} className="text-5xl font-black tabular-nums">0</span>
            <span className="ml-2 text-lg">mph</span>
        </div>
    </div>
  );
}

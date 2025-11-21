
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
}: ScrollExpandMediaProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !mediaContainerRef.current || !titleContainerRef.current) return;
  
    gsap.registerPlugin(ScrollTrigger);

    const initialWidth = isMobile ? '90vw' : '300px';
    const initialHeight = isMobile ? '60vh' : '400px';
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1000', // Shorter duration, just for the expansion
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Set initial states
      gsap.set(mediaContainerRef.current, { width: initialWidth, height: initialHeight });
      gsap.set(titleContainerRef.current, { scale: 1 });

      // Animate media expansion
      tl.to(mediaContainerRef.current, {
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        ease: 'power2.inOut',
      }, 0);

      // Animate title and other elements fading out
      tl.to(titleContainerRef.current, {
        scale: 1.5,
        opacity: 0,
        ease: 'power2.inOut',
      }, 0);
    
    }, sectionRef);

    // This handles the reset logic when navigating back to the page
    const handleReset = () => {
        if (ctx) {
            ctx.revert();
        }
        window.scrollTo(0, 0);
        // We re-run the effect to re-initialize the animation
        const newCtx = gsap.context(() => {
             const tl = gsap.timeline({
                scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=1000',
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                },
            });
            gsap.set(mediaContainerRef.current, { width: initialWidth, height: initialHeight });
            gsap.set(titleContainerRef.current, { scale: 1, opacity: 1 });
            tl.to(mediaContainerRef.current, { width: '100vw', height: '100vh', borderRadius: 0, ease: 'power2.inOut' }, 0);
            tl.to(titleContainerRef.current, { scale: 1.5, opacity: 0, ease: 'power2.inOut' }, 0);
        }, sectionRef);
    };

    window.addEventListener('resetSection', handleReset);


    return () => {
        window.removeEventListener('resetSection', handleReset);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        ctx.revert();
    };
  }, [isMobile]);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div ref={sectionRef} className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      {/* Media container that animates */}
      <div
        ref={mediaContainerRef}
        className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="relative h-full w-full">
          {mediaType === 'video' ? (
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
            />
          ) : (
             <img
              src={mediaSrc}
              alt={title || 'Media content'}
              className="w-full h-full object-cover"
            />
          )}
           <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

       {/* Centered Title that fades out */}
      <div
        ref={titleContainerRef}
        className={cn(
            "pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white",
            textBlend ? 'mix-blend-difference' : ''
        )}
      >
        {date && (
            <p className="text-lg md:text-xl font-medium">{date}</p>
        )}
        <h2 className="text-4xl md:text-6xl font-black uppercase flex flex-col gap-2">
           <span>{firstWord}</span>
           <span>{restOfTitle}</span>
        </h2>
         {scrollToExpand && (
            <p className="mt-4 text-base md:text-lg font-medium">{scrollToExpand}</p>
        )}
      </div>
    </div>
  );
};

export default ScrollExpandMedia;

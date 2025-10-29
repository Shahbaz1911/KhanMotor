
"use client";

import React, { useEffect } from 'react';
import { motion, useAnimation, useMotionValue, MotionValue, Transition } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
  className?: string;
}

const getRotationTransition = (duration: number, from: number, loop: boolean = true) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  repeat: loop ? Infinity : 0
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300
  }
});

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = ''
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation: MotionValue<number> = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start) as any
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();

    if (!onHover) return;

    let transitionConfig: ReturnType<typeof getTransition> | Transition;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        };
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig as any
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start) as any
    });
  };

  return (
    <div className={cn("relative w-40 h-40 group", className)}>
        <motion.div
            className={cn("m-0 mx-auto rounded-full w-40 h-40 relative font-black text-center cursor-pointer origin-center")}
            style={{ rotate: rotation }}
            initial={{ rotate: 0 }}
            animate={controls}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            >
            {letters.map((letter, i) => {
                const rotationDeg = (360 / letters.length) * i;

                return (
                <motion.span
                    key={i}
                    className="absolute inline-block inset-0 text-inherit transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]"
                    style={{ transform: `rotate(${rotationDeg}deg)`, transformOrigin: 'center 80px' }} // 80px is half of 160px width/height
                >
                    {letter}
                </motion.span>
                );
            })}
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center justify-center h-28 w-28 rounded-full bg-primary text-primary-foreground group-hover:bg-destructive transition-colors duration-300">
                <span className="text-lg font-black uppercase">Click</span>
                <ArrowUpRight className="w-5 h-5 ml-1" />
            </div>
      </div>
    </div>
  );
};

export default CircularText;

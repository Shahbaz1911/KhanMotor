
"use client";

import React from 'react';
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

  const startAnimation = (duration: number, scaleVal: number = 1) => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: getTransition(duration, start) as any,
    });
  };

  React.useEffect(() => {
    startAnimation(spinDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    if (!onHover) return;

    let newDuration = spinDuration;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        newDuration = spinDuration * 2;
        break;
      case 'speedUp':
        newDuration = spinDuration / 4;
        break;
      case 'pause':
        controls.stop();
        return;
      case 'goBonkers':
        newDuration = spinDuration / 20;
        scaleVal = 0.8;
        break;
    }
    startAnimation(newDuration, scaleVal);
  };

  const handleHoverEnd = () => {
    startAnimation(spinDuration);
  };

  return (
    <div className={cn("relative w-40 h-40 group", className)}>
        <div className="absolute inset-0 border-2 border-border rounded-full transition-all duration-300 group-hover:border-destructive group-hover:shadow-[0_0_15px_hsla(var(--destructive),0.5)]"></div>
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
                    className={cn(
                        "absolute inline-block inset-0 text-inherit transition-all duration-500 ease-in-out"
                    )}
                    style={{ transform: `rotate(${rotationDeg}deg)`, transformOrigin: 'center 80px' }} // 80px is half of 160px width/height
                >
                    {letter === '✦' ? <span>{letter}</span> : letter}
                </motion.span>
                );
            })}
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center justify-center h-32 w-32 rounded-full bg-background text-destructive transition-colors duration-300 group-hover:bg-destructive/10">
                <span className="text-2xl font-black uppercase">Click</span>
                <ArrowUpRight className="w-6 h-6 ml-1" />
            </div>
      </div>
    </div>
  );
};

export default CircularText;

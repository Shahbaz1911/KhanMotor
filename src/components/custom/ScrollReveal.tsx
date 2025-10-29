
"use client";

import React, { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  paragraphClassName?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className, paragraphClassName }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25'],
  });
  
  const words = typeof children === 'string' ? children.split(' ') : [];

  return (
    <div ref={containerRef} className={cn("relative z-10", className)}>
      <p className={cn("flex flex-wrap text-4xl md:text-5xl lg:text-6xl font-black leading-relaxed text-muted-foreground/30", paragraphClassName)}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + (1 / words.length);
          return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
        })}
      </p>
    </div>
  );
};

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mr-3 mt-3">
        <span className="absolute opacity-20">{children}</span>
        <motion.span style={{ opacity: opacity }} className="text-foreground">{children}</motion.span>
    </span>
  );
};

export default ScrollReveal;

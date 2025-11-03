"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = ["Build", "Amazing"],
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: {
  text: string[];
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <>
      <motion.div
        layoutId="subtext"
        className="flex flex-col items-center sm:flex-row sm:gap-x-4 text-4xl tracking-tight sm:text-6xl md:text-7xl font-black uppercase text-white drop-shadow-lg"
        style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}
      >
        {text.map((word, index) => (
          <span key={index}>{word}</span>
        ))}
      </motion.div>

      <motion.span
        layout
        className="relative w-fit overflow-hidden rounded-md bg-white px-4 py-2 text-4xl font-black tracking-tight text-black shadow-sm ring shadow-black/10 ring-black/10 drop-shadow-lg sm:text-6xl md:text-7xl dark:bg-neutral-900 dark:text-white dark:shadow-sm dark:ring-1 dark:shadow-white/10 dark:ring-white/10"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -50, filter: "blur(10px)" }}
            animate={{
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
            className={cn("inline-block whitespace-nowrap uppercase")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};


"use client";

import { motion, useScroll, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const controls = useAnimation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show the bar immediately on scroll
      controls.start({ opacity: 1, transition: { duration: 0.1 } });

      // Clear the previous timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout to hide the bar after scrolling stops
      timeoutRef.current = setTimeout(() => {
        controls.start({ opacity: 0, transition: { duration: 0.5 } });
      }, 1000); // Hide after 1 second of inactivity
    };

    // Subscribe to scrollYProgress changes
    const unsubscribe = scrollYProgress.on("change", handleScroll);

    // Cleanup function
    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scrollYProgress, controls]);

  return (
    <motion.div
      className="fixed top-1/2 right-4 -translate-y-1/2 h-36 w-1.5 bg-muted rounded-full z-50"
      initial={{ opacity: 0 }}
      animate={controls}
    >
      <motion.div
        className="h-full w-full bg-destructive rounded-full origin-top"
        style={{ scaleY: scrollYProgress }}
      />
    </motion.div>
  );
}

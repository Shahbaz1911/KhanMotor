"use client";

import { motion, useScroll, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const controls = useAnimation();
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      controls.start({ opacity: 1, transition: { duration: 0.2 } });

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      setScrollTimeout(
        setTimeout(() => {
          controls.start({ opacity: 0, transition: { duration: 0.5 } });
        }, 1500) // Hide after 1.5 seconds of inactivity
      );
    };

    window.addEventListener("scroll", handleScroll);

    // Initially hide the bar
    controls.set({ opacity: 0 });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout, controls]);


  return (
    <motion.div 
        className="fixed top-1/2 right-4 -translate-y-1/2 h-48 w-0.5 bg-muted rounded-full z-50"
        animate={controls}
    >
        <motion.div
            className="h-full w-full bg-destructive rounded-full origin-top"
            style={{ scaleY: scrollYProgress }}
        />
    </motion.div>
  );
}

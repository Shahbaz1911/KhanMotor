"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div 
        className="fixed top-1/2 right-4 -translate-y-1/2 h-48 w-0.5 bg-muted rounded-full z-50"
    >
        <motion.div
            className="h-full w-full bg-destructive rounded-full origin-top"
            style={{ scaleY: scrollYProgress }}
        />
    </motion.div>
  );
}

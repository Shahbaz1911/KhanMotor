"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 h-64 w-1 bg-muted rounded-full">
        <motion.div
            className="h-full w-full bg-destructive rounded-full origin-top"
            style={{ scaleY: scrollYProgress }}
        />
    </div>
  );
}

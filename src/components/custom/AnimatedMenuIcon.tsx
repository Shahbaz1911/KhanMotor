
"use client";

import { cn } from "@/lib/utils";

interface AnimatedMenuIconProps {
  isOpen: boolean;
  className?: string;
}

export function AnimatedMenuIcon({ isOpen, className }: AnimatedMenuIconProps) {
  const barClasses = "absolute h-px w-full bg-current transition-all duration-300 ease-in-out";

  return (
    <div className={cn("relative h-5 w-5", className)}>
      <span
        className={cn(
          barClasses,
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          isOpen ? "rotate-45" : "rotate-0"
        )}
      />
      <span
        className={cn(
          barClasses,
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          isOpen ? "-rotate-45" : "rotate-90"
        )}
      />
    </div>
  );
}

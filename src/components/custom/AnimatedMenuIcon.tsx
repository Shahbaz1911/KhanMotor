
"use client";

import { cn } from "@/lib/utils";

interface AnimatedMenuIconProps {
  isOpen: boolean;
  className?: string;
}

export function AnimatedMenuIcon({ isOpen, className }: AnimatedMenuIconProps) {
  const barClasses = "absolute h-px w-full bg-current transition-all duration-300 ease-in-out left-0";

  return (
    <div className={cn("relative h-5 w-5", className)}>
      <span
        className={cn(
          barClasses,
          isOpen ? "top-1/2 rotate-45" : "top-[35%]"
        )}
      />
      <span
        className={cn(
          barClasses,
           isOpen ? "top-1/2 -rotate-45" : "top-[65%]"
        )}
      />
    </div>
  );
}

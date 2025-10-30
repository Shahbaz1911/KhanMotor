"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion, useAnimate } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const StatefulButton = ({ className, children, ...props }: ButtonProps) => {
  const [scope, animate] = useAnimate();
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle");

  const animateLoading = async () => {
    await animate(
      ".loader",
      {
        width: "20px",
        scale: 1,
        display: "block",
      },
      {
        duration: 0.2,
      },
    );
  };

  const animateSuccess = async () => {
    await animate(
      ".loader",
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        duration: 0.2,
      },
    );
    await animate(
      ".check",
      {
        width: "20px",
        scale: 1,
        display: "block",
      },
      {
        duration: 0.2,
      },
    );

    await animate(
      ".check",
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        delay: 2,
        duration: 0.2,
      },
    );
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.disabled) return;
    setStatus("loading");
    await animateLoading();
    
    // Check if onClick is provided and is a promise
    if (props.onClick) {
        try {
            await props.onClick(event);
            setStatus("success");
            await animateSuccess();
        } catch (error) {
            // Handle error case if needed
            console.error("Operation failed:", error);
            // Optionally, animate back to idle state
            await animate( ".loader", { width: "0px", scale: 0, display: "none" }, { duration: 0.2 } );

        } finally {
            setTimeout(() => setStatus("idle"), 2500); // Reset after success animation
        }
    } else {
        setStatus("idle");
    }
  };

  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    ...buttonProps
  } = props;

  return (
    <motion.button
      layout
      layoutId="button"
      ref={scope}
      className={cn(
        "flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-black ring-offset-2 transition duration-200",
        {
            "bg-primary text-primary-foreground hover:bg-primary/90": status === "idle",
            "bg-primary/80 text-primary-foreground": status === "loading",
            "bg-green-500 text-white": status === "success",
        },
        className,
      )}
      {...buttonProps}
      onClick={handleClick}
      disabled={status !== "idle" || props.disabled}
    >
      <motion.div layout className="flex items-center justify-center gap-2 h-6">
        <Loader />
        <CheckIcon />
        <motion.span layout>
            {status === 'idle' && children}
            {status === 'loading' && 'Requesting...'}
            {status === 'success' && 'Success!'}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

const Loader = () => {
  return (
    <motion.svg
      animate={{
        rotate: [0, 360],
      }}
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.8,
        display: "none",
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="loader text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  );
};

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.8,
        display: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  );
};

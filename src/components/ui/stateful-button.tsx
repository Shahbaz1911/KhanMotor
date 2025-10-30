"use client";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { motion, useAnimate } from "framer-motion";

type Status = "idle" | "loading" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  status?: Status;
}

export const StatefulButton = ({
  className,
  children,
  status = "idle",
  ...props
}: ButtonProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const handleStatusChange = async () => {
      if (status === "loading") {
        await animate(
          ".loader",
          { width: "20px", scale: 1, display: "block" },
          { duration: 0.2 }
        );
        await animate(".check", { display: "none", scale: 0, width: 0 });
      } else if (status === "success") {
        await animate(".loader", { display: "none", scale: 0, width: 0 });
        await animate(
          ".check",
          { width: "20px", scale: 1, display: "block" },
          { duration: 0.2 }
        );
      } else {
        await animate([
          [".loader", { display: "none", scale: 0, width: 0 }, { duration: 0 }],
          [".check", { display: "none", scale: 0, width: 0 }, { duration: 0 }],
        ]);
      }
    };
    handleStatusChange();
  }, [status, animate]);

  return (
    <motion.button
      layout
      layoutId="button"
      ref={scope}
      className={cn(
        "flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-black ring-offset-2 transition duration-200",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": status === "idle",
          "bg-primary/80 text-primary-foreground cursor-not-allowed": status === "loading",
          "bg-green-500 text-white cursor-not-allowed": status === "success",
        },
        className
      )}
      {...props}
      disabled={status !== "idle" || props.disabled}
    >
      <motion.div layout className="flex items-center justify-center gap-2 h-6">
        <Loader />
        <CheckIcon />
        <motion.span layout>
          {status === "idle" && children}
          {status === "loading" && "Requesting..."}
          {status === "success" && "Success!"}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

const Loader = () => {
  return (
    <motion.svg
      animate={{ rotate: [0, 360] }}
      initial={{ scale: 0, width: 0, display: "none" }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
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
      initial={{ scale: 0, width: 0, display: "none" }}
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

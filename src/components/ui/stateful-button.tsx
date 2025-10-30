"use client";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { motion, useAnimate } from "framer-motion";
import { Loader2, Check, CalendarCheck } from "lucide-react";

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
          { width: "20px", scale: 1, display: "flex" },
          { duration: 0.2 }
        );
        await animate(".check", { display: "none", scale: 0, width: 0 });
        await animate(".idle-icon", { display: "none", scale: 0, width: 0 });
      } else if (status === "success") {
        await animate(".loader", { display: "none", scale: 0, width: 0 });
         await animate(".idle-icon", { display: "none", scale: 0, width: 0 });
        await animate(
          ".check",
          { width: "20px", scale: 1, display: "flex" },
          { duration: 0.2 }
        );
      } else {
        await animate([
          [".loader", { display: "none", scale: 0, width: 0 }, { duration: 0 }],
          [".check", { display: "none", scale: 0, width: 0 }, { duration: 0 }],
          [".idle-icon", { display: "flex", scale: 1, width: "20px" }, { duration: 0 }],
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
        "flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 font-black ring-offset-background transition duration-200",
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
        <IdleIcon />
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
    <motion.div
        initial={{ scale: 0, width: 0, display: "none" }}
        className="loader"
    >
        <Loader2 className="h-5 w-5 animate-spin" />
    </motion.div>
  );
};

const CheckIcon = () => {
  return (
     <motion.div
        initial={{ scale: 0, width: 0, display: "none" }}
        className="check"
    >
        <Check className="h-5 w-5" />
    </motion.div>
  );
};

const IdleIcon = () => {
    return (
        <motion.div 
            initial={{ scale: 1, width: "20px", display: "flex" }}
            className="idle-icon"
        >
            <CalendarCheck className="h-5 w-5" />
        </motion.div>
    )
}

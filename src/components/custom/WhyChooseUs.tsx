
"use client";

import React, { useRef } from "react";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const highlightItems = [
  {
    icon: Car,
    title: "Premium Vehicle Selection",
    description: "handpicked luxury and performance cars. find your next car for sale from our curated collection at our car dealership.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Quality & Inspection",
    description: "each vehicle undergoes a rigorous vehicle inspection service. we offer certified pre-owned cars for your peace of mind.",
  },
  {
    icon: Wrench,
    title: "Expert Auto Maintenance",
    description: "state-of-the-art auto repair shop with certified technicians for all your auto maintenance needs, from oil change service to transmission repair.",
  },
  {
    icon: MessageSquareHeart,
    title: "Personalized Service",
    description: "our trusted car workshop offers dedicated consultants to guide you. we even offer a mobile mechanic for your convenience.",
  },
];

const TimelineItem = ({
  item,
  isLeft,
  progress,
}: {
  item: (typeof highlightItems)[0];
  isLeft: boolean;
  progress: any;
}) => {
  
  const borderColor = useTransform(
    progress,
    [0.45, 0.5, 0.55],
    ["hsl(var(--border))", "hsl(var(--destructive))", "hsl(var(--border))"]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50, scale: 0.95 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full relative"
    >
      <motion.div
        style={{ borderColor }}
        className="bg-card/90 backdrop-blur-md shadow-lg w-full h-full relative overflow-hidden rounded-lg border-2"
      >
        <CardHeader>
            <CardTitle className="uppercase text-xl font-black">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground lowercase">{item.description.toLowerCase()}</p>
        </CardContent>
      </motion.div>
    </motion.div>
  );
};


export function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
  };
  

  return (
    <section ref={sectionRef} id="highlights" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
            <motion.h2
                variants={titleVariants}
                className="text-4xl tracking-tight lg:text-5xl font-black uppercase"
            >
                Why Choose Motor Khan?
            </motion.h2>
            <motion.p
                variants={textVariants}
                className="text-lg text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto lowercase"
            >
                experience the difference at our auto service center, where every detail is crafted for your satisfaction.
            </motion.p>
        </motion.div>
        
        <div className="relative w-full max-w-4xl mx-auto">
            {/* The vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 h-full w-0.5 bg-border md:-translate-x-1/2" aria-hidden="true">
                 <motion.div 
                    className="h-full w-full bg-destructive origin-top"
                    style={{ scaleY: scaleY }}
                 />
            </div>
            
            <div className="relative flex flex-col gap-12">
                {highlightItems.map((item, index) => {
                    const itemRef = useRef<HTMLDivElement>(null);
                    const { scrollYProgress: itemScrollYProgress } = useScroll({
                        target: itemRef,
                        offset: ["start end", "start center"]
                    });

                     const iconBorderColor = useTransform(
                        itemScrollYProgress,
                        [0.45, 0.5, 0.55],
                        ["hsl(var(--border))", "hsl(var(--destructive))", "hsl(var(--border))"]
                    );

                    return (
                        <div key={item.title} ref={itemRef} className={cn("relative flex items-center min-h-[150px]", "md:justify-start")}>
                            {/* Icon on the timeline */}
                            <div className="absolute left-6 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <motion.div
                                     style={{ 
                                        backgroundColor: useTransform(itemScrollYProgress, [0.4, 0.5], ["hsl(var(--background))", "hsl(var(--destructive))"]),
                                        color: useTransform(itemScrollYProgress, [0.4, 0.5], ["hsl(var(--destructive))", "hsl(var(--primary-foreground))"]),
                                        scale: useTransform(itemScrollYProgress, [0.4, 0.5, 0.6], [1, 1.2, 1]),
                                        borderColor: iconBorderColor
                                     }}
                                     className="flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background"
                                >
                                    <item.icon className="h-6 w-6" />
                                </motion.div>
                            </div>

                            {/* Mobile layout: all cards on the right of the timeline */}
                             <div className="md:hidden w-[calc(100%-4rem)] ml-[4rem]">
                                <TimelineItem item={item} isLeft={false} progress={itemScrollYProgress} />
                            </div>
                            
                            {/* Desktop layout: alternating cards */}
                             <div className={cn("hidden md:flex w-full", index % 2 === 0 ? "justify-start" : "justify-end")}>
                                <div className="w-[calc(50%-4rem)]">
                                    <TimelineItem item={item} isLeft={index % 2 === 0} progress={itemScrollYProgress}/>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </section>
  );
}

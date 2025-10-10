
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
    description: "Handpicked luxury and performance cars from world-renowned brands.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Quality",
    description: "Each vehicle undergoes rigorous inspection for your peace of mind.",
  },
  {
    icon: Wrench,
    title: "Expert Maintenance",
    description: "State-of-the-art service center with certified technicians.",
  },
  {
    icon: MessageSquareHeart,
    title: "Personalized Service",
    description: "Dedicated consultants to guide you through a bespoke buying experience.",
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
  const ref = useRef<HTMLDivElement>(null);
  
  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -50 : 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const animatedRotation = useTransform(progress, [0, 1], [0, 360]);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="w-full relative p-[1px] rounded-lg"
    >
       <motion.div
        className="absolute inset-0 rounded-lg -z-10"
        style={{
          background: useTransform(
            animatedRotation,
            (r) => `conic-gradient(from ${r}deg at 50% 50%, hsl(var(--destructive)) 0%, hsl(var(--primary)) 20%, transparent 100%)`
          ),
          opacity: useTransform(progress, [0.3, 0.4, 0.6], [0, 1, 0]),
        }}
      />
      <Card className="bg-card/90 backdrop-blur-md border-border shadow-lg w-full h-full">
         <CardHeader>
            <CardTitle className="uppercase text-xl font-black">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{item.description}</p>
        </CardContent>
      </Card>
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
                Why Choose Arman Autoxperts?
            </motion.h2>
            <motion.p
                variants={textVariants}
                className="text-lg text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto"
            >
                Experience the difference of true automotive excellence, where every detail is crafted for your satisfaction.
            </motion.p>
        </motion.div>
        
        <div className="relative w-full max-w-4xl mx-auto">
            {/* The vertical line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2" aria-hidden="true">
                 <motion.div 
                    className="h-full w-full bg-primary origin-top"
                    style={{ scaleY: scaleY }}
                 />
            </div>
            
            <div className="relative flex flex-col gap-12">
                {highlightItems.map((item, index) => {
                    const isLeft = index % 2 === 0;
                    const itemRef = useRef<HTMLDivElement>(null);
                    const { scrollYProgress: itemScrollYProgress } = useScroll({
                        target: itemRef,
                        offset: ["start end", "center center"]
                    });

                    return (
                        <div key={item.title} ref={itemRef} className="relative flex items-center min-h-[150px]">
                            {/* Icon on the timeline */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <motion.div
                                     style={{ 
                                        backgroundColor: useTransform(itemScrollYProgress, [0.3, 0.4], ["hsl(var(--background))", "hsl(var(--primary))"]),
                                        color: useTransform(itemScrollYProgress, [0.3, 0.4], ["hsl(var(--primary))", "hsl(var(--primary-foreground))"]),
                                        scale: useTransform(itemScrollYProgress, [0.3, 0.4, 0.6], [1, 1.2, 1]),
                                     }}
                                     className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background"
                                >
                                    <item.icon className="h-6 w-6" />
                                </motion.div>
                            </div>

                            {/* Horizontal connector line for desktop */}
                             <div className="hidden md:block absolute top-1/2 -translate-y-1/2 h-0.5 bg-border w-1/2"
                                style={{ left: isLeft ? '0' : '50%', right: isLeft ? '50%' : '0' }}
                             >
                                <motion.div 
                                    className={cn("h-full bg-primary", isLeft ? "origin-right" : "origin-left")}
                                    style={{ scaleX: itemScrollYProgress }}
                                />
                            </div>

                            {/* Mobile layout: all cards on the right */}
                             <div className="md:hidden w-[calc(50%-2rem)] ml-auto">
                                <TimelineItem item={item} isLeft={false} progress={itemScrollYProgress} />
                            </div>
                            
                            {/* Desktop layout: alternating cards */}
                             <div className="hidden md:flex w-full">
                               {isLeft ? (
                                    <div className="w-[calc(50%-4rem)] mr-auto">
                                        <TimelineItem item={item} isLeft={true} progress={itemScrollYProgress} />
                                    </div>
                                ) : (
                                   <div className="w-1/2"></div> /* Spacer for right-aligned cards */
                                )}
                                 {!isLeft ? (
                                    <div className="w-[calc(50%-4rem)] ml-auto">
                                        <TimelineItem item={item} isLeft={false} progress={itemScrollYProgress}/>
                                    </div>
                                ) : (
                                    <div className="w-1/2"></div> /* Spacer for left-aligned cards */
                                )}
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

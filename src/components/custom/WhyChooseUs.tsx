
"use client";

import React, { useRef } from "react";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion, useScroll, useSpring } from "framer-motion";
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
}: {
  item: (typeof highlightItems)[0];
  isLeft: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -100 : 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={cn("flex items-center w-full", isLeft ? "justify-start" : "justify-end")}
    >
      <div className={cn("w-full md:w-1/2", isLeft ? "md:pr-8" : "md:pl-8")}>
        <Card className="bg-card/50 backdrop-blur-md border-border shadow-lg w-full">
            <motion.div style={{ scale: scrollYProgress }}>
                 <CardHeader>
                    <CardTitle className="uppercase text-xl font-black">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
            </motion.div>
        </Card>
      </div>
    </motion.div>
  );
};


export function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const scaleX = useSpring(scrollYProgress, {
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
                    style={{ scaleY: scaleX }}
                 />
            </div>
            
            <div className="relative flex flex-col gap-12">
                {highlightItems.map((item, index) => (
                    <div key={item.title} className="relative flex items-center">
                         {/* Icon on the timeline */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <motion.div
                                 whileInView={{ 
                                    backgroundColor: ["hsl(var(--background))", "hsl(var(--primary))"],
                                    color: ["hsl(var(--primary))", "hsl(var(--primary-foreground))"],
                                 }}
                                 viewport={{ once: true, amount: 0.5 }}
                                 transition={{ duration: 0.4, delay: 0.3 }}
                                 className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background"
                            >
                                <item.icon className="h-6 w-6" />
                            </motion.div>
                        </div>

                         {/* Mobile layout: all cards on the right */}
                        <div className="md:hidden w-full pl-12">
                             <TimelineItem item={item} isLeft={false} />
                        </div>
                        
                         {/* Desktop layout: alternating cards */}
                        <div className="hidden md:flex w-full">
                           {index % 2 === 0 ? (
                                <div className="w-1/2 pr-6">
                                     <TimelineItem item={item} isLeft={true} />
                                </div>
                            ) : (
                                <div className="w-1/2"></div>
                            )}
                             {index % 2 !== 0 ? (
                                <div className="w-1/2 pl-6">
                                     <TimelineItem item={item} isLeft={false} />
                                </div>
                            ) : (
                                <div className="w-1/2"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}

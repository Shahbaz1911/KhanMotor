
"use client";

import React, { useRef, useEffect } from "react";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion, useAnimation, useInView } from "framer-motion";
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

const TimelineItem = ({ item, index }: { item: typeof highlightItems[0], index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const controls = useAnimation();
    const isOdd = index % 2 !== 0;

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);
    
    const cardVariants = {
        hidden: { opacity: 0, x: isOdd ? 100 : -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };
    
    const iconVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.3 } }
    };

    return (
        <div ref={ref} className="relative w-full">
            <div className={cn("flex items-center", isOdd ? "justify-start md:justify-end md:text-right" : "justify-start")}>
                <div className={cn("w-full md:w-5/12", isOdd && "md:order-2")}>
                    <motion.div variants={cardVariants} initial="hidden" animate={controls}>
                        <Card className="bg-card/50 backdrop-blur-md border-border shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl font-black uppercase">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            <motion.div
                variants={iconVariants}
                initial="hidden"
                animate={controls}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 p-2 border border-primary/30 text-primary bg-background">
                    <item.icon className="h-6 w-6" />
                </div>
            </motion.div>
        </div>
    );
}


export function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
             <div className="absolute left-1/2 top-0 h-full w-px bg-border/50 -translate-x-1/2 hidden md:block"></div>
             <div className="space-y-16 md:space-y-24">
                {highlightItems.map((item, index) => (
                    <TimelineItem key={item.title} item={item} index={index} />
                ))}
             </div>
        </div>
      </div>
    </section>
  );
}

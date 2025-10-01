
"use client";

import React, { useRef } from "react";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

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

function HighlightItem({
  item,
  index,
  totalItems,
  scrollYProgress,
}: {
  item: typeof highlightItems[0];
  index: number;
  totalItems: number;
  scrollYProgress: any;
}) {
  const isEven = index % 2 === 0;

  // Calculate the start and end points for this item's animation
  const start = index / totalItems;
  const end = (index + 1) / totalItems;

  // Create transforms for opacity and position based on scroll progress
  const opacity = useTransform(scrollYProgress, [start, (start + end) / 2], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [start, (start + end) / 2],
    [isEven ? 50 : -50, 0]
  );
  
  const iconY = useTransform(scrollYProgress, [start, (start + end) / 2], [20, 0]);


  return (
    <motion.div
      className={cn("relative md:pl-[52px]")}
      style={{ opacity, x }}
    >
       <motion.div style={{ opacity, y: iconY }} className={cn(
        "absolute -translate-y-4 left-0 translate-x-0 !ml-0 h-8 w-8 rounded-full bg-primary/20 text-primary p-2 flex items-center justify-center border border-primary/30",
        )}>
        <item.icon className="h-5 w-5" />
      </motion.div>
      <Card className={cn(
        "mt-6 bg-background/50 backdrop-blur-md border-white/20",
        "w-full md:w-[calc(50%-2rem)]", 
        isEven ? "md:ml-[calc(50%+2rem)]" : "md:mr-[calc(50%+2rem)]"
      )}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20 text-primary p-2 border border-primary/30">
              <item.icon className="h-6 w-6" />
            </div>
            <CardTitle className="text-white text-2xl font-black">{item.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{item.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}


export function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: titleProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleOpacity = useTransform(titleProgress, [0.1, 0.3], [0, 1]);
  const titleY = useTransform(titleProgress, [0.1, 0.3], [20, 0]);

  const pOpacity = useTransform(titleProgress, [0.2, 0.4], [0, 1]);
  const pY = useTransform(titleProgress, [0.2, 0.4], [20, 0]);
  
  return (
    <section ref={sectionRef} id="highlights" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
            <motion.h2 
                style={{ opacity: titleOpacity, y: titleY }}
                className="text-4xl tracking-tight lg:text-5xl text-white font-black"
            >
                Why Choose Khan Motor?
            </motion.h2>
            <motion.p 
                style={{ opacity: pOpacity, y: pY }}
                className="text-lg text-gray-300 md:text-xl mt-4"
            >
                Experience the difference of true automotive excellence.
            </motion.p>
        </div>
        
        <div className="md:hidden space-y-8">
            {highlightItems.map((item, index) => (
                <Card key={`mobile-highlight-${index}`} className="bg-background/50 backdrop-blur-md border-white/20">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 text-primary p-2 border border-primary/30">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-white text-xl font-black">{item.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <div className="hidden md:block">
             <div ref={targetRef} className="relative w-full max-w-4xl mx-auto h-full">
                <div className="absolute left-1/2 -translate-x-1/2 top-3 h-full w-px">
                   {/* This is the static line */}
                </div>
                <div className="relative pt-4 antialiased space-y-12">
                    {highlightItems.map((item, index) => (
                        <HighlightItem 
                            key={`content-${index}`} 
                            item={item} 
                            index={index}
                            totalItems={highlightItems.length}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}

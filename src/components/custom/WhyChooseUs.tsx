
"use client";

import React, { useRef } from "react";
import { TracingBeam } from "./TracingBeam";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";

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

function HighlightItem({ item, index }: { item: typeof highlightItems[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const isEven = index % 2 === 0;

  const variants = {
    hidden: { opacity: 0, x: isEven ? 50 : -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative pl-[52px]" 
    >
      <div className="absolute -translate-y-4 left-0 translate-x-0 !ml-0 h-8 w-8 rounded-full bg-primary/20 text-primary p-2 flex items-center justify-center border border-primary/30">
        <item.icon className="h-5 w-5" />
      </div>
      <Card className={cn(
        "mt-6 bg-background/50 backdrop-blur-md border-white/20",
        "w-[calc(50%-2rem)]", 
        isEven ? "ml-[calc(50%+2rem)]" : "mr-[calc(50%+2rem)]"
      )}>
        <CardHeader>
          <CardTitle className="text-white text-2xl font-black">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{item.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}


export function WhyChooseUs() {
  return (
    <section id="highlights" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl tracking-tight lg:text-5xl text-white font-black">
            Why Choose Khan Motor?
          </h2>
          <p className="text-lg text-gray-300 md:text-xl mt-4">
            Experience the difference of true automotive excellence.
          </p>
        </div>
        
        <TracingBeam className="px-6">
          <div className="relative pt-4 antialiased space-y-12">
            {highlightItems.map((item, index) => (
              <HighlightItem key={`content-${index}`} item={item} index={index} />
            ))}
          </div>
        </TracingBeam>

      </div>
    </section>
  );
}

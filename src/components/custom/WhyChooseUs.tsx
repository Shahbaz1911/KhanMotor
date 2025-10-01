
"use client";

import React, { useRef } from "react";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TracingBeam } from "./TracingBeam";
import { motion } from "framer-motion";

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
                className="text-4xl tracking-tight lg:text-5xl font-black"
            >
                Why Choose Khan Motor?
            </motion.h2>
            <motion.p 
                variants={textVariants}
                className="text-lg text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto"
            >
                Experience the difference of true automotive excellence, where every detail is crafted for your satisfaction.
            </motion.p>
        </motion.div>
        
        <TracingBeam className="px-6">
          <div className="space-y-12">
            {highlightItems.map((item, index) => (
              <div key={`content-${index}`} className="relative">
                 <div className="absolute -left-1.5 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2"></div>
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="md:absolute md:left-1/2 md:-translate-x-1/2 md:-translate-y-4">
                    <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 p-2 border border-primary/30 text-primary">
                       <item.icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="md:ml-[calc(50%+2rem)] md:pl-8">
                    <Card className="bg-card/50 backdrop-blur-md border-border">
                        <CardHeader>
                            <CardTitle className="text-xl font-black">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                </div>
              </div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </section>
  );
}

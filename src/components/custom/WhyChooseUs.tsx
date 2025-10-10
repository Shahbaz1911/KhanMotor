
"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { TracingBeam } from "./TracingBeam";

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
  isActive,
}: {
  item: (typeof highlightItems)[0];
  isActive: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="mb-10 ml-4 pl-8"
    >
      <div
        className={cn(
          "absolute -left-3.5 mt-1.5 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-background text-primary transition-colors duration-300",
          isActive ? "bg-primary/20" : "text-muted-foreground"
        )}
      >
        <item.icon className="h-6 w-6" />
      </div>
      <Card className="bg-card/50 backdrop-blur-md border-border shadow-lg">
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
  const [activeCard, setActiveCard] = useState(0);

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
        
        <TracingBeam className="ml-4">
          <div className="relative">
            {highlightItems.map((item, index) => (
              <TimelineItem
                key={item.title}
                item={item}
                isActive={index <= activeCard}
              />
            ))}
          </div>
        </TracingBeam>
      </div>
    </section>
  );
}

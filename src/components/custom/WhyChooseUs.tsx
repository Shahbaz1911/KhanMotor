
"use client";

import React, { useRef, useEffect } from "react";
import { TracingBeam } from "./TracingBeam";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


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
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn("relative md:pl-[52px]")}
    >
       <div className={cn(
        "absolute -translate-y-4 left-0 translate-x-0 !ml-0 h-8 w-8 rounded-full bg-primary/20 text-primary p-2 flex items-center justify-center border border-primary/30",
        )}>
        <item.icon className="h-5 w-5" />
      </div>
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
    </div>
  );
}


export function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from(sectionRef.current?.querySelector('h2'), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
      });
      gsap.from(sectionRef.current?.querySelector('p'), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.2
      });
      
      // Animate cards
      const cards = sectionRef.current?.querySelectorAll('[data-highlight-item]');
      cards?.forEach((card) => {
        const isEven = card.getAttribute('data-index') ? parseInt(card.getAttribute('data-index')!) % 2 === 0 : false;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          x: isEven ? 50 : -50,
          duration: 0.8,
          ease: "power3.out",
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="highlights" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl tracking-tight lg:text-5xl text-white font-black">
            Why Choose Khan Motor?
          </h2>
          <p className="text-lg text-gray-300 md:text-xl mt-4">
            Experience the difference of true automotive excellence.
          </p>
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
            <TracingBeam className="px-6">
            <div className="relative pt-4 antialiased space-y-12">
                {highlightItems.map((item, index) => (
                    <div key={`content-${index}`} data-highlight-item data-index={index}>
                        <HighlightItem item={item} index={index} />
                    </div>
                ))}
            </div>
            </TracingBeam>
        </div>

      </div>
    </section>
  );
}

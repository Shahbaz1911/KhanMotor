
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ShieldCheck, Wrench, MessageSquareHeart } from "lucide-react"; // Example icons
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const highlightItems = [
  {
    icon: Car,
    title: "Premium Vehicle Selection",
    description: "Handpicked luxury and performance cars from world-renowned brands.",
    aiHint: "luxury car silhouette",
  },
  {
    icon: ShieldCheck,
    title: "Verified Quality",
    description: "Each vehicle undergoes rigorous inspection for your peace of mind.",
    aiHint: "shield checkmark",
  },
  {
    icon: Wrench,
    title: "Expert Maintenance",
    description: "State-of-the-art service center with certified technicians.",
    aiHint: "wrench gear",
  },
  {
    icon: MessageSquareHeart,
    title: "Personalized Service",
    description: "Dedicated consultants to guide you through a bespoke buying experience.",
    aiHint: "handshake deal",
  },
];

export function GlassHighlightGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Horizontal scroll for the title
      if (titleContainerRef.current && titleRef.current) {
        gsap.to(titleRef.current, {
          x: () => `-${titleRef.current!.scrollWidth - titleContainerRef.current!.offsetWidth}`,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Animate subtitle
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 30,
        duration: 0.6
      });
      
      // Animate grid items one by one
      if (gridRef.current) {
        const cards = gsap.utils.toArray(gridRef.current.children);
        cards.forEach((card, i) => {
          gsap.from(card as HTMLElement, {
            scrollTrigger: {
              trigger: card as HTMLElement,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: "power3.out",
          });
        });
      }
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="highlights" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div ref={titleContainerRef} className="overflow-hidden">
             <h2 ref={titleRef} className="whitespace-nowrap py-4 text-4xl tracking-tight lg:text-5xl text-white font-black">
                Why Choose Khan Motor?&nbsp;&mdash;&nbsp;Why Choose Khan Motor?&nbsp;&mdash;&nbsp;Why Choose Khan Motor?&nbsp;&mdash;&nbsp;
             </h2>
          </div>
          <p ref={textRef} className="text-center text-lg text-gray-300 md:text-xl">
            Experience the difference of true automotive excellence.
          </p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {highlightItems.map((item, index) => (
            <Card
              key={index}
              className="transform transition-all duration-300 hover:scale-105 bg-background/50 dark:bg-foreground/5 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden text-white flex flex-col sm:flex-row items-center p-6"
            >
              <div className="mb-4 sm:mb-0 sm:mr-6 rounded-full bg-white/10 p-4 text-white shrink-0">
                <item.icon className="h-10 w-10" />
              </div>
              <div className="text-center sm:text-left">
                <CardTitle className="text-xl font-black mb-2">{item.title}</CardTitle>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

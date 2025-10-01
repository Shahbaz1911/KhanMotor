
"use client";

import React, { useRef, useEffect } from "react";
import {
  Wrench,
  Paintbrush,
  Repeat,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Wrench,
    title: "Car Repair",
    description: "Comprehensive repair services by certified technicians to keep your vehicle in peak condition.",
  },
  {
    icon: Paintbrush,
    title: "Denting & Painting",
    description: "State-of-the-art bodywork and paint services to restore your car's pristine look.",
  },
  {
    icon: Repeat,
    title: "Buy & Sell",
    description: "A trusted marketplace for buying and selling premium pre-owned luxury vehicles.",
  },
  {
    icon: ShieldCheck,
    title: "Maintenance",
    description: "Scheduled maintenance and expert care to ensure longevity and performance.",
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: 0.6,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl tracking-tight lg:text-5xl text-foreground font-black">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl mt-4">
            Comprehensive care for your luxury vehicle.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div key={index} ref={el => cardsRef.current[index] = el}>
              <Card className="h-full flex flex-col items-center text-center bg-card/50 backdrop-blur-md border-border shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-destructive/30">
                <CardHeader className="items-center">
                  <div className="p-4 bg-destructive/20 rounded-full border border-destructive/30 mb-4">
                    <service.icon className="h-8 w-8 text-destructive" />
                  </div>
                  <CardTitle className="text-2xl font-black">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import React from "react";
import { TracingBeam } from "./TracingBeam";
import {
  Car,
  ShieldCheck,
  Wrench,
  MessageSquareHeart,
} from "lucide-react";

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
          <div className="relative pt-4 antialiased">
            {highlightItems.map((item, index) => (
              <div key={`content-${index}`} className="mb-10">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 rounded-full bg-primary/20 text-primary p-3 border border-primary/30">
                        <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black text-white">
                        {item.title}
                    </h3>
                </div>

                <div className="text-lg prose prose-sm dark:prose-invert text-muted-foreground ml-16">
                    {item.description}
                </div>
              </div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </section>
  );
}


"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, ShieldCheck, Wrench, MessageSquareHeart } from "lucide-react"; // Example icons

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
  return (
    <section id="highlights" className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-kajiro md:font-headline text-primary">
            Why Choose Khan Motor?
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl">
            Experience the difference of true automotive excellence.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlightItems.map((item, index) => (
            <Card
              key={index}
              className="transform transition-all duration-300 hover:scale-105 bg-background/50 dark:bg-foreground/5 backdrop-blur-lg border border-white/20 dark:border-black/20 shadow-xl overflow-hidden"
            >
              <CardHeader className="items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <item.icon className="h-10 w-10" />
                </div>
                <CardTitle className="font-kajiro md:font-headline text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const brands = [
  { name: "Audi", logoUrl: "https://images.unsplash.com/photo-1597999641658-7b7a23edcb5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxhdWRpJTIwbG9nb3xlbnwwfHx8fDE3NTAyNTE4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", aiHint: "audi logo" },
  { name: "BMW", logoUrl: "https://images.unsplash.com/photo-1610392993153-969fb100f721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Ym13JTIwbG9nb3xlbnwwfHx8fDE3NTAyNTE4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", aiHint: "bmw logo" },
  { name: "Mercedes-Benz", logoUrl: "https://images.unsplash.com/photo-1625074692991-b57f8ff90df6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtZXJjZWRlcyUyMGxvZ298ZW58MHx8fHwxNzUwMjUxODA0fDA&ixlib=rb-4.1.0&q=80&w=1080", aiHint: "mercedes logo" },
  { name: "Porsche", logoUrl: "https://images.unsplash.com/photo-1714989538383-90b6e29734c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8cG9yc2NoZSUyMGxvZ298ZW58MHx8fHwxNzUwMjUxODA0fDA&ixlib=rb-4.1.0&q=80&w=1080", aiHint: "porsche logo" },
  { name: "Tesla", logoUrl: "https://images.unsplash.com/photo-1657710190248-9506090f81e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHx0ZXNsYSUyMGxvZ298ZW58MHx8fHwxNzUwMjUxODA0fDA&ixlib=rb-4.1.0&q=80&w=1080", aiHint: "tesla logo" },
  { name: "Ferrari", logoUrl: "https://images.unsplash.com/photo-1623173103439-fd360deedad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmZXJyYXJpJTIwbG9nb3xlbnwwfHx8fDE3NTAyNTE4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", aiHint: "ferrari logo" },
  { name: "Lamborghini", logoUrl: "https://images.unsplash.com/photo-1597423012010-f7554c74bad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxsYW1ib3JnaGluaSUyMGxvZ298ZW58MHx8fHwxNzUwMjUxODA0fDA&ixlib=rb-4.1.0&q=80&w=1080", aiHint: "lamborghini logo" },
  { name: "Rolls-Royce", logoUrl: "https://images.unsplash.com/photo-1654021610606-bf229a2e27e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyb2xsc3JveWNlJTIwbG9nb3xlbnwwfHx8fDE3NTAyNTE4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080", aiHint: "rollsroyce logo" },
];

export function MarqueeBrandScroller() {
  return (
    <section id="brand-scroller" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl font-headline text-primary">
            Our Trusted Automotive Partners
          </h2>
          <p className="text-md text-muted-foreground md:text-lg">
            Collaborating with the best in the automotive industry.
          </p>
        </div>
        <div className="relative">
          <div className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
            {brands.map((brand, index) => (
              <div key={index} className="flex-shrink-0 snap-center">
                <Card className="w-48 overflow-hidden shadow-md transition-shadow hover:shadow-lg">
                  <CardContent className="flex h-24 items-center justify-center p-4">
                    <div className="relative h-16 w-full">
                      <Image
                        src={brand.logoUrl}
                        alt={`${brand.name} logo`}
                        layout="fill"
                        objectFit="contain"
                        data-ai-hint={brand.aiHint}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          {/* Optional: Add gradient overlays for a fading effect at the edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

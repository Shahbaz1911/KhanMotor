
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const brands = [
  { name: "Audi", logoUrl: "https://placehold.co/150x75.png", aiHint: "audi logo" },
  { name: "BMW", logoUrl: "https://placehold.co/150x75.png", aiHint: "bmw logo" },
  { name: "Mercedes-Benz", logoUrl: "https://placehold.co/150x75.png", aiHint: "mercedes logo" },
  { name: "Porsche", logoUrl: "https://placehold.co/150x75.png", aiHint: "porsche logo" },
  { name: "Tesla", logoUrl: "https://placehold.co/150x75.png", aiHint: "tesla logo" },
  { name: "Ferrari", logoUrl: "https://placehold.co/150x75.png", aiHint: "ferrari logo" },
  { name: "Lamborghini", logoUrl: "https://placehold.co/150x75.png", aiHint: "lamborghini logo" },
  { name: "Rolls-Royce", logoUrl: "https://placehold.co/150x75.png", aiHint: "rollsroyce logo" },
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

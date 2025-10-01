
"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import placeholderImages from "@/lib/placeholder-images.json";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const galleryItems = [
  {
    customerName: "Alex Johnson",
    caption: "Proud owner of this beauty!",
    imageUrl: placeholderImages.customer1.url,
    aiHint: placeholderImages.customer1.aiHint,
    rating: 5,
  },
  {
    customerName: "Maria Garcia",
    caption: "Serviced to perfection.",
    imageUrl: placeholderImages.customer2.url,
    aiHint: placeholderImages.customer2.aiHint,
    rating: 5,
  },
  {
    customerName: "David Smith",
    caption: "Found my dream car here.",
    imageUrl: placeholderImages.customer3.url,
    aiHint: placeholderImages.customer3.aiHint,
    rating: 5,
  },
  {
    customerName: "Jessica Williams",
    caption: "Top-notch service.",
    imageUrl: placeholderImages.customer4.url,
    aiHint: placeholderImages.customer4.aiHint,
    rating: 5,
  },
  {
    customerName: "Chen Wang",
    caption: "In love with my new ride.",
    imageUrl: placeholderImages.customer5.url,
    aiHint: placeholderImages.customer5.aiHint,
    rating: 5,
  },
  {
    customerName: "Fatima Al-Fassi",
    caption: "Excellent repair work.",
    imageUrl: placeholderImages.customer6.url,
    aiHint: placeholderImages.customer6.aiHint,
    rating: 5,
  },
];

export function HappyCustomerGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!gridRef.current) return;
      
      const cards = Array.from(gridRef.current.children);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        cards,
        {
          opacity: 0,
          scale: 0.9,
          y: 50,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.5"
      );

      cards.forEach(card => {
        const otherCards = cards.filter(c => c !== card);
        
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power3.out', zIndex: 10 });
          gsap.to(otherCards, { scale: 0.95, duration: 0.3, ease: 'power3.out' });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(cards, { scale: 1, duration: 0.3, ease: 'power3.out', zIndex: 1 });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="customer-gallery" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="mb-12 text-center">
          <h2 className="text-4xl tracking-tight lg:text-5xl text-foreground font-black">
            Happy Customers, Happy Cars
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl mt-4">
            Join our community of satisfied clients and their stunning vehicles.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative block w-full overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={item.imageUrl}
                alt={`Customer ${item.customerName}`}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                data-ai-hint={item.aiHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                 <div className="relative z-10 text-white">
                  <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="text-xl font-black">{item.customerName}</h3>
                    <div className="mt-1 flex">
                      {Array(item.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

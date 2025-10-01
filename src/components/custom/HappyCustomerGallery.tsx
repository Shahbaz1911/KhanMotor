
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
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !triggerRef.current) return;

    const pin = gsap.fromTo(
      scrollContainer,
      { translateX: 0 },
      {
        translateX: `-${scrollContainer.scrollWidth - window.innerWidth}px`,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${scrollContainer.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      }
    );

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
      });

    return () => {
      pin.kill();
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="customer-gallery" className="bg-background relative">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div ref={titleRef} className="mb-12 text-center">
          <h2 className="text-4xl tracking-tight lg:text-5xl text-foreground font-black">
            Happy Customers, Happy Cars
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl mt-4">
            Join our community of satisfied clients and their stunning vehicles.
          </p>
        </div>
      </div>

      <div ref={triggerRef} className="relative h-[450px]">
        <div ref={scrollContainerRef} className="absolute top-0 left-0 flex items-center h-full w-max pl-4 md:pl-24">
          <div className="flex gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="group relative block w-[600px] h-[400px] overflow-hidden rounded-lg shadow-lg"
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
      </div>
    </section>
  );
}

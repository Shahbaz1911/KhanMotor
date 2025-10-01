
"use client";

import { Star, Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from '@/lib/placeholder-images.json';
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const testimonials = [
  {
    name: "Sarah L.",
    title: "Luxury Car Enthusiast",
    avatar: placeholderImages.testimonial1.url,
    quote: "Khan Motor provided an unparalleled buying experience. Their attention to detail and customer service is top-notch. I found my dream car!",
    rating: 5,
  },
  {
    name: "John B.",
    title: "First Time Buyer",
    avatar: placeholderImages.testimonial2.url,
    quote: "The team at Khan Motor made my first luxury car purchase seamless and enjoyable. Highly knowledgeable and no pressure.",
    rating: 5,
  },
  {
    name: "Emily K.",
    title: "Collector",
    avatar: placeholderImages.testimonial3.url,
    quote: "As a collector, I appreciate Khan Motor's curated selection of rare and high-performance vehicles. A trusted partner.",
    rating: 5,
  },
  {
    name: "David R.",
    title: "Repeat Customer",
    avatar: "https://picsum.photos/seed/testimonial4/100/100",
    quote: "My third car from Khan Motor, and they continue to exceed my expectations. The best in the business, period.",
    rating: 5,
  },
  {
    name: "Jessica M.",
    title: "Performance Driving Fan",
    avatar: "https://picsum.photos/seed/testimonial5/100/100",
    quote: "They sourced the exact high-performance model I was looking for. The entire process was flawless.",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <Card className="w-[350px] shrink-0 md:w-[450px] flex flex-col shadow-lg bg-background/50 backdrop-blur-md border border-white/20 text-white mx-4">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
          <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-black">{testimonial.name}</CardTitle>
          <CardDescription className="text-gray-300">{testimonial.title}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Quote className="h-8 w-8 text-white/50 mb-2 transform -scale-x-100" />
        <p className="text-gray-300 italic mb-4">{testimonial.quote}</p>
        <div className="flex">
          {Array(testimonial.rating).fill(0).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
          {Array(5 - testimonial.rating).fill(0).map((_, i) => (
            <Star key={i} className="h-5 w-5 text-gray-500" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export function TestimonialMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const repeatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const marqueeEl = marqueeRef.current;
    if (!marqueeEl) return;

    // Use the first child to calculate width for one set of testimonials
    const firstSetWidth = marqueeEl.children[0].clientWidth;

    const animation = gsap.to(marqueeEl, {
      x: () => `-${firstSetWidth}px`,
      ease: "none",
      duration: 30, // Adjust for a comfortable base speed
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % firstSetWidth)
      }
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: marqueeEl,
      start: "top bottom",
      end: "bottom top",
      onUpdate: self => {
        const velocity = self.getVelocity();
        // A multiplier to make the speed change more noticeable.
        // A negative velocity means scrolling up.
        const speedMultiplier = Math.max(1, 1 + Math.abs(velocity) / 500);
        
        gsap.to(animation, {
          timeScale: (velocity > 0 ? 1 : -1) * speedMultiplier,
          duration: 0.1,
          overwrite: true
        });
      },
      onScrubComplete: () => {
         gsap.to(animation, { timeScale: 1, duration: 0.5 }); // Return to normal speed when not scrubbing
      },
    });

    return () => {
      animation.kill();
      scrollTrigger.kill();
    }
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
      <div ref={marqueeRef} className="flex w-max">
        {repeatedTestimonials.map((testimonial, i) => (
          <TestimonialCard key={i} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

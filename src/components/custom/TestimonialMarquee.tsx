
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
    quote: "Arman Autoxperts provided an unparalleled buying experience. Their attention to detail and customer service is top-notch. I found my dream car!",
    rating: 5,
  },
  {
    name: "John B.",
    title: "First Time Buyer",
    avatar: placeholderImages.testimonial2.url,
    quote: "The team at Arman Autoxperts made my first luxury car purchase seamless and enjoyable. Highly knowledgeable and no pressure.",
    rating: 5,
  },
  {
    name: "Emily K.",
    title: "Collector",
    avatar: placeholderImages.testimonial3.url,
    quote: "As a collector, I appreciate Arman Autoxperts' curated selection of rare and high-performance vehicles. A trusted partner.",
    rating: 5,
  },
  {
    name: "David R.",
    title: "Repeat Customer",
    avatar: "https://picsum.photos/seed/testimonial4/100/100",
    quote: "My third car from Arman Autoxperts, and they continue to exceed my expectations. The best in the business, period.",
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

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-1"
  >
    <path
      d="M19.35 10.22C19.35 9.52 19.29 8.85 19.16 8.2H10V11.9H15.35C15.15 13.19 14.53 14.28 13.59 14.96V17.38H16.4C18.23 15.74 19.35 13.19 19.35 10.22Z"
      fill="#4285F4"
    />
    <path
      d="M10 20C12.7 20 15.01 19.08 16.4 17.38L13.59 14.96C12.69 15.58 11.45 16 10 16C7.39 16 5.17 14.32 4.31 11.95H1.38V14.43C2.86 17.61 6.17 20 10 20Z"
      fill="#34A853"
    />
    <path
      d="M4.31 11.95C4.12 11.39 4 10.79 4 10C4 9.21 4.12 8.61 4.31 8.05V5.57H1.38C0.5 7.15 0 8.52 0 10C0 11.48 0.5 12.85 1.38 14.43L4.31 11.95Z"
      fill="#FBBC05"
    />
    <path
      d="M10 4C11.53 4 12.82 4.56 13.79 5.48L16.47 2.8C14.93 1.39 12.7 0.5 10 0.5C6.17 0.5 2.86 2.89 1.38 5.57L4.31 8.05C5.17 5.68 7.39 4 10 4Z"
      fill="#EA4335"
    />
  </svg>
);


const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <Card className="w-[350px] shrink-0 md:w-[450px] flex flex-col shadow-lg dark:bg-background/50 dark:backdrop-blur-md dark:border-white/20 mx-4">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
          <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-black">{testimonial.name}</CardTitle>
          <CardDescription className="dark:text-gray-300">{testimonial.title}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Quote className="h-8 w-8 text-foreground/50 mb-2 transform -scale-x-100" />
        <p className="text-muted-foreground italic mb-4 flex-grow">{testimonial.quote}</p>
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center">
            <GoogleIcon />
            <span className="text-sm font-medium text-muted-foreground">oogle</span>
          </div>
          <div className="flex">
            {Array(testimonial.rating).fill(0).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
            {Array(5 - testimonial.rating).fill(0).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-muted-foreground/50" />
            ))}
          </div>
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


"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Car, Smile, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: Car,
    value: 50000,
    label: "Cars Serviced",
    suffix: "+",
  },
  {
    icon: Smile,
    value: 25000,
    label: "Happy Customers",
    suffix: "+",
  },
  {
    icon: Calendar,
    value: 30,
    label: "Years in Business",
    suffix: "+",
  },
];

const StatCounter = ({
  value,
  suffix,
  duration = 2,
}: {
  value: number;
  suffix: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const counter = { val: 0 };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        val: value,
        duration: duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = Math.round(counter.val).toLocaleString();
        },
      });
    });

    return () => ctx.revert();
  }, [value, duration, counter]);

  return <span ref={ref}>0</span>;
};

export function AchievementsSection() {
    const sectionRef = useRef<HTMLElement>(null);
     useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                opacity: 0,
                scale: 0.95,
                y: 50,
                duration: 0.8,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

  return (
    <section ref={sectionRef} id="achievements" className="py-16 md:py-24 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight lg:text-5xl uppercase">
                A Legacy of Trust and Excellence
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl lowercase">
                our numbers speak for themselves. we are committed to providing unparalleled service and building lasting relationships.
            </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-lg p-8"
            >
              <stat.icon className="mb-4 h-12 w-12 text-primary" />
              <div className="text-5xl font-black text-foreground">
                <StatCounter value={stat.value} duration={2} />
                {stat.suffix}
              </div>
              <p className="mt-2 text-lg font-medium text-muted-foreground lowercase">
                {stat.label.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.to(textRef.current, {
          x: () => -(textRef.current!.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="call-to-action" 
      className="relative py-24 md:py-32 bg-black text-white overflow-hidden"
    >
      <Image 
        src="https://delhi.motorkhan.com/images/about/motor-khan-rithala-rohini-delhi-black-car.jpg"
        alt="Luxury car interior"
        fill
        className="object-cover opacity-20"
        data-ai-hint="black sportscar"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>

      <div className="relative container mx-auto px-4 z-10 text-center">
         <div ref={textRef} className="whitespace-nowrap">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase inline-block">
            Are you ready to experience luxury?
          </h2>
        </div>
        <div className="mt-12 flex justify-center">
            <motion.button
                onClick={() => router.push('/book-appointment')}
                className="group relative bg-transparent border-2 border-destructive text-lg text-white px-8 py-6 rounded-full transition-all duration-300 font-black overflow-hidden"
            >
                <motion.div
                    style={{ width: backgroundWidth }}
                    className="absolute inset-0 bg-destructive z-0"
                />
                <span className="relative z-10 flex items-center">
                    Book a Test Drive
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
            </motion.button>
        </div>
      </div>
    </section>
  );
}

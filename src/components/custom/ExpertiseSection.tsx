
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import placeholderImages from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const expertiseItems = [
    {
        startText: "Expert",
        video: "https://armanautoxperts-in.vercel.app/armanautoxperts/car-washing.mp4",
        endText: "Detailing",
    },
    {
        startText: "Certified",
        video: "https://armanautoxperts-in.vercel.app/armanautoxperts/carintrowash.mp4",
        endText: "Sales",
    },
    {
        startText: "Classic",
        video: "https://armanautoxperts-in.vercel.app/armanautoxperts/car-restoration.mp4",
        endText: "Restoration",
    },
];

const LineItem = ({ startText, video, endText }: typeof expertiseItems[0]) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const startTextRef = useRef<HTMLSpanElement>(null);
    const endTextRef = useRef<HTMLSpanElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });
        
        const textOffset = window.innerWidth > 768 ? 150 : 50;

        tl.from(startTextRef.current, { x: textOffset, opacity: 0, duration: 0.8, ease: "power3.out" }, 0)
          .from(endTextRef.current, { x: -textOffset, opacity: 0, duration: 0.8, ease: "power3.out" }, 0)
          .from(videoRef.current, { scale: 0.5, opacity: 0, ease: "power2.out", duration: 1 }, 0.2);
        
        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === triggerRef.current) {
                    trigger.kill();
                }
            });
        }

    }, []);

    return (
        <div ref={triggerRef} className="flex items-center justify-center flex-nowrap overflow-hidden py-2">
            <span ref={startTextRef} className="text-3xl md:text-6xl lg:text-7xl font-black uppercase text-center whitespace-nowrap">{startText}</span>
             <div ref={videoRef} className="relative inline-block h-12 w-24 md:h-20 md:w-48 lg:h-24 lg:w-56 mx-2 md:mx-4 rounded-xl md:rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <video
                    src={video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
            <span ref={endTextRef} className="text-3xl md:text-6xl lg:text-7xl font-black uppercase text-center whitespace-nowrap">{endText}</span>
        </div>
    );
};


export function ExpertiseSection() {
    const sectionRef = useRef<HTMLElement>(null);
    return (
        <section ref={sectionRef} id="expertise" className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-8">
                    {expertiseItems.map((item, index) => (
                        <LineItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

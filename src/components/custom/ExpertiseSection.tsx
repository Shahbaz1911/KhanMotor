
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
        image: (placeholderImages as any).expertise1,
        endText: "Detailing",
    },
    {
        startText: "Certified",
        image: (placeholderImages as any).expertise2,
        endText: "Sales",
    },
    {
        startText: "Classic Car",
        image: (placeholderImages as any).expertise3,
        endText: "Restoration",
    },
];

const LineItem = ({ startText, image, endText }: typeof expertiseItems[0]) => {
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const el = lineRef.current;

        if (el) {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        }
    }, []);

    return (
        <div ref={lineRef} className="flex items-center justify-center flex-wrap">
            <span className="text-3xl md:text-6xl lg:text-7xl font-black uppercase text-center">{startText}</span>
            <motion.div 
                className="relative inline-block h-12 w-24 md:h-20 md:w-48 lg:h-24 lg:w-56 mx-2 md:mx-4 rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Image
                    src={image.url}
                    alt={image.aiHint}
                    fill
                    className="object-cover"
                    data-ai-hint={image.aiHint}
                />
            </motion.div>
            <span className="text-3xl md:text-6xl lg:text-7xl font-black uppercase text-center">{endText}</span>
        </div>
    );
};


export function ExpertiseSection() {
    return (
        <section id="expertise" className="py-16 md:py-24 bg-background">
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

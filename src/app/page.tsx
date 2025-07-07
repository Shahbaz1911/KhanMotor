
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Quote, CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/ContactForm";
import { HeroSpotlightBanner } from "@/components/custom/HeroSpotlightBanner";
import { FeaturedCarGallery } from "@/components/custom/FeaturedCarGallery";
import { MarqueeBrandScroller } from "@/components/custom/MarqueeBrandScroller";
import { GlassHighlightGrid } from "@/components/custom/GlassHighlightGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function ConsolidatedPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  // GSAP Animation Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const aboutImageRef = useRef<HTMLDivElement>(null);

  const testimonialsSectionRef = useRef<HTMLElement>(null);
  const testimonialsTitleRef = useRef<HTMLHeadingElement>(null);
  const testimonialsGridRef = useRef<HTMLDivElement>(null);

  const ctaSectionRef = useRef<HTMLElement>(null);


  // GSAP Animation useEffect
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const video = videoRef.current;
    if (video) {
        video.pause();
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pageRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        });
        
        const setupVideoAnimation = () => {
            // Ensure we only set this up once
            if (tl.getChildren().length === 0) {
                tl.to(video, {
                    currentTime: video.duration,
                });
            }
        };

        // If metadata is already loaded, run setup. Otherwise, wait for the event.
        if (video.readyState > 0) {
            setupVideoAnimation();
        } else {
            video.onloadedmetadata = setupVideoAnimation;
        }
    }

    const ctx = gsap.context(() => {
      // About Us Animation
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      aboutTl
        .from(aboutContentRef.current?.children, { opacity: 0, x: -50, stagger: 0.2, duration: 0.6 })
        .from(aboutImageRef.current, { opacity: 0, x: 50, duration: 0.8 }, "-=0.5");

      // Testimonials Animation
      const testimonialsTl = gsap.timeline({
        scrollTrigger: {
          trigger: testimonialsSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      testimonialsTl
        .from(testimonialsTitleRef.current, { opacity: 0, y: 50, duration: 0.6 })
        .from(
          testimonialsGridRef.current?.children,
          {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3"
        );

      // CTA Animation
      gsap.from(ctaSectionRef.current, {
          scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
          },
          opacity: 0,
          scale: 0.95,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      name: "Sarah L.",
      title: "Luxury Car Enthusiast",
      avatar: "https://source.unsplash.com/featured/100x100/?woman,portrait",
      quote: "Khan Motor provided an unparalleled buying experience. Their attention to detail and customer service is top-notch. I found my dream car!",
      rating: 5,
    },
    {
      name: "John B.",
      title: "First Time Buyer",
      avatar: "https://source.unsplash.com/featured/100x100/?man,portrait",
      quote: "The team at Khan Motor made my first luxury car purchase seamless and enjoyable. Highly knowledgeable and no pressure.",
      rating: 5,
    },
    {
      name: "Emily K.",
      title: "Collector",
      avatar: "https://source.unsplash.com/featured/100x100/?person,smiling",
      quote: "As a collector, I appreciate Khan Motor's curated selection of rare and high-performance vehicles. A trusted partner.",
      rating: 5,
    },
  ];


  return (
    <div ref={pageRef} className="flex flex-col relative">
       <div className="fixed inset-0 w-full h-screen z-[-1]">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="https://media-alpha-green.vercel.app/video/car.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Section 1: Home */}
      <section id="home" className="w-full">
        <HeroSpotlightBanner />
      </section>

      {/* These sections are part of the "Home" experience but don't have direct nav links */}
      <MarqueeBrandScroller />
      <GlassHighlightGrid />
      
      {/* Section 2: About Us */}
      <section ref={aboutSectionRef} id="about-us" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div ref={aboutContentRef}>
            <h2 className="mb-6 scroll-m-20 text-4xl tracking-tight lg:text-5xl text-white font-black">
              About Khan Motor
            </h2>
            <p className="mb-4 text-lg text-gray-300">
              At Khan Motor, we are driven by a passion for excellence and a commitment to providing an unparalleled automotive experience. Established in 2010, we have curated a collection of the world&apos;s most prestigious vehicles, handpicked for their quality, performance, and timeless appeal.
            </p>
            <p className="mb-6 text-lg text-gray-300">
              Our mission is to connect discerning enthusiasts with extraordinary automobiles. We believe that purchasing a luxury vehicle should be as exceptional as owning one. Our knowledgeable team offers personalized service, expert advice, and a transparent process, ensuring your journey with us is memorable from start to finish.
            </p>
            <Button size="lg" className="group" onClick={() => router.push('/#contact')}>
              Meet Our Team
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div ref={aboutImageRef} className="relative h-80 md:h-[450px] w-full overflow-hidden rounded-lg shadow-xl">
            <Image
              src="https://source.unsplash.com/featured/800x600/?luxury,dealership,interior"
              alt="Khan Motor Dealership Interior"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials */}
      <section ref={testimonialsSectionRef} id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 ref={testimonialsTitleRef} className="mb-12 scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl text-white font-black">
            What Our Clients Say
          </h2>
          <div ref={testimonialsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col shadow-lg bg-background/50 backdrop-blur-md border border-white/20 text-white">
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
            ))}
          </div>
        </div>
      </section>

      <FeaturedCarGallery /> 

      {/* Section 5: Book Drive CTA (This section promotes booking, not the booking page itself) */}
      <section ref={ctaSectionRef} id="book-drive-cta" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden shadow-xl border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 backdrop-blur-md text-white">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <CalendarClock className="h-16 w-16 text-white mb-6" />
                <h2 className="mb-4 scroll-m-20 text-3xl tracking-tight lg:text-4xl text-white font-black">
                  Ready for an Unforgettable Drive?
                </h2>
                <p className="mb-8 text-lg text-gray-300">
                  Experience the thrill and luxury of your dream car. Schedule a personalized test drive today and let our experts guide you through every feature.
                </p>
                <Button size="lg" className="group text-lg px-8 py-6" onClick={() => router.push('/book-appointment')}>
                  Book Your Test Drive
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <div className="relative h-64 md:h-full min-h-[300px] order-first md:order-last">
                <Image
                  src="https://source.unsplash.com/featured/800x600/?car,interior,driving" 
                  alt="Luxury car steering wheel view"
                  layout="fill"
                  objectFit="cover"
                  className="md:rounded-r-lg"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/50 md:via-transparent"></div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Section 6: Contact Us */}
      <section id="contact" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center justify-center">
        <ContactForm />
      </section>

    </div>
  );
}

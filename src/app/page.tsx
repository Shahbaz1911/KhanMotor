
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star, Quote, CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { vehicles as allVehicles, vehicleMakes, vehicleModelsByMake, minPrice as globalMinPrice, maxPrice as globalMaxPrice, minYear as globalMinYear, maxYear as globalMaxYear, sortOptions } from "@/lib/vehiclesData";
import type { Vehicle, VehicleFilters, VehicleSortKey, VehicleSortOrder, VehicleSortOption } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Filter, RotateCcw, Search } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { HeroSpotlightBanner } from "@/components/custom/HeroSpotlightBanner";
import { FeaturedCarGallery } from "@/components/custom/FeaturedCarGallery";
import { MarqueeBrandScroller } from "@/components/custom/MarqueeBrandScroller";
import { GlassHighlightGrid } from "@/components/custom/GlassHighlightGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const initialVehicleFilters: VehicleFilters = {
  make: undefined,
  model: undefined,
  minPrice: globalMinPrice,
  maxPrice: globalMaxPrice,
  minYear: globalMinYear,
  maxYear: globalMaxYear,
};

export default function ConsolidatedPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  // State and logic for Vehicles section
  const [vehicleFilters, setVehicleFilters] = useState<VehicleFilters>(initialVehicleFilters);
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState<string>("");
  const [currentVehicleSort, setCurrentVehicleSort] = useState<VehicleSortOption>(sortOptions[0]);
  const [filteredVehicleModels, setFilteredVehicleModels] = useState<string[]>([]);
  const [debouncedVehicleSearchTerm, setDebouncedVehicleSearchTerm] = useState(vehicleSearchTerm);

  // GSAP Animation Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const aboutImageRef = useRef<HTMLDivElement>(null);

  const vehiclesSectionRef = useRef<HTMLElement>(null);
  const vehiclesTitleRef = useRef<HTMLHeadingElement>(null);
  const vehiclesFilterRef = useRef<HTMLDivElement>(null);

  const testimonialsSectionRef = useRef<HTMLElement>(null);
  const testimonialsTitleRef = useRef<HTMLHeadingElement>(null);
  const testimonialsGridRef = useRef<HTMLDivElement>(null);

  const ctaSectionRef = useRef<HTMLElement>(null);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedVehicleSearchTerm(vehicleSearchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [vehicleSearchTerm]);

  useEffect(() => {
    if (vehicleFilters.make) {
      const models = vehicleModelsByMake[vehicleFilters.make] || [];
      setFilteredVehicleModels(models);
      if (vehicleFilters.model && !models.includes(vehicleFilters.model)) {
        setVehicleFilters(prev => ({ ...prev, model: undefined }));
      }
    } else {
      setFilteredVehicleModels([]);
      setVehicleFilters(prev => ({ ...prev, model: undefined }));
    }
  }, [vehicleFilters.make, vehicleFilters.model]);

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

      // Vehicles Section Animation
      gsap.from(vehiclesTitleRef.current, {
        scrollTrigger: {
          trigger: vehiclesSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
      });

      gsap.from(vehiclesFilterRef.current, {
        scrollTrigger: {
          trigger: vehiclesFilterRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: "power3.out",
      });

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

  const handleVehicleFilterChange = (key: keyof VehicleFilters, value: any) => {
    setVehicleFilters((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleVehiclePriceChange = (value: number[]) => {
    handleVehicleFilterChange("minPrice", value[0]);
    handleVehicleFilterChange("maxPrice", value[1]);
  };

  const handleVehicleYearChange = (value: number[]) => {
    handleVehicleFilterChange("minYear", value[0]);
    handleVehicleFilterChange("maxYear", value[1]);
  };

  const resetVehicleFilters = () => {
    setVehicleFilters(initialVehicleFilters);
    setVehicleSearchTerm("");
    setCurrentVehicleSort(sortOptions[0]);
  };

  const displayedVehicles = useMemo(() => {
    return allVehicles
      .filter((vehicle) => {
        const searchLower = debouncedVehicleSearchTerm.toLowerCase();
        const matchesSearch =
          vehicle.make.toLowerCase().includes(searchLower) ||
          vehicle.model.toLowerCase().includes(searchLower) ||
          vehicle.description.toLowerCase().includes(searchLower) ||
          vehicle.year.toString().includes(searchLower);

        const matchesFilters =
          (!vehicleFilters.make || vehicle.make === vehicleFilters.make) &&
          (!vehicleFilters.model || vehicle.model === vehicleFilters.model) &&
          (vehicleFilters.minPrice === undefined || vehicle.price >= vehicleFilters.minPrice) &&
          (vehicleFilters.maxPrice === undefined || vehicle.price <= vehicleFilters.maxPrice) &&
          (vehicleFilters.minYear === undefined || vehicle.year >= vehicleFilters.minYear) &&
          (vehicleFilters.maxYear === undefined || vehicle.year <= vehicleFilters.maxYear);
        
        return matchesSearch && matchesFilters;
      })
      .sort((a, b) => {
        const valA = a[currentVehicleSort.key];
        const valB = b[currentVehicleSort.key];
        if (currentVehicleSort.order === 'asc') {
          return valA > valB ? 1 : -1;
        }
        return valA < valB ? 1 : -1;
      });
  }, [vehicleFilters, debouncedVehicleSearchTerm, currentVehicleSort]);

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
          data-ai-hint="dynamic car driving"
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
      <FeaturedCarGallery /> 
      <MarqueeBrandScroller />
      <GlassHighlightGrid />
      
      {/* Section 2: About Us */}
      <section ref={aboutSectionRef} id="about-us" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div ref={aboutContentRef}>
            <h2 className="mb-6 scroll-m-20 text-4xl tracking-tight lg:text-5xl text-white font-kajiro md:font-headline">
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

      {/* Section 3: Vehicles */}
      <section ref={vehiclesSectionRef} id="vehicles" className="container mx-auto min-h-screen px-4 py-16 md:py-24">
        <h1 ref={vehiclesTitleRef} className="mb-8 scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl text-white font-kajiro md:font-headline">
          Our Vehicle Collection
        </h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <Card ref={vehiclesFilterRef} className="lg:col-span-1 h-fit sticky top-24 bg-background/50 backdrop-blur-md border border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-kajiro md:font-headline"><Filter size={24}/> Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="vehicle-search">Search</Label>
                <div className="relative mt-1">
                  <Input
                    id="vehicle-search"
                    type="text"
                    placeholder="e.g., Audi R8, SUV, 2023"
                    value={vehicleSearchTerm}
                    onChange={(e) => setVehicleSearchTerm(e.target.value)}
                    className="pl-10 bg-transparent text-white placeholder:text-gray-400"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="vehicle-make">Make</Label>
                <Select value={vehicleFilters.make} onValueChange={(value) => handleVehicleFilterChange("make", value === "all" ? undefined : value)}>
                  <SelectTrigger id="vehicle-make" className="bg-transparent">
                    <SelectValue placeholder="All Makes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Makes</SelectItem>
                    {vehicleMakes.map((make) => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {vehicleFilters.make && filteredVehicleModels.length > 0 && (
                 <div>
                  <Label htmlFor="vehicle-model">Model</Label>
                  <Select value={vehicleFilters.model} onValueChange={(value) => handleVehicleFilterChange("model", value === "all" ? undefined : value)} disabled={!vehicleFilters.make}>
                    <SelectTrigger id="vehicle-model" className="bg-transparent">
                      <SelectValue placeholder="All Models" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Models</SelectItem>
                      {filteredVehicleModels.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label>Price Range: ${vehicleFilters.minPrice?.toLocaleString()} - ${vehicleFilters.maxPrice?.toLocaleString()}</Label>
                <Slider
                  min={globalMinPrice}
                  max={globalMaxPrice}
                  step={1000}
                  value={[vehicleFilters.minPrice ?? globalMinPrice, vehicleFilters.maxPrice ?? globalMaxPrice]}
                  onValueChange={handleVehiclePriceChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Year Range: {vehicleFilters.minYear} - {vehicleFilters.maxYear}</Label>
                <Slider
                  min={globalMinYear}
                  max={globalMaxYear}
                  step={1}
                  value={[vehicleFilters.minYear ?? globalMinYear, vehicleFilters.maxYear ?? globalMaxYear]}
                  onValueChange={handleVehicleYearChange}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="vehicle-sort">Sort By</Label>
                <Select 
                  value={`${currentVehicleSort.key}-${currentVehicleSort.order}`} 
                  onValueChange={(value) => {
                    const [key, order] = value.split('-') as [VehicleSortKey, VehicleSortOrder];
                    const selectedSortOption = sortOptions.find(opt => opt.key === key && opt.order === order);
                    if (selectedSortOption) setCurrentVehicleSort(selectedSortOption);
                  }}
                >
                  <SelectTrigger id="vehicle-sort" className="bg-transparent">
                    <SelectValue placeholder="Sort vehicles" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={`${option.key}-${option.order}`} value={`${option.key}-${option.order}`}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={resetVehicleFilters} variant="outline" className="w-full bg-transparent hover:bg-white/10">
                <RotateCcw size={16} className="mr-2" /> Reset Filters
              </Button>
            </CardContent>
          </Card> 
          
          <div className="lg:col-span-3"> 
            {displayedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {displayedVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-black/30 text-white">
                <div className="mb-4 text-5xl">🚗</div>
                <h3 className="text-2xl font-semibold">No Vehicles Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials */}
      <section ref={testimonialsSectionRef} id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 ref={testimonialsTitleRef} className="mb-12 scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl text-white font-kajiro md:font-headline">
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
                    <CardTitle className="text-xl font-kajiro md:font-headline">{testimonial.name}</CardTitle>
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

      {/* Section 5: Book Drive CTA (This section promotes booking, not the booking page itself) */}
      <section ref={ctaSectionRef} id="book-drive-cta" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden shadow-xl border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 backdrop-blur-md text-white">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <CalendarClock className="h-16 w-16 text-white mb-6" />
                <h2 className="mb-4 scroll-m-20 text-3xl tracking-tight lg:text-4xl text-white font-kajiro md:font-headline">
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

    
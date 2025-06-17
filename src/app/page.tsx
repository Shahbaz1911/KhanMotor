
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star, Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
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

  // State and logic for Vehicles section
  const [vehicleFilters, setVehicleFilters] = useState<VehicleFilters>(initialVehicleFilters);
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState<string>("");
  const [currentVehicleSort, setCurrentVehicleSort] = useState<VehicleSortOption>(sortOptions[0]);
  const [filteredVehicleModels, setFilteredVehicleModels] = useState<string[]>([]);
  const [debouncedVehicleSearchTerm, setDebouncedVehicleSearchTerm] = useState(vehicleSearchTerm);

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
      avatar: "https://placehold.co/100x100.png",
      aiHint: "woman portrait",
      quote: "Khan Motor provided an unparalleled buying experience. Their attention to detail and customer service is top-notch. I found my dream car!",
      rating: 5,
    },
    {
      name: "John B.",
      title: "First Time Buyer",
      avatar: "https://placehold.co/100x100.png",
      aiHint: "man portrait",
      quote: "The team at Khan Motor made my first luxury car purchase seamless and enjoyable. Highly knowledgeable and no pressure.",
      rating: 5,
    },
    {
      name: "Emily K.",
      title: "Collector",
      avatar: "https://placehold.co/100x100.png",
      aiHint: "person smiling",
      quote: "As a collector, I appreciate Khan Motor's curated selection of rare and high-performance vehicles. A trusted partner.",
      rating: 5,
    },
  ];


  return (
    <div className="flex flex-col">
      <section id="home" className="w-full">
        <HeroSpotlightBanner />
      </section>

      <FeaturedCarGallery />
      <MarqueeBrandScroller />
      <GlassHighlightGrid />
      
      <section id="about-us" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-headline text-primary">
              About Khan Motor
            </h2>
            <p className="mb-4 text-lg text-muted-foreground">
              At Khan Motor, we are driven by a passion for excellence and a commitment to providing an unparalleled automotive experience. Established in [Year], we have curated a collection of the world&apos;s most prestigious vehicles, handpicked for their quality, performance, and timeless appeal.
            </p>
            <p className="mb-6 text-lg text-muted-foreground">
              Our mission is to connect discerning enthusiasts with extraordinary automobiles. We believe that purchasing a luxury vehicle should be as exceptional as owning one. Our knowledgeable team offers personalized service, expert advice, and a transparent process, ensuring your journey with us is memorable from start to finish.
            </p>
            <Button size="lg" className="group" onClick={() => router.push('/#contact')}>
              Meet Our Team
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative h-80 md:h-[450px] w-full overflow-hidden rounded-lg shadow-xl">
            <Image
              src="https://placehold.co/800x600.png"
              alt="Khan Motor Dealership Interior"
              layout="fill"
              objectFit="cover"
              data-ai-hint="luxury dealership interior"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl font-headline text-primary">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col shadow-lg">
                <CardHeader className="flex-row items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.aiHint} />
                    <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl font-headline">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.title}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Quote className="h-8 w-8 text-primary/50 mb-2 transform -scale-x-100" />
                  <p className="text-muted-foreground italic mb-4">{testimonial.quote}</p>
                  <div className="flex">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                         <Star key={i} className="h-5 w-5 text-muted-foreground/50" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section id="vehicles" className="container mx-auto min-h-screen px-4 py-16 md:py-24">
        <h1 className="mb-8 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
          Our Vehicle Collection
        </h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* <Card className="lg:col-span-1 h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline"><Filter size={24}/> Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="search-vehicles">Search</Label>
                <div className="relative mt-1">
                  <Input
                    id="search-vehicles"
                    type="text"
                    placeholder="e.g., Audi R8, SUV, 2023"
                    value={vehicleSearchTerm}
                    onChange={(e) => setVehicleSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="make">Make</Label>
                <Select value={vehicleFilters.make} onValueChange={(value) => handleVehicleFilterChange("make", value === "all" ? undefined : value)}>
                  <SelectTrigger id="make">
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
                  <Label htmlFor="model">Model</Label>
                  <Select value={vehicleFilters.model} onValueChange={(value) => handleVehicleFilterChange("model", value === "all" ? undefined : value)} disabled={!vehicleFilters.make}>
                    <SelectTrigger id="model">
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
                <Label htmlFor="sort">Sort By</Label>
                <Select 
                  value={`${currentVehicleSort.key}-${currentVehicleSort.order}`} 
                  onValueChange={(value) => {
                    const [key, order] = value.split('-') as [VehicleSortKey, VehicleSortOrder];
                    const selectedSortOption = sortOptions.find(opt => opt.key === key && opt.order === order);
                    if (selectedSortOption) setCurrentVehicleSort(selectedSortOption);
                  }}
                >
                  <SelectTrigger id="sort">
                    <SelectValue placeholder="Sort vehicles" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={`${option.key}-${option.order}`} value={`${option.key}-${option.order}`}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={resetVehicleFilters} variant="outline" className="w-full">
                <RotateCcw size={16} className="mr-2" /> Reset Filters
              </Button>
            </CardContent>
          </Card> */}
          <div className="lg:col-span-4"> {/* Changed from lg:col-span-3 */}
            {displayedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {displayedVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
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

      <section id="contact" className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex items-center justify-center">
        <ContactForm />
      </section>

    </div>
  );
}

    
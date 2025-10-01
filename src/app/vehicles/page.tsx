
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { vehicles as allVehicles, vehicleMakes, vehicleModelsByMake, minPrice as globalMinPrice, maxPrice as globalMaxPrice, minYear as globalMinYear, maxYear as globalMaxYear, sortOptions } from "@/lib/vehiclesData";
import type { Vehicle, VehicleFilters, VehicleSortKey, VehicleSortOrder, VehicleSortOption } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, RotateCcw, Search } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const initialFilters: VehicleFilters = {
  make: undefined,
  model: undefined,
  minPrice: globalMinPrice,
  maxPrice: globalMaxPrice,
  minYear: globalMinYear,
  maxYear: globalMaxYear,
};

export default function VehiclesPage() {
  const [filters, setFilters] = useState<VehicleFilters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentSort, setCurrentSort] = useState<VehicleSortOption>(sortOptions[0]);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  
  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const vehicleGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.6,
      });

      gsap.from(filterRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      });
      
      // Animate vehicle cards as they appear
      if (vehicleGridRef.current) {
         ScrollTrigger.batch(gsap.utils.toArray(".vehicle-card-animate"), {
            start: "top 90%",
            onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: 'power3.out'}),
         });
      }


    }, pageRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    }
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger when vehicles change
    ScrollTrigger.refresh();
  }, [debouncedSearchTerm, filters, currentSort]);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  useEffect(() => {
    if (filters.make) {
      setFilteredModels(vehicleModelsByMake[filters.make] || []);
      // If the current model is not in the new list of models for the selected make, reset it.
      if (filters.model && !vehicleModelsByMake[filters.make]?.includes(filters.model)) {
        setFilters(prev => ({ ...prev, model: undefined }));
      }
    } else {
      setFilteredModels([]);
      setFilters(prev => ({ ...prev, model: undefined }));
    }
  }, [filters.make, filters.model]);


  const handleFilterChange = (key: keyof VehicleFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  
  const handlePriceChange = (value: number[]) => {
    handleFilterChange("minPrice", value[0]);
    handleFilterChange("maxPrice", value[1]);
  };

  const handleYearChange = (value: number[]) => {
    handleFilterChange("minYear", value[0]);
    handleFilterChange("maxYear", value[1]);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
    setCurrentSort(sortOptions[0]);
  };

  const displayedVehicles = useMemo(() => {
    let SlicedVehicles = allVehicles
      .filter((vehicle) => {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch =
          vehicle.make.toLowerCase().includes(searchLower) ||
          vehicle.model.toLowerCase().includes(searchLower) ||
          vehicle.description.toLowerCase().includes(searchLower) ||
          vehicle.year.toString().includes(searchLower);

        const matchesFilters =
          (!filters.make || vehicle.make === filters.make) &&
          (!filters.model || vehicle.model === filters.model) &&
          (filters.minPrice === undefined || vehicle.price >= filters.minPrice) &&
          (filters.maxPrice === undefined || vehicle.price <= filters.maxPrice) &&
          (filters.minYear === undefined || vehicle.year >= filters.minYear) &&
          (filters.maxYear === undefined || vehicle.year <= filters.maxYear);
        
        return matchesSearch && matchesFilters;
      })
      .sort((a, b) => {
        const valA = a[currentSort.key];
        const valB = b[currentSort.key];
        if (currentSort.order === 'asc') {
          return valA > valB ? 1 : -1;
        }
        return valA < valB ? 1 : -1;
      });
    return SlicedVehicles;
  }, [filters, debouncedSearchTerm, currentSort]);

  return (
    <div ref={pageRef} className="container mx-auto px-4 py-16 md:py-24">
      <h1 ref={titleRef} className="mb-8 scroll-m-20 text-center text-4xl tracking-tight lg:text-5xl text-white font-black">
        Our Vehicle Collection
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <Card ref={filterRef} className="lg:col-span-1 h-fit sticky top-24 bg-background/50 backdrop-blur-md border border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-black"><Filter size={24}/> Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative mt-1">
                <Input
                  id="search"
                  type="text"
                  placeholder="e.g., Audi R8, SUV, 2023"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-transparent text-white placeholder:text-gray-400"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="make">Make</Label>
              <Select value={filters.make} onValueChange={(value) => handleFilterChange("make", value === "all" ? undefined : value)}>
                <SelectTrigger id="make" className="bg-transparent">
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

            {filters.make && filteredModels.length > 0 && (
               <div>
                <Label htmlFor="model">Model</Label>
                <Select value={filters.model} onValueChange={(value) => handleFilterChange("model", value === "all" ? undefined : value)} disabled={!filters.make}>
                  <SelectTrigger id="model" className="bg-transparent">
                    <SelectValue placeholder="All Models" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {filteredModels.map((model) => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label>Price Range: ${filters.minPrice?.toLocaleString()} - ${filters.maxPrice?.toLocaleString()}</Label>
              <Slider
                min={globalMinPrice}
                max={globalMaxPrice}
                step={1000}
                value={[filters.minPrice ?? globalMinPrice, filters.maxPrice ?? globalMaxPrice]}
                onValueChange={handlePriceChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Year Range: {filters.minYear} - {filters.maxYear}</Label>
              <Slider
                min={globalMinYear}
                max={globalMaxYear}
                step={1}
                value={[filters.minYear ?? globalMinYear, filters.maxYear ?? globalMaxYear]}
                onValueChange={handleYearChange}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select 
                value={`${currentSort.key}-${currentSort.order}`} 
                onValueChange={(value) => {
                  const [key, order] = value.split('-') as [VehicleSortKey, VehicleSortOrder];
                  const selectedSortOption = sortOptions.find(opt => opt.key === key && opt.order === order);
                  if (selectedSortOption) setCurrentSort(selectedSortOption);
                }}
              >
                <SelectTrigger id="sort" className="bg-transparent">
                  <SelectValue placeholder="Sort vehicles" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={`${option.key}-${option.order}`} value={`${option.key}-${option.order}`}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={resetFilters} variant="outline" className="w-full bg-transparent hover:bg-white/10">
              <RotateCcw size={16} className="mr-2" /> Reset Filters
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {displayedVehicles.length > 0 ? (
            <div ref={vehicleGridRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2">
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
    </div>
  );
}

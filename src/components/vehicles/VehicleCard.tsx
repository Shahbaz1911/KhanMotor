
"use client";

import Image from "next/image";
import type { Vehicle } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    // The parent component will handle the entry animation
    <Card className="group relative flex h-96 transform flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl vehicle-card-animate opacity-0 translate-y-10 border-white/10">
      <Image
        src={vehicle.imageUrl}
        alt={`${vehicle.make} ${vehicle.model}`}
        fill
        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      <div className="relative mt-auto flex flex-col p-6 text-white">
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-300">{vehicle.year}</p>
          <h3 className="text-2xl font-black leading-tight tracking-tight md:text-3xl">
            {vehicle.make} {vehicle.model}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">
            ${vehicle.price.toLocaleString()}
          </p>
          <Button
            size="lg"
            variant="outline"
            className="translate-y-2 transform rounded-full border-2 border-white bg-transparent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white hover:text-black"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

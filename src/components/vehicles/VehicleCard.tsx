
import Image from "next/image";
import type { Vehicle } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="flex h-full transform flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="relative h-56 w-full">
        <Image
          src={vehicle.imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint={vehicle.aiHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-kajiro md:font-headline text-2xl">{vehicle.make} {vehicle.model}</CardTitle>
        <CardDescription>{vehicle.year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4 text-lg font-semibold text-primary">
          ${vehicle.price.toLocaleString()}
        </p>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{vehicle.description}</p>
        <div className="flex flex-wrap gap-2">
          {vehicle.features.slice(0, 3).map((feature) => (
            <Badge key={feature} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          View Details
        </button>
      </CardFooter>
    </Card>
  );
}

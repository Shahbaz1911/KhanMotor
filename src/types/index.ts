
import { z } from "zod";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  description: string;
  features: string[];
  aiHint: string;
}

export type VehicleFilters = {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
};

export type VehicleSortKey = 'price' | 'year';
export type VehicleSortOrder = 'asc' | 'desc';

export type VehicleSortOption = {
  key: VehicleSortKey;
  order: VehicleSortOrder;
  label: string;
};

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

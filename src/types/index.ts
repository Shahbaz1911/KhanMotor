
import { z } from "zod";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  variant: string;
  color: string;
  price: number;
  priceType: 'negotiable' | 'fixed';
  mileage: number;
  fuelType: 'petrol' | 'diesel' | 'cng' | 'electric';
  transmission: 'manual' | 'automatic';
  ownership: 'first' | 'second' | 'third' | 'fourth';
  status: 'available' | 'sold';
  imageUrls: string[];
  description: string;
  features: string[];
  aiHint: string;
  createdAt?: any;
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
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  message: z.string().min(1, { message: "Message cannot be empty." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Appointment Form Schema
export const appointmentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  preferredDate: z.date({
    required_error: "A preferred date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  preferredTime: z.string({ required_error: "A preferred time is required."}).regex(timeRegex, "Please enter a valid time in HH:MM format."),
  vehicleOfInterest: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

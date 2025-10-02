
import type { Vehicle } from '@/types';
import placeholderImages from './placeholder-images.json';

// This file is now a fallback and template. Data is fetched from Firestore.
export const vehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Audi',
    model: 'R8 Spyder',
    year: 2023,
    price: 180000,
    imageUrl: placeholderImages.vehicle1.url,
    aiHint: placeholderImages.vehicle1.aiHint,
    description: 'Experience the thrill of open-top driving with the Audi R8 Spyder. Powerful V10 engine and stunning design.',
    features: ['V10 Engine', 'Convertible', 'Bang & Olufsen Sound', 'Virtual Cockpit'],
  },
];

export const vehicleMakes = Array.from(new Set(vehicles.map(v => v.make))).sort();
export const vehicleModelsByMake: Record<string, string[]> = vehicles.reduce((acc, v) => {
  if (!acc[v.make]) {
    acc[v.make] = [];
  }
  if (!acc[v.make].includes(v.model)) {
    acc[v.make].push(v.model);
  }
  return acc;
}, {} as Record<string, string[]>);

Object.keys(vehicleModelsByMake).forEach(make => vehicleModelsByMake[make].sort());

export const minPrice = Math.min(...vehicles.map(v => v.price));
export const maxPrice = Math.max(...vehicles.map(v => v.price));
export const minYear = Math.min(...vehicles.map(v => v.year));
export const maxYear = Math.max(...vehicles.map(v => v.year));

export const sortOptions: import('@/types').VehicleSortOption[] = [
  { key: 'price', order: 'asc', label: 'Price: Low to High' },
  { key: 'price', order: 'desc', label: 'Price: High to Low' },
  { key: 'year', order: 'asc', label: 'Year: Oldest to Newest' },
  { key: 'year', order: 'desc', label: 'Year: Newest to Oldest' },
];

    
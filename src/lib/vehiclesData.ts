
import type { Vehicle } from '@/types';

export const vehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Audi',
    model: 'R8 Spyder',
    year: 2023,
    price: 180000,
    imageUrl: 'https://images.unsplash.com/photo-1616422286253-908508948698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxibHVlJTIwYXVkaSUyMHI4JTIwc3B5ZGVyfGVufDB8fHx8MTcxNzgzNDg5Mnww&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'blue sportscar',
    description: 'Experience the thrill of open-top driving with the Audi R8 Spyder. Powerful V10 engine and stunning design.',
    features: ['V10 Engine', 'Convertible', 'Bang & Olufsen Sound', 'Virtual Cockpit'],
  },
  {
    id: '2',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2024,
    price: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1620965408800-1190117f6c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGJtdyUyMG00fGVufDB8fHx8MTcxNzgzNTAxMHww&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'green coupe',
    description: 'The BMW M4 Competition offers breathtaking performance and aggressive styling. A true driver\'s car.',
    features: ['Twin-Turbo I6', 'M Sport Seats', 'Adaptive Suspension', 'Carbon Fiber Roof'],
  },
  {
    id: '3',
    make: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2023,
    price: 200000,
    imageUrl: 'https://images.unsplash.com/photo-1593509309501-081390d36f82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtZXJjZWRlcyUyMGc2MyUyMGFtZ3xlbnwwfHx8fDE3MTc4MzUxMDd8MA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'black suv',
    description: 'Iconic design meets formidable power. The G 63 AMG is the ultimate luxury off-roader.',
    features: ['Bi-Turbo V8', 'Luxury Interior', 'Off-Road Capability', 'Burmester Audio'],
  },
  {
    id: '4',
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2024,
    price: 145000,
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBwb3JzY2hlJTIwOTExfGVufDB8fHx8MTcxNzgzNTIyN3ww&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'yellow sportscar',
    description: 'The timeless Porsche 911 Carrera S, delivering an exhilarating driving experience with classic style.',
    features: ['Turbocharged Flat-Six', 'PASM', 'Sport Chrono Package', 'Leather Interior'],
  },
  {
    id: '5',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    price: 130000,
    imageUrl: 'https://images.unsplash.com/photo-1617704548623-34037c156388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZWQlMjB0ZXNsYSUyMG1vZGVsJTIwc3xlbnwwfHx8fDE3MTc4MzUzMTJ8MA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'red sedan',
    description: 'Blistering acceleration and cutting-edge technology. The Model S Plaid redefines electric performance.',
    features: ['Tri-Motor AWD', 'Autopilot', '17-inch Touchscreen', 'Panoramic Roof'],
  },
  {
    id: '6',
    make: 'Audi',
    model: 'Q7',
    year: 2022,
    price: 70000,
    imageUrl: 'https://images.unsplash.com/photo-1604134774124-781a7a1f80e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBhdWRpJTIwcTd8ZW58MHx8fHwxNzE3ODM1Mzk0fDA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'silver suv',
    description: 'A spacious and luxurious SUV, perfect for families. Advanced technology and comfortable ride.',
    features: ['Quattro AWD', 'Three-Row Seating', 'MMI Touch Response', 'Adaptive Air Suspension'],
  },
   {
    id: '7',
    make: 'BMW',
    model: 'X5',
    year: 2023,
    price: 75000,
    imageUrl: 'https://images.unsplash.com/photo-1556440296-13e150bd3a44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxibHVlJTIwYm13JTIweDV8ZW58MHx8fHwxNzE3ODM1NDg4fDA&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'blue suv',
    description: 'The BMW X5 combines luxury, performance, and versatility in a stylish package.',
    features: ['xDrive AWD', 'Panoramic Moonroof', 'Harman Kardon Audio', 'Driving Assistant Pro'],
  },
  {
    id: '8',
    make: 'Mercedes-Benz',
    model: 'C 300 Sedan',
    year: 2024,
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1628526184140-94b536e60e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1lcmNlZGVzJTIwYzMwMCUyMHNlZGFufGVufDB8fHx8MTcxNzgzNTU5Mnww&ixlib=rb-4.0.3&q=80&w=1080',
    aiHint: 'white sedan',
    description: 'Elegant design and refined performance make the C 300 a standout luxury sedan.',
    features: ['Turbo I4 Engine', 'MBUX Infotainment', 'Premium Interior', 'Driver Assistance'],
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

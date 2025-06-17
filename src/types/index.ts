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

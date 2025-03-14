export type PropertyType = 'apartment' | 'house' | 'duplex' | 'bungalow' | 'self-contained';

export type PropertyStatus = 'available' | 'rented' | 'draft' | 'pending-verification';

export interface LandlordContact {
  name: string;
  phone: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    parkingSpaces?: number;
    furnished: boolean;
    size?: number; // in square meters
  };
  amenities: string[];
  images: string[];
  type: PropertyType;
  status: PropertyStatus;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  pointsToUnlock: number;
  landlordId?: string;
  submittedBy?: string;
  landlordContact?: LandlordContact;
}

export interface PropertyFilter {
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    city?: string;
    state?: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: PropertyType[];
  verified?: boolean;
  furnished?: boolean;
}
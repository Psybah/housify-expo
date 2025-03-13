export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  fPoints: number; // Free points
  pPoints: number; // Paid points
  createdAt: string;
  listings: string[]; // IDs of listings created by user
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  verified: boolean;
  landlordContact: {
    name: string;
    phone: string;
    email: string;
  };
  createdBy: string; // User ID
  createdAt: string;
  allowVerification: boolean;
  status: 'pending' | 'approved' | 'rejected';
  pointsToUnlock: number;
  requiresPaidPoints: boolean;
};

export type PointsTransaction = {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent' | 'purchased';
  description: string;
  createdAt: string;
  pointsType: 'free' | 'paid';
  relatedListingId?: string;
};

export type PointsPackage = {
  id: string;
  name: string;
  amount: number;
  price: number;
  bonus: number;
};
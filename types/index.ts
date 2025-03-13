export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  housePoints: number; // House Points (HP)
  createdAt: string;
  listings: string[];
  profileImage?: string; // Optional profile image URL
  referralCode?: string; // Referral code
  referrals?: string[]; // IDs of users referred
}

export interface Listing {
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
  createdBy: string;
  createdAt: string;
  allowVerification: boolean;
  status: 'pending' | 'approved' | 'rejected';
  pointsToUnlock: number;
}

export interface PointsPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  bonus?: number;
  popular?: boolean;
  description?: string;
  listings?: number; // Number of listings that can be unlocked
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'purchased' | 'spent' | 'bonus' | 'referral';
  description: string;
  createdAt: string;
  pointsType?: string; // For backward compatibility
}

export interface ReferralInfo {
  code: string;
  pointsPerReferral: number;
  totalReferred: number;
  pointsEarned: number;
}
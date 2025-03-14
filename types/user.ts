export type UserRole = 'house-seeker' | 'landlord' | 'admin' | 'verification-agent';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  points: number; // Housify Points (HP) as a simple number
  verifiedStatus: boolean;
  profileCompleted: boolean; // Track if user has completed their profile
  createdAt: string;
  savedProperties: string[]; // Array of property IDs
  listedProperties: string[]; // Array of property IDs
  unlockedProperties: string[]; // Array of property IDs
}
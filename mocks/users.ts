import { User } from '@/types/user';

export const users: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+2348012345678',
    role: 'house-seeker',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    points: 20, // Simple number for points
    verifiedStatus: true,
    profileCompleted: true,
    createdAt: '2023-09-15T10:30:00Z',
    savedProperties: ['1', '3'],
    listedProperties: ['4'],
    unlockedProperties: ['2']
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+2348023456789',
    role: 'house-seeker',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    points: 150, // Simple number for points
    verifiedStatus: true,
    profileCompleted: true,
    createdAt: '2023-09-20T14:45:00Z',
    savedProperties: ['2', '6'],
    listedProperties: ['5'],
    unlockedProperties: ['1', '3']
  },
  {
    id: 'landlord1',
    name: 'Chief Obi',
    email: 'obi@example.com',
    phone: '+2348034567890',
    role: 'landlord',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    points: 500, // Simple number for points
    verifiedStatus: true,
    profileCompleted: true,
    createdAt: '2023-08-10T09:15:00Z',
    savedProperties: [],
    listedProperties: ['1'],
    unlockedProperties: []
  },
  {
    id: 'landlord2',
    name: 'Mrs. Adebayo',
    email: 'adebayo@example.com',
    phone: '+2348045678901',
    role: 'landlord',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    points: 300, // Simple number for points
    verifiedStatus: true,
    profileCompleted: true,
    createdAt: '2023-08-15T11:30:00Z',
    savedProperties: [],
    listedProperties: ['2'],
    unlockedProperties: []
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@housify.com',
    phone: '+2348056789012',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
    points: 0, // Simple number for points
    verifiedStatus: true,
    profileCompleted: true,
    createdAt: '2023-07-01T08:00:00Z',
    savedProperties: [],
    listedProperties: [],
    unlockedProperties: []
  }
];
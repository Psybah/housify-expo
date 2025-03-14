import { Property } from '@/types/property';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern 3 Bedroom Apartment in Lekki',
    description: 'Beautiful and spacious 3 bedroom apartment with excellent finishing, 24/7 power supply, and security. Perfect for a small family or professionals.',
    price: 2500000, // Annual rent in Naira
    location: {
      address: '15 Admiralty Way',
      city: 'Lekki',
      state: 'Lagos',
      coordinates: {
        latitude: 6.4281,
        longitude: 3.4219
      }
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      parkingSpaces: 1,
      furnished: true,
      size: 120
    },
    amenities: ['Swimming Pool', '24/7 Electricity', 'Security', 'CCTV', 'Gym'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'
    ],
    type: 'apartment',
    status: 'available',
    verified: true,
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-15T10:30:00Z',
    pointsToUnlock: 50,
    landlordId: 'landlord1'
  },
  {
    id: '2',
    title: 'Cozy 2 Bedroom Flat in Yaba',
    description: 'Well-maintained 2 bedroom flat in a serene environment. Close to major roads and amenities.',
    price: 1200000,
    location: {
      address: '7 Herbert Macaulay Way',
      city: 'Yaba',
      state: 'Lagos',
      coordinates: {
        latitude: 6.5143,
        longitude: 3.3842
      }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      furnished: false,
      size: 85
    },
    amenities: ['Water Supply', 'Security', 'Prepaid Meter'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28',
      'https://images.unsplash.com/photo-1560185008-a33f5c7b1844'
    ],
    type: 'apartment',
    status: 'available',
    verified: true,
    createdAt: '2023-10-10T14:20:00Z',
    updatedAt: '2023-10-10T14:20:00Z',
    pointsToUnlock: 30,
    landlordId: 'landlord2'
  },
  {
    id: '3',
    title: 'Luxury 4 Bedroom Duplex in Ikoyi',
    description: 'Exquisite 4 bedroom duplex with state-of-the-art facilities in a premium location. Perfect for executives and diplomats.',
    price: 8000000,
    location: {
      address: '10 Bourdillon Road',
      city: 'Ikoyi',
      state: 'Lagos',
      coordinates: {
        latitude: 6.4478,
        longitude: 3.4322
      }
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      parkingSpaces: 2,
      furnished: true,
      size: 300
    },
    amenities: ['Swimming Pool', 'Smart Home', '24/7 Electricity', 'Security', 'CCTV', 'Gym', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
    ],
    type: 'duplex',
    status: 'available',
    verified: true,
    createdAt: '2023-10-05T09:15:00Z',
    updatedAt: '2023-10-05T09:15:00Z',
    pointsToUnlock: 100,
    landlordId: 'landlord3'
  },
  {
    id: '4',
    title: 'Affordable Self-Contained in Surulere',
    description: 'Clean and affordable self-contained apartment in a quiet neighborhood. Ideal for students and young professionals.',
    price: 450000,
    location: {
      address: '23 Adelabu Street',
      city: 'Surulere',
      state: 'Lagos',
      coordinates: {
        latitude: 6.5059,
        longitude: 3.3509
      }
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 0,
      furnished: false,
      size: 30
    },
    amenities: ['Water Supply', 'Prepaid Meter'],
    images: [
      'https://images.unsplash.com/photo-1560448075-bb485b067938',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1560448075-d03b1cc5ea53'
    ],
    type: 'self-contained',
    status: 'draft',
    verified: false,
    createdAt: '2023-10-12T16:45:00Z',
    updatedAt: '2023-10-12T16:45:00Z',
    pointsToUnlock: 15,
    submittedBy: 'user1'
  },
  {
    id: '5',
    title: 'Spacious 3 Bedroom Bungalow in Ajah',
    description: 'Newly built 3 bedroom bungalow with excellent finishing in a gated estate. Comes with a boys quarter.',
    price: 1800000,
    location: {
      address: 'Peace Estate, Lakowe',
      city: 'Ajah',
      state: 'Lagos',
      coordinates: {
        latitude: 6.4935,
        longitude: 3.5417
      }
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      parkingSpaces: 2,
      furnished: false,
      size: 150
    },
    amenities: ['Estate Security', 'Water Supply', 'Boys Quarter'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
    ],
    type: 'bungalow',
    status: 'pending-verification',
    verified: false,
    createdAt: '2023-10-08T11:30:00Z',
    updatedAt: '2023-10-08T11:30:00Z',
    pointsToUnlock: 20,
    submittedBy: 'user2'
  },
  {
    id: '6',
    title: 'Elegant 2 Bedroom Apartment in Victoria Island',
    description: 'Tastefully furnished 2 bedroom apartment with excellent facilities in the heart of Victoria Island.',
    price: 4500000,
    location: {
      address: '15 Adeola Odeku Street',
      city: 'Victoria Island',
      state: 'Lagos',
      coordinates: {
        latitude: 6.4281,
        longitude: 3.4219
      }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      furnished: true,
      size: 100
    },
    amenities: ['Swimming Pool', '24/7 Electricity', 'Security', 'CCTV', 'Gym', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab'
    ],
    type: 'apartment',
    status: 'available',
    verified: true,
    createdAt: '2023-10-01T13:20:00Z',
    updatedAt: '2023-10-01T13:20:00Z',
    pointsToUnlock: 80,
    landlordId: 'landlord4'
  }
];
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing } from '@/types';
import { useAuthStore } from './auth-store';

interface ListingsState {
  listings: Listing[];
  userListings: Listing[];
  savedListings: string[]; // IDs of saved listings
  unlockedListings: string[]; // IDs of listings where contact is unlocked
  isLoading: boolean;
  fetchListings: () => Promise<void>;
  fetchUserListings: () => Promise<void>;
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'status'>) => Promise<Listing>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  unlockListing: (id: string) => Promise<boolean>;
  saveListing: (id: string) => void;
  unsaveListing: (id: string) => void;
  isListingSaved: (id: string) => boolean;
  getSavedListings: () => Listing[];
  getListingById: (id: string) => Listing | undefined;
  filterListings: (filters: Partial<{
    location: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    verified: boolean;
  }>) => Listing[];
}

export const useListingsStore = create<ListingsState>()(
  persist(
    (set, get) => ({
      listings: [],
      userListings: [],
      savedListings: [],
      unlockedListings: [],
      isLoading: false,
      
      fetchListings: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock listings data with Nigerian context
          const mockListings: Listing[] = [
            {
              id: '1',
              title: 'Modern 3 Bedroom Flat in Lekki Phase 1',
              description: 'Beautiful modern apartment in a serene environment with 24/7 electricity and water supply. Close to Shoprite and other amenities. Gated estate with excellent security and CCTV cameras. Suitable for young professionals and families.',
              price: 1800000, // ₦1.8M per year
              location: 'Lekki Phase 1',
              address: '15 Admiralty Way, Lekki Phase 1, Lagos',
              images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
              ],
              bedrooms: 3,
              bathrooms: 3,
              amenities: ['24/7 Electricity', 'Swimming Pool', 'Estate Security', 'Treated Water', 'Parking Space', 'Inverter System'],
              verified: true,
              landlordContact: {
                name: 'Oluwaseun Adeyemi',
                phone: '+2348012345678',
                email: 'oluwaseun@example.com',
              },
              createdBy: '2',
              createdAt: new Date().toISOString(),
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '2',
              title: 'Affordable Self-Contained in Yaba',
              description: 'Perfect studio apartment for students or young professionals. Walking distance to UNILAG and Yaba Tech. Public transportation easily accessible. Prepaid meter installed. Newly renovated with POP ceiling and tiled floors.',
              price: 600000, // ₦600K per year
              location: 'Yaba',
              address: '7 Herbert Macaulay Way, Yaba, Lagos',
              images: [
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
                'https://images.unsplash.com/photo-1502005097973-6a7082348e28',
              ],
              bedrooms: 1,
              bathrooms: 1,
              amenities: ['Prepaid Meter', 'Borehole Water', 'POP Ceiling', 'Tiled Floor', 'Burglary Proof'],
              verified: false,
              landlordContact: {
                name: 'Chinedu Okonkwo',
                phone: '+2349087654321',
                email: 'chinedu@example.com',
              },
              createdBy: '3',
              createdAt: new Date().toISOString(),
              allowVerification: false,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '3',
              title: '4 Bedroom Duplex in Maitama',
              description: 'Spacious duplex in a prime location with excellent finishes. Features a large compound, boys quarters, and modern facilities. Perfect for families. Fully serviced with 24/7 security and CCTV surveillance.',
              price: 1950000, // ₦1.95M per year
              location: 'Maitama',
              address: '25 Panama Street, Maitama, Abuja',
              images: [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
              ],
              bedrooms: 5,
              bathrooms: 5,
              amenities: ['Inverter System', 'Swimming Pool', 'Boys Quarters', 'CCTV', 'Fitted Kitchen', 'Air Conditioning', 'Generator'],
              verified: true,
              landlordContact: {
                name: 'Ibrahim Musa',
                phone: '+2348055667788',
                email: 'ibrahim@example.com',
              },
              createdBy: '4',
              createdAt: new Date().toISOString(),
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '4',
              title: '3 Bedroom Bungalow in GRA Enugu',
              description: 'Spacious bungalow in a quiet neighborhood with good road network. Features a large compound with fruit trees and space for gardening. Constant EEDC power supply and borehole water system. Suitable for families.',
              price: 1500000, // ₦1.5M per year
              location: 'GRA Enugu',
              address: '7 Abakaliki Road, GRA, Enugu',
              images: [
                'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
              ],
              bedrooms: 3,
              bathrooms: 2,
              amenities: ['Spacious Compound', 'Generator House', 'Security', 'Borehole', 'Fruit Trees', 'Prepaid Meter'],
              verified: true,
              landlordContact: {
                name: 'Ngozi Okafor',
                phone: '+2348033445566',
                email: 'ngozi@example.com',
              },
              createdBy: '2',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '5',
              title: 'Mini Flat in Surulere',
              description: 'Cozy mini flat in a central location. Close to National Stadium and Adeniran Ogunsanya Shopping Mall. Good for small families or individuals. All rooms en-suite with modern fittings. Newly renovated with quality finishes.',
              price: 950000, // ₦950K per year
              location: 'Surulere',
              address: '12 Adeniran Ogunsanya Street, Surulere, Lagos',
              images: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858',
              ],
              bedrooms: 1,
              bathrooms: 1,
              amenities: ['Prepaid Meter', 'POP Ceiling', 'Tiled Floor', 'Burglary Proof', 'Water Heater', 'Kitchen Cabinet'],
              verified: false,
              landlordContact: {
                name: 'Funke Akindele',
                phone: '+2347066778899',
                email: 'funke@example.com',
              },
              createdBy: '3',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '6',
              title: 'Serviced Apartment in Victoria Island',
              description: 'Fully serviced apartment with modern amenities. Ideal for expatriates and business travelers. Walking distance to major corporate offices and Eko Hotel. Includes housekeeping, laundry services, and 24/7 power supply.',
              price: 1900000, // ₦1.9M per year
              location: 'Victoria Island',
              address: '10 Adetokunbo Ademola Street, Victoria Island, Lagos',
              images: [
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
                'https://images.unsplash.com/photo-1551361415-69c87624334f',
              ],
              bedrooms: 2,
              bathrooms: 2,
              amenities: ['24/7 Electricity', 'Swimming Pool', 'Gym', 'Security', 'Cleaning Service', 'Internet', 'Satellite TV'],
              verified: true,
              landlordContact: {
                name: 'Tunde Williams',
                phone: '+2348099887766',
                email: 'tunde@example.com',
              },
              createdBy: '4',
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '7',
              title: '4 Bedroom Terrace in Ikeja GRA',
              description: 'Beautiful terrace house in a serene environment. Excellent security with 24-hour power supply. Close to Ikeja City Mall and Airport Hotel. Suitable for corporate tenants. Service charge inclusive.',
              price: 1850000, // ₦1.85M per year
              location: 'Ikeja GRA',
              address: '15 Sobo Arobiodu Street, GRA, Ikeja',
              images: [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
              ],
              bedrooms: 4,
              bathrooms: 4,
              amenities: ['24/7 Electricity', 'Central Generator', 'CCTV', 'Fitted Kitchen', 'Air Conditioning', 'Parking Space', 'Security'],
              verified: true,
              landlordContact: {
                name: 'Bola Adeyemi',
                phone: '+2348022334455',
                email: 'bola@example.com',
              },
              createdBy: '2',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '8',
              title: '2 Bedroom Flat in Magodo',
              description: 'Lovely 2 bedroom flat in a gated estate. All rooms en-suite with modern fittings. Spacious living room and kitchen. 24-hour security and constant water supply. Close to Berger and accessible to Lagos-Ibadan expressway.',
              price: 1500000, // ₦1.5M per year
              location: 'Magodo',
              address: '10 Emmanuel Keshi Street, Magodo GRA Phase 2',
              images: [
                'https://images.unsplash.com/photo-1554995207-c18c203602cb',
                'https://images.unsplash.com/photo-1556912167-f556f1f39fdf',
              ],
              bedrooms: 2,
              bathrooms: 2,
              amenities: ['Estate Security', 'Borehole Water', 'Prepaid Meter', 'POP Ceiling', 'Parking Space', 'Tiled Floor'],
              verified: false,
              landlordContact: {
                name: 'Emeka Okafor',
                phone: '+2348066778899',
                email: 'emeka@example.com',
              },
              createdBy: '3',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '9',
              title: '3 Bedroom Apartment in Ikoyi',
              description: 'Exquisite apartment with modern finishes. Located in the prestigious Ikoyi area. Features include home theater, gym, and smart home technology. Perfect for high-net-worth individuals and diplomats.',
              price: 1950000, // ₦1.95M per year
              location: 'Ikoyi',
              address: '5 Bourdillon Road, Ikoyi, Lagos',
              images: [
                'https://images.unsplash.com/photo-1613977257363-707ba9348227',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
              ],
              bedrooms: 3,
              bathrooms: 3,
              amenities: ['Swimming Pool', 'Home Theater', 'Gym', 'Smart Home', 'Private Generator', 'CCTV', 'Waterfront View'],
              verified: true,
              landlordContact: {
                name: 'Aliko Mohammed',
                phone: '+2348011223344',
                email: 'aliko@example.com',
              },
              createdBy: '4',
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 100,
            },
            {
              id: '10',
              title: 'Room & Parlour in Ojodu',
              description: 'Affordable room and parlour self-contained with modern facilities. Located in a quiet residential area. Close to Berger bus stop and Ojodu Grammar School. Suitable for young professionals and small families.',
              price: 450000, // ₦450K per year
              location: 'Ojodu',
              address: '7 Aina Street, Ojodu Berger',
              images: [
                'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
                'https://images.unsplash.com/photo-1595526051245-4506e0005bd0',
              ],
              bedrooms: 1,
              bathrooms: 1,
              amenities: ['Prepaid Meter', 'Borehole Water', 'Burglary Proof', 'Tiled Floor', 'POP Ceiling'],
              verified: false,
              landlordContact: {
                name: 'Yetunde Balogun',
                phone: '+2347044556677',
                email: 'yetunde@example.com',
              },
              createdBy: '2',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
              allowVerification: false,
              status: 'approved',
              pointsToUnlock: 100,
            },
          ];
          
          set({ listings: mockListings, isLoading: false });
        } catch (error) {
          console.error('Fetch listings error:', error);
          set({ isLoading: false });
        }
      },
      
      fetchUserListings: async () => {
        set({ isLoading: true });
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Filter listings created by the current user
          const allListings = get().listings;
          const userListings = allListings.filter(listing => listing.createdBy === user.id);
          
          set({ userListings, isLoading: false });
        } catch (error) {
          console.error('Fetch user listings error:', error);
          set({ isLoading: false });
        }
      },
      
      addListing: async (listingData) => {
        set({ isLoading: true });
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newListing: Listing = {
            ...listingData,
            id: Date.now().toString(),
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            status: 'pending', // New listings start as pending
          };
          
          set((state) => ({
            listings: [...state.listings, newListing],
            userListings: [...state.userListings, newListing],
            isLoading: false,
          }));
          
          // Update user's listings array
          useAuthStore.getState().updateUser({
            listings: [...user.listings, newListing.id],
          });
          
          return newListing;
        } catch (error) {
          console.error('Add listing error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      updateListing: async (id, data) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            listings: state.listings.map(listing => 
              listing.id === id ? { ...listing, ...data } : listing
            ),
            userListings: state.userListings.map(listing => 
              listing.id === id ? { ...listing, ...data } : listing
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Update listing error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      deleteListing: async (id) => {
        set({ isLoading: true });
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            listings: state.listings.filter(listing => listing.id !== id),
            userListings: state.userListings.filter(listing => listing.id !== id),
            isLoading: false,
          }));
          
          // Update user's listings array
          useAuthStore.getState().updateUser({
            listings: user.listings.filter(listingId => listingId !== id),
          });
        } catch (error) {
          console.error('Delete listing error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      unlockListing: async (id) => {
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          const listing = get().listings.find(l => l.id === id);
          if (!listing) throw new Error('Listing not found');
          
          // Check if already unlocked
          if (get().unlockedListings.includes(id)) {
            return true;
          }
          
          // Check if user has enough points
          if (user.housePoints < listing.pointsToUnlock) {
            return false;
          }
          
          // Deduct points
          useAuthStore.getState().updateUser({
            housePoints: user.housePoints - listing.pointsToUnlock,
          });
          
          // Add to unlocked listings
          set((state) => ({
            unlockedListings: [...state.unlockedListings, id],
          }));
          
          return true;
        } catch (error) {
          console.error('Unlock listing error:', error);
          return false;
        }
      },
      
      saveListing: (id) => {
        set((state) => {
          // Check if already saved
          if (state.savedListings.includes(id)) {
            return state;
          }
          
          return {
            savedListings: [...state.savedListings, id]
          };
        });
      },
      
      unsaveListing: (id) => {
        set((state) => ({
          savedListings: state.savedListings.filter(listingId => listingId !== id)
        }));
      },
      
      isListingSaved: (id) => {
        return get().savedListings.includes(id);
      },
      
      getSavedListings: () => {
        const { listings, savedListings } = get();
        return listings.filter(listing => savedListings.includes(listing.id));
      },
      
      getListingById: (id) => {
        return get().listings.find(listing => listing.id === id);
      },
      
      filterListings: (filters) => {
        const { listings } = get();
        
        return listings.filter(listing => {
          // Filter by location
          if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
          }
          
          // Filter by price range
          if (filters.minPrice && listing.price < filters.minPrice) {
            return false;
          }
          if (filters.maxPrice && listing.price > filters.maxPrice) {
            return false;
          }
          
          // Filter by bedrooms
          if (filters.bedrooms && listing.bedrooms < filters.bedrooms) {
            return false;
          }
          
          // Filter by verification status
          if (filters.verified !== undefined && listing.verified !== filters.verified) {
            return false;
          }
          
          return true;
        });
      },
    }),
    {
      name: 'housify-listings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
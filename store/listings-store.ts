import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing } from '@/types';
import { useAuthStore } from './auth-store';

interface ListingsState {
  listings: Listing[];
  userListings: Listing[];
  unlockedListings: string[]; // IDs of listings where contact is unlocked
  isLoading: boolean;
  fetchListings: () => Promise<void>;
  fetchUserListings: () => Promise<void>;
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'status'>) => Promise<Listing>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  unlockListing: (id: string) => Promise<boolean>;
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
      unlockedListings: [],
      isLoading: false,
      
      fetchListings: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock listings data
          const mockListings: Listing[] = [
            {
              id: '1',
              title: 'Modern Apartment in Downtown',
              description: 'Beautiful modern apartment with great views of the city skyline. Recently renovated with high-end finishes.',
              price: 250000,
              location: 'Downtown',
              address: '123 Main St, Downtown',
              images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
              ],
              bedrooms: 2,
              bathrooms: 2,
              amenities: ['Parking', 'Pool', 'Gym', 'Security'],
              verified: true,
              landlordContact: {
                name: 'Jane Smith',
                phone: '+1234567890',
                email: 'jane@example.com',
              },
              createdBy: '2',
              createdAt: new Date().toISOString(),
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 200,
              requiresPaidPoints: true,
            },
            {
              id: '2',
              title: 'Cozy Studio in Westside',
              description: 'Perfect studio for students or young professionals. Close to universities and public transportation.',
              price: 150000,
              location: 'Westside',
              address: '456 West Ave, Westside',
              images: [
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
                'https://images.unsplash.com/photo-1502005097973-6a7082348e28',
              ],
              bedrooms: 1,
              bathrooms: 1,
              amenities: ['Internet', 'Furnished', 'Laundry'],
              verified: false,
              landlordContact: {
                name: 'John Doe',
                phone: '+0987654321',
                email: 'john@example.com',
              },
              createdBy: '3',
              createdAt: new Date().toISOString(),
              allowVerification: false,
              status: 'approved',
              pointsToUnlock: 100,
              requiresPaidPoints: false,
            },
            {
              id: '3',
              title: 'Luxury Villa with Pool',
              description: 'Stunning luxury villa with private pool and garden. Perfect for families looking for space and comfort.',
              price: 750000,
              location: 'Suburbs',
              address: '789 Luxury Lane, Suburbs',
              images: [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
              ],
              bedrooms: 4,
              bathrooms: 3,
              amenities: ['Pool', 'Garden', 'Garage', 'Security', 'Smart Home'],
              verified: true,
              landlordContact: {
                name: 'Robert Johnson',
                phone: '+1122334455',
                email: 'robert@example.com',
              },
              createdBy: '4',
              createdAt: new Date().toISOString(),
              allowVerification: true,
              status: 'approved',
              pointsToUnlock: 300,
              requiresPaidPoints: true,
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
          if (listing.requiresPaidPoints) {
            if (user.pPoints < listing.pointsToUnlock) {
              return false;
            }
            
            // Deduct paid points
            useAuthStore.getState().updateUser({
              pPoints: user.pPoints - listing.pointsToUnlock,
            });
          } else {
            if (user.fPoints < listing.pointsToUnlock) {
              return false;
            }
            
            // Deduct free points
            useAuthStore.getState().updateUser({
              fPoints: user.fPoints - listing.pointsToUnlock,
            });
          }
          
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuthStore } from './auth-store';

interface PointsPackage {
  id: string;
  name: string;
  points: number;
  price: number;
  popular?: boolean;
}

interface PointsState {
  packages: PointsPackage[];
  isLoading: boolean;
  error: string | null;
  
  fetchPackages: () => Promise<void>;
  purchasePoints: (packageId: string) => Promise<boolean>;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      packages: [
        {
          id: 'basic',
          name: 'Basic',
          points: 100,
          price: 1000, // in Naira
        },
        {
          id: 'standard',
          name: 'Standard',
          points: 250,
          price: 2000,
          popular: true,
        },
        {
          id: 'premium',
          name: 'Premium',
          points: 500,
          price: 3500,
        },
        {
          id: 'ultimate',
          name: 'Ultimate',
          points: 1000,
          price: 6000,
        }
      ],
      isLoading: false,
      error: null,
      
      fetchPackages: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Packages are already defined in initial state
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch point packages', isLoading: false });
        }
      },
      
      purchasePoints: async (packageId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call (payment processing)
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          const pointsPackage = get().packages.find(p => p.id === packageId);
          if (!pointsPackage) throw new Error('Package not found');
          
          // Update user's points
          await useAuthStore.getState().addPoints(
            pointsPackage.points, 
            `purchasing the ${pointsPackage.name} package`
          );
          
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ 
            error: 'Failed to purchase points. Please try again.',
            isLoading: false 
          });
          return false;
        }
      }
    }),
    {
      name: 'housify-points-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointsTransaction, PointsPackage } from '@/types';
import { useAuthStore } from './auth-store';

interface PointsState {
  transactions: PointsTransaction[];
  packages: PointsPackage[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  addTransaction: (transaction: Omit<PointsTransaction, 'id' | 'createdAt'>) => Promise<void>;
  purchasePoints: (packageId: string) => Promise<boolean>;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      transactions: [],
      packages: [],
      isLoading: false,
      
      fetchTransactions: async () => {
        set({ isLoading: true });
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock transactions data
          const mockTransactions: PointsTransaction[] = [
            {
              id: '1',
              userId: user.id,
              amount: 100,
              type: 'earned',
              description: 'Welcome bonus',
              createdAt: new Date().toISOString(),
              pointsType: 'free',
            },
          ];
          
          set({ transactions: mockTransactions, isLoading: false });
        } catch (error) {
          console.error('Fetch transactions error:', error);
          set({ isLoading: false });
        }
      },
      
      fetchPackages: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock packages data
          const mockPackages: PointsPackage[] = [
            {
              id: '1',
              name: 'Starter Pack',
              amount: 500,
              price: 500,
              bonus: 0,
            },
            {
              id: '2',
              name: 'Value Pack',
              amount: 1200,
              price: 1000,
              bonus: 200,
            },
            {
              id: '3',
              name: 'Premium Pack',
              amount: 3000,
              price: 2500,
              bonus: 500,
            },
          ];
          
          set({ packages: mockPackages, isLoading: false });
        } catch (error) {
          console.error('Fetch packages error:', error);
          set({ isLoading: false });
        }
      },
      
      addTransaction: async (transactionData) => {
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          const newTransaction: PointsTransaction = {
            ...transactionData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };
          
          set((state) => ({
            transactions: [...state.transactions, newTransaction],
          }));
          
          // Update user's points based on transaction type
          if (transactionData.type === 'earned' || transactionData.type === 'purchased') {
            if (transactionData.pointsType === 'free') {
              useAuthStore.getState().updateUser({
                fPoints: user.fPoints + transactionData.amount,
              });
            } else {
              useAuthStore.getState().updateUser({
                pPoints: user.pPoints + transactionData.amount,
              });
            }
          }
        } catch (error) {
          console.error('Add transaction error:', error);
          throw error;
        }
      },
      
      purchasePoints: async (packageId) => {
        set({ isLoading: true });
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          const packageData = get().packages.find(p => p.id === packageId);
          if (!packageData) throw new Error('Package not found');
          
          // In a real app, this would be a payment API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Add transaction
          await get().addTransaction({
            userId: user.id,
            amount: packageData.amount,
            type: 'purchased',
            description: `Purchased ${packageData.name}`,
            pointsType: 'paid',
          });
          
          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('Purchase points error:', error);
          set({ isLoading: false });
          return false;
        }
      },
    }),
    {
      name: 'housify-points',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointsTransaction, PointsPackage, ReferralInfo } from '@/types';
import { useAuthStore } from './auth-store';

interface PointsState {
  transactions: PointsTransaction[];
  packages: PointsPackage[];
  isLoading: boolean;
  referralInfo: ReferralInfo;
  fetchTransactions: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  addTransaction: (transaction: Omit<PointsTransaction, 'id' | 'createdAt'>) => Promise<void>;
  purchasePoints: (packageId: string) => Promise<boolean>;
  generateReferralCode: () => Promise<string>;
  processReferral: (referralCode: string) => Promise<boolean>;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      transactions: [],
      packages: [],
      isLoading: false,
      referralInfo: {
        code: '',
        pointsPerReferral: 100,
        totalReferred: 0,
        pointsEarned: 0,
      },
      
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
              amount: 50,
              type: 'earned',
              description: 'Welcome bonus',
              createdAt: new Date().toISOString(),
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
          
          // Mock packages data based on new structure
          const mockPackages: PointsPackage[] = [
            {
              id: '1',
              name: 'Unlock One Listing',
              amount: 100,
              price: 500,
              listings: 1,
              description: 'Unlock contact details for one property',
            },
            {
              id: '2',
              name: 'Unlock Three Listings',
              amount: 250,
              price: 1200,
              listings: 3,
              popular: true,
              description: 'Best value! Unlock three properties',
            },
            {
              id: '3',
              name: 'Unlock Five Listings',
              amount: 400,
              price: 1800,
              listings: 5,
              description: 'Unlock five properties at a discount',
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
          if (transactionData.type === 'earned' || transactionData.type === 'purchased' || transactionData.type === 'referral') {
            useAuthStore.getState().updateUser({
              housePoints: user.housePoints + transactionData.amount,
            });
          } else if (transactionData.type === 'spent') {
            useAuthStore.getState().updateUser({
              housePoints: user.housePoints - transactionData.amount,
            });
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
          });
          
          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('Purchase points error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      generateReferralCode: async () => {
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // If user already has a referral code, return it
          if (user.referralCode) {
            return user.referralCode;
          }
          
          // Generate a random code
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let code = '';
          for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
          }
          
          // Add user's first initial to make it more personal
          const firstInitial = user.name.charAt(0).toUpperCase();
          const referralCode = `${firstInitial}${code}`;
          
          // Update user with the new referral code
          useAuthStore.getState().updateUser({
            referralCode,
          });
          
          return referralCode;
        } catch (error) {
          console.error('Generate referral code error:', error);
          throw error;
        }
      },
      
      processReferral: async (referralCode) => {
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // In a real app, this would validate the referral code against a database
          // For now, we'll just simulate success
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Add points to the referrer (in a real app, this would be done server-side)
          const pointsPerReferral = get().referralInfo.pointsPerReferral;
          
          // Update referral info
          set((state) => ({
            referralInfo: {
              ...state.referralInfo,
              totalReferred: state.referralInfo.totalReferred + 1,
              pointsEarned: state.referralInfo.pointsEarned + pointsPerReferral,
            }
          }));
          
          // Add transaction for the referral
          await get().addTransaction({
            userId: user.id,
            amount: pointsPerReferral,
            type: 'referral',
            description: 'Referral bonus',
          });
          
          return true;
        } catch (error) {
          console.error('Process referral error:', error);
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
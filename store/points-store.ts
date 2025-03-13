import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointsTransaction, PointsPackage, ReferralInfo } from '@/types';
import { useAuthStore } from './auth-store';

interface PointsState {
  transactions: PointsTransaction[];
  packages: PointsPackage[];
  isLoading: boolean;
  loadingMessage: string | null;
  referralInfo: ReferralInfo;
  fetchTransactions: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  addTransaction: (transaction: Omit<PointsTransaction, 'id' | 'createdAt'>) => Promise<void>;
  purchasePoints: (packageId: string) => Promise<boolean>;
  generateReferralCode: () => Promise<string>;
  processReferral: (referralCode: string) => Promise<boolean>;
  setLoadingMessage: (message: string | null) => void;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      transactions: [],
      packages: [],
      isLoading: false,
      loadingMessage: null,
      referralInfo: {
        code: '',
        pointsPerReferral: 100,
        totalReferred: 0,
        pointsEarned: 0,
      },
      
      setLoadingMessage: (message) => {
        set({ loadingMessage: message });
      },
      
      fetchTransactions: async () => {
        set({ isLoading: true, loadingMessage: 'Loading transactions...' });
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
          
          set({ transactions: mockTransactions, isLoading: false, loadingMessage: null });
        } catch (error) {
          console.error('Fetch transactions error:', error);
          set({ isLoading: false, loadingMessage: null });
        }
      },
      
      fetchPackages: async () => {
        set({ isLoading: true, loadingMessage: 'Loading packages...' });
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
          
          set({ packages: mockPackages, isLoading: false, loadingMessage: null });
        } catch (error) {
          console.error('Fetch packages error:', error);
          set({ isLoading: false, loadingMessage: null });
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
          // Use a longer timeout to ensure it happens after the current execution context
          // and doesn't interfere with navigation
          return new Promise<void>((resolve) => {
            setTimeout(async () => {
              try {
                if (transactionData.type === 'earned' || transactionData.type === 'purchased' || transactionData.type === 'referral') {
                  await useAuthStore.getState().updateUser({
                    housePoints: user.housePoints + transactionData.amount,
                  });
                } else if (transactionData.type === 'spent') {
                  await useAuthStore.getState().updateUser({
                    housePoints: user.housePoints - transactionData.amount,
                  });
                }
                resolve();
              } catch (error) {
                console.error('Update user points error:', error);
                resolve();
              }
            }, 200);
          });
        } catch (error) {
          console.error('Add transaction error:', error);
          throw error;
        }
      },
      
      purchasePoints: async (packageId) => {
        set({ isLoading: true, loadingMessage: 'Processing purchase...' });
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          const packageData = get().packages.find(p => p.id === packageId);
          if (!packageData) throw new Error('Package not found');
          
          // In a real app, this would be a payment API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Add transaction with a longer delay to prevent navigation issues
          set({ loadingMessage: 'Adding points to your account...' });
          await new Promise(resolve => setTimeout(resolve, 500));
          
          await get().addTransaction({
            userId: user.id,
            amount: packageData.amount,
            type: 'purchased',
            description: `Purchased ${packageData.name}`,
          });
          
          // Add additional delay before completing the transaction
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set({ isLoading: false, loadingMessage: null });
          return true;
        } catch (error) {
          console.error('Purchase points error:', error);
          set({ isLoading: false, loadingMessage: null });
          return false;
        }
      },
      
      generateReferralCode: async () => {
        set({ loadingMessage: 'Generating referral code...' });
        try {
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // If user already has a referral code, return it
          if (user.referralCode) {
            set({ loadingMessage: null });
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
          await useAuthStore.getState().updateUser({
            referralCode,
          });
          
          set({ loadingMessage: null });
          return referralCode;
        } catch (error) {
          console.error('Generate referral code error:', error);
          set({ loadingMessage: null });
          throw error;
        }
      },
      
      processReferral: async (referralCode) => {
        set({ isLoading: true, loadingMessage: 'Processing referral...' });
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
          set({ loadingMessage: 'Adding points to your account...' });
          await get().addTransaction({
            userId: user.id,
            amount: pointsPerReferral,
            type: 'referral',
            description: 'Referral bonus',
          });
          
          set({ isLoading: false, loadingMessage: null });
          return true;
        } catch (error) {
          console.error('Process referral error:', error);
          set({ isLoading: false, loadingMessage: null });
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
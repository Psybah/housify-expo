import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';
import { users } from '@/mocks/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showPointsEarnedModal: boolean;
  pointsEarnedAmount: number;
  pointsEarnedReason: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  completeProfile: () => Promise<void>;
  hidePointsEarnedModal: () => void;
  addPoints: (amount: number, reason: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      showPointsEarnedModal: false,
      pointsEarnedAmount: 0,
      pointsEarnedReason: '',
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user in mock data
          const user = users.find(u => u.email === email);
          
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: 'Invalid credentials', isLoading: false });
          }
        } catch (error) {
          set({ error: 'Login failed. Please try again.', isLoading: false });
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ error: 'Logout failed', isLoading: false });
        }
      },
      
      register: async (userData, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Create new user with default values
          const newUser: User = {
            id: `user${Date.now()}`,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone,
            role: 'house-seeker',
            points: 10, // Give 10 HP for signing up
            verifiedStatus: false,
            profileCompleted: false,
            createdAt: new Date().toISOString(),
            savedProperties: [],
            listedProperties: [],
            unlockedProperties: []
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            showPointsEarnedModal: true,
            pointsEarnedAmount: 10,
            pointsEarnedReason: 'signing up'
          });
        } catch (error) {
          set({ error: 'Registration failed. Please try again.', isLoading: false });
        }
      },
      
      updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Update failed. Please try again.', isLoading: false });
        }
      },
      
      completeProfile: async () => {
        const { user } = get();
        if (!user || user.profileCompleted) return;
        
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get current points as a number
          const currentPoints = typeof user.points === 'object' && user.points !== null 
            ? (user.points.hp || 0) 
            : (typeof user.points === 'number' ? user.points : 0);
          
          // Update user and add points
          set(state => ({
            user: state.user ? { 
              ...state.user, 
              profileCompleted: true,
              points: currentPoints + 10
            } : null,
            isLoading: false,
            showPointsEarnedModal: true,
            pointsEarnedAmount: 10,
            pointsEarnedReason: 'completing your profile'
          }));
        } catch (error) {
          set({ error: 'Failed to complete profile', isLoading: false });
        }
      },
      
      hidePointsEarnedModal: () => {
        set({ showPointsEarnedModal: false });
      },
      
      addPoints: async (amount, reason) => {
        const { user } = get();
        if (!user) return;
        
        try {
          // Get current points as a number
          const currentPoints = typeof user.points === 'object' && user.points !== null 
            ? (user.points.hp || 0) 
            : (typeof user.points === 'number' ? user.points : 0);
          
          // Update user points
          set(state => ({
            user: state.user ? { 
              ...state.user, 
              points: currentPoints + amount
            } : null,
            showPointsEarnedModal: true,
            pointsEarnedAmount: amount,
            pointsEarnedReason: reason
          }));
        } catch (error) {
          console.error('Failed to add points', error);
        }
      }
    }),
    {
      name: 'housify-auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
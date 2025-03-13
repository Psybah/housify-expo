import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const user: User = {
            id: '1',
            name: 'John Doe',
            email: email,
            phone: '+2348012345678',
            housePoints: 50, // Starting with 50 HP
            createdAt: new Date().toISOString(),
            listings: [],
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create a new user with default values
          const newUser: User = {
            id: Date.now().toString(),
            name: userData.name || 'New User',
            email: userData.email || '',
            phone: userData.phone || '',
            housePoints: 50, // Starting with 50 HP
            createdAt: new Date().toISOString(),
            listings: [],
            ...userData,
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          console.error('Register error:', error);
          set({ isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'housify-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
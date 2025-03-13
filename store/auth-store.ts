import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
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
          // For demo, we'll simulate a successful login
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const user: User = {
            id: '1',
            name: 'John Doe',
            email,
            phone: '+1234567890',
            fPoints: 100, // Start with free points
            pPoints: 0,
            createdAt: new Date().toISOString(),
            listings: [],
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (name, email, phone, password) => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create new user with initial free points
          const user: User = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            fPoints: 100, // Start with free points
            pPoints: 0,
            createdAt: new Date().toISOString(),
            listings: [],
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
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
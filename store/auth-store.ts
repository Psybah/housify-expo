import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

// Storage key for the auth store
const AUTH_STORAGE_KEY = 'housify-auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loadingMessage: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
  setLoadingMessage: (message: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loadingMessage: null,
      error: null,
      
      setLoadingMessage: (message) => {
        set({ loadingMessage: message });
      },
      
      login: async (email, password) => {
        set({ isLoading: true, error: null, loadingMessage: 'Logging in...' });
        try {
          // Use Firebase authentication
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          // Get user data from Firestore
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'id'>;
            
            // Create complete user object
            const user: User = {
              id: userCredential.user.uid,
              ...userData,
            };
            
            set({ user, isAuthenticated: true, isLoading: false, loadingMessage: null });
            return true;
          } else {
            // If user auth exists but no Firestore document, create one
            set({ loadingMessage: 'Creating user profile...' });
            const newUser: User = {
              id: userCredential.user.uid,
              name: userCredential.user.displayName || email.split('@')[0],
              email: email,
              phone: '',
              housePoints: 50, // Starting with 50 HP
              createdAt: new Date().toISOString(),
              listings: [],
              referrals: [],
            };
            
            await setDoc(userDocRef, newUser);
            set({ user: newUser, isAuthenticated: true, isLoading: false, loadingMessage: null });
            return true;
          }
        } catch (error) {
          console.error('Login error:', error);
          let errorMessage = 'An error occurred during login';
          
          // Handle specific Firebase auth errors
          if ((error as { code?: string }).code === 'auth/user-not-found' || (error as { code?: string }).code === 'auth/wrong-password') {
            errorMessage = 'Invalid email or password';
          } else if ((error as { code?: string }).code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed login attempts. Please try again later';
          } else if ((error as { code?: string }).code === 'auth/invalid-credential') {
            errorMessage = 'Invalid login credentials';
          }
          
          set({ isLoading: false, error: errorMessage, loadingMessage: null });
          return false;
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null, loadingMessage: 'Creating account...' });
        try {
          if (!userData.email || !userData.password) {
            throw new Error('Email and password are required');
          }
          
          // Create user with Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            userData.email, 
            userData.password
          );
          
          // Update display name if provided
          if (userData.name) {
            set({ loadingMessage: 'Setting up profile...' });
            await updateProfile(userCredential.user, {
              displayName: userData.name
            });
          }
          
          // Create a new user document in Firestore
          const newUser: User = {
            id: userCredential.user.uid,
            name: userData.name || userData.email.split('@')[0],
            email: userData.email,
            phone: userData.phone || '',
            housePoints: 50, // Starting with 50 HP
            createdAt: new Date().toISOString(),
            listings: [],
            profileImage: userData.profileImage,
            referrals: [],
          };
          
          // Save user data to Firestore
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          await setDoc(userDocRef, newUser);
          
          set({ user: newUser, isAuthenticated: true, isLoading: false, loadingMessage: null });
          return true;
        } catch (error) {
          console.error('Register error:', error);
          let errorMessage = 'An error occurred during registration';
          
          // Handle specific Firebase auth errors
          if ((error as { code?: string }).code === 'auth/email-already-in-use') {
            errorMessage = 'Email is already in use';
          } else if ((error as { code?: string }).code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
          } else if ((error as { code?: string }).code === 'auth/weak-password') {
            errorMessage = 'Password is too weak';
          }
          
          set({ isLoading: false, error: errorMessage, loadingMessage: null });
          return false;
        }
      },
      
      logout: async () => {
        set({ isLoading: true, loadingMessage: 'Logging out...' });
        try {
          // Sign out from Firebase
          await signOut(auth);
          
          // Clear the persisted state from AsyncStorage
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          
          // Reset the state
          set((state) => ({ 
            ...state,
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null,
            loadingMessage: null
          }));
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false, error: 'Failed to log out', loadingMessage: null });
        }
      },
      
      updateUser: async (userData) => {
        set({ isLoading: true, error: null, loadingMessage: 'Updating profile...' });
        try {
          const { user } = get();
          if (!user) throw new Error('User not authenticated');
          
          // Check if user document exists in Firestore
          const userDocRef = doc(db, 'users', user.id);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            // Update existing user document
            await updateDoc(userDocRef, userData);
          } else {
            // Create new user document if it doesn't exist
            const newUserData: User = {
              id: user.id,
              name: userData.name || user.name,
              email: userData.email || user.email,
              phone: userData.phone || user.phone || '',
              housePoints: userData.housePoints || user.housePoints || 50,
              createdAt: userData.createdAt || user.createdAt || new Date().toISOString(),
              listings: userData.listings || user.listings || [],
              profileImage: userData.profileImage || user.profileImage,
              referralCode: userData.referralCode || user.referralCode,
              referrals: userData.referrals || user.referrals || [],
            };
            
            await setDoc(userDocRef, newUserData);
          }
          
          // Update display name if provided
          if (userData.name && auth.currentUser) {
            await updateProfile(auth.currentUser, {
              displayName: userData.name
            });
          }
          
          // Update local state
          set({ 
            user: { ...user, ...userData },
            isLoading: false,
            loadingMessage: null
          });
          
          return true;
        } catch (error) {
          console.error('Update user error:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to update user profile',
            loadingMessage: null
          });
          return false;
        }
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true, error: null, loadingMessage: 'Sending reset email...' });
        try {
          await sendPasswordResetEmail(auth, email);
          set({ isLoading: false, loadingMessage: null });
          return true;
        } catch (error) {
          console.error('Reset password error:', error);
          let errorMessage = 'Failed to send password reset email';
          
          if ((error as { code?: string }).code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email';
          } else if ((error as { code?: string }).code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
          }
          
          set({ isLoading: false, error: errorMessage, loadingMessage: null });
          return false;
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
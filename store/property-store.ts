import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Property, PropertyFilter } from '@/types/property';
import { properties as mockProperties } from '@/mocks/properties';
import { useAuthStore } from './auth-store';

interface PropertyState {
  properties: Property[];
  filteredProperties: Property[];
  savedProperties: string[];
  unlockedProperties: string[];
  draftProperties: Property[];
  isLoading: boolean;
  error: string | null;
  currentFilter: PropertyFilter | null;
  
  fetchProperties: () => Promise<void>;
  filterProperties: (filter: PropertyFilter) => void;
  clearFilters: () => void;
  saveProperty: (propertyId: string) => void;
  unsaveProperty: (propertyId: string) => void;
  unlockProperty: (propertyId: string) => Promise<boolean>;
  submitProperty: (property: Partial<Property>) => Promise<string>;
  fetchDraftProperties: () => Promise<void>;
  updateDraftProperty: (propertyId: string, updates: Partial<Property>) => Promise<void>;
  deleteDraftProperty: (propertyId: string) => Promise<void>;
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      properties: [],
      filteredProperties: [],
      savedProperties: [],
      unlockedProperties: [],
      draftProperties: [],
      isLoading: false,
      error: null,
      currentFilter: null,
      
      fetchProperties: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Filter only verified properties with available status
          const verifiedProperties = mockProperties.filter(
            p => p.verified && p.status === 'available'
          );
          
          set({ 
            properties: verifiedProperties,
            filteredProperties: verifiedProperties,
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to fetch properties', isLoading: false });
        }
      },
      
      filterProperties: (filter) => {
        set({ currentFilter: filter });
        
        const filtered = get().properties.filter(property => {
          // Price range filter
          if (filter.priceRange) {
            if (property.price < filter.priceRange.min || property.price > filter.priceRange.max) {
              return false;
            }
          }
          
          // Location filter
          if (filter.location) {
            if (filter.location.city && property.location.city !== filter.location.city) {
              return false;
            }
            if (filter.location.state && property.location.state !== filter.location.state) {
              return false;
            }
          }
          
          // Bedrooms filter
          if (filter.bedrooms !== undefined && property.features.bedrooms < filter.bedrooms) {
            return false;
          }
          
          // Bathrooms filter
          if (filter.bathrooms !== undefined && property.features.bathrooms < filter.bathrooms) {
            return false;
          }
          
          // Property type filter
          if (filter.propertyType && filter.propertyType.length > 0 && !filter.propertyType.includes(property.type)) {
            return false;
          }
          
          // Furnished filter
          if (filter.furnished !== undefined && property.features.furnished !== filter.furnished) {
            return false;
          }
          
          return true;
        });
        
        set({ filteredProperties: filtered });
      },
      
      clearFilters: () => {
        set({ 
          currentFilter: null,
          filteredProperties: get().properties
        });
      },
      
      saveProperty: (propertyId) => {
        set(state => ({
          savedProperties: [...state.savedProperties, propertyId]
        }));
      },
      
      unsaveProperty: (propertyId) => {
        set(state => ({
          savedProperties: state.savedProperties.filter(id => id !== propertyId)
        }));
      },
      
      unlockProperty: async (propertyId) => {
        const property = get().properties.find(p => p.id === propertyId);
        if (!property) return false;
        
        const user = useAuthStore.getState().user;
        if (!user) return false;
        
        // Check if already unlocked
        if (get().unlockedProperties.includes(propertyId)) {
          return true;
        }
        
        const pointsRequired = property.pointsToUnlock;
        
        if (user.points < pointsRequired) {
          return false;
        }
        
        // Deduct points
        await useAuthStore.getState().updateUser({
          points: user.points - pointsRequired
        });
        
        // Add to unlocked properties
        set(state => ({
          unlockedProperties: [...state.unlockedProperties, propertyId]
        }));
        
        return true;
      },
      
      submitProperty: async (property) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // Create new property as draft
          const newProperty: Property = {
            id: `property${Date.now()}`,
            title: property.title || '',
            description: property.description || '',
            price: property.price || 0,
            location: property.location || {
              address: '',
              city: '',
              state: ''
            },
            features: property.features || {
              bedrooms: 0,
              bathrooms: 0,
              furnished: false
            },
            amenities: property.amenities || [],
            images: property.images || [],
            type: property.type || 'apartment',
            status: 'draft', // All new submissions are drafts
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            pointsToUnlock: 50, // Default points for new listings
            submittedBy: user.id,
            landlordContact: property.landlordContact
          };
          
          // Add to draft properties
          set(state => ({
            draftProperties: [...state.draftProperties, newProperty],
            isLoading: false
          }));
          
          // Update user's listed properties
          await useAuthStore.getState().updateUser({
            listedProperties: [...user.listedProperties, newProperty.id]
          });
          
          return newProperty.id;
        } catch (error) {
          set({ error: 'Failed to submit property', isLoading: false });
          throw error;
        }
      },
      
      fetchDraftProperties: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          // Get user's draft and pending verification properties
          const userDrafts = mockProperties.filter(
            p => (p.status === 'draft' || p.status === 'pending-verification') && 
                 p.submittedBy === user.id
          );
          
          set({ 
            draftProperties: userDrafts,
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to fetch draft properties', isLoading: false });
        }
      },
      
      updateDraftProperty: async (propertyId, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            draftProperties: state.draftProperties.map(p => 
              p.id === propertyId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to update draft property', isLoading: false });
        }
      },
      
      deleteDraftProperty: async (propertyId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const user = useAuthStore.getState().user;
          if (!user) throw new Error('User not authenticated');
          
          set(state => ({
            draftProperties: state.draftProperties.filter(p => p.id !== propertyId),
            isLoading: false
          }));
          
          // Update user's listed properties
          await useAuthStore.getState().updateUser({
            listedProperties: user.listedProperties.filter(id => id !== propertyId)
          });
        } catch (error) {
          set({ error: 'Failed to delete draft property', isLoading: false });
        }
      }
    }),
    {
      name: 'housify-property-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        savedProperties: state.savedProperties,
        unlockedProperties: state.unlockedProperties,
        draftProperties: state.draftProperties
      })
    }
  )
);
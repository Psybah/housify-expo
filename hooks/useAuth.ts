import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

/**
 * Custom hook to handle authentication state and navigation
 * This ensures users are redirected to the appropriate screens based on their authentication status
 */
export function useAuth() {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  // Set initialRenderComplete to true after the first render
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  // Handle authentication state changes and navigation
  useEffect(() => {
    // Skip navigation if still loading or initial render is not complete
    if (isLoading || !initialRenderComplete) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    // Use setTimeout to ensure navigation happens after layout is complete
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        // If user is authenticated but in auth group, redirect to tabs
        if (inAuthGroup) {
          console.log('User is authenticated, redirecting to tabs');
          router.replace('/(tabs)');
        }
      } else {
        // If user is not authenticated and not in auth group, redirect to auth
        if (!inAuthGroup) {
          console.log('User is not authenticated, redirecting to auth');
          router.replace('/(auth)');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, segments, router, isLoading, initialRenderComplete]);

  return {
    isAuthenticated,
    user,
    isLoading,
  };
} 
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, Slot } from 'expo-router';
import { View, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function AuthLayout() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  
  // Set initialRenderComplete to true after the first render
  useEffect(() => {
    // Use requestAnimationFrame to ensure we're past the initial render
    const timer = requestAnimationFrame(() => {
      setInitialRenderComplete(true);
    });
    
    return () => cancelAnimationFrame(timer);
  }, []);
  
  // Check authentication status after initial render is complete
  useEffect(() => {
    if (initialRenderComplete && isAuthenticated) {
      // Use setTimeout to ensure we're not navigating during render
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [initialRenderComplete, isAuthenticated, router]);
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Log In" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
    </Stack>
  );
}
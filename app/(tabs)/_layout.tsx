import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Search, PlusCircle, Award, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function TabLayout() {
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
    if (initialRenderComplete && !isAuthenticated) {
      // Use setTimeout to ensure we're not navigating during render
      const timer = setTimeout(() => {
        router.replace('/(auth)');
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [initialRenderComplete, isAuthenticated, router]);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <PlusCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="points"
        options={{
          title: 'Points',
          tabBarIcon: ({ color }) => <Award size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
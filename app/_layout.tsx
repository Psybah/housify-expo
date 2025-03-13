import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import { usePointsStore } from "@/store/points-store";
import { useListingsStore } from "@/store/listings-store";
import { LoadingOverlay } from "@/components/LoadingOverlay";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  // Initialize auth state
  const { isLoading: authLoading, loadingMessage: authLoadingMessage } = useAuthStore();
  const { isLoading: pointsLoading, loadingMessage: pointsLoadingMessage } = usePointsStore();
  const { isLoading: listingsLoading, loadingMessage: listingsLoadingMessage } = useListingsStore();
  
  // Determine if any loading is happening and what message to show
  const isLoading = authLoading || pointsLoading || listingsLoading;
  const loadingMessage = authLoadingMessage || pointsLoadingMessage || listingsLoadingMessage || 'Loading...';

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authLoading]);

  if (!loaded || authLoading) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Global loading overlay */}
      <LoadingOverlay visible={isLoading} message={loadingMessage} />
      
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.primary,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="listing/[id]" 
          options={{ 
            title: "Listing Details",
            animation: 'slide_from_right',
          }} 
        />
        <Stack.Screen 
          name="add-listing" 
          options={{ 
            title: "Add New Listing",
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="buy-points" 
          options={{ 
            title: "Buy Points",
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="settings/account" 
          options={{ 
            title: "Account Settings",
            animation: 'slide_from_right',
          }} 
        />
        <Stack.Screen 
          name="settings/notifications" 
          options={{ 
            title: "Notifications",
            animation: 'slide_from_right',
          }} 
        />
        <Stack.Screen 
          name="settings/privacy" 
          options={{ 
            title: "Privacy & Security",
            animation: 'slide_from_right',
          }} 
        />
        <Stack.Screen 
          name="settings/support" 
          options={{ 
            title: "Help & Support",
            animation: 'slide_from_right',
          }} 
        />
      </Stack>
    </ErrorBoundary>
  );
}
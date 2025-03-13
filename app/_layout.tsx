import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
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
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
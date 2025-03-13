import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, User, Coins } from "lucide-react-native";
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Remove the automatic navigation and let the user click buttons instead
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleRegister = () => {
    router.push('/register');
  };
  
  // If user is already authenticated, show a different button
  const handleContinue = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa' }}
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.8)', colors.background]}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Home size={40} color={colors.primary} />
          <Text style={styles.logoText}>Housify</Text>
        </View>
        
        <Text style={styles.tagline}>Find your dream home, earn while you help others</Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
              <Home size={24} color={colors.background} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Post Listings</Text>
              <Text style={styles.featureDescription}>Share available houses and earn points</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.secondary }]}>
              <Coins size={24} color={colors.background} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Earn Points</Text>
              <Text style={styles.featureDescription}>Get rewarded for helping the community</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
              <User size={24} color={colors.background} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Connect Directly</Text>
              <Text style={styles.featureDescription}>Talk to landlords without middlemen</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        {isAuthenticated ? (
          <Button
            title="Continue to App"
            onPress={handleContinue}
            fullWidth
            size="large"
            style={styles.registerButton}
          />
        ) : (
          <>
            <Button
              title="Create Account"
              onPress={handleRegister}
              fullWidth
              size="large"
              style={styles.registerButton}
            />
            
            <Button
              title="Log In"
              onPress={handleLogin}
              variant="outline"
              fullWidth
              size="large"
              style={styles.loginButton}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height: height * 0.6,
    top: 0,
  },
  gradient: {
    position: 'absolute',
    width,
    height: height * 0.6,
    top: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 12,
  },
  tagline: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  registerButton: {
    marginBottom: 12,
  },
  loginButton: {
    borderColor: colors.primary,
  },
});
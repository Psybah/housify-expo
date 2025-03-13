import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, User, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function WelcomeScreen() {
  const router = useRouter();
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleRegister = () => {
    router.push('/register');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.background, colors.card]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Home size={60} color={colors.primary} />
            </View>
            <Text style={styles.appName}>Housify</Text>
            <Text style={styles.tagline}>Find your perfect home</Text>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Home size={24} color={colors.primary} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Discover Properties</Text>
                <Text style={styles.featureDescription}>
                  Browse thousands of listings to find your perfect home
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <User size={24} color={colors.primary} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Verified Listings</Text>
                <Text style={styles.featureDescription}>
                  All properties are verified for your peace of mind
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button
              label="Sign In"
              onPress={handleLogin}
              variant="primary"
              style={styles.button}
            />
            
            <Button
              label="Create Account"
              onPress={handleRegister}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
});
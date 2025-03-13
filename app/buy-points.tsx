import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Coins, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Gift,
  Info
} from "lucide-react-native";
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PointsBadge } from '@/components/PointsBadge';
import { useAuthStore } from '@/store/auth-store';
import { usePointsStore } from '@/store/points-store';
import { PointsPackage } from '@/types';

export default function BuyPointsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { packages, fetchPackages, purchasePoints, isLoading } = usePointsStore();
  
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };
  
  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Error', 'Please select a package first');
      return;
    }
    
    try {
      const success = await purchasePoints(selectedPackage);
      
      if (success) {
        Alert.alert(
          'Purchase Successful',
          'House Points have been added to your account!',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to purchase points. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Failed to purchase points. Please try again.');
    }
  };
  
  const renderPackageCard = (pkg: PointsPackage) => {
    const isSelected = selectedPackage === pkg.id;
    
    return (
      <TouchableOpacity
        key={pkg.id}
        style={[
          styles.packageCard,
          isSelected && styles.packageCardSelected,
          pkg.popular && styles.packageCardPopular
        ]}
        onPress={() => handleSelectPackage(pkg.id)}
      >
        {pkg.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Best Value</Text>
          </View>
        )}
        
        {pkg.bonus > 0 && (
          <View style={styles.bonusBadge}>
            <Gift size={12} color={colors.text} />
            <Text style={styles.bonusText}>+{pkg.bonus} Bonus</Text>
          </View>
        )}
        
        <View style={styles.packageHeader}>
          <View style={styles.packageIconContainer}>
            <Coins size={24} color={colors.iconLight} />
          </View>
          <Text style={styles.packageName}>{pkg.name}</Text>
        </View>
        
        <Text style={styles.packageDescription}>
          {pkg.description || `Unlock ${pkg.listings} listing${pkg.listings !== 1 ? 's' : ''}`}
        </Text>
        
        <View style={styles.packageDetails}>
          <Text style={styles.packageAmount}>{pkg.amount} HP</Text>
          <Text style={styles.packagePrice}>₦{pkg.price.toLocaleString()}</Text>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <CheckCircle size={20} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Buy House Points</Text>
        <Text style={styles.subtitle}>Purchase HP to unlock verified listings</Text>
      </View>
      
      <View style={styles.balanceCard}>
        <LinearGradient
          colors={[colors.primary, '#034694']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceGradient}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Current Balance</Text>
            <Shield size={20} color={colors.iconLight} />
          </View>
          
          <View style={styles.balanceRow}>
            <PointsBadge amount={user?.housePoints || 0} size="medium" />
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Package</Text>
        
        {packages.map(renderPackageCard)}
      </View>
      
      <View style={styles.infoCard}>
        <View style={styles.infoIconContainer}>
          <Info size={24} color={colors.primary} />
        </View>
        
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Why Buy House Points?</Text>
          <Text style={styles.infoText}>
            House Points allow you to unlock verified listings with confirmed landlord details, ensuring a safer house hunting experience.
          </Text>
          
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn more</Text>
            <ArrowRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Purchase Points"
          onPress={handlePurchase}
          loading={isLoading}
          disabled={!selectedPackage || isLoading}
          fullWidth
          icon={<CreditCard size={18} color={colors.iconLight} />}
        />
        
        <TouchableOpacity 
          style={styles.earnPointsLink}
          onPress={() => router.push('/add-listing')}
        >
          <Text style={styles.earnPointsText}>
            Want to earn points instead? Add a listing
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  balanceGradient: {
    padding: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.iconLight,
  },
  balanceRow: {
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: colors.primary,
  },
  packageCardPopular: {
    borderColor: colors.popular,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: colors.popular,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.iconLight,
  },
  bonusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 4,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.housePoints,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  packageDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  packageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageAmount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(2, 43, 96, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  footer: {
    marginBottom: 16,
  },
  earnPointsLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  earnPointsText: {
    fontSize: 14,
    color: colors.primary,
  },
});
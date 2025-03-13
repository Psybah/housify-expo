import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Coins, CreditCard, CheckCircle, ArrowRight, Shield, Gift } from 'lucide-react-native';
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
          'Points have been added to your account!',
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
          isSelected && styles.packageCardSelected
        ]}
        onPress={() => handleSelectPackage(pkg.id)}
      >
        {pkg.bonus > 0 && (
          <View style={styles.bonusBadge}>
            <Gift size={12} color={colors.text} />
            <Text style={styles.bonusText}>+{pkg.bonus} Bonus</Text>
          </View>
        )}
        
        <View style={styles.packageHeader}>
          <View style={styles.packageIconContainer}>
            <Coins size={24} color={colors.text} />
          </View>
          <Text style={styles.packageName}>{pkg.name}</Text>
        </View>
        
        <View style={styles.packageDetails}>
          <Text style={styles.packageAmount}>{pkg.amount} P-Points</Text>
          <Text style={styles.packagePrice}>₦{pkg.price}</Text>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <CheckCircle size={20} color={colors.text} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Buy Points</Text>
        <Text style={styles.subtitle}>Purchase P-Points to unlock verified listings</Text>
      </View>
      
      <View style={styles.balanceCard}>
        <LinearGradient
          colors={[colors.primary, colors.pPoints]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceGradient}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Current Balance</Text>
            <Shield size={20} color={colors.text} />
          </View>
          
          <View style={styles.balanceRow}>
            <PointsBadge type="free" amount={user?.fPoints || 0} size="medium" />
            <View style={styles.balanceSpacer} />
            <PointsBadge type="paid" amount={user?.pPoints || 0} size="medium" />
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Package</Text>
        
        {packages.map(renderPackageCard)}
      </View>
      
      <View style={styles.infoCard}>
        <View style={styles.infoIconContainer}>
          <Coins size={24} color={colors.primary} />
        </View>
        
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Why Buy P-Points?</Text>
          <Text style={styles.infoText}>
            P-Points allow you to unlock verified listings with confirmed landlord details, ensuring a safer house hunting experience.
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
          icon={<CreditCard size={18} color={colors.text} />}
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
    color: colors.text,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceSpacer: {
    width: 12,
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
    marginBottom: 12,
  },
  packageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.pPoints,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  packageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageAmount: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
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
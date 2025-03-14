import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Coins, ArrowRight, Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PointsEarnedModal } from '@/components/PointsEarnedModal';
import { usePointsStore } from '@/store/points-store';
import { useAuthStore } from '@/store/auth-store';

export default function PointsScreen() {
  const { packages, fetchPackages, purchasePoints, isLoading } = usePointsStore();
  const { 
    user, 
    isAuthenticated, 
    showPointsEarnedModal, 
    pointsEarnedAmount, 
    pointsEarnedReason, 
    hidePointsEarnedModal 
  } = useAuthStore();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to purchase points.');
      return;
    }
    
    if (!selectedPackage) {
      Alert.alert('Select Package', 'Please select a points package to purchase.');
      return;
    }
    
    try {
      const success = await purchasePoints(selectedPackage);
      
      if (success) {
        // The points earned modal will be shown automatically
        setSelectedPackage(null);
      } else {
        Alert.alert('Purchase Failed', 'There was an error processing your payment. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };
  
  // Ensure points is a number
  const userPoints = user && typeof user.points === 'object' && user.points !== null 
    ? (user.points.hp || 0) // If it's an object with hp property, use that
    : (user && typeof user.points === 'number' ? user.points : 0); // Otherwise use the number or default to 0
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.card} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Points</Text>
          <Text style={styles.subtitle}>
            Purchase points to unlock landlord contacts and verified properties
          </Text>
        </View>
        
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={['#022B60', '#0A3D7A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Housify Points (HP)</Text>
                <View style={styles.balanceValueContainer}>
                  <Coins size={16} color={Colors.accent.main} />
                  <Text style={styles.balanceValue}>{userPoints}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Info size={20} color={Colors.primary.main} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How Points Work</Text>
            <Text style={styles.infoText}>
              Use HP to unlock verified property contact details. 
              Earn HP by submitting properties that get verified.
            </Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Buy Housify Points</Text>
        
        <View style={styles.packagesContainer}>
          {packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard,
                selectedPackage === pkg.id && styles.packageCardSelected,
                pkg.popular && styles.packageCardPopular
              ]}
              onPress={() => handleSelectPackage(pkg.id)}
            >
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
              
              <View style={styles.packageHeader}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                {selectedPackage === pkg.id && (
                  <View style={styles.checkCircle}>
                    <Check size={16} color={Colors.neutral.white} />
                  </View>
                )}
              </View>
              
              <View style={styles.packagePoints}>
                <Coins size={20} color={Colors.accent.main} />
                <Text style={styles.pointsAmount}>{pkg.points} HP</Text>
              </View>
              
              <Text style={styles.packagePrice}>₦{pkg.price.toLocaleString('en-NG')}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.purchaseContainer}>
          <Button
            title="Purchase Points"
            onPress={handlePurchase}
            fullWidth
            loading={isLoading}
            disabled={!selectedPackage || isLoading}
          />
        </View>
        
        <View style={styles.earnPointsSection}>
          <Text style={styles.earnPointsTitle}>Other Ways to Earn Points</Text>
          
          <TouchableOpacity style={styles.earnPointsCard}>
            <View style={styles.earnPointsIcon}>
              <Home size={24} color={Colors.primary.main} />
            </View>
            <View style={styles.earnPointsContent}>
              <Text style={styles.earnPointsCardTitle}>Submit Property Listings</Text>
              <Text style={styles.earnPointsCardText}>
                Earn up to 100 HP for each verified property you submit
              </Text>
            </View>
            <ArrowRight size={20} color={Colors.neutral.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.earnPointsCard}>
            <View style={styles.earnPointsIcon}>
              <UserPlus size={24} color={Colors.primary.main} />
            </View>
            <View style={styles.earnPointsContent}>
              <Text style={styles.earnPointsCardTitle}>Refer Friends</Text>
              <Text style={styles.earnPointsCardText}>
                Get 50 HP for each friend who joins and verifies their account
              </Text>
            </View>
            <ArrowRight size={20} color={Colors.neutral.gray} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <PointsEarnedModal
        visible={showPointsEarnedModal}
        onClose={hidePointsEarnedModal}
        points={pointsEarnedAmount}
        reason={pointsEarnedReason}
      />
    </SafeAreaView>
  );
}

// Import these icons at the top of the file
import { Home, UserPlus } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  balanceCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceGradient: {
    padding: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.neutral.white,
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  packagesContainer: {
    padding: 16,
    paddingTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  packageCard: {
    width: '48%',
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral.lightGray,
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '10',
  },
  packageCardPopular: {
    borderColor: Colors.accent.main,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.accent.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packagePoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pointsAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  packagePrice: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  purchaseContainer: {
    padding: 16,
  },
  earnPointsSection: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
  earnPointsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  earnPointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  earnPointsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  earnPointsContent: {
    flex: 1,
  },
  earnPointsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  earnPointsCardText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
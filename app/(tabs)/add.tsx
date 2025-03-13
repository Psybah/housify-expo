import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PlusCircle, Coins, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PointsBadge } from '@/components/PointsBadge';
import { useAuthStore } from '@/store/auth-store';

export default function AddScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const handleAddListing = () => {
    router.push('/add-listing');
  };
  
  const handleBuyPoints = () => {
    router.push('/buy-points');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add a Listing</Text>
        <Text style={styles.subtitle}>Help others find homes and earn points</Text>
      </View>
      
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa' }}
          style={styles.cardImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(18, 18, 18, 0.8)', colors.card]}
          style={styles.gradient}
        />
        
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <PlusCircle size={32} color={colors.text} />
          </View>
          
          <Text style={styles.cardTitle}>Post a House Listing</Text>
          <Text style={styles.cardDescription}>
            Share available houses with the community and earn points when others view your listings
          </Text>
          
          <View style={styles.rewardsContainer}>
            <Text style={styles.rewardsTitle}>Earn Points:</Text>
            
            <View style={styles.rewardItem}>
              <Coins size={16} color={colors.fPoints} />
              <Text style={styles.rewardText}>+50 points for each listing</Text>
            </View>
            
            <View style={styles.rewardItem}>
              <Coins size={16} color={colors.fPoints} />
              <Text style={styles.rewardText}>+100 points for verified listings</Text>
            </View>
            
            <View style={styles.rewardItem}>
              <Coins size={16} color={colors.pPoints} />
              <Text style={styles.rewardText}>Bonus when others unlock your listing</Text>
            </View>
          </View>
          
          <Button
            title="Add New Listing"
            onPress={handleAddListing}
            fullWidth
            icon={<PlusCircle size={18} color={colors.text} />}
          />
        </View>
      </View>
      
      <View style={styles.pointsCard}>
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsTitle}>Your Points Balance</Text>
          
          <View style={styles.pointsRow}>
            <PointsBadge type="free" amount={user?.fPoints || 0} />
            <PointsBadge type="paid" amount={user?.pPoints || 0} />
          </View>
        </View>
        
        <TouchableOpacity style={styles.buyPointsButton} onPress={handleBuyPoints}>
          <Text style={styles.buyPointsText}>Buy Points</Text>
          <ArrowRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  rewardsContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rewardText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  pointsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsInfo: {
    flex: 1,
  },
  pointsTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buyPointsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buyPointsText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 4,
  },
});
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, TrendingUp, CheckCircle, Plus, Coins, Search } from "lucide-react-native";
import { colors } from '@/constants/colors';
import { ListingCard } from '@/components/ListingCard';
import { PointsBadge } from '@/components/PointsBadge';
import { useAuthStore } from '@/store/auth-store';
import { useListingsStore } from '@/store/listings-store';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { listings, fetchListings, isLoading } = useListingsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchListings();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };
  
  const verifiedListings = listings.filter(listing => listing.verified);
  const recentListings = [...listings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  const handleAddListing = () => {
    router.push('/add-listing');
  };
  
  const handleViewAll = (category: string) => {
    router.push({
      pathname: '/search',
      params: { category },
    });
  };
  
  // Get first name for greeting
  const firstName = user?.name?.split(' ')[0] || 'User';
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{timeOfDay()},</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
          <Text style={styles.subtitle}>Find your perfect home today</Text>
        </View>
        
        <View style={styles.profileContainer}>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            {user?.profileImage ? (
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitial}>
                  {firstName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.pointsRow}>
        <PointsBadge type="free" amount={user?.fPoints || 0} size="small" />
        <View style={styles.pointsSpacer} />
        <PointsBadge type="paid" amount={user?.pPoints || 0} size="small" />
      </View>
      
      {/* Redesigned Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={handleAddListing}
        >
          <LinearGradient
            colors={[colors.primary, '#034694']}
            style={styles.actionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.actionIconContainer}>
              <Plus size={24} color={colors.background} />
            </View>
            <Text style={styles.actionTitle}>Add Listing</Text>
            <Text style={styles.actionSubtitle}>Post a new property</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/buy-points')}
        >
          <LinearGradient
            colors={['#034694', colors.primary]}
            style={styles.actionGradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.actionIconContainer}>
              <Coins size={24} color={colors.background} />
            </View>
            <Text style={styles.actionTitle}>Buy Points</Text>
            <Text style={styles.actionSubtitle}>Get more access</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/search')}
        >
          <LinearGradient
            colors={[colors.primary, '#034694']}
            style={styles.actionGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.actionIconContainer}>
              <Search size={24} color={colors.background} />
            </View>
            <Text style={styles.actionTitle}>Search</Text>
            <Text style={styles.actionSubtitle}>Find properties</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <CheckCircle size={20} color={colors.verified} />
            <Text style={styles.sectionTitle}>Verified Listings</Text>
          </View>
          
          <TouchableOpacity onPress={() => handleViewAll('verified')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listingsContainer}
        >
          {verifiedListings.length > 0 ? (
            verifiedListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} compact />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No verified listings available</Text>
            </View>
          )}
        </ScrollView>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <TrendingUp size={20} color={colors.accent} />
            <Text style={styles.sectionTitle}>Recent Listings</Text>
          </View>
          
          <TouchableOpacity onPress={() => handleViewAll('recent')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentListingsContainer}>
          {recentListings.length > 0 ? (
            recentListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent listings available</Text>
            </View>
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    marginRight: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileContainer: {
    marginLeft: 12,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pointsSpacer: {
    width: 8,
  },
  // New styles for redesigned quick actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '31%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionGradient: {
    width: '100%',
    height: '100%',
    padding: 12,
    justifyContent: 'space-between',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  listingsContainer: {
    paddingRight: 16,
  },
  recentListingsContainer: {
    width: '100%',
  },
  emptyContainer: {
    width: '100%',
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
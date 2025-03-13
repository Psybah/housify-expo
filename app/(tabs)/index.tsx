import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, TrendingUp, CheckCircle, PlusCircle, Coins, Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ListingCard } from '@/components/ListingCard';
import { PointsBadge } from '@/components/PointsBadge';
import { useAuthStore } from '@/store/auth-store';
import { useListingsStore } from '@/store/listings-store';

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
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
          <Text style={styles.subtitle}>Find your perfect home today</Text>
        </View>
        
        <View style={styles.pointsContainer}>
          <PointsBadge type="free" amount={user?.fPoints || 0} size="small" />
          <View style={styles.pointsSpacer} />
          <PointsBadge type="paid" amount={user?.pPoints || 0} size="small" />
        </View>
      </View>
      
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleAddListing}
        >
          <View style={styles.actionIcon}>
            <PlusCircle size={24} color={colors.text} />
          </View>
          <Text style={styles.actionText}>Add Listing</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/buy-points')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.pPoints }]}>
            <Coins size={24} color={colors.text} />
          </View>
          <Text style={styles.actionText}>Buy Points</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/search')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
            <Search size={24} color={colors.text} />
          </View>
          <Text style={styles.actionText}>Search</Text>
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
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsSpacer: {
    width: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
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
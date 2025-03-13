import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Home } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ListingCard } from '@/components/ListingCard';
import { useListingsStore } from '@/store/listings-store';

export default function SavedListingsScreen() {
  const router = useRouter();
  const { getSavedListings } = useListingsStore();
  
  const [savedListings, setSavedListings] = useState(getSavedListings());
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    setSavedListings(getSavedListings());
  }, [getSavedListings]);
  
  const onRefresh = () => {
    setRefreshing(true);
    setSavedListings(getSavedListings());
    setRefreshing(false);
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
        <Text style={styles.title}>Saved Listings</Text>
        <Text style={styles.subtitle}>
          {savedListings.length} {savedListings.length === 1 ? 'property' : 'properties'} saved
        </Text>
      </View>
      
      {savedListings.length > 0 ? (
        <View style={styles.listingsContainer}>
          {savedListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Saved Listings</Text>
          <Text style={styles.emptyDescription}>
            Properties you save will appear here for easy access
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.browseButtonText}>Browse Listings</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listingsContainer: {
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  browseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 14,
    color: colors.background,
    fontWeight: '500',
  },
});
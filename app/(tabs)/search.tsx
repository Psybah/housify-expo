import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Search, Filter, CheckCircle, AlertTriangle, MapPin } from "lucide-react-native";
import { colors } from '@/constants/colors';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { ListingCard } from '@/components/ListingCard';
import { useListingsStore } from '@/store/listings-store';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const { listings, fetchListings, isLoading, filterListings: storeFilterListings } = useListingsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(params.category || null);
  const [filteredListings, setFilteredListings] = useState(listings);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  useEffect(() => {
    fetchListings();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [listings, searchQuery, activeFilter]);
  
  const applyFilters = () => {
    let result = [...listings];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        listing => 
          listing.title.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (activeFilter) {
      switch (activeFilter) {
        case 'verified':
          result = result.filter(listing => listing.verified);
          break;
        case 'unverified':
          result = result.filter(listing => !listing.verified);
          break;
        case 'recent':
          result = result.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'price-low':
          result = result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result = result.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
    }
    
    setFilteredListings(result);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };
  
  const handleApplyFilters = (filters: any) => {
    const filtered = storeFilterListings(filters);
    setFilteredListings(filtered);
  };
  
  const filters = [
    { id: 'verified', label: 'Verified', icon: <CheckCircle size={16} color={colors.verified} /> },
    { id: 'unverified', label: 'Unverified', icon: <AlertTriangle size={16} color={colors.unverified} /> },
    { id: 'recent', label: 'Recent', icon: <Search size={16} color={colors.accent} /> },
    { id: 'price-low', label: 'Price: Low to High', icon: <MapPin size={16} color={colors.primary} /> },
    { id: 'price-high', label: 'Price: High to Low', icon: <MapPin size={16} color={colors.secondary} /> },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar 
          placeholder="Search by location, title, or description" 
          onChangeText={handleSearch}
          value={searchQuery}
          onFilterPress={() => setShowFilterModal(true)}
        />
      </View>
      
      <FilterBar 
        onApplyFilters={handleApplyFilters}
        modalVisible={showFilterModal}
        setModalVisible={setShowFilterModal}
      />
      
      <ScrollView 
        style={styles.listingsContainer}
        contentContainerStyle={styles.listingsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredListings.length > 0 ? (
          filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? "Try adjusting your search or filters" 
                : "There are no listings available at the moment"}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  listingsContainer: {
    flex: 1,
  },
  listingsContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
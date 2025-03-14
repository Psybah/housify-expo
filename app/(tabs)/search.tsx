import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { PropertyCard } from '@/components/PropertyCard';
import { FilterBar } from '@/components/FilterBar';
import { usePropertyStore } from '@/store/property-store';
import { Property, PropertyFilter } from '@/types/property';

export default function SearchScreen() {
  const { 
    properties, 
    filteredProperties, 
    fetchProperties, 
    filterProperties, 
    clearFilters,
    savedProperties,
    saveProperty,
    unsaveProperty
  } = usePropertyStore();
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  
  useEffect(() => {
    const loadProperties = async () => {
      if (properties.length === 0) {
        await fetchProperties();
      }
      setLoading(false);
    };
    
    loadProperties();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(filteredProperties);
    } else {
      const query = searchQuery.toLowerCase();
      const results = filteredProperties.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.address.toLowerCase().includes(query) ||
        property.location.city.toLowerCase().includes(query) ||
        property.location.state.toLowerCase().includes(query)
      );
      setSearchResults(results);
    }
  }, [searchQuery, filteredProperties]);
  
  const handleFilter = (filter: PropertyFilter) => {
    filterProperties(filter);
  };
  
  const handleClearFilters = () => {
    clearFilters();
  };
  
  const handleToggleSave = (propertyId: string) => {
    if (savedProperties.includes(propertyId)) {
      unsaveProperty(propertyId);
    } else {
      saveProperty(propertyId);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.card} />
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={Colors.neutral.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties, locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.neutral.gray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={Colors.neutral.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FilterBar 
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
      />
      
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onSave={() => handleToggleSave(item.id)}
            saved={savedProperties.includes(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters to find what you're looking for.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.background.card,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
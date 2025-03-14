import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { PropertyCard } from '@/components/PropertyCard';
import { usePropertyStore } from '@/store/property-store';
import { Property } from '@/types/property';

export default function SavedPropertiesScreen() {
  const router = useRouter();
  const { properties, savedProperties, unsaveProperty } = usePropertyStore();
  const [loading, setLoading] = useState(true);
  const [savedPropertiesList, setSavedPropertiesList] = useState<Property[]>([]);
  
  useEffect(() => {
    // Filter properties to get only the saved ones
    const savedProps = properties.filter(property => 
      savedProperties.includes(property.id)
    );
    setSavedPropertiesList(savedProps);
    setLoading(false);
  }, [properties, savedProperties]);
  
  const handleUnsave = (propertyId: string) => {
    unsaveProperty(propertyId);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.card} />
      <Stack.Screen 
        options={{
          title: 'Saved Properties',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.background.card,
          },
          headerTitleStyle: {
            color: Colors.text.primary,
            fontWeight: '600',
          },
        }}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      ) : (
        <FlatList
          data={savedPropertiesList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onSave={() => handleUnsave(item.id)}
              saved={true}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Heart size={64} color={Colors.neutral.lightGray} />
              <Text style={styles.emptyTitle}>No saved properties</Text>
              <Text style={styles.emptyText}>
                Properties you save will appear here for easy access.
              </Text>
            </View>
          }
        />
      )}
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
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
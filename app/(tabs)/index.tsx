import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Search, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';
import { PropertyCard } from '@/components/PropertyCard';
import { PointsCard } from '@/components/PointsCard';
import { PointsEarnedModal } from '@/components/PointsEarnedModal';
import { usePropertyStore } from '@/store/property-store';
import { useAuthStore } from '@/store/auth-store';
import { Property } from '@/types/property';

export default function HomeScreen() {
  const router = useRouter();
  const { properties, fetchProperties, savedProperties, saveProperty, unsaveProperty } = usePropertyStore();
  const { 
    user, 
    showPointsEarnedModal, 
    pointsEarnedAmount, 
    pointsEarnedReason, 
    hidePointsEarnedModal 
  } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  useEffect(() => {
    if (properties.length > 0) {
      // Get top properties for featured section
      setFeaturedProperties(properties.slice(0, 3));
      
      // Get recent properties
      const sorted = [...properties].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentProperties(sorted.slice(0, 5));
    }
  }, [properties]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  };
  
  const handleToggleSave = (propertyId: string) => {
    if (savedProperties.includes(propertyId)) {
      unsaveProperty(propertyId);
    } else {
      saveProperty(propertyId);
    }
  };
  
  const navigateToSearch = () => {
    router.push('/search');
  };
  
  const navigateToNotifications = () => {
    // Placeholder for notifications screen
    console.log('Navigate to notifications');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.primary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Guest'}</Text>
            <Text style={styles.subGreeting}>Find your perfect home</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={navigateToNotifications}
          >
            <Bell size={24} color={Colors.text.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={navigateToSearch}
        >
          <Search size={20} color={Colors.neutral.gray} />
          <Text style={styles.searchPlaceholder}>Search for properties...</Text>
        </TouchableOpacity>
        
        {user && (
          <PointsCard 
            points={user.points}
            onBuyPoints={() => router.push('/points')}
          />
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Properties</Text>
          <Text style={styles.sectionSubtitle}>Verified and handpicked properties</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <TouchableOpacity 
                  key={property.id}
                  style={styles.featuredItem}
                  onPress={() => router.push(`/property/${property.id}`)}
                >
                  <Image
                    source={{ uri: property.images[0] }}
                    style={styles.featuredImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.featuredGradient}
                  />
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredPrice}>
                      ₦{property.price.toLocaleString('en-NG')}/yr
                    </Text>
                    <Text style={styles.featuredTitle} numberOfLines={1}>
                      {property.title}
                    </Text>
                    <View style={styles.featuredLocation}>
                      <MapPin size={12} color={Colors.neutral.white} />
                      <Text style={styles.featuredLocationText} numberOfLines={1}>
                        {property.location.city}, {property.location.state}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyFeatured}>
                <Text style={styles.emptyText}>No featured properties available</Text>
              </View>
            )}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Properties</Text>
            <TouchableOpacity onPress={navigateToSearch}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.propertiesList}>
            {recentProperties.length > 0 ? (
              recentProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSave={() => handleToggleSave(property.id)}
                  saved={savedProperties.includes(property.id)}
                />
              ))
            ) : (
              <View style={styles.emptyRecent}>
                <Text style={styles.emptyTitle}>No verified properties yet</Text>
                <Text style={styles.emptyText}>
                  Be the first to add a verified property and earn Housify Points!
                </Text>
                <Button 
                  title="Add Property" 
                  onPress={() => router.push('/add-listing')}
                  style={styles.emptyButton}
                />
              </View>
            )}
          </View>
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

// Import Button component
import { Button } from '@/components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.main,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: Colors.neutral.gray,
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary.main,
    fontWeight: '500',
  },
  featuredContainer: {
    paddingRight: 16,
    gap: 16,
  },
  featuredItem: {
    width: 280,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral.white,
    marginBottom: 4,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.white,
    marginBottom: 4,
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredLocationText: {
    fontSize: 12,
    color: Colors.neutral.white,
    opacity: 0.8,
  },
  propertiesList: {
    marginBottom: 24,
  },
  emptyFeatured: {
    width: 280,
    height: 180,
    borderRadius: 16,
    backgroundColor: Colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyRecent: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
});
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Share
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Check, 
  AlertTriangle, 
  Phone, 
  Mail, 
  User,
  ChevronLeft,
  Share2,
  Heart,
  Flag,
  Coins
} from "lucide-react-native";
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PointsBadge } from '@/components/PointsBadge';
import { useListingsStore } from '@/store/listings-store';
import { useAuthStore } from '@/store/auth-store';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { 
    getListingById, 
    unlockListing, 
    unlockedListings, 
    saveListing, 
    unsaveListing, 
    isListingSaved 
  } = useListingsStore();
  const { user } = useAuthStore();
  
  const [listing, setListing] = useState(getListingById(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isSaved, setIsSaved] = useState(isListingSaved(id));
  
  const isUnlocked = unlockedListings.includes(id);
  const canUnlock = user?.housePoints >= (listing?.pointsToUnlock || 0);
  
  useEffect(() => {
    if (!listing) {
      Alert.alert('Error', 'Listing not found');
      router.back();
    }
  }, [listing, router]);
  
  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  const handleUnlock = async () => {
    if (!canUnlock) {
      Alert.alert(
        'Insufficient Points',
        `You don't have enough HP to unlock this listing.`,
        [
          {
            text: 'Buy Points',
            onPress: () => router.push('/buy-points'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }
    
    setIsUnlocking(true);
    const success = await unlockListing(id);
    setIsUnlocking(false);
    
    if (!success) {
      Alert.alert('Error', 'Failed to unlock listing. Please try again.');
    }
  };
  
  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: listing.title,
        message: `Check out this property: ${listing.title} in ${listing.location} for ₦${formatPrice(listing.price)}/year. ${listing.bedrooms} bedrooms, ${listing.bathrooms} bathrooms. #Housify`,
        url: Platform.OS === 'web' ? window.location.href : undefined
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('Shared with activity type:', result.activityType);
        } else {
          // shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share this listing');
      console.error('Share error:', error);
    }
  };
  
  const handleSave = () => {
    if (isSaved) {
      unsaveListing(id);
      setIsSaved(false);
      Alert.alert('Removed', 'Listing removed from saved listings');
    } else {
      saveListing(id);
      setIsSaved(true);
      Alert.alert('Saved', 'Listing saved successfully');
    }
  };
  
  const handleReport = () => {
    Alert.alert(
      'Report Listing',
      'Are you sure you want to report this listing?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          onPress: () => Alert.alert('Reported', 'Thank you for your feedback. We will review this listing.'),
          style: 'destructive',
        },
      ]
    );
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(newIndex);
          }}
        >
          {listing.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />
        
        <View style={styles.imageIndicators}>
          {listing.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentImageIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.badgeContainer}>
          <View style={[
            styles.verificationBadge,
            { backgroundColor: listing.verified ? colors.verified : colors.unverified }
          ]}>
            {listing.verified ? (
              <Check size={12} color="#fff" />
            ) : (
              <AlertTriangle size={12} color="#fff" />
            )}
            <Text style={styles.verificationText}>
              {listing.verified ? 'Verified' : 'Unverified'}
            </Text>
          </View>
        </View>
        
        <View style={styles.imageActions}>
          <TouchableOpacity style={styles.imageActionButton} onPress={handleShare}>
            <Share2 size={20} color={colors.background} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.imageActionButton,
              isSaved && styles.savedButton
            ]} 
            onPress={handleSave}
          >
            <Heart size={20} color={isSaved ? colors.secondary : colors.background} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.imageActionButton} onPress={handleReport}>
            <Flag size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.price}>₦{formatPrice(listing.price)}/year</Text>
        <Text style={styles.title}>{listing.title}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.location}>{listing.location}</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Bed size={20} color={colors.primary} />
            <Text style={styles.featureText}>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</Text>
          </View>
          
          <View style={styles.feature}>
            <Bath size={20} color={colors.primary} />
            <Text style={styles.featureText}>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</Text>
          </View>
          
          <View style={styles.feature}>
            <Home size={20} color={colors.primary} />
            <Text style={styles.featureText}>{listing.address.split(',')[0]}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {listing.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Check size={16} color={colors.primary} />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.address}>{listing.address}</Text>
          
          <View style={styles.mapPlaceholder}>
            <MapPin size={24} color={colors.text} />
            <Text style={styles.mapPlaceholderText}>Map View</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Landlord/Agent</Text>
          
          {isUnlocked ? (
            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <User size={20} color={colors.iconLight} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Name</Text>
                  <Text style={styles.contactValue}>{listing.landlordContact.name}</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Phone size={20} color={colors.iconLight} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{listing.landlordContact.phone}</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Mail size={20} color={colors.iconLight} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{listing.landlordContact.email}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.unlockContainer}>
              <View style={styles.unlockInfo}>
                <Text style={styles.unlockTitle}>Unlock Contact Details</Text>
                <Text style={styles.unlockDescription}>
                  Spend {listing.pointsToUnlock} HP to view landlord contact information
                </Text>
                
                <View style={styles.pointsInfo}>
                  <Text style={styles.pointsLabel}>Your Balance:</Text>
                  <PointsBadge 
                    amount={user?.housePoints || 0}
                    size="small"
                  />
                </View>
              </View>
              
              <Button
                title={`Unlock for ${listing.pointsToUnlock} HP`}
                onPress={handleUnlock}
                loading={isUnlocking}
                disabled={!canUnlock || isUnlocking}
                fullWidth
              />
              
              {!canUnlock && (
                <TouchableOpacity 
                  style={styles.buyPointsLink}
                  onPress={() => router.push('/buy-points')}
                >
                  <Text style={styles.buyPointsText}>Need more points? Buy now</Text>
                </TouchableOpacity>
              )}
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
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  image: {
    width,
    height: 300,
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: colors.background,
    width: 16,
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  imageActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  imageActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  savedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  detailsContainer: {
    padding: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: colors.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  contactContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  unlockContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  unlockInfo: {
    marginBottom: 16,
  },
  unlockTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  unlockDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  buyPointsLink: {
    alignItems: 'center',
    marginTop: 12,
  },
  buyPointsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});
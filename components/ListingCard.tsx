import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, MapPin, Bed, Bath, Check, AlertTriangle } from 'lucide-react-native';
import { Listing } from '@/types';
import { colors } from '@/constants/colors';

type ListingCardProps = {
  listing: Listing;
  compact?: boolean;
};

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;
const compactCardWidth = width * 0.7;

export const ListingCard = ({ listing, compact = false }: ListingCardProps) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/listing/${listing.id}`);
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <Pressable 
      style={[
        styles.container, 
        compact ? styles.compactContainer : null
      ]} 
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: listing.images[0] }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₦{formatPrice(listing.price)}</Text>
        </View>
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
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text style={styles.location} numberOfLines={1}>{listing.location}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Home size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{listing.address.split(',')[0]}</Text>
          </View>
          
          <View style={styles.detail}>
            <Bed size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}</Text>
          </View>
          
          <View style={styles.detail}>
            <Bath size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}</Text>
          </View>
        </View>
        
        <View style={styles.pointsContainer}>
          <Text style={[
            styles.pointsText,
            { color: listing.requiresPaidPoints ? colors.pPoints : colors.fPoints }
          ]}>
            {listing.pointsToUnlock} {listing.requiresPaidPoints ? 'P-Points' : 'F-Points'} to unlock
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  compactContainer: {
    width: compactCardWidth,
    marginRight: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  verificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  pointsContainer: {
    marginTop: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
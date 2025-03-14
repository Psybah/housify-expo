import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MapPin, Bed, Bath, Check } from 'lucide-react-native';
import { Property } from '@/types/property';
import { Colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/formatters';

interface PropertyCardProps {
  property: Property;
  onSave?: () => void;
  saved?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onSave,
  saved = false
}) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };
  
  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      android_ripple={{ color: Colors.neutral.lightGray }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <View style={styles.priceTag}>
          <Text style={styles.price}>{formatCurrency(property.price)}/yr</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Check size={12} color={Colors.neutral.white} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={Colors.neutral.gray} />
          <Text style={styles.location} numberOfLines={1}>
            {property.location.address}, {property.location.city}
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Bed size={14} color={Colors.neutral.darkGray} />
            <Text style={styles.featureText}>{property.features.bedrooms} Beds</Text>
          </View>
          
          <View style={styles.feature}>
            <Bath size={14} color={Colors.neutral.darkGray} />
            <Text style={styles.featureText}>{property.features.bathrooms} Baths</Text>
          </View>
          
          {property.features.size && (
            <View style={styles.feature}>
              <Text style={styles.featureText}>{property.features.size}m²</Text>
            </View>
          )}
        </View>
        
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>
            {property.pointsToUnlock} HP to unlock
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: Colors.neutral.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }
    }),
  },
  imageContainer: {
    height: 180,
    position: 'relative',
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
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  price: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 14,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 10,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  pointsContainer: {
    marginTop: 4,
  },
  pointsText: {
    fontSize: 12,
    color: Colors.accent.main,
    fontWeight: '500',
  },
});
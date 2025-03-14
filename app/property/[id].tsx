import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  Share
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Check, 
  AlertTriangle, 
  Heart, 
  Share2,
  ArrowLeft,
  Phone,
  MessageSquare,
  Lock,
  Mail,
  Clock,
  FileEdit
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PointsEarnedModal } from '@/components/PointsEarnedModal';
import { usePropertyStore } from '@/store/property-store';
import { useAuthStore } from '@/store/auth-store';
import { Property } from '@/types/property';
import { formatCurrency, formatDate } from '@/utils/formatters';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    properties, 
    draftProperties,
    savedProperties, 
    unlockedProperties,
    saveProperty, 
    unsaveProperty,
    unlockProperty
  } = usePropertyStore();
  const { 
    user, 
    isAuthenticated, 
    showPointsEarnedModal, 
    pointsEarnedAmount, 
    pointsEarnedReason, 
    hidePointsEarnedModal 
  } = useAuthStore();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      // First check in verified properties
      let foundProperty = properties.find(p => p.id === id);
      
      // If not found, check in draft properties
      if (!foundProperty && draftProperties.length > 0) {
        foundProperty = draftProperties.find(p => p.id === id);
      }
      
      if (foundProperty) {
        setProperty(foundProperty);
      }
    }
  }, [id, properties, draftProperties]);
  
  const handleToggleSave = () => {
    if (!property) return;
    
    if (savedProperties.includes(property.id)) {
      unsaveProperty(property.id);
    } else {
      saveProperty(property.id);
    }
  };
  
  const handleUnlock = async () => {
    if (!property) return;
    
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please log in to unlock landlord contact details.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/profile') }
        ]
      );
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await unlockProperty(property.id);
      
      if (success) {
        Alert.alert(
          'Contact Unlocked',
          'You can now contact the landlord directly.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Insufficient Points',
          `You need ${property.pointsToUnlock} HP to unlock this contact. Would you like to buy more points?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Buy Points', onPress: () => router.push('/points') }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to unlock contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (!property) return;
    
    try {
      const shareMessage = `Check out this property on Housify: ${property.title}

Price: ${formatCurrency(property.price)}/year
Location: ${property.location.city}, ${property.location.state}

${property.description.substring(0, 100)}...`;
      
      if (Platform.OS === 'web') {
        // Web implementation using navigator.share if available
        if (navigator.share) {
          await navigator.share({
            title: property.title,
            text: shareMessage,
            // In a real app, this would be a deep link to the property
            url: `https://housify.example.com/property/${property.id}`,
          });
        } else {
          // Fallback for browsers that don't support navigator.share
          Alert.alert(
            'Share',
            'Copy this link to share:',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Native implementation
        const result = await Share.share({
          message: shareMessage,
          // On iOS, you can set a separate title
          title: property.title,
        });
        
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared with activity type of result.activityType
          } else {
            // Shared
          }
        } else if (result.action === Share.dismissedAction) {
          // Dismissed
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share this property');
    }
  };
  
  const handleContact = (method: 'call' | 'message' | 'email') => {
    if (!property || !property.landlordContact) return;
    
    switch (method) {
      case 'call':
        if (Platform.OS === 'web') {
          window.location.href = `tel:${property.landlordContact.phone}`;
        } else {
          // In a real app, you would use Linking.openURL
          Alert.alert('Call', `Calling ${property.landlordContact.name} at ${property.landlordContact.phone}`);
        }
        break;
      case 'message':
        if (Platform.OS === 'web') {
          window.location.href = `sms:${property.landlordContact.phone}`;
        } else {
          // In a real app, you would use Linking.openURL
          Alert.alert('Message', `Sending message to ${property.landlordContact.name} at ${property.landlordContact.phone}`);
        }
        break;
      case 'email':
        if (Platform.OS === 'web') {
          window.location.href = `mailto:${property.landlordContact.email}?subject=Inquiry about your property on Housify`;
        } else {
          // In a real app, you would use Linking.openURL
          Alert.alert('Email', `Sending email to ${property.landlordContact.name} at ${property.landlordContact.email}`);
        }
        break;
    }
  };
  
  const handleBackPress = () => {
    router.back();
  };
  
  if (!property) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading property details...</Text>
      </View>
    );
  }
  
  const isUnlocked = unlockedProperties.includes(property.id);
  const isSaved = savedProperties.includes(property.id);
  const isDraft = property.status === 'draft' || property.status === 'pending-verification';
  
  // Only show verified properties to other users
  const canView = property.verified || (user && property.submittedBy === user.id);
  
  if (!canView) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background.primary} />
        <View style={styles.notFoundContainer}>
          <AlertTriangle size={64} color={Colors.status.warning} />
          <Text style={styles.notFoundTitle}>Property Not Available</Text>
          <Text style={styles.notFoundText}>
            This property is not yet verified and cannot be viewed.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.notFoundButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Stack.Screen 
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={Colors.neutral.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              {!isDraft && (
                <>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleToggleSave}
                    activeOpacity={0.7}
                  >
                    <Heart 
                      size={24} 
                      color={Colors.neutral.white}
                      fill={isSaved ? Colors.accent.main : 'none'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleShare}
                    activeOpacity={0.7}
                  >
                    <Share2 size={24} color={Colors.neutral.white} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / width);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.imageGradient}
          />
          
          <View style={styles.imagePagination}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentImageIndex === index && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
          
          <View style={styles.priceTag}>
            <Text style={styles.price}>{formatCurrency(property.price)}/yr</Text>
          </View>
          
          {isDraft ? (
            <View style={[styles.verifiedBadge, styles.draftBadge]}>
              {property.status === 'draft' ? (
                <>
                  <FileEdit size={14} color={Colors.neutral.white} />
                  <Text style={styles.verifiedText}>Draft</Text>
                </>
              ) : (
                <>
                  <Clock size={14} color={Colors.neutral.white} />
                  <Text style={styles.verifiedText}>Pending Verification</Text>
                </>
              )}
            </View>
          ) : (
            <View style={styles.verifiedBadge}>
              <Check size={14} color={Colors.neutral.white} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{property.title}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.neutral.gray} />
            <Text style={styles.location}>
              {property.location.address}, {property.location.city}, {property.location.state}
            </Text>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Bed size={20} color={Colors.primary.main} />
              </View>
              <View>
                <Text style={styles.featureValue}>{property.features.bedrooms}</Text>
                <Text style={styles.featureLabel}>Bedrooms</Text>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Bath size={20} color={Colors.primary.main} />
              </View>
              <View>
                <Text style={styles.featureValue}>{property.features.bathrooms}</Text>
                <Text style={styles.featureLabel}>Bathrooms</Text>
              </View>
            </View>
            
            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Home size={20} color={Colors.primary.main} />
              </View>
              <View>
                <Text style={styles.featureValue}>{property.features.size || '-'}</Text>
                <Text style={styles.featureLabel}>Sq. m</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>
          
          {property.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {property.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Check size={16} color={Colors.primary.main} />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Property Type</Text>
                <Text style={styles.detailValue}>
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>
                  {property.status === 'available' ? 'Available' : 
                   property.status === 'rented' ? 'Rented' :
                   property.status === 'draft' ? 'Draft' : 'Pending Verification'}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Furnished</Text>
                <Text style={styles.detailValue}>
                  {property.features.furnished ? 'Yes' : 'No'}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Listed On</Text>
                <Text style={styles.detailValue}>{formatDate(property.createdAt)}</Text>
              </View>
            </View>
          </View>
          
          {isDraft ? (
            <View style={styles.draftInfoContainer}>
              <View style={styles.draftInfoIconContainer}>
                <AlertTriangle size={24} color={Colors.neutral.white} />
              </View>
              <Text style={styles.draftInfoTitle}>
                {property.status === 'draft' ? 'Draft Listing' : 'Pending Verification'}
              </Text>
              <Text style={styles.draftInfoText}>
                {property.status === 'draft' 
                  ? 'This property is saved as a draft and is only visible to you. Submit it for verification to make it available to others.'
                  : 'This property is pending verification by our team. Once verified, it will be visible to other users and you will earn points.'}
              </Text>
              {property.status === 'draft' && (
                <Button
                  title="Submit for Verification"
                  onPress={() => Alert.alert('Submit', 'This would submit the property for verification.')}
                  fullWidth
                  style={styles.draftInfoButton}
                />
              )}
            </View>
          ) : !isUnlocked ? (
            <View style={styles.unlockContainer}>
              <View style={styles.lockIconContainer}>
                <Lock size={24} color={Colors.neutral.white} />
              </View>
              <Text style={styles.unlockTitle}>Contact Details Locked</Text>
              <Text style={styles.unlockText}>
                Unlock this property to view landlord contact details and get in touch directly.
              </Text>
              <Button
                title={`Unlock for ${property.pointsToUnlock} HP`}
                onPress={handleUnlock}
                fullWidth
                loading={loading}
                style={styles.unlockButton}
              />
            </View>
          ) : (
            <View style={styles.contactContainer}>
              <Text style={styles.contactTitle}>Contact Landlord</Text>
              <Text style={styles.contactText}>
                You have unlocked this property. Contact the landlord directly.
              </Text>
              
              {property.landlordContact ? (
                <View style={styles.landlordDetails}>
                  <View style={styles.landlordDetail}>
                    <Text style={styles.landlordLabel}>Name:</Text>
                    <Text style={styles.landlordValue}>{property.landlordContact.name}</Text>
                  </View>
                  <View style={styles.landlordDetail}>
                    <Text style={styles.landlordLabel}>Phone:</Text>
                    <Text style={styles.landlordValue}>{property.landlordContact.phone}</Text>
                  </View>
                  <View style={styles.landlordDetail}>
                    <Text style={styles.landlordLabel}>Email:</Text>
                    <Text style={styles.landlordValue}>{property.landlordContact.email}</Text>
                  </View>
                </View>
              ) : null}
              
              <View style={styles.contactButtons}>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContact('call')}
                >
                  <View style={[styles.contactButtonIcon, { backgroundColor: Colors.status.success + '20' }]}>
                    <Phone size={24} color={Colors.status.success} />
                  </View>
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContact('message')}
                >
                  <View style={[styles.contactButtonIcon, { backgroundColor: Colors.primary.main + '20' }]}>
                    <MessageSquare size={24} color={Colors.primary.main} />
                  </View>
                  <Text style={styles.contactButtonText}>Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContact('email')}
                >
                  <View style={[styles.contactButtonIcon, { backgroundColor: Colors.accent.main + '20' }]}>
                    <Mail size={24} color={Colors.accent.main} />
                  </View>
                  <Text style={styles.contactButtonText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  notFoundButton: {
    width: '80%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  headerActions: {
    flexDirection: 'row',
    marginRight: 16,
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
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
    height: 100,
  },
  imagePagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: Colors.neutral.white,
    width: 16,
  },
  priceTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  price: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.status.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  draftBadge: {
    backgroundColor: Colors.neutral.gray,
  },
  verifiedText: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  feature: {
    alignItems: 'center',
    gap: 8,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  featureLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text.secondary,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.light + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  amenityText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  detailsContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightGray,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  draftInfoContainer: {
    backgroundColor: Colors.status.warning + '10',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.status.warning,
  },
  draftInfoIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.status.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  draftInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  draftInfoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  draftInfoButton: {
    marginTop: 8,
  },
  unlockContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  lockIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  unlockTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  unlockText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  unlockButton: {
    marginTop: 8,
  },
  contactContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  landlordDetails: {
    backgroundColor: Colors.primary.light + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  landlordDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  landlordLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    width: 60,
  },
  landlordValue: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 12,
  },
  contactButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
});
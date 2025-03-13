import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  FileText, 
  User, 
  Phone, 
  Mail,
  Plus,
  Check,
  X,
  Image as ImageIcon,
  Info,
  Coins
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useListingsStore } from '@/store/listings-store';
import { useAuthStore } from '@/store/auth-store';
import { usePointsStore } from '@/store/points-store';

export default function AddListingScreen() {
  const router = useRouter();
  const { addListing, isLoading } = useListingsStore();
  const { user } = useAuthStore();
  const { addTransaction } = usePointsStore();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [landlordName, setLandlordName] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');
  const [landlordEmail, setLandlordEmail] = useState('');
  const [allowVerification, setAllowVerification] = useState(true);
  const [requiresPaidPoints, setRequiresPaidPoints] = useState(false);
  const [pointsToUnlock, setPointsToUnlock] = useState('100');
  
  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Available amenities
  const availableAmenities = [
    'Parking', 'Pool', 'Gym', 'Security', 'Internet', 
    'Furnished', 'Laundry', 'Garden', 'Garage', 'Smart Home'
  ];
  
  const handleAddImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Image picking is not available on web');
      // Add placeholder image for web demo
      setImages([...images, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa']);
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';
    if (!location) newErrors.location = 'Location is required';
    if (!address) newErrors.address = 'Address is required';
    if (!bedrooms) newErrors.bedrooms = 'Number of bedrooms is required';
    if (!bathrooms) newErrors.bathrooms = 'Number of bathrooms is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    if (!landlordName) newErrors.landlordName = 'Landlord name is required';
    if (!landlordPhone) newErrors.landlordPhone = 'Landlord phone is required';
    if (!landlordEmail) newErrors.landlordEmail = 'Landlord email is required';
    if (!pointsToUnlock) newErrors.pointsToUnlock = 'Points to unlock is required';
    
    // Check if user is trying to use their own phone number as landlord
    if (landlordPhone === user?.phone) {
      newErrors.landlordPhone = 'You cannot use your own phone number as landlord contact';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const newListing = await addListing({
        title,
        description,
        price: parseInt(price),
        location,
        address,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa'],
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        amenities,
        verified: false, // Will be verified later by admin
        landlordContact: {
          name: landlordName,
          phone: landlordPhone,
          email: landlordEmail,
        },
        allowVerification,
        pointsToUnlock: parseInt(pointsToUnlock),
        requiresPaidPoints,
      });
      
      // Add transaction for points earned
      await addTransaction({
        userId: user?.id || '',
        amount: allowVerification ? 150 : 50, // More points if verification is allowed
        type: 'earned',
        description: `Added listing: ${title}`,
        pointsType: 'free',
        relatedListingId: newListing.id,
      });
      
      Alert.alert(
        'Success',
        'Your listing has been submitted for approval. You earned ' + 
        (allowVerification ? '150' : '50') + ' F-Points!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Add listing error:', error);
      Alert.alert('Error', 'Failed to add listing. Please try again.');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Listing</Text>
          <Text style={styles.subtitle}>Help others find homes and earn points</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Input
            label="Title"
            placeholder="e.g. Modern Apartment in Downtown"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
            icon={<Home size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Description"
            placeholder="Describe the property..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            error={errors.description}
            icon={<FileText size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Price (₦)"
            placeholder="e.g. 250000"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            error={errors.price}
            icon={<DollarSign size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Location"
            placeholder="e.g. Downtown"
            value={location}
            onChangeText={setLocation}
            error={errors.location}
            icon={<MapPin size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Full Address"
            placeholder="e.g. 123 Main St, Downtown"
            value={address}
            onChangeText={setAddress}
            error={errors.address}
            icon={<MapPin size={20} color={colors.textSecondary} />}
          />
          
          <View style={styles.rowInputs}>
            <Input
              label="Bedrooms"
              placeholder="e.g. 2"
              value={bedrooms}
              onChangeText={setBedrooms}
              keyboardType="numeric"
              error={errors.bedrooms}
              style={styles.halfInput}
              icon={<Bed size={20} color={colors.textSecondary} />}
            />
            
            <Input
              label="Bathrooms"
              placeholder="e.g. 2"
              value={bathrooms}
              onChangeText={setBathrooms}
              keyboardType="numeric"
              error={errors.bathrooms}
              style={styles.halfInput}
              icon={<Bath size={20} color={colors.textSecondary} />}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageItem}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <X size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addImageButton}
              onPress={handleAddImage}
            >
              <ImageIcon size={24} color={colors.textSecondary} />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          </View>
          
          {errors.images && (
            <Text style={styles.errorText}>{errors.images}</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          
          <View style={styles.amenitiesContainer}>
            {availableAmenities.map((amenity) => (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.amenityButton,
                  amenities.includes(amenity) && styles.amenityButtonActive
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                {amenities.includes(amenity) && (
                  <Check size={14} color={colors.text} style={styles.amenityIcon} />
                )}
                <Text 
                  style={[
                    styles.amenityText,
                    amenities.includes(amenity) && styles.amenityTextActive
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Landlord Contact</Text>
          
          <Input
            label="Landlord Name"
            placeholder="e.g. John Doe"
            value={landlordName}
            onChangeText={setLandlordName}
            error={errors.landlordName}
            icon={<User size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Landlord Phone"
            placeholder="e.g. +1234567890"
            value={landlordPhone}
            onChangeText={setLandlordPhone}
            keyboardType="phone-pad"
            error={errors.landlordPhone}
            icon={<Phone size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Landlord Email"
            placeholder="e.g. john@example.com"
            value={landlordEmail}
            onChangeText={setLandlordEmail}
            keyboardType="email-address"
            error={errors.landlordEmail}
            icon={<Mail size={20} color={colors.textSecondary} />}
          />
          
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Allow Verification Call</Text>
              <Text style={styles.switchDescription}>
                Let Housify call the landlord to verify this listing (+100 bonus points)
              </Text>
            </View>
            <Switch
              value={allowVerification}
              onValueChange={setAllowVerification}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Settings</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Require Paid Points</Text>
              <Text style={styles.switchDescription}>
                Users will need to spend P-Points to unlock this listing
              </Text>
            </View>
            <Switch
              value={requiresPaidPoints}
              onValueChange={setRequiresPaidPoints}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          
          <Input
            label="Points to Unlock"
            placeholder="e.g. 100"
            value={pointsToUnlock}
            onChangeText={setPointsToUnlock}
            keyboardType="numeric"
            error={errors.pointsToUnlock}
            icon={<Coins size={20} color={colors.textSecondary} />}
          />
          
          <View style={styles.infoBox}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Your listing will be reviewed by our team before it's published. You'll earn points once it's approved.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
          
          <Button
            title="Submit Listing"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageItem: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityButtonActive: {
    backgroundColor: colors.primary,
  },
  amenityIcon: {
    marginRight: 4,
  },
  amenityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amenityTextActive: {
    color: colors.text,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
  },
});
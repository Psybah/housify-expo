import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  Image,
  Platform,
  Share
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  DollarSign, 
  FileText, 
  Phone, 
  Mail, 
  User,
  Image as ImageIcon,
  Plus,
  Check,
  Info,
  X,
  Share2
} from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuthStore } from '@/store/auth-store';
import { useListingsStore } from '@/store/listings-store';
import { usePointsStore } from '@/store/points-store';

export default function AddListingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addListing, isLoading } = useListingsStore();
  const { addTransaction } = usePointsStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [allowVerification, setAllowVerification] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  // Landlord contact details
  const [landlordName, setLandlordName] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');
  const [landlordEmail, setLandlordEmail] = useState('');
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Nigerian-specific amenities
  const availableAmenities = [
    'Prepaid Meter',
    'Borehole Water',
    'POP Ceiling',
    'Tiled Floor',
    'Burglary Proof',
    'Generator',
    'CCTV',
    'Estate Security',
    'Inverter System',
    'Boys Quarters',
    'Parking Space',
    'Swimming Pool',
    'Gym',
    'Satellite TV',
    'Internet'
  ];
  
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };
  
  const handleNext = () => {
    if (currentStep === 1) {
      if (!title || !description || !price || !location || !address) {
        Alert.alert('Missing Information', 'Please fill in all required fields');
        return;
      }
      
      if (isNaN(Number(price)) || Number(price) <= 0) {
        Alert.alert('Invalid Price', 'Please enter a valid price');
        return;
      }
      
      // Check if price is within reasonable range for Nigeria
      if (Number(price) > 2000000) {
        Alert.alert('Price Too High', 'The maximum allowed price is ₦2,000,000');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!bedrooms || !bathrooms) {
        Alert.alert('Missing Information', 'Please specify the number of bedrooms and bathrooms');
        return;
      }
      
      if (isNaN(Number(bedrooms)) || Number(bedrooms) <= 0 || 
          isNaN(Number(bathrooms)) || Number(bathrooms) <= 0) {
        Alert.alert('Invalid Input', 'Please enter valid numbers for bedrooms and bathrooms');
        return;
      }
      
      if (images.length === 0) {
        Alert.alert('No Images', 'Please upload at least one image of the property');
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };
  
  const handleSubmit = async () => {
    if (!landlordName || !landlordPhone || !landlordEmail) {
      Alert.alert('Missing Information', 'Please provide all landlord contact details');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(landlordEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    // Validate Nigerian phone number format
    const phoneRegex = /^\+234[0-9]{10}$/;
    if (!phoneRegex.test(landlordPhone)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid Nigerian phone number (format: +2341234567890)');
      return;
    }
    
    // Check if user is trying to use their own contact details
    if (landlordPhone === user?.phone || landlordEmail === user?.email) {
      Alert.alert('Invalid Contact', 'You cannot use your own contact details as the landlord');
      return;
    }
    
    try {
      const newListing = {
        title,
        description,
        price: Number(price),
        location,
        address,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        amenities,
        allowVerification,
        landlordContact: {
          name: landlordName,
          phone: landlordPhone,
          email: landlordEmail
        },
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
        ],
        verified: false,
        pointsToUnlock: 100,
      };
      
      const listing = await addListing(newListing);
      
      // Add transaction for listing points
      await addTransaction({
        userId: user!.id,
        amount: 50,
        type: 'earned',
        description: 'Added new listing',
      });
      
      if (allowVerification) {
        // Add transaction for verification bonus (will be processed when verified)
        await addTransaction({
          userId: user!.id,
          amount: 150,
          type: 'earned',
          description: 'Verification bonus (pending)',
        });
      }
      
      Alert.alert(
        'Listing Submitted',
        'Your listing has been submitted successfully and is pending review. You have earned 50 HP, with 150 more HP pending verification.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          }
        ]
      );
    } catch (error) {
      console.error('Error adding listing:', error);
      Alert.alert('Error', 'Failed to submit listing. Please try again.');
    }
  };
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prevImages => {
        const combined = [...prevImages, ...newImages];
        // Limit to 5 images
        return combined.slice(0, 5);
      });
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  
  const handleShareListing = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Share', 'Sharing is not available on web');
      return;
    }
    
    try {
      const message = `Check out this property: ${title} in ${location} for ₦${price}`;
      await Share.share({
        message,
        title: "Share Property Listing",
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share listing');
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View 
            key={index}
            style={[
              styles.stepDot,
              currentStep === index + 1 && styles.activeStepDot
            ]}
          />
        ))}
      </View>
    );
  };
  
  const renderStep1 = () => {
    return (
      <>
        <Text style={styles.stepTitle}>Basic Information</Text>
        
        <Input
          label="Title"
          placeholder="e.g. Spacious 2 Bedroom Flat in Lekki"
          value={title}
          onChangeText={setTitle}
          icon={<Home size={20} color={colors.primary} />}
        />
        
        <Input
          label="Description"
          placeholder="Describe the property..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          icon={<FileText size={20} color={colors.primary} />}
        />
        
        <Input
          label="Price (₦)"
          placeholder="e.g. 850000"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          icon={<DollarSign size={20} color={colors.primary} />}
        />
        
        <Input
          label="Location"
          placeholder="e.g. Lekki, Lagos"
          value={location}
          onChangeText={setLocation}
          icon={<MapPin size={20} color={colors.primary} />}
        />
        
        <Input
          label="Full Address"
          placeholder="Enter the complete address"
          value={address}
          onChangeText={setAddress}
          icon={<MapPin size={20} color={colors.primary} />}
        />
      </>
    );
  };
  
  const renderStep2 = () => {
    return (
      <>
        <Text style={styles.stepTitle}>Property Details</Text>
        
        <View style={styles.rowInputs}>
          <View style={styles.halfInput}>
            <Input
              label="Bedrooms"
              placeholder="e.g. 2"
              value={bedrooms}
              onChangeText={setBedrooms}
              keyboardType="numeric"
              icon={<Bed size={20} color={colors.primary} />}
            />
          </View>
          
          <View style={styles.halfInput}>
            <Input
              label="Bathrooms"
              placeholder="e.g. 1"
              value={bathrooms}
              onChangeText={setBathrooms}
              keyboardType="numeric"
              icon={<Bath size={20} color={colors.primary} />}
            />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {availableAmenities.map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.amenityItem,
                amenities.includes(amenity) && styles.selectedAmenity
              ]}
              onPress={() => toggleAmenity(amenity)}
            >
              {amenities.includes(amenity) && (
                <Check size={16} color={colors.iconLight} style={styles.amenityCheck} />
              )}
              <Text style={[
                styles.amenityText,
                amenities.includes(amenity) && styles.selectedAmenityText
              ]}>
                {amenity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.imageUploadSection}>
          <Text style={styles.sectionTitle}>Upload Images</Text>
          <Text style={styles.sectionDescription}>
            Add photos of the property to attract more interest (max 5)
          </Text>
          
          {/* Image preview section */}
          {images.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imagePreviewScroll}
              contentContainerStyle={styles.imagePreviewContainer}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          
          <TouchableOpacity 
            style={[
              styles.uploadButton,
              images.length >= 5 && styles.uploadButtonDisabled
            ]}
            onPress={pickImage}
            disabled={images.length >= 5}
          >
            <ImageIcon size={24} color={images.length >= 5 ? colors.textSecondary : colors.primary} />
            <Text style={[
              styles.uploadText,
              images.length >= 5 && styles.uploadTextDisabled
            ]}>
              {images.length === 0 ? 'Upload Images' : 'Add More Images'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.uploadNote}>
            {images.length} of 5 images uploaded
          </Text>
          
          {images.length > 0 && (
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShareListing}
            >
              <Share2 size={16} color={colors.primary} />
              <Text style={styles.shareButtonText}>Share Preview</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };
  
  const renderStep3 = () => {
    return (
      <>
        <Text style={styles.stepTitle}>Landlord Contact Details</Text>
        
        <Input
          label="Landlord Name"
          placeholder="Enter landlord's full name"
          value={landlordName}
          onChangeText={setLandlordName}
          icon={<User size={20} color={colors.primary} />}
        />
        
        <Input
          label="Landlord Phone"
          placeholder="e.g. +2348012345678"
          value={landlordPhone}
          onChangeText={setLandlordPhone}
          keyboardType="phone-pad"
          icon={<Phone size={20} color={colors.primary} />}
        />
        
        <Input
          label="Landlord Email"
          placeholder="Enter landlord's email address"
          value={landlordEmail}
          onChangeText={setLandlordEmail}
          keyboardType="email-address"
          icon={<Mail size={20} color={colors.primary} />}
        />
        
        <View style={styles.verificationContainer}>
          <View style={styles.verificationHeader}>
            <Text style={styles.verificationTitle}>Allow Verification Call</Text>
            <Switch
              value={allowVerification}
              onValueChange={setAllowVerification}
              trackColor={{ false: colors.card, true: colors.primary }}
              thumbColor={colors.iconLight}
            />
          </View>
          
          <View style={styles.infoBox}>
            <View style={styles.infoIconContainer}>
              <Info size={16} color={colors.iconLight} />
            </View>
            <Text style={styles.infoText}>
              Allowing our team to verify this listing with the landlord will mark it as verified and earn you extra points. Verified listings get more visibility.
            </Text>
          </View>
        </View>
        
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsTitle}>Points You'll Earn:</Text>
          
          <View style={styles.pointsRow}>
            <View style={styles.pointsIconContainer}>
              <Check size={16} color={colors.verified} />
            </View>
            <Text style={styles.pointsText}>50 HP for submitting a listing</Text>
          </View>
          
          {allowVerification && (
            <View style={styles.pointsRow}>
              <View style={styles.pointsIconContainer}>
                <Check size={16} color={colors.verified} />
              </View>
              <Text style={styles.pointsText}>+150 bonus HP if verified</Text>
            </View>
          )}
        </View>
      </>
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepIndicator()}
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.footerButton}
          />
          
          {currentStep < totalSteps ? (
            <Button
              title="Next"
              onPress={handleNext}
              style={styles.footerButton}
            />
          ) : (
            <Button
              title={isLoading ? "Submitting..." : "Submit Listing"}
              onPress={handleSubmit}
              style={styles.footerButton}
              disabled={isLoading}
              loading={isLoading}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.card,
    marginHorizontal: 4,
  },
  activeStepDot: {
    backgroundColor: colors.primary,
    width: 20,
  },
  stepTitle: {
    fontSize: 20,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
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
  selectedAmenity: {
    backgroundColor: colors.primary,
  },
  amenityCheck: {
    marginRight: 4,
  },
  amenityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedAmenityText: {
    color: colors.iconLight,
  },
  imageUploadSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  imagePreviewScroll: {
    marginVertical: 16,
  },
  imagePreviewContainer: {
    paddingRight: 16,
  },
  imagePreview: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  previewImage: {
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    padding: 16,
    marginTop: 8,
  },
  uploadButtonDisabled: {
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  uploadText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  uploadTextDisabled: {
    color: colors.textSecondary,
  },
  uploadNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(2, 43, 96, 0.1)',
  },
  shareButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  verificationContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(2, 43, 96, 0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  pointsInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  pointsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pointsIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  pointsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
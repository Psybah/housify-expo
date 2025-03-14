import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, MapPin, Bed, Bath, Home, Plus, X, User, Phone, Mail } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { usePropertyStore } from '@/store/property-store';
import { useAuthStore } from '@/store/auth-store';
import { PropertyType } from '@/types/property';

export default function AddListingScreen() {
  const router = useRouter();
  const { submitProperty } = usePropertyStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  
  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState('');
  
  const [state, setState] = useState('');
  const [stateError, setStateError] = useState('');
  
  const [bedrooms, setBedrooms] = useState('');
  const [bedroomsError, setBedroomsError] = useState('');
  
  const [bathrooms, setBathrooms] = useState('');
  const [bathroomsError, setBathroomsError] = useState('');
  
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  
  const [images, setImages] = useState<string[]>([]);
  const [imagesError, setImagesError] = useState('');
  
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  
  // Landlord contact details
  const [landlordName, setLandlordName] = useState('');
  const [landlordNameError, setLandlordNameError] = useState('');
  
  const [landlordPhone, setLandlordPhone] = useState('');
  const [landlordPhoneError, setLandlordPhoneError] = useState('');
  
  const [landlordEmail, setLandlordEmail] = useState('');
  const [landlordEmailError, setLandlordEmailError] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const propertyTypes: { label: string; value: PropertyType }[] = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Duplex', value: 'duplex' },
    { label: 'Bungalow', value: 'bungalow' },
    { label: 'Self-contained', value: 'self-contained' },
  ];
  
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
        return;
      }
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
      setImagesError('');
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const addAmenity = () => {
    if (newAmenity.trim() !== '') {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };
  
  const removeAmenity = (index: number) => {
    const newAmenities = [...amenities];
    newAmenities.splice(index, 1);
    setAmenities(newAmenities);
  };
  
  const validateForm = () => {
    let isValid = true;
    
    // Reset all errors
    setTitleError('');
    setDescriptionError('');
    setPriceError('');
    setAddressError('');
    setCityError('');
    setStateError('');
    setBedroomsError('');
    setBathroomsError('');
    setImagesError('');
    setLandlordNameError('');
    setLandlordPhoneError('');
    setLandlordEmailError('');
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Property title is required');
      isValid = false;
    } else if (title.length < 10) {
      setTitleError('Title should be at least 10 characters');
      isValid = false;
    }
    
    // Validate description
    if (!description.trim()) {
      setDescriptionError('Property description is required');
      isValid = false;
    } else if (description.length < 30) {
      setDescriptionError('Description should be at least 30 characters');
      isValid = false;
    }
    
    // Validate price
    if (!price.trim()) {
      setPriceError('Price is required');
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      setPriceError('Please enter a valid price');
      isValid = false;
    }
    
    // Validate address
    if (!address.trim()) {
      setAddressError('Address is required');
      isValid = false;
    }
    
    // Validate city
    if (!city.trim()) {
      setCityError('City is required');
      isValid = false;
    }
    
    // Validate state
    if (!state.trim()) {
      setStateError('State is required');
      isValid = false;
    }
    
    // Validate bedrooms
    if (!bedrooms.trim()) {
      setBedroomsError('Number of bedrooms is required');
      isValid = false;
    } else if (isNaN(Number(bedrooms)) || Number(bedrooms) < 1) {
      setBedroomsError('Please enter a valid number of bedrooms');
      isValid = false;
    }
    
    // Validate bathrooms
    if (!bathrooms.trim()) {
      setBathroomsError('Number of bathrooms is required');
      isValid = false;
    } else if (isNaN(Number(bathrooms)) || Number(bathrooms) < 1) {
      setBathroomsError('Please enter a valid number of bathrooms');
      isValid = false;
    }
    
    // Validate images
    if (images.length === 0) {
      setImagesError('At least one property image is required');
      isValid = false;
    }
    
    // Validate landlord name
    if (!landlordName.trim()) {
      setLandlordNameError('Landlord name is required');
      isValid = false;
    }
    
    // Validate landlord phone
    if (!landlordPhone.trim()) {
      setLandlordPhoneError('Landlord phone number is required');
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(landlordPhone.replace(/\s/g, ''))) {
      setLandlordPhoneError('Please enter a valid phone number');
      isValid = false;
    }
    
    // Validate landlord email
    if (!landlordEmail.trim()) {
      setLandlordEmailError('Landlord email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(landlordEmail)) {
      setLandlordEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to submit a property listing.');
      router.push('/profile');
      return;
    }
    
    if (!validateForm()) {
      // Scroll to the top to show errors
      Alert.alert('Form Error', 'Please fix the errors in the form before submitting.');
      return;
    }
    
    setLoading(true);
    
    try {
      const propertyId = await submitProperty({
        title,
        description,
        price: parseFloat(price),
        location: {
          address,
          city,
          state
        },
        features: {
          bedrooms: parseInt(bedrooms),
          bathrooms: parseInt(bathrooms),
          furnished: false
        },
        amenities,
        images,
        type: propertyType,
        submittedBy: user?.id,
        landlordContact: {
          name: landlordName,
          phone: landlordPhone,
          email: landlordEmail
        }
      });
      
      Alert.alert(
        'Listing Submitted',
        'Your property has been saved as a draft and will be reviewed by our team. You will earn points once it is verified.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Reset form and navigate to home
              setTitle('');
              setDescription('');
              setPrice('');
              setAddress('');
              setCity('');
              setState('');
              setBedrooms('');
              setBathrooms('');
              setPropertyType('apartment');
              setImages([]);
              setAmenities([]);
              setLandlordName('');
              setLandlordPhone('');
              setLandlordEmail('');
              router.push('/');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit property. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.card} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Property</Text>
          <Text style={styles.subtitle}>
            Submit a property for verification and earn points when approved
          </Text>
        </View>
        
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          
          <Input
            label="Property Title"
            placeholder="e.g. Modern 3 Bedroom Apartment"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (text.trim()) setTitleError('');
            }}
            error={titleError}
            required
          />
          
          <Input
            label="Description"
            placeholder="Describe the property..."
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (text.trim()) setDescriptionError('');
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.textArea}
            error={descriptionError}
            required
          />
          
          <Input
            label="Rent Price (₦/year)"
            placeholder="e.g. 1500000"
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              if (text.trim() && !isNaN(Number(text))) setPriceError('');
            }}
            keyboardType="numeric"
            leftIcon={<Text style={styles.currencyIcon}>₦</Text>}
            error={priceError}
            required
          />
          
          <Text style={styles.sectionTitle}>Location</Text>
          
          <Input
            label="Address"
            placeholder="Street address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              if (text.trim()) setAddressError('');
            }}
            leftIcon={<MapPin size={18} color={Colors.neutral.gray} />}
            error={addressError}
            required
          />
          
          <View style={styles.row}>
            <Input
              label="City"
              placeholder="e.g. Lekki"
              value={city}
              onChangeText={(text) => {
                setCity(text);
                if (text.trim()) setCityError('');
              }}
              containerStyle={styles.halfInput}
              error={cityError}
              required
            />
            
            <Input
              label="State"
              placeholder="e.g. Lagos"
              value={state}
              onChangeText={(text) => {
                setState(text);
                if (text.trim()) setStateError('');
              }}
              containerStyle={styles.halfInput}
              error={stateError}
              required
            />
          </View>
          
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.row}>
            <Input
              label="Bedrooms"
              placeholder="e.g. 3"
              value={bedrooms}
              onChangeText={(text) => {
                setBedrooms(text);
                if (text.trim() && !isNaN(Number(text))) setBedroomsError('');
              }}
              keyboardType="numeric"
              leftIcon={<Bed size={18} color={Colors.neutral.gray} />}
              containerStyle={styles.halfInput}
              error={bedroomsError}
              required
            />
            
            <Input
              label="Bathrooms"
              placeholder="e.g. 2"
              value={bathrooms}
              onChangeText={(text) => {
                setBathrooms(text);
                if (text.trim() && !isNaN(Number(text))) setBathroomsError('');
              }}
              keyboardType="numeric"
              leftIcon={<Bath size={18} color={Colors.neutral.gray} />}
              containerStyle={styles.halfInput}
              error={bathroomsError}
              required
            />
          </View>
          
          <Text style={styles.inputLabel}>Property Type</Text>
          <View style={styles.propertyTypesContainer}>
            {propertyTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.propertyTypeItem,
                  propertyType === type.value && styles.propertyTypeItemActive
                ]}
                onPress={() => setPropertyType(type.value)}
              >
                <Home 
                  size={16} 
                  color={propertyType === type.value ? Colors.primary.main : Colors.neutral.gray} 
                />
                <Text 
                  style={[
                    styles.propertyTypeText,
                    propertyType === type.value && styles.propertyTypeTextActive
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Landlord Contact Details</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              These details are required for verification purposes and will only be shown to users who unlock the property.
            </Text>
          </View>
          
          <Input
            label="Landlord Name"
            placeholder="Full name of property owner"
            value={landlordName}
            onChangeText={(text) => {
              setLandlordName(text);
              if (text.trim()) setLandlordNameError('');
            }}
            leftIcon={<User size={18} color={Colors.neutral.gray} />}
            error={landlordNameError}
            required
          />
          
          <Input
            label="Landlord Phone"
            placeholder="e.g. +2348012345678"
            value={landlordPhone}
            onChangeText={(text) => {
              setLandlordPhone(text);
              if (text.trim()) setLandlordPhoneError('');
            }}
            keyboardType="phone-pad"
            leftIcon={<Phone size={18} color={Colors.neutral.gray} />}
            error={landlordPhoneError}
            required
          />
          
          <Input
            label="Landlord Email"
            placeholder="e.g. landlord@example.com"
            value={landlordEmail}
            onChangeText={(text) => {
              setLandlordEmail(text);
              if (text.trim()) setLandlordEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color={Colors.neutral.gray} />}
            error={landlordEmailError}
            required
          />
          
          <Text style={styles.sectionTitle}>Amenities</Text>
          
          <View style={styles.amenitiesContainer}>
            {amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Text style={styles.amenityText}>{amenity}</Text>
                <TouchableOpacity onPress={() => removeAmenity(index)}>
                  <X size={16} color={Colors.neutral.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <View style={styles.addAmenityContainer}>
            <Input
              placeholder="e.g. Swimming Pool"
              value={newAmenity}
              onChangeText={setNewAmenity}
              containerStyle={styles.amenityInput}
            />
            <Button 
              title="Add" 
              onPress={addAmenity} 
              size="small"
              disabled={newAmenity.trim() === ''}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Images</Text>
          
          {imagesError ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={Colors.status.error} />
              <Text style={styles.errorText}>{imagesError}</Text>
            </View>
          ) : null}
          
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageItem}>
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  contentFit="cover"
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color={Colors.neutral.white} />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addImageButton}
              onPress={pickImage}
            >
              <Camera size={24} color={Colors.neutral.gray} />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.submitContainer}>
            <Button
              title="Submit Property"
              onPress={handleSubmit}
              fullWidth
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Import AlertCircle icon
import { AlertCircle } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 24,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  currencyIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral.gray,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  propertyTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  propertyTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral.lightGray,
    gap: 6,
  },
  propertyTypeItemActive: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '10',
  },
  propertyTypeText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  propertyTypeTextActive: {
    color: Colors.primary.main,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: Colors.primary.light + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.main,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  amenityText: {
    fontSize: 14,
    color: Colors.neutral.white,
  },
  addAmenityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 16,
  },
  amenityInput: {
    flex: 1,
    marginBottom: 0,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  imageItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral.lightGray,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: Colors.neutral.gray,
    marginTop: 8,
  },
  submitContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    color: Colors.status.error,
    flex: 1,
  },
});
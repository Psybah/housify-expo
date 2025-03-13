import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Pressable
} from 'react-native';
import { Filter, X, Check, Home, MapPin, Bed, DollarSign, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from './Button';
import { Input } from './Input';

type FilterOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  onApplyFilters: (filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    verified?: boolean;
  }) => void;
};

export const FilterBar = ({ onApplyFilters }: FilterBarProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Filter state
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  
  const locationOptions: FilterOption[] = [
    { label: 'Downtown', value: 'Downtown' },
    { label: 'Westside', value: 'Westside' },
    { label: 'Suburbs', value: 'Suburbs' },
    { label: 'Eastside', value: 'Eastside' },
    { label: 'Northside', value: 'Northside' },
  ];
  
  const bedroomOptions: FilterOption[] = [
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' },
  ];
  
  const handleApplyFilters = () => {
    const filters: {
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      verified?: boolean;
    } = {};
    
    if (location) filters.location = location;
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    if (bedrooms) filters.bedrooms = parseInt(bedrooms);
    if (verified !== undefined) filters.verified = verified;
    
    // Update active filters for display
    const newActiveFilters: string[] = [];
    if (location) newActiveFilters.push(`Location: ${location}`);
    if (minPrice || maxPrice) {
      const priceFilter = `Price: ${minPrice || '0'} - ${maxPrice || 'Any'}`;
      newActiveFilters.push(priceFilter);
    }
    if (bedrooms) newActiveFilters.push(`Bedrooms: ${bedrooms}+`);
    if (verified !== undefined) newActiveFilters.push(`${verified ? 'Verified' : 'Unverified'}`);
    
    setActiveFilters(newActiveFilters);
    onApplyFilters(filters);
    setModalVisible(false);
  };
  
  const handleResetFilters = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setVerified(undefined);
    setActiveFilters([]);
    onApplyFilters({});
  };
  
  const renderFilterChips = () => {
    if (activeFilters.length === 0) {
      return (
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setModalVisible(true)}
        >
          <Filter size={16} color={colors.text} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {activeFilters.map((filter, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{filter}</Text>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleResetFilters}
        >
          <X size={14} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setModalVisible(true)}
        >
          <Filter size={16} color={colors.text} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  
  return (
    <View style={styles.container}>
      {renderFilterChips()}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.optionsContainer}>
                {locationOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      location === option.value && styles.optionButtonActive
                    ]}
                    onPress={() => setLocation(option.value)}
                  >
                    <MapPin 
                      size={16} 
                      color={location === option.value ? colors.text : colors.textSecondary} 
                    />
                    <Text 
                      style={[
                        styles.optionText,
                        location === option.value && styles.optionTextActive
                      ]}
                    >
                      {option.label}
                    </Text>
                    {location === option.value && (
                      <Check size={16} color={colors.text} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceContainer}>
                <Input
                  placeholder="Min Price"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                  style={styles.priceInput}
                  icon={<DollarSign size={16} color={colors.textSecondary} />}
                />
                <Text style={styles.priceSeparator}>-</Text>
                <Input
                  placeholder="Max Price"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                  style={styles.priceInput}
                  icon={<DollarSign size={16} color={colors.textSecondary} />}
                />
              </View>
              
              <Text style={styles.sectionTitle}>Bedrooms</Text>
              <View style={styles.optionsContainer}>
                {bedroomOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      bedrooms === option.value && styles.optionButtonActive
                    ]}
                    onPress={() => setBedrooms(option.value)}
                  >
                    <Bed 
                      size={16} 
                      color={bedrooms === option.value ? colors.text : colors.textSecondary} 
                    />
                    <Text 
                      style={[
                        styles.optionText,
                        bedrooms === option.value && styles.optionTextActive
                      ]}
                    >
                      {option.label}
                    </Text>
                    {bedrooms === option.value && (
                      <Check size={16} color={colors.text} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.sectionTitle}>Verification Status</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    verified === true && styles.optionButtonActive
                  ]}
                  onPress={() => setVerified(true)}
                >
                  <CheckCircle 
                    size={16} 
                    color={verified === true ? colors.text : colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.optionText,
                      verified === true && styles.optionTextActive
                    ]}
                  >
                    Verified
                  </Text>
                  {verified === true && (
                    <Check size={16} color={colors.text} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    verified === false && styles.optionButtonActive
                  ]}
                  onPress={() => setVerified(false)}
                >
                  <Home 
                    size={16} 
                    color={verified === false ? colors.text : colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.optionText,
                      verified === false && styles.optionTextActive
                    ]}
                  >
                    Unverified
                  </Text>
                  {verified === false && (
                    <Check size={16} color={colors.text} />
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                title="Reset"
                onPress={handleResetFilters}
                variant="outline"
                style={styles.resetFilterButton}
              />
              <Button
                title="Apply Filters"
                onPress={handleApplyFilters}
                style={styles.applyButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    color: colors.text,
    fontSize: 12,
  },
  resetButton: {
    backgroundColor: colors.error,
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  filterButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 6,
    marginRight: 6,
  },
  optionTextActive: {
    color: colors.text,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    color: colors.text,
    marginHorizontal: 8,
    fontSize: 16,
  },
  resetFilterButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 2,
  },
});
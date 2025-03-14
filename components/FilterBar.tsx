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
import { SlidersHorizontal, X, Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { PropertyType } from '@/types/property';
import { Button } from './Button';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  onFilter: (filters: any) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  onFilter,
  onClearFilters
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<PropertyType[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const propertyTypes: FilterOption[] = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Duplex', value: 'duplex' },
    { label: 'Bungalow', value: 'bungalow' },
    { label: 'Self-contained', value: 'self-contained' },
  ];
  
  const bedroomOptions: FilterOption[] = [
    { label: 'Any', value: '0' },
    { label: '1+', value: '1' },
    { label: '2+', value: '2' },
    { label: '3+', value: '3' },
    { label: '4+', value: '4' },
  ];
  
  const priceRanges: FilterOption[] = [
    { label: 'Any', value: '0-100000000' },
    { label: 'Under ₦500k', value: '0-500000' },
    { label: '₦500k - ₦1M', value: '500000-1000000' },
    { label: '₦1M - ₦2M', value: '1000000-2000000' },
    { label: '₦2M - ₦5M', value: '2000000-5000000' },
    { label: 'Above ₦5M', value: '5000000-100000000' },
  ];
  
  const togglePropertyType = (type: PropertyType) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };
  
  const handleApplyFilters = () => {
    const priceRangeParts = selectedPriceRange ? selectedPriceRange.split('-') : ['0', '100000000'];
    
    const filters = {
      propertyType: selectedPropertyTypes.length > 0 ? selectedPropertyTypes : undefined,
      bedrooms: selectedBedrooms !== null && selectedBedrooms > 0 ? selectedBedrooms : undefined,
      priceRange: {
        min: parseInt(priceRangeParts[0]),
        max: parseInt(priceRangeParts[1])
      },
      verified: verifiedOnly ? true : undefined
    };
    
    onFilter(filters);
    setModalVisible(false);
  };
  
  const handleClearFilters = () => {
    setSelectedPropertyTypes([]);
    setSelectedBedrooms(null);
    setSelectedPriceRange(null);
    setVerifiedOnly(false);
    onClearFilters();
    setModalVisible(false);
  };
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedPropertyTypes.length > 0) count++;
    if (selectedBedrooms !== null) count++;
    if (selectedPriceRange !== null && selectedPriceRange !== '0-100000000') count++;
    if (verifiedOnly) count++;
    return count;
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setModalVisible(true)}
        >
          <SlidersHorizontal size={16} color={Colors.primary.main} />
          <Text style={styles.filterButtonText}>Filters</Text>
          {getActiveFilterCount() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersContainer}
        >
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.quickFilterItem,
                selectedPropertyTypes.includes(type.value as PropertyType) && styles.quickFilterItemActive
              ]}
              onPress={() => togglePropertyType(type.value as PropertyType)}
            >
              <Text 
                style={[
                  styles.quickFilterText,
                  selectedPropertyTypes.includes(type.value as PropertyType) && styles.quickFilterTextActive
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
      
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
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Property Type</Text>
                <View style={styles.optionsGrid}>
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.optionItem,
                        selectedPropertyTypes.includes(type.value as PropertyType) && styles.optionItemActive
                      ]}
                      onPress={() => togglePropertyType(type.value as PropertyType)}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          selectedPropertyTypes.includes(type.value as PropertyType) && styles.optionTextActive
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Bedrooms</Text>
                <View style={styles.optionsRow}>
                  {bedroomOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionItem,
                        selectedBedrooms === parseInt(option.value) && styles.optionItemActive
                      ]}
                      onPress={() => setSelectedBedrooms(parseInt(option.value))}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          selectedBedrooms === parseInt(option.value) && styles.optionTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.optionsColumn}>
                  {priceRanges.map((range) => (
                    <TouchableOpacity
                      key={range.value}
                      style={[
                        styles.optionItemFull,
                        selectedPriceRange === range.value && styles.optionItemActive
                      ]}
                      onPress={() => setSelectedPriceRange(range.value)}
                    >
                      <Text 
                        style={[
                          styles.optionText,
                          selectedPriceRange === range.value && styles.optionTextActive
                        ]}
                      >
                        {range.label}
                      </Text>
                      {selectedPriceRange === range.value && (
                        <Check size={16} color={Colors.primary.main} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Other Filters</Text>
                <TouchableOpacity
                  style={[
                    styles.optionItemFull,
                    verifiedOnly && styles.optionItemActive
                  ]}
                  onPress={() => setVerifiedOnly(!verifiedOnly)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      verifiedOnly && styles.optionTextActive
                    ]}
                  >
                    Verified Properties Only
                  </Text>
                  {verifiedOnly && (
                    <Check size={16} color={Colors.primary.main} />
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button 
                title="Clear All" 
                onPress={handleClearFilters} 
                variant="outline"
                style={styles.footerButton}
              />
              <Button 
                title="Apply Filters" 
                onPress={handleApplyFilters}
                style={styles.footerButton}
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
    backgroundColor: Colors.background.card,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightGray,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.main,
  },
  badge: {
    backgroundColor: Colors.primary.main,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.neutral.white,
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral.lightGray,
    marginHorizontal: 12,
  },
  quickFiltersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  quickFilterItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.neutral.offWhite,
  },
  quickFilterItemActive: {
    backgroundColor: Colors.primary.light,
  },
  quickFilterText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  quickFilterTextActive: {
    color: Colors.neutral.white,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modalBody: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionsColumn: {
    gap: 8,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral.lightGray,
    backgroundColor: Colors.background.card,
  },
  optionItemFull: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral.lightGray,
    backgroundColor: Colors.background.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionItemActive: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light + '10',
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  optionTextActive: {
    color: Colors.primary.main,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.lightGray,
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});
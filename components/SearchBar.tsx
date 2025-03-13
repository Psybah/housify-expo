import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type SearchBarProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
};

export const SearchBar = ({ placeholder, value, onChangeText, onFilterPress }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Search size={20} color={colors.textSecondary} />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Filter size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    height: '100%',
  },
  filterButton: {
    padding: 8,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Coins } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type PointsBadgeProps = {
  amount: number;
  size?: 'small' | 'medium' | 'large';
};

export const PointsBadge = ({ amount, size = 'medium' }: PointsBadgeProps) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          text: styles.smallText,
          icon: 14,
        };
      case 'medium':
        return {
          container: styles.mediumContainer,
          text: styles.mediumText,
          icon: 16,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          text: styles.largeText,
          icon: 20,
        };
      default:
        return {
          container: styles.mediumContainer,
          text: styles.mediumText,
          icon: 16,
        };
    }
  };
  
  const sizeStyle = getSizeStyle();
  
  return (
    <View style={[styles.container, sizeStyle.container, { backgroundColor: colors.housePoints }]}>
      <Coins size={sizeStyle.icon} color={colors.iconLight} />
      <Text style={[styles.text, sizeStyle.text]}>
        {amount} HP
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  smallContainer: {
    paddingVertical: 4,
  },
  mediumContainer: {
    paddingVertical: 6,
  },
  largeContainer: {
    paddingVertical: 8,
  },
  text: {
    color: colors.iconLight,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});
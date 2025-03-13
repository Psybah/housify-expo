import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Coins } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type PointsBadgeProps = {
  type: 'free' | 'paid';
  amount: number;
  size?: 'small' | 'medium' | 'large';
};

export const PointsBadge = ({ type, amount, size = 'medium' }: PointsBadgeProps) => {
  const badgeColor = type === 'free' ? colors.fPoints : colors.pPoints;
  
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
    <View style={[styles.container, sizeStyle.container, { backgroundColor: badgeColor }]}>
      <Coins size={sizeStyle.icon} color={colors.text} />
      <Text style={[styles.text, sizeStyle.text]}>
        {amount} {type === 'free' ? 'F-Points' : 'P-Points'}
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
    color: colors.text,
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
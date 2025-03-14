import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coins } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface PointsCardProps {
  points: number;
  onBuyPoints: () => void;
}

export const PointsCard: React.FC<PointsCardProps> = ({
  points,
  onBuyPoints
}) => {
  // Ensure points is a number
  const pointsValue = typeof points === 'object' && points !== null 
    ? (points.hp || 0) // If it's an object with hp property, use that
    : (typeof points === 'number' ? points : 0); // Otherwise use the number or default to 0
    
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#022B60', '#0A3D7A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Points</Text>
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={onBuyPoints}
          >
            <Text style={styles.buyButtonText}>Buy Points</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.pointsContainer}>
          <View style={styles.pointsItem}>
            <View style={styles.pointsIconContainer}>
              <Coins size={20} color={Colors.neutral.white} />
            </View>
            <View>
              <Text style={styles.pointsValue}>{pointsValue}</Text>
              <Text style={styles.pointsLabel}>Housify Points (HP)</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.infoText}>
          Use points to unlock verified property contact details
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  buyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buyButtonText: {
    color: Colors.neutral.white,
    fontSize: 12,
    fontWeight: '500',
  },
  pointsContainer: {
    marginBottom: 16,
  },
  pointsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  pointsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});
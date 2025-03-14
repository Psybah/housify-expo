import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Dimensions
} from 'react-native';
import { Coins, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from './Button';

interface PointsEarnedModalProps {
  visible: boolean;
  onClose: () => void;
  points: number;
  reason: string;
}

const { width } = Dimensions.get('window');

export const PointsEarnedModal: React.FC<PointsEarnedModalProps> = ({
  visible,
  onClose,
  points,
  reason
}) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Confetti animation values
  const confettiCount = 30;
  const confettiAnimations = useRef(
    Array(confettiCount).fill(0).map(() => ({
      position: new Animated.Value(0),
      rotation: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
    }))
  ).current;
  
  useEffect(() => {
    if (visible) {
      // Animate modal
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Animate confetti
      confettiAnimations.forEach((anim, i) => {
        const delay = i * 50;
        
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim.position, {
              toValue: 1,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
              easing: Easing.out(Easing.ease),
            }),
            Animated.timing(anim.rotation, {
              toValue: 1,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.delay(800),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start();
      });
    } else {
      // Reset animations when modal is closed
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      confettiAnimations.forEach(anim => {
        anim.position.setValue(0);
        anim.rotation.setValue(0);
        anim.opacity.setValue(0);
      });
    }
  }, [visible]);
  
  // Generate confetti elements
  const renderConfetti = () => {
    return confettiAnimations.map((anim, index) => {
      // Random starting position
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const startY = 100;
      
      // Random ending position
      const endX = startX + (Math.random() * 200 - 100);
      const endY = startY + (Math.random() * 300 + 100);
      
      // Random rotation
      const rotation = anim.rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${Math.random() * 360}deg`],
      });
      
      // Random color
      const colors = [
        Colors.primary.main,
        Colors.primary.light,
        Colors.accent.main,
        Colors.accent.light,
        Colors.status.success,
        Colors.status.info,
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random shape (square or circle)
      const isSquare = Math.random() > 0.5;
      const size = 8 + Math.random() * 8;
      
      const translateX = anim.position.interpolate({
        inputRange: [0, 1],
        outputRange: [startX, endX],
      });
      
      const translateY = anim.position.interpolate({
        inputRange: [0, 1],
        outputRange: [startY, endY],
      });
      
      return (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: isSquare ? 0 : size / 2,
              transform: [
                { translateX },
                { translateY },
                { rotate: rotation },
                { scale: anim.scale },
              ],
              opacity: anim.opacity,
            },
          ]}
        />
      );
    });
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {renderConfetti()}
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={20} color={Colors.neutral.gray} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <Coins size={40} color={Colors.accent.main} />
          </View>
          
          <Text style={styles.title}>Congratulations!</Text>
          
          <Text style={styles.pointsText}>
            <Text style={styles.pointsValue}>+{points} </Text>
            <Text>Points Earned</Text>
          </Text>
          
          <Text style={styles.message}>
            You've earned {points} Housify Points for {reason}.
          </Text>
          
          <Button
            title="Awesome!"
            onPress={onClose}
            style={styles.button}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  pointsValue: {
    fontWeight: '700',
    color: Colors.accent.main,
  },
  message: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
  confetti: {
    position: 'absolute',
  },
});
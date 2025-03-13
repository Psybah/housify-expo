import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Modal,
  Dimensions
} from 'react-native';
import { colors } from '@/constants/colors';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  visible, 
  message = 'Loading...', 
  transparent = true 
}) => {
  if (!visible) return null;
  
  return (
    <Modal
      transparent={transparent}
      animationType="fade"
      visible={visible}
    >
      <View style={[
        styles.container,
        transparent ? styles.transparentBackground : styles.solidBackground
      ]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  transparentBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  solidBackground: {
    backgroundColor: colors.background,
  },
  loadingBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 150,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
}); 
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  style,
  textStyle,
  disabled = false,
  ...rest
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...(fullWidth && styles.fullWidth),
      ...(disabled && styles.disabled),
    };

    switch (size) {
      case 'small':
        return { ...baseStyle, ...styles.smallButton };
      case 'large':
        return { ...baseStyle, ...styles.largeButton };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
    };

    switch (size) {
      case 'small':
        return { ...baseStyle, ...styles.smallText };
      case 'large':
        return { ...baseStyle, ...styles.largeText };
      default:
        return baseStyle;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' 
            ? Colors.primary.main 
            : Colors.neutral.white} 
          size="small" 
        />
      );
    }

    return (
      <>
        {icon && icon}
        <Text 
          style={[
            getTextStyles(),
            variant === 'outline' && styles.outlineText,
            variant === 'ghost' && styles.ghostText,
            variant === 'secondary' && styles.secondaryText,
            textStyle
          ]}
        >
          {title}
        </Text>
      </>
    );
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyles(), style]}
        activeOpacity={0.8}
        {...rest}
      >
        <LinearGradient
          colors={Colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyles(), styles.secondaryButton, style]}
        activeOpacity={0.8}
        {...rest}
      >
        <LinearGradient
          colors={Colors.gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getButtonStyles(),
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        style
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    overflow: 'hidden',
    minHeight: 56, // Increased minimum height for better touch targets
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44, // Increased minimum height for better touch targets
  },
  largeButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    minHeight: 64, // Increased minimum height for better touch targets
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    backgroundColor: Colors.accent.main,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  text: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  outlineText: {
    color: Colors.primary.main,
  },
  ghostText: {
    color: Colors.primary.main,
  },
  secondaryText: {
    color: Colors.neutral.white,
  },
});
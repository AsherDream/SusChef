import React from 'react';
import { Pressable, Text, View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  size?: 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  isLoading = false,
}) => {
  const styles = StyleSheet.create({
    // Size variants
    mdButton: {
      paddingVertical: layout.spacing.sm,
      paddingHorizontal: layout.spacing.lg,
    },
    lgButton: {
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.lg,
    },
    // Base styles
    baseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: layout.spacing.sm,
      borderRadius: layout.radius.full,
    },
    // Variant styles
    primaryButton: {
      backgroundColor: colors.primary,
    },
    dangerButton: {
      backgroundColor: colors.status.error,
    },
    ghostButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    // Text styles
    primaryText: {
      color: colors.surface,
      fontSize: typography.size.body,
      fontWeight: '700' as const,
    },
    dangerText: {
      color: colors.surface,
      fontSize: typography.size.body,
      fontWeight: '700' as const,
    },
    ghostText: {
      color: colors.primary,
      fontSize: typography.size.body,
      fontWeight: '700' as const,
    },
    // Shadow for primary and danger
    shadowStyle: {
      ...(Platform.OS === 'ios'
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
          }
        : {
            elevation: 4,
          }),
    },
    // Pressed state
    pressedButton: {
      opacity: 0.8,
    },
  });

  const getVariantStyle = () => {
    switch (variant) {
      case 'danger':
        return [styles.dangerButton, styles.shadowStyle];
      case 'ghost':
        return styles.ghostButton;
      case 'primary':
      default:
        return [styles.primaryButton, styles.shadowStyle];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'danger':
        return styles.dangerText;
      case 'ghost':
        return styles.ghostText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    return size === 'md' ? styles.mdButton : styles.lgButton;
  };

  const textColor = variant === 'ghost' ? colors.primary : colors.surface;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.baseButton,
        getVariantStyle(),
        getSizeStyle(),
        pressed && !isLoading && styles.pressedButton,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text style={getTextStyle()}>{text}</Text>
        </>
      )}
    </Pressable>
  );
};

export default Button;

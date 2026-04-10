import React from 'react';
import { Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Chrome, Facebook, Apple, Github, Twitter } from 'lucide-react-native';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';

interface SocialButtonProps {
  title: string;
  onPress: () => void;
  iconName?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  onPress,
  iconName = 'google',
}) => {
  // Map icon names to lucide icons
  const getIcon = (name: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      google: Chrome,
      facebook: Facebook,
      apple: Apple,
      github: Github,
      twitter: Twitter,
    };
    return iconMap[name.toLowerCase()] || Chrome;
  };

  const IconComponent = getIcon(iconName);

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: layout.radius.full,
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.md,
      gap: layout.spacing.sm,
      // Platform-specific shadows
      ...(Platform.OS === 'ios'
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }
        : {
            elevation: 3,
          }),
    },
    buttonPressed: {
      opacity: 0.7,
    },
    text: {
      color: colors.text.primary,
      fontSize: typography.size.body,
      fontWeight: '500' as const,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <IconComponent size={layout.icon.md} color={colors.text.primary} strokeWidth={2} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export default SocialButton;

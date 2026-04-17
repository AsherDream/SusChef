import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { Eye, EyeOff, Search, Mail, Lock, User, Plus } from 'lucide-react-native';
import { layout, typography } from '../core/theme/typography';
import { useThemeColors } from '../core/theme/theme';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  iconName?: string;
  onIconPress?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  iconName,
  onIconPress,
}) => {
  const colors = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  // Map icon names to lucide icons
  const getIcon = (name: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      eye: Eye,
      eyeOff: EyeOff,
      search: Search,
      mail: Mail,
      lock: Lock,
      user: User,
      plus: Plus,
    };
    return iconMap[name.toLowerCase()] || null;
  };

  const IconComponent = iconName ? getIcon(iconName) : null;

  const styles = StyleSheet.create({
    container: {
      marginBottom: layout.spacing.lg,
    },
    label: {
      fontSize: typography.size.caption,
      color: colors.text.secondary,
      marginBottom: layout.spacing.sm,
      fontWeight: '500' as const,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: isFocused ? colors.primary : colors.border,
      borderRadius: layout.radius.md,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.md,
      gap: layout.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: typography.size.body,
      color: colors.text.primary,
      padding: 0,
    },
    iconButton: {
      padding: layout.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {IconComponent && (
          <Pressable style={styles.iconButton} onPress={onIconPress} disabled={!onIconPress}>
            <IconComponent size={layout.icon.md} color={colors.text.secondary} strokeWidth={2} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default InputField;

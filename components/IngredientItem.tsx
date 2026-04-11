import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '../core/theme/theme';
import { layout, typography } from '../core/theme/typography';

interface IngredientItemProps {
  name: string;
  checked?: boolean;
  onPress?: () => void;
}

export const IngredientItem: React.FC<IngredientItemProps> = ({
  name,
  checked = false,
  onPress,
}) => {
  const colors = useThemeColors();
  const [isPressed, setIsPressed] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.md,
      borderRadius: layout.radius.md,
      marginBottom: layout.spacing.sm,
      backgroundColor: isPressed || checked ? colors.primary + '1A' : colors.surface,
      borderWidth: 1,
      borderColor: isPressed || checked ? colors.primary : colors.border,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: checked ? colors.primary : colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: layout.spacing.md,
      borderWidth: checked ? 0 : 1,
      borderColor: colors.border,
    },
    text: {
      fontSize: typography.size.body,
      color: colors.text.primary,
      flex: 1,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={styles.container}
    >
      <View style={styles.checkbox}>
        {checked && <Check size={14} color={colors.surface} strokeWidth={3} />}
      </View>
      <Text style={styles.text}>{name}</Text>
    </Pressable>
  );
};

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BaseRow } from './BaseRow';
import { colors } from '../core/theme/colors';
import { layout, typography } from '../core/theme/typography';

interface ToolRowProps {
  label: string;
  icon?: React.ReactNode;
  onToggle?: (isChecked: boolean) => void;
  initialChecked?: boolean;
}

export const ToolRow: React.FC<ToolRowProps> = ({
  label,
  icon,
  onToggle,
  initialChecked = false,
}) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onToggle?.(newState);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: layout.spacing.md,
    },
    label: {
      fontSize: typography.size.body,
      color: colors.text.primary,
      fontWeight: '500' as const,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: layout.radius.sm,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isChecked ? colors.primary : 'transparent',
      borderColor: isChecked ? colors.primary : colors.border,
    },
    checkmark: {
      fontSize: 14,
      color: colors.surface,
      fontWeight: 'bold',
    },
  });

  const rightContent = (
    <View style={styles.checkbox}>{isChecked && <Text style={styles.checkmark}>✓</Text>}</View>
  );

  return (
    <Pressable onPress={handleToggle}>
      <BaseRow
        leftIcon={icon}
        label={<Text style={styles.label}>{label}</Text>}
        rightContent={rightContent}
        style={styles.container}
      />
    </Pressable>
  );
};

export default ToolRow;

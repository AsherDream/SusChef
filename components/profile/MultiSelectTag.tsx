import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';

interface MultiSelectTagProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export function MultiSelectTag({ label, isSelected, onPress }: MultiSelectTagProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tag,
        isSelected ? styles.tagSelected : styles.tagDefault,
        pressed && styles.tagPressed,
      ]}
    >
      <Text style={[styles.text, isSelected ? styles.textSelected : styles.textDefault]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.radius.full,
    marginRight: layout.spacing.sm,
    marginBottom: layout.spacing.sm,
  },
  tagDefault: {
    backgroundColor: '#F3F4F6',
  },
  tagSelected: {
    backgroundColor: colors.primary,
  },
  tagPressed: {
    opacity: 0.9,
  },
  text: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium as any,
  },
  textDefault: {
    color: colors.text.primary,
  },
  textSelected: {
    color: colors.surface,
  },
});

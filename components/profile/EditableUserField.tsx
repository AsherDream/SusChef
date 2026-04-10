import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TextInputProps } from 'react-native';
import { Edit3 } from 'lucide-react-native';
import { layout, typography } from '../../core/theme/typography';
import { useThemeColors } from '../../core/theme/theme';

interface EditableUserFieldProps extends TextInputProps {
  label: string;
}

export function EditableUserField({
  label,
  value,
  onChangeText,
  ...props
}: EditableUserFieldProps) {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: focused ? colors.primary : colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, { color: colors.text.primary }]}
          placeholderTextColor={colors.text.secondary}
          {...props}
        />
        {focused && (
          <Pressable onPress={() => inputRef.current?.focus()} hitSlop={8}>
            <Edit3 size={18} color={colors.text.secondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.spacing.xs,
  },
  label: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium as any,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: layout.radius.md,
    paddingHorizontal: layout.spacing.md,
    minHeight: 48,
    gap: layout.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.size.body,
  },
});
